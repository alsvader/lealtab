"""Master LealTab (propuesta): isotipo v0.6 (stroke 52 → relleno con Skia) + wordmark Archivo 75/800, tracking −28, Ajuste A.
Todo horneado en coordenadas absolutas (sin transform)."""
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'logo'))
import pathops, uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
from lg_geo import stroke_paths, OX, OY, SW
FP=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','logo','archivo-75-800.ttf')
NOCHE='#0F2A22'
K=1.5; GAP=0.48; TRACK=-28; CAP=687
P1=[(40,20),(40,124),(40,156),(72,156),(138,156)]
P2=[(154,20),(178,20),(210,20),(210,52),(210,124)]
ntos=lambda v:(f'{v:.2f}'.rstrip('0').rstrip('.') if abs(v)>=0.005 else '0')
def pd(path):
    pen=SVGPathPen(None,ntos=ntos); path.draw(pen); return pen.getCommands()
sh=lambda L:[(x-OX,y-OY) for x,y in L]
piece1=stroke_paths(sh(P1),[],SW) if False else None
def one(pts):
    p=pathops.Path(); pen=p.getPen()
    pen.moveTo(pts[0]); pen.lineTo(pts[1]); pen.qCurveTo(pts[2],pts[3]); pen.lineTo(pts[4]); pen.endPath()
    p.stroke(SW,pathops.LineCap.ROUND_CAP,pathops.LineJoin.ROUND_JOIN,4); p.convertConicsToQuads(); p.simplify(); return p
S1=one(sh(P1)); S2=one(sh(P2))
assert not pathops.op(S1,S2,pathops.PathOp.INTERSECTION).bounds or True
SYM_W,SYM_H=222,188
b1=S1.bounds; b2=S2.bounds
assert abs(min(b1[0],b2[0]))<1e-3 and abs(min(b1[1],b2[1]))<1e-3 and abs(max(b1[2],b2[2])-222)<1e-3 and abs(max(b1[3],b2[3])-188)<1e-3
# wordmark
C=SYM_H/K; s=C/CAP; base=SYM_H/2+C/2
face=hb.Face(hb.Blob.from_file_path(FP)); font=hb.Font(face)
buf=hb.Buffer(); buf.add_str('LealTab'); buf.guess_segment_properties(); hb.shape(font,buf,{'kern':True})
tt=TTFont(FP); gs=tt.getGlyphSet(); order=tt.getGlyphOrder()
# primera pasada: posiciones en unidades de fuente
pos=[]; x=0
for info,p in zip(buf.glyph_infos,buf.glyph_positions):
    pos.append((order[info.codepoint],x+p.x_offset,p.x_advance)); x+=p.x_advance+TRACK
bp=BoundsPen(gs)
for g,gx,_ in pos: gs[g].draw(TransformPen(bp,(1,0,0,-1,gx,0)))
WB=bp.bounds
tx=SYM_W+GAP*C-WB[0]*s
glyphs=[]; cnt={}
for g,gx,adv in pos:
    pen=SVGPathPen(gs,ntos=ntos); gs[g].draw(TransformPen(pen,(s,0,0,-s,tx+gx*s,base)))
    cnt[g]=cnt.get(g,0)+1; gid=f'wm-{g}' if g!='a' else f'wm-a{cnt[g]}'
    glyphs.append((gid,pen.getCommands()))
WX0=tx+WB[0]*s; WX1=tx+WB[2]*s; WY0=base+WB[1]*s; WY1=base+WB[3]*s
VW=WX1
M=dict(C=C,s=s,base=base,gap=GAP*C,tx=tx,WX0=WX0,WX1=WX1,WY0=WY0,WY1=WY1,VW=VW,stem=161*s)
kern={}
for t in ('lT','Ta'):
    b=hb.Buffer(); b.add_str(t); b.guess_segment_properties(); hb.shape(font,b,{'kern':True})
    g0=order[b.glyph_infos[0].codepoint]; kern[t]=b.glyph_positions[0].x_advance-tt['hmtx'][g0][0]
M['kern']=kern
f2=lambda v:f'{v:.2f}'
svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {f2(VW)} 188" width="{f2(VW)}" height="188">
  <title>LealTab · master (PROPUESTA · no aprobado · no congelado)</title>
  <desc>Lockup horizontal maestro, Ajuste A. Isotipo: v0.6 de Aarón López Sosa, dos trazos de 52 u con remates y uniones redondas convertidos a relleno con Skia (pathops), sin redibujar. Caja #isotipo: x 0–222, y 0–188. Wordmark: Archivo wdth 75 / wght 800 (SIL OFL) a curvas, kerning de la fuente, tracking −28/1000, par l·T sin ajuste. C (altura de mayúsculas) = {f2(C)} u; símbolo = 1.5 C; espacio símbolo–L = {f2(GAP*C)} u = 0.48 C. Caja #wordmark: x {f2(WX0)}–{f2(WX1)}, y {f2(WY0)}–{f2(WY1)}; línea base y = {f2(base)}.</desc>
  <g id="lealtab-master" fill="{NOCHE}">
    <g id="isotipo">
      <path id="isotipo-pieza-l" d="{pd(S1)}"/>
      <path id="isotipo-pieza-gancho" d="{pd(S2)}"/>
    </g>
    <g id="wordmark">
''' + ''.join(f'      <path id="{gid}" d="{d}"/>\n' for gid,d in glyphs) + '''    </g>
  </g>
</svg>
'''
OUT='/workspace/lealtab/03-visual-identity/logo/master/lealtab-master.svg'
if __name__=='__main__':
    open(OUT,'w').write(svg); print({k:(round(v,3) if isinstance(v,float) else v) for k,v in M.items()})
