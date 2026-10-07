import base64, io
from PIL import Image
from lg_px import hinted, naive, to_img
from lg_lock import *
NOCHE,LINO,CLARO,DUR,BOSQUE,MENTA,GRIS='#0F2A22','#F3EFE6','#FFFDF8','#FF9F6E','#0F4D3A','#CFE3D6','#4D635A'
def uri(im):
    b=io.BytesIO(); im.save(b,'PNG'); return 'data:image/png;base64,'+base64.b64encode(b.getvalue()).decode()
def pximg(n,fg=(15,42,34),bg=(243,239,230),mode='hinted'):
    a=hinted(n) if mode=='hinted' else naive(n); return uri(to_img(a,fg,bg))
def pxzoom(n,z,mode='hinted',fg=(15,42,34),bg=(243,239,230),grid=True):
    a=hinted(n) if mode=='hinted' else naive(n)
    im=to_img(a,fg,bg).resize((n*z,n*z),Image.NEAREST)
    if grid:
        from PIL import ImageDraw; d=ImageDraw.Draw(im)
        for i in range(0,n*z+1,z): d.line([(i,0),(i,n*z)],fill=(226,200,184)); d.line([(0,i),(n*z,i)],fill=(226,200,184))
    return uri(im)
def H(sym=NOCHE,txt=None,w=None,h=None,**k):
    vb,b,m=horizontal(sym,txt or sym,**k); return svgdoc(vb,b,w=w,h=h)
def V(sym=NOCHE,txt=None,w=None,h=None,**k):
    vb,b,m=vertical(sym,txt or sym,**k); return svgdoc(vb,b,w=w,h=h)
def I(c=NOCHE,w=None,h=None): vb,b,m=isotipo(c); return svgdoc(vb,b,w=w,h=h)
def WM(c=NOCHE,w=None,h=None): vb,b,m=wordmark(c); return svgdoc(vb,b,w=w,h=h)
HEAD='''<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="../r3fonts.css"><link rel="stylesheet" href="../ciclo-v2.css">
<style>.wrap{padding:26px 40px;height:1000px;display:flex;flex-direction:column;gap:14px}
.head{display:flex;justify-content:space-between;align-items:flex-end}
h1{font-size:50px;line-height:.86;text-transform:uppercase}
.hn{font-size:12.5px;max-width:760px;text-align:right;line-height:1.45;color:#2E4A40}
.pn{border:2px solid var(--noche);border-radius:12px;position:relative;display:flex;flex-direction:column;padding:12px 14px;min-height:0}
.pn .t{font-family:'Archivo';font-stretch:75%;font-weight:800;font-size:17px;text-transform:uppercase;letter-spacing:.01em;line-height:1}
.pn .c{flex:1;display:grid;place-items:center;min-height:0}
.pn .n{font-size:11px;line-height:1.38;color:#2E4A40}
.c svg{max-width:100%;height:auto}
.dk{background:var(--noche);color:var(--lino)} .dk .n{color:#CFD8D2}
</style>'''
def ORIG_SVG(stroke=NOCHE):   # isotipo v0.6 tal cual (trazos)
    return (f'<g fill="none" stroke="{stroke}" stroke-width="52" stroke-linecap="round" stroke-linejoin="round">'
            '<path d="M40 20 V124 Q40 156 72 156 H138"/><path d="M154 20 H178 Q210 20 210 52 V124"/></g>')
