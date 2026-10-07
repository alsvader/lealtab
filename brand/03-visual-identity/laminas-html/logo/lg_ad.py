from lg_common import *
_,_,mh=horizontal(NOCHE,NOCHE); _,_,mv=vertical(NOCHE,NOCHE)
WMF='font-family:Archivo Condensed,Archivo Narrow,Arial Narrow,sans-serif;font-weight:800'
# ANTES: fragmentos del SVG v0.6 tal cual (texto vivo con la pila de fuentes original)
antes_h=(f'<svg viewBox="0 30 820 200" width="560"><g transform="translate(5 30)"><g transform="scale(.76)">{ORIG_SVG()}</g>'
         f'<text x="190" y="110" style="{WMF}" fill="{NOCHE}" font-size="112" letter-spacing="-3.2">LealTab</text>'
         '<g stroke="#B42318" stroke-width="2"><path d="M179.4 -4V150M190 -4V150"/></g>'
         '<text x="185" y="-10" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="13" fill="#B42318">≈10 px</text>'
         '</g></svg>')
antes_v=(f'<svg viewBox="-10 -10 340 260" width="225"><g transform="translate(84 0) scale(.62)">{ORIG_SVG()}</g>'
         f'<text x="0" y="230" style="{WMF}" fill="{NOCHE}" font-size="108" letter-spacing="-3">LealTab</text></svg>')
# DESPUÉS con cotas
vb,b,m=horizontal(NOCHE,NOCHE); C=m['C']; base=SYM_H/2+C/2; gx0=SYM_W; gx1=SYM_W+m['gap']
cot=(f'<g stroke="#C2560F" stroke-width="3"><path d="M{fmt(gx0)} -14V{SYM_H+14}M{fmt(gx1)} -14V{SYM_H+14}"/>'
     f'<path d="M{SYM_W+m["gap"]+560} {fmt(base-C)}H{SYM_W+m["gap"]+620}M{SYM_W+m["gap"]+560} {fmt(base)}H{SYM_W+m["gap"]+620}" opacity=".8"/>'
     f'<path d="M-30 0H-6M-30 {SYM_H}H-6M-18 0V{SYM_H}"/></g>'
     f'<g font-family="Manrope" font-weight="800" font-size="24" fill="#C2560F"><text x="{fmt((gx0+gx1)/2)}" y="-22" text-anchor="middle">0.48 C</text>'
     f'<text x="-36" y="{SYM_H/2+8}" text-anchor="end">1.5 C</text></g>')
desp_h=svgdoc((-150,-50,vb[2]+170,SYM_H+90),cot+b,w=560)
desp_v=V(NOCHE,w=200)
# píxel
def pxpair(n,z):
    return (f'<div class="pp"><div><img src="{pxzoom(n,z,"naive",grid=(n==16))}" width="{n*z}"><em>Antes · {n} px</em></div>'
            f'<div><img src="{pxzoom(n,z,grid=(n==16))}" width="{n*z}"><em>Después · {n} px</em></div></div>')
# fidelidad: contorno del trazo original sobre el relleno nuevo
fid=(f'<svg viewBox="-20 -20 262 228" width="270"><path d="{MASTER_D}" fill="{MENTA}"/>'
     f'<g transform="translate(-14 6)"><g fill="none" stroke="{NOCHE}" stroke-width="1.6"><path d="M40 20 V124 Q40 156 72 156 H138"/><path d="M154 20 H178 Q210 20 210 52 V124"/></g></g>'
     f'<path d="{MASTER_D}" fill="none" stroke="#C2560F" stroke-width="2"/></svg>')
body=f'''<div class="wrap">
<div class="head"><div><div class="lbl" style="margin-bottom:8px">LealTab · Fase 3 · Logo final v1.0 · Antes / después</div><h1 class="disp">Del v0.6 al logo final</h1></div>
<div class="hn">Mismo símbolo, misma tipografía y mismo ritmo del par l·T. Cambian la escala del símbolo, el espacio con el nombre, la proporción del vertical, las versiones de 16/32/48 px y el paso a curvas. C = altura de mayúsculas.</div></div>
<div class="g">
 <div class="pn box q1"><div class="t">Horizontal · antes (v0.6)</div><div class="c">{antes_h}</div><div class="n">Símbolo = 1.86 C (143 px contra 77 px de mayúsculas a 112 px de fuente). Espacio de ≈10 px (0.14 C): el símbolo se pega a la L.</div></div>
 <div class="pn box q2"><div class="t">Horizontal · después</div><div class="c">{desp_h}</div><div class="n">Símbolo = 1.5 C. Espacio = 0.48 C medido (ópticamente ½ C; se resta un poco porque la esquina superior derecha y el remate inferior del símbolo son redondos). Centrado sobre la altura de mayúsculas.</div></div>
 <div class="pn box q3"><div class="t">Vertical · antes → después</div><div class="c"><div style="display:flex;gap:26px;align-items:center">{antes_v.replace('width="225"','width="170"')}<span class="arr">→</span>{desp_v}</div></div><div class="n">Antes: símbolo 1.57 C y 44 % del ancho del nombre; espacio 0.58 C, se veía chico y suelto. Después: 2 C, 56 % del ancho y espacio 0.45 C.</div></div>
 <div class="pn box q4"><div class="t">Abertura inferior derecha · tamaños chicos</div><div class="c"><div style="display:flex;gap:22px;align-items:flex-end">{pxpair(16,9)}{pxpair(32,5)}{pxpair(48,3)}</div></div><div class="n">Antes, a 16 px la abertura se llena de grises y el símbolo se lee cerrado. Después: bordes rectos en píxel entero y la abertura se abre solo en estas versiones (16 px: pie −0.4 px y gancho −1 px; 32 px: −0.5/−0.5 px; 48 px: sin cambio). La asimetría se conserva: arriba 4 px y abajo 2 px a 16 px.</div></div>
 <div class="pn box q5"><div class="t">Trazo → relleno</div><div class="c">{fid}</div><div class="n">El contorno nuevo (naranja) coincide con el trazo de 52 u original (ejes en noche). Silueta sin cambios.</div></div>
</div></div>'''
css='''<style>.g{flex:1;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr) minmax(0,.9fr);grid-template-rows:1fr 1.05fr;gap:18px;min-height:0}
.q1{grid-column:1;grid-row:1}.q2{grid-column:2;grid-row:1}.q3{grid-column:3;grid-row:1}.q4{grid-column:1/3;grid-row:2}.q5{grid-column:3;grid-row:2}
.pp{display:flex;gap:8px}.pp div{display:flex;flex-direction:column;align-items:center;gap:4px}.pp img{image-rendering:pixelated;border:1px solid #d9cfc0}
.pp em{font-style:normal;font-size:10px;font-weight:700;color:#4D635A}.arr{font-size:30px;font-weight:800;color:#C2560F}
</style>'''
open('logo-antes-despues.html','w').write(HEAD+css+'</head><body>'+body+'</body></html>'); print('ok')
