"""Verificación de logo/iconos/. Escribe iconos/verificacion-iconos.json.
- Íconos grandes y lámina: cada <path> de #isotipo debe tener un d idéntico (sha256) al congelado.
- Pixel-fit y favicons: deben estar marcados como DERIVADOS y NO usar los d congelados."""
import glob, hashlib, json, os, xml.etree.ElementTree as ET
from PIL import Image
R='/workspace/lealtab/03-visual-identity/logo/'; I=R+'iconos/'; M=R+'master/'
NS='{http://www.w3.org/2000/svg}'
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()
fsha=lambda p:hashlib.sha256(open(p,'rb').read()).hexdigest()
def iso_paths(fp):
    r=ET.parse(fp).getroot()
    for g in r.iter(NS+'g'):
        if g.get('id')=='isotipo': return {p.get('id'):p.get('d') for p in g.iter(NS+'path')},r
    return None,r
FH,_=iso_paths(M+'lealtab-master-frozen.svg'); FV,_=iso_paths(M+'lealtab-vertical-frozen.svg')
REF={k:sha(v) for k,v in FH.items()}; assert all(sha(FV[k])==REF[k] for k in REF)
prev=json.load(open(R+'sistema/verificacion-paths.json'))
res={'fecha':'2026-10-05','estado':'Íconos digitales · aprobado 2026-10-05',
     'congelados':{n:{'sha256':fsha(M+n),'igual_al_registrado_en_sistema':fsha(M+n)==prev['congelados'][n]} for n in prev['congelados']},
     'd_congelados_sha256':REF,'iconos_grandes':{},'derivados_pixel_fit':{},'png':{},'favicon_ico':{},'maskable':{}}
ok=all(v['igual_al_registrado_en_sistema'] for v in res['congelados'].values())
big=sorted(glob.glob(I+'app/*.svg')+glob.glob(I+'pwa/*.svg')+glob.glob(I+'avatar/*.svg'))+[I+'iconos-digitales.svg']
for fp in big:
    P,root=iso_paths(fp); errs=[]
    if P is None: errs.append('sin grupo #isotipo'); P={}
    det={k:(k in P and sha(P[k])==REF[k]) for k in REF}
    errs+=[f'd distinto o ausente: {k}' for k,v in det.items() if not v]
    otros=[p.get('id') for p in root.iter(NS+'path') if p.get('id') not in REF and fp.endswith('.svg') and not fp.endswith('iconos-digitales.svg')]
    if otros: errs.append(f'paths extra: {otros}')
    res['iconos_grandes'][os.path.relpath(fp,I)]={'paths_identicos':sum(det.values()),'de':len(REF),'ok':not errs,'errores':errs,'viewBox':root.get('viewBox'),'sha256_archivo':fsha(fp)}
    ok&=not errs
for fp in sorted(glob.glob(I+'pixel/*.svg')+glob.glob(I+'favicon/**/favicon.svg',recursive=True)):
    r=ET.parse(fp).getroot(); gs=[g for g in r.iter(NS+'g') if g.get('data-derivado')=='pixel-fit']
    ds={p.get('id'):p.get('d') for p in r.iter(NS+'path')}
    usa_congelado=any(sha(d) in REF.values() for d in ds.values())
    marcado=bool(gs) and 'DERIVADO' in (r.find(NS+'desc').text or '')
    e={'tipo':'DERIVADO (pixel-fit, trazados nuevos)','marcado_como_derivado':marcado,'usa_d_congelado':usa_congelado,
       'grupo':gs[0].get('id') if gs else None,'viewBox':r.get('viewBox'),'d_sha256':{k:sha(v) for k,v in ds.items()},'ok':marcado and not usa_congelado}
    res['derivados_pixel_fit'][os.path.relpath(fp,I)]=e; ok&=e['ok']
for fp in sorted(glob.glob(I+'**/*.png',recursive=True)):
    im=Image.open(fp); res['png'][os.path.relpath(fp,I)]=list(im.size)
EXP={'app/lealtab-app-icon-180.png':[180,180],'pwa/lealtab-pwa-192.png':[192,192],'pwa/lealtab-pwa-512.png':[512,512],'pwa/lealtab-pwa-maskable-512.png':[512,512],
     'avatar/lealtab-avatar-lino-400.png':[400,400],'avatar/lealtab-avatar-noche-400.png':[400,400],'iconos-digitales.png':[1600,1000],
     **{f'pixel/lealtab-isotipo-{n}px.png':[n,n] for n in (16,24,32,48)},**{f'pixel/lealtab-isotipo-{n}px-800.png':[n*8+2,n*8+2] for n in (16,24,32,48)}}
res['png_tamaños_esperados_ok']={k:res['png'].get(k)==v for k,v in EXP.items()}; ok&=all(res['png_tamaños_esperados_ok'].values())
post=json.load(open('/tmp/post-res.json'))
FAV={'b':('oficial (opción B) · favicon/favicon.ico',I+'favicon/favicon.ico'),'a':('DESCARTADA (opción A) · favicon/descartado/opcion-a/favicon.ico',I+'favicon/descartado/opcion-a/favicon.ico')}
for o,(lab,fp) in FAV.items():
    res['favicon_ico'][lab]={**post[f'favicon-{o}.ico'],'sha256':fsha(fp)}
    ok&=all(post[f'favicon-{o}.ico']['frames_identicos_a_pixel_fit'].values())
res['maskable']={**post['maskable'],'ancho_isotipo':'50 % del lado (256 px de 512)','metodo':'píxeles distintos del fondo noche en el PNG 512; distancia máxima al centro vs radio 0.4 × 512'}
ok&=not post['maskable']['se_recorta']
res['resumen']={'todo_ok':ok,'iconos_grandes_ok':sum(v['ok'] for v in res['iconos_grandes'].values()),'iconos_grandes':len(res['iconos_grandes']),
                'derivados_marcados':sum(v['ok'] for v in res['derivados_pixel_fit'].values()),'derivados':len(res['derivados_pixel_fit'])}
json.dump(res,open(I+'verificacion-iconos.json','w'),indent=1,ensure_ascii=False)
print(json.dumps(res['resumen'],ensure_ascii=False),json.dumps(res['congelados'],ensure_ascii=False))
