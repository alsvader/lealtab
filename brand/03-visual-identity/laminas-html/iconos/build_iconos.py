"""Íconos digitales LealTab (aprobado 2026-10-05).
Íconos grandes: elementos <path> de #isotipo copiados LITERALMENTE del master congelado; solo cambian
fill, transform de grupo, viewBox y fondo. Pixel-fit: trazados nuevos derivados (pixfit.py)."""
import os, json
from geo import iso_elements, iso_d, centroid
from pixfit import build, SPECS, SPECS_B, f
OUT='/workspace/lealtab/03-visual-identity/logo/iconos/'
NOCHE,LINO,BLANCO='#0F2A22','#F3EFE6','#FFFDF8'
ISO=iso_elements()
for sub in ('app','pwa','avatar','pixel','favicon','favicon/descartado/opcion-a'): os.makedirs(OUT+sub,exist_ok=True)
# --- Tamaño y centrado óptico ---------------------------------------------------------------
FRAC=0.58                       # ancho del isotipo = 58 % del lado (alto = 49 %)
BW,BH=222,188
CX,CY,_=centroid(list(iso_d().values()))     # centro de masa ≈ (106.1, 95.2) u
DX=0.5*(BW/2-CX)                # compensación horizontal: 50 % del desfase de masa → +2.45 u
DY=(BH/2-CY)                    # compensación vertical: 100 % → −1.17 u (sube, además da el leve "alza" óptica)
def place(S,frac=FRAC):
    k=frac*S/BW; tx=S/2-(BW/2-DX)*k; ty=S/2-(BH/2-DY)*k
    return k,tx,ty
def iso_group(fill,S,frac=FRAC,ind='  '):
    k,tx,ty=place(S,frac)
    return (f'{ind}<g id="lealtab-isotipo" fill="{fill}" transform="translate({f(tx)} {f(ty)}) scale({k:.6f})">\n'
            f'{ind}  <g id="isotipo">\n'+''.join(f'{ind}    {p}\n' for p in ISO)+f'{ind}  </g>\n{ind}</g>\n')
FRAC_MASK=0.50                  # maskable: 50 % del lado (petición de Aarón, 2026-10-05)
DESC_T=('Trazados de #isotipo copiados sin cambios de logo/master/lealtab-master-frozen.svg (congelado 2026-10-05). '
      'Solo cambian fill, viewBox, transform de grupo y fondo. Ancho del isotipo = {pct} % del lado; '
      f'centrado óptico: +{DX:.2f} u en x, {DY:.2f} u en y respecto al centro de la caja (proporcional a la escala).')
def svg(S,title,bg,fill,frac=FRAC):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {S} {S}" width="{S}" height="{S}">\n'
            f'  <title>LealTab · {title} · Aprobado 2026-10-05</title>\n  <desc>{DESC_T.format(pct=round(frac*100))}</desc>\n'
            f'  {bg}\n'+iso_group(fill,S,frac)+'</svg>\n')
rr=lambda S,col:f'<rect id="fondo" width="{S}" height="{S}" rx="{f(S*0.225)}" fill="{col}"/>'
full=lambda S,col:f'<rect id="fondo" width="{S}" height="{S}" fill="{col}"/>'
circ=lambda S,col:f'<circle id="fondo" cx="{S/2:g}" cy="{S/2:g}" r="{S/2:g}" fill="{col}"/>'
ICONS={  # archivo: (S, título, fondo, color isotipo)
 'app/lealtab-app-icon-180':(180,'app icon 180 (apple-touch) · cuadrado redondeado noche',rr(180,NOCHE),LINO),
 'app/lealtab-apple-touch-icon-180-sangre':(180,'apple-touch-icon 180 a sangre (iOS aplica su máscara)',full(180,NOCHE),LINO),
 'pwa/lealtab-pwa-192':(192,'PWA 192 · purpose any',rr(192,NOCHE),LINO),
 'pwa/lealtab-pwa-512':(512,'PWA 512 · purpose any',rr(512,NOCHE),LINO),
 'pwa/lealtab-pwa-maskable-512':(512,'PWA 512 · purpose maskable · fondo a sangre, zona segura 80 %, isotipo al 50 %',full(512,NOCHE),LINO,FRAC_MASK),
 'avatar/lealtab-avatar-lino-400':(400,'avatar lino 400 · círculo lino, isotipo noche',circ(400,LINO),NOCHE),
 'avatar/lealtab-avatar-noche-400':(400,'avatar noche 400 · círculo noche, isotipo lino',circ(400,NOCHE),LINO),
}
for name,(S,t,bg,fill,*fr) in ICONS.items(): open(OUT+name+'.svg','w').write(svg(S,t,bg,fill,*(fr or [FRAC])))
# --- Pixel-fit ------------------------------------------------------------------------------
def pix_svg(N,spec,fill=NOCHE,bg='',title='',extra_style='',estado='Aprobado 2026-10-05.'):
    l,g=build(spec)
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {N} {N}" width="{N}" height="{N}" shape-rendering="geometricPrecision">\n'
            f'  <title>LealTab · {title}</title>\n'
            f'  <desc>DERIVADO · trazados NUEVOS ajustados a la rejilla de {N} px a partir del isotipo congelado (no son los d del master). '
            f'Grosor {spec["t"]} px, bordes rectos en píxel entero. {estado}</desc>\n'
            +extra_style+(f'  {bg}\n' if bg else '')+
            f'  <g id="isotipo-ajustado-{spec["N"] if "N" in spec else N}px" fill="{fill}" data-derivado="pixel-fit">\n'
            f'    <path id="pieza-l-ajustada" d="{l}"/>\n    <path id="pieza-gancho-ajustada" d="{g}"/>\n  </g>\n</svg>\n')
for N,s in SPECS.items():
    open(OUT+f'pixel/lealtab-isotipo-{N}px.svg','w').write(pix_svg(N,s,title=f'isotipo ajustado a píxel {N} px · noche'))
# --- Favicons -------------------------------------------------------------------------------
DARK='  <style>@media (prefers-color-scheme: dark){#isotipo-ajustado-32px{fill:#F3EFE6}}</style>\n'
open(OUT+'favicon/descartado/opcion-a/favicon.svg','w').write(pix_svg(32,SPECS[32],title='DESCARTADA · favicon opción A · isotipo noche sobre transparente (se pierde en pestaña oscura)',extra_style=DARK,estado='PROPUESTA · pendiente de aprobación.'))
open(OUT+'favicon/favicon.svg','w').write(pix_svg(32,SPECS_B[32],fill=LINO,bg=f'<rect id="fondo" width="32" height="32" rx="7" fill="{NOCHE}"/>',title='favicon oficial (opción B) · isotipo lino sobre cuadrado redondeado noche'))
FAV_B_RX={16:3.5,32:7,48:10.5}
for N in (16,32,48):
    open(f'/tmp/fav-a-{N}.svg','w').write(pix_svg(N,SPECS[N],title=f'fav A {N}'))
    open(f'/tmp/fav-b-{N}.svg','w').write(pix_svg(N,SPECS_B[N],fill=LINO,bg=f'<rect id="fondo" width="{N}" height="{N}" rx="{FAV_B_RX[N]}" fill="{NOCHE}"/>',title=f'fav B {N}'))
    open(f'/tmp/fav-a-lino-{N}.svg','w').write(pix_svg(N,SPECS[N],fill=LINO,title=f'fav A lino {N}'))
json.dump({'FRAC':FRAC,'DX':DX,'DY':DY,'centroide':[CX,CY],'icons':{k:v[0] for k,v in ICONS.items()}},open('/tmp/iconos-meta.json','w'))
print('svg ok', FRAC, DX, DY)
