"""Estilo de ilustración: herramientas de oficio, planas, contorno noche 3 px, colores de marca, sombra dura opcional."""
from comun import *
SW=3; SH=6
def S(d,fill,extra=''): return (d,fill,extra)
import re as _re
def _attrs(base,extra):
    for k,v in _re.findall(r'([\w-]+)="([^"]*)"',extra): base[k]=v
    return ' '.join(f'{k}="{v}"' for k,v in base.items())
def obj(shapes,tf=''):
    art=''.join(f'<path d="{d}" '+_attrs({'fill':c,'stroke':NOCHE,'stroke-width':str(SW),'stroke-linejoin':'round','stroke-linecap':'round'},e)+'/>' for d,c,e in shapes)
    sil=''.join(f'<path d="{d}" '+_attrs({'fill':NOCHE,'stroke':NOCHE,'stroke-width':str(SW),'stroke-linejoin':'round'},e.replace('stroke="'+CLARO+'"',''))+'/>' for d,c,e in shapes if c!='none')
    return f'<g transform="{tf}">{art}</g>', f'<g transform="{tf}">{sil}</g>'
def circ(cx,cy,r): return f'M{f(cx-r)} {f(cy)}A{f(r)} {f(r)} 0 1 0 {f(cx+r)} {f(cy)}A{f(r)} {f(r)} 0 1 0 {f(cx-r)} {f(cy)}Z'
def ring(cx,cy,r1,r2): return circ(cx,cy,r1)+circ(cx,cy,r2)
def rr(x,y,w,h,r): return f'M{f(x+r)} {f(y)}H{f(x+w-r)}A{r} {r} 0 0 1 {f(x+w)} {f(y+r)}V{f(y+h-r)}A{r} {r} 0 0 1 {f(x+w-r)} {f(y+h)}H{f(x+r)}A{r} {r} 0 0 1 {f(x)} {f(y+h-r)}V{f(y+r)}A{r} {r} 0 0 1 {f(x+r)} {f(y)}Z'
EO='fill-rule="evenodd"'
# ---------- barbería ----------
def tijeras(tf):
    half=lambda s:[S(f'M{-7*s} 4L{-2*s} -128Q0 -134 {3*s} -128L{8*s} 2Z',CLARO),
                   S(f'M{-6*s} 0L{-14*s} 50L{-4*s} 52L{6*s} 0Z',BOSQUE),
                   S(ring(-14*s,72,22,11),BOSQUE,EO)]
    a,sa=obj(half(1),'rotate(14)'); b,sb=obj(half(-1),'rotate(-14)')
    p,sp=obj([S(circ(0,0,7),DUR)])
    return f'<g transform="{tf}">{a}{b}{p}</g>', f'<g transform="{tf}">{sa}{sb}{sp}</g>'
def navaja(tf):
    sh=[S('M0 -14H150Q172 -14 172 0Q172 14 150 14H0Q-12 14 -12 0Q-12 -14 0 -14Z',BOSQUE),S(circ(150,0,5),CLARO)]
    bl=[S('M0 -16H130Q150 -16 150 4L150 18Q126 26 92 24H12Q0 24 0 12Z',CLARO),S('M10 -16H130Q150 -16 150 4',  'none')]
    h,shh=obj(sh,'');b,sb=obj(bl,'translate(150 0) rotate(-38) translate(-10 0)')
    return f'<g transform="{tf}">{b}{h}</g>', f'<g transform="{tf}">{sb}{shh}</g>'
def maquina(tf):
    s=[S('M-40 -70Q-40 -96 -14 -96H14Q40 -96 40 -70L46 92Q46 120 18 120H-18Q-46 120 -46 92Z',BOSQUE),
       S(rr(-48,-128,96,36,8),CLARO),S('M-34 -128V-142M-17 -128V-142M0 -128V-142M17 -128V-142M34 -128V-142','none'),
       S(rr(-14,-56,28,46,14),MENTA),S(circ(0,-22,0.1)+'M-12 72H12M-12 86H12','none')]
    return obj(s,tf)
# ---------- estética ----------
def secadora(tf):
    s=[S('M-34 -4L-58 142Q-61 160 -44 162L-22 164Q-8 164 -5 150L16 -4Z',BOSQUE),
       S('M-80 -50Q-80 -110 -20 -110H40Q100 -110 100 -50Q100 10 40 10H-20Q-80 10 -80 -50Z',MENTA),
       S(rr(96,-86,62,72,12),NOCHE),S(ring(-22,-50,44,26),CLARO,EO),
       S('M-22 -64V-36M-36 -50H-8','none'),S(rr(-28,60,13,30,6.5),DUR,'transform="rotate(10 -21 75)"')]
    return obj(s,tf)
def cepillo(tf):
    s=[S('M-16 30L-12 170Q-12 184 0 184Q12 184 12 170L16 30Z',BOSQUE),
       S('M0 -130Q52 -130 52 -50Q52 40 0 40Q-52 40 -52 -50Q-52 -130 0 -130Z',CLARO)]
    dots=''.join(circ(x,y,4.2) for y in range(-100,30,24) for x in range(-30,31,20) if ((x/52)**2+((y+45)/85)**2)<0.62)
    s.append(S(dots,NOCHE,'stroke-width="0"'))
    return obj(s,tf)
def esmalte(tf):
    s=[S('M-38 -10Q-38 -24 -24 -24H24Q38 -24 38 -10V58Q38 74 22 74H-22Q-38 74 -38 58Z',DUR),
       S(rr(-16,-38,32,16,4),NOCHE),S(rr(-14,-112,28,78,8),NOCHE),
       S('M-24 -4Q-24 -12 -16 -12','none','stroke="{0}" stroke-width="5"'.format(CLARO))]
    return obj(s,tf)
# ---------- tapioca ----------
def tapioca(tf):
    pearls=[(-40,110),(-14,118),(14,112),(40,116),(-28,90),(2,94),(30,92),(-6,72)]
    s=[S('M-30 -150L-6 -60H26L16 -150Z',BOSQUE),
       S('M-80 -40L-62 150Q-60 164 -46 164H46Q60 164 62 150L80 -40Z',CLARO),
       S('M-74 30L-64 150Q-62 162 -48 162H48Q62 162 64 150L74 30Z',MENTA),
       S(rr(-77,-14,154,30,4),DUR),
       S('M-92 -40Q-92 -56 -76 -56H76Q92 -56 92 -40Z',CLARO),
       S('M-74 -56Q-70 -112 0 -112Q70 -112 74 -56Z',CLARO),
       S('M-12 -112L-8 -60H22L18 -112','none')]
    s+= [S(circ(x,y,11),NOCHE,'stroke-width="2"') for x,y in pearls]
    # popote ancho asoma por la tapa
    s.insert(6,S('M-14 -112L-26 -168Q-27 -176 -19 -177L6 -180Q14 -180 14 -172L20 -112Z',BOSQUE))
    return obj(s,tf)
ESCENAS={
 'barberia':('Barbería: tijeras, navaja y máquina',MENTA,[maquina('translate(104 168) rotate(-8) scale(0.78)'),tijeras('translate(250 128) rotate(18) scale(0.82)'),navaja('translate(178 256) rotate(-8) scale(0.62)')]),
 'estetica':('Estética: secadora, cepillo y esmalte',LINO,[cepillo('translate(318 134) rotate(12) scale(0.68)'),secadora('translate(138 118) rotate(-4) scale(0.78)'),esmalte('translate(236 226) rotate(-6) scale(0.78)')]),
 'tapioca':('Tapioca: vaso con popote ancho y perlas',MENTA,[tapioca('translate(200 176) scale(0.8)')]),
}
W,H=400,320
def escena(k,sombra=True,fondo=True):
    tit,bg,objs=ESCENAS[k]; o=f'<rect width="{W}" height="{H}" rx="14" fill="{bg}"/>' if fondo else ''
    for art,sil in objs:
        if sombra: o+=f'<g transform="translate({SH} {SH})">{sil}</g>'
        o+=art
    return o
if __name__=='__main__':
    for k,(tit,_,_) in ESCENAS.items():
        write(f'ilustraciones/lt-ilustracion-{k}.svg',svgdoc(W,H,escena(k),f'LealTab · ilustración · {tit}','Plana, contorno noche 3 px, sombra dura noche 6 px (marketing), solo tintas de la paleta. Aprobado 2026-10-06'))
        write(f'ilustraciones/lt-ilustracion-{k}-sin-sombra.svg',svgdoc(W,H,escena(k,False,False),f'LealTab · ilustración · {tit} · sin sombra ni fondo','Versión para producto o fondos propios. Aprobado 2026-10-06'))
    print('ok')
def prev(out='/tmp/il.png',bg=CLARO):
    import subprocess
    html=f'<html><body style="margin:0;background:{bg}">'+''.join(f'<svg xmlns="http://www.w3.org/2000/svg" width="{W*1.25}" height="{H*1.25}" viewBox="0 0 {W} {H}" style="margin:4px">{escena(k)}</svg>' for k in ESCENAS)+'</body></html>'
    open('/tmp/il.html','w').write(html)
    subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars','--force-device-scale-factor=1','--window-size=1530,410',f'--screenshot={out}','file:///tmp/il.html'],capture_output=True)
