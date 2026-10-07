from r3geo import *
from r3lock import horizontal, vertical, svgwrap
from r3px import raster16
NOCHE,BOSQUE,DUR,LINO,CLARO='#0F2A22','#0F4D3A','#FF9F6E','#F3EFE6','#FFFDF8'
PX_L,_=raster16(BOSQUE,LINO,'pxl'); PX_D,_=raster16(LINO,BOSQUE,'pxd')
INFO={
'A':('A · Fiel refinada','Recomendada','Tu símbolo, redibujado en relleno: fuste 13 u, pie 12 u, esquinas R14/r4, remates redondos y aberturas ópticas de 8 y 7.5 u (diagonal). Cuadrado de 50 u.'),
'B':('B · Más cerrada','Variación','Sólo cambia la separación: 4 u arriba y 4.7 u en diagonal abajo. Se lee como un cuadro casi cerrado; más tensión y menos aire.'),
'C':('C · Remate recto','Variación','Sólo cambian los remates: corte recto con canto de 1.5 u (aberturas de 8 u). Más firme y neobrutal; se emparenta con la L de Archivo.'),
'D':('D · Esquina tensa','Variación','Sólo cambia el radio exterior: R7/r2 en lugar de R14/r4. Más cuadrado y compacto; pierde parte de la suavidad.'),
}
NOTE={
'A':'<b>Vs. tu boceto (gris):</b> de trazo a forma, cuadrado en vez de apaisado, aberturas iguales (antes 46 y 13 px), radio interior real y fuste/pie compensados. <b>Parecido:</b> estructura de MIT Lincoln Lab y Light Work; lo separan el gancho corto y los remates redondos.',
'B':'<b>A favor:</b> más “ciclo cerrado”. <b>En contra:</b> a 16 px las aberturas casi desaparecen y queda un cuadro; en marketing el contorno las estrecha más. <b>Parecido:</b> se lee más como cuadro con muescas (enmarcar).',
'C':'<b>A favor:</b> case con los cortes rectos de Archivo; más neobrutal. <b>En contra:</b> menos amable que tu boceto. <b>Parecido:</b> comparte el remate recto de Lasso (competidor) y de los íconos de “recortar”.',
'D':'<b>A favor:</b> más presencia a 16 px. <b>En contra:</b> pierde la curva de tu boceto. <b>Parecido:</b> la más cercana a MIT Lincoln Lab y a los corchetes de “recortar” y “pantalla completa”.',
}
def guide(k):
    p=VAR[k]; X0,X1,Y0,Y1,Tv,Th,R,r,g=(p[q] for q in 'X0 X1 Y0 Y1 Tv Th R r g'.split()); gb=p['gb']; sh=p['short']
    o='<g fill="none" stroke="#C2560F" stroke-width=".22">'
    o+=''.join(f'<path d="M{i} 0V64M0 {i}H64" opacity=".35"/>' for i in range(4,64,4) if i%8)
    o+=''.join(f'<path d="M{i} 0V64M0 {i}H64" stroke-dasharray=".8 .8" opacity=".8"/>' for i in range(8,64,8))
    o+=f'<rect x="{X0}" y="{Y0}" width="{X1-X0}" height="{Y1-Y0}" stroke-width=".4"/>'
    # radios
    o+=f'<circle cx="{X0+R}" cy="{Y1-R}" r="{R}" opacity=".9"/><circle cx="{X1-R}" cy="{Y0+R}" r="{R}" opacity=".9"/>'
    o+=f'<circle cx="{X0+Tv+r}" cy="{Y1-Th-r}" r="{r}"/><circle cx="{X1-Tv-r}" cy="{Y0+Th+r}" r="{r}"/>'
    if p['term']=='round':
        Xe=X1-Tv-gb
        o+=f'<circle cx="{X0+Tv/2}" cy="{Y0-p["ov"]+Tv/2}" r="{Tv/2}"/><circle cx="{Xe-Th/2}" cy="{Y1-Th/2}" r="{Th/2}"/>'
        o+=f'<circle cx="{X1-Tv/2}" cy="{Y1-sh-Tv/2}" r="{Tv/2}"/><circle cx="{X0+X1-Xe+Th/2}" cy="{Y0+Th/2}" r="{Th/2}"/>'
    o+='</g><g fill="#C2560F" font-family="Manrope" font-weight="800" font-size="2.6">'
    o+=f'<text x="{X0+Tv/2}" y="{(Y0+Y1)/2-2}" text-anchor="middle" fill="{LINO}">{f(Tv)}</text>'
    o+=f'<text x="{(X0+X1)/2-6}" y="{Y1-Th/2+1}" text-anchor="middle" fill="{LINO}">{f(Th)}</text>'
    Xe=X1-Tv-gb; yt=Y0+Th/2
    o+=f'<path d="M{X0+Tv} {yt}H{X0+Tv+g}" stroke="#C2560F" stroke-width=".45"/>'
    o+=f'<text x="{X0+Tv+g/2}" y="{Y0-1.6}" text-anchor="middle">{f(g)}</text>'
    if p['term']=='round':
        import math
        ax,ay=Xe-Th/2,Y1-Th/2; bx,by=X1-Tv/2,Y1-sh-Tv/2; L=math.hypot(bx-ax,by-ay); ux,uy=(bx-ax)/L,(by-ay)/L
        p1=(ax+ux*Th/2,ay+uy*Th/2); p2=(bx-ux*Tv/2,by-uy*Tv/2); gd=L-Th/2-Tv/2
        o+=f'<path d="M{f(p1[0])} {f(p1[1])}L{f(p2[0])} {f(p2[1])}" stroke="#C2560F" stroke-width=".45"/>'
        o+=f'<text x="{f(X1-Tv/2+1)}" y="{Y1+3.6}" text-anchor="middle">{gd:.1f}</text>'
    else:
        yb=(Y1-Th+Y1-sh)/2
        o+=f'<path d="M{Xe} {yb}H{X1-Tv}" stroke="#C2560F" stroke-width=".45"/>'
        o+=f'<text x="{X1-Tv-gb/2}" y="{Y1+3.6}" text-anchor="middle">{f(gb)}</text>'
    o+=f'<text x="{X0-1}" y="{Y1+3.6}" text-anchor="end">R{f(R)}</text>'
    o+=f'<text x="{X0+Tv+r+1.5}" y="{Y1-Th-r-1.5}">r{f(r)}</text>'
    o+='</g>'
    return o
def big(k,size=292):
    return (f'<svg viewBox="0 0 64 64" width="{size}" height="{size}"><rect width="64" height="64" fill="{LINO}"/>'
            f'<path d="{d(k)}" fill="{BOSQUE}"/>{guide(k)}</svg>')
_mid=[0]
def mk(k,size=62,fill=LINO,line=NOCHE,sh=3.2,sw=2.6):
    _mid[0]+=1; cid=f'c{k}{_mid[0]}'; p=d(k)
    return (f'<svg viewBox="0 0 64 64" width="{size}" height="{size}"><defs><clipPath id="{cid}"><path d="{p}"/></clipPath></defs>'
            f'<path d="{p}" transform="translate({sh} {sh})" fill="{line}"/><path d="{p}" fill="{fill}"/>'
            f'<path d="{p}" fill="none" stroke="{line}" stroke-width="{sw*2}" clip-path="url(#{cid})"/></svg>')
def s16(k,dark=False):
    if k=='A': return f'<img src="{PX_D if dark else PX_L}" width="16" height="16">'
    return svg(k,LINO if dark else BOSQUE,16)
def ctx(k):
    fav=s16('A') if k=='A' else svg(k,BOSQUE,16)
    return (f'<div class="ctx"><div class="tab">{fav}<span>LealTab · Clientes</span><b>×</b></div>'
            f'<div class="app">{svg(k,LINO,34)}</div><div class="app" style="background:var(--lino)">{svg(k,BOSQUE,34)}</div></div>')
def lockh(k,h=40):
    vb,body,_=horizontal(k,BOSQUE,NOCHE,pad=0); return svgwrap(vb,body,h=h)
REF='<svg viewBox="140 102 250 216" width="58" height="50" style="flex:none"><g fill="none" stroke="#4D635A" stroke-width="58" stroke-linecap="round" stroke-linejoin="round"><path d="M180 142 V246 Q180 278 212 278 H284"/><path d="M284 142 H316 Q348 142 348 174 V246"/></g></svg>'
cards=''
for k in 'ABCD':
    n,badge,idea=INFO[k]
    zoom=(f'<div class="sz zm"><img src="{PX_L}" width="48" height="48" style="image-rendering:pixelated"><em>16 ×3</em></div>' if k=='A' else '')
    lbl16='16 ajust.' if k=='A' else '16'
    cards+=f'''<div class="card box">
 <div class="hd"><div class="disp nm">{n}</div><span class="stk flat" style="background:{'var(--durazno)' if k=='A' else 'var(--menta)'}">{badge}</span></div>
 <p class="idea">{idea}</p>
 <div class="big">{big(k)}</div>
 <div class="vars">
  <div class="v" style="background:var(--claro)">{svg(k,NOCHE,62)}<span>Un color</span></div>
  <div class="v" style="background:var(--bosque);color:var(--lino)">{svg(k,LINO,62)}<span>Negativo</span></div>
  <div class="v" style="background:var(--durazno)">{mk(k,66)}<span>Marketing</span></div>
 </div>
 <div class="sizes">
  <div class="sz">{svg(k,BOSQUE,64)}<em>64</em></div><div class="sz">{svg(k,BOSQUE,32)}<em>32</em></div><div class="sz">{s16(k)}<em>{lbl16}</em></div>{zoom}
  <div class="sz dk">{svg(k,LINO,32)}<em>32</em></div><div class="sz dk">{s16(k,True)}<em>16</em></div>
 </div>
 {ctx(k)}
 <div class="lock">{lockh(k,46)}</div>
 {('<div class="refrow">'+REF+'<p class="risk" style="border:0;padding:0">'+NOTE[k]+'</p></div>') if k=='A' else '<p class="risk">'+NOTE[k]+'</p>'}
</div>'''
html=f'''<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="r3fonts.css"><link rel="stylesheet" href="ciclo-v2.css">
<style>
.wrap{{padding:26px 40px;height:1000px;display:flex;flex-direction:column;gap:14px}}
.head{{display:flex;justify-content:space-between;align-items:flex-end}}
h1{{font-size:50px;line-height:.86;text-transform:uppercase}}
.grid{{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;flex:1;min-height:0}}
.card{{padding:13px 16px;display:flex;flex-direction:column;gap:8px}}
.hd{{display:flex;justify-content:space-between;align-items:center}}
.nm{{font-size:26px;text-transform:uppercase;line-height:1}}
.idea{{font-size:12.3px;line-height:1.36;color:#2E4A40;min-height:50px}}
.big{{background:var(--lino);border:1.5px solid var(--noche);border-radius:12px;display:grid;place-items:center;height:318px;overflow:hidden}}
.vars{{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}}
.v{{border:1.5px solid var(--noche);border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:3px;padding:6px 4px 5px}}
.v span{{font-size:9.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}}
.sizes{{display:flex;border:1.5px solid var(--noche);border-radius:10px;overflow:hidden}}
.sz{{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:4px;padding:7px 4px 5px;flex:1;background:var(--lino)}}
.sz.zm{{background:var(--claro);border-left:1px dashed #4D635A}}
.sz.dk{{background:var(--bosque);color:var(--lino)}}
.sz em{{font-style:normal;font-size:9.5px;font-weight:700;opacity:.8;white-space:nowrap}}
.ctx{{display:flex;gap:8px;align-items:center}}
.tab{{flex:1;display:flex;align-items:center;gap:7px;background:var(--lino);border:1.5px solid var(--noche);border-radius:9px 9px 0 0;border-bottom:0;padding:8px 10px;font-size:11.5px;font-weight:600;height:36px;align-self:flex-end}}
.tab b{{margin-left:auto;font-weight:600;opacity:.6}}
.app{{width:50px;height:50px;border-radius:12px;background:var(--bosque);border:1.5px solid var(--noche);display:grid;place-items:center;flex:none}}
.lock{{display:flex;align-items:center;padding:4px 2px}}
.refrow{{display:flex;gap:10px;align-items:center;border-top:1.5px solid var(--noche);padding-top:7px}}
.risk{{font-size:11.6px;line-height:1.36;color:#2E4A40;border-top:1.5px solid var(--noche);padding-top:7px}}
</style></head><body><div class="wrap">
<div class="head"><div><div class="lbl" style="margin-bottom:8px">LealTab · Fase 3 · Isotipo, ronda 3 · sobre el boceto de Aarón</div><h1 class="disp">Tu símbolo, profesionalizado</h1></div>
<div style="font-size:12.5px;max-width:760px;text-align:right;line-height:1.45;color:#2E4A40">Formas rellenas en retícula de 64 u (área viva 7–57). Cada variación cambia un solo parámetro respecto a A. Tamaños reales de 64, 32 y 16 px; en A, el 16 px va ajustado a píxel. “LealTab” en curvas: Archivo 75/800.</div></div>
<div class="grid">{cards}</div>
</div></body></html>'''
open('isotipo-r3.html','w').write(html)
print('ok')
