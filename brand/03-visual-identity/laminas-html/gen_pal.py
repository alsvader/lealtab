def L(h):
    h=h.lstrip('#');c=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    c=[x/12.92 if x<=0.04045 else ((x+0.055)/1.055)**2.4 for x in c]
    return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]
def cr(a,b):
    la,lb=sorted([L(a),L(b)],reverse=True);return (la+0.05)/(lb+0.05)
def rgb(h): return ', '.join(str(int(h[i:i+2],16)) for i in (1,3,5))
main=[('Lino','#F3EFE6','Fondo',60,'#0F2A22'),('Bosque','#0F4D3A','Protagonista',20,'#F3EFE6'),('Menta gris','#CFE3D6','Apoyo',10,'#0F2A22'),('Durazno','#FF9F6E','Acento',7,'#0F2A22'),('Noche','#0F2A22','Texto · contorno',3,'#F3EFE6')]
bar=''.join(f'<div style="flex:{p};background:{h};color:{t}" class="seg"><b>{p} %</b></div>' for n,h,r,p,t in main)
sw=''.join(f'<div class="sw" style="background:{h};color:{t}"><div class="role">{r}</div><div class="nm disp">{n}</div><div class="hx">{h}<br>RGB {rgb(h)}</div></div>' for n,h,r,p,t in main)
extra=[('Blanco lino','#FFFDF8','Superficie','#0F2A22'),('Gris noche','#4D635A','Texto secundario','#FFFDF8')]
func=[('Riesgo','#A8461A','#FFE6D8'),('Error','#B42318','#FDECEA'),('Éxito','#0F4D3A','#CFE3D6')]
ex=''.join(f'<div class="mini" style="background:{h};color:{t}"><b>{n}</b><span>{h}</span><em>{r}</em></div>' for n,h,r,t in extra)
fu=''.join(f'<div class="mini" style="background:{bg};color:{tx}"><b>{n}</b><span>{tx} / {bg}</span><em>{cr(tx,bg):.2f}:1 · provisional</em></div>' for n,tx,bg in func)
pairs=[('Noche','#0F2A22','Lino','#F3EFE6'),('Noche','#0F2A22','Blanco lino','#FFFDF8'),('Noche','#0F2A22','Menta','#CFE3D6'),('Noche','#0F2A22','Durazno','#FF9F6E'),
('Lino','#F3EFE6','Bosque','#0F4D3A'),('Durazno','#FF9F6E','Noche','#0F2A22'),('Bosque','#0F4D3A','Menta','#CFE3D6'),('Gris noche','#4D635A','Lino','#F3EFE6'),
('Durazno','#FF9F6E','Bosque','#0F4D3A'),('Durazno','#FF9F6E','Lino','#F3EFE6'),('Noche','#0F2A22','Bosque','#0F4D3A'),('Menta','#CFE3D6','Lino','#F3EFE6')]
def badge(r):
    if r>=7: return '<span class="bd ok">AAA</span>'
    if r>=4.5: return '<span class="bd ok2">AA</span>'
    if r>=3: return '<span class="bd mid">Solo grande</span>'
    return '<span class="bd no">No pasa</span>'
pr=''.join(f'<div class="pr" style="background:{bh};color:{th}"><div class="aa disp">Aa</div><div class="pt">Texto de ejemplo</div><div class="meta" style="color:{th}">{tn} / {bn}</div><div class="ratio" style="background:var(--claro);color:var(--noche)"><b>{cr(th,bh):.2f}:1</b>{badge(cr(th,bh))}</div></div>' for tn,th,bn,bh in pairs)
scale=[('Display','Archivo 800 · 96/0.9','disp','font-size:72px;line-height:.9','Vuelve.'),
('H1','Archivo 800 · 64','disp','font-size:52px;line-height:.92','Que siempre regresen.'),
('H2 · H3 · H4','Archivo 800 · 44 · 32 · 24','disp','font-size:34px;line-height:1','Clientes · Avisos · Reportes'),
('Lead','Manrope 500 · 20/1.5','','font-size:20px;font-weight:500','Ves quién regresa y quién no, en un solo lugar.'),
('Texto · Interfaz','Manrope 400 · 16 / 500 · 14','','font-size:16px;white-space:normal!important;line-height:1.5','Tus datos son tuyos y los puedes descargar cuando quieras. Precio claro, sin contratos.'),
('Dato','Manrope 700 tabular · 32','num','font-size:32px;font-weight:700;letter-spacing:-.02em','68 % · 1,284 · c/ 19 d'),
('Etiqueta · Sticker','Manrope 700 · 11 · Archivo 800 · 13','','font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase','Última visita &nbsp; <span class="stk" style="background:var(--menta);color:var(--noche);font-size:13px;letter-spacing:.02em">Casi premio</span>')]
sc=''.join(f'<div class="srow"><div class="sl"><b>{a}</b><span>{b}</span></div><div class="{c}" style="{st};color:var(--noche);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">{t}</div></div>' for a,b,c,st,t in scale)
html=f'''<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Manrope:wght@400;500;600;700;800&display=block" rel="stylesheet">
<link rel="stylesheet" href="ciclo-v2.css">
<style>
.wrap{{padding:30px 40px;height:1000px;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto 1fr;gap:18px 34px}}
.head{{grid-column:1/3;display:flex;justify-content:space-between;align-items:flex-end}}
h1{{font-size:50px;line-height:.86;text-transform:uppercase}}
.col{{display:flex;flex-direction:column;gap:14px;min-height:0}}
.h2{{font-size:20px;text-transform:uppercase;display:flex;justify-content:space-between;align-items:baseline}}
.h2 small{{font-family:Manrope;font-size:11px;font-weight:600;color:#4D635A;text-transform:none;font-stretch:100%;letter-spacing:0}}
.bar{{display:flex;height:44px;border:var(--b);border-radius:12px;overflow:hidden;box-shadow:4px 4px 0 var(--noche)}}
.seg{{display:flex;align-items:center;padding:0 10px;font-size:12px;border-right:2px solid var(--noche);white-space:nowrap}}.seg:last-child{{border:0;padding:0 4px}}
.sws{{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}}
.sw{{border:var(--b);border-radius:12px;height:148px;padding:10px 11px;display:flex;flex-direction:column}}
.sw .role{{font-size:9.5px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}}
.sw .nm{{font-size:22px;margin-top:auto;line-height:1}}
.sw .hx{{font-size:10.5px;font-weight:600;margin-top:4px;line-height:1.35}}
.minis{{display:grid;grid-template-columns:repeat(5,1fr);gap:10px}}
.mini{{border:1.5px solid var(--noche);border-radius:10px;padding:8px 10px;display:flex;flex-direction:column;gap:1px;font-size:10.5px}}
.mini b{{font-size:12px}}.mini em{{font-style:normal;font-weight:600;opacity:.85}}
.prs{{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}}
.pr{{border:1.5px solid var(--noche);border-radius:10px;padding:8px 10px 0;display:flex;flex-direction:column;overflow:hidden;height:118px}}
.pr .aa{{font-size:30px;line-height:1}}.pr .pt{{font-size:12px;font-weight:600}}
.pr .meta{{font-size:9.5px;font-weight:700;opacity:.85;margin-top:2px}}
.ratio{{margin:auto -10px 0;border-top:1.5px solid var(--noche);padding:4px 8px;display:flex;justify-content:space-between;align-items:center;font-size:11.5px}}
.bd{{font-size:9px;font-weight:800;padding:1px 6px;border-radius:5px;border:1.5px solid var(--noche);text-transform:uppercase;letter-spacing:.04em}}
.ok{{background:var(--bosque);color:var(--lino)}}.ok2{{background:var(--menta)}}.mid{{background:#FFE6D8}}.no{{background:#FDECEA;color:#B42318;border-color:#B42318}}
.scale{{border:var(--b);border-radius:14px;box-shadow:5px 5px 0 var(--noche);background:var(--claro);padding:6px 18px;display:flex;flex-direction:column;flex:1;min-height:0}}
.srow{{display:grid;grid-template-columns:150px 1fr;gap:14px;align-items:center;border-bottom:1px solid #DAD4C6;padding:8px 0;flex:1}}
.srow:last-child{{border:0}}
.sl b{{display:block;font-size:12px}}.sl span{{font-size:10.5px;color:#4D635A;font-weight:600}}
.lic{{font-size:11.5px;line-height:1.45;color:#2E4A40}}
</style></head><body><div class="wrap">
<div class="head"><div><div class="lbl" style="margin-bottom:8px">LealTab · Fase 3 · Identidad visual</div><h1 class="disp">Paleta y tipografía</h1></div>
<div style="font-size:12.5px;max-width:620px;text-align:right;line-height:1.45;color:#2E4A40">Contraste calculado con la fórmula de luminancia relativa de WCAG 2.1. AA: 4.5:1 en texto normal y 3:1 en texto grande y gráficos. Los colores de función son provisionales hasta la Fase 4.</div></div>
<div class="col">
 <div class="h2 disp">Proporción <small>en una pieza típica</small></div>
 <div class="bar">{bar}</div>
 <div class="sws">{sw}</div>
 <div class="h2 disp" style="margin-top:2px">Neutros y función <small>función provisional · Fase 4</small></div>
 <div class="minis">{ex}{fu}</div>
 <div class="h2 disp" style="margin-top:2px">Pares de contraste <small>texto / fondo</small></div>
 <div class="prs">{pr}</div>
</div>
<div class="col">
 <div class="h2 disp">Escala tipográfica <small>Archivo (ancho 75) + Manrope · ambas con licencia OFL</small></div>
 <div class="scale">{sc}</div>
 <div class="lic"><b>Reglas:</b> Archivo solo en titulares de 24 px o más y en stickers; Manrope para todo lo demás. Las cifras van siempre en tabular (<i>tnum</i>). Nunca texto durazno o menta sobre lino; la menta sobre lino siempre lleva contorno noche.</div>
</div>
</div></body></html>'''
open('paleta-y-tipografia.html','w').write(html)
