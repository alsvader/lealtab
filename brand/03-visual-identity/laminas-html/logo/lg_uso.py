from lg_common import *
_,_,mh=horizontal(NOCHE,NOCHE)
X=52  # x = grosor del trazo del isotipo
def prot(fn,w,label=True,col='#C2560F'):
    vb,b,m=fn(NOCHE); pad=2*X; x,y,W,Hh=vb
    g=f'<rect x="{-pad}" y="{-pad}" width="{W+2*pad}" height="{Hh+2*pad}" fill="#FFFDF8" stroke="{col}" stroke-width="3" stroke-dasharray="10 8"/>'
    g+=f'<rect x="0" y="0" width="{fmt(W)}" height="{fmt(Hh)}" fill="none" stroke="{col}" stroke-width="2" opacity=".5"/>'
    for cx,cy in [(-pad,-pad),(W,-pad),(-pad,Hh),(W,Hh)]:
        g+=f'<rect x="{fmt(cx)}" y="{fmt(cy)}" width="{pad}" height="{pad}" fill="{col}" opacity=".14"/>'
    g+=f'<text x="{-pad/2}" y="{-pad/2+14}" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="40" fill="{col}">2x</text>'
    # x = trazo
    g+=f'<path d="M0 {-22}H52" stroke="{col}" stroke-width="4"/><text x="26" y="-32" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="30" fill="{col}">x</text>'
    return svgdoc((x,y,W,Hh),g+b,w=w,pad=pad+4)
mins=[('Horizontal',H(NOCHE,w=96),'96 px','25 mm'),('Vertical',V(NOCHE,w=64),'64 px','18 mm'),
      ('Isotipo',f'<img src="{pximg(16)}" width="16" height="16">','16 px*','6 mm'),('Wordmark',WM(NOCHE,w=64),'64 px','15 mm')]
minh=''.join(f'<div class="mn"><div class="mv">{s}</div><b>{n}</b><span>Digital {d}<br>Impreso {p}</span></div>' for n,s,d,p in mins)
def bad(svg,txt,bg=CLARO):
    return f'<div class="bd"><div class="bv" style="background:{bg}">{svg}<i>✕</i></div><span>{txt}</span></div>'
vb,b,m=horizontal(NOCHE,NOCHE)
def hraw(body,w=170,extra='',vbx=None,bg=None):
    v=vbx or vb; return svgdoc(v,body,w=w)
# recolocar: símbolo a la derecha
C=m['C'];s=m['s']
from lg_word import WD,WB
re_body=f'<path transform="translate({fmt(-WB[0]*s)} {fmt(SYM_H/2+C/2)}) scale({s:.6f})" fill="{NOCHE}" d="{WD}"/>'+symg(NOCHE,(WB[2]-WB[0])*s+m['gap'],0)
re_vb=(0,0,(WB[2]-WB[0])*s+m['gap']+SYM_W,SYM_H)
bads=''.join([
 bad(f'<div style="transform:scale(1.5,.75)">{H(NOCHE,w=112)}</div>','Estirar o comprimir'),
 bad(f'<div style="transform:rotate(-12deg)">{H(NOCHE,w=150)}</div>','Rotar o inclinar'),
 bad(H(DUR,w=165),'Cambiar los colores (durazno, bosque u otros)'),
 bad(f'<div style="filter:drop-shadow(4px 4px 0 #FF9F6E)">{H(NOCHE,w=160)}</div>','Sombras o efectos fuera de piezas de marketing'),
 bad(svgdoc(re_vb,re_body,w=165),'Recolocar el símbolo o cambiar su escala'),
 bad(H(NOCHE,w=165,gap=0.12),'Juntar símbolo y nombre (o cambiar espacios)'),
 bad(f'<div style="filter:blur(0)">{H(NOCHE,w=165).replace(f"fill=\"{NOCHE}\"","fill=\"none\" stroke=\"#0F2A22\" stroke-width=\"1.6\" vector-effect=\"non-scaling-stroke\"")}</div>','Contornear, delinear o vaciar'),
 bad(H(NOCHE,w=165),'Poner noche sobre fondos oscuros o fotos sin contraste',BOSQUE),
])
combos=[('Noche / lino',NOCHE,LINO,'13.3:1'),('Noche / blanco lino',NOCHE,CLARO,'15.0:1'),('Noche / menta gris',NOCHE,MENTA,'11.4:1'),('Noche / durazno',NOCHE,DUR,'7.6:1 · marketing'),
        ('Lino / noche',LINO,NOCHE,'13.3:1'),('Lino / bosque',LINO,BOSQUE,'8.5:1'),('Negro / blanco','#000','#fff','21:1'),('Blanco / negro','#fff','#000','21:1')]
comb=''.join(f'<div class="cb"><div class="cv" style="background:{bg};{"border:1.5px solid #0F2A22" if bg in ("#fff",CLARO,LINO) else ""}">{H(fg,w=100)}</div><b>{n}</b><span>{r}</span></div>' for n,fg,bg,r in combos)
body=f'''<div class="wrap">
<div class="head"><div><div class="lbl" style="margin-bottom:8px">LealTab · Fase 3 · Logo final v1.0 · Normas de uso</div><h1 class="disp">Cómo se usa el logo</h1></div>
<div class="hn">x = grosor del trazo del isotipo (52 u del símbolo maestro; ≈ 0.41 de la altura de mayúsculas en el horizontal). Área de protección: 2x por lado en todas las versiones. Nada entra en esa zona: texto, bordes, otras marcas.</div></div>
<div class="g">
 <div class="pn box p1"><div class="t">Área de protección · horizontal</div><div class="c">{prot(lambda c:horizontal(c,c),560)}</div></div>
 <div class="pn box p2"><div class="t">Vertical e isotipo</div><div class="c"><div style="display:flex;gap:22px;align-items:center">{prot(lambda c:vertical(c,c),215)}{prot(isotipo,150)}</div></div></div>
 <div class="pn box p3"><div class="t">Tamaños mínimos (a tamaño real)</div><div class="c"><div class="mins">{minh}</div></div><div class="n">*El isotipo a 16, 32 y 48 px usa siempre la versión ajustada a píxel (favicon.ico, favicon-16/32/48.png). Por debajo de los mínimos, usar solo el isotipo.</div></div>
 <div class="pn box p4"><div class="t" style="color:#B42318">Usos incorrectos</div><div class="c"><div class="bads">{bads}</div></div></div>
 <div class="pn box p5"><div class="t">Combinaciones de color permitidas</div><div class="c"><div class="combs">{comb}</div></div><div class="n">El logo va en noche o lino (y negro/blanco puros para una tinta). El durazno es acento del sistema: puede ser fondo en marketing, nunca color del logo. Noche sobre bosque no: 1.56:1.</div></div>
</div></div>'''
css='''<style>.g{flex:1;display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr) minmax(0,1.15fr);grid-template-rows:1fr 1.12fr;gap:18px;min-height:0}
.p1{grid-column:1;grid-row:1}.p2{grid-column:2;grid-row:1}.p3{grid-column:3;grid-row:1}.p4{grid-column:1/3;grid-row:2}.p5{grid-column:3;grid-row:2}
.mins{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;align-items:end;width:100%}
.mn{display:flex;flex-direction:column;align-items:center;gap:4px;text-align:center}.mv{height:70px;display:grid;place-items:center}
.mn b{font-size:11.5px}.mn span{font-size:10.5px;color:#2E4A40;line-height:1.3}
.bads{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;width:100%}
.bd{display:flex;flex-direction:column;gap:5px}.bv{height:108px;border:1.5px solid var(--noche);border-radius:10px;display:grid;place-items:center;position:relative;overflow:hidden}
.bv i{position:absolute;top:5px;right:7px;font-style:normal;font-weight:800;color:#B42318;font-size:17px;line-height:1}
.bd span{font-size:11px;font-weight:600;line-height:1.3}
.combs{display:grid;grid-template-columns:repeat(2,1fr);gap:9px 12px;width:100%}
.cb{display:grid;grid-template-columns:126px 1fr;grid-template-rows:auto auto;column-gap:9px;align-items:center}
.cv{grid-row:1/3;height:50px;border-radius:8px;display:grid;place-items:center}
.cb b{font-size:11.5px;align-self:end}.cb span{font-size:10.5px;color:#2E4A40;align-self:start}
</style>'''
open('logo-uso.html','w').write(HEAD+css+'</head><body>'+body+'</body></html>')
print('ok')
