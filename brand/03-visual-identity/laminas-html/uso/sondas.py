"""Sondas sobre los render reales: cobertura (alfa) en el punto más angosto de cada hueco y en el centro de cada contraforma.
alfa ≤ 0.35 → se ve abierto; 0.35–0.65 → gris, dudoso; > 0.65 → cerrado/fusionado."""
import sys, json, re; sys.path.insert(0,'../iconos')
from PIL import Image
import numpy as np
from shapely.ops import nearest_points
from shapely import maximum_inscribed_circle
from shapely.geometry import Polygon
from medidas import S
order=['wm-L','wm-e','wm-a1','wm-l','wm-T','wm-a2','wm-b']
probes={}
for a,b in zip(order,order[1:]):
    p,q=nearest_points(S[a],S[b]); probes[f'hueco {a[3:]}·{b[3:]}']=((p.x+q.x)/2,(p.y+q.y)/2)
p,q=nearest_points(S['isotipo-pieza-l'],S['isotipo-pieza-gancho']); ISO=((p.x+q.x)/2,(p.y+q.y)/2)
for k in ('wm-e','wm-a1','wm-b'):
    g=S[k]; P=max(getattr(g,'geoms',[g]),key=lambda x:x.area); c=maximum_inscribed_circle(Polygon(P.interiors[0]))
    probes[f'contraforma {k[3:]}']=(c.coords[0][0],c.coords[0][1])
def tf(ver,x,y,W):
    if ver=='horizontal': s=W/810.31; return x*s,y*s
    if ver=='wordmark': s=W/528.15; return (x-282.16)*s,(y-24.58)*s
    if ver=='vertical':
        s=W/396.1125
        if abs(x-ISO[0])<1e-6 and abs(y-ISO[1])<1e-6: return (x+89.5563)*s,y*s
        return (x*0.75-211.62)*s,(y*0.75+206.8)*s
    if ver=='isotipo': s=W/222; return x*s,y*s
def alpha(im,x,y):
    a=np.asarray(im)[...,3]/255; # muestreo bilineal en el centro de pixel
    x-=0.5; y-=0.5; x0,y0=int(np.floor(x)),int(np.floor(y)); fx,fy=x-x0,y-y0
    g=lambda i,j:a[min(max(j,0),a.shape[0]-1),min(max(i,0),a.shape[1]-1)]
    return float((1-fx)*(1-fy)*g(x0,y0)+fx*(1-fy)*g(x0+1,y0)+(1-fx)*fy*g(x0,y0+1)+fx*fy*g(x0+1,y0+1))
SIZES={'horizontal':[48,64,72,80,96,112,128],'vertical':[32,40,48,56,64,80],'wordmark':[32,40,48,56,64,80],'isotipo':[12,16,20,24,32]}
C={'horizontal':125.33/810.31,'vertical':94/396.1125,'wordmark':125.33/528.15,'isotipo':None}
res={}
for ver,ws in SIZES.items():
    for W in ws:
        im=Image.open(f'/tmp/prueba-{ver}-{W}.png').convert('RGBA'); r={}
        if ver!='isotipo':
            for k,(x,y) in probes.items(): r[k]=round(alpha(im,*tf(ver,x,y,W)),2)
        if ver!='wordmark': r['hueco isotipo']=round(alpha(im,*tf(ver,*ISO,W)),2)
        res[f'{ver} {W}px']={'C_px':round(C[ver]*W,1) if C[ver] else None,'alfa':r}
for n in (16,24,32):
    from pixfit import SPECS
    im=Image.open(f'/tmp/prueba-pix-{n}.png').convert('RGBA'); s=SPECS[n]
    # hueco del pixel-fit: entre fin de la barra de la L y el asta del gancho, a la altura de la barra
    gx=(s['lend']+s['x1']-s['t'])/2; gy=(s['y1']-s['t']+s['gend'])/2
    res[f'isotipo pixel-fit {n}px']={'alfa':{'hueco isotipo':round(alpha(im,gx,gy),2)}}
json.dump(res,open('/tmp/sondas.json','w'),indent=1,ensure_ascii=False)
for k,v in res.items():
    a=v['alfa']; huecos=[x for n,x in a.items() if n.startswith('hueco') and 'isotipo' not in n]; cf=[x for n,x in a.items() if n.startswith('contra')]
    print(f"{k:24s} C={v.get('C_px')}  huecos letras max={max(huecos) if huecos else '-'} min={min(huecos) if huecos else '-'}  contraformas max={max(cf) if cf else '-'}  iso={a.get('hueco isotipo','-')}")
