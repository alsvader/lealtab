import math
N='#0F2A22'
def ring(pct,color='#0F4D3A',r=44,w=16,sw=21,scale=1.0,track=True):
    C=2*math.pi*r; L=C*pct
    t=f'<circle cx="60" cy="60" r="{r}" fill="none" stroke="#E4DED0" stroke-width="{w}"/>' if track else ''
    if pct<=0: arc=''
    else:
        arc=f'''<g transform="rotate(-90 60 60)" fill="none" stroke-linecap="round">
<circle cx="63" cy="57" r="{r}" stroke="{N}" stroke-width="{sw}" stroke-dasharray="{L:.1f} {C:.1f}" transform="rotate(0)"/>
<circle cx="60" cy="60" r="{r}" stroke="{N}" stroke-width="{sw}" stroke-dasharray="{L:.1f} {C:.1f}"/>
<circle cx="60" cy="60" r="{r}" stroke="{color}" stroke-width="{w}" stroke-dasharray="{L:.1f} {C:.1f}"/></g>'''
    return f'<svg viewBox="0 0 120 120" style="width:100%;height:100%"><g transform="translate(60 60) scale({scale}) translate(-60 -60)">{t}{arc}</g></svg>'
frames=[('0 ms','0 %',0,'#0F4D3A',1),('150 ms','30 %',.30,'#0F4D3A',1),('350 ms','62 %',.62,'#0F4D3A',1),('520 ms','79 % · se pasa',.79,'#0F4D3A',1),('650 ms','75 % · asienta',.75,'#0F4D3A',1),('Cierre','100 % · pulso 1.04',1.0,'#FF9F6E',1.04)]
fr=''.join(f'<div class="fr"><div class="rg">{ring(p,c,scale=s)}</div><div class="ft"><b>{a}</b><span>{b}</span></div></div>' for a,b,p,c,s in frames)
sframes=[('0 ms','escala .6 · −12°',.6,-12,.35),('120 ms','1.06 · 0°',1.06,0,1),('200 ms','.98 · 5°',.98,5,1),('240 ms','1 · 4° final',1,4,1)]
sf=''.join(f'<div class="fr"><div class="sk"><span class="stk" style="background:var(--durazno);transform:scale({sc}) rotate({ro}deg);opacity:{op}">Casi premio</span></div><div class="ft"><b>{a}</b><span>{b}</span></div></div>' for a,b,sc,ro,op in sframes)
# easing curve
pts=[]
for i in range(0,101):
    t=i/100*650
    if t<=520: v=0.81*(1-(1-t/520)**3)/0.75
    else: v=(0.81-(0.06*((t-520)/130)**0.8))/0.75
    pts.append(f'{20+i*2.2:.1f},{100-v*70:.1f}')
curve=' '.join(pts)
def mark(n,x,y):
    return f'<span class="mk" style="left:{x};top:{y}">{n}</span>'
html=f'''<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Manrope:wght@400;500;600;700;800&display=block" rel="stylesheet">
<link rel="stylesheet" href="ciclo-v2.css">
<style>
.wrap{{padding:34px 40px;height:1000px;display:flex;flex-direction:column;gap:16px}}
.head{{display:flex;justify-content:space-between;align-items:flex-end}}
h1{{font-size:54px;line-height:.86;text-transform:uppercase}}
.sec{{display:flex;align-items:center;gap:12px}}
.sec h2{{font-size:24px;text-transform:uppercase}}
.sec p{{font-size:12.5px;color:#2E4A40}}
.lay{{display:grid;grid-template-columns:1.75fr .82fr .7fr 1fr;gap:24px;height:430px}}
.col{{display:flex;flex-direction:column;gap:8px;min-width:0}}
.cap2{{font-size:11.5px;line-height:1.38;color:#2E4A40}}
.cap2 b{{color:var(--noche)}}
.art{{border:var(--b);border-radius:14px;box-shadow:5px 5px 0 var(--noche);position:relative;overflow:hidden;flex:1}}
.gridov{{position:absolute;z-index:2;pointer-events:none}}
.mk{{position:absolute;z-index:6;width:20px;height:20px;border-radius:50%;background:var(--noche);color:var(--lino);font-size:11px;font-weight:800;display:grid;place-items:center}}
.dim{{position:absolute;z-index:6;font-size:9.5px;font-weight:800;color:#C2560F;letter-spacing:.04em}}
.anim{{display:grid;grid-template-columns:1.55fr 1fr;gap:24px;flex:1;min-height:0}}
.seq{{border:var(--b);border-radius:14px;box-shadow:5px 5px 0 var(--noche);background:var(--claro);padding:16px 18px;display:flex;flex-direction:column;gap:12px}}
.frs{{display:grid;gap:10px;flex:1}}
.fr{{border:1.5px solid var(--noche);border-radius:10px;display:flex;flex-direction:column;overflow:hidden;background:var(--lino)}}
.rg{{flex:1;padding:4px;min-height:0;display:grid;place-items:center}}
.sk{{flex:1;display:grid;place-items:center}}
.ft{{border-top:1.5px solid var(--noche);padding:6px 8px;font-size:10.5px;line-height:1.3;background:var(--claro)}}
.ft b{{display:block;font-size:11.5px}}
.ft span{{color:#4D635A;font-weight:600}}
.rules{{list-style:none;font-size:13px;line-height:1.45;color:#2E4A40;display:flex;flex-direction:column;gap:8px}}
.rules b{{color:var(--noche)}}
</style></head><body><div class="wrap">
<div class="head"><div><div class="lbl" style="margin-bottom:8px">LealTab · Fase 2 · Moodboard 3 de 3</div><h1 class="disp">Composición y movimiento</h1></div>
<div style="font-size:12.5px;max-width:560px;text-align:right;line-height:1.45;color:#2E4A40">Jerarquía fija: <b>1</b> titular · <b>2</b> aro o recorte · <b>3</b> texto · <b>4</b> acción · <b>5</b> sticker. Al menos el 40 % de cada pieza queda vacío. Un aro grande por pieza; máximo dos stickers.</div></div>
<div class="sec"><h2 class="disp">Retícula</h2><p>Las franjas durazno marcan las columnas; los números, la jerarquía de lectura.</p></div>
<div class="lay">
 <!-- landing -->
 <div class="col"><div class="art" style="background:var(--claro)">
  <div class="gridov" style="left:40px;right:40px;top:0;bottom:0;background:repeating-linear-gradient(90deg,rgba(255,159,110,.16) 0 calc((100% - 132px)/12),transparent calc((100% - 132px)/12) calc((100% - 132px)/12 + 12px))"></div>
  <div class="dim" style="left:10px;bottom:10px">← 80</div><div class="dim" style="right:10px;bottom:10px">80 →</div>
  <div style="position:absolute;left:40px;top:20px;right:40px;display:flex;justify-content:space-between;font-size:11px;font-weight:700;z-index:5"><span class="disp" style="font-size:17px">LealTab</span><span>Producto · Precios · Lo que viene</span></div>
  <div class="disp" style="position:absolute;left:40px;top:70px;width:44%;font-size:38px;line-height:.9;z-index:5">Haz que tus clientes siempre regresen.</div>
  <div style="position:absolute;left:40px;top:196px;width:38%;font-size:12px;line-height:1.45;color:#2E4A40;z-index:5">Tu tarjeta digital y cada vuelta de tus clientes, en un solo lugar.</div>
  <div style="position:absolute;left:40px;top:278px;z-index:5"><span class="btn" style="background:var(--durazno);font-size:13px"><span style="padding:9px 13px">Crea tu tarjeta</span><i style="width:36px">→</i></span></div>
  <svg viewBox="0 0 300 300" style="position:absolute;right:-60px;top:40px;width:300px;height:300px;z-index:3"><g fill="none" stroke-linecap="round" transform="rotate(-90 150 150)"><circle cx="156" cy="144" r="110" stroke="#0F2A22" stroke-width="44" stroke-dasharray="560 691"/><circle cx="150" cy="150" r="110" stroke="#0F2A22" stroke-width="44" stroke-dasharray="560 691"/><circle cx="150" cy="150" r="110" stroke="#0F4D3A" stroke-width="38" stroke-dasharray="560 691"/></g></svg>
  <span class="stk" style="position:absolute;left:200px;top:284px;background:var(--menta);transform:rotate(-5deg);z-index:5;font-size:12px">Nuevo · Avisos</span>
  {mark(1,'14px','80px')}{mark(2,'calc(100% - 40px)','56px')}{mark(3,'14px','198px')}{mark(4,'14px','284px')}{mark(5,'320px','262px')}
 </div><div class="cap2"><b>Landing · 12 columnas</b>, medianil 24 px, márgenes de 80 px. El titular ocupa 6 columnas; el aro se ancla al lado contrario y sale del encuadre.</div></div>
 <!-- redes -->
 <div class="col"><div class="art" style="background:var(--bosque);color:var(--lino)">
  <div class="gridov" style="left:24px;right:24px;top:0;bottom:0;background:repeating-linear-gradient(90deg,rgba(255,159,110,.22) 0 calc((100% - 40px)/6),transparent calc((100% - 40px)/6) calc((100% - 40px)/6 + 8px))"></div>
  <div class="lbl" style="position:absolute;left:24px;top:22px;color:var(--menta);z-index:5;font-size:9.5px">@getlealtab</div>
  <div class="disp" style="position:absolute;left:24px;top:48px;right:24px;font-size:34px;line-height:.9;z-index:5">Hace 6 semanas que no viene. Tú ya lo sabes.</div>
  <svg viewBox="0 0 200 200" style="position:absolute;left:-50px;bottom:-60px;width:220px;height:220px;z-index:3"><g fill="none" stroke-linecap="round" transform="rotate(-90 100 100)"><circle cx="105" cy="95" r="70" stroke="#0F2A22" stroke-width="34" stroke-dasharray="330 440"/><circle cx="100" cy="100" r="70" stroke="#0F2A22" stroke-width="34" stroke-dasharray="330 440"/><circle cx="100" cy="100" r="70" stroke="#FF9F6E" stroke-width="28" stroke-dasharray="330 440"/></g></svg>
  <span class="stk" style="position:absolute;right:20px;bottom:28px;background:var(--claro);color:var(--noche);transform:rotate(4deg);z-index:5;font-size:12px">Te extrañamos</span>
  {mark(1,'4px','52px')}{mark(2,'60px','calc(100% - 120px)')}{mark(5,'calc(100% - 46px)','calc(100% - 78px)')}
 </div><div class="cap2"><b>Redes 4:5 · 6 columnas</b>, margen de 72 px (a 1080). Fondo de color pleno, titular arriba, aro abajo.</div></div>
 <!-- mostrador -->
 <div class="col"><div class="art" style="background:var(--durazno)">
  <div class="gridov" style="left:8%;right:8%;top:5%;bottom:5%;border:1.5px dashed rgba(15,42,34,.55);border-radius:6px"></div>
  <div class="lbl" style="position:absolute;left:12%;top:8%;color:var(--noche);z-index:5;font-size:9.5px">Tapioca Luna</div>
  <div class="disp" style="position:absolute;left:12%;top:14%;right:10%;font-size:31px;line-height:.88;text-transform:uppercase;z-index:5">Junta 8. La 9 va por nuestra cuenta.</div>
  <div style="position:absolute;left:12%;bottom:9%;width:72px;height:72px;background:var(--claro);border:2px solid var(--noche);border-radius:8px;box-shadow:3px 3px 0 var(--noche);z-index:5;display:grid;place-items:center;font-size:10px;font-weight:800">QR</div>
  <svg viewBox="0 0 120 120" style="position:absolute;right:8%;bottom:8%;width:84px;height:84px;z-index:5"><g fill="none" stroke-linecap="round" transform="rotate(-90 60 60)"><circle cx="63" cy="57" r="40" stroke="#0F2A22" stroke-width="22" stroke-dasharray="200 252"/><circle cx="60" cy="60" r="40" stroke="#0F2A22" stroke-width="22" stroke-dasharray="200 252"/><circle cx="60" cy="60" r="40" stroke="#0F4D3A" stroke-width="16" stroke-dasharray="200 252"/></g></svg>
  {mark(1,'3%','18%')}{mark(4,'3%','calc(91% - 50px)')}
 </div><div class="cap2"><b>Mostrador · carta</b>, margen del 8 % del lado corto. Legible a 2 m; el QR siempre abajo, a la altura de la mano.</div></div>
 <!-- reglas -->
 <div class="col"><div class="art" style="background:var(--claro);padding:18px 20px;display:flex;flex-direction:column;gap:12px">
  <div class="disp" style="font-size:22px;text-transform:uppercase">Cómo conviven</div>
  <ul class="rules">
   <li><b>Aro:</b> uno grande, anclado a una esquina o saliendo del encuadre por el lado contrario al titular.</li>
   <li><b>Sticker:</b> junto al elemento que califica (botón, aro, nombre), nunca sobre texto ni cifras.</li>
   <li><b>Bloques:</b> separan zonas; máximo dos colores de fondo, además del lino.</li>
   <li><b>Aire:</b> si se siente llena, se quita algo antes de achicar.</li>
   <li><b>Alineación:</b> todo a la izquierda sobre la retícula; el aro es lo único que rompe el borde.</li>
  </ul>
 </div><div class="cap2">Las mismas reglas para la landing, las redes, el mostrador, los correos y las presentaciones.</div></div>
</div>
<div class="sec" style="margin-top:2px"><h2 class="disp">Movimiento</h2><p>Un solo rebote, corto y amortiguado · curva orientativa cubic-bezier(.2,.8,.2,1) · respeta "reducir movimiento"</p></div>
<div class="anim">
 <div class="seq"><div style="display:flex;justify-content:space-between;align-items:baseline"><div class="disp" style="font-size:20px;text-transform:uppercase">El aro se dibuja y se cierra</div><span style="font-size:11px;font-weight:700;color:#4D635A">Desde las 12, en sentido horario · 600–700 ms</span></div>
  <div style="display:grid;grid-template-columns:1fr 250px;gap:14px;flex:1;min-height:0">
   <div class="frs" style="grid-template-columns:repeat(6,1fr)">{fr}</div>
   <div class="fr" style="padding:8px 10px;gap:4px"><div style="font-size:10.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#4D635A">Valor en el tiempo</div>
    <svg viewBox="0 0 250 120" style="width:100%;flex:1"><path d="M20 100 H245 M20 100 V12" stroke="#0F2A22" stroke-width="1.5" fill="none"/><path d="M20 30 H245" stroke="#C2560F" stroke-width="1" stroke-dasharray="4 4"/><text x="26" y="24" font-size="9" fill="#C2560F" font-family="Manrope" font-weight="700">valor final</text>
    <polyline points="{curve}" fill="none" stroke="#0F4D3A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <text x="20" y="114" font-size="9" fill="#4D635A" font-family="Manrope" font-weight="700">0</text><text x="134" y="114" font-size="9" fill="#4D635A" font-family="Manrope" font-weight="700">520 ms</text><text x="244" y="114" font-size="9" text-anchor="end" fill="#4D635A" font-family="Manrope" font-weight="700">650</text></svg>
    <div style="font-size:10.5px;color:#2E4A40;line-height:1.35">Se pasa un 3–4 % y regresa una sola vez.</div></div>
  </div>
 </div>
 <div class="seq"><div style="display:flex;justify-content:space-between;align-items:baseline"><div class="disp" style="font-size:20px;text-transform:uppercase">Entrada de sticker</div><span style="font-size:11px;font-weight:700;color:#4D635A">≈ 240 ms · solo marketing</span></div>
  <div class="frs" style="grid-template-columns:repeat(4,1fr)">{sf}</div>
  <div style="font-size:11px;color:#2E4A40;line-height:1.4"><b>En producto:</b> sin animación o con un fundido de 120 ms. <b>Botón:</b> baja a su sombra en 90 ms y vuelve en 120 ms. <b>Evitar:</b> confeti, parallax, loops y animaciones de más de 1 s.</div>
 </div>
</div>
</div></body></html>'''
open('moodboard-3-composicion-movimiento.html','w').write(html)
