from bb import *
import sys; sys.path.insert(0,'../recursos')
import aro as A
TOTAL=24
E=L+'entregables/'
def p22():
    o=''
    # a) tarjeta de presentación 90 × 50 mm (escala 5.2 px/mm)
    o+=box(MX,236,600,760)+T(MX+28,288,'Tarjeta de presentación',28,800,fam='Archivo')+T(MX+600-28,288,'90 × 50 mm',16,700,OR,anchor='end')
    cw,ch=468,260; cx=MX+66
    o+=f'<rect x="{cx+6}" y="{326+6}" width="{cw}" height="{ch}" rx="10" fill="{NOCHE}"/><rect x="{cx}" y="326" width="{cw}" height="{ch}" rx="10" fill="{NOCHE}" stroke="{NOCHE}" stroke-width="2"/>'
    o+=logo_c('h',cx+cw/2,326+ch/2,w=250,col=LINO)
    y2=326+ch+40
    o+=f'<rect x="{cx+6}" y="{y2+6}" width="{cw}" height="{ch}" rx="10" fill="{NOCHE}"/><rect x="{cx}" y="{y2}" width="{cw}" height="{ch}" rx="10" fill="{CLARO}" stroke="{NOCHE}" stroke-width="2"/>'
    o+=logo('i',cx+cw-36-44,y2+30,w=44)[0]
    o+=T(cx+36,y2+120,'Nombre Apellido',26,800)+T(cx+36,y2+150,'Puesto',18,500,GN)
    o+=T(cx+36,y2+210,'nombre@lealtab.com',17,600)+T(cx+36,y2+236,'lealtab.com · @getlealtab',17,600,GN)
    t,_=para(MX+28,952,544,'Frente: logo lino sobre noche. Reverso: datos en Manrope.',15,500,GN,1.4,where='p22'); o+=t
    # b) perfil de redes
    x=MX+628; ww=560
    o+=box(x,236,ww,760)+T(x+28,288,'Perfil de redes',28,800,fam='Archivo')+T(x+ww-28,288,'@getlealtab',16,700,OR,anchor='end')
    o+=area(x+24,312,ww-48,660,CLARO,stroke=RULE)
    av,_,_=nest(E+'redes/lealtab-avatar-noche-cuadrado.svg',x+52,340,120,120)
    o+=f'<clipPath id="avc"><circle cx="{x+112}" cy="400" r="60"/></clipPath><g clip-path="url(#avc)">{av}</g>'
    o+=T(x+196,388,'LealTab',26,800)+T(x+196,418,'@getlealtab',18,600,GN)
    t,_=para(x+52,500,ww-104,'Haz que tus clientes siempre regresen.',20,600,NOCHE,1.4,where='p22'); o+=t
    o+=T(x+52,534,'lealtab.com',18,700,BOSQUE)
    # publicación 4:5
    px,py,pw=x+52,566,ww-104; ph=pw*1.25*0.62
    o+=f'<clipPath id="post"><rect x="{px}" y="{py}" width="{pw}" height="{f(ph)}" rx="8"/></clipPath><g clip-path="url(#post)"><rect x="{px}" y="{py}" width="{pw}" height="{f(ph)}" fill="{BOSQUE}"/>'
    o+=A.aro(px+pw-40,py+ph-20,300,3/8,'marketing',track=MENTA,outline=3,shadow=6)+'</g>'
    t,_=para(px+28,py+64,pw*0.62,'Tu tarjeta digital siempre a un toque.',34,800,LINO,1.15,where='p22 post'); o+=t
    o+=T(px+28,py+ph-28,'lealtab.com',15,700,MENTA)
    t,_=para(x+52,py+ph+44,ww-104,'Publicación con el lema o la frase de producto; un aro por pieza.',15,500,GN,1.4,where='p22'); o+=t
    # c) pantalla del cliente
    x=MX+1216; ww=W-MX-x
    o+=box(x,236,ww,760)+T(x+28,288,'Tarjeta del cliente',28,800,fam='Archivo')+T(x+ww-28,288,'app web (PWA)',16,700,OR,anchor='end')
    fw,fh=320,620; fx=x+(ww-fw)/2; fy=318
    o+=f'<rect x="{fx}" y="{fy}" width="{fw}" height="{fh}" rx="40" fill="{NOCHE}"/><rect x="{fx+10}" y="{fy+10}" width="{fw-20}" height="{fh-20}" rx="32" fill="{LINO}"/>'
    o+=f'<circle cx="{fx+58}" cy="{fy+66}" r="24" fill="{MENTA}" stroke="{NOCHE}" stroke-width="1.5"/>'+T(fx+58,fy+70,'logo',11,700,NOCHE,anchor='middle')
    o+=T(fx+92,fy+62,'Tu negocio',18,800)+T(fx+92,fy+82,'Tarjeta de visitas',13,600,GN)
    o+=f'<rect x="{fx+26}" y="{fy+112}" width="{fw-52}" height="300" rx="14" fill="{CLARO}" stroke="{NOCHE}" stroke-width="2"/>'
    o+=A.aro(fx+fw/2,fy+250,190,3/8,'ui')+A.numero(fx+fw/2,fy+246,'3/8',34)+T(fx+fw/2,fy+384,'3 de 8 visitas',17,700,anchor='middle')
    o+=f'<rect x="{fx+34+4}" y="{fy+440+4}" width="{fw-68}" height="52" rx="10" fill="{NOCHE}"/><rect x="{fx+34}" y="{fy+440}" width="{fw-68}" height="52" rx="10" fill="{BOSQUE}" stroke="{NOCHE}" stroke-width="2"/>'+T(fx+fw/2,fy+472,'Mostrar mi QR',17,700,LINO,anchor='middle')
    o+=T(fx+fw/2,fy+fh-36,'Hecho con LealTab',12,600,GN,anchor='middle')
    t,_=para(x+28,964,ww-56,'Manda la marca del negocio; LealTab, discreto.',15,500,GN,1.4,where='p22'); o+=t
    return page(22,TOTAL,'Aplicación','Ejemplos de aplicación',o,lead='Ejemplos sobrios para ver el sistema junto. Los datos son de muestra.')
def p23():
    o=box(MX,236,1180,760)+T(MX+28,288,'Qué archivo uso',28,800,fam='Archivo')+T(MX+1180-28,288,'todo en logo/entregables/',16,700,OR,anchor='end')
    rows=[('El logo en una web, Figma o Illustrator','svg/lealtab-horizontal-noche.svg (o la versión y el color que necesites)'),
          ('Ponerlo en Canva, Word, PowerPoint o Google Docs sin pensar en márgenes','svg/*-con-area.svg, o png/<versión>/*-con-area-1024.png si el programa no acepta SVG'),
          ('Logo claro sobre fondo oscuro','-lino (transparente) o -lino-fondo-noche (ya trae el fondo)'),
          ('Imprimir a una tinta','impresion/lealtab-*-negro.pdf o .svg'),
          ('Mandarlo a la imprenta','impresion/ (SVG y PDF vectorial, noche y negro). No está en CMYK.'),
          ('Favicon e íconos del sitio o la app','Todo web/: copia los archivos a la raíz del sitio y pega snippet.html en el <head>'),
          ('Foto de perfil (Instagram, Facebook, WhatsApp Business, Google Maps)','redes/lealtab-avatar-*-cuadrado-1080.png: la plataforma lo recorta en círculo'),
          ('Portada de Facebook','redes/lealtab-portada-facebook-1640x624.png')]
    t,_=table(MX+20,308,[470,1180-40-470],['Necesito…','Usa'],rows,17,11,12,where='p23',bolds=(0,)); o+=t
    x=MX+1208; ww=W-MX-x
    o+=box(x,236,ww,420,BOSQUE)+T(x+28,288,'LA REGLA MÁS IMPORTANTE',15,800,MENTA,ls=1.4)
    t,hh=para(x+28,340,ww-56,'El SVG es la fuente.',36,800,LINO,1.15,where='p23'); o+=t
    t,_=para(x+28,340+hh+20,ww-56,'Los PNG, PDF e ICO se generan solos desde los SVG aprobados y nunca se editan a mano. Si algo cambia, se cambia el SVG y se vuelve a exportar.',18,500,LINO,1.45,where='p23'); o+=t
    o+=box(x,684,ww,312)+T(x+28,736,'Carpetas',28,800,fam='Archivo'); y=780
    for a,b in [('svg/','40 · ajustado y con área'),('png/','50 · 512 a 2048 px'),('web/','8 · favicon, PWA, manifest'),('redes/','12 · avatares y portada'),('impresion/','16 · SVG y PDF vectorial'),('recursos/','íconos, aro, ilustración, stickers')]:
        o+=T(x+28,y,a,18,800)+T(x+170,y,b,17,500,GN); fit(b,17,500,ww-200,where='p23'); y+=34
    return page(23,TOTAL,'Aplicación','Qué archivo usar',o,lead='Resumen de logo/entregables/README.md. El paquete trae manifiesto con sha256 y verificación.')
def p24():
    o=''
    items=[('CMYK con la imprenta','Las exportaciones de impresión están en RGB. La conversión a CMYK y una prueba de color quedan pendientes de validar con la imprenta antes del primer tiraje.'),
           ('Búsqueda de marca','Antes de registrar: búsqueda formal en el IMPI (clases 9, 35 y 42) y en la base de la WIPO. El símbolo tiene un parecido de estructura con el de MIT Lincoln Laboratory (dos L que forman un cuadro abierto).'),
           ('“Hecho con LealTab” en el plan Pro','Decisión menor pendiente de la Fase 1: si el plan Pro puede quitar la leyenda de la tarjeta del cliente.'),
           ('Colores de función','Los colores de éxito, riesgo y error son provisionales; se cierran en la Fase 4.'),
           ('Fotografía propia','Las fotos se producen con los negocios del piloto en Villahermosa. Las de este libro son marcos de muestra.')]
    y=236; bw=(W-2*MX-28)/2
    for i,(tt,tx) in enumerate(items):
        x=MX+(i%2)*(bw+28); yy=y+(i//2)*250
        hb=226 if i<4 else 226
        o+=box(x,yy,bw,hb)+T(x+28,yy+50,f'{i+1:02d}',22,800,OR)+T(x+76,yy+50,tt,28,800,fam='Archivo'); fit(tt,28,800,bw-104,'Archivo',where='p24')
        t,_=para(x+28,yy+96,bw-56,tx,19,500,NOCHE,1.45,where='p24'); o+=t
    x=MX+bw+28; yy=236+500
    o+=box(x,yy,bw,226,MENTA)+T(x+28,yy+50,'Con este libro',28,800,fam='Archivo')
    t,_=para(x+28,yy+96,bw-56,'Aarón López Sosa aprobó este libro el 6 de octubre de 2026 y con él se cerró la Fase 3 (identidad visual).',19,500,NOCHE,1.45,where='p24'); o+=t
    return page(24,TOTAL,'Aplicación','Pendientes',o,lead='Lo que falta antes de imprimir y de registrar la marca.')
