"""LealTab logo final · geometría.
Isotipo de Aarón (v0.6): dos trazos de 52 u con remates y uniones redondas, convertidos a relleno con Skia (pathops).
Coordenadas originales: P1 'M40 20 V124 Q40 156 72 156 H138'  ·  P2 'M154 20 H178 Q210 20 210 52 V124'.
Caja de tinta original: x 14–236, y −6–182 (222 × 188). Aquí se traslada a 0–222 × 0–188."""
import pathops, os
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.basePen import BasePen
from fontTools.pens.transformPen import TransformPen
SW=52; OX,OY=14,-6; SYM_W,SYM_H=222,188
def stroke_paths(p1,p2,sw,cap=pathops.LineCap.ROUND_CAP):
    out=pathops.Path()
    for pts in (p1,p2):
        p=pathops.Path(); pen=p.getPen()
        pen.moveTo(pts[0]); pen.lineTo(pts[1]); pen.qCurveTo(pts[2],pts[3]); pen.lineTo(pts[4]); pen.endPath()
        p.stroke(sw,cap,pathops.LineJoin.ROUND_JOIN,4); p.convertConicsToQuads(); p.simplify()
        out=pathops.op(out,p,pathops.PathOp.UNION)
    return out
def master_path():
    p1=[(40,20),(40,124),(40,156),(72,156),(138,156)]
    p2=[(154,20),(178,20),(210,20),(210,52),(210,124)]
    sh=lambda L:[(x-OX,y-OY) for x,y in L]
    return stroke_paths(sh(p1),sh(p2),SW)
class _R(BasePen):
    """redondea coordenadas a 2 decimales al dibujar a SVG"""
def to_svg_d(path,t=(1,0,0,1,0,0)):
    pen=SVGPathPen(None,ntos=lambda v:(f'{v:.2f}'.rstrip('0').rstrip('.')))
    path.draw(TransformPen(pen,t)); return pen.getCommands()
MASTER_D=to_svg_d(master_path())
# ---------- versiones ajustadas a píxel ----------
def pixel_path(N):
    """Geometría paramétrica con bordes rectos en píxel entero (unidades = px de un lienzo N×N).
    Devuelve (path, info). Las proporciones salen del maestro; solo se abre la abertura inferior derecha."""
    P={16:dict(x0=1,y0=2,W=14,H=12,S=3,foot=-0.4,hook=-1.0),
       32:dict(x0=1,y0=3,W=30,H=25,S=7,foot=-0.5,hook=-0.5),
       48:dict(x0=2,y0=5,W=44,H=37,S=10,foot=0,hook=0)}[N]
    x0,y0,W,H,S=P['x0'],P['y0'],P['W'],P['H'],P['S']; h=S/2
    kx=W/SYM_W; ky=H/SYM_H
    cx1=x0+h; top=y0+h; fy=y0+H-h
    R=32*kx                                   # radio del eje en la esquina (32 u en el maestro)
    footEnd=x0+(138-OX)*kx+P['foot']          # fin del eje del pie
    sx=x0+(154-OX)*kx                         # inicio del eje del brazo superior
    cx2=x0+W-h
    hookEnd=y0+(124-OY)*ky+P['hook']          # fin del eje del gancho
    p1=[(cx1,top),(cx1,fy-R),(cx1,fy),(cx1+R,fy),(footEnd,fy)]
    p2=[(sx,top),(cx2-R,top),(cx2,top),(cx2,top+R),(cx2,hookEnd)]
    return stroke_paths(p1,p2,S),P
if __name__=='__main__':
    print(MASTER_D[:300]); print(len(MASTER_D))
    for n in (16,32,48): p,P=pixel_path(n); print(n,p.bounds)
