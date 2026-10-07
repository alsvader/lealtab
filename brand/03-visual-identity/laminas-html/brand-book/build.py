"""Arma el brand book: SVG por página, PNG de revisión, PDF vectorial, verificación y resumen."""
import sys, os, re, json, hashlib, subprocess, shutil, tempfile
sys.path.insert(0,'../iconos'); from render import render_one
import bb, p_marca as M, p_logo as LG, p_sistema as S, p_final as F
O=bb.OUT; os.makedirs(O+'paginas',exist_ok=True); os.makedirs(O+'png',exist_ok=True)
PAG=[(1,'portada',M.p1),(2,'indice',M.p2),(3,'que-es-lealtab',M.p3),(4,'personalidad',M.p4),(5,'voz-y-tono',M.p5),
 (6,'concepto-isotipo',LG.p6),(7,'versiones',LG.p7),(8,'colores-del-logo',LG.p8),(9,'area-de-proteccion',LG.p9),(10,'tamanos-minimos',LG.p10),
 (11,'usos-correctos',LG.p11),(12,'usos-incorrectos-horizontal',LG.p12),(13,'usos-incorrectos-vertical',LG.p13),(14,'iconos-digitales-favicon',LG.p14),
 (15,'paleta',S.p15),(16,'tipografia',S.p16),(17,'iconografia',S.p17),(18,'aro-y-movimiento',S.p18),(19,'ilustracion',S.p19),(20,'stickers',S.p20),(21,'fotografia',S.p21),
 (22,'ejemplos-de-aplicacion',F.p22),(23,'que-archivo-usar',F.p23),(24,'pendientes',F.p24)]
for d in (O+'paginas',O+'png'):
    for x in os.listdir(d): os.remove(os.path.join(d,x))
files=[]
for n,slug,fn in PAG:
    p=O+f'paginas/lealtab-brand-book-{n:02d}-{slug}.svg'; open(p,'w').write(fn()); files.append((n,slug,p))
# PNG de revisión (en paralelo)
from concurrent.futures import ThreadPoolExecutor
def rpng(it):
    n,slug,p=it; d=tempfile.mkdtemp()
    out=O+f'png/lealtab-brand-book-{n:02d}-{slug}.png'
    subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars','--force-device-scale-factor=1','--window-size=1920,1080',f'--user-data-dir={d}','--virtual-time-budget=6000',f'--screenshot={out}','file://'+p],check=True,capture_output=True)
    shutil.rmtree(d,ignore_errors=True); return out
with ThreadPoolExecutor(6) as ex: pngs=list(ex.map(rpng,files))
# PDF vectorial: todas las páginas en un HTML, 508 × 285.75 mm (1920 × 1080 px a 96 ppp)
d=tempfile.mkdtemp(); html=d+'/bb.html'
body=''.join('<div class="pg">'+open(p).read()[open(p).read().index('<svg'):].replace('<svg ','<svg style="display:block;width:508mm;height:285.75mm" ',1)+'</div>' for _,_,p in files)
open(html,'w').write('<html><head><meta charset="utf-8"><style>@page{size:508mm 285.75mm;margin:0}html,body{margin:0}.pg{width:508mm;height:285.75mm;overflow:hidden;page-break-after:always;break-after:page}.pg:last-child{page-break-after:auto;break-after:auto}</style></head><body>'+body+'</body></html>')
subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu',f'--user-data-dir={d}/u','--no-pdf-header-footer','--virtual-time-budget=8000',f'--print-to-pdf={O}lealtab-brand-book.pdf','file://'+html],check=True,capture_output=True)
shutil.rmtree(d,ignore_errors=True)
json.dump([(n,slug) for n,slug,_ in files],open('/tmp/bb-pages.json','w'))
print('ok',len(files))
# ---------- verificación ----------
fr=open(bb.L+'master/lealtab-master-frozen.svg').read()
REF={i:hashlib.sha256(d.encode()).hexdigest() for i,d in re.findall(r'<path id="([^"]+)" d="([^"]+)"',fr)}
ver={'fecha':'2026-10-06','estado':bb.ETQ,'paginas':{}}
allok=True
for n,slug,p in files:
    s=open(p).read()
    got=re.findall(r'<path id="([^"]+)" d="([^"]+)"',s)
    frozen=[(i,hashlib.sha256(d.encode()).hexdigest()) for i,d in got if i in REF]
    bad=[i for i,h in frozen if REF[i]!=h]
    usa_logo=('href="#isotipo"' in s) or ('href="#wordmark"' in s) or any(i.startswith('isotipo-') for i,_ in frozen if True)
    defs_ok=all(i in dict(frozen) for i in REF)
    r={'usa_logo':bool(usa_logo),'trazados_congelados_encontrados':len(frozen),'todos_coinciden_sha256':not bad and defs_ok,
       'derivados_pixel_fit':sorted({i for i,_ in got if 'ajustad' in i}),'imagenes_raster':s.count('<image'),
       'etiqueta_aprobado':bb.ETQ in s}
    if bad or not defs_ok or r['imagenes_raster'] or not r['etiqueta_aprobado']: allok=False
    ver['paginas'][f'{n:02d}-{slug}']=r
over=[c for c in bb.CHECKS if c[2]>c[3]+0.5]
ver['textos_medidos']=len(bb.CHECKS); ver['textos_que_no_caben']=over
ver['sha256_referencia']=REF
pi=subprocess.run(['pdfinfo',O+'lealtab-brand-book.pdf'],capture_output=True,text=True).stdout
im=subprocess.run(['pdfimages','-list',O+'lealtab-brand-book.pdf'],capture_output=True,text=True).stdout.strip().splitlines()[2:]
ver['pdf']={'paginas':int(re.search(r'Pages:\s+(\d+)',pi).group(1)),'tamano':re.search(r'Page size:\s+(.+)',pi).group(1).strip()+' (508 × 285.75 mm = 1920 × 1080 px a 96 ppp)','imagenes_raster':len(im)}
ver['todo_ok']=allok and not over and ver['pdf']['paginas']==24 and not im
json.dump(ver,open(O+'verificacion-brand-book.json','w'),ensure_ascii=False,indent=2)
print('todo_ok',ver['todo_ok'],'desbordes',over,'pdf',ver['pdf'])
# ---------- resumen 1600×1000 ----------
import base64
f=bb.f
from PIL import Image
th=''
cols,tw_,thh=6,232,130.5; gx=(1600-80-cols*tw_)/(cols-1)
for k,(n,slug,_) in enumerate(files):
    im_=Image.open(pngs[k]).convert('RGB'); im_.thumbnail((464,261)); tp=f'/tmp/bb-th-{n}.png'; im_.save(tp)
    x=40+(k%cols)*(tw_+gx); y=162+(k//cols)*(thh+66)
    th+=f'<rect x="{f(x+4)}" y="{f(y+4)}" width="{tw_}" height="{thh}" rx="6" fill="{bb.NOCHE}"/><image href="data:image/png;base64,{base64.b64encode(open(tp,"rb").read()).decode()}" x="{f(x)}" y="{f(y)}" width="{tw_}" height="{thh}"/><rect x="{f(x)}" y="{f(y)}" width="{tw_}" height="{thh}" rx="6" fill="none" stroke="{bb.NOCHE}" stroke-width="1.5"/>'
    title=re.search(r'· \d\d · (.*?) · Aprobado 2026-10-06',open(files[k][2]).read()).group(1)
    th+=bb.T(x,y+thh+26,f'{n:02d}',13,800,bb.OR)+bb.T(x+26,y+thh+26,title,13,700); bb.fit(title,13,700,tw_-26,where='resumen')
b,bw=bb.badge(0,0,'Brand book · aprobado 2026-10-06',19)
svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000">{bb.FONTS}<rect width="1600" height="1000" fill="{bb.LINO}"/>
{bb.T(40,50,'LEALTAB · FASE 3 · BRAND BOOK · 24 PÁGINAS · 1920 × 1080 (2026-10-06)',12,800,ls=1.6)}{bb.T(40,118,'Brand book',58,800,fam='Archivo')}
<g transform="translate({f(1560-bw)} 70)">{b}</g>{th}
{bb.T(40,988,'Cada página es un SVG en brand-book/paginas/; el PDF vectorial reúne las 24. Miniaturas de los PNG de revisión. Verificación: verificacion-brand-book.json.',12,500,bb.GN)}</svg>'''
open('/tmp/bb-resumen.svg','w').write(svg); render_one('/tmp/bb-resumen.svg',1600,1000,O+'brand-book-resumen.png')
print('resumen ok', [c for c in bb.CHECKS if c[0]=='resumen' and c[2]>c[3]])
