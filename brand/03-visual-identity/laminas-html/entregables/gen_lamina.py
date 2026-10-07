"""Lámina entregables.svg/.png (1600×1000) · Exportaciones finales · aprobado 2026-10-06."""
import re, base64, json, sys
sys.path.insert(0,'../iconos')
from render import render_one
from PIL import Image
L='/workspace/lealtab/03-visual-identity/logo/'; E=L+'entregables/'
NOCHE,LINO,CLARO,DUR,BOSQUE,GN,OR='#0F2A22','#F3EFE6','#FFFDF8','#FF9F6E','#0F4D3A','#4D635A','#C2560F'
FR=open(L+'master/lealtab-master-frozen.svg').read()
def block(gid): return re.findall(r'<path id="[^"]+" d="[^"]+"/>',re.search(rf'<g id="{gid}"[^>]*>(.*?)</g>',FR,re.S).group(1))
DEFS='<defs><g id="isotipo">'+''.join(block('isotipo'))+'</g><g id="wordmark">'+''.join(block('wordmark'))+'</g></defs>'
FONTS="<style>@font-face{font-family:'Archivo';src:url('file:///usr/share/fonts/truetype/sand-box/google/Archivo/Archivo-VariableFont_wdth,wght.ttf');font-weight:100 900;font-stretch:62% 125%}@font-face{font-family:'Manrope';src:url('file:///usr/share/fonts/truetype/sand-box/google/Manrope/Manrope-VariableFont_wght.ttf');font-weight:200 800}</style>"
f=lambda v:f'{v:.3f}'.rstrip('0').rstrip('.')
def T(x,y,s,size=13,w=600,fill=NOCHE,fam='Manrope',anchor='start',extra=''):
    st='font-stretch:75%;text-transform:uppercase;' if fam=='Archivo' else ''
    return f'<text x="{f(x)}" y="{f(y)}" font-family="{fam}" font-weight="{w}" font-size="{size}" fill="{fill}" text-anchor="{anchor}" style="{st}" {extra}>{s}</text>'
def img(p,x,y,w,h=None,maxpx=600):
    im=Image.open(p); h=h or w*im.height/im.width
    if im.width>maxpx: im=im.copy(); im.thumbnail((maxpx,maxpx)); im.save('/tmp/_th.png'); p='/tmp/_th.png'
    return f'<image href="data:image/png;base64,{base64.b64encode(open(p,"rb").read()).decode()}" x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}"/>'
def frame(n,x,y,w,h,title,sub,foot):
    o=f'<rect x="{x+5}" y="{y+5}" width="{w}" height="{h}" rx="12" fill="{NOCHE}"/><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{CLARO}" stroke="{NOCHE}" stroke-width="2"/>'
    o+=T(x+16,y+30,f'{n:02d} · {title}',17,800,fam='Archivo')+T(x+w-16,y+30,sub,12,700,OR,anchor='end')
    return o+T(x+16,y+h-12,foot,10.5,600,GN)
area=lambda x,y,w,h,bg=LINO:f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{bg}"/>'
man=json.load(open(E+'manifiesto.json'))['archivos']
cnt=lambda d:sum(1 for k in man if k.startswith(d+'/'))
b=''
# ---- 01 estructura ----
x,y,w,h=40,150,520,820; b+=frame(1,x,y,w,h,'Estructura de carpetas',f'{len(man)+1} archivos','El SVG es la fuente: PNG, PDF e ICO se exportan solos y nunca se editan a mano.')
b+=area(x+14,y+44,w-28,h-44-30)
tree=[('logo/entregables/',None,0),('README.md · manifiesto.json · verificacion-entregables.json','qué usar, sha256 y pruebas',1),
 (f'svg/ ({cnt("svg")})','4 versiones × 5 colores, ajustado y con área 1.5x',1),
 (f'png/ ({cnt("png")})','exportados desde los SVG con área',1),('horizontal/ · vertical/','512 · 1024 · 2048 px',2),('isotipo/ · wordmark/','512 · 1024 px',2),
 (f'web/ ({cnt("web")})','favicon.svg/.ico · apple-touch-icon · icon-192/512',1),('','icon-maskable-512 · site.webmanifest · snippet.html',2),
 (f'redes/ ({cnt("redes")})','avatares lino y noche 400/1080 px',1),('','círculo (aprobado) y cuadrado a sangre',2),('','portada Facebook 1640×624',2),
 (f'impresion/ ({cnt("impresion")})','SVG + PDF vectorial, noche y negro',1),('','RGB: CMYK pendiente con la imprenta',2)]
yy=y+80
for name,desc,lvl in tree:
    xx=x+30+lvl*22
    if name: b+=T(xx,yy,name,15 if lvl<2 else 13,800 if lvl<2 else 700,NOCHE,fam='Manrope'); yy+=18
    if desc: b+=T(xx+(0 if name else 0),yy,desc,11.5,500,GN); yy+=24
    else: yy+=10
yy+=14; b+=f'<line x1="{x+30}" y1="{yy}" x2="{x+w-30}" y2="{yy}" stroke="#d8cfbf"/>'; yy+=28
for line in ['Área de protección: 1.5x mínimo (2x recomendado).','Mínimos: horizontal 80 px / 25 mm · vertical 56 px / 16 mm','isotipo 16 px (pixel-fit) / 6 mm · wordmark 56 px / 15 mm.','Ningún PNG queda por debajo del mínimo.']:
    b+=T(x+30,yy,line,12,700 if line.startswith(('Área','Mínimos')) else 500); yy+=20
# ---- 02 ajustado vs con área (horizontal y vertical) ----
x,y,w,h=584,150,976,260; b+=frame(2,x,y,w,h,'SVG ajustado y con área','svg/ · 40 archivos','Con área: el lienzo ya incluye 1.5x (78 u) por lado, listo para Canva, Word o una web.')
ax,ay,aw,ah=x+14,y+44,w-28,h-44-30; b+=area(ax,ay,aw,ah)
LKS={'h':(810.31,188,'<use href="#isotipo"/><use href="#wordmark"/>'),
     'v':(396.1125,325.945,'<use href="#isotipo" transform="translate(89.5563 0)"/><use href="#wordmark" transform="translate(-211.62 206.8) scale(0.75)"/>')}
def muestra(k,s,x0,yc,con,lab):
    lw,lh,inner=LKS[k]; W,Hh=lw*s,lh*s; M=78*s if con else 0; tx,ty=x0+M,yc-(Hh+2*M)/2+M; o=''
    if con: o+=f'<rect x="{f(x0)}" y="{f(ty-M)}" width="{f(W+2*M)}" height="{f(Hh+2*M)}" fill="#FFD9C4"/><rect x="{f(tx)}" y="{f(ty)}" width="{f(W)}" height="{f(Hh)}" fill="{LINO}"/>'
    else: o+=f'<rect x="{f(tx)}" y="{f(ty)}" width="{f(W)}" height="{f(Hh)}" fill="none" stroke="{NOCHE}" stroke-dasharray="4 3" stroke-width="0.8" opacity="0.6"/>'
    o+=f'<g fill="{NOCHE}" transform="translate({f(tx)} {f(ty)}) scale({s})">{inner}</g>'
    return o+T(x0,ay+ah-12,lab,10.5,700), W+2*M
yc=ay+(ah-22)/2+2
SPEC=[('h',0.235,False,'horizontal · ajustado'),('h',0.235,True,'horizontal · con área'),('v',0.30,False,'vertical · ajustado'),('v',0.30,True,'vertical · con área')]
tot=sum(LKS[k][0]*s+(156*s if con else 0) for k,s,con,_ in SPEC)+3*60; xx=ax+(aw-tot)/2
for k,s,con,lab in [('h',0.235,False,'horizontal · ajustado'),('h',0.235,True,'horizontal · con área'),('v',0.30,False,'vertical · ajustado'),('v',0.30,True,'vertical · con área')]:
    o,ww=muestra(k,s,xx,yc,con,lab); b+=o; xx+=ww+60
# ---- 03 png ----
x,y,w,h=584,434,476,260; b+=frame(3,x,y,w,h,'PNG','png/ · 50 archivos','Transparentes salvo lino-fondo-noche · 512 a 2048 px.')
ax,ay=x+14,y+44; b+=area(ax,ay,w-28,h-74,'#E4DED2')
b+=img(E+'png/horizontal/lealtab-horizontal-lino-fondo-noche-con-area-512.png',ax+12,ay+16,170)
b+=img(E+'png/horizontal/lealtab-horizontal-noche-con-area-512.png',ax+12,ay+90,170)
b+=img(E+'png/vertical/lealtab-vertical-noche-con-area-512.png',ax+196,ay+14,120)
b+=img(E+'png/vertical/lealtab-vertical-lino-fondo-noche-con-area-512.png',ax+322,ay+14,120)
b+=T(ax+196,ay+150,'vertical noche · vertical lino-fondo-noche',10,700)
b+=T(ax+12,ay+h-74-12,'muestra sobre gris para ver la transparencia',10,600,GN)
# ---- 04 web ----
x,y,w,h=1084,434,476,260; b+=frame(4,x,y,w,h,'Web','web/ · 8 archivos','favicon B · apple-touch a sangre · PWA 192/512/maskable · manifest.')
ax,ay=x+14,y+44; b+=area(ax,ay,w-28,h-74)
from PIL import Image as _I
ico=_I.open(E+'web/favicon.ico'); ico.size=(32,32); ico.load(); ico.convert('RGBA').save('/tmp/fav32.png')
ico=_I.open(E+'web/favicon.ico'); ico.size=(16,16); ico.load(); ico.convert('RGBA').save('/tmp/fav16.png')
for i,(p,n,lab) in enumerate([(E+'web/icon-maskable-512.png',110,'maskable 512'),(E+'web/icon-192.png',96,'icon-192'),(E+'web/apple-touch-icon.png',90,'apple-touch 180')]):
    xx=ax+16+i*126; b+=img(p,xx,ay+20,n)+T(xx,ay+150,lab,10.5,700)
b+=img('/tmp/fav32.png',ax+384,ay+30,32)+img('/tmp/fav16.png',ax+392,ay+76,16)+T(ax+372,ay+150,'favicon.ico',10.5,700)
# ---- 05 redes ----
x,y,w,h=584,718,476,252; b+=frame(5,x,y,w,h,'Redes','redes/ · 12 archivos','Para subir: cuadrado a sangre 1080 (la red recorta el círculo).')
ax,ay=x+14,y+44; b+=area(ax,ay,w-28,h-74,'#E4DED2')
b+=img(E+'redes/lealtab-avatar-lino-cuadrado-400.png',ax+14,ay+14,78)+img(E+'redes/lealtab-avatar-noche-cuadrado-400.png',ax+100,ay+14,78)
b+=img(E+'redes/lealtab-avatar-lino-circulo-400.png',ax+14,ay+100,60)+img(E+'redes/lealtab-avatar-noche-circulo-400.png',ax+84,ay+100,60)
b+=img(E+'redes/lealtab-portada-facebook-1640x624.png',ax+196,ay+14,240)+T(ax+196,ay+120,'portada Facebook 1640×624',10.5,700)+T(ax+196,ay+136,'logo al centro, sin texto',10,500,GN)
b+=T(ax+150,ay+124,'círculo',10,600,GN)
# ---- 06 impresión ----
x,y,w,h=1084,718,476,252; b+=frame(6,x,y,w,h,'Impresión','impresion/ · 16 archivos','PDF vectorial sin imágenes ni fuentes · RGB: CMYK pendiente con la imprenta.')
ax,ay=x+14,y+44; b+=area(ax,ay,w-28,h-74,'#FFFFFF')+f'<rect x="{ax}" y="{ay}" width="{w-28}" height="{h-74}" rx="8" fill="none" stroke="#d8cfbf"/>'
b+=img('/tmp/pdf-h.png',ax+20,ay+40,220)+T(ax+20,ay+120,'lealtab-horizontal-noche.pdf · 100 mm',10.5,700)
b+=img('/tmp/pdf-v.png',ax+300,ay+18,110)+T(ax+290,ay+124+20,'vertical negro · 60 mm',10.5,700)
badge='Exportaciones finales · aprobado 2026-10-06'
svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000">
<title>LealTab · Exportaciones finales · aprobado 2026-10-06</title>
<desc>Resumen del paquete logo/entregables/ (aprobado por Aarón López Sosa el 2026-10-06). Muestras vectoriales con los path congelados; miniaturas PNG de los propios exportados.</desc>
{FONTS}
{DEFS}
<rect width="1600" height="1000" fill="{LINO}"/>
{T(40,50,'LEALTAB · FASE 3 · PAQUETE DE LOGO DERIVADO DE LOS SVG APROBADOS (2026-10-06)',12,800,extra='letter-spacing="1.6"')}
{T(40,118,'Exportaciones finales',58,800,fam='Archivo')}
<rect x="{1560-520+5}" y="{68+5}" width="520" height="50" rx="10" fill="{NOCHE}"/><rect x="{1560-520}" y="68" width="520" height="50" rx="10" fill="{DUR}" stroke="{NOCHE}" stroke-width="2.5"/>
{T(1560-260,101,badge,19,800,fam='Archivo',anchor='middle',extra='letter-spacing="0.5"')}
{b}
{T(40,990,'Verificación: d congelados en todos los SVG, cada PNG = re-render de su SVG, ningún archivo bajo el mínimo (verificacion-entregables.json).',11.5,500,GN)}
</svg>
'''
open(E+'entregables.svg','w').write(svg)
render_one(E+'entregables.svg',1600,1000,E+'entregables.png'); print('ok')
