from iso2 import *
def golondrina():
    # crescent wing sweeping up-right
    w=Point(30,40).buffer(26,resolution=256).difference(Point(36,48).buffer(25,resolution=256))
    w=w.intersection(box(4,8,60,40))
    body=lens((14,42),(40,36),7)
    tail1=Polygon([(30,40),(58,58),(36,44)]); 
    tail2=Polygon([(32,42),(50,62),(36,46)])
    g=unary_union([w,body,tail1,tail2])
    return center(rc(g,convex=0.8))
def pasale():
    jamb=box(8,8,17,56); floor=box(8,48,56,56)
    frame=rc(unary_union([jamb,floor]),convex=3,concave=2)
    leaf=Polygon([(22,12),(50,6),(50,43),(22,43)])
    leaf=rc(leaf,convex=2)
    return unary_union([frame,leaf])
def modulos():
    sq=rc(box(8,38,26,56),convex=3)
    st=Point(8,34).buffer(18,resolution=256).intersection(box(8,16,26,34))
    st=rc(box(8,8,26,34),convex=0).intersection(Point(8,34).buffer(26,resolution=256))
    ft=box(30,38,56,56).intersection(Point(30,56).buffer(26,resolution=256))
    return unary_union([sq,rc(st,convex=2.5),rc(ft,convex=2.5)])
for n,f in [('golondrina',golondrina),('pasale',pasale),('modulos',modulos)]: FIN.append((n,n,f))
if __name__=='__main__':
    h='<html><body style="margin:0;background:#F3EFE6;display:flex;gap:30px;padding:20px;width:1600px">'
    for k,n,f in FIN[4:]:
        h+=f'<div>{svg(k,"#0F4D3A",300)}<div style="display:flex;gap:10px;align-items:end;margin-top:8px">{svg(k,"#0F4D3A",32)}{svg(k,"#0F4D3A",16)}{svg(k,"#F3EFE6",16,"#0F4D3A")}</div></div>'
    open('pv4.html','w').write(h+'</body></html>')
