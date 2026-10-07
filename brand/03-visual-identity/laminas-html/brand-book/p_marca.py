from bb import *
TOTAL=24
INDICE=[('Marca',[(3,'Qué es LealTab'),(4,'Personalidad'),(5,'Voz y tono')]),
 ('Logo',[(6,'Concepto del isotipo'),(7,'Versiones del logo'),(8,'Colores del logo'),(9,'Área de protección'),(10,'Tamaños mínimos'),(11,'Usos correctos'),(12,'Usos incorrectos · horizontal'),(13,'Usos incorrectos · vertical'),(14,'Íconos digitales y favicon')]),
 ('Sistema visual',[(15,'Paleta'),(16,'Tipografía'),(17,'Iconografía'),(18,'Aro de progreso y movimiento'),(19,'Ilustración'),(20,'Stickers'),(21,'Fotografía')]),
 ('Aplicación',[(22,'Ejemplos de aplicación'),(23,'Qué archivo usar'),(24,'Pendientes')])]
def p1():
    o=''
    # un aro grande que sale del encuadre por la derecha (lado contrario al titular)
    import aro as A
    o+=f'<g>{A.aro(1640,520,900,5/8,"marketing",outline=4,shadow=10)}</g>'
    g,lw,lh=logo('h',MX,350,w=820); o+=g
    t,_=para(MX,660,900,'Haz que tus clientes siempre regresen.',44,800,NOCHE,1.2,where='p1'); o+=t
    o+=T(MX,840,'BRAND BOOK',34,800,fam='Archivo',ls=1)+T(MX,880,'Fase 3 · Identidad visual · octubre de 2026',20,600,GN)
    b,_=badge(MX,920,ETQ,18); o+=b
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}"><title>LealTab · Brand book · 01 · Portada · {ETQ}</title>{FONTS}{DEFS}<rect width="{W}" height="{H}" fill="{LINO}"/>'+T(MX,82,'LEALTAB · BRAND BOOK · 01 · PORTADA',15,800,ls=2.2)+o+f'<line x1="{MX}" y1="1026" x2="1180" y2="1026" stroke="{RULE}" stroke-width="1.5"/>'+T(MX,1056,f'LealTab · Brand book · {ETQ}',14,600,GN)+'</svg>\n'
    return svg
def p2():
    o=''; xs=[MX,MX+600,MX+1200]; cols=[[INDICE[0],INDICE[1]],[INDICE[2]],[INDICE[3]]]
    for x,secs in zip(xs,cols):
        y=250
        for name,items in secs:
            o+=T(x,y,name.upper(),16,800,OR,ls=1.6); y+=18
            o+=f'<line x1="{x}" y1="{y}" x2="{x+540}" y2="{y}" stroke="{NOCHE}" stroke-width="1.5"/>'; y+=40
            for n,t in items:
                o+=T(x,y,f'{n:02d}',22,800,GN)+T(x+56,y,t,22,600); fit(t,22,600,480,where='p2'); y+=42
            y+=34
    o+=box(MX+1200,700,528,250)
    t,_=para(MX+1228,750,470,'**Cómo leer este libro.** Reúne lo aprobado de las fases 1, 2 y 3. Los archivos fuente están en logo/entregables/ (logo) y recursos/ (recursos gráficos). Si una pieza no está aquí, todavía no está definida.',19,500,NOCHE,1.5,where='p2 nota'); o+=t
    return page(2,TOTAL,'Índice','Índice',o)
def p3():
    o=''
    o+=box(MX,236,1100,330)+T(MX+32,284,'QUÉ ES',16,800,OR,ls=1.6)
    t,_=para(MX+32,334,1030,'LealTab es la plataforma de lealtad para negocios de visita recurrente en México. Empieza con una **tarjeta digital** que el cliente instala en su pantalla de inicio con un toque, sin tienda de apps.',30,500,NOCHE,1.35,where='p3'); o+=t
    t,_=para(MX+32,500,1030,'**La idea visual se llama Ciclo:** cada regreso cierra un círculo y abre el siguiente.',21,500,GN,1.4,where='p3'); o+=t
    o+=box(1220,236,604,330,BOSQUE)+T(1252,284,'LEMA DE MARCA',16,800,MENTA,ls=1.6)
    t,_=para(1252,338,540,'Haz que tus clientes siempre regresen.',42,800,LINO,1.15,where='p3 lema'); o+=t
    o+=T(1252,482,'LÍNEA DE PRODUCTO',14,800,MENTA,ls=1.4)+T(1252,516,'Tu tarjeta digital siempre a un toque.',22,600,LINO); fit('Tu tarjeta digital siempre a un toque.',22,600,540,where='p3')
    cw=(W-2*MX-3*24)/4
    items=[('Misión','“Ayudar a los negocios a que sus clientes regresen, con tecnología de lealtad fácil de usar, confiable y de primer nivel.”'),
           ('Visión','“Que cualquier negocio, del local de la esquina a la cadena más grande y en cualquier país, tenga en LealTab la plataforma para conocer a sus clientes y hacer que regresen.”'),
           ('Para quién','PyMEs mexicanas de visita recurrente: cafeterías, estéticas, barberías y gimnasios. **Piloto:** 5 a 10 barberías, estéticas y negocios de tapioca en Villahermosa.'),
           ('Cómo crece','**Al lanzar:** la tarjeta digital más simple y bonita. **Después:** la plataforma de lealtad seria que crece con tu negocio. La marca no cambia; cambia el énfasis del mensaje.')]
    for i,(tt,tx) in enumerate(items):
        x=MX+i*(cw+24); o+=box(x,596,cw,400)+T(x+28,650,tt,30,800,fam='Archivo')
        t,_=para(x+28,704,cw-56,tx,23,500,NOCHE,1.5,where='p3 '+tt); o+=t
    return page(3,TOTAL,'Marca','Qué es LealTab',o,lead='Lo esencial de la marca, tal como quedó aprobado en la Fase 1 (estrategia de marca).')
def p4():
    o=''; cw=(W-2*MX-3*24)/4
    R=[('Simple','Cualquier dueño la entiende y la usa sin ayuda.','Clara, directa, pocos pasos','Básica, limitada, “barata”',''),
       ('Confiable','Cumple, es transparente y cuida los datos.','Seria, predecible, honesta','Fría, burocrática, corporativa','Aquí vive lo tecnológico: rápida, estable, bien construida.'),
       ('Humana','Cercana, habla como persona y entiende el mostrador.','Cercana, empática, con buen humor','Infantil, con mascotas o exceso de emojis',''),
       ('Premium','Cuidado en cada detalle, sin ser pretenciosa.','Cuidada, elegante, con estándar alto','Pretenciosa, cara, exclusiva','Aquí vive lo moderno: actual y ligera, sin modas pasajeras.')]
    for i,(n,d,si,no,nota) in enumerate(R):
        x=MX+i*(cw+24); o+=box(x,236,cw,560)+T(x+28,300,n,48,800,fam='Archivo')
        t,hh=para(x+28,352,cw-56,d,22,600,NOCHE,1.4,where='p4'); o+=t; y=352+hh+30
        o+=f'<line x1="{f(x+28)}" y1="{f(y-10)}" x2="{f(x+cw-28)}" y2="{f(y-10)}" stroke="{RULE}" stroke-width="1.5"/>'
        o+=mark(x+28,y+6,True,24)+T(x+64,y+25,'Sí',16,800); t,hh=para(x+64,y+54,cw-92,si,19,500,NOCHE,1.4,where='p4'); o+=t; y+=54+hh+16
        o+=mark(x+28,y+6,False,24)+T(x+64,y+25,'No',16,800); t,hh=para(x+64,y+54,cw-92,no,19,500,NOCHE,1.4,where='p4'); o+=t; y+=54+hh
        if nota: t,_=para(x+28,700,cw-56,nota,17,500,GN,1.45,where='p4 nota'); o+=t
    o+=box(MX,826,W-2*MX,170,MENTA)
    t,_=para(MX+32,882,W-2*MX-64,'**Cómo se siente:** como una herramienta seria hecha por gente cercana. Precisa en el panel del negocio y alegre en el mostrador, sin volverse infantil. Minimal en el orden, neobrutal en los detalles.',24,500,NOCHE,1.45,where='p4 franja'); o+=t
    return page(4,TOTAL,'Marca','Personalidad',o,lead='Cuatro rasgos, aprobados el 4 de octubre de 2026. Moderna y Tecnológica quedaron dentro de Premium y Confiable.')
def p5():
    o=''; lw=600
    o+=box(MX,236,lw,470)+T(MX+28,286,'Principios de voz',28,800,fam='Archivo'); y=334
    for tt,tx in [('Claro antes que ingenioso.','Si una frase necesita explicación, se reescribe.'),('Concreto, no adjetivos.','Mostramos qué pasa (“ves quién no ha vuelto en un mes”), no decimos “potente” ni “innovador”.'),('Cercano y respetuoso.','Como alguien que sabe de tecnología y entiende un negocio de mostrador; nunca condescendiente.'),('Seguro, sin exagerar.','Sin urgencia falsa, sin promesas que el producto no cumple, sin mayúsculas ni signos de más.')]:
        t,hh=para(MX+28,y,lw-56,f'**{tt}** {tx}',20,500,NOCHE,1.42,where='p5 principios'); o+=t; y+=hh+14
    o+=box(MX,730,lw,266)+T(MX+28,780,'Tú o usted',28,800,fam='Archivo')
    t,_=para(MX+28,826,lw-56,'**Hablamos de tú.** Si en soporte el cliente escribe de usted, contestamos de usted. Los documentos legales pueden ir en un registro más formal. En la tarjeta del cliente final el negocio elige; por defecto, tú.',20,500,NOCHE,1.45,where='p5 tu'); o+=t
    x=MX+lw+28; ww=W-MX-x
    o+=box(x,236,ww,760)+T(x+28,286,'Tono por contexto',28,800,fam='Archivo')
    rows=[('Landing','Seguro y directo; beneficio primero.','“Tu tarjeta de lealtad, ahora en el celular de tus clientes.”'),
          ('Onboarding','Guía breve, un paso a la vez, celebra poco.','“Sube tu logo. Así te van a reconocer tus clientes.”'),
          ('Soporte por WhatsApp','Humano, rápido, con nombre propio.','“Hola, soy Aarón de LealTab. Ya lo revisé: tu tarjeta quedó lista.”'),
          ('Mensajes de error','Calmado; dice qué pasó y qué hacer. Nunca culpa.','“No pudimos guardar los cambios. Revisa tu conexión e inténtalo otra vez.”'),
          ('Redes sociales','Más ligero y visual; humor suave; casos reales.','“El cartón se pierde en la cartera. La tarjeta digital, no.”'),
          ('Tarjeta del cliente final','Con la voz del negocio, no de LealTab. Breve y cálido.','“¡Llevas 4 de 5! El siguiente corte va por nuestra cuenta.”')]
    t,hh=table(x+20,306,[230,330,ww-40-560],['Contexto','Tono','Ejemplo'],rows,16,10,12,where='p5 tono'); o+=t
    y=306+hh+34; o+=T(x+28,y,'Decimos / no decimos',22,800,fam='Archivo')
    rows2=[('Tus clientes regresan','Maximiza el engagement de tu base de usuarios'),('Tarjeta digital','Solución omnicanal de fidelización'),('Ves quién regresa y quién no','Analítica avanzada impulsada por IA'),('Precio claro, sin contratos','¡Oferta por tiempo limitado! ¡Solo hoy!'),('Siempre “LealTab”, con T mayúscula','“Leal” a secas')]
    t,hh2=table(x+20,y+14,[(ww-40)/2,(ww-40)/2],['Decimos','No decimos'],rows2,15,7,12,where='p5 decimos',bolds=()); o+=t
    return page(5,TOTAL,'Marca','Voz y tono',o,lead='Claro, concreto y cercano. La voz va de tú y no usa jerga.')
