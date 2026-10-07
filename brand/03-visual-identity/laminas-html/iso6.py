from iso2 import *
def abanico(r=48,t=8.5,a=(19,15),b=(46,45)):
    q=Point(8,56).buffer(r,resolution=512).intersection(box(8,8,56,56))
    q=rc(q,convex=3)
    x0,y0=a; x1,y1=b
    L=box(x0,y0,x0+t,y1).union(box(x0,y1-t,x1,y1))
    L=rc(L,convex=t/2-0.01,concave=0)
    return center(q.difference(L))
def abanico2():
    q=Point(8,56).buffer(48,resolution=512).intersection(box(8,8,56,56)); q=rc(q,convex=3)
    t=8
    L=box(18,8-1,18+t,46).union(box(18,46-t,57,46))
    return center(rc(q.difference(L),convex=1.5))
def vueltaL(w=9):
    pts=[(14,8),(14,46)]
    import math
    # corner rounded via buffer join; foot to 38 then semicircle up
    pts=[(14,10),(14,50),(40,50)]+[(40+8*math.sin(math.radians(a)),42+8*math.cos(math.radians(a))) for a in range(0,181,3)]
    g=LineString(pts).buffer(w/2,resolution=R,cap_style=1,join_style=1)
    return center(rc(g,concave=3))
for k,f in [('abanico',abanico),('abanico2',abanico2),('vueltaL',vueltaL)]: FIN.append((k,k,f))
if __name__=='__main__':
    ks=['abanico','abanico2','vueltaL']
    cells=''.join(f'<div>{svg(k,"#0F4D3A",230)}<div style="display:flex;gap:10px;align-items:end">{svg(k,"#0F4D3A",32)}{svg(k,"#0F4D3A",16)}{svg(k,"#F3EFE6",16,"#0F4D3A")}</div></div>' for k in ks)
    open('pv6.html','w').write('<html><body style="margin:0;background:#F3EFE6;display:flex;gap:20px;padding:20px">'+cells+'</body></html>')
