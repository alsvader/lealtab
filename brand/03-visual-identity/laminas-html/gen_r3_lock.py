from r3geo import *
from r3lock import horizontal, vertical, svgwrap, X, H_K, H_GAP, V_K, V_GAP
NOCHE,BOSQUE,DUR,LINO,CLARO='#0F2A22','#0F4D3A','#FF9F6E','#F3EFE6','#FFFDF8'
def prot(vb,inner,col,pad):
    # caja de protección (= vb completo) y caja del logo; marcas de x
    x,y,w,h=vb
    o=f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" fill="none" stroke="{col}" stroke-width=".7" stroke-dasharray="2 1.6"/>'
    ix,iy,iw,ih=inner
    o+=f'<rect x="{f(ix)}" y="{f(iy)}" width="{f(iw)}" height="{f(ih)}" fill="none" stroke="{col}" stroke-width=".4" opacity=".6"/>'
    # cuadritos de x en las esquinas
    for cx,cy in [(x,y),(x+w-pad,y),(x,y+h-pad),(x+w-pad,y+h-pad)]:
        o+=f'<rect x="{f(cx)}" y="{f(cy)}" width="{pad}" height="{pad}" fill="{col}" opacity=".13"/>'
    o+=f'<text x="{f(x+pad/2)}" y="{f(y+pad/2+2.4)}" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="7" fill="{col}">2x</text>'
    return o
def panel(bg,sym,txt,guide,label,sub):
    vbh,bh,mh=horizontal('A',sym,txt); vbv,bv,mv=vertical('A',sym,txt)
    pad=2*X
    gh=prot(vbh,(vbh[0]+pad,vbh[1]+pad,vbh[2]-2*pad,vbh[3]-2*pad),guide,pad)
    gv=prot(vbv,(vbv[0]+pad,vbv[1]+pad,vbv[2]-2*pad,vbv[3]-2*pad),guide,pad)
    # medida x sobre el fuste
    gh+=f'<path d="M7 3H20" stroke="{guide}" stroke-width=".6"/><text x="13.5" y="0.6" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="6.5" fill="{guide}">x</text>'
    return f'''<div class="pn" style="background:{bg};color:{txt}">
<div class="pl"><span class="lbl" style="color:{txt};opacity:.8">{label}</span><span class="sub">{sub}</span></div>
<div class="h">{svgwrap(vbh,gh+bh,w=430)}</div>
<div class="vv">{svgwrap(vbv,gv+bv,h=290)}</div></div>'''
_,_,mh=horizontal(); _,_,mv=vertical()
panels=(panel(LINO,BOSQUE,NOCHE,'#C2560F','Sobre lino','Símbolo bosque · logotipo noche')+
        panel(BOSQUE,LINO,LINO,DUR,'Sobre bosque','Todo en lino')+
        panel(DUR,NOCHE,NOCHE,NOCHE,'Sobre durazno','Todo en noche (regla de paleta)'))
spec=f'''<div class="spec">
<div><b>Horizontal.</b> Símbolo = {H_K} × altura de mayúsculas. El fuste del símbolo (13 u) pesa {13/mh["stem"]:.2f} veces el fuste de Archivo 800 ({mh["stem"]:.1f} u): compensa que el símbolo es una masa abierta. Centro del símbolo = centro de la altura de mayúsculas. Espacio símbolo → L: {H_GAP} u (≈ {H_GAP/mh["C"]:.2f} de la altura de mayúsculas).</div>
<div><b>Vertical.</b> Símbolo = {V_K} × altura de mayúsculas, centrado sobre el ancho de tinta del logotipo. Espacio símbolo → mayúsculas: {V_GAP} u (casi un fuste). Para avatares, empaques y portadas.</div>
<div><b>Protección preliminar.</b> x = fuste vertical del símbolo. Margen libre de 2x por lado en ambas versiones. <b>Mínimos:</b> horizontal 100 px de ancho (símbolo de 23 px); vertical 60 px de ancho; el símbolo solo baja a 16 px con la versión ajustada a píxel.</div>
<div><b>Logotipo.</b> “LealTab” en curvas desde Archivo (OFL), ancho 75, peso 800, kerning de la fuente y tracking −10/1000. Sin ajustes de dibujo por ahora: se revisan T·a y l·T cuando se apruebe la dirección.</div>
</div>'''
html=f'''<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="r3fonts.css"><link rel="stylesheet" href="ciclo-v2.css">
<style>
.wrap{{padding:26px 40px;height:1000px;display:flex;flex-direction:column;gap:16px}}
.head{{display:flex;justify-content:space-between;align-items:flex-end}}
h1{{font-size:50px;line-height:.86;text-transform:uppercase}}
.grid{{display:grid;grid-template-columns:repeat(3,1fr);gap:22px;flex:1;min-height:0}}
.pn{{border:2.5px solid var(--noche);border-radius:14px;box-shadow:5px 5px 0 var(--noche);display:flex;flex-direction:column;align-items:center;justify-content:space-between;padding:16px 18px 26px;gap:10px}}
.pl{{align-self:stretch;display:flex;justify-content:space-between;align-items:baseline}}
.sub{{font-size:11.5px;font-weight:600;opacity:.8}}
.h{{display:grid;place-items:center;flex:1}}
.vv{{display:grid;place-items:center;flex:1.5}}
.spec{{display:grid;grid-template-columns:repeat(4,1fr);gap:22px;font-size:12px;line-height:1.42;color:#2E4A40;border-top:1.5px solid var(--noche);padding-top:12px}}
</style></head><body><div class="wrap">
<div class="head"><div><div class="lbl" style="margin-bottom:8px">LealTab · Fase 3 · Isotipo, ronda 3 · Lockups de la versión A</div><h1 class="disp">Símbolo y nombre, juntos</h1></div>
<div style="font-size:12.5px;max-width:640px;text-align:right;line-height:1.45;color:#2E4A40">Lockup horizontal (uso principal) y vertical. Las líneas punteadas marcan el área de protección preliminar de 2x, donde x es el fuste del símbolo. Colores según las combinaciones aprobadas de la paleta.</div></div>
<div class="grid">{panels}</div>
{spec}
</div></body></html>'''
open('isotipo-r3-lockups.html','w').write(html); print('ok', mh, mv)
