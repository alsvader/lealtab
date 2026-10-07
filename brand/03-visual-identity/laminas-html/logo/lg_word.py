"""Logotipo LealTab en contornos: Archivo (OFL) instancia wdth 75 / wght 800.
Kerning de la fuente (HarfBuzz) + tracking uniforme de −28/1000. El par l·T no recibe ajuste manual."""
import uharfbuzz as hb, os
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
FP=os.path.join(os.path.dirname(os.path.abspath(__file__)),'archivo-75-800.ttf')
CAP=687; STEM=161; TRACK=-28
def word(text='LealTab',track=TRACK):
    face=hb.Face(hb.Blob.from_file_path(FP)); font=hb.Font(face)
    buf=hb.Buffer(); buf.add_str(text); buf.guess_segment_properties(); hb.shape(font,buf,{'kern':True})
    tt=TTFont(FP); gs=tt.getGlyphSet(); order=tt.getGlyphOrder()
    pen=SVGPathPen(gs,ntos=lambda v:f'{v:.1f}'.rstrip('0').rstrip('.')); bp=BoundsPen(gs); x=0; pairs=[]
    for i,(info,pos) in enumerate(zip(buf.glyph_infos,buf.glyph_positions)):
        g=order[info.codepoint]; t=(1,0,0,-1,x+pos.x_offset,0)
        gs[g].draw(TransformPen(pen,t)); gs[g].draw(TransformPen(bp,t))
        pairs.append((g,x,pos.x_advance)); x+=pos.x_advance+track
    return pen.getCommands(), bp.bounds, pairs
WD,WB,PAIRS=word()
if __name__=='__main__':
    print(WB, PAIRS)
    face=hb.Face(hb.Blob.from_file_path(FP)); font=hb.Font(face)
    for t in ['lT','Ta','Le']:
        b=hb.Buffer(); b.add_str(t); b.guess_segment_properties(); hb.shape(font,b,{'kern':True}); print(t,[p.x_advance for p in b.glyph_positions])
