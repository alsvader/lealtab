"""Uso del logo: área de protección y tamaños mínimos (aprobado 2026-10-05).
Todos los lockups son <use> de #isotipo y #wordmark, cuyos <path> se copian LITERALMENTE de los masters
congelados. Única excepción declarada: la muestra de isotipo a 16 px usa el pixel-fit APROBADO de logo/iconos/pixel/."""
import re, json, sys, os
sys.path.insert(0,'../iconos')
from render import render_one
from PIL import Image
L='/workspace/lealtab/03-visual-identity/logo/'; OUT=L+'uso/'; os.makedirs(OUT,exist_ok=True)
NOCHE,LINO,CLARO,DUR,GN,OR,DURC='#0F2A22','#F3EFE6','#FFFDF8','#FF9F6E','#4D635A','#C2560F','#FFD9C4'
H=open(L+'master/lealtab-master-frozen.svg').read(); V=open(L+'master/lealtab-vertical-frozen.svg').read()
def block(t,gid):
    g=re.search(rf'<g id="{gid}"[^>]*>(.*?)</g>',t,re.S).group(1); return re.findall(r'<path id="[^"]+" d="[^"]+"/>',g)
ISO,WM=block(H,'isotipo'),block(H,'wordmark'); assert block(V,'isotipo')==ISO and block(V,'wordmark')==WM
VT_ISO=re.search(r'<g id="isotipo" transform="([^"]+)"',V).group(1); VT_WM=re.search(r'<g id="wordmark" transform="([^"]+)"',V).group(1)
PIX16=open(L+'iconos/pixel/lealtab-isotipo-16px.svg').read()
PIX16_G=re.search(r'(<g id="isotipo-ajustado-16px".*?</g>)',PIX16,re.S).group(1)
X=52.0; MF=1.5                                   # unidad x y margen mínimo
LOCK={'horizontal':(810.31,188,'<use href="#isotipo"/><use href="#wordmark"/>'),
      'vertical':(396.1125,325.945,f'<use href="#isotipo" transform="{VT_ISO}"/><use href="#wordmark" transform="{VT_WM}"/>'),
      'isotipo':(222,188,'<use href="#isotipo"/>'),
      'wordmark':(528.15,134.27,'<use href="#wordmark" transform="translate(-282.16 -24.58)"/>')}
MIN={  # versión: (px ancho, mm ancho, propuesta Aarón, veredicto, una medida menos que falla)
 'horizontal':(80,25,'96 px / 25 mm','px corregido a 80 · mm validado',64),
 'vertical':(56,16,'64 px / 18 mm','px corregido a 56 · mm corregido a 16',48),
 'isotipo':(16,6,'16 px / 6 mm','validado (16 px solo con pixel-fit)',12),
 'wordmark':(56,15,'64 px / 15 mm','px corregido a 56 · mm validado',48)}
SONDA=json.load(open('/tmp/sondas.json'))
def dato(k,px):
    if k=='isotipo': return 'pixel-fit: hueco 2 px, bordes a píxel'
    r=SONDA[f'{k} {px}px']; cf=max(v for a,v in r['alfa'].items() if 'contra' in a); return f'C {r["C_px"]} px · contraformas α {cf:.2f}'
NO={'horizontal':'C 9.9 px · contraforma de la a gris (α 0.33)','vertical':'C 11.4 px · e y a en gris (α 0.20)',
    'isotipo':'vector a 12 px: trazo 2.8 px, se empasta','wordmark':'C 11.4 px · a en gris (α 0.19)'}
f=lambda v:f'{v:.3f}'.rstrip('0').rstrip('.')
FONTS="<style>@font-face{font-family:'Archivo';src:url('file:///usr/share/fonts/truetype/sand-box/google/Archivo/Archivo-VariableFont_wdth,wght.ttf');font-weight:100 900;font-stretch:62% 125%}@font-face{font-family:'Manrope';src:url('file:///usr/share/fonts/truetype/sand-box/google/Manrope/Manrope-VariableFont_wght.ttf');font-weight:200 800}</style>"
DEFS='<defs>\n<g id="isotipo">'+''.join('\n  '+p for p in ISO)+'\n</g>\n<g id="wordmark">'+''.join('\n  '+p for p in WM)+'\n</g>\n<marker id="fl" viewBox="0 0 8 8" refX="7.5" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0.5L8 4L0 7.5Z" fill="'+OR+'"/></marker>\n</defs>'
def T(x,y,s,size=13,w=600,fill=NOCHE,fam='Manrope',anchor='start',extra=''):
    st='font-stretch:75%;text-transform:uppercase;' if fam=='Archivo' else ''
    return f'<text x="{f(x)}" y="{f(y)}" font-family="{fam}" font-weight="{w}" font-size="{size}" fill="{fill}" text-anchor="{anchor}" style="{st}" {extra}>{s}</text>'
def lock_at(k,x,y,s,fill=NOCHE):
    return f'<g fill="{fill}" transform="translate({f(x)} {f(y)}) scale({s:.6f})">{LOCK[k][2]}</g>'
def dim(x1,y1,x2,y2,lab,lx,ly,anchor='middle',size=12):
    return (f'<line x1="{f(x1)}" y1="{f(y1)}" x2="{f(x2)}" y2="{f(y2)}" stroke="{OR}" stroke-width="1.4" marker-start="url(#fl)" marker-end="url(#fl)"/>'
            +T(lx,ly,lab,size,800,OR,anchor=anchor))
def proteccion(k,ax,ay,aw,ah,m=MF,show_x=False):
    """Dibuja la versión k con su área de protección m·x, cotas y medidas, centrada en la caja (ax,ay,aw,ah)."""
    w,h,_=LOCK[k]; M=m*X; TW,TH=w+2*M,h+2*M
    s=min(aw/TW,ah/TH); ox,oy=ax+(aw-TW*s)/2,ay+(ah-TH*s)/2; ix,iy=ox+M*s,oy+M*s; ms=M*s
    o=(f'<path d="M{f(ox)} {f(oy)}h{f(TW*s)}v{f(TH*s)}h{f(-TW*s)}ZM{f(ix)} {f(iy)}v{f(h*s)}h{f(w*s)}v{f(-h*s)}Z" fill="{DURC}" fill-rule="evenodd"/>'
       f'<rect x="{f(ox)}" y="{f(oy)}" width="{f(TW*s)}" height="{f(TH*s)}" fill="none" stroke="{DUR}" stroke-width="1.5"/>'
       f'<rect x="{f(ix)}" y="{f(iy)}" width="{f(w*s)}" height="{f(h*s)}" fill="none" stroke="{NOCHE}" stroke-width="0.8" stroke-dasharray="4 3" opacity="0.55"/>')
    o+=lock_at(k,ix,iy,s)
    lab=f'{m:g}x'; cy=iy+h*s/2; cx=ix+w*s/2
    o+=dim(ox+3,cy,ix-3,cy,lab,ox+ms/2,cy-7)+dim(ix+w*s+3,cy,ox+TW*s-3,cy,lab,ix+w*s+ms/2,cy-7)
    o+=dim(cx,oy+3,cx,iy-3,lab,cx+8,oy+ms/2+4,'start')+dim(cx,iy+h*s+3,cx,oy+TH*s-3,lab,cx+8,iy+h*s+ms/2+4,'start')
    if show_x:   # módulo x sobre el asta de la L del isotipo
        xs=X*s; o+=f'<rect x="{f(ix)}" y="{f(iy-xs-4)}" width="{f(xs)}" height="{f(xs)}" fill="none" stroke="{NOCHE}" stroke-width="1.2"/>'+T(ix+xs/2,iy-xs/2,'x',13,800,NOCHE,anchor='middle')
    return o,(f'{f(w)} × {f(h)} u → con área {f(TW)} × {f(TH)} u')
# ======================= área-proteccion.svg (entregable) =======================
def page(title,desc,W,Hh,body,wh=None):
    wh=wh or f'width="{W}" height="{Hh}"'
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {Hh}" {wh}>\n<title>LealTab · {title} · Aprobado 2026-10-05</title>\n'
            f'<desc>{desc}</desc>\n{FONTS}\n{DEFS}\n<rect width="{W}" height="{Hh}" fill="{LINO}"/>\n{body}\n</svg>\n')
DESC_D=('Trazados de #isotipo y #wordmark copiados sin cambios de los masters congelados 2026-10-05 (logo/master/). '
        f'Unidad x = grosor del trazo del isotipo = {X:g} u. Área de protección mínima = {MF:g}x = {MF*X:g} u por lado.')
b=T(40,56,'LEALTAB · ÁREA DE PROTECCIÓN',13,800,extra='letter-spacing="1.6"')+T(40,104,'Área de protección · 1.5x por lado',40,800,fam='Archivo')
b+=T(40,132,f'x = grosor del trazo del isotipo = {X:g} u (≈ 0.41 C ≈ 2 astas de la «l»). Mínimo 1.5x = {MF*X:g} u por lado; recomendado 2x = {2*X:g} u cuando haya espacio. Zona durazno claro = nadie entra.',14,500,GN)
for (k,x,y,w,h) in [('horizontal',40,160,1000,330),('vertical',1080,160,480,330),('isotipo',40,540,480,330),('wordmark',560,540,1000,330)]:
    d,med=proteccion(k,x,y,w,h-40,show_x=(k in('horizontal','isotipo')))
    b+=f'<g id="proteccion-{k}">'+d+T(x,y+h-6,f'{k.capitalize()} · {med}',13,700)+'</g>'
open(OUT+'area-proteccion.svg','w').write(page('Área de protección',DESC_D,1600,900,b))
# ======================= tamanos-minimos.svg (entregable, A4 apaisado a 96 dpi) =======================
MM=96/25.4
def muestra_min(k,x,y,px=None,mm=None,fill=NOCHE):
    """Muestra a tamaño real: px (1 u del SVG = 1 px CSS) o mm (a 96 dpi; imprime a escala 100 %)."""
    w,h,_=LOCK[k]
    if k=='isotipo' and px==16:
        return f'<g transform="translate({x} {y})" fill="{fill}">'+PIX16_G.replace(' fill="#0F2A22"','')+'</g>',16,16
    W=px if px else mm*MM; s=W/w; return lock_at(k,x,y,s,fill),W,h*s
b=T(30,46,'LEALTAB · TAMAÑOS MÍNIMOS · imprimir a escala 100 % (A4 apaisado)',12,800,extra='letter-spacing="1.4"')
b+=T(30,84,'Tamaños mínimos (ancho)',30,800,fam='Archivo')
b+=T(30,108,'Digital: 1 unidad = 1 px CSS (pantalla 1×). Impreso: medidas reales en mm al imprimir al 100 %. El isotipo bajo 48 px usa el pixel-fit aprobado.',11.5,500,GN)
cols=[30,300,570,840]
for (k,cx) in zip(('horizontal','vertical','isotipo','wordmark'),cols):
    px,mm,prop,ver,menos=MIN[k]
    b+=f'<rect x="{cx}" y="130" width="250" height="620" rx="10" fill="{CLARO}" stroke="{NOCHE}" stroke-width="1.5"/>'
    b+=T(cx+14,156,k.capitalize(),18,800,fam='Archivo')+T(cx+14,174,f'Propuesta de Aarón: {prop}',10.5,600,GN)+T(cx+14,190,ver,10.5,800,OR)
    b+=T(cx+14,222,f'Digital · {px} px',13,800)
    d,w_,h_=muestra_min(k,cx+14,236,px=px); b+=d
    b+=T(cx+14,236+h_+18,f'{px} × {h_:.0f} px a tamaño real',10.5,500,GN)
    b+=T(cx+14,330,f'Impreso · {mm} mm',13,800)
    d,w_,h_=muestra_min(k,cx+14,344,mm=mm); b+=d
    b+=f'<line x1="{cx+14}" y1="{f(344+h_+10)}" x2="{f(cx+14+w_)}" y2="{f(344+h_+10)}" stroke="{OR}" stroke-width="1" marker-start="url(#fl)" marker-end="url(#fl)"/>'+T(cx+14+w_/2,344+h_+26,f'{mm} mm',10.5,800,OR,anchor='middle')
    b+=T(cx+14,480,'Inversa o papel absorbente: +20 %',10,600,GN)
    d,w_,h_=muestra_min(k,cx+14,494,mm=round(mm*1.2)); b+=f'<rect x="{cx+8}" y="488" width="{f(w_+12)}" height="{f(h_+12)}" rx="3" fill="{NOCHE}"/>'+muestra_min(k,cx+14,494,mm=round(mm*1.2),fill=LINO)[0]
    b+=T(cx+14,494+h_+24,f'{round(mm*1.2)} mm en inversa',10.5,800,OR)
    b+=f'<line x1="{cx+14}" y1="590" x2="{cx+236}" y2="590" stroke="#d8cfbf"/>'+T(cx+14,612,'Prueba en pantalla 1× (Chrome)',11,800)
    b+=T(cx+14,630,'✓ '+f'{px} px: '+dato(k,px),10,600,NOCHE)
    d,w_,h_=muestra_min(k,cx+14,642,px=menos) if k!='isotipo' else (lock_at('isotipo',cx+14,642,12/222),12,10.2); b+=d
    b+=T(cx+14+w_+8,652,f'✕ {menos} px',10.5,800,OR)+T(cx+14,642+h_+18,NO[k],10,600,GN)
open(OUT+'tamanos-minimos.svg','w').write(page('Tamaños mínimos','Muestras a tamaño real. '+DESC_D+' La muestra digital de isotipo a 16 px es el pixel-fit aprobado (logo/iconos/pixel/lealtab-isotipo-16px.svg), trazado derivado.',1123,794,b,'width="297mm" height="210mm"'))
json.dump({'X':X,'MF':MF,'MIN':MIN},open('/tmp/uso-meta.json','w'),ensure_ascii=False)
print('ok')

# ======================= uso-logo.svg / .png (lámina 1600×1000) =======================
def frame(n,x,y,w,h,title,sub,foot):
    o=f'<rect x="{x+5}" y="{y+5}" width="{w}" height="{h}" rx="12" fill="{NOCHE}"/><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{CLARO}" stroke="{NOCHE}" stroke-width="2"/>'
    o+=T(x+16,y+30,f'{n:02d} · {title}',17,800,fam='Archivo')+T(x+w-16,y+30,sub,12,700,OR,anchor='end')
    o+=T(x+16,y+h-24,foot[0],11.5,700)+T(x+16,y+h-9,foot[1],10.5,500,GN)
    return o
area=lambda x,y,w,h,bg=LINO:f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="8" fill="{bg}"/>'
body=''
Y1,H1=150,392
for n,k,x,w,sub,foot in [
  (1,'horizontal',40,700,'x = trazo del isotipo = 52 u',('Mínimo 1.5x = 78 u por lado; recomendado 2x = 104 u si hay espacio.','966.31 × 344 u con área · el módulo x se mide en el asta de la L')),
  (2,'vertical',764,380,'1.5x por lado',('Misma x: el isotipo del vertical mide 222 × 188 u.','552.11 × 481.95 u con área')),
  (3,'isotipo',1168,392,'1.5x por lado',('Los íconos aprobados ya dejan ≥ 1.5x (app 1.55x, maskable 2.1x).','378 × 344 u con área'))]:
    body+=frame(n,x,Y1,w,H1,f'Protección · {k}',sub,foot)+area(x+14,Y1+44,w-28,H1-44-50)
    body+=proteccion(k,x+30,Y1+56,w-60,H1-44-50-24,show_x=(k=='horizontal'))[0]
Y2,H2=566,410
body+=frame(4,40,Y2,420,H2,'Protección · wordmark','x ≈ 2 astas de la «l»',('Sin isotipo, x = 0.41 C = 52 u (C = 125.33 u).','684.15 × 290.27 u con área'))+area(54,Y2+44,392,H2-94)
body+=proteccion('wordmark',70,Y2+56,360,H2-94-24)[0]
x0,w0=484,1076
body+=frame(5,x0,Y2,w0,H2,'Tamaños mínimos (ancho) · muestras a tamaño real','regla: C ≥ 12 px en pantalla · C ≥ 3.5 mm impreso',
   ('Medido en pantalla 1×: contraformas abiertas (α ≤ 0.15) y altura de mayúscula C ≥ 12 px. Impreso: separación entre letras ≥ 0.10 mm.',
    'Inversa (lino sobre noche) o papel absorbente: +20 % · el isotipo bajo 48 px usa el pixel-fit aprobado (16/24/32 px) · tamanos-minimos.svg imprime a escala'))
cw=(w0-28-3*10)/4
for i,k in enumerate(('horizontal','vertical','isotipo','wordmark')):
    px,mm,prop,ver,menos=MIN[k]; ax=round(x0+14+i*(cw+10)); ay=Y2+44
    body+=area(ax,ay,round(cw),H2-94)
    body+=T(ax+12,ay+24,k.capitalize(),16,800,fam='Archivo')+T(ax+cw-12,ay+24,ver.split(' · ')[0] if 'corregido' in ver else 'validado',10.5,800,OR,anchor='end')
    body+=T(ax+12,ay+52,f'{px} px',28,800,fam='Archivo')+T(ax+cw/2+10,ay+52,f'{mm} mm',28,800,fam='Archivo')
    body+=T(ax+12,ay+68,'digital (ancho)',10,600,GN)+T(ax+cw/2+10,ay+68,f'impreso · inversa {round(mm*1.2)} mm',10,600,GN)
    d,w_,h_=muestra_min(k,ax+12,ay+86,px=px); body+=f'<rect x="{ax+6}" y="{ay+80}" width="{f(w_+12)}" height="{f(h_+12)}" fill="{CLARO}"/>'+d
    body+=T(ax+12,ay+86+h_+24,'✓ '+dato(k,px),10,600,NOCHE)
    yy=ay+86+h_+40
    d,w2,h2=muestra_min(k,ax+12,yy,px=menos) if k!='isotipo' else (lock_at('isotipo',ax+12,yy,12/222),12,10.2); body+=d
    body+=T(ax+12+w2+8,yy+11,f'✕ {menos} px',11,800,OR)+T(ax+12,yy+h2+18,NO[k],10,600,GN)
    body+=T(ax+12,ay+H2-94-14,f'Propuesta de Aarón: {prop}',10,600,GN)
badge='Área de protección y tamaños mínimos · aprobado 2026-10-05'
svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000">
<title>LealTab · Uso del logo: área de protección y tamaños mínimos · Aprobado 2026-10-05</title>
<desc>{DESC_D} Muestras de tamaños mínimos a tamaño real (1 u = 1 px). La muestra de isotipo a 16 px es el pixel-fit aprobado (derivado).</desc>
{FONTS}
{DEFS}
<rect width="1600" height="1000" fill="{LINO}"/>
{T(40,50,'LEALTAB · FASE 3 · USO DEL LOGO DERIVADO DE LOS MASTERS CONGELADOS (2026-10-05)',12,800,extra='letter-spacing="1.6"')}
{T(40,118,'Uso del logo',58,800,fam='Archivo')}
<rect x="{1560-800+5}" y="{68+5}" width="800" height="50" rx="10" fill="{NOCHE}"/><rect x="{1560-800}" y="68" width="800" height="50" rx="10" fill="{DUR}" stroke="{NOCHE}" stroke-width="2.5"/>
{T(1560-400,100,badge,18,800,fam='Archivo',anchor='middle',extra='letter-spacing="0.5"')}
{body}
{T(40,992,'Zona durazno claro = área de protección: ningún texto, borde ni imagen entra. Todos los lockups usan los d congelados (verificacion-uso.json).',11.5,500,GN)}
</svg>
'''
open(OUT+'uso-logo.svg','w').write(svg)
render_one(OUT+'uso-logo.svg',1600,1000,OUT+'uso-logo.png'); print('lamina ok')
