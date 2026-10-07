"""Utilidades: lectura de los d congelados, aplanado de trazados y rasterizado de análisis (PIL)."""
import re, math, hashlib
import numpy as np
from PIL import Image, ImageDraw
M='/workspace/lealtab/03-visual-identity/logo/master/'
FROZEN=M+'lealtab-master-frozen.svg'
def iso_elements(path=FROZEN):
    t=open(path).read()
    g=re.search(r'<g id="isotipo"[^>]*>(.*?)</g>',t,re.S).group(1)
    return re.findall(r'<path id="[^"]+" d="[^"]+"/>',g)
def iso_d(path=FROZEN):
    return {i:d for i,d in re.findall(r'<path id="([^"]+)" d="([^"]+)"/>',''.join(iso_elements(path)))}
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()
def flatten(d,steps=24):
    toks=re.findall(r'[A-Za-z]|-?\d*\.?\d+(?:e-?\d+)?',d); i=0; polys=[]; cur=[]; x=y=0; cmd=None
    def num():
        nonlocal i; v=float(toks[i]); i+=1; return v
    while i<len(toks):
        if re.match(r'[A-Za-z]',toks[i]): cmd=toks[i]; i+=1
        if cmd=='M': x,y=num(),num(); cur=[(x,y)]; cmd='L'
        elif cmd=='L': x,y=num(),num(); cur.append((x,y))
        elif cmd=='H': x=num(); cur.append((x,y))
        elif cmd=='V': y=num(); cur.append((x,y))
        elif cmd=='Q':
            cx,cy,ex,ey=num(),num(),num(),num()
            for k in range(1,steps+1):
                s=k/steps; cur.append(((1-s)**2*x+2*(1-s)*s*cx+s*s*ex,(1-s)**2*y+2*(1-s)*s*cy+s*s*ey))
            x,y=ex,ey
        elif cmd=='A':
            rx,ry,rot,la,sw,ex,ey=[num() for _ in range(7)]
            pts=arc(x,y,rx,la,sw,ex,ey,steps); cur+=pts; x,y=ex,ey
        elif cmd in 'Zz':
            polys.append(cur); cur=[]
        else: raise ValueError(cmd)
    if cur: polys.append(cur)
    return polys
def arc(x1,y1,r,la,sw,x2,y2,steps):
    # arco circular (rx=ry, sin rotación) en notación SVG
    dx,dy=(x1-x2)/2,(y1-y2)/2; d2=dx*dx+dy*dy
    if d2==0 or r==0: return [(x2,y2)]
    r=max(r,math.sqrt(d2))
    f=math.sqrt(max(0,(r*r-d2)/d2))*(-1 if la==sw else 1)
    cx=(x1+x2)/2+f*dy; cy=(y1+y2)/2-f*dx
    a1=math.atan2(y1-cy,x1-cx); a2=math.atan2(y2-cy,x2-cx); da=a2-a1
    if sw and da<0: da+=2*math.pi
    if not sw and da>0: da-=2*math.pi
    n=max(4,int(abs(da)/(math.pi/2)*steps))
    return [(cx+r*math.cos(a1+da*k/n),cy+r*math.sin(a1+da*k/n)) for k in range(1,n+1)]
def raster(ds,w,h,scale=1,tx=0,ty=0,ss=1):
    im=Image.new('L',(w*ss,h*ss),0); dr=ImageDraw.Draw(im)
    for d in ds:
        for p in flatten(d):
            dr.polygon([((px*scale+tx)*ss,(py*scale+ty)*ss) for px,py in p],fill=255)
    return np.asarray(im,dtype=float)/255
def centroid(ds,w=222,h=188,ss=8):
    a=raster(ds,w,h,ss=ss); ys,xs=np.mgrid[0:a.shape[0],0:a.shape[1]]
    m=a.sum(); return (xs*a).sum()/m/ss+0.5/ss,(ys*a).sum()/m/ss+0.5/ss, m/ss/ss
