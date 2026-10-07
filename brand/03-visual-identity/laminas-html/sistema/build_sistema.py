"""Sistema de variantes SVG. Reutiliza los elementos <path> congelados copiados como texto literal.
Solo cambian fill, viewBox y transforms de grupo (heredados del master vertical)."""
import re, os
M='/workspace/lealtab/03-visual-identity/logo/master/'; OUT='/workspace/lealtab/03-visual-identity/logo/sistema/'
os.makedirs(OUT,exist_ok=True)
H=open(M+'lealtab-master-frozen.svg').read(); V=open(M+'lealtab-vertical-frozen.svg').read()
def block(t,gid):   # elementos <path .../> literales dentro del grupo gid
    g=re.search(rf'<g id="{gid}"[^>]*>(.*?)</g>',t,re.S).group(1)
    return re.findall(r'<path id="[^"]+" d="[^"]+"/>',g)
ISO=block(H,'isotipo'); WM=block(H,'wordmark')
assert block(V,'isotipo')==ISO and block(V,'wordmark')==WM
VT_ISO=re.search(r'<g id="isotipo" transform="([^"]+)"',V).group(1)
VT_WM=re.search(r'<g id="wordmark" transform="([^"]+)"',V).group(1)
VVB=re.search(r'viewBox="([^"]+)"',V).group(1)
WX0,WY0,WW,WH=282.16,24.58,528.15,134.27
# lockup -> (viewBox w,h, transform isotipo, transform wordmark, incluye iso, incluye wm, C en u)
vw,vh=map(float,VVB.split()[2:])
LOCK={
 'horizontal':(810.31,188,None,None,True,True,125.3333),
 'vertical':(vw,vh,VT_ISO,VT_WM,True,True,94.0),
 'isotipo':(222,188,None,None,True,False,125.3333),
 'wordmark':(WW,WH,None,f'translate({-WX0} {-WY0})',False,True,125.3333),
}
COL={'noche':('#0F2A22',None,'positiva · noche sobre transparente'),
     'lino':('#F3EFE6',None,'inversa · lino sobre transparente'),
     'lino-fondo-noche':('#F3EFE6','#0F2A22','inversa · lino sobre fondo noche'),
     'negro':('#000000',None,'monocromática negra'),
     'blanco':('#FFFFFF',None,'monocromática blanca')}
f=lambda v:f'{v:.4f}'.rstrip('0').rstrip('.')
def grp(gid,tr,paths,ind='    '):
    a=f' transform="{tr}"' if tr else ''
    return f'{ind}<g id="{gid}"{a}>'+''.join(f'\n{ind}  {p}' for p in paths)+f'\n{ind}</g>'
def make(lock,col):
    w,h,ti,tw,hi,hw,C=LOCK[lock]; fill,bg,lab=COL[col]
    pad=C/2 if bg else 0
    vb=f'{f(-pad)} {f(-pad)} {f(w+2*pad)} {f(h+2*pad)}'
    body=[]
    if bg: body.append(f'  <rect id="fondo" x="{f(-pad)}" y="{f(-pad)}" width="{f(w+2*pad)}" height="{f(h+2*pad)}" fill="{bg}"/>')
    inner=[]
    if hi: inner.append(grp('isotipo',ti,ISO))
    if hw: inner.append(grp('wordmark',tw,WM))
    body.append(f'  <g id="lealtab-{lock}" fill="{fill}">\n'+'\n'.join(inner)+'\n  </g>')
    nota=' Fondo con margen de presentación de 0.5 C por lado (no es el área de protección).' if bg else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" width="{f(w+2*pad)}" height="{f(h+2*pad)}">\n'
      f'  <title>LealTab · {lock} · {lab}</title>\n'
      f'  <desc>Sistema de variantes (aprobado 2026-10-05). Trazados copiados sin cambios de lealtab-master-frozen.svg / lealtab-vertical-frozen.svg (congelados 2026-10-05). Solo cambian fill, viewBox y transforms de grupo.{nota}</desc>\n'
      +'\n'.join(body)+'\n</svg>\n')
FILES=[]
for lock in LOCK:
    for col in COL:
        n=f'lealtab-{lock}-{col}.svg'; open(OUT+n,'w').write(make(lock,col)); FILES.append(n)
if __name__=='__main__': print(len(FILES),'archivos')
