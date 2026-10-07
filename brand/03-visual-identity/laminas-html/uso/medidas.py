"""Mide en unidades (u) los rasgos críticos de legibilidad sobre los d congelados (shapely)."""
import sys, re, json
sys.path.insert(0,'../iconos')
from geo import flatten
from shapely.geometry import Polygon
from shapely import maximum_inscribed_circle
M='/workspace/lealtab/03-visual-identity/logo/master/lealtab-master-frozen.svg'
D={i:d for i,d in re.findall(r'<path id="([^"]+)" d="([^"]+)"/>',open(M).read())}
def shape(d):
    g=None
    for p in flatten(d,48):
        P=Polygon(p).buffer(0); g=P if g is None else g.symmetric_difference(P)
    return g
S={k:shape(v) for k,v in D.items()}
out={'gaps':{},'counters':{}}
order=['wm-L','wm-e','wm-a1','wm-l','wm-T','wm-a2','wm-b']
for a,b in zip(order,order[1:]): out['gaps'][f'{a[3:]}·{b[3:]}']=round(S[a].distance(S[b]),2)
out['gaps']['isotipo (hueco L·gancho)']=round(S['isotipo-pieza-l'].distance(S['isotipo-pieza-gancho']),2)
for k in order:
    g=S[k]; polys=getattr(g,'geoms',[g])
    for P in polys:
        for i,r in enumerate(P.interiors):
            h=Polygon(r); c=maximum_inscribed_circle(h)
            out['counters'][f'{k[3:]} contraforma {i}']={'diam_inscrito':round(2*c.length,2),'alto':round(h.bounds[3]-h.bounds[1],2),'ancho':round(h.bounds[2]-h.bounds[0],2)}
# trazo más delgado de cada letra (2 × radio inscrito local mínimo aproximado): grosor de astas
for k in ('wm-L','wm-l','wm-T'):
    b=S[k].bounds; out.setdefault('astas',{})[k[3:]]=round(b[2]-b[0],2) if k!='wm-T' else None
json.dump(out,open('/tmp/medidas.json','w'),indent=1,ensure_ascii=False); print(json.dumps(out,indent=1,ensure_ascii=False))
