from build_sistema import ISO, WM, VT_ISO, VT_WM, LOCK
OUT='/workspace/lealtab/03-visual-identity/logo/sistema/'
NOCHE,LINO,CLARO,DUR,GN='#0F2A22','#F3EFE6','#FFFDF8','#FF9F6E','#4D635A'
def use(lock):
    if lock=='horizontal': return '<use href="#isotipo"/><use href="#wordmark"/>'
    if lock=='vertical': return f'<use href="#isotipo" transform="{VT_ISO}"/><use href="#wordmark" transform="{VT_WM}"/>'
    if lock=='isotipo': return '<use href="#isotipo"/>'
    return '<use href="#wordmark" transform="translate(-282.16 -24.58)"/>'
def T(x,y,s,size=13,w=600,fill=NOCHE,fam='Manrope',anchor='start',extra=''):
    st='font-stretch:75%;text-transform:uppercase;' if fam=='Archivo' else ''
    return f'<text x="{x}" y="{y}" font-family="{fam}" font-weight="{w}" font-size="{size}" fill="{fill}" text-anchor="{anchor}" style="{st}" {extra}>{s}</text>'
def card(n,x,y,w,h,title,sub,lock,fill,bg,foot,pad=34):
    o=f'<rect x="{x+5}" y="{y+5}" width="{w}" height="{h}" rx="12" fill="{NOCHE}"/><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{CLARO}" stroke="{NOCHE}" stroke-width="2"/>'
    o+=T(x+16,y+30,f'{n:02d} · {title}',17,800,fam='Archivo')+T(x+w-16,y+30,sub,12,700,'#C2560F',anchor='end')
    ax,ay,aw,ah=x+14,y+44,w-28,h-44-40
    o+=f'<rect x="{ax}" y="{ay}" width="{aw}" height="{ah}" rx="8" fill="{bg}"' + (' stroke="#d8cfbf" stroke-width="1"' if bg in ('#FFFFFF',) else '')+'/>'
    lw,lh=LOCK[lock][0],LOCK[lock][1]; s=min((aw-2*pad)/lw,(ah-2*pad)/lh)
    tx,ty=ax+(aw-lw*s)/2,ay+(ah-lh*s)/2
    o+=f'<g fill="{fill}" transform="translate({tx:.2f} {ty:.2f}) scale({s:.5f})">{use(lock)}</g>'
    o+=T(x+16,y+h-24,foot[0],11.5,700)+T(x+16,y+h-9,foot[1],10.5,500,GN)
    return o
cards=[
 (1,40,160,700,380,'Horizontal principal','2 C → 1.5 C · espacio 0.48 C'.replace('2 C → ',''),'horizontal',NOCHE,LINO,('Noche #0F2A22 sobre transparente (fondo lino de muestra)','lealtab-horizontal-noche.svg')),
 (2,764,160,388,380,'Vertical','2 C · 0.45 C','vertical',NOCHE,LINO,('Noche #0F2A22 · transparente','lealtab-vertical-noche.svg')),
 (3,1176,160,384,380,'Isotipo','222 × 188 u','isotipo',NOCHE,LINO,('Noche #0F2A22 · transparente','lealtab-isotipo-noche.svg'),62),
 (4,40,572,370,380,'Wordmark','Archivo 75/800 a curvas','wordmark',NOCHE,LINO,('Noche #0F2A22 · transparente','lealtab-wordmark-noche.svg')),
 (5,434,572,370,380,'Inversa','lino sobre noche','horizontal',LINO,NOCHE,('Lino #F3EFE6 · transparente o con fondo noche','lealtab-*-lino.svg · lealtab-*-lino-fondo-noche.svg')),
 (6,828,572,354,380,'Mono negra','#000000','horizontal','#000000','#FFFFFF',('Negro puro #000 · transparente','lealtab-*-negro.svg')),
 (7,1206,572,354,380,'Mono blanca','#FFFFFF','horizontal','#FFFFFF','#000000',('Blanco puro #FFF · transparente','lealtab-*-blanco.svg')),
]
defs='<defs>\n<g id="isotipo">'+''.join('\n  '+p for p in ISO)+'\n</g>\n<g id="wordmark">'+''.join('\n  '+p for p in WM)+'\n</g>\n</defs>'
badge='Sistema de variantes · aprobado 2026-10-05'
body=''.join(card(*c) for c in cards)
svg=f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1600 1000" width="1600" height="1000">
<title>LealTab · Sistema de variantes · Aprobado 2026-10-05</title>
<desc>Lámina con las 7 variantes oficiales. Cada variante es un use de los grupos #isotipo y #wordmark definidos una sola vez en defs, con los elementos path copiados literalmente de los masters congelados 2026-10-05.</desc>
<style>@font-face{{font-family:'Archivo';src:url('file:///usr/share/fonts/truetype/sand-box/google/Archivo/Archivo-VariableFont_wdth,wght.ttf');font-weight:100 900;font-stretch:62% 125%}}@font-face{{font-family:'Manrope';src:url('file:///usr/share/fonts/truetype/sand-box/google/Manrope/Manrope-VariableFont_wght.ttf');font-weight:200 800}}</style>
{defs}
<rect width="1600" height="1000" fill="{LINO}"/>
{T(40,50,'LEALTAB · FASE 3 · SISTEMA DE VARIANTES DERIVADO DE LOS MASTERS CONGELADOS (2026-10-05)',12,800,extra='letter-spacing="1.6"')}
{T(40,118,'Sistema de variantes',58,800,fam='Archivo')}
<rect x="{1560-700+5}" y="{68+5}" width="700" height="50" rx="10" fill="{NOCHE}"/><rect x="{1560-700}" y="68" width="700" height="50" rx="10" fill="{DUR}" stroke="{NOCHE}" stroke-width="2.5"/>
{T(1560-350,101,badge,20,800,fam='Archivo',anchor='middle',extra='letter-spacing="0.6"')}
{body}
{T(40,984,'Cada lockup (horizontal, vertical, isotipo y wordmark) está en noche, lino, lino sobre noche, negro y blanco: 20 SVG en logo/sistema/. Todos los atributos d coinciden con los congelados (verificacion-paths.json). Las muestras van sobre fondo solo para verlas.',11.5,500,GN)}
</svg>
'''
open(OUT+'sistema-variantes.svg','w').write(svg); print('ok')
