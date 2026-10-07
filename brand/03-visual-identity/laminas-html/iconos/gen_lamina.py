"""Lámina iconos-digitales.svg/.png (1600×1000). Aprobado 2026-10-05."""
import base64, json
from PIL import Image
from render import render_many, render_one
from pixfit import SPECS, SPECS_B
import build_iconos as B
from build_iconos import iso_elements, place, pix_svg
OUT='/workspace/lealtab/03-visual-identity/logo/iconos/'
NOCHE,LINO,CLARO,DUR,GN,OR='#0F2A22','#F3EFE6','#FFFDF8','#FF9F6E','#4D635A','#C2560F'
mres=json.load(open('/tmp/post-res.json'))['maskable']
# versiones lino de los pixel-fit (para chips sobre noche)
items=[]
for N,s in SPECS.items():
    open(f'/tmp/pix-lino-{N}.svg','w').write(pix_svg(N,s,fill=LINO,title='lino')); items.append((f'/tmp/pix-lino-{N}.svg',N,N,f'/tmp/pix-lino-{N}.png'))
render_many(items)
def uri(p): return 'data:image/png;base64,'+base64.b64encode(open(p,'rb').read()).decode()
def img(p,x,y,w=None,h=None):
    im=Image.open(p); w=w or im.width; h=h or im.height
    return f'<image href="{uri(p)}" x="{x}" y="{y}" width="{w}" height="{h}" style="image-rendering:pixelated"/>'
def T(x,y,s,size=13,w=600,fill=NOCHE,fam='Manrope',anchor='start',extra=''):
    st='font-stretch:75%;text-transform:uppercase;' if fam=='Archivo' else ''
    return f'<text x="{x}" y="{y}" font-family="{fam}" font-weight="{w}" font-size="{size}" fill="{fill}" text-anchor="{anchor}" style="{st}" {extra}>{s}</text>'
def frame(n,x,y,w,h,title,sub,foot):
    o=f'<rect x="{x+5}" y="{y+5}" width="{w}" height="{h}" rx="12" fill="{NOCHE}"/><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{CLARO}" stroke="{NOCHE}" stroke-width="2"/>'
    o+=T(x+16,y+30,f'{n:02d} · {title}',17,800,fam='Archivo')+T(x+w-16,y+30,sub,12,700,OR,anchor='end')
    o+=T(x+16,y+h-24,foot[0],11.5,700)+T(x+16,y+h-9,foot[1],10.5,500,GN)
    return o
def area(x,y,w,h,bg): return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{bg}"/>'
def iso_at(S,ox,oy,disp,fill,frac=None):
    """isotipo con la misma colocación que el ícono de lado S, mostrado a tamaño disp."""
    k,tx,ty=place(S,frac or B.FRAC); z=disp/S
    return f'<g fill="{fill}" transform="translate({ox} {oy}) scale({z:.6f}) translate({tx:.4f} {ty:.4f}) scale({k:.6f})"><use href="#isotipo"/></g>'
body=''
# ---------------- fila 1: íconos ----------------
Y1,H1,W1=158,330,362; xs=[40,426,812,1198]; AH=H1-44-50
def cardicon(i,title,sub,foot,abg):
    x=xs[i]; return frame(i+1,x,Y1,W1,H1,title,sub,foot)+area(x+14,Y1+44,W1-28,AH,abg),x+14,Y1+44
o,ax,ay=cardicon(0,'App icon','180 × 180 · apple-touch',('Cuadrado redondeado noche (radio 22.5 %) · isotipo lino','app/lealtab-app-icon-180.svg · .png (1:1)'),LINO)
cx,cy=ax+(W1-28-180)/2,ay+(AH-180)/2
o+=f'<rect x="{cx}" y="{cy}" width="180" height="180" rx="40.5" fill="{NOCHE}"/>'+iso_at(180,cx,cy,180,LINO); body+=o
o,ax,ay=cardicon(1,'PWA maskable','isotipo 50 % · zona 80 %',(f'A sangre · radio máx. {mres["radio_max_isotipo_px"]:.1f} de 204.8 px: no se recorta',
   'pwa/lealtab-pwa-maskable-512.svg · también pwa-192 y pwa-512'),LINO)
D=204; cx,cy=ax+12,ay+(AH-D)/2
o+=f'<rect x="{cx}" y="{cy}" width="{D}" height="{D}" fill="{NOCHE}"/>'+iso_at(512,cx,cy,D,LINO,B.FRAC_MASK)
o+=f'<circle cx="{cx+D/2}" cy="{cy+D/2}" r="{204.8*D/512:.2f}" fill="none" stroke="{DUR}" stroke-width="2" stroke-dasharray="5 4"/>'
d2=92; px,py=cx+D+14,cy+18
o+=f'<circle cx="{px+d2/2}" cy="{py+d2/2}" r="{d2/2}" fill="{NOCHE}"/>'+iso_at(512,px+d2/2-d2/0.8/2,py+d2/2-d2/0.8/2,d2/0.8,LINO,B.FRAC_MASK)
o+=T(px+d2/2,py+d2+18,'máscara 80 %',10.5,700,anchor='middle')+T(px+d2/2,py+d2+32,'(peor caso)',10,500,GN,anchor='middle'); body+=o
o,ax,ay=cardicon(2,'Avatar lino','400 × 400 · círculo',('Círculo lino · isotipo noche (muestra sobre noche)','avatar/lealtab-avatar-lino-400.svg · .png (×0.5)'),NOCHE)
cx,cy=ax+(W1-28-200)/2,ay+(AH-200)/2
o+=f'<circle cx="{cx+100}" cy="{cy+100}" r="100" fill="{LINO}"/>'+iso_at(400,cx,cy,200,NOCHE); body+=o
o,ax,ay=cardicon(3,'Avatar noche','400 × 400 · círculo',('Círculo noche · isotipo lino','avatar/lealtab-avatar-noche-400.svg · .png (×0.5)'),LINO)
o+=f'<circle cx="{cx+100+386}" cy="{cy+100}" r="100" fill="{NOCHE}"/>'+iso_at(400,cx+386,cy,200,LINO); body+=o
# ---------------- fila 2a: pixel-fit ----------------
Y2,H2=514,458; x,w=40,940; ax,ay,aw,ah=x+14,Y2+44,w-28,H2-44-50
body+=frame(5,x,Y2,w,H2,'Ajuste a píxel (isotipo)','trazados nuevos derivados · los congelados no cambian',
   ('Contorno durazno = isotipo congelado escalado como referencia. Bordes rectos en píxel entero; grosor t entero.',
    '16 px: t 4, hueco abierto de 1.4 a 2 px y gancho acortado · 24: t 5 · 32: t 7 · 48: t 11 · radio interior 0–1 px · PNG al 800 % en iconos/pixel/'))
body+=area(ax,ay,aw,ah,LINO)
Z=5; ws=[N*Z+2 for N in SPECS]; gap=(aw-sum(ws)-2*36)/3; cx=ax+36; base=ay+16+242
NOTE={16:'t 4 px · hueco 2 px',24:'t 5 px · hueco 2 px',32:'t 7 px · hueco 3 px',48:'t 11 px · hueco 4 px'}
for N,wz in zip(SPECS,ws):
    from post import zoom
    zoom(N,Z,f'/tmp/zoom{Z}-{N}.png')
    body+=img(f'/tmp/zoom{Z}-{N}.png',round(cx),base-wz)
    ry=base+14
    body+=img(OUT+f'pixel/lealtab-isotipo-{N}px.png',round(cx),ry)
    chx=round(cx)+N+12; body+=f'<rect x="{chx}" y="{ry-4}" width="{N+8}" height="{N+8}" rx="3" fill="{NOCHE}"/>'+img(f'/tmp/pix-lino-{N}.png',chx+4,ry)
    body+=T(round(cx)+2*N+32,ry+min(N,16)-2,f'{N} px',14,800,fam='Archivo')
    body+=T(round(cx),ay+ah-12,f'real y ×{Z} · {NOTE[N]}',11,600,GN)
    cx+=wz+gap
# ---------------- fila 2b: favicon oficial (B) en pestañas ----------------
x,w=1004,556; ax,ay,aw,ah=x+14,Y2+44,w-28,H2-44-50
body+=frame(6,x,Y2,w,H2,'Favicon en pestañas','oficial: lino sobre cuadrado noche',
   ('Favicon: isotipo lino sobre cuadrado redondeado noche, en .ico y .svg.',
    'favicon/favicon.svg · favicon/favicon.ico (16/32/48 ajustados a píxel)'))
body+=area(ax,ay,aw,ah,LINO)
TH={'clara':('#DEE1E6','#FFFFFF','#1F1F1F','#5F6368'),'oscura':('#202124','#35363A','#E8EAED','#9AA0A6')}
def tab(x,y,w,h,theme,fav,favsz,txt,fs):
    sb,tb,tc,cc=TH[theme]; r=h*0.18
    o=f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="6" fill="{sb}"/>'
    tx,ty,tw,th=x+h*0.14,y+h*0.2,w-h*0.28,h*0.8
    o+=f'<path d="M{tx} {ty+th}V{ty+r}Q{tx} {ty} {tx+r} {ty}H{tx+tw-r}Q{tx+tw} {ty} {tx+tw} {ty+r}V{ty+th}Z" fill="{tb}"/>'
    fx,fy=round(tx+h*0.25),round(ty+(th-favsz)/2)
    o+=img(fav,fx,fy)+T(fx+favsz+h*0.2,ty+th/2+fs*0.36,txt,fs,600,tc)+T(tx+tw-h*0.25,ty+th/2+fs*0.36,'×',fs,500,cc,anchor='middle')
    return o
cw=aw-24; yy=ay+14
for th,lab in (('clara','Pestaña clara'),('oscura','Pestaña oscura')):
    body+=T(ax+12,yy+14,lab+' · pantalla 2× (frame de 32 px)',12,800,fam='Archivo')
    body+=tab(ax+12,yy+22,cw,64,th,'/tmp/fav-b-32.png',32,'LealTab · Panel de lealtad',19)
    yy+=100
body+=T(ax+12,yy+14,'Tamaño real · frame de 16 px',12,800,fam='Archivo')
mw=(cw-12)/2
for i,(th,lab) in enumerate((('clara','clara'),('oscura','oscura'))):
    mx=ax+12+i*(mw+12)
    body+=tab(round(mx),yy+22,mw,32,th,'/tmp/fav-b-16.png',16,'LealTab · Panel',11)+T(mx+mw/2,yy+70,f'pestaña {lab}',10.5,600,NOCHE,anchor='middle')
nb=ay+ah-30
body+=f'<rect x="{ax+12}" y="{nb}" width="{cw}" height="22" rx="5" fill="{CLARO}" stroke="#d8cfbf" stroke-width="1"/>'
body+=T(ax+22,nb+15,'Nota: la opción A (noche sobre transparente) se descartó porque se pierde en pestaña oscura.',10.5,600,GN)
defs='<defs>\n<g id="isotipo">'+''.join('\n  '+p for p in iso_elements())+'\n</g>\n</defs>'
badge='Íconos digitales · aprobado 2026-10-05'
svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000">
<title>LealTab · Íconos digitales · Aprobado 2026-10-05</title>
<desc>Íconos de app, PWA y avatares: use del grupo #isotipo con los elementos path copiados literalmente del master congelado 2026-10-05. Ajuste a píxel y favicons: trazados derivados mostrados como PNG a tamaño real y ampliados.</desc>
<style>@font-face{{font-family:'Archivo';src:url('file:///usr/share/fonts/truetype/sand-box/google/Archivo/Archivo-VariableFont_wdth,wght.ttf');font-weight:100 900;font-stretch:62% 125%}}@font-face{{font-family:'Manrope';src:url('file:///usr/share/fonts/truetype/sand-box/google/Manrope/Manrope-VariableFont_wght.ttf');font-weight:200 800}}</style>
{defs}
<rect width="1600" height="1000" fill="{LINO}"/>
{T(40,50,'LEALTAB · FASE 3 · ÍCONOS DIGITALES DERIVADOS DEL SISTEMA APROBADO (2026-10-05)',12,800,extra='letter-spacing="1.6"')}
{T(40,118,'Íconos digitales',58,800,fam='Archivo')}
<rect x="{1560-640+5}" y="{68+5}" width="640" height="50" rx="10" fill="{NOCHE}"/><rect x="{1560-640}" y="68" width="640" height="50" rx="10" fill="{DUR}" stroke="{NOCHE}" stroke-width="2.5"/>
{T(1560-320,101,badge,20,800,fam='Archivo',anchor='middle',extra='letter-spacing="0.6"')}
{body}
{T(40,990,f'Isotipo al {B.FRAC*100:.0f} % del lado en ancho en app, PWA y avatares; al {B.FRAC_MASK*100:.0f} % en el maskable. Centrado óptico (+{B.DX:.2f} u en x, {B.DY:.2f} u en y). proporcional; d idénticos a los congelados (verificacion-iconos.json).',11.5,500,GN)}
</svg>
'''
open(OUT+'iconos-digitales.svg','w').write(svg)
render_one(OUT+'iconos-digitales.svg',1600,1000,OUT+'iconos-digitales.png')
Image.open(OUT+'iconos-digitales.png').crop((1000,510,1570,982)).save(OUT+'favicon/prueba-pestanas.png')
print('lamina ok')
