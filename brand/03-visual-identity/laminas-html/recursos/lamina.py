"""Lámina recursos-graficos.svg/.png (1600×1000) · Recursos gráficos · aprobado 2026-10-06."""
import sys; sys.path.insert(0,'../iconos')
from render import render_one
from comun import *
import iconos as IC, aro as A, ilustraciones as IL, stickers as STK
def frame(n,x,y,w,h,title,sub,foot):
    o=f'<rect x="{x+5}" y="{y+5}" width="{w}" height="{h}" rx="12" fill="{NOCHE}"/><rect x="{x}" y="{y}" width="{w}" height="{h}" rx="12" fill="{CLARO}" stroke="{NOCHE}" stroke-width="2"/>'
    o+=T(x+16,y+30,f'{n:02d} · {title}',17,800,fam='Archivo')+T(x+w-16,y+30,sub,12,700,OR,anchor='end')
    return o+T(x+16,y+h-12,foot,10.5,600,GN)
area=lambda x,y,w,h,bg=LINO:f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" rx="8" fill="{bg}"/>'
ic=lambda k,x,y,s,act=False,col=NOCHE:f'<g transform="translate({f(x)} {f(y)}) scale({f(s/24)})">{IC.glyph(k,act,col=col)}</g>'
b=''
# ---- 01 set de íconos ----
x,y,w,h=40,150,600,400; b+=frame(1,x,y,w,h,'Iconografía del sistema',f'{len(IC.ORDEN)} íconos · línea y activo','Rejilla 24 · trazo 2 noche · remates redondos · activo = relleno plano menta gris.')
ax,ay,aw,ah=x+14,y+44,w-28,h-74; b+=area(ax,ay,aw,ah,LINO)
cw,chh=aw/6,ah/3
for i,k in enumerate(IC.ORDEN):
    cx=ax+(i%6)*cw; cy=ay+(i//6)*chh
    b+=ic(k,cx+cw/2-34,cy+22,32)+ic(k,cx+cw/2+4,cy+22,32,True)
    b+=T(cx+cw/2,cy+76,IC.I[k][0],10.5,700,anchor='middle')
b+=T(ax+aw-10,ay+ah-8,'izquierda línea · derecha activo',9.5,600,GN,anchor='end')
# ---- 02 construcción y tamaños ----
x,y,w,h=664,150,440,400; b+=frame(2,x,y,w,h,'Construcción y tamaños','emparentado con el isotipo','Prueba a tamaño real; archivo: iconos/lt-iconos-prueba-tamanos.svg.')
ax,ay,aw=x+14,y+44,w-28; b+=area(ax,ay,aw,200,LINO)
gx,gy,S=ax+16,ay+14,7  # 24 × 7 = 168
b+=f'<rect x="{gx}" y="{gy}" width="168" height="168" fill="{CLARO}"/>'
b+=''.join(f'<path d="M{gx+i*S*2} {gy}V{gy+168}M{gx} {gy+i*S*2}H{gx+168}" stroke="#E4DED2" stroke-width="1"/>' for i in range(13))
b+=f'<rect x="{gx+2*S}" y="{gy+2*S}" width="{20*S}" height="{20*S}" fill="none" stroke="{DUR}" stroke-width="1" stroke-dasharray="3 3"/>'
b+=ic('estadisticas',gx,gy,168)
# isotipo pequeño para comparar la esquina
b+=f'<g transform="translate({ax+200} {ay+18}) scale(0.32)" fill="{NOCHE}">{A.ISO}</g>'
notas=[('Trazo 2 px (2.5 en marketing)',''),('Remates redondos, como el isotipo',''),('Esquina: exterior 2.25 / interior 0.25','misma proporción que el isotipo'),('','(58 y 6 sobre trazo 52)'),('Formas abiertas en L: ejes,','esquinas de QR, compartir')]
yy=ay+92
for a_,b_ in notas:
    if a_: b+=T(ax+200,yy,a_,11,700); yy+=14
    if b_: b+=T(ax+200,yy,b_,10.5,500,GN); yy+=14
    yy+=4
# prueba de tamaños
ty=ay+214; b+=area(ax,ty,aw,112,LINO)
muestra=['visita','recompensa','negocio','escanear','estadisticas','regalo']
for j,(s,lab) in enumerate([(16,'16 px'),(24,'24 px'),(32,'32 px')]):
    yy=ty+14+[0,24,54][j]
    b+=T(ax+12,yy+s*0.7,lab,10,700,GN)
    for i,k in enumerate(muestra): b+=ic(k,ax+66+i*42+(32-s)/2,yy,s)
b+=f'<rect x="{ax+aw-90}" y="{ty+10}" width="78" height="92" rx="6" fill="{BOSQUE}"/>'+ic('inicio',ax+aw-85,ty+22,24,col=LINO)+ic('mensaje',ax+aw-55,ty+22,24,col=LINO)+ic('inicio',ax+aw-81,ty+60,16,col=LINO)+ic('mensaje',ax+aw-51,ty+60,16,col=LINO)
b+=T(ax+aw-51,ty+94,'inversa',9.5,700,LINO,anchor='middle')
# ---- 03 aro ----
x,y,w,h=1128,150,432,820; b+=frame(3,x,y,w,h,'Aro de progreso','recurso clave de Ciclo','Desde las 12, horario · se pasa 3 % y regresa · durazno solo al completar.')
ax,ay,aw=x+14,y+44,w-28
b+=area(ax,ay,aw,190,LINO); b+=T(ax+12,ay+20,'Marketing · contorno 3 px y sombra dura',11,800)
for i,(fr,num,lab) in enumerate([(0,'','vacío'),(3/8,'3/8','parcial · 3 de 8'),(1,'8/8','completo')]):
    cx=ax+70+i*132; b+=A.aro(cx,ay+96,112,fr)+(A.numero(cx,ay+96,num,20) if num else '')+T(cx,ay+176,lab,10.5,700,anchor='middle')
uy=ay+204; b+=area(ax,uy,aw,150,LINO); b+=T(ax+12,uy+20,'Interfaz · plano, sin contorno ni sombra',11,800)
for i,(fr,num) in enumerate([(0,''),(3/8,'3/8'),(1,'8/8')]):
    cx=ax+40+i*70; b+=A.aro(cx,uy+62,56,fr,'ui')+(A.numero(cx,uy+62,num,13) if num else '')
    b+=A.aro(ax+250+i*34,uy+62,24,fr,'ui')
b+=T(ax+12,uy+108,'56 px con cifra · 24 px en listas',10,600,GN)
b+=f'<rect x="{ax+12}" y="{uy+116}" width="{aw-24}" height="26" rx="6" fill="{CLARO}" stroke="{NOCHE}" stroke-width="1.5"/>'
b+=T(ax+24,uy+133,'Ana R.',11.5,700)+A.aro(ax+aw-110,uy+129,18,3/8,'ui')+T(ax+aw-96,uy+133,'3 de 8 visitas',11,600,GN)
ry=uy+164; b+=area(ax,ry,aw,190,LINO); b+=T(ax+12,ry+20,'Relación con el isotipo',11,800)
k=0.34; b+=f'<g transform="translate({ax+28} {ry+68}) scale({k})" fill="{NOCHE}">{A.ISO}</g>'
b+=f'<g transform="translate({ax+28+282*k} {ry+36})">{A.aro(188*k,188*k,376*k,3/8,"ui",col=NOCHE)}</g>'
for i,t_ in enumerate(['Mismo trazo (52 u)','y remates redondos.','Diámetro = 2 × alto','del isotipo.','El aro es la única','forma circular.']):
    b+=T(ax+280,ry+62+i*16+(8 if i>=2 else 0)+(8 if i>=4 else 0),t_,10.5,700 if i%2==0 else 500,NOCHE if i%2==0 else GN)
my=ry+204; b+=area(ax,my,aw,170,LINO); b+=T(ax+12,my+20,'Movimiento · menos de 1 s, un rebote, sin confeti',11,800)
for i,(fr,col,t_) in enumerate([(0,None,'0 ms'),(0.62*3/8,None,'350'),(min(1,3/8*1.09),None,'520 · se pasa'),(3/8,None,'650 · asienta'),(1,DUR,'cierre')]):
    cx=ax+40+i*80; b+=A.aro(cx,my+70,58,fr,'ui',col=col)+T(cx,my+118,t_,9.5,700,anchor='middle')
b+=T(ax+12,my+142,'Archivos SMIL: lt-aro-animacion-avance.svg y -cierre.svg.',10,600,GN)
b+=T(ax+12,my+157,'Con «reducir movimiento»: se muestra el estado final.',10,600,GN)
# ---- 04 ilustración ----
x,y,w,h=40,574,700,396; b+=frame(4,x,y,w,h,'Estilo de ilustración','3 oficios del piloto','Plana · contorno noche 3 px · sombra dura 6 px opcional · solo tintas de la paleta · sin personas.')
ax,ay=x+14,y+44
for i,kk in enumerate(['barberia','estetica','tapioca']):
    s=212/400; xx=ax+i*(212+12)
    b+=f'<g transform="translate({f(xx)} {ay}) scale({f(s)})">{IL.escena(kk)}</g>'+T(xx,ay+184,IL.ESCENAS[kk][0].split(':')[0],12,800)+T(xx,ay+200,IL.ESCENAS[kk][0].split(': ')[1],10.5,500,GN)
b+=T(ax,ay+238,'Los objetos son los protagonistas; máximo tres por escena y con aire alrededor.',11,600)
b+=T(ax,ay+256,'Durazno solo como acento pequeño (seguro de tijera, esmalte, banda del vaso).',11,600)
b+=T(ax,ay+274,'Personas: después, en tintas de marca; la diversidad real la da la fotografía.',11,600)
b+=T(ax,ay+292,'Un objeto puede apoyarse en el aro, pero nunca se mete un ícono dentro de cada aro.',11,600)
# ---- 05 stickers ----
x,y,w,h=764,574,340,396; b+=frame(5,x,y,w,h,'Stickers','con significado · máx. 2 por pieza','Nunca sobre precios, cifras, errores ni textos legales.')
ax,ay,aw=x+14,y+44,w-28; b+=area(ax,ay,aw,200,LINO)
pos=[('recompensa-lista',24,20),('visita-5de8',40,82),('nuevo',200,84),('te-extranamos',30,140)]
for kk,dx,dy in pos:
    body,sw_,sh_,rot=STK.sticker(kk,'marketing'); sc=0.86
    b+=f'<g transform="translate({ax+dx} {ay+dy}) scale({sc}) rotate({rot} {f(sw_/2)} {f(sh_/2)})">{body}</g>'
b+=T(ax+aw-10,ay+192,'marketing · rotados 3–6° · sombra 3 px',9.5,600,GN,anchor='end')
py=ay+200; b+=area(ax,py,aw,82,CLARO)+f'<rect x="{ax}" y="{py}" width="{aw}" height="82" rx="8" fill="none" stroke="#E4DED2"/>'
xx=ax+10; yy=py+12
for kk in ['recompensa-lista','visita-5de8','nuevo','te-extranamos']:
    body,sw_,sh_,_=STK.sticker(kk,'producto')
    if xx+sw_>ax+aw-8: xx=ax+10; yy+=30
    b+=f'<g transform="translate({f(xx)} {yy})">{body}</g>'; xx+=sw_+8
b+=T(ax+aw-10,py+76,'producto · planos, sin sombra',9.5,600,GN,anchor='end')
for i,t_ in enumerate(['Durazno = recompensa lista (solo ese).','Las cifras van en Manrope tabular.']):
    b+=T(ax,py+100+i*16,t_,10.5,600)
badge='Recursos gráficos · aprobado 2026-10-06'
svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000">
<title>LealTab · Recursos gráficos · Aprobado 2026-10-06</title>
<desc>Primera lámina de recursos gráficos (Fase 3): iconografía, aro de progreso, estilo de ilustración y stickers. Archivos fuente en recursos/. El isotipo usa los d congelados del master sin cambios.</desc>
{FONTS}
<rect width="1600" height="1000" fill="{LINO}"/>
{T(40,50,'LEALTAB · FASE 3 · RECURSOS GRÁFICOS · RUTA CICLO V2 (2026-10-06)',12,800,extra='letter-spacing="1.6"')}
{T(40,118,'Recursos gráficos',58,800,fam='Archivo')}
<rect x="{1560-600+5}" y="{68+5}" width="600" height="50" rx="10" fill="{NOCHE}"/><rect x="{1560-600}" y="68" width="600" height="50" rx="10" fill="{DUR}" stroke="{NOCHE}" stroke-width="2.5"/>
{T(1560-300,101,badge,19,800,fam='Archivo',anchor='middle',extra='letter-spacing="0.5"')}
{b}
{T(40,990,'Todo es SVG en recursos/ (iconos, aro, ilustraciones, stickers); este PNG es solo para ver la lámina. Verificación: verificacion-recursos.json.',11.5,500,GN)}
</svg>
'''
p=write('recursos-graficos.svg',svg); render_one(p,1600,1000,R+'recursos-graficos.png'); print('ok')
