"""Usos correctos e incorrectos del logo (aprobado 2026-10-06).
Toda aparición del logo es <use> de #isotipo / #wordmark, cuyos <path> se copian LITERALMENTE de los masters
congelados. Los errores se logran solo con transforms, fill/stroke, filtros o fondos sobre esos mismos trazados.
Excepciones marcadas data-ejemplo-error: un <text> en otra tipografía (caso 'tipografía') y PNG incrustados
del isotipo a 16 px (caso 'pixel-fit'). No se dibuja ningún trazado de logo nuevo."""
import re, json, sys, os, base64, random
sys.path.insert(0,'../iconos')
from render import render_one
from PIL import Image
L='/workspace/lealtab/03-visual-identity/logo/'; OUT=L+'uso/'
NOCHE,LINO,CLARO,DUR,BOSQUE,GN,OR='#0F2A22','#F3EFE6','#FFFDF8','#FF9F6E','#0F4D3A','#4D635A','#C2560F'
H=open(L+'master/lealtab-master-frozen.svg').read(); V=open(L+'master/lealtab-vertical-frozen.svg').read()
def block(t,gid):
    g=re.search(rf'<g id="{gid}"[^>]*>(.*?)</g>',t,re.S).group(1); return re.findall(r'<path id="[^"]+" d="[^"]+"/>',g)
ISO,WM=block(H,'isotipo'),block(H,'wordmark'); assert block(V,'isotipo')==ISO and block(V,'wordmark')==WM
X=52.0
LK={'horizontal':(810.31,188,'<use href="#isotipo"/><use href="#wordmark"/>'),'isotipo':(222,188,'<use href="#isotipo"/>')}
VT_ISO=re.search(r'<g id="isotipo" transform="([^"]+)"',V).group(1); VT_WM=re.search(r'<g id="wordmark" transform="([^"]+)"',V).group(1)
LK['vertical']=(396.1125,325.945,f'<use href="#isotipo" transform="{VT_ISO}"/><use href="#wordmark" transform="{VT_WM}"/>')
CV=94.0; SEP=42.3   # C del vertical y separación congelada (0.45 C)
f=lambda v:f'{v:.3f}'.rstrip('0').rstrip('.')
def Lum(h):
    c=[int(h[i:i+2],16)/255 for i in (1,3,5)]; c=[x/12.92 if x<=0.04045 else ((x+0.055)/1.055)**2.4 for x in c]
    return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]
CR=lambda a,b:round((max(Lum(a),Lum(b))+0.05)/(min(Lum(a),Lum(b))+0.05),2)
FOTO_OSC=('#14211C','#2B3A33','#3C4C44')     # paradas del degradado "foto oscura simulada"
FOTO_LIM=('#E9E2D3','#EFE9DD')               # zona limpia de la "foto con zona limpia simulada"
CONTRASTE={'noche sobre lino':CR(NOCHE,LINO),'lino sobre noche':CR(LINO,NOCHE),'negro sobre blanco':CR('#000000','#FFFFFF'),
  'blanco sobre foto oscura simulada (parada más clara)':CR('#FFFFFF',FOTO_OSC[2]),'lino sobre bosque':CR(LINO,BOSQUE),'blanco sobre bosque':CR('#FFFFFF',BOSQUE),
  'noche sobre zona limpia simulada (parada más oscura)':CR(NOCHE,FOTO_LIM[0]),'noche sobre bosque':CR(NOCHE,BOSQUE),'lino sobre durazno':CR(LINO,DUR),
  'durazno sobre lino':CR(DUR,LINO),'noche sobre durazno (incorrecto por regla de marca)':CR(NOCHE,DUR)}
FONTS="<style>@font-face{font-family:'Archivo';src:url('file:///usr/share/fonts/truetype/sand-box/google/Archivo/Archivo-VariableFont_wdth,wght.ttf');font-weight:100 900;font-stretch:62% 125%}@font-face{font-family:'Manrope';src:url('file:///usr/share/fonts/truetype/sand-box/google/Manrope/Manrope-VariableFont_wght.ttf');font-weight:200 800}</style>"
random.seed(7)
noise=''.join(f'<rect x="{random.randint(-10,300)}" y="{random.randint(-10,200)}" width="{random.randint(8,60)}" height="{random.randint(8,60)}" fill="{random.choice(["#7A5C3E","#C9A36B","#2F5D50","#E8D9B5","#A23B2A","#5B7F9E","#F0C987","#3E3A36"])}" transform="rotate({random.randint(-40,40)})" opacity="0.9"/>' for _ in range(90))
DEFS=('<defs>\n<g id="isotipo">'+''.join('\n  '+p for p in ISO)+'\n</g>\n<g id="wordmark">'+''.join('\n  '+p for p in WM)+'\n</g>\n'
 f'<linearGradient id="foto-oscura-simulada" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{FOTO_OSC[0]}"/><stop offset="0.6" stop-color="{FOTO_OSC[1]}"/><stop offset="1" stop-color="{FOTO_OSC[2]}"/></linearGradient>\n'
 f'<radialGradient id="foto-oscura-luz" cx="0.85" cy="0.2" r="0.5"><stop offset="0" stop-color="#4F5F55" stop-opacity="0.9"/><stop offset="1" stop-color="#4F5F55" stop-opacity="0"/></radialGradient>\n'
 f'<linearGradient id="foto-zona-limpia-simulada" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{FOTO_LIM[1]}"/><stop offset="0.55" stop-color="{FOTO_LIM[0]}"/><stop offset="0.75" stop-color="#B9A27E"/><stop offset="1" stop-color="#6E5A3F"/></linearGradient>\n'
 f'<radialGradient id="foto-objeto" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#8C6B47"/><stop offset="1" stop-color="#8C6B47" stop-opacity="0"/></radialGradient>\n'
 f'<pattern id="foto-cargada-simulada" width="300" height="200" patternUnits="userSpaceOnUse"><rect width="300" height="200" fill="#D9C7A3"/>{noise}</pattern>\n'
 f'<linearGradient id="degradado-error" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="{BOSQUE}"/><stop offset="1" stop-color="{DUR}"/></linearGradient>\n'
 f'<filter id="resplandor-error" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="0" stdDeviation="14" flood-color="{DUR}" flood-opacity="0.9"/></filter>\n'
 '</defs>')
def T(x,y,s,size=13,w=600,fill=NOCHE,fam='Manrope',anchor='start',extra=''):
    st='font-stretch:75%;text-transform:uppercase;' if fam=='Archivo' else ''
    return f'<text x="{f(x)}" y="{f(y)}" font-family="{fam}" font-weight="{w}" font-size="{size}" fill="{fill}" text-anchor="{anchor}" style="{st}" {extra}>{s}</text>'
def fit(k,zx,zy,zw,zh,m=2.0):
    """Escala y origen para centrar el lockup k con m·x de margen dentro de la zona."""
    w,h,_=LK[k]; s=min(zw/(w+2*m*X),zh/(h+2*m*X)); return s,zx+(zw-w*s)/2,zy+(zh-h*s)/2,w*s,h*s
def logo(k,zx,zy,zw,zh,fill=NOCHE,m=2.0,extra='',pre=''):
    s,x,y,w,h=fit(k,zx,zy,zw,zh,m)
    return f'<g fill="{fill}" {extra} transform="{pre}translate({f(x)} {f(y)}) scale({s:.5f})">{LK[k][2]}</g>',(s,x,y,w,h)
def zona(s,x,y,w,h,m=1.5):
    M=m*X*s; return f'<rect x="{f(x-M)}" y="{f(y-M)}" width="{f(w+2*M)}" height="{f(h+2*M)}" fill="none" stroke="{DUR}" stroke-width="1.2" stroke-dasharray="4 3"/>'
def mark(x,y,ok):
    if ok: return f'<circle cx="{x}" cy="{y}" r="10" fill="{BOSQUE}"/><polyline points="{x-4.5},{y} {x-1.2},{y+3.5} {x+5},{y-3.5}" fill="none" stroke="{LINO}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>'
    return f'<circle cx="{x}" cy="{y}" r="10" fill="{OR}"/><path d="M{x-4} {y-4}L{x+4} {y+4}M{x+4} {y-4}L{x-4} {y+4}" stroke="#FFFFFF" stroke-width="2.4" stroke-linecap="round"/>'
def img(p,x,y,w,h,extra=''):
    return f'<image href="data:image/png;base64,{base64.b64encode(open(p,"rb").read()).decode()}" x="{x}" y="{y}" width="{w}" height="{h}" style="image-rendering:pixelated" {extra}/>'
def tag(x,y,s,fill=CLARO,col=NOCHE): return f'<rect x="{x}" y="{y-11}" width="{len(s)*5.3+10:.0f}" height="15" rx="3" fill="{fill}" opacity="0.92"/>'+T(x+5,y,s,9.5,700,col)
# -------------------- contenidos (ax,ay,aw,ah) --------------------
def c_bg(bg,fill,k='horizontal'):
    def fn(ax,ay,aw,ah):
        g,_=logo(k,ax,ay,aw,ah,fill); return f'<rect x="{ax}" y="{ay}" width="{aw}" height="{ah}" rx="6" fill="{bg}"'+(' stroke="#d8cfbf"' if bg=='#FFFFFF' else '')+'/>'+g
    return fn
def c_foto_osc(ax,ay,aw,ah,k='horizontal'):
    g,_=logo(k,ax,ay,aw,ah,'#FFFFFF',extra='data-lockup="vertical"' if k=='vertical' else '')
    return f'<rect x="{ax}" y="{ay}" width="{aw}" height="{ah}" rx="6" fill="url(#foto-oscura-simulada)"/><rect x="{ax}" y="{ay}" width="{aw}" height="{ah}" rx="6" fill="url(#foto-oscura-luz)"/>'+g+tag(ax+6,ay+ah-6,'foto oscura simulada',NOCHE,LINO)
def c_foto_limpia(ax,ay,aw,ah):
    zw=aw*0.62; g,(s,x,y,w,h)=logo('horizontal',ax,ay,zw,ah,NOCHE,m=1.7)
    return (f'<rect x="{ax}" y="{ay}" width="{aw}" height="{ah}" rx="6" fill="url(#foto-zona-limpia-simulada)"/>'
            f'<ellipse cx="{ax+aw*0.86}" cy="{ay+ah*0.55}" rx="{aw*0.16}" ry="{ah*0.42}" fill="url(#foto-objeto)"/>'+g+zona(s,x,y,w,h)+tag(ax+6,ay+ah-6,'foto simulada · zona limpia'))
def c_deform(ax,ay,aw,ah):
    hw=aw/2-4; g1,(s,x,y,w,h)=logo('horizontal',ax,ay,hw,ah,NOCHE,m=2.6)
    cx,cy=x+w/2,y+h/2
    a=f'<g transform="translate({f(cx)} {f(cy)}) scale(1.35 0.62) translate({f(-cx)} {f(-cy)})">{g1}</g>'
    g2,(s2,x2,y2,w2,h2)=logo('horizontal',ax+aw/2+4,ay,hw,ah,NOCHE,m=1.6); c2x,c2y=x2+w2/2,y2+h2/2
    b=f'<g transform="translate({f(c2x)} {f(c2y)}) rotate(-12) skewX(-12) translate({f(-c2x)} {f(-c2y)})">{g2}</g>'
    return f'<rect x="{ax}" y="{ay}" width="{aw}" height="{ah}" rx="6" fill="{LINO}"/><svg x="{ax}" y="{ay}" width="{aw}" height="{ah}" overflow="hidden"><g transform="translate({-ax} {-ay})">{a}{b}</g></svg>'+tag(ax+6,ay+ah-6,'estirado')+tag(ax+aw/2+6,ay+ah-6,'rotado + inclinado')
def c_durazno(ax,ay,aw,ah):
    g,_=logo('horizontal',ax,ay,aw,ah,DUR); return f'<rect x="{ax}" y="{ay}" width="{aw}" height="{ah}" rx="6" fill="{LINO}"/>'+g+tag(ax+6,ay+ah-6,f'durazno sobre lino · {CONTRASTE["durazno sobre lino"]}:1')
def c_recolocar(ax,ay,aw,ah):
    s,x,y,w,h=fit('horizontal',ax,ay,aw,ah,1.6)
    # wordmark en su lugar original desplazado a la izquierda; isotipo pequeño después del nombre
    g=(f'<g fill="{NOCHE}" transform="translate({f(x)} {f(y)}) scale({s:.5f})"><use href="#wordmark" transform="translate(-230 0)"/>'
       f'<use href="#isotipo" transform="translate(600 20) scale(0.55)"/></g>')
    return f'<rect x="{ax}" y="{ay}" width="{aw}" height="{ah}" rx="6" fill="{LINO}"/>'+g+tag(ax+6,ay+ah-6,'símbolo detrás del nombre, al 55 %')
def c_contorno(ax,ay,aw,ah):
    s,_,_,_,_=fit('horizontal',ax,ay,aw,ah); g,_=logo('horizontal',ax,ay,aw,ah,'none',extra=f'stroke="{NOCHE}" stroke-width="{f(1.3/s)}"')
    return f'<rect x="{ax}" y="{ay}" width="{aw}" height="{ah}" rx="6" fill="{LINO}"/>'+g
def c_efectos(ax,ay,aw,ah):
    hw=aw/2-4; s,x,y,w,h=fit('horizontal',ax,ay,hw,ah,1.0); off=5/s
    a=(f'<g transform="translate({f(x)} {f(y)}) scale({s:.5f})"><g fill="{NOCHE}" transform="translate({f(off)} {f(off)})">{LK["horizontal"][2]}</g>'
       f'<g fill="{CLARO}" stroke="{NOCHE}" stroke-width="{f(1.6/s)}">{LK["horizontal"][2]}</g></g>')
    b,_=logo('horizontal',ax+aw/2+4,ay,hw,ah,'url(#degradado-error)',m=1.0,extra='filter="url(#resplandor-error)"')
    return f'<rect x="{ax}" y="{ay}" width="{aw}" height="{ah}" rx="6" fill="{LINO}"/>'+a+b+tag(ax+6,ay+ah-6,'sombra dura Ciclo v2')+tag(ax+aw/2+6,ay+ah-6,'degradado + resplandor')
def c_contraste(ax,ay,aw,ah):
    hw=aw/2-3; g1,_=logo('horizontal',ax,ay,hw,ah,NOCHE,m=1.2); g2,_=logo('horizontal',ax+aw/2+3,ay,hw,ah,LINO,m=1.2)
    return (f'<rect x="{ax}" y="{ay}" width="{hw}" height="{ah}" rx="6" fill="{BOSQUE}"/><rect x="{ax+aw/2+3}" y="{ay}" width="{hw}" height="{ah}" rx="6" fill="{DUR}"/>'+g1+g2
            +tag(ax+6,ay+ah-6,f'noche / bosque {CONTRASTE["noche sobre bosque"]}:1')+tag(ax+aw/2+9,ay+ah-6,f'lino / durazno {CONTRASTE["lino sobre durazno"]}:1'))
def c_ruido(ax,ay,aw,ah):
    g,_=logo('horizontal',ax,ay,aw,ah,NOCHE)
    return f'<svg x="{ax}" y="{ay}" width="{aw}" height="{ah}"><rect width="{aw}" height="{ah}" rx="6" fill="url(#foto-cargada-simulada)"/></svg>'+g+tag(ax+6,ay+ah-6,'foto cargada simulada')
def c_invadir(ax,ay,aw,ah):
    g,(s,x,y,w,h)=logo('horizontal',ax,ay-12,aw,ah,NOCHE,m=2.4); M=1.5*X*s
    return (f'<rect x="{ax}" y="{ay}" width="{aw}" height="{ah}" rx="6" fill="{LINO}"/>'+g+zona(s,x,y,w,h)
            +f'<rect x="{f(x+w-70)}" y="{f(y+h+M*0.35)}" width="{f(76)}" height="22" rx="4" fill="{DUR}" stroke="{NOCHE}" stroke-width="1.2" data-ejemplo-error="elemento ajeno"/>'
            +T(x+w-62,y+h+M*0.35+15,'¡2×1 hoy!',11,800,NOCHE)
            +f'<line x1="{f(x-M*0.4)}" y1="{ay+4}" x2="{f(x-M*0.4)}" y2="{ay+ah-4}" stroke="{NOCHE}" stroke-width="1.5" data-ejemplo-error="borde"/>')
def c_tipo(ax,ay,aw,ah):
    s,x,y,w,h=fit('horizontal',ax,ay,aw,ah)
    return (f'<rect x="{ax}" y="{ay}" width="{aw}" height="{ah}" rx="6" fill="{LINO}"/><g fill="{NOCHE}" transform="translate({f(x)} {f(y)}) scale({s:.5f})"><use href="#isotipo"/></g>'
            +f'<text data-ejemplo-error="tipografía distinta (no es el wordmark)" x="{f(x+282.16*s)}" y="{f(y+156.67*s)}" font-family="DejaVu Serif, serif" font-style="italic" font-weight="400" font-size="{f(150*s)}" fill="{NOCHE}">LealTab</text>'
            +tag(ax+6,ay+ah-6,'serif itálica en lugar de Archivo 75/800'))
def c_pixel(ax,ay,aw,ah):
    bg=f'<rect x="{ax}" y="{ay}" width="{aw}" height="{ah}" rx="6" fill="{LINO}"/>'
    big=min(ah-40,aw*0.40); bx,by=ax+10,ay+(ah-big)/2-6
    o=bg+img(L+'iconos/pixel/lealtab-isotipo-16px.png',f(bx),f(by),f(big),f(big),'data-ejemplo-error="PNG de 16 px ampliado"')+tag(ax+6,ay+ah-6,'PNG de 16 px ampliado')
    rx=ax+aw*0.5+6; z=50; ry=ay+16
    o+=img('/tmp/prueba-isotipo-16.png',f(rx),f(ry),z,f(z*188/222),'data-ejemplo-error="vector congelado a 16 px (ampliado ×4 para verlo)"')
    o+=img(L+'iconos/pixel/lealtab-isotipo-16px.png',f(rx+z+10),f(ry-5),z,z)
    o+=T(rx,ry+z+12,'✖ vector',9.5,700,OR)+T(rx+z+10,ry+z+12,'✓ pixel-fit',9.5,700,BOSQUE)+T(rx,ry+z+26,'ambos a 16 px, vistos ×4',9,500,GN)
    return o
CORRECTOS=[('Noche sobre lino',f'Principal · contraste {CONTRASTE["noche sobre lino"]}:1',c_bg(LINO,NOCHE)),
 ('Lino sobre noche',f'Inversa · {CONTRASTE["lino sobre noche"]}:1',c_bg(NOCHE,LINO)),
 ('Negra sobre blanco',f'Una tinta · {CONTRASTE["negro sobre blanco"]}:1',c_bg('#FFFFFF','#000000')),
 ('Blanca sobre foto oscura',f'Blanco puro · ≥ {CONTRASTE["blanco sobre foto oscura simulada (parada más clara)"]}:1 en la zona',c_foto_osc),
 ('Lino sobre bosque',f'#0F4D3A · {CONTRASTE["lino sobre bosque"]}:1 (pasa AAA)',c_bg(BOSQUE,LINO)),
 ('Foto con zona limpia',f'Noche · ≥ {CONTRASTE["noche sobre zona limpia simulada (parada más oscura)"]}:1 · área 1.5x libre',c_foto_limpia)]
INCORRECTOS=[('Deformar','Nunca estires, comprimas, rotes ni inclines el logo.',c_deform),
 ('Logo en durazno','Durazno es acento del sistema, nunca color del logo.',c_durazno),
 ('Recolocar el símbolo','No muevas el isotipo ni cambies su tamaño relativo.',c_recolocar),
 ('Contornear o vaciar','El logo va siempre relleno, nunca en contorno.',c_contorno),
 ('Sombras y efectos','Sin sombras, degradados ni brillos en el logo.',c_efectos),
 ('Fondos sin contraste','Noche/bosque y lino/durazno no se leen.',c_contraste),
 ('Fondo cargado','No pongas el logo sobre fotos o texturas con ruido.',c_ruido),
 ('Invadir el área','Nada entra en el 1.5x: ni textos ni bordes.',c_invadir),
 ('Otra tipografía','El wordmark son curvas fijas: no lo reescribas.',c_tipo),
 ('Pixel-fit mal usado','El de 16 px solo a 16 px; a 16 px, nunca el vector.',c_pixel)]

# -------------------- vertical --------------------
def vbg(bg,fill):
    def fn(ax,ay,aw,ah):
        g,_=logo('vertical',ax,ay,aw,ah,fill,extra='data-lockup="vertical"'); return f'<rect x="{ax}" y="{ay}" width="{aw}" height="{ah}" rx="6" fill="{bg}"/>'+g
    return fn
def vvar(inner,ax,ay,aw,ah,fill=NOCHE,bg=LINO,m=2.0,label=None,box=None):
    """Variante del vertical: mismos use, otros transforms (error). box = (w,h) de la variante para centrarla."""
    w,h=box or LK['vertical'][:2]; s=min(aw/(w+2*m*X),ah/(h+2*m*X)); x,y=ax+(aw-w*s)/2,ay+(ah-h*s)/2
    o=f'<rect x="{ax}" y="{ay}" width="{aw}" height="{ah}" rx="6" fill="{bg}"/><g fill="{fill}" transform="translate({f(x)} {f(y)}) scale({s:.5f})">{inner}</g>'
    return o+(tag(ax+6,ay+ah-6,label) if label else '')
WMV=f'<use href="#wordmark" transform="{VT_WM}"/>'
def iso_t(tx,ty,sc=1): return f'<use href="#isotipo" transform="translate({f(tx)} {f(ty)})'+(f' scale({sc})' if sc!=1 else '')+'"/>'
def cv_estirar(ax,ay,aw,ah):
    w,h,_=LK['vertical']; inner=f'<g transform="translate({f(w/2)} {f(h/2)}) scale(1.45 0.72) translate({f(-w/2)} {f(-h/2)})">{LK["vertical"][2]}</g>'
    return vvar(inner,ax,ay,aw,ah,label='estirado 145 % × 72 %',box=(w*1.45,h))
def cv_escala(ax,ay,aw,ah):
    sc=0.55; return vvar(iso_t(89.5563+222*(1-sc)/2,188*(1-sc),sc)+WMV,ax,ay,aw,ah,label='isotipo al 55 %')
def cv_desal(ax,ay,aw,ah):
    return vvar(iso_t(0,0)+WMV,ax,ay,aw,ah,label='isotipo alineado a la izquierda')
def cv_sep(ax,ay,aw,ah):
    hw=aw/2-3; d1=SEP-0.1*CV; d2=1.2*CV-SEP
    a=vvar(iso_t(89.5563,d1)+WMV,ax,ay,hw,ah,label='0.1 C',m=1.4)
    b=vvar(iso_t(89.5563,-d2)+f'<g transform="translate(0 {f(-d2)})"></g>'+WMV,ax+aw/2+3,ay,hw,ah,label='1.2 C',m=1.4,box=(396.1125,325.945+d2))
    return a+b
def cv_sep_fix(ax,ay,aw,ah):  # el 1.2 C necesita que el origen baje d2 para que quepa
    hw=aw/2-3; d1=SEP-0.1*CV; d2=1.2*CV-SEP
    a=vvar(iso_t(89.5563,d1)+WMV,ax,ay,hw,ah,label='0.1 C',m=1.4,box=(396.1125,325.945))
    b=vvar(f'<g transform="translate(0 {f(d2)})">'+iso_t(89.5563,-d2)+WMV+'</g>',ax+aw/2+3,ay,hw,ah,label='1.2 C',m=1.4,box=(396.1125,325.945+d2))
    return a+b
def cv_invadir(ax,ay,aw,ah):
    g,(s,x,y,w,h)=logo('vertical',ax,ay-6,aw,ah,NOCHE,m=2.7); M=1.5*X*s
    return (f'<rect x="{ax}" y="{ay}" width="{aw}" height="{ah}" rx="6" fill="{LINO}"/>'+g+zona(s,x,y,w,h)
            +f'<rect x="{f(x+w-40)}" y="{f(y+h+M*0.3)}" width="88" height="22" rx="4" fill="{DUR}" stroke="{NOCHE}" stroke-width="1.2" data-ejemplo-error="elemento ajeno"/>'
            +T(x+w-32,y+h+M*0.3+15,'¡Nuevo menú!',11,800,NOCHE)
            +f'<line x1="{f(x-M*0.45)}" y1="{ay+4}" x2="{f(x-M*0.45)}" y2="{ay+ah-4}" stroke="{NOCHE}" stroke-width="1.5" data-ejemplo-error="borde"/>')
def cv_durazno(ax,ay,aw,ah):
    return vvar(LK['vertical'][2],ax,ay,aw,ah,NOCHE,DUR,label=f'noche / durazno {CR(NOCHE,DUR)}:1 · pasa WCAG')
def cv_orden(ax,ay,aw,ah):
    wm=f'<use href="#wordmark" transform="translate(-211.62 {f(-24.58*0.75)}) scale(0.75)"/>'; top=134.27*0.75
    return vvar(wm+iso_t(89.5563,top+SEP),ax,ay,aw,ah,label='nombre arriba, símbolo abajo',box=(396.1125,top+SEP+188))
def cv_rotar(ax,ay,aw,ah):
    w,h,_=LK['vertical']; inner=f'<g transform="translate({f(w/2)} {f(h/2)}) rotate(-14) translate({f(-w/2)} {f(-h/2)})">{LK["vertical"][2]}</g>'
    return vvar(inner,ax,ay,aw,ah,label='rotado −14°',m=2.4)
CORRECTOS_V=[('Vertical · noche sobre lino',f'Principal · {CONTRASTE["noche sobre lino"]}:1',vbg(LINO,NOCHE)),
 ('Vertical · lino sobre noche',f'Inversa · {CONTRASTE["lino sobre noche"]}:1',vbg(NOCHE,LINO)),
 ('Vertical · lino sobre bosque',f'#0F4D3A · {CONTRASTE["lino sobre bosque"]}:1 (AAA)',vbg(BOSQUE,LINO)),
 ('Vertical · blanca sobre foto',f'Foto oscura simulada · ≥ {CONTRASTE["blanco sobre foto oscura simulada (parada más clara)"]}:1',lambda *a:c_foto_osc(*a,k='vertical'))]
INCORRECTOS_V=[('Vertical estirado','No cambies las proporciones del vertical.',cv_estirar),
 ('Símbolo a otra escala','El isotipo mide siempre 2 C en el vertical.',cv_escala),
 ('Símbolo desalineado','El isotipo va centrado (+2.5 u ópticos).',cv_desal),
 ('Separación distinta','Entre símbolo y nombre: siempre 0.45 C.',cv_sep_fix),
 ('Invadir el área','Nada entra en el 1.5x de protección.',cv_invadir),
 ('Noche sobre durazno','Pasa WCAG, pero durazno es solo de recompensa.',cv_durazno),
 ('Orden invertido','El símbolo va arriba y el nombre abajo.',cv_orden),
 ('Vertical rotado','Nunca rotes ni inclines el logo.',cv_rotar)]
def card(x,y,w,h,n,title,line,fn,ok,fs=1.0):
    o=f'<rect x="{x+5}" y="{y+5}" width="{w}" height="{h}" rx="12" fill="{NOCHE}"/><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{CLARO}" stroke="{NOCHE}" stroke-width="2"/>'
    o+=mark(x+24,y+24,ok)+T(x+42,y+29,f'{n:02d} · {title}',15*fs,800,fam='Archivo')
    ax,ay,aw,ah=x+12,y+44,w-24,h-44-30
    o+=f'<g id="caso-{"ok" if ok else "error"}-{n:02d}">'+fn(ax,ay,aw,ah)+'</g>'
    o+=T(x+14,y+h-12,line,10.5*fs,600,NOCHE if ok else OR)
    return o
def grid(cases,x0,y0,cols,cw,ch,gap,ok,n0=1,fs=1.0):
    o=''
    for i,(t,l,fn) in enumerate(cases):
        r,c=divmod(i,cols); o+=card(x0+c*(cw+gap),y0+r*(ch+gap),cw,ch,n0+i,t,l,fn,ok,fs)
    return o
def page(W,Hh,title,body,badge=None,bw=0):
    hdr=T(40,50,'LEALTAB · FASE 3 · USOS DEL LOGO DERIVADOS DE LOS MASTERS CONGELADOS (2026-10-05)',12,800,extra='letter-spacing="1.6"')+T(40,112,title,52,800,fam='Archivo')
    if badge: hdr+=f'<rect x="{W-40-bw+5}" y="{68+5}" width="{bw}" height="46" rx="10" fill="{NOCHE}"/><rect x="{W-40-bw}" y="68" width="{bw}" height="46" rx="10" fill="{DUR}" stroke="{NOCHE}" stroke-width="2.5"/>'+T(W-40-bw/2,98,badge,18,800,fam='Archivo',anchor='middle',extra='letter-spacing="0.5"')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {Hh}" width="{W}" height="{Hh}">\n<title>LealTab · {title} · Aprobado 2026-10-06</title>\n'
            '<desc>Cada logo es un use de #isotipo / #wordmark con los path copiados sin cambios de los masters congelados 2026-10-05. Los errores solo aplican transforms, fill, stroke, filtros o fondos; los elementos de error ajenos al logo llevan data-ejemplo-error. Fotos = placeholders simulados con degradados o patrones.</desc>\n'
            f'{FONTS}\n{DEFS}\n<rect width="{W}" height="{Hh}" fill="{LINO}"/>\n{hdr}\n{body}\n</svg>\n')
BADGE='Usos correctos e incorrectos · aprobado 2026-10-06'
NOTA='La sombra dura noche del estilo Ciclo v2 es para tarjetas y recuadros, nunca para el logo. Fotos = placeholders simulados (degradados y patrones).'
# entregables individuales
SEC=lambda y,t,col:T(40,y,t,15,800,col,fam='Archivo')
b=SEC(146,'Horizontal',BOSQUE)+grid(CORRECTOS,40,156,3,496,300,16,True,fs=1.15)
b+=SEC(806,'Vertical',BOSQUE)+grid(CORRECTOS_V,40,816,4,368,340,16,True,n0=7,fs=1.1)
b+=T(40,1200,'Todos respetan el área de protección de 1.5x (se ve punteada en la foto con zona limpia). '+NOTA,12,500,GN)
open(OUT+'usos-correctos.svg','w').write(page(1600,1220,'Usos correctos',b))
b=SEC(146,'Horizontal',OR)+grid(INCORRECTOS,40,156,5,291,300,16,False)
b+=SEC(806,'Vertical',OR)+grid(INCORRECTOS_V,40,816,4,368,320,16,False,n0=11,fs=1.1)
b+=T(40,1500,NOTA+' Durazno se reserva para el momento en que se completa una recompensa: nunca es fondo de marca.',12,500,GN)
open(OUT+'usos-incorrectos.svg','w').write(page(1600,1520,'Usos incorrectos',b))
# lámina horizontal (igual que la revisada; pie actualizado)
b=T(40,146,'Correctos',14,800,BOSQUE,fam='Archivo')+grid(CORRECTOS,40,156,6,241,238,15.8,True,fs=0.93)
b+=T(40,428,'Incorrectos',14,800,OR,fam='Archivo')+grid(INCORRECTOS,40,438,5,291,254,16.25,False,n0=7)
b+=T(40,990,NOTA+' Vertical y fondo durazno: ver usos-logo-vertical. Logos sin cambio en sus d (verificacion-usos.json).',11.5,500,GN)
open(OUT+'usos-logo.svg','w').write(page(1600,1000,'Usos del logo',b,BADGE,700))
render_one(OUT+'usos-logo.svg',1600,1000,OUT+'usos-logo.png')
# lámina vertical
b=T(40,146,'Correctos · vertical',14,800,BOSQUE,fam='Archivo')+grid(CORRECTOS_V,40,156,4,368,262,16,True)
b+=T(40,446,'Incorrectos · vertical',14,800,OR,fam='Archivo')+grid(INCORRECTOS_V,40,456,4,368,246,16,False,n0=5)
b+=T(40,990,'Vertical: símbolo = 2 C, separación = 0.45 C, símbolo centrado (+2.5 u ópticos); transforms del master congelado. Durazno se reserva para la recompensa completada.',11.5,500,GN)
open(OUT+'usos-logo-vertical.svg','w').write(page(1600,1000,'Usos del logo vertical',b,BADGE,700))
render_one(OUT+'usos-logo-vertical.svg',1600,1000,OUT+'usos-logo-vertical.png')
json.dump(CONTRASTE,open('/tmp/usos-contraste.json','w'),ensure_ascii=False,indent=1); print(json.dumps(CONTRASTE,ensure_ascii=False,indent=1))
