import re, hashlib
from build_vertical import VARIANTS, PATHS, identity, svg as vsvg, ISO, WM, OUTDIR
FROZEN_SHA=hashlib.sha256(open(OUTDIR+'lealtab-master-frozen.svg','rb').read()).hexdigest()
VSHA=hashlib.sha256(open(OUTDIR+'lealtab-vertical.svg','rb').read()).hexdigest()
rows,trs=identity(OUTDIR+'lealtab-vertical.svg')
REF=0.687*112   # C en px a cuerpo de referencia 112 px
def inner(L,uid):
    s=vsvg(L,'x'); body=re.sub(r'^<svg[^>]*>|</svg>\s*$','',s.strip())
    body=re.sub(r'<title>.*?</title>|<desc>.*?</desc>','',body,flags=re.S)
    return body.replace('id="','id="'+uid+'-')
def show(L,uid,w=None,h=None,extra=''):
    a=(f' width="{w}"' if w else '')+(f' height="{h}"' if h else '')
    return f'<svg viewBox="0 0 {L["W"]:.3f} {L["H"]:.3f}"{a}{extra}>{inner(L,uid)}</svg>'
P=VARIANTS['principal']
def cotas(L,uid,w):
    Cv=L['Cv']; k=REF/Cv; W,H=L['W'],L['H']; top=L['cap_top']; base=top+Cv
    g='<g stroke="#C2560F" stroke-width="2.2" fill="none">'
    g+=f'<path d="M-34 0H-6M-34 188H-6M-20 0V188"/>'                       # símbolo
    g+=f'<path d="M-34 {top:.2f}H-6M-34 {base:.2f}H-6M-20 {top:.2f}V{base:.2f}"/>'   # C
    g+=f'<path d="M{W+6:.1f} 188H{W+34:.1f}M{W+6:.1f} {top:.2f}H{W+34:.1f}M{W+20:.1f} 188V{top:.2f}"/>'  # espacio
    g+=f'<path d="M{W/2:.2f} -26V-8M{L["sx"]+111:.2f} -26V-8" stroke-width="1.6"/>'
    g+=f'<path d="M0 {H+14:.1f}H{W:.2f}M0 {H+6:.1f}V{H+22:.1f}M{W:.2f} {H+6:.1f}V{H+22:.1f}" stroke-width="1.6"/></g>'
    t=lambda x,y,s,a='end',fs=24,fw=800:f'<text x="{x:.1f}" y="{y:.1f}" text-anchor="{a}" font-family="Manrope" font-weight="{fw}" font-size="{fs}" fill="#C2560F">{s}</text>'
    g+=t(-36,90,f'{L["k"]:g} C')+t(-36,108,f'{188*k:.1f} px',fs=19,fw=600)
    g+=t(-36,top+Cv/2+5,'C')+t(-36,top+Cv/2+21,f'{REF:.1f} px',fs=19,fw=600)
    g+=t(W+36,(188+top)/2+0,f'{L["gap"]:g} C','start')+t(W+36,(188+top)/2+16,f'{L["gap_u"]*k:.1f} px','start',19,600)
    g+=t(W/2,H+40,f'ancho {W*k:.0f} px · alto {H*k:.0f} px','middle',19,600)
    g+=t(L['sx']+111+6,-30,f'+{L["shift"]:g} u óptico','start',17,600)
    return f'<svg viewBox="-150 -60 {W+310:.1f} {H+115:.1f}" width="{w}" style="max-width:100%;height:auto">{inner(L,uid)}{g}</svg>'
idrows=''.join(f'<tr><td>#{i}</td><td>{n}</td><td><code>{a}</code></td><td><code>{b}</code></td><td class="ok">{"✓ idéntico" if ok else "✗ DISTINTO"}</td></tr>' for i,n,a,b,ok in rows)
allok=all(r[4] for r in rows)
alts=''
for key,lab,tag in (('principal','Principal','2 C · 0.45 C'),('alt-a','Alternativa A','1.75 C · 0.5 C'),('alt-b','Alternativa B','2.25 C · 0.4 C')):
    L=VARIANTS[key]
    alts+=f'<div class="al{" pr" if key=="principal" else ""}"><div class="at"><b>{lab}</b><span>{tag}</span></div><div class="av">{show(L,key+"s",w=230)}</div><div class="an">Símbolo {L["k"]:g} C ({188*REF/L["Cv"]:.0f} px) · espacio {L["gap"]:g} C ({L["gap_u"]*REF/L["Cv"]:.1f} px) · símbolo = {222/L["W"]*100:.0f} % del ancho</div></div>'
html=f'''<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="../r3fonts.css"><link rel="stylesheet" href="../ciclo-v2.css">
<style>.wrap{{padding:24px 40px;height:1000px;display:flex;flex-direction:column;gap:14px}}
.head{{display:flex;justify-content:space-between;align-items:flex-end}}h1{{font-size:46px;line-height:.86;text-transform:uppercase}}
.prop{{font-family:Archivo;font-stretch:75%;font-weight:800;font-size:22px;letter-spacing:.03em;text-transform:uppercase;background:var(--durazno);border:2.5px solid var(--noche);border-radius:10px;padding:8px 16px;box-shadow:4px 4px 0 var(--noche);white-space:nowrap}}
.g{{flex:1;display:grid;grid-template-columns:repeat(12,minmax(0,1fr));grid-template-rows:1.12fr 1fr;gap:16px;min-height:0}}
.pn{{border:2px solid var(--noche);border-radius:12px;background:var(--claro);box-shadow:4px 4px 0 var(--noche);display:flex;flex-direction:column;padding:11px 14px;min-height:0}}
.t{{font-family:Archivo;font-stretch:75%;font-weight:800;font-size:16px;text-transform:uppercase;line-height:1;margin-bottom:6px}}
.c{{flex:1;display:flex;align-items:center;justify-content:center;gap:14px;min-height:0}}
.n{{font-size:11px;line-height:1.42;color:#2E4A40}} .n b{{color:var(--noche)}}
.p1{{grid-column:1/5}}.p2{{grid-column:5/9}}.p3{{grid-column:9/13;grid-row:1/3}}.p4{{grid-column:1/9}}
table{{border-collapse:collapse;width:100%;font-size:10.5px}}td{{padding:3.5px 4px;border-bottom:1px solid #e2d9cb}}td.ok{{color:#0F4D3A;font-weight:800;text-align:right}}code{{font-size:10px}}
th{{text-align:left;font-size:9.5px;letter-spacing:.06em;text-transform:uppercase;color:#4D635A;padding:3px 4px;border-bottom:1.5px solid var(--noche)}}
.als{{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;width:100%}}
.al{{border:1.5px solid #cfc4b2;border-radius:10px;padding:10px;display:flex;flex-direction:column;gap:8px;background:#fff}}.al.pr{{border:2px solid var(--noche)}}
.at{{display:flex;justify-content:space-between;font-size:12px}}.at span{{font-weight:700;color:#C2560F}}
.av{{flex:1;display:grid;place-items:center;background:var(--lino);border-radius:8px;padding:12px}}.an{{font-size:10.5px;color:#2E4A40;line-height:1.35}}
.kv{{font-size:11px;line-height:1.5}}.kv b{{font-weight:800}}
</style></head><body><div class="wrap">
<div class="head"><div><div class="lbl" style="margin-bottom:8px">LealTab · Fase 3 · Lockup vertical derivado del master horizontal congelado (2026-10-05)</div><h1 class="disp">Lockup vertical</h1></div>
<div class="prop">Propuesta · vertical · no congelado</div></div>
<div class="g">
 <div class="pn p1"><div class="t">Propuesta principal · lealtab-vertical.svg</div><div class="c">{show(P,"big",w=300)}</div>
  <div class="n">viewBox 0 0 {P['W']:.2f} {P['H']:.2f}. Símbolo <b>2 C</b>, espacio <b>0.45 C</b>, símbolo centrado sobre el ancho de tinta del nombre más <b>+{P['shift']:g} u</b> a la derecha (su centroide de tinta cae 5 u a la izquierda del centro de su caja; se corrige la mitad).</div></div>
 <div class="pn p2"><div class="t">Cotas · nombre a cuerpo de referencia 112 px</div><div class="c">{cotas(P,"cot",440)}</div>
  <div class="kv">C = {P['Cv']:.2f} u ({REF:.1f} px) · símbolo 188 u ({188*REF/P['Cv']:.1f} px) · espacio {P['gap_u']:.2f} u ({P['gap_u']*REF/P['Cv']:.1f} px) · escala del wordmark respecto al master <b>{P['s']:g}</b></div></div>
 <div class="pn p3"><div class="t">Prueba de identidad de trazados</div>
  <div class="n" style="margin-bottom:6px">Cada atributo <b>d</b> de lealtab-vertical.svg se compara contra lealtab-master-frozen.svg (sha256 <code>{FROZEN_SHA[:16]}…</code>): igualdad de cadena y sha256 de la cadena.</div>
  <table><tr><th>id</th><th>long.</th><th>master</th><th>vertical</th><th></th></tr>{idrows}</table>
  <div class="n" style="margin-top:8px"><b>{"9 / 9 trazados idénticos" if allok else "HAY DIFERENCIAS"}</b>. Solo cambian los grupos:</div>
  <table style="margin-top:4px"><tr><td>#isotipo</td><td><code>{trs[0]}</code></td></tr><tr><td>#wordmark</td><td><code>{trs[1]}</code></td></tr></table>
  <div class="n" style="margin-top:8px">Tracking y kerning heredados: las posiciones de las letras están dentro de los trazados del master, así que no se recalculan. El escalado del wordmark es uniforme (×{P['s']:g} en x e y).</div>
  <div class="t" style="margin-top:16px">Lectura</div>
  <div class="n"><b>Principal (2 C · 0.45 C):</b> el símbolo ocupa el 56 % del ancho del nombre. Se lee como sello sobre el nombre sin competir con él. Es la que recomiendo.<br><b>Alt. A (1.75 C · 0.5 C):</b> el nombre manda y el símbolo se ve un poco tímido (49 %). Sirve si el vertical se usa casi siempre en tamaños grandes.<br><b>Alt. B (2.25 C · 0.4 C):</b> el símbolo domina (63 %) y queda más compacto. Funciona mejor como avatar o firma, pero se aleja del peso del horizontal.</div>
  <div class="n" style="margin-top:10px">sha256 de lealtab-vertical.svg: <code>{VSHA[:16]}…</code></div>
  <div class="t" style="margin-top:16px">Archivos · logo/master/</div>
  <table><tr><td>lealtab-master.svg</td><td>congelado 2026-10-05 · sin cambios</td></tr><tr><td>lealtab-master-frozen.svg</td><td>copia de solo lectura (444) · mismo sha256</td></tr><tr><td>lealtab-vertical.svg</td><td>PROPUESTA · no congelado</td></tr><tr><td>alternativas A y B</td><td>solo en esta lámina (fuentes en laminas-html/master/)</td></tr></table>
  <div class="n" style="margin-top:10px">Pendiente hasta que se apruebe: variantes de color, PNG, favicons y brand book del vertical.</div></div>
 <div class="pn p4"><div class="t">Comparación · mismo ancho de nombre (alternativas marcadas)</div><div class="c"><div class="als">{alts}</div></div></div>
</div></div></body></html>'''
open('vertical-verification.html','w').write(html); print('ok',allok)
