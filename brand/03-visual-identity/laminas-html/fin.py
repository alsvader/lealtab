from iso2 import rc, center, path, lens, box, Point, Polygon, unary_union
import math
def encaje():
    L=rc(box(8,8,26,56).union(box(8,38,56,56)),convex=5,concave=3)
    q=rc(Point(31,33).buffer(25,resolution=512).intersection(box(31,8,56,33)),convex=2.5)
    return unary_union([L,q])
def vuelta():
    q=rc(Point(8,56).buffer(48,resolution=512).intersection(box(8,8,56,56)),convex=3)
    t=8.0; rcap=35.0; d=math.sqrt(rcap**2-14**2)
    ytop=56-d-t/2; xend=8+d+t/2
    L=box(18,ytop,26,46).union(box(18,38,xend,46))
    L=rc(L,convex=t/2-0.01)
    return q.difference(L)
def pasale():
    frame=rc(box(8,8,17,56).union(box(8,47,56,56)),convex=3,concave=2.5)
    leaf=rc(Polygon([(23,13.5),(49,7.5),(49,41),(23,41)]),convex=2.2)
    knob=Point(42.5,26).buffer(2.8,resolution=128)
    return unary_union([frame,leaf.difference(knob)])
def visitas(s=22.0,g=4.0):
    a,b=8,8+s+g
    sq=rc(box(a,b,a+s,b+s),convex=3)
    top=rc(box(a,a,a+s,a+s).intersection(Point(a,a+s).buffer(s,resolution=512)),convex=2.5)
    end=rc(box(b,b,b+s,b+s).intersection(Point(b,b+s).buffer(s,resolution=512)),convex=2.5)
    return unary_union([sq,top,end])
FIN=[('encaje','Encaje',encaje),('vuelta','Vuelta',vuelta),('pasale','Pásale',pasale),('visitas','Visitas',visitas)]
_c={}
def geom(k):
    if k not in _c: _c[k]=dict((a,f) for a,n,f in FIN)[k]()
    return _c[k]
def d(k): return path(geom(k).simplify(0.01))
def svg(k,color='#0F4D3A',size=None,bg=None):
    s=f' width="{size}" height="{size}"' if size else ''
    b=f'<rect width="64" height="64" fill="{bg}"/>' if bg else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"{s}>{b}<path fill="{color}" fill-rule="evenodd" d="{d(k)}"/></svg>'
if __name__=='__main__':
    import glob,os
    for f in glob.glob('../isotipo/r2/*.svg'): os.remove(f)
    for k,n,f in FIN:
        open(f'../isotipo/r2/isotipo-r2-{k}.svg','w').write(svg(k)+'\n')
        open(f'../isotipo/r2/isotipo-r2-{k}-negativo.svg','w').write(svg(k,'#F3EFE6',bg='#0F4D3A')+'\n')
        g=geom(k); print(k,[round(v,1) for v in g.bounds],round(g.area))
