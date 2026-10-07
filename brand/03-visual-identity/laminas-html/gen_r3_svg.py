from r3geo import *
from r3lock import horizontal, vertical, X
NOCHE,BOSQUE,DUR,LINO='#0F2A22','#0F4D3A','#FF9F6E','#F3EFE6'
OUT='../isotipo/r3/'
NAMES={'A':'a-fiel','B':'b-cerrada','C':'c-remate-recto','D':'d-esquina-tensa'}
def w(name,vb,body,title,size=None):
    sz=f' width="{size[0]}" height="{size[1]}"' if size else ''
    open(OUT+name,'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}"{sz}><title>{title}</title>{body}</svg>\n')
for k,n in NAMES.items():
    p=d(k)
    w(f'isotipo-r3-{n}.svg','0 0 64 64',f'<path fill="{BOSQUE}" d="{p}"/>',f'LealTab isotipo r3 {k} · bosque',(512,512))
    w(f'isotipo-r3-{n}-noche.svg','0 0 64 64',f'<path fill="{NOCHE}" d="{p}"/>',f'LealTab isotipo r3 {k} · noche (un color)',(512,512))
    w(f'isotipo-r3-{n}-negativo.svg','0 0 64 64',f'<rect width="64" height="64" fill="{BOSQUE}"/><path fill="{LINO}" d="{p}"/>',f'LealTab isotipo r3 {k} · negativo sobre bosque',(512,512))
    w(f'isotipo-r3-{n}-marketing.svg','0 0 64 64',
      f'<rect width="64" height="64" fill="{DUR}"/><defs><clipPath id="c"><path d="{p}"/></clipPath></defs><path fill="{NOCHE}" transform="translate(3.2 3.2)" d="{p}"/><path fill="{LINO}" d="{p}"/><path fill="none" stroke="{NOCHE}" stroke-width="5.2" clip-path="url(#c)" d="{p}"/>',
      f'LealTab isotipo r3 {k} · marketing, sombra dura noche sobre durazno',(512,512))
w('isotipo-r3-a-fiel-16px.svg','0 0 16 16',f'<path fill="{BOSQUE}" d="{d(PX16)}"/>','LealTab isotipo r3 A · 16 px ajustado a píxel (favicon)',(16,16))
w('isotipo-r3-a-app-icon.svg','0 0 1024 1024',f'<rect width="1024" height="1024" fill="{BOSQUE}"/><g transform="translate(152 152) scale(11.25)"><path fill="{LINO}" d="{d("A")}"/></g>','LealTab ícono de app r3 A (sin máscara; iOS/Android aplican la suya)',(1024,1024))
def lock(name,fn,sym,txt,bg,title):
    vb,body,_=fn('A',sym,txt)
    vbs=' '.join(f(v) for v in vb)
    bgr=f'<rect x="{f(vb[0])}" y="{f(vb[1])}" width="{f(vb[2])}" height="{f(vb[3])}" fill="{bg}"/>' if bg else ''
    w(name,vbs,bgr+body,title+' · incluye área de protección de 2x en el lienzo',(round(vb[2]*4),round(vb[3]*4)))
lock('lealtab-r3-lockup-horizontal.svg',horizontal,BOSQUE,NOCHE,None,'LealTab lockup horizontal r3 A')
lock('lealtab-r3-lockup-horizontal-negativo.svg',horizontal,LINO,LINO,BOSQUE,'LealTab lockup horizontal r3 A · negativo')
lock('lealtab-r3-lockup-horizontal-durazno.svg',horizontal,NOCHE,NOCHE,DUR,'LealTab lockup horizontal r3 A · noche sobre durazno')
lock('lealtab-r3-lockup-vertical.svg',vertical,BOSQUE,NOCHE,None,'LealTab lockup vertical r3 A')
lock('lealtab-r3-lockup-vertical-negativo.svg',vertical,LINO,LINO,BOSQUE,'LealTab lockup vertical r3 A · negativo')
print('ok')
