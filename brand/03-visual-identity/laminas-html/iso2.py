import math
from shapely.geometry import box, Point, LineString, Polygon
from shapely.ops import unary_union
from shapely import affinity
R=64
def rc(g,convex=0,concave=0):
    if concave: g=g.buffer(concave,resolution=R,join_style=1).buffer(-concave,resolution=R,join_style=1)
    if convex: g=g.buffer(-convex,resolution=R,join_style=1).buffer(convex,resolution=R,join_style=1)
    return g
def center(g):
    x0,y0,x1,y1=g.bounds; return affinity.translate(g,32-(x0+x1)/2,32-(y0+y1)/2)
def path(g):
    gs=getattr(g,'geoms',[g]); out=[]
    for p in gs:
        for ring in [p.exterior,*p.interiors]:
            c=list(ring.coords)
            out.append('M'+' L'.join(f'{x:.2f} {y:.2f}' for x,y in c[:-1])+'Z')
    return ' '.join(out)
def encaje():
    L=box(8,8,26,56).union(box(8,38,56,56))
    L=rc(L,convex=5,concave=3)
    q=Point(31,33).buffer(25,resolution=256).intersection(box(31,8,56,33))
    q=rc(q,convex=2.5)
    return unary_union([L,q])
def local():
    L=box(8,8,30,56).union(box(30,28,56,56))
    L=rc(L,convex=3,concave=2.5)
    door=box(13,24,25,48).union(Point(19,24).buffer(6,resolution=128))
    win=box(37,40,49,48).union(Point(43,40).buffer(6,resolution=128))
    return L.difference(door).difference(win)
def lens(p1,p2,w):
    mx,my=(p1[0]+p2[0])/2,(p1[1]+p2[1])/2
    dx,dy=p2[0]-p1[0],p2[1]-p1[1]; l=math.hypot(dx,dy); n=(-dy/l*w,dx/l*w)
    def q(t,s):
        c=(mx+s*n[0],my+s*n[1]); return ((1-t)**2*p1[0]+2*(1-t)*t*c[0]+t*t*p2[0],(1-t)**2*p1[1]+2*(1-t)*t*c[1]+t*t*p2[1])
    return Polygon([q(i/120,1) for i in range(121)]+[q(i/120,-1) for i in range(120,-1,-1)])
def petalo():
    v=lens((12,52),(12,6),15); h=lens((12,52),(58,52),15)
    return center(unary_union([v,h]))
def trazo():
    pts=[(17,10),(17,40)]+[(29-12*math.cos(math.radians(t)),40+12*math.sin(math.radians(t))) for t in range(0,181,2)]+[(41,18)]
    g=LineString(pts).buffer(5,resolution=R,cap_style=1,join_style=1)
    bar=LineString([(33,26),(53,26)]).buffer(5,resolution=R,cap_style=1)
    return center(unary_union([g,bar]))
FIN=[('encaje','Encaje',encaje),('local','Local',local),('petalo','Pétalo',petalo),('trazo','Trazo',trazo)]
_cache={}
def geom(key):
    if key not in _cache: _cache[key]=dict((k,f) for k,n,f in FIN)[key]()
    return _cache[key]
def svg(key,color='#0F4D3A',size=None,bg=None,extra=''):
    s=f' width="{size}" height="{size}"' if size else ''
    b=f'<rect width="64" height="64" fill="{bg}"/>' if bg else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"{s}{extra}>{b}<path fill="{color}" fill-rule="evenodd" d="{path(geom(key))}"/></svg>'
if __name__=='__main__':
    import os,glob
    for f in glob.glob('../isotipo/r2/*.svg'): os.remove(f)
    for k,n,f in FIN:
        open(f'../isotipo/r2/isotipo-r2-{k}.svg','w').write(svg(k)); print(k,[round(v,1) for v in geom(k).bounds])
