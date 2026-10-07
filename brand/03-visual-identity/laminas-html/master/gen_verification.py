import json, base64, io, re
from PIL import Image
from build_master import M, OUT
V=json.load(open('/tmp/verify.json')); SC=V['scale']
def uri(im):
    b=io.BytesIO(); im.save(b,'PNG'); return 'data:image/png;base64,'+base64.b64encode(b.getvalue()).decode()
iso_ov=Image.open('/tmp/v_iso_overlay.png'); wm_ov=Image.open('/tmp/v_wm_overlay.png')
# zooms: esquina interior de la L y abertura inferior derecha (unidades maestro ×SC)
z1=iso_ov.crop((40*SC,105*SC,90*SC,150*SC)).resize((200,180),Image.NEAREST)
z2=iso_ov.crop((140*SC,120*SC,200*SC,174*SC)).resize((200,180),Image.NEAREST)
src=open(OUT).read()
from build_master import S1,S2,pd,OX,OY
ORIG='<g transform="translate(%d %d)" fill="none" stroke="#E61E1E" stroke-opacity=".45" stroke-width="52" stroke-linecap="round" stroke-linejoin="round"><path d="M40 20 V124 Q40 156 72 156 H138"/><path d="M154 20 H178 Q210 20 210 52 V124"/></g>'%(-OX,-OY)
MO='<g fill="none" stroke="#14AA3C" stroke-width="1.4" vector-effect="non-scaling-stroke"><path d="%s" vector-effect="non-scaling-stroke"/><path d="%s" vector-effect="non-scaling-stroke"/></g>'%(pd(S1),pd(S2))
def zoomv(vb,w): return f'<svg viewBox="{vb}" width="{w}" style="background:#F3EFE6;border:1px solid #d9cfc0;display:block">{ORIG}{MO}</svg>'

inner=re.sub(r'^<svg[^>]*>|</svg>\s*$','',src.strip()).replace('<title>','<!--').replace('</title>','-->')
defs=f'<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>{inner}</defs></svg>'
VW=M['VW']
def lock(h,fill='#0F2A22'): return f'<svg viewBox="0 0 {VW:.2f} 188" height="{h}" style="color:{fill}"><use href="#lealtab-master" style="fill:{fill}"/></svg>'
def iso(h,fill='#0F2A22'): return f'<svg viewBox="0 0 222 188" height="{h}" width="{h*222/188:.2f}"><use href="#isotipo" style="fill:{fill}"/></svg>'
# referencia: cuerpo 112 px
FS=112; Cpx=0.687*FS; k=Cpx/M['C']
ref_w=VW*k
cot_sym=188*k; cot_gap=M['gap']*k
C=M['C']
cotas=f'''<svg viewBox="-150 -70 {VW+190:.1f} 320" style="width:100%;height:auto">
<use href="#lealtab-master"/>
<g stroke="#C2560F" stroke-width="2.4" fill="none">
 <path d="M-40 0H-8M-40 188H-8M-24 0V188"/>
 <path d="M222 -30V214M{222+M['gap']:.2f} -30V214"/>
 <path d="M{M['WX1']+8:.1f} {M['base']-C:.2f}H{M['WX1']+30:.1f}M{M['WX1']+8:.1f} {M['base']:.2f}H{M['WX1']+30:.1f}M{M['WX1']+19:.1f} {M['base']-C:.2f}V{M['base']:.2f}"/>
 <path d="M{M['tx']-10:.1f} {M['base']-C:.2f}H{M['WX1']:.1f}M{M['tx']-10:.1f} {M['base']:.2f}H{M['WX1']:.1f}" stroke-dasharray="6 6" opacity=".55" stroke-width="1.6"/>
</g>
<g font-family="Manrope" font-weight="800" font-size="19" fill="#C2560F">
 <text x="-48" y="88" text-anchor="end">1.5 C</text><text x="-48" y="110" text-anchor="end" font-weight="600" font-size="15">{cot_sym:.1f} px</text>
 <text x="{222+M['gap']/2:.1f}" y="-40" text-anchor="middle">0.48 C</text><text x="{222+M['gap']/2:.1f}" y="236" text-anchor="middle" font-weight="600" font-size="15">{cot_gap:.1f} px</text>
 <text x="{M['WX1']-60:.1f}" y="{M['base']-C-12:.1f}" text-anchor="middle">C</text><text x="{M['WX1']-10:.1f}" y="{M['base']-C-12:.1f}" text-anchor="start" font-weight="600" font-size="15">{Cpx:.1f} px</text>
</g></svg>'''
strip=''.join(f'<div class="rs"><div class="rv">{iso(n)}</div><em>{n} px</em></div>' for n in (16,24,32,48))+'<span style="width:14px"></span>'+''.join(f'<div class="rs"><div class="rv dk">{iso(n,"#F3EFE6")}</div><em>{n} px</em></div>' for n in (16,24,32,48))
strip2=''.join(f'<div class="rs"><div class="rv">{lock(n)}</div><em>lockup · símbolo {n} px</em></div>' for n in (16,24,32,48))
I=V['iso']; W=V['wordmark']
html=f'''<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="../r3fonts.css"><link rel="stylesheet" href="../ciclo-v2.css">
<style>.wrap{{padding:24px 40px;height:1000px;display:flex;flex-direction:column;gap:14px}}
.head{{display:flex;justify-content:space-between;align-items:flex-end}}h1{{font-size:46px;line-height:.86;text-transform:uppercase}}
.prop{{font-family:Archivo;font-stretch:75%;font-weight:800;font-size:22px;letter-spacing:.03em;text-transform:uppercase;background:var(--durazno);border:2.5px solid var(--noche);border-radius:10px;padding:8px 16px;box-shadow:4px 4px 0 var(--noche);white-space:nowrap}}
.g{{flex:1;display:grid;grid-template-columns:repeat(12,minmax(0,1fr));grid-template-rows:1fr 1.08fr;gap:16px;min-height:0}}
.pn{{border:2px solid var(--noche);border-radius:12px;background:var(--claro);box-shadow:4px 4px 0 var(--noche);display:flex;flex-direction:column;padding:11px 14px;min-height:0;position:relative}}
.t{{font-family:Archivo;font-stretch:75%;font-weight:800;font-size:16px;text-transform:uppercase;line-height:1}}
.c{{flex:1;display:flex;align-items:center;justify-content:center;gap:14px;min-height:0}}
.n{{font-size:11px;line-height:1.4;color:#2E4A40}} .n b{{color:var(--noche)}}
.wm::after{{content:"PROPUESTA";position:absolute;right:14px;top:10px;font:800 10px Manrope;letter-spacing:.12em;color:#C2560F}}
.p1{{grid-column:1/8}}.p2{{grid-column:8/13}}.p3{{grid-column:1/6}}.p4{{grid-column:6/9}}.p5{{grid-column:9/13}}
.ov img{{display:block;border:1px solid #d9cfc0}}
.lg{{display:flex;gap:10px;font-size:10px;font-weight:700;color:#4D635A}}.lg i{{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:4px;vertical-align:-1px}}
.strip{{display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap;justify-content:center}}.rs{{display:flex;flex-direction:column;align-items:center;gap:4px}}
.rv{{background:var(--lino);border:1px solid #d9cfc0;border-radius:6px;padding:5px;display:grid;place-items:center;min-width:30px}}.rv.dk{{background:var(--noche);border-color:var(--noche)}}
.rs em{{font-style:normal;font-size:9.5px;font-weight:700;color:#4D635A}}
table{{font-size:11px;border-collapse:collapse;width:100%}}td{{padding:2px 4px;border-bottom:1px solid #e2d9cb}}td:last-child{{text-align:right;font-weight:700}}
</style></head><body>{defs}<div class="wrap">
<div class="head"><div><div class="lbl" style="margin-bottom:8px">LealTab · Fase 3 · Master del logo · Ajuste A · lámina de verificación</div><h1 class="disp">Master: isotipo v0.6 + wordmark</h1></div>
<div class="prop">Horizontal congelado · 2026-10-05</div></div>
<div class="g">
 <div class="pn p1 wm"><div class="t">(a) Master · lealtab-master.svg</div><div class="c"><img src="../../logo/master/lealtab-master.svg" width="720"></div>
  <div class="n">viewBox 0 0 {VW:.2f} 188 · 9 trazados de relleno noche #0F2A22 · sin stroke, sin &lt;text&gt;, sin transform ni sombras · grupos <b>#isotipo</b> (x 0–222) y <b>#wordmark</b> (x {M['WX0']:.2f}–{M['WX1']:.2f}).</div></div>
 <div class="pn p2"><div class="t">(c) Cotas · cuerpo de referencia 112 px</div><div class="c">{cotas}</div>
  <table><tr><td>C (altura de mayúsculas)</td><td>{C:.2f} u · {Cpx:.1f} px</td></tr><tr><td>Símbolo / C</td><td>188 / {C:.2f} = 1.500</td></tr>
  <tr><td>Espacio símbolo → fuste de la L</td><td>{M['gap']:.2f} u = 0.48 C · {cot_gap:.1f} px</td></tr><tr><td>Tracking · kerning l·T / T·a</td><td>−28/1000 · {M['kern']['lT']} / {M['kern']['Ta']}</td></tr></table></div>
 <div class="pn p3"><div class="t">(b) Fidelidad del isotipo · v0.6 (trazo 52) vs master (relleno)</div>
  <div class="c ov">{zoomv("-6 -6 234 200",250)}<div style="display:flex;flex-direction:column;gap:6px">{zoomv("44 118 34 28",150)}{zoomv("140 120 60 50",150)}</div></div>
  <div class="lg"><span><i style="background:#F2A0A0"></i>v0.6: trazo de 52 u (rojo translúcido)</span><span><i style="background:#14AA3C"></i>master: contorno del relleno (línea verde)</span></div>
  <div class="n">Raster a ×{SC} ({222*SC}×{188*SC} px): <b>{I['px_diff_gt_50']} píxeles</b> difieren más de 50 % y {I['px_diff_gt_10']} más de 10 % (solo antialias en bordes), de {I['ink_px']:,} píxeles con tinta. Diferencia máxima {I['max_diff']*100:.0f} %. La línea verde corre sobre el borde del trazo rojo en todo el perímetro; ampliaciones: esquina interior de la L y abertura inferior derecha.</div></div>
 <div class="pn p4"><div class="t">(b) Wordmark · curvas vs texto vivo</div><div class="c ov"><img src="{uri(wm_ov.resize((wm_ov.width//8,wm_ov.height//8)))}" width="{wm_ov.width//8}"></div>
  <div class="n">Mismas Archivo 75/800 y tracking −28/1000 renderizadas como texto en Chrome: {W['px_diff_gt_50']} píxeles de {W['ink_px']:,} difieren más de 50 % (redondeo de bordes del rasterizador de texto). El v0.6 no sirve de comparación aquí: su texto salió con Archivo Narrow de respaldo.</div></div>
 <div class="pn p5"><div class="t">(d) Reducción · mismo master escalado</div><div class="c" style="flex-direction:column;gap:10px"><div class="strip">{strip}</div><div class="strip">{strip2}</div></div>
  <div class="n"><b>Sin pixel-fit.</b> Es el vector del master reducido tal cual: a 16 px la abertura inferior derecha se estrecha y se llena de grises (no se cierra del todo). Tamaños = alto del símbolo. El ajuste a píxel (16/32/48) es un paso posterior, después de aprobar este master.</div></div>
</div></div></body></html>'''
open('verification.html','w').write(html); print('ok', Cpx, cot_sym, cot_gap, ref_w)
