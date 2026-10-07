from bb import *
import sys; sys.path.insert(0,'../recursos')
import iconos as IC
TOTAL=24
COMB_BOTTOM=[]
def p15():
    o=''
    P=[('Lino','#F3EFE6','243, 239, 230','Fondo principal','~60 %',NOCHE),('Bosque','#0F4D3A','15, 77, 58','Protagonista: bloques, botones de producto y fondo para el logo en lino','~20 %',LINO),
       ('Menta gris','#CFE3D6','207, 227, 214','Apoyo: estados, gráficas y fondos secundarios','~10 %',NOCHE),('Durazno','#FF9F6E','255, 159, 110','Acento pequeño: recompensa completada y acción principal en marketing. Nunca fondo de marca.','~7 %',NOCHE),
       ('Noche','#0F2A22','15, 42, 34','Texto, contornos y sombras duras (nunca negro puro)','~3 % + texto',LINO),
       ('Blanco lino','#FFFDF8','255, 253, 248','Neutro: tarjetas, tablas y campos sobre lino','según uso',NOCHE),('Gris noche','#4D635A','77, 99, 90','Neutro: texto secundario y etiquetas','solo texto',LINO)]
    cw=(W-2*MX-6*18)/7
    for i,(n,hx,rgb,rol,pr,ink) in enumerate(P):
        x=MX+i*(cw+18); o+=box(x,236,cw,470,sh=5)
        o+=f'<rect x="{f(x+12)}" y="248" width="{f(cw-24)}" height="190" rx="10" fill="{hx}" stroke="{NOCHE}" stroke-width="1.5"/>'+T(x+26,420,pr,17,800,ink)
        o+=T(x+16,478,n,25,800,fam='Archivo'); fit(n,25,800,cw-32,'Archivo',where='p15')
        o+=T(x+16,508,hx,18,800)+T(x+16,534,'RGB '+rgb,15,600,GN); fit('RGB '+rgb,15,600,cw-32,where='p15')
        t,_=para(x+16,572,cw-32,rol,16,500,NOCHE,1.4,where='p15'); o+=t
    o+=box(MX,736,1000,260)+T(MX+28,788,'Contraste medido (WCAG 2.1)',28,800,fam='Archivo')
    rows=[('Noche sobre lino','13.31:1 · AAA'),('Lino sobre bosque','8.54:1 · AAA'),('Noche sobre menta gris','11.36:1 · AAA'),('Gris noche sobre lino','5.63:1 · AA'),('Durazno sobre lino','1.75:1 · nunca como texto')]
    y=830
    for i,(a,b) in enumerate(rows):
        cx=MX+28+(i%2)*480; cy=y+(i//2)*44
        o+=T(cx,cy,a,18,700)+T(cx+260,cy,b,18,500,OR if 'nunca' in b else NOCHE)
    x=MX+1028; ww=W-MX-x
    o+=box(x,736,ww,260)+T(x+28,788,'Combinaciones',28,800,fam='Archivo'); y=832
    for r in ['**Producto:** texto noche sobre lino o blanco lino; botón bosque con texto lino, o durazno con texto noche, siempre con contorno noche.','**Durazno:** solo acento pequeño (aro completo, sticker “¡Recompensa lista!”). Nunca es fondo de marca; el logo y los titulares no van sobre durazno.','**No se usan:** texto durazno o menta sobre lino, ni texto noche sobre bosque.','El estado nunca se dice solo con color: siempre lleva una palabra.']:
        t,hh=para(x+28,y,ww-56,r,16,500,NOCHE,1.35,where='p15 comb'); o+=t; y+=hh+7
    COMB_BOTTOM.append(y)
    return page(15,TOTAL,'Sistema visual','Paleta',o,lead='Cinco tintas de Ciclo v2 y dos neutros de trabajo. Aprobada por Aarón López Sosa el 6 de octubre de 2026.')
def p16():
    o=box(MX,236,880,400)+T(MX+28,286,'Archivo',30,800,fam='Archivo')+T(MX+880-28,286,'ancho 75 · peso 800 · SIL OFL',16,700,OR,anchor='end')
    o+=f'<text x="{MX+28}" y="420" font-family="Archivo" font-weight="800" font-size="120" style="font-stretch:75%" fill="{NOCHE}">Aa Bb Cc Ññ</text>'
    o+=T(MX+28,486,'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ ¿¡ 0123456789',28,800,fam='Archivo'); fit('ABCDEFGHIJKLMNÑOPQRSTUVWXYZ ¿¡ 0123456789',28,800,824,'Archivo',where='p16')
    t,_=para(MX+28,540,824,'**Para titulares de 24 px o más y para stickers.** Nunca en párrafos, botones de producto, tablas ni cifras.',18,500,NOCHE,1.45,where='p16'); o+=t
    x=MX+908; ww=W-MX-x
    o+=box(x,236,ww,400)+T(x+28,286,'Manrope',30,800,fam='Archivo')+T(x+ww-28,286,'pesos 400 a 700 · SIL OFL',16,700,OR,anchor='end')
    o+=f'<text x="{x+28}" y="420" font-family="Manrope" font-weight="700" font-size="120" fill="{NOCHE}">Aa Bb Cc Ññ</text>'
    o+=T(x+28,486,'Interfaz, texto y cifras: 1 234 567 · 68 % · 3/8',28,600); fit('Interfaz, texto y cifras: 1 234 567 · 68 % · 3/8',28,600,ww-56,where='p16')
    t,_=para(x+28,540,ww-56,'**Para todo lo demás:** interfaz, texto, etiquetas y datos. Toda cifra va con números tabulares.',18,500,NOCHE,1.45,where='p16'); o+=t
    o+=box(MX,664,1180,332)+T(MX+28,714,'Escala base',28,800,fam='Archivo')
    rows=[('Display','Archivo 800','96 / 0.9','Portada de landing, mostrador'),('H1 · H2 · H3','Archivo 800','64 · 44 · 32','Encabezados y secciones'),('H4','Archivo 800','24 / 1.05','Tamaño mínimo de Archivo en titulares'),
          ('Texto','Manrope 400','16 / 1.55','Párrafos (base web)'),('Interfaz','Manrope 500','14 / 1.45','Base del panel y tablas'),('Etiqueta','Manrope 700, mayúsculas','11 / 1.3','Encabezados de tabla'),('Sticker','Archivo 800, mayúsculas','11–15','La única excepción a los 24 px')]
    t,_=table(MX+20,730,[180,330,190,440],['Nivel','Fuente','Tamaño / interlineado','Uso'],rows,15,6,12,where='p16 escala'); o+=t
    x=MX+1208; ww=W-MX-x
    o+=box(x,664,ww,332)+T(x+28,714,'Reglas',28,800,fam='Archivo'); y=758
    for r in ['Titulares cortos (hasta unas 8 palabras) y en tono de tú.','Mayúsculas solo en displays de hasta 4 palabras, carteles y stickers.','Respaldos: Arial Narrow para Archivo y system-ui para Manrope.','Ambas son SIL OFL: se pueden usar gratis en web, app, impresos y logo.']:
        o+=f'<circle cx="{x+34}" cy="{y-6}" r="4" fill="{NOCHE}"/>'; t,hh=para(x+50,y,ww-78,r,17,500,NOCHE,1.4,where='p16 reglas'); o+=t; y+=hh+10
    return page(16,TOTAL,'Sistema visual','Tipografía',o,lead='Archivo condensada para titulares con peso y Manrope para leer. Aprobadas por Aarón López Sosa el 6 de octubre de 2026.')
def p17():
    o=box(MX,236,1180,760)+T(MX+28,288,'18 íconos · línea y activo',28,800,fam='Archivo')+T(MX+1180-28,288,'rejilla 24 · trazo 2',16,700,OR,anchor='end')
    o+=area(MX+24,310,1132,662,LINO); cw=1132/6; ch=662/3
    for i,k in enumerate(IC.ORDEN):
        cx=MX+24+(i%6)*cw; cy=310+(i//6)*ch
        t,_,_=nest(RC+f'iconos/linea/lt-icono-{k}.svg',cx+cw/2-62,cy+50,48,48); o+=t
        t,_,_=nest(RC+f'iconos/activo/lt-icono-{k}-activo.svg',cx+cw/2+14,cy+50,48,48); o+=t
        o+=T(cx+cw/2,cy+140,IC.I[k][0],17,700,anchor='middle'); fit(IC.I[k][0],17,700,cw-16,where='p17')
    o+=T(MX+1156-12,960,'izquierda: línea · derecha: activo',14,600,GN,anchor='end')
    x=MX+1208; ww=W-MX-x
    o+=box(x,236,ww,440)+T(x+28,288,'Cómo se dibujan',28,800,fam='Archivo'); y=334
    for r in ['Trazo de 2 px en noche (2.5 px en marketing), remates redondos y un solo grosor.','**Esquinas como el isotipo:** exterior 2.25 e interior 0.25, la misma proporción que 58 y 6 sobre 52.','Formas abiertas en L donde tiene sentido (estadísticas, QR, compartir).','**Activo:** relleno plano menta gris. En producto nunca llevan sombra.']:
        o+=f'<circle cx="{x+34}" cy="{y-6}" r="4" fill="{NOCHE}"/>'; t,hh=para(x+50,y,ww-78,r,17,500,NOCHE,1.42,where='p17'); o+=t; y+=hh+12
    o+=box(x,700,ww,296)+T(x+28,752,'Tamaños',28,800,fam='Archivo')
    for j,s in enumerate((16,24,32)):
        yy=780+[0,30,66][j]; o+=T(x+28,yy+s*0.75,f'{s}',14,800,GN)
        for i,k in enumerate(['inicio','cliente','visita','escanear','mensaje']):
            t,_,_=nest(RC+f'iconos/linea/lt-icono-{k}.svg',x+70+i*48+(32-s)/2,yy,s,s); o+=t
    t,_=para(x+28,916,ww-56,'Se ven bien a 24 y 32 px. A 16 px usa los más simples. **WhatsApp:** se usa su ícono oficial tal cual.',15,500,NOCHE,1.42,where='p17 tam'); o+=t
    return page(17,TOTAL,'Sistema visual','Iconografía',o,lead='Íconos de línea propios, emparentados con las L del logo sin copiarlo.')
import aro as A, ilustraciones as IL, stickers as STK
def bullets(x,y,w,items,size=18,where='',gap=12):
    o=''
    for r in items:
        o+=f'<circle cx="{f(x+6)}" cy="{f(y-size*0.35)}" r="4" fill="{NOCHE}"/>'; t,hh=para(x+22,y,w-22,r,size,500,NOCHE,1.42,where=where); o+=t; y+=hh+gap
    return o,y
def p18():
    o=box(MX,236,900,420)+T(MX+28,288,'Marketing',28,800,fam='Archivo')+T(MX+900-28,288,'contorno 3 px · sombra dura',16,700,OR,anchor='end')
    o+=area(MX+24,308,852,324,LINO)
    for i,(fr,num,lab) in enumerate([(0,'','vacío'),(3/8,'3/8','parcial · 3 de 8'),(1,'8/8','completo')]):
        cx=MX+24+142+i*284; o+=A.aro(cx,450,220,fr)+(A.numero(cx,450,num,34) if num else '')+T(cx,604,lab,18,700,anchor='middle')
    x=MX+928; ww=W-MX-x
    o+=box(x,236,ww,420)+T(x+28,288,'Interfaz',28,800,fam='Archivo')+T(x+ww-28,288,'plano · sin contorno ni sombra',16,700,OR,anchor='end')
    o+=area(x+24,308,ww-48,324,LINO)
    for i,(fr,num) in enumerate([(0,''),(3/8,'3/8'),(1,'8/8')]):
        cx=x+90+i*110; o+=A.aro(cx,380,72,fr,'ui')+(A.numero(cx,380,num,17) if num else '')
        o+=A.aro(x+460+i*50,380,28,fr,'ui')
    o+=T(x+48,452,'56–72 px con cifra · 24–28 px en listas',16,600,GN)
    o+=f'<rect x="{x+48}" y="478" width="{ww-96}" height="56" rx="10" fill="{CLARO}" stroke="{NOCHE}" stroke-width="1.5"/>'+T(x+72,513,'Ana R.',19,700)+A.aro(x+ww-260,506,26,3/8,'ui')+T(x+ww-236,513,'3 de 8 visitas',18,600,GN)
    t,_=para(x+48,578,ww-96,'En producto, el aro solo es una gráfica de avance o retención.',16,500,NOCHE,1.4,where='p18'); o+=t
    o+=box(MX,684,560,312)+T(MX+28,736,'Relación con el isotipo',28,800,fam='Archivo')
    t,_,_=nest(RC+'aro/lt-aro-relacion-isotipo.svg',MX+28,760,h=150); o+=t
    t,_=para(MX+28,950,504,'Mismo trazo (52 u) y remates redondos. Diámetro = 2 × alto del isotipo.',16,500,NOCHE,1.4,where='p18'); o+=t
    x=MX+588; ww=W-MX-x
    o+=box(x,684,ww,312)+T(x+28,736,'Movimiento',28,800,fam='Archivo')+T(x+ww-28,736,'menos de 1 s · un rebote · sin confeti',16,700,OR,anchor='end')
    for i,(fr,col,t_) in enumerate([(0,None,'0 ms'),(0.62*3/8,None,'350 ms'),(min(1,3/8*1.09),None,'520 ms · se pasa'),(3/8,None,'650 ms · asienta'),(1,DUR,'cierre · durazno')]):
        cx=x+90+i*150; o+=A.aro(cx,822,84,fr,'ui',col=col)+T(cx,890,t_,15,700,anchor='middle')
    o2,_=bullets(x+800,780,ww-830,['Se dibuja desde las 12, en sentido horario.','Se pasa 3–4 % y regresa con un solo rebote.','Al completar: pulso de 4 % y cambio a durazno.','Con “reducir movimiento”: solo el estado final.'],15,'p18 mov',8); o+=o2
    t,_=para(x+28,960,780,'Un solo aro grande por pieza. Nunca en hileras de aros iguales: eso parece tarjeta de sellos.',16,600,NOCHE,1.4,where='p18'); o+=t
    return page(18,TOTAL,'Sistema visual','Aro de progreso y movimiento',o,lead='El recurso propio de Ciclo: un aro que avanza con cada visita y se vuelve durazno al completar la recompensa.',title_size=70)
def p19():
    o=''; cw=(W-2*MX-2*28)/3
    for i,k in enumerate(['barberia','estetica','tapioca']):
        x=MX+i*(cw+28); o+=box(x,236,cw,560)
        t,_,_=nest(RC+f'ilustraciones/lt-ilustracion-{k}.svg',x+20,256,cw-40); o+=t
        tit,obj=IL.ESCENAS[k][0].split(': ')
        o+=T(x+24,256+(cw-40)*0.8+46,tit,30,800,fam='Archivo')+T(x+24,256+(cw-40)*0.8+78,obj[0].upper()+obj[1:],18,600,GN)
    o+=box(MX,822,W-2*MX,174)+T(MX+28,866,'Reglas de ilustración',26,800,fam='Archivo')
    half=(W-2*MX-56-40)/2
    o1,_=bullets(MX+28,906,half,['Plana: contorno noche de 3 px y sombra dura de 6 px opcional en marketing.','Solo las tintas de la paleta; nada de degradados, 3D, mascotas ni estilo infantil.','Los objetos del oficio son los protagonistas, con aire alrededor.'],16,'p19',6)
    o2,_=bullets(MX+28+half+40,906,half,['Durazno solo como acento pequeño.','Personas: siluetas simples en tintas de marca, no en tonos de piel.','Un objeto puede apoyarse en el aro, pero no se mete un ícono en cada aro.'],16,'p19',6)
    return page(19,TOTAL,'Sistema visual','Ilustración',o+o1+o2,lead='Herramientas de los oficios del piloto: barbería, estética y tapioca.')
def p20():
    o=box(MX,236,1100,460)+T(MX+28,288,'Marketing',28,800,fam='Archivo')+T(MX+1100-28,288,'rotados 3–6° · sombra dura 3 px',16,700,OR,anchor='end')
    o+=area(MX+24,308,1052,364,LINO)
    pos=[('recompensa-lista',60,40),('visita-5de8',560,50),('nuevo',90,190),('te-extranamos',430,200)]
    for k,dx,dy in pos:
        body,sw_,sh_,rot=STK.sticker(k,'marketing'); sc=1.6
        o+=f'<g transform="translate({MX+24+dx} {308+dy}) scale({sc}) rotate({rot} {f(sw_/2)} {f(sh_/2)})">{body}</g>'
    o+=box(MX,724,1100,272)+T(MX+28,776,'Producto',28,800,fam='Archivo')+T(MX+1100-28,776,'planos · sin rotar · sin sombra',16,700,OR,anchor='end')
    o+=area(MX+24,796,1052,176,CLARO,stroke=RULE); xx=MX+56
    for k in ['recompensa-lista','visita-5de8','nuevo','te-extranamos']:
        body,sw_,sh_,_=STK.sticker(k,'producto'); sc=1.5
        o+=f'<g transform="translate({f(xx)} 860) scale({sc})">{body}</g>'; xx+=sw_*sc+36
    x=MX+1128; ww=W-MX-x
    o+=box(x,236,ww,760)+T(x+28,288,'Qué significa cada uno',28,800,fam='Archivo')
    rows=[('¡Recompensa lista!','El cliente completó su aro. Único sticker en durazno.'),('Visita 5/8','Avance del cliente; la cifra va en Manrope.'),('Nuevo','Cliente o función recién agregada.'),('Te extrañamos','Cliente que dejó de venir; lo invita a regresar.')]
    t,hh=table(x+20,308,[200,ww-40-200],['Sticker','Significado'],rows,16,10,12,where='p20'); o+=t
    o2,_=bullets(x+28,308+hh+50,ww-56,['Solo cuando significan algo; máximo dos por pieza.','Nunca sobre precios, cifras, errores ni textos legales.','Archivo 800 en mayúsculas; las cifras, en Manrope.','Siempre cerca del elemento al que califican.'],17,'p20 reglas',10); o+=o2
    return page(20,TOTAL,'Sistema visual','Stickers',o,lead='Etiquetas con significado, en estilo neobrutal contenido. El sticker nunca compite con el titular.')
def p21():
    o=''; cw=(W-2*MX-3*24)/4
    F=[('Barbería','Manos con tijera y peine, la silla y el espejo, el barbero mirando a cámara con los brazos cruzados.'),
       ('Estética','Manos de la estilista, el tocador con sus productos, la dueña sonriendo a media jornada.'),
       ('Tapioca','El vaso a contraluz con perlas y colores, el mostrador con clientes jóvenes, un celular escaneando el QR.'),
       ('Recorte sobre color','La persona u objeto recortado con borde lino de 6 a 8 px, sobre bosque o menta. Un recorte por pieza.')]
    for i,(n,tx) in enumerate(F):
        x=MX+i*(cw+24); o+=box(x,236,cw,500)
        bgc=MENTA if i==3 else '#E4DED2'
        o+=f'<rect x="{f(x+18)}" y="254" width="{f(cw-36)}" height="250" rx="10" fill="{bgc}"/>'
        o+=''.join(f'<line x1="{f(x+18+(cw-36)*k/3)}" y1="254" x2="{f(x+18+(cw-36)*k/3)}" y2="504" stroke="{CLARO}" stroke-width="1.5" stroke-dasharray="6 6"/><line x1="{f(x+18)}" y1="{f(254+250*k/3)}" x2="{f(x+cw-18)}" y2="{f(254+250*k/3)}" stroke="{CLARO}" stroke-width="1.5" stroke-dasharray="6 6"/>' for k in (1,2))
        b,bw_=badge(x+cw/2-60,366,'foto propia',14,CLARO); o+=b
        o+=T(x+24,550,n,28,800,fam='Archivo')
        t,_=para(x+24,590,cw-48,tx,17,500,NOCHE,1.45,where='p21'); o+=t
    o+=box(MX,764,W-2*MX,232)
    cols=[('Objetivo','Negocios y personas reales de Villahermosa, con dignidad y orgullo de oficio. Toda la foto es propia; nada de stock.'),
          ('Luz y encuadre','Luz natural cálida de ventana o puerta, sin flash. Cercano y honesto: una sola idea por foto y espacio para el titular.'),
          ('Color','Tonos naturales con un ligero calor; los negros se llevan hacia noche. Sin filtros de moda ni HDR.'),
          ('Evitar','Stock, sonrisas forzadas, poses con el celular hacia cámara, tarjetas de plástico, monedas y oficinas corporativas.')]
    for i,(n,tx) in enumerate(cols):
        x=MX+28+i*(cw+24-7); o+=T(x,814,n,22,800,fam='Archivo')
        t,_=para(x,852,cw-50,tx,16,500,NOCHE,1.45,where='p21b'); o+=t
    return page(21,TOTAL,'Sistema visual','Fotografía',o,lead='La diversidad real la aporta la fotografía. Siempre el gesto de regresar: saludar, reconocerse, volver a sentarse.')
