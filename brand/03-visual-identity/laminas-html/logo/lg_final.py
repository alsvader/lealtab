from lg_common import *
_,_,mh=horizontal(NOCHE,NOCHE); _,_,mv=vertical(NOCHE,NOCHE)
px=''.join(f'<div class="pxc"><img src="{pxzoom(n,z,grid=(n==16))}" width="{n*z}" height="{n*z}"><img src="{pximg(n)}" width="{n}" height="{n}" class="real"><em>{n} px</em></div>' for n,z in ((16,6),(32,3),(48,2)))
tab=f'<div class="tab"><img src="{pximg(16)}" width="16" height="16"><span>LealTab · Mis clientes</span><b>×</b></div>'
body=f'''<div class="wrap">
<div class="head"><div><div class="lbl" style="margin-bottom:8px">LealTab · Fase 3 · Logo final v1.0 · basado en el sistema v0.6 de Aarón</div><h1 class="disp">LealTab, sistema de logo final</h1></div>
<div class="hn">Isotipo y nombre en curvas. Símbolo de Aarón convertido de trazo (52 u) a relleno sin cambiar su silueta. Horizontal: símbolo = 1.5 × altura de mayúsculas, espacio ≈ ½ mayúscula. Color del logo: noche #0F2A22 y lino #F3EFE6.</div></div>
<div class="g">
 <div class="pn box a1"><div class="t">01 · Principal horizontal</div><div class="c">{H(NOCHE,w=600)}</div><div class="n">Web, navegación, documentos y presentaciones. Símbolo 1.5× mayúsculas · espacio 0.48 mayúscula medido (≈ 0.5 óptico).</div></div>
 <div class="pn box a2"><div class="t">02 · Vertical</div><div class="c">{V(NOCHE,w=283)}</div><div class="n">Avatares, empaques, portadas. Símbolo 2× mayúsculas, ancho = 56 % del nombre.</div></div>
 <div class="pn box a3"><div class="t">03 · Isotipo</div><div class="c">{I(NOCHE,w=170)}</div><div class="n">Favicon, app, avatar.</div></div>
 <div class="pn box a4"><div class="t">04 · Wordmark</div><div class="c">{WM(NOCHE,w=300)}</div><div class="n">Uso secundario. Tracking −28/1000, par l·T sin tocar.</div></div>
 <div class="pn a5 dk" style="box-shadow:5px 5px 0 var(--noche)"><div class="t">05 · Inversa</div><div class="c">{H(LINO,w=330)}</div><div class="n">Lino #F3EFE6 sobre noche #0F2A22.</div></div>
 <div class="pn box a6" style="background:#fff"><div class="t">06 · Mono negra</div><div class="c">{H('#000',w=250)}</div><div class="n">Negro 100 % sobre blanco: sellos, fax, grabado, un tinta.</div></div>
 <div class="pn a7" style="background:#000;color:#fff;box-shadow:5px 5px 0 var(--noche)"><div class="t">06 · Mono blanca</div><div class="c">{H('#fff',w=250)}</div><div class="n" style="color:#ccc">Blanco 100 % sobre negro o foto oscura.</div></div>
 <div class="pn box a8"><div class="t">Ajustadas a píxel</div><div class="c"><div class="pxrow">{px}</div></div>{tab}</div>
 <div class="pn box a9"><div class="t">App y redes</div><div class="c"><div class="icons">
   <div><img src="../../logo/favicon/apple-touch-icon.png" width="74" style="border-radius:17px"><em>App · 180</em></div>
   <div><img src="../../logo/favicon/icon-512-maskable.png" width="74" style="border-radius:50%"><em>PWA maskable</em></div>
   <div><img src="../../logo/favicon/avatar-400-lino.png" width="74" style="border-radius:50%;border:1.5px solid var(--noche)"><em>Avatar lino</em></div>
   <div><img src="../../logo/favicon/avatar-400-noche.png" width="74" style="border-radius:50%"><em>Avatar noche</em></div></div></div></div>
</div></div>'''
css='''<style>.g{flex:1;display:grid;grid-template-columns:repeat(12,minmax(0,1fr));grid-template-rows:1.25fr 1fr .95fr;gap:18px;min-height:0}
.a1{grid-column:1/8;grid-row:1}.a2{grid-column:8/13;grid-row:1}.a3{grid-column:1/4;grid-row:2}.a4{grid-column:4/8;grid-row:2}.a5{grid-column:8/13;grid-row:2}
.a6{grid-column:1/4;grid-row:3}.a7{grid-column:4/7;grid-row:3}.a8{grid-column:7/10;grid-row:3}.a9{grid-column:10/13;grid-row:3}
.pxrow{display:flex;gap:12px;align-items:flex-end}.pxc{display:flex;flex-direction:column;align-items:center;gap:4px}.pxc em,.icons em{font-style:normal;font-size:9.5px;font-weight:700;color:#4D635A}
.pxc img{image-rendering:pixelated;border:1px solid #d9cfc0}.pxc img.real{border:0}
.tab{display:flex;align-items:center;gap:7px;background:var(--lino);border:1.5px solid var(--noche);border-radius:9px 9px 0 0;border-bottom:0;padding:6px 10px;font-size:11px;font-weight:600;margin:6px 0 0;border-radius:9px 9px 0 0}
.tab b{margin-left:auto;opacity:.6}
.icons{display:flex;gap:10px}.icons div{display:flex;flex-direction:column;align-items:center;gap:5px}
</style>'''
open('logo-final.html','w').write(HEAD+css+'</head><body>'+body+'</body></html>')
print(mh,mv)
