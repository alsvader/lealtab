import json
from render import render_many
OUT='/workspace/lealtab/03-visual-identity/logo/iconos/'
m=json.load(open('/tmp/iconos-meta.json'))
items=[(OUT+k+'.svg',S,S,OUT+k+'.png') for k,S in m['icons'].items()]
for N in (16,24,32,48): items.append((OUT+f'pixel/lealtab-isotipo-{N}px.svg',N,N,OUT+f'pixel/lealtab-isotipo-{N}px.png'))
for N in (16,32,48):
    for v in ('a','b','a-lino'): items.append((f'/tmp/fav-{v}-{N}.svg',N,N,f'/tmp/fav-{v}-{N}.png'))
render_many(items); print('png ok',len(items))
