"""Lockups finales. Todas las medidas en unidades del isotipo maestro (222 × 188)."""
from lg_geo import MASTER_D, SYM_W, SYM_H, SW
from lg_word import WD, WB, CAP, STEM
H_K=1.5          # alto del símbolo / altura de mayúsculas (horizontal)
H_GAP=0.48       # espacio símbolo → fuste de la L, en alturas de mayúsculas (medido; ópticamente ≈ 0.5)
V_K=2.0          # alto del símbolo / altura de mayúsculas (vertical)
V_GAP=0.45       # espacio base del símbolo → línea de mayúsculas, en alturas de mayúsculas
def fmt(v): s=f'{v:.2f}'.rstrip('0').rstrip('.'); return '0' if s=='-0' else s
def wordg(s,tx,ty,fill): return f'<path transform="translate({fmt(tx)} {fmt(ty)}) scale({s:.6f})" fill="{fill}" d="{WD}"/>'
def symg(fill,tx=0,ty=0,sc=1):
    tr='' if (tx,ty,sc)==(0,0,1) else f' transform="translate({fmt(tx)} {fmt(ty)})'+(f' scale({sc:.6f})' if sc!=1 else '')+'"'
    return f'<path{tr} fill="{fill}" d="{MASTER_D}"/>'
def horizontal(sym,txt,k=H_K,gap=H_GAP):
    C=SYM_H/k; s=C/CAP; base=SYM_H/2+C/2
    tx=SYM_W+gap*C-WB[0]*s; right=tx+WB[2]*s
    return (0,0,right,SYM_H), symg(sym)+wordg(s,tx,base,txt), dict(C=C,s=s,gap=gap*C,stem=STEM*s,x=SW)
def vertical(sym,txt,k=V_K,gap=V_GAP):
    C=SYM_H/k; s=C/CAP; ww=(WB[2]-WB[0])*s
    W=max(ww,SYM_W); sx=(W-SYM_W)/2; tx=(W-ww)/2-WB[0]*s; base=SYM_H+gap*C+C
    return (0,0,W,base+WB[3]*s), symg(sym,sx,0)+wordg(s,tx,base,txt), dict(C=C,s=s,ww=ww,gap=gap*C,x=SW)
def isotipo(sym): return (0,0,SYM_W,SYM_H), symg(sym), dict(x=SW)
def wordmark(txt,C=SYM_H/H_K):
    s=C/CAP; tx=-WB[0]*s; top=-WB[1]*s; return (0,0,(WB[2]-WB[0])*s,(WB[3]-WB[1])*s), wordg(s,tx,top,txt), dict(C=C,s=s,x=SW*C/(SYM_H/H_K))
def svgdoc(vb,body,w=None,h=None,title=None,pad=0,bg=None):
    x,y,W,H=vb; vbs=f'{fmt(x-pad)} {fmt(y-pad)} {fmt(W+2*pad)} {fmt(H+2*pad)}'
    a=(f' width="{fmt(w)}"' if w else '')+(f' height="{fmt(h)}"' if h else '')
    t=f'<title>{title}</title>' if title else ''
    b=f'<rect x="{fmt(x-pad)}" y="{fmt(y-pad)}" width="{fmt(W+2*pad)}" height="{fmt(H+2*pad)}" fill="{bg}"/>' if bg else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vbs}"{a}>{t}{b}{body}</svg>'
