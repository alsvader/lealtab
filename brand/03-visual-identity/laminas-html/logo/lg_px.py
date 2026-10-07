"""Rasterizado propio con supersampleo (control exacto de cada píxel) para 16/32/48 px."""
from fontTools.pens.basePen import BasePen
from PIL import Image, ImageDraw
import numpy as np
from lg_geo import master_path, pixel_path, SYM_W, SYM_H
class Flat(BasePen):
    def __init__(s): super().__init__(None); s.polys=[]; s.cur=[]
    def _moveTo(s,p): s.cur=[p]
    def _lineTo(s,p): s.cur.append(p)
    def _curveToOne(s,a,b,c):
        p0=s.cur[-1]
        for i in range(1,17):
            t=i/16; mt=1-t
            s.cur.append(tuple(mt**3*p0[k]+3*mt*mt*t*a[k]+3*mt*t*t*b[k]+t**3*c[k] for k in (0,1)))
    def _qCurveToOne(s,a,b):
        p0=s.cur[-1]
        for i in range(1,13):
            t=i/12; mt=1-t
            s.cur.append(tuple(mt*mt*p0[k]+2*mt*t*a[k]+t*t*b[k] for k in (0,1)))
    def _closePath(s): s.polys.append(s.cur); s.cur=[]
    _endPath=_closePath
def coverage(path,N,scale=1.0,off=(0,0),ss=16):
    f=Flat(); path.draw(f)
    im=Image.new('L',(N*ss,N*ss),0); dr=ImageDraw.Draw(im)
    # pathops simplify da contornos con winding no cero; los huecos van en sentido contrario.
    # Aquí el símbolo no tiene contraformas cerradas, así que basta con rellenar cada contorno.
    for poly in f.polys:
        dr.polygon([((x*scale+off[0])*ss,(y*scale+off[1])*ss) for x,y in poly],fill=255)
    a=np.asarray(im,dtype=np.float32).reshape(N,ss,N,ss).mean(axis=(1,3))/255
    return a
def hinted(N):
    p,P=pixel_path(N); a=coverage(p,N)
    if N==16:   # cuantiza: tinta plena, medio tono o vacío (sin grises sucios)
        a=np.where(a>0.8,1,np.where(a>0.45,0.6,np.where(a>0.18,0.3,0)))
    return a
def naive(N,margin_x=1):
    """El maestro escalado sin ajuste, centrado en N×N (para el antes/después)."""
    W=N-2*margin_x; s=W/SYM_W; H=SYM_H*s
    return coverage(master_path(),N,s,(margin_x,(N-H)/2))
def to_img(a,rgb,bg=None):
    N=a.shape[0]
    if bg is None:
        arr=np.zeros((N,N,4),np.uint8); arr[...,:3]=rgb; arr[...,3]=(a*255).round().astype(np.uint8)
        return Image.fromarray(arr,'RGBA')
    arr=np.zeros((N,N,3),np.float32)
    for k in range(3): arr[...,k]=bg[k]*(1-a)+rgb[k]*a
    return Image.fromarray(arr.round().astype(np.uint8),'RGB')
