"""Stickers con significado. Archivo 800 condensada en mayúsculas; cifras en Manrope 800 tabular."""
import math
from comun import *
from aro import aro
ST={ # clave: (partes, fondo, tinta, rotación marketing, qué significa)
 'recompensa-lista':([('¡RECOMPENSA LISTA!','archivo')],DUR,NOCHE,-4,'El cliente completó su aro. Único sticker en durazno.'),
 'visita-5de8':([('aro',5/8),('VISITA ','archivo'),('5/8','manrope')],CLARO,NOCHE,3,'Avance del cliente; la cifra va en Manrope tabular.'),
 'nuevo':([('NUEVO','archivo')],MENTA,NOCHE,5,'Cliente o función recién agregada.'),
 'te-extranamos':([('TE EXTRAÑAMOS','archivo')],BOSQUE,LINO,-3,'Cliente que dejó de venir; invita a regresar.'),
}
def sticker(k,modo='marketing'):
    partes,bg,ink,rot,_=ST[k]
    size=22 if modo=='marketing' else 12; h=size*1.9; pad=size*0.62; ol=2.5 if modo=='marketing' else 1.5
    x=pad; o=''
    for p in partes:
        if p[0]=='aro':
            d=size*1.05; o+=f'<g>{aro(x+d/2,h/2,d,p[1],"ui")}</g>'; x+=d+size*0.38
        else:
            dd,w=text_path(p[0],size*(1 if p[1]=='archivo' else 0.92),p[1],0.02 if p[1]=='archivo' else 0)
            o+=f'<path transform="translate({f(x)} {f(h/2+size*0.36)})" d="{dd}" fill="{ink}"/>'; x+=w
    w=x+pad; sh=3 if modo=='marketing' else 0
    body=(f'<rect x="{sh}" y="{sh}" width="{f(w)}" height="{f(h)}" rx="6" fill="{NOCHE}"/>' if sh else '')+f'<rect width="{f(w)}" height="{f(h)}" rx="6" fill="{bg}" stroke="{NOCHE}" stroke-width="{ol}"/>'+o
    return body,w,h,(rot if modo=='marketing' else 0)
def doc(k,modo):
    body,w,h,rot=sticker(k,modo); m=8+abs(math.sin(math.radians(rot)))*w/2
    W,H=w+16+6,h+2*m+6
    g=f'<g transform="translate({f(8)} {f(m)}) rotate({rot} {f(w/2)} {f(h/2)})">{body}</g>'
    return svgdoc(W,H,g,f'LealTab · sticker {k} · {modo}',ST[k][4]+(' Marketing: rotado, contorno 2.5 y sombra dura 3 px.' if modo=='marketing' else ' Producto: plano, sin rotar y sin sombra.')+' Aprobado 2026-10-06'),W,H
if __name__=='__main__':
    for k in ST:
        for m in ('marketing','producto'): write(f'stickers/lt-sticker-{k}-{m}.svg',doc(k,m)[0])
    print('ok')
