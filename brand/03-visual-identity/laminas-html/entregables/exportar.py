"""Exportación reproducible del paquete logo/entregables/ (aprobado 2026-10-06).
Regla: el SVG es la fuente. Los PNG/PDF/ICO se generan aquí de forma automática desde SVG aprobados; nunca se editan a mano.
Fuentes: logo/sistema/ (20 variantes), logo/iconos/ (web y avatares), masters congelados (verificación)."""
import os, re, json, shutil, hashlib
from chrome import render_png, pdf
L='/workspace/lealtab/03-visual-identity/logo/'; S=L+'sistema/'; I=L+'iconos/'; E=L+'entregables/'
NOCHE,LINO='#0F2A22','#F3EFE6'
LOCKS={'horizontal':(810.31,188),'vertical':(396.1125,325.945),'isotipo':(222,188),'wordmark':(528.15,134.27)}
COLORS={'noche':'noche sobre transparente','lino':'lino sobre transparente','lino-fondo-noche':'lino sobre fondo noche',
        'negro':'negro 100 % (una tinta) sobre transparente','blanco':'blanco 100 % sobre transparente'}
X=52.0; AREA=1.5*X                           # área de protección aprobada: 1.5x por lado
MIN_PX={'horizontal':80,'vertical':56,'isotipo':16,'wordmark':56}
PNG_W={'horizontal':[512,1024,2048],'vertical':[512,1024,2048],'isotipo':[512,1024],'wordmark':[512,1024]}
f=lambda v:f'{v:.4f}'.rstrip('0').rstrip('.')
for d in ('svg','png','web','redes','impresion'): os.makedirs(E+d,exist_ok=True)
def logo_block(t):  # grupo <g id="lealtab-..."> completo, literal (incluye #isotipo/#wordmark con sus transforms)
    return re.search(r'(<g id="lealtab-[^"]+".*</g>)\s*</svg>',t,re.S).group(1)
def svgdoc(vb,title,desc,block,bg=None):
    x,y,w,h=vb
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{f(x)} {f(y)} {f(w)} {f(h)}" width="{f(w)}" height="{f(h)}">\n'
            f'  <title>{title}</title>\n  <desc>{desc}</desc>\n'
            +(f'  <rect id="fondo" x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" fill="{bg}"/>\n' if bg else '')
            +f'  {block}\n</svg>\n')
DESC=('Exportación del sistema de variantes aprobado (logo/sistema/, 2026-10-05). Trazados idénticos a los masters congelados '
      '(logo/master/*-frozen.svg); solo cambian fill, viewBox, transforms de grupo y fondo. ')
manifest_src={}   # archivo -> fuente
svg_jobs=[]
for lk,(w,h) in LOCKS.items():
    for col,cdesc in COLORS.items():
        src=S+f'lealtab-{lk}-{col}.svg'; t=open(src).read(); block=logo_block(t)
        vb=tuple(map(float,re.search(r'viewBox="([^"]+)"',t).group(1).split()))
        bg=NOCHE if col=='lino-fondo-noche' else None
        name=f'lealtab-{lk}-{col}'
        open(E+f'svg/{name}.svg','w').write(svgdoc(vb,f'LealTab · {lk} · {cdesc}',DESC+('Ajustado al borde de la tinta.' if not bg else 'Fondo noche con margen de presentación de 0.5 C (como en logo/sistema/).'),block,bg))
        manifest_src[f'svg/{name}.svg']=f'sistema/lealtab-{lk}-{col}.svg'
        avb=(-AREA,-AREA,w+2*AREA,h+2*AREA)
        open(E+f'svg/{name}-con-area.svg','w').write(svgdoc(avb,f'LealTab · {lk} · {cdesc} · con área de protección 1.5x',DESC+f'El viewBox incluye el área de protección de 1.5x = {f(AREA)} u por lado.',block,bg))
        manifest_src[f'svg/{name}-con-area.svg']=f'sistema/lealtab-{lk}-{col}.svg'
        os.makedirs(E+f'png/{lk}',exist_ok=True)
        for W in PNG_W[lk]:
            H=round(W*avb[3]/avb[2]); out=f'png/{lk}/{name}-con-area-{W}.png'
            svg_jobs.append((E+f'svg/{name}-con-area.svg',W,H,E+out)); manifest_src[out]=f'svg/{name}-con-area.svg'
# ---------------- web ----------------
COPY={'web/favicon.svg':I+'favicon/favicon.svg','web/favicon.ico':I+'favicon/favicon.ico'}
WEB_PNG={'web/apple-touch-icon.png':(I+'app/lealtab-apple-touch-icon-180-sangre.svg',180),'web/icon-192.png':(I+'pwa/lealtab-pwa-192.svg',192),
         'web/icon-512.png':(I+'pwa/lealtab-pwa-512.svg',512),'web/icon-maskable-512.png':(I+'pwa/lealtab-pwa-maskable-512.svg',512)}
for dst,src in COPY.items(): shutil.copyfile(src,E+dst); manifest_src[dst]=os.path.relpath(src,L)
for dst,(src,n) in WEB_PNG.items(): svg_jobs.append((src,n,n,E+dst)); manifest_src[dst]=os.path.relpath(src,L)
json.dump({"name":"LealTab","short_name":"LealTab","start_url":"/","display":"standalone","theme_color":NOCHE,"background_color":LINO,
  "icons":[{"src":"/favicon.svg","sizes":"any","type":"image/svg+xml","purpose":"any"},
           {"src":"/icon-192.png","sizes":"192x192","type":"image/png","purpose":"any"},
           {"src":"/icon-512.png","sizes":"512x512","type":"image/png","purpose":"any"},
           {"src":"/icon-maskable-512.png","sizes":"512x512","type":"image/png","purpose":"maskable"}]},open(E+'web/site.webmanifest','w'),indent=2,ensure_ascii=False)
open(E+'web/snippet.html','w').write('''<!-- LealTab · íconos web. Copia los archivos de esta carpeta a la raíz del sitio. -->
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#0F2A22">
''')
# ---------------- redes ----------------
for col in ('lino','noche'):
    src=I+f'avatar/lealtab-avatar-{col}-400.svg'; t=open(src).read()
    for n in (400,1080): svg_jobs.append((src,n,n,E+f'redes/lealtab-avatar-{col}-circulo-{n}.png')); manifest_src[f'redes/lealtab-avatar-{col}-circulo-{n}.png']=os.path.relpath(src,L)
    # versión cuadrada a sangre para subir a redes (la plataforma recorta el círculo): mismo grupo, círculo → cuadrado
    sq=re.sub(r'<circle id="fondo"[^>]*fill="([^"]+)"/>',r'<rect id="fondo" width="400" height="400" fill="\1"/>',t)
    sq=re.sub(r'<title>[^<]*</title>',f'<title>LealTab · avatar {col} · cuadrado a sangre para redes · Aprobado 2026-10-06</title>',sq)
    open(E+f'redes/lealtab-avatar-{col}-cuadrado.svg','w').write(sq); manifest_src[f'redes/lealtab-avatar-{col}-cuadrado.svg']=os.path.relpath(src,L)+' (círculo → cuadrado)'
    for n in (400,1080): svg_jobs.append((E+f'redes/lealtab-avatar-{col}-cuadrado.svg',n,n,E+f'redes/lealtab-avatar-{col}-cuadrado-{n}.png')); manifest_src[f'redes/lealtab-avatar-{col}-cuadrado-{n}.png']=f'redes/lealtab-avatar-{col}-cuadrado.svg'
# portada Facebook 1640×624 (se muestra a 820×312 y en móvil recorta los lados): fondo noche, horizontal lino al centro
t=open(S+'lealtab-horizontal-lino.svg').read(); block=logo_block(t)
PW,PH=1640,624; lw=520; s=lw/810.31; lx,ly=(PW-lw)/2,(PH-188*s)/2
cover=(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {PW} {PH}" width="{PW}" height="{PH}">\n  <title>LealTab · portada Facebook 1640×624 · Aprobado 2026-10-06</title>\n'
       f'  <desc>{DESC}Logo horizontal lino de {lw} px de ancho, centrado; queda dentro de la zona central que muestran escritorio y móvil. Sin texto de marketing.</desc>\n'
       f'  <rect id="fondo" width="{PW}" height="{PH}" fill="{NOCHE}"/>\n  <g transform="translate({f(lx)} {f(ly)}) scale({s:.6f})">{block}</g>\n</svg>\n')
open(E+'redes/lealtab-portada-facebook.svg','w').write(cover); manifest_src['redes/lealtab-portada-facebook.svg']='sistema/lealtab-horizontal-lino.svg'
svg_jobs.append((E+'redes/lealtab-portada-facebook.svg',PW,PH,E+'redes/lealtab-portada-facebook-1640x624.png')); manifest_src['redes/lealtab-portada-facebook-1640x624.png']='redes/lealtab-portada-facebook.svg'
# ---------------- impresión ----------------
PRINT_MM={'horizontal':100,'vertical':60,'isotipo':40,'wordmark':80}
for lk,(w,h) in LOCKS.items():
    for col in ('noche','negro'):
        name=f'lealtab-{lk}-{col}'; shutil.copyfile(E+f'svg/{name}.svg',E+f'impresion/{name}.svg'); manifest_src[f'impresion/{name}.svg']=f'svg/{name}.svg'
        wm=PRINT_MM[lk]; hm=round(wm*h/w,3)
        pdf(open(E+f'impresion/{name}.svg').read(),wm,hm,E+f'impresion/{name}.pdf'); manifest_src[f'impresion/{name}.pdf']=f'impresion/{name}.svg'
render_png(svg_jobs)
json.dump({'manifest_src':manifest_src,'svg_jobs':[(os.path.relpath(a,L),b,c,os.path.relpath(d,L)) for a,b,c,d in svg_jobs],'PRINT_MM':PRINT_MM,'MIN_PX':MIN_PX,'AREA':AREA},
          open('/workspace/lealtab/03-visual-identity/laminas-html/entregables/export-meta.json','w'),indent=1,ensure_ascii=False)
print('svg/png/pdf ok', len(svg_jobs),'png')
