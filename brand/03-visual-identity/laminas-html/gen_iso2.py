from fin import *
IDEA={'encaje':'Una L sólida y la pieza de vuelta que encaja en su hueco: el negocio pone la base, el cliente cierra el ciclo.',
'vuelta':'Un cuarto de vuelta que guarda una L en su contraforma: cada regreso completa la vuelta y la marca está adentro.',
'pasale':'Un marco en L con la puerta entreabierta: el “pásale” del negocio de barrio, el lugar al que se regresa.',
'visitas':'Tres módulos que arman la L, uno por visita; la última pieza ya trae el arco que cierra la vuelta.'}
RISK={'encaje':'Medio-bajo. Familia de monogramas “L + geometría” en fintech (LUCA Plus, Lilly Finance, plantillas de stock) y el cuarto de círculo de Slice; ninguno con esta silueta.',
'vuelta':'Bajo. Hay plantillas “L en espacio negativo”, pero no de cuarto de círculo. A vigilar: lectura de gráfica de pastel o escuadra.',
'pasale':'Medio. Es un género de ícono (“salir”, “abrir puerta”) y el corchete en L recuerda de lejos a los corchetes de Ledger. Es el más literal.',
'visitas':'Medio-bajo. Tres módulos en L evocan una pieza de Tetris y los mosaicos de Slice/Lattice; los arcos lo separan, pero a 16 px pierde detalle.'}
GC={'encaje':'<circle cx="31" cy="33" r="25"/><path d="M31 8V33H56"/>','vuelta':'<circle cx="8" cy="56" r="48"/><circle cx="8" cy="56" r="35"/>',
'pasale':'<path d="M23 13.5L49 7.5M23 41H49"/><circle cx="42.5" cy="26" r="2.8"/>','visitas':'<circle cx="8" cy="30" r="22"/><circle cx="34" cy="56" r="22"/><path d="M30 0V64M34 0V64M0 30H64M0 34H64"/>'}
def guide(k): return ('<svg viewBox="0 0 64 64" width="224" height="224" style="position:absolute;inset:0"><g fill="none" stroke="#C2560F" stroke-width=".25" opacity=".6">'
  +''.join(f'<path d="M{i} 0V64M0 {i}H64" stroke-dasharray=".8 .8"/>' for i in range(8,64,8))+'<rect x="8" y="8" width="48" height="48" stroke-width=".4"/>'+GC[k]+'</g></svg>')
def mk(k):
    p=d(k)
    return (f'<svg viewBox="-3 -3 72 72" width="66" height="66"><path d="{p}" transform="translate(3.5 3.5)" fill="#0F2A22" stroke="#0F2A22" stroke-width="2.6" stroke-linejoin="round" fill-rule="evenodd"/>'
            f'<path d="{p}" fill="#F3EFE6" stroke="#0F2A22" stroke-width="2.6" stroke-linejoin="round" fill-rule="evenodd" paint-order="stroke"/></svg>')
def ctx(k): return f'<div class="ctx"><div class="tab">{svg(k,"#0F4D3A",16)}<span>LealTab · Clientes</span><b>×</b></div><div class="app">{svg(k,"#F3EFE6",30)}</div><div class="app" style="background:var(--lino)">{svg(k,"#0F4D3A",30)}</div></div>'
cards=''
for k,n,f in FIN:
    cards+=f'''<div class="card box">
 <div class="hd"><div class="disp nm">{n}</div><span class="stk flat" style="background:var(--menta)">Finalista</span></div>
 <p class="idea">{IDEA[k]}</p>
 <div class="big"><div style="position:relative;width:224px;height:224px">{guide(k)}<div style="position:absolute;inset:0">{svg(k,"#0F4D3A",224)}</div></div></div>
 <div class="vars">
  <div class="v" style="background:var(--claro)">{svg(k,"#0F2A22",60)}<span>Un color</span></div>
  <div class="v" style="background:var(--bosque);color:var(--lino)">{svg(k,"#F3EFE6",60)}<span>Negativo</span></div>
  <div class="v" style="background:var(--durazno)">{mk(k)}<span>Marketing</span></div>
 </div>
 <div class="sizes">
  <div class="sz">{svg(k,"#0F4D3A",64)}<em>64</em></div><div class="sz">{svg(k,"#0F4D3A",32)}<em>32</em></div><div class="sz">{svg(k,"#0F4D3A",16)}<em>16</em></div>
  <div class="sz dk">{svg(k,"#F3EFE6",32)}<em>32</em></div><div class="sz dk">{svg(k,"#F3EFE6",16)}<em>16</em></div>
 </div>
 {ctx(k)}
 <div class="lock">{svg(k,"#0F4D3A",38)}<span class="disp">LealTab</span></div>
 <p class="risk"><b>Parecido:</b> {RISK[k]}</p>
</div>'''
html=f'''<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Manrope:wght@400;500;600;700;800&display=block" rel="stylesheet">
<link rel="stylesheet" href="ciclo-v2.css">
<style>
.wrap{{padding:28px 40px;height:1000px;display:flex;flex-direction:column;gap:16px}}
.head{{display:flex;justify-content:space-between;align-items:flex-end}}
h1{{font-size:50px;line-height:.86;text-transform:uppercase}}
.grid{{display:grid;grid-template-columns:repeat(4,1fr);gap:24px;flex:1;min-height:0}}
.card{{padding:14px 18px;display:flex;flex-direction:column;gap:9px}}
.hd{{display:flex;justify-content:space-between;align-items:center}}
.nm{{font-size:32px;text-transform:uppercase;line-height:1}}
.idea{{font-size:13px;line-height:1.38;color:#2E4A40;min-height:54px}}
.big{{background:var(--lino);border:1.5px solid var(--noche);border-radius:12px;display:grid;place-items:center;height:310px}}
.vars{{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}}
.v{{border:1.5px solid var(--noche);border-radius:10px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:4px;padding:8px 4px 6px}}
.v span{{font-size:9.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}}
.sizes{{display:flex;border:1.5px solid var(--noche);border-radius:10px;overflow:hidden}}
.sz{{display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:4px;padding:8px 6px 5px;flex:1;background:var(--lino)}}
.sz.dk{{background:var(--bosque);color:var(--lino)}}
.sz em{{font-style:normal;font-size:9.5px;font-weight:700;opacity:.75}}
.ctx{{display:flex;gap:8px;align-items:center}}
.tab{{flex:1;display:flex;align-items:center;gap:7px;background:var(--lino);border:1.5px solid var(--noche);border-radius:9px 9px 0 0;border-bottom:0;padding:8px 10px;font-size:11.5px;font-weight:600;height:36px;align-self:flex-end}}
.tab b{{margin-left:auto;font-weight:600;opacity:.6}}
.app{{width:46px;height:46px;border-radius:11px;background:var(--bosque);border:1.5px solid var(--noche);display:grid;place-items:center;flex:none}}
.lock{{display:flex;align-items:center;gap:10px;padding:2px}}
.lock span{{font-size:40px;line-height:1;color:var(--noche)}}
.risk{{font-size:12px;line-height:1.38;color:#2E4A40;border-top:1.5px solid var(--noche);padding-top:7px}}
</style></head><body><div class="wrap">
<div class="head"><div><div class="lbl" style="margin-bottom:8px">LealTab · Fase 3 · Isotipo, ronda 2</div><h1 class="disp">Cuatro finalistas con carácter</h1></div>
<div style="font-size:12.5px;max-width:720px;text-align:right;line-height:1.45;color:#2E4A40">Símbolos planos sobre retícula de 64 unidades (área viva 8–56), sin sombra: la sombra dura es tratamiento de marketing. Tamaños reales de 64, 32 y 16 px. “LealTab” va en texto, en composición preliminar (no es el logotipo final).</div></div>
<div class="grid">{cards}</div>
</div></body></html>'''
open('isotipo-r2.html','w').write(html)
