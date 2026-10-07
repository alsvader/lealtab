"""Lockup vertical (PROPUESTA) heredando EXACTAMENTE los trazados del master congelado.
Solo translate + scale uniforme en grupos. No se reescribe ningún atributo d."""
import re, hashlib, json
MASTER='/workspace/lealtab/03-visual-identity/logo/master/lealtab-master-frozen.svg'
OUTDIR='/workspace/lealtab/03-visual-identity/logo/master/'
src=open(MASTER).read()
PATHS=re.findall(r'<path id="([^"]+)" d="([^"]+)"/>',src)
ISO=[(i,d) for i,d in PATHS if i.startswith('isotipo')]; WM=[(i,d) for i,d in PATHS if i.startswith('wm-')]
# constantes del master (de su <desc>)
C_M=125.3333333; BASE_M=156.6666667; WX0,WX1,WY0,WY1=282.16,810.31,24.58,158.86
SYM_W,SYM_H=222,188; CENTROID_X=106.0   # centroide de tinta del isotipo (raster ×4)
OPT=0.5   # se corrige la mitad del desfase entre centroide y centro de caja
f=lambda v:(f'{v:.4f}'.rstrip('0').rstrip('.'))
def layout(k_sym=2.0,gap=0.45):
    # el isotipo queda a escala 1 (188 u); el wordmark se escala para que C_v = 188/k_sym
    Cv=SYM_H/k_sym; s=Cv/C_M
    ww=(WX1-WX0)*s; W=max(ww,SYM_W)
    wtx=(W-ww)/2-WX0*s
    cap_top=SYM_H+gap*Cv; wty=cap_top-(BASE_M-C_M)*s
    shift=OPT*((SYM_W/2)-CENTROID_X)          # +2.5 u: el símbolo pesa a la izquierda
    sx=(W-SYM_W)/2+shift
    bottom=WY1*s+wty
    return dict(k=k_sym,gap=gap,Cv=Cv,s=s,ww=ww,W=W,wtx=wtx,wty=wty,sx=sx,shift=shift,H=bottom,cap_top=cap_top,gap_u=gap*Cv)
def svg(L,title):
    iso=''.join(f'\n      <path id="{i}" d="{d}"/>' for i,d in ISO)
    wm=''.join(f'\n      <path id="{i}" d="{d}"/>' for i,d in WM)
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {f(L['W'])} {f(L['H'])}" width="{f(L['W'])}" height="{f(L['H'])}">
  <title>{title}</title>
  <desc>Lockup vertical LealTab. Trazados heredados sin cambios de lealtab-master-frozen.svg (sha256 c0d59f96…acd65); solo translate/scale uniforme en los grupos. Símbolo = {L['k']} C, espacio = {L['gap']} C ({f(L['gap_u'])} u), C = {f(L['Cv'])} u. Corrección óptica: símbolo desplazado +{f(L['shift'])} u a la derecha del centro geométrico.</desc>
  <g id="lealtab-vertical" fill="#0F2A22">
    <g id="isotipo" transform="translate({f(L['sx'])} 0)">{iso}
    </g>
    <g id="wordmark" transform="translate({f(L['wtx'])} {f(L['wty'])}) scale({f(L['s'])})">{wm}
    </g>
  </g>
</svg>
'''
VARIANTS={'principal':layout(2.0,0.45),'alt-a':layout(1.75,0.5),'alt-b':layout(2.25,0.4)}
def identity(file):
    t=open(file).read(); got=dict(re.findall(r'<path id="([^"]+)" d="([^"]+)"/>',t))
    rows=[]
    for i,d in PATHS:
        h1=hashlib.sha256(d.encode()).hexdigest(); h2=hashlib.sha256(got.get(i,'').encode()).hexdigest()
        rows.append((i,len(d),h1[:12],h2[:12],d==got.get(i)))
    tr=re.findall(r'transform="([^"]+)"',t)
    return rows,tr
if __name__=='__main__':
    open(OUTDIR+'lealtab-vertical.svg','w').write(svg(VARIANTS['principal'],'LealTab · lockup vertical · PROPUESTA · no congelado'))
    for k in ('alt-a','alt-b'):
        open(f'/tmp/lealtab-vertical-{k}.svg','w').write(svg(VARIANTS[k],f'LealTab · lockup vertical · ALTERNATIVA {k}'))
    rows,tr=identity(OUTDIR+'lealtab-vertical.svg')
    for r in rows: print(r)
    print(tr); print(json.dumps({k:{a:round(b,3) for a,b in v.items()} for k,v in VARIANTS.items()},indent=0))
