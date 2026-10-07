"""Prueba de tamaños 16 / 24 / 32 px, línea y activo, sobre lino y sobre bosque (inversa en lino)."""
import sys; sys.path.insert(0,'../iconos')
from render import render_one
from iconos import *
def hoja():
    W=60+len(ORDEN)*44; o=f'<rect width="{W}" height="300" fill="{LINO}"/><rect y="210" width="{W}" height="90" fill="{BOSQUE}"/>'
    filas=[(16,'16',30,False),(24,'24',62,False),(32,'32',100,False),(24,'24 activo',148,True)]
    for s,lab,y,act in filas:
        o+=T(10,y+s*0.7,lab,10,700,GN)
        for i,k in enumerate(ORDEN):
            x=60+i*44+(32-s)/2
            o+=f'<g transform="translate({f(x)} {y}) scale({f(s/24)})">{glyph(k,act)}</g>'
    for s,y in [(16,226),(24,256)]:
        o+=T(10,y+s*0.7,str(s),10,700,LINO)
        for i,k in enumerate(ORDEN): o+=f'<g transform="translate({f(60+i*44+(32-s)/2)} {y}) scale({f(s/24)})">{glyph(k,col=LINO)}</g>'
    return o,W
if __name__=='__main__':
    o,W=hoja()
    p=write('iconos/lt-iconos-prueba-tamanos.svg',svgdoc(W,300,FONTS+o,'LealTab · íconos · prueba a 16, 24 y 32 px','Tamaño real, sin escalar en pantalla. Aprobado 2026-10-06'))
    render_one(p,W,300,p.replace('.svg','.png')); print(W)
