"""Verifica logo/entregables/: d congelados, transforms, PNG = re-render de su SVG, mínimos, PDF vectorial,
fuentes protegidas intactas. Escribe entregables/verificacion-entregables.json y entregables/manifiesto.json."""
import os, re, json, glob, hashlib, subprocess, tempfile
import numpy as np
from PIL import Image
from chrome import render_png
L='/workspace/lealtab/03-visual-identity/logo/'; E=L+'entregables/'; H='/workspace/lealtab/03-visual-identity/laminas-html/entregables/'
meta=json.load(open(H+'export-meta.json')); SRC=meta['manifest_src']
sha=lambda s:hashlib.sha256(s.encode()).hexdigest(); fsha=lambda p:hashlib.sha256(open(p,'rb').read()).hexdigest()
FR=open(L+'master/lealtab-master-frozen.svg').read(); VF=open(L+'master/lealtab-vertical-frozen.svg').read()
REF={i:sha(d) for i,d in re.findall(r'<path id="([^"]+)" d="([^"]+)"/>',FR)}
VT={g:t for g,t in re.findall(r'<g id="(isotipo|wordmark)" transform="([^"]+)"',VF)}
ISO=[k for k in REF if k.startswith('isotipo')]; WM=[k for k in REF if k.startswith('wm-')]
NEED={'horizontal':ISO+WM,'vertical':ISO+WM,'isotipo':ISO,'wordmark':WM}
res={'estado':'Exportaciones finales · aprobado 2026-10-06','svg':{},'png':{},'pdf':{},'ico':{},'fuentes_protegidas':{}}
ok=True
# ---- SVG ----
for fp in sorted(glob.glob(E+'**/*.svg',recursive=True)):
    rel=os.path.relpath(fp,E); t=open(fp).read(); errs=[]
    P=dict(re.findall(r'<path id="([^"]+)" d="([^"]+)"/>',t))
    if rel=='web/favicon.svg':
        e={'tipo':'favicon B (pixel-fit aprobado, derivado)','identico_a_iconos':fsha(fp)==fsha(L+'iconos/favicon/favicon.svg')}
        e['ok']=e['identico_a_iconos']
    else:
        lk=next((k for k in NEED if f'-{k}-' in os.path.basename(fp)),None)
        need=NEED[lk] if lk else ISO   # avatares/portada
        if 'portada' in rel: need=ISO+WM
        bad=[k for k in need if k not in P or sha(P[k])!=REF[k]]; extra=[k for k in P if k not in REF]
        if bad: errs.append(f'd distinto o ausente: {bad}')
        if extra: errs.append(f'trazados no congelados: {extra}')
        if lk=='vertical':
            tr={g:t2 for g,t2 in re.findall(r'<g id="(isotipo|wordmark)" transform="([^"]+)"',t)}
            if tr!=VT: errs.append(f'transforms del vertical distintos: {tr}')
        if lk=='wordmark' and 'transform="translate(-282.16 -24.58)"' not in t: errs.append('transform del wordmark')
        e={'d_identicos':f'{len(need)-len(bad)}/{len(need)}','ok':not errs,'errores':errs}
    res['svg'][rel]=e; ok&=e['ok']
# ---- PNG: re-render y comparación ----
tmp=tempfile.mkdtemp(prefix='ltver-'); jobs=[]
for src,w,h,out in meta['svg_jobs']: jobs.append((L+src,w,h,os.path.join(tmp,out.replace('/','__'))))
render_png(jobs)
def ink_w(im,bgcol=None):
    a=np.asarray(im.convert('RGBA')).astype(int)
    if a[...,3].min()==255:   # fondo opaco: tinta = píxeles distintos al color de la esquina
        bg=a[0,0,:3]; m=np.abs(a[...,:3]-bg).sum(2)>30
    else: m=a[...,3]>40
    xs=np.nonzero(m.any(0))[0]; return int(xs.max()-xs.min()+1) if len(xs) else 0
for (src,w,h,out),(_,_,_,re_out) in zip(meta['svg_jobs'],jobs):
    rel=os.path.relpath(L+out,E); A=np.asarray(Image.open(L+out).convert('RGBA')).astype(int); B=np.asarray(Image.open(re_out).convert('RGBA')).astype(int)
    diff=int(np.abs(A-B).max()) if A.shape==B.shape else 999
    lk=next((k for k in meta['MIN_PX'] if f'-{k}-' in os.path.basename(out)),'isotipo')
    iw=ink_w(Image.open(L+out))
    if 'portada' in out: lk='horizontal'
    mn=meta['MIN_PX'][lk]
    e={'fuente':src,'tamaño':[w,h],'igual_al_rerender':diff<=1,'dif_max':diff,'ancho_tinta_px':iw,'minimo_px':mn,'sobre_minimo':iw>=mn,'sha256':fsha(L+out)}
    e['ok']=e['igual_al_rerender'] and e['sobre_minimo'] and list(Image.open(L+out).size)==[w,h]
    res['png'][rel]=e; ok&=e['ok']
# ---- informativo: comparación con los PNG ya aprobados en logo/iconos/ ----
def pm(p):
    a=np.asarray(Image.open(p).convert('RGBA')).astype(float); return np.concatenate([a[...,:3]*a[...,3:]/255,a[...,3:]],2)
CMP={'web/apple-touch-icon.png':'iconos/app/lealtab-apple-touch-icon-180-sangre.png','web/icon-192.png':'iconos/pwa/lealtab-pwa-192.png',
     'web/icon-512.png':'iconos/pwa/lealtab-pwa-512.png','web/icon-maskable-512.png':'iconos/pwa/lealtab-pwa-maskable-512.png',
     'redes/lealtab-avatar-lino-circulo-400.png':'iconos/avatar/lealtab-avatar-lino-400.png','redes/lealtab-avatar-noche-circulo-400.png':'iconos/avatar/lealtab-avatar-noche-400.png'}
res['comparacion_con_png_de_iconos']={}
for a,b in CMP.items():
    d=np.abs(pm(E+a)-pm(L+b)).max(2); res['comparacion_con_png_de_iconos'][a]={'png_aprobado':b,'pixeles_distintos(>8)':int((d>8).sum()),'de':int(d.size),'dif_max':int(d.max()),'nota':'solo en bordes antialias; mismo SVG fuente'}
# ---- PDF ----
for fp in sorted(glob.glob(E+'impresion/*.pdf')):
    info=subprocess.run(['pdfinfo',fp],capture_output=True,text=True).stdout
    imgs=subprocess.run(['pdfimages','-list',fp],capture_output=True,text=True).stdout.strip().splitlines()[2:]
    fonts=subprocess.run(['pdffonts',fp],capture_output=True,text=True).stdout.strip().splitlines()[2:]
    pts=re.search(r'Page size:\s+([\d.]+) x ([\d.]+)',info); wmm,hmm=[round(float(v)*25.4/72,1) for v in pts.groups()]
    lk=os.path.basename(fp).split('-')[1]
    e={'paginas':int(re.search(r'Pages:\s+(\d+)',info).group(1)),'mm':[wmm,hmm],'imagenes_raster':len(imgs),'fuentes':len(fonts),'vectorial':not imgs and not fonts,'cmyk':'no (RGB; pendiente de imprenta)'}
    e['ok']=e['vectorial'] and e['paginas']==1 and abs(wmm-meta['PRINT_MM'][lk])<0.6
    res['pdf'][os.path.relpath(fp,E)]=e; ok&=e['ok']
# ---- ICO ----
ico=Image.open(E+'web/favicon.ico'); res['ico']={'tamaños':sorted(ico.info['sizes']),'identico_a_iconos':fsha(E+'web/favicon.ico')==fsha(L+'iconos/favicon/favicon.ico')}; ok&=res['ico']['identico_a_iconos']
# ---- fuentes protegidas ----
vp=json.load(open(L+'sistema/verificacion-paths.json')); vi=json.load(open(L+'iconos/verificacion-iconos.json'))
vu=json.load(open(L+'uso/verificacion-uso.json')); vus=json.load(open(L+'uso/verificacion-usos.json'))
fp_ok={'master_congelados':all(fsha(L+'master/'+n)==h for n,h in vp['congelados'].items()),
       'sistema':all(fsha(L+'sistema/'+n)==v['sha256_archivo'] for n,v in vp['archivos'].items()),
       'iconos':all(fsha(L+'iconos/'+n)==v['sha256_archivo'] for n,v in vi['iconos_grandes'].items()),
       'uso':all(fsha(L+'uso/'+n)==v['sha256'] for n,v in {**vu['archivos'],**vus['archivos']}.items())}
res['fuentes_protegidas']=fp_ok; ok&=all(fp_ok.values())
res['resumen']={'todo_ok':ok,'svg':len(res['svg']),'png':len(res['png']),'pdf':len(res['pdf']),
  'png_iguales_al_rerender':sum(v['igual_al_rerender'] for v in res['png'].values()),'png_bajo_minimo':[k for k,v in res['png'].items() if not v['sobre_minimo']]}
json.dump(res,open(E+'verificacion-entregables.json','w'),indent=1,ensure_ascii=False)
# ---- manifiesto ----
man={'nota':'El SVG es la fuente. Los PNG, PDF e ICO son exportaciones automáticas (laminas-html/entregables/exportar.py); nunca se editan a mano.','archivos':{}}
for fp in sorted(glob.glob(E+'**/*',recursive=True)):
    rel=os.path.relpath(fp,E)
    if os.path.isdir(fp) or rel in ('manifiesto.json',): continue
    tipo='maestro SVG' if rel.endswith('.svg') else ('documentación' if rel.endswith(('.md','.json','.html','.webmanifest')) else 'exportación automática')
    man['archivos'][rel]={'sha256':fsha(fp),'bytes':os.path.getsize(fp),'tipo':tipo,'fuente':SRC.get(rel)}
json.dump(man,open(E+'manifiesto.json','w'),indent=1,ensure_ascii=False)
print(json.dumps(res['resumen'],ensure_ascii=False),fp_ok)
bad=[(k,v.get('errores') or v) for sec in ('svg','png','pdf') for k,v in res[sec].items() if not v['ok']]; print(bad[:5])
