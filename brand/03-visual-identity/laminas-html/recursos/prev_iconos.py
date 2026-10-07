import sys; sys.path.insert(0,'../iconos')
from render import render_one
from iconos import *
b=f'<rect width="1400" height="560" fill="{LINO}"/>'
for i,k in enumerate(ORDEN):
    x=20+i*75
    b+=f'<g transform="translate({x} 20) scale(3)">{glyph(k)}</g><g transform="translate({x} 110) scale(3)">{glyph(k,True)}</g>'
    b+=f'<g transform="translate({x} 200)">{glyph(k)}</g><g transform="translate({x} 240) scale({16/24})">{glyph(k)}</g><g transform="translate({x} 270) scale({32/24})">{glyph(k)}</g>'
    b+=T(x,330,I[k][0][:10],9,600)
    b+=f'<rect x="{x}" y="350" width="72" height="72" fill="{BOSQUE}"/><g transform="translate({x+12} 362) scale(2)">{glyph(k,col=LINO)}</g>'
open('/tmp/prev-ic.svg','w').write(f'<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="560">{FONTS}{b}</svg>')
render_one('/tmp/prev-ic.svg',1400,560,'/tmp/prev-ic.png')
