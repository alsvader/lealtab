"""Logotipo LealTab en curvas: Archivo, ancho 75, peso 800 (instancia estática OFL generada con fontTools).
Kerning con HarfBuzz, tracking -10/1000."""
import uharfbuzz as hb, os
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
FP=os.path.join(os.path.dirname(os.path.abspath(__file__)),'archivo-75-800.ttf')
CAP=687; STEM=161
def word(text='LealTab',track=-10):
    blob=hb.Blob.from_file_path(FP); face=hb.Face(blob); font=hb.Font(face)
    buf=hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
    hb.shape(font,buf,{'kern':True,'liga':True})
    tt=TTFont(FP); gs=tt.getGlyphSet(); order=tt.getGlyphOrder()
    pen=SVGPathPen(gs); bp=BoundsPen(gs); x=0
    for info,pos in zip(buf.glyph_infos,buf.glyph_positions):
        g=order[info.codepoint]
        t=(1,0,0,-1,x+pos.x_offset,0)   # y hacia abajo, línea base en y=0
        gs[g].draw(TransformPen(pen,t)); gs[g].draw(TransformPen(bp,t))
        x+=pos.x_advance+track
    return pen.getCommands(), bp.bounds   # bounds en unidades de fuente (y invertida)
if __name__=='__main__':
    d,b=word(); print(b, len(d))
