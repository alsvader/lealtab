from iso2 import *
import math
def arcpts(cx,cy,r,a0,a1,step=3):
    rng=range(a0,a1+(1 if a1>=a0 else -1),step if a1>=a0 else -step)
    return [(cx+r*math.cos(math.radians(a)),cy+r*math.sin(math.radians(a))) for a in rng]
def local2():
    L=box(8,8,30,56).union(box(8,32,56,56))
    L=rc(L,convex=2.5,concave=2)
    door=box(13,30,25,56-8).union(Point(19,30).buffer(6,resolution=128))
    win=box(37,40,49,56-8).union(Point(43,40).buffer(6,resolution=128))
    return L.difference(door).difference(win)
def lt():
    top=box(8,8,46,20); stem=box(21,8,33,56); foot=box(21,44,56,56)
    g=unary_union([top,stem,foot]); return rc(g,convex=3,concave=2)
def lig2():
    pts=[(16,4),(16,40)]+arcpts(28,40,12,180,0)[::-1][::-1]
    pts=[(16,4),(16,40)]+[(28-12*math.cos(math.radians(t)),40+12*math.sin(math.radians(t))) for t in range(0,181,3)]+[(40,18)]
    g=LineString(pts).buffer(5,resolution=R,cap_style=1,join_style=1)
    bar=LineString([(30,26),(52,26)]).buffer(5,resolution=R,cap_style=1)
    return unary_union([g,bar])
def petalo():
    # vertical lens + horizontal lens sharing bottom-left
    def lens(p1,p2,bulge):
        mx,my=(p1[0]+p2[0])/2,(p1[1]+p2[1])/2
        dx,dy=p2[0]-p1[0],p2[1]-p1[1]; n=(-dy,dx); l=math.hypot(*n); n=(n[0]/l*bulge,n[1]/l*bulge)
        def q(t,s): 
            c=(mx+s*n[0],my+s*n[1]); return ((1-t)**2*p1[0]+2*(1-t)*t*c[0]+t*t*p2[0],(1-t)**2*p1[1]+2*(1-t)*t*c[1]+t*t*p2[1])
        a=[q(i/40,1) for i in range(41)]; b=[q(i/40,-1) for i in range(40,-1,-1)]
        return Polygon(a+b)
    v=lens((14,54),(14,8),12); h=lens((14,54),(58,54),-12)
    return unary_union([v.difference(LineString([(14,54),(30,38)]).buffer(0)),h])
def ritmo():
    stem=rc(box(8,8,22,56),convex=7)
    p1=Point(31,49).buffer(7,resolution=64); p2=rc(box(41,38,56,56),convex=7)
    q=Point(22,56).buffer(34,resolution=128).difference(Point(22,56).buffer(26,resolution=128)).intersection(box(22,8,60,56))
    return unary_union([stem,q])
for name,fn in [('local2',local2),('lt',lt),('lig2',lig2),('petalo',petalo),('ritmo',ritmo)]:
    FIN.append((name,name,fn))
h='<html><body style="margin:0;background:#F3EFE6;display:flex;gap:20px;padding:20px;width:1600px">'
for k,n,f in FIN[4:]:
    h+=f'<div>{svg(k,"#0F4D3A",260)}<div style="display:flex;gap:10px;align-items:end;margin-top:8px">{svg(k,"#0F4D3A",32)}{svg(k,"#0F4D3A",16)}{svg(k,"#F3EFE6",16,"#0F4D3A")}</div></div>'
open('pv3.html','w').write(h+'</body></html>')
