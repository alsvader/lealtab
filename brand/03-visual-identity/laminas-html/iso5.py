from iso2 import *
from iso4 import qb
def conteo(n=3,bw=8.0,gap=3.0,sw=8.0,p0=(6,50),c=(24,24),p1=(58,34),y0=10,y1=54,ko=True):
    xs=[14+i*(36-bw)/(n-1) for i in range(n)]
    bars=unary_union([LineString([(x+bw/2,y0+bw/2),(x+bw/2,y1-bw/2)]).buffer(bw/2,resolution=R,cap_style=1) for x in xs])
    arc=LineString(qb(p0,c,p1,200))
    stroke=arc.buffer(sw/2,resolution=R,cap_style=1)
    if ko:
        bars=bars.difference(arc.buffer(sw/2+gap,resolution=R,cap_style=1))
        bars=rc(bars,convex=1.5)
    return center(unary_union([bars,stroke]))
V={'ca':dict(),'cb':dict(c=(30,30),p0=(4,44),p1=(60,40)),'cc':dict(ko=False),'cd':dict(n=4,bw=6.5,gap=2.5,sw=7),'ce':dict(c=(32,14),p0=(4,52),p1=(60,52),y0=22,y1=60)}
for k,kw in V.items(): FIN.append((k,k,(lambda kw=kw:conteo(**kw))))
cells=''.join(f'<div>{svg(k,"#0F4D3A",230)}<div style="display:flex;gap:10px;align-items:end">{svg(k,"#0F4D3A",32)}{svg(k,"#0F4D3A",16)}{svg(k,"#F3EFE6",16,"#0F4D3A")}</div></div>' for k in V)
open('pv6.html','w').write('<html><body style="margin:0;background:#F3EFE6;display:flex;gap:20px;padding:20px">'+cells+'</body></html>')
