from iso2 import *
def modulos4(g=4.0,u=None):
    # 3x3 grid of 14.67 cells from 8..56 ; L uses col0 rows0-2 + row2 cols1-2
    s=(48-2*g)/3; o=lambda i:8+i*(s+g)
    sq=lambda c,r: rc(box(o(c),o(r),o(c)+s,o(r)+s),convex=2.5)
    top=box(o(0),o(0),o(0)+s,o(0)+s).intersection(Point(o(0),o(0)+s).buffer(s,resolution=256)); top=rc(top,convex=2.2)
    end=box(o(2),o(2),o(2)+s,o(2)+s).intersection(Point(o(2),o(2)).buffer(s,resolution=256)); end=rc(end,convex=2.2)
    return unary_union([top,sq(0,1),sq(0,2),sq(1,2),end])
def pasale2():
    jamb=box(8,8,17,56); floor=box(8,47,56,56)
    frame=rc(unary_union([jamb,floor]),convex=3,concave=2.5)
    leaf=Polygon([(23,13),(48,7),(48,41),(23,41)]); leaf=rc(leaf,convex=2.2)
    knob=Point(42,26).buffer(2.6,resolution=128)
    return unary_union([frame,leaf.difference(knob)])
for k,f in [('modulos4',modulos4),('pasale2',pasale2)]: FIN.append((k,k,f))
if __name__=='__main__':
    import iso6
    ks=['encaje','abanico','modulos4','pasale2']
    cells=''.join(f'<div>{svg(k,"#0F4D3A",230)}<div style="display:flex;gap:10px;align-items:end">{svg(k,"#0F4D3A",32)}{svg(k,"#0F4D3A",16)}{svg(k,"#F3EFE6",16,"#0F4D3A")}</div></div>' for k in ks)
    open('pv7.html','w').write('<html><body style="margin:0;background:#F3EFE6;display:flex;gap:20px;padding:20px">'+cells+'</body></html>')
