"""Lockups de LealTab r3 (unidades de la retícula del símbolo, 64 u)."""
from r3geo import d, VAR, f
from r3word import word, CAP, STEM
WD,WB=word()            # trazado y límites en unidades de fuente
SX0,SX1,SY0,SY1=7,57,7,57   # caja viva del símbolo
# Horizontal
H_K=1.45                # alto del símbolo / altura de mayúsculas
H_GAP=18                # espacio óptico símbolo → fuste de la L (u)
# Vertical
V_K=1.9
V_GAP=12                # espacio símbolo → altura de mayúsculas (u)
X=13                    # unidad de protección = fuste vertical del símbolo (Tv)
def _word_g(s,tx,ty,fill):
    return f'<path transform="translate({f(tx)} {f(ty)}) scale({s:.6f})" d="{WD}" fill="{fill}"/>'
def horizontal(k='A',sym='#0F4D3A',txt='#0F2A22',pad=None):
    C=(SY1-SY0)/H_K; s=C/CAP
    base=(SY0+SY1)/2+C/2
    tx=SX1+H_GAP-WB[0]*s
    right=tx+WB[2]*s
    pad=2*X if pad is None else pad
    vb=(SX0-pad,SY0-pad,right-SX0+2*pad,SY1-SY0+2*pad)
    body=f'<path d="{d(k)}" fill="{sym}"/>'+_word_g(s,tx,base,txt)
    return vb,body,dict(C=C,s=s,right=right,stem=STEM*s)
def vertical(k='A',sym='#0F4D3A',txt='#0F2A22',pad=None):
    C=(SY1-SY0)/V_K; s=C/CAP
    ww=(WB[2]-WB[0])*s
    cx=(SX0+SX1)/2
    tx=cx-ww/2-WB[0]*s
    base=SY1+V_GAP+C
    pad=2*X if pad is None else pad
    left=min(SX0,cx-ww/2); right=max(SX1,cx+ww/2)
    vb=(left-pad,SY0-pad,right-left+2*pad,base-SY0+2*pad)
    body=f'<path d="{d(k)}" fill="{sym}"/>'+_word_g(s,tx,base,txt)
    return vb,body,dict(C=C,s=s,left=left,right=right,base=base,stem=STEM*s)
def svgwrap(vb,body,h=None,w=None,extra=''):
    a=f' height="{h}"' if h else ''; a+=f' width="{w}"' if w else ''
    return f'<svg viewBox="{" ".join(f(v) for v in vb)}"{a}{extra}>{body}</svg>'
