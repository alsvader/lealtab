from iso import *
import re
RISK={'regreso':'Espiral genérica; puede leerse como “6”, “G” o un ícono de carga. A 16 px el hueco interior queda cerca de 1 px.',
'esquina':'La L no es evidente sin explicarla; puede leerse como “D” o arco con pie. No encontré parecido directo con logos conocidos.',
'vueltas':'Los aros concéntricos recuerdan a Target (cerrados, en rojo) y a íconos de señal. Los huecos alineados lo separan, pero hay que vigilarlo.',
'siguiente':'Con el punto arriba se acercaría al símbolo de encendido; por eso va a la 1 en punto y dentro del trazo. Revisar contra íconos de “cargando”.'}
def thick(inner,col,extra):
    def bump(m): return f'stroke-width="{float(m.group(1))+extra:.2f}"'
    t=re.sub(r'stroke-width="([0-9.]+)"',bump,inner).replace('currentColor',col)
    return f'<g fill="{col}" stroke="{col}" stroke-width="{extra}" stroke-linejoin="round" color="{col}">{t}</g>'
def shadow(fn):
    inner=fn()
    fillc=inner.replace('currentColor','#F3EFE6')
    return (f'<svg viewBox="-3 -3 72 72" width="100%" height="100%"><g transform="translate(3.5 3.5)">{thick(inner,"#0F2A22",3)}</g>'
            f'{thick(inner,"#0F2A22",3)}<g fill="#F3EFE6" color="#F3EFE6">{fillc}</g></svg>')
CTX=lambda fn: f'''<div class="ctx"><div class="tab">{svg(fn,"#0F4D3A",16)}<span>LealTab · Clientes</span><b>×</b></div><div class="app">{svg(fn,"#F3EFE6",34)}</div><div class="app" style="background:var(--lino)">{svg(fn,"#0F4D3A",34)}</div></div>'''
GUIDE='<svg viewBox="0 0 64 64" width="224" height="224" style="position:absolute;inset:0"><g fill="none" stroke="#C2560F" stroke-width=".25" opacity=".55">'+''.join(f'<path d="M{i} 0V64M0 {i}H64" stroke-dasharray=".8 .8"/>' for i in range(8,64,8))+'<circle cx="32" cy="32" r="29"/><circle cx="32" cy="32" r="20.5"/><circle cx="32" cy="32" r="12"/><path d="M32 0V64M0 32H64" stroke-width=".4" stroke-dasharray="none"/></g></svg>'
cards=''
for k,n,idea,fn in CONCEPTS:
    cards+=f'''<div class="card box">
 <div class="hd"><div class="disp nm">{n}</div><span class="stk flat" style="background:var(--menta)">Concepto</span></div>
 <p class="idea">{idea}</p>
 <div class="big"><div style="position:relative;width:224px;height:224px">{GUIDE}<div style="position:absolute;inset:0">{svg(fn,"#0F4D3A",224)}</div></div></div>
 <div class="vars">
  <div class="v" style="background:var(--claro)">{svg(fn,"#0F2A22",64)}<span>Un color</span></div>
  <div class="v" style="background:var(--bosque);color:var(--lino)">{svg(fn,"#F3EFE6",64)}<span>Negativo</span></div>
  <div class="v" style="background:var(--durazno)"><div style="width:66px;height:66px">{shadow(fn)}</div><span>Marketing</span></div>
 </div>
 <div class="sizes">
  <div class="sz">{svg(fn,"#0F4D3A",64)}<em>64</em></div><div class="sz">{svg(fn,"#0F4D3A",32)}<em>32</em></div><div class="sz">{svg(fn,"#0F4D3A",16)}<em>16</em></div>
  <div class="sz dk">{svg(fn,"#F3EFE6",32)}<em>32</em></div><div class="sz dk">{svg(fn,"#F3EFE6",16)}<em>16</em></div>
 </div>
 {CTX(fn)}
 <div class="lock">{svg(fn,"#0F4D3A",40)}<span class="disp">LealTab</span></div>
 <p class="risk"><b>Riesgo:</b> {RISK[k]}</p>
</div>'''
html=f'''<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Manrope:wght@400;500;600;700;800&display=block" rel="stylesheet">
<link rel="stylesheet" href="ciclo-v2.css">
<style>
.wrap{{padding:30px 40px;height:1000px;display:flex;flex-direction:column;gap:18px}}
.head{{display:flex;justify-content:space-between;align-items:flex-end}}
h1{{font-size:50px;line-height:.86;text-transform:uppercase}}
.grid{{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;flex:1;min-height:0}}
.card{{padding:16px 18px;display:flex;flex-direction:column;gap:10px}}
.hd{{display:flex;justify-content:space-between;align-items:center}}
.nm{{font-size:32px;text-transform:uppercase;line-height:1}}
.idea{{font-size:13.5px;line-height:1.4;color:#2E4A40;min-height:52px}}
.big{{background:var(--lino);border:1.5px solid var(--noche);border-radius:12px;display:grid;place-items:center;height:300px}}
.vars{{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}}
.v{{border:1.5px solid var(--noche);border-radius:10px;display:flex;flex-direction:column;align-items:center;gap:4px;padding:9px 4px 6px}}
.v span{{font-size:9.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}}
.sizes{{display:flex;align-items:flex-end;gap:0;border:1.5px solid var(--noche);border-radius:10px;overflow:hidden}}
.sz{{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:4px;padding:8px 6px 5px;flex:1;background:var(--lino);align-self:stretch}}
.sz.dk{{background:var(--bosque);color:var(--lino)}}
.sz em{{font-style:normal;font-size:9.5px;font-weight:700;opacity:.75}}
.ctx{{display:flex;gap:8px;align-items:center}}
.tab{{flex:1;display:flex;align-items:center;gap:7px;background:var(--lino);border:1.5px solid var(--noche);border-radius:9px 9px 0 0;border-bottom:0;padding:8px 10px;font-size:11.5px;font-weight:600;height:36px;align-self:flex-end}}
.tab b{{margin-left:auto;font-weight:600;opacity:.6}}
.app{{width:50px;height:50px;border-radius:12px;background:var(--bosque);border:1.5px solid var(--noche);display:grid;place-items:center;flex:none}}
.lock{{display:flex;align-items:center;gap:10px;padding:6px 2px}}
.lock span{{font-size:40px;line-height:1;color:var(--noche)}}
.risk{{font-size:12px;line-height:1.38;color:#2E4A40;border-top:1.5px solid var(--noche);padding-top:8px}}
</style></head><body><div class="wrap">
<div class="head"><div><div class="lbl" style="margin-bottom:8px">LealTab · Fase 3 · Exploración de isotipo</div><h1 class="disp">Cuatro conceptos desde el aro</h1></div>
<div style="font-size:12.5px;max-width:700px;text-align:right;line-height:1.45;color:#2E4A40">Símbolos planos sobre retícula de 64 unidades, sin sombra: la sombra dura es un tratamiento de marketing, no parte del isotipo. Tamaños reales de 64, 32 y 16 px. El nombre va en texto, en composición preliminar (no es el logotipo final).</div></div>
<div class="grid">{cards}</div>
</div></body></html>'''
open('isotipo-exploracion.html','w').write(html)
