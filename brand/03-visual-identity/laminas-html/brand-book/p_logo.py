from bb import *
TOTAL=24
X=52  # unidad x = trazo del isotipo (u)
def dim_h(x1,x2,y,lab,col=OR,size=15,up=True):
    o=f'<path d="M{f(x1)} {f(y)}H{f(x2)}M{f(x1)} {f(y-7)}V{f(y+7)}M{f(x2)} {f(y-7)}V{f(y+7)}" stroke="{col}" stroke-width="2" fill="none"/>'
    return o+T((x1+x2)/2,y-12 if up else y+24,lab,size,800,col,anchor='middle')
def dim_v(x,y1,y2,lab,col=OR,size=15,left=True):
    o=f'<path d="M{f(x)} {f(y1)}V{f(y2)}M{f(x-7)} {f(y1)}H{f(x+7)}M{f(x-7)} {f(y2)}H{f(x+7)}" stroke="{col}" stroke-width="2" fill="none"/>'
    return o+T(x-12 if left else x+12,(y1+y2)/2+5,lab,size,800,col,anchor='end' if left else 'start')
def p6():
    o=box(MX,236,940,760)+area(MX+24,260,892,712,LINO)
    s=2.35; X0,Y0=MX+24+(892-222*s)/2+10,300+40
    o+=logo('i',X0,Y0,w=222*s)[0]
    o+=dim_h(X0,X0+52*s,Y0+188*s+34,'trazo 52 u = x',up=False)
    o+=dim_h(X0+52*s,X0+114*s,Y0-22,'abertura 62 u')
    cx,cy=X0+172*s,Y0+160*s
    o+=f'<circle cx="{f(cx)}" cy="{f(cy)}" r="30" fill="none" stroke="{OR}" stroke-width="2" stroke-dasharray="5 4"/>'+T(cx+40,cy+44,'abertura 26.8 u',15,800,OR)+T(cx+40,cy+64,'en diagonal',14,600,OR)
    o+=T(X0-20,Y0+120*s,'pieza L',18,800,anchor='end')+T(X0-20,Y0+120*s+22,'domina',15,600,GN,anchor='end')
    o+=T(X0+222*s+20,Y0+70*s,'gancho',18,800)+T(X0+222*s+20,Y0+70*s+22,'más corto',15,600,GN)
    x=MX+940+28; ww=W-MX-x
    o+=box(x,236,ww,430)+T(x+28,290,'La idea',30,800,fam='Archivo')
    t,hh=para(x+28,340,ww-56,'Dos piezas en L, **la L de LealTab**, que casi cierran un cuadro y dejan dos aberturas en esquinas opuestas.',26,500,NOCHE,1.45,where='p6'); o+=t
    t,hh2=para(x+28,340+hh+18,ww-56,'Se lee como el negocio y el cliente: dos partes que se encuentran, y un ciclo que se completa cada vez que alguien regresa. No es un aro ni una tarjeta.',26,500,NOCHE,1.45,where='p6'); o+=t
    o+=box(x,690,ww,306)+T(x+28,744,'Cómo está hecho',30,800,fam='Archivo')
    y=792
    for tx in ['Parte del boceto v0.6 de Aarón López Sosa, convertido a curvas sin redibujar.','Trazo de 52 u con remates y uniones redondas; caja de 222 × 188 u.','En el horizontal, el símbolo mide 1.5 C (C = altura de mayúsculas) y lo separa 0.48 C del nombre.','Nombre: Archivo ancho 75, peso 800, a curvas, tracking −28/1000.']:
        o+=f'<circle cx="{x+34}" cy="{y-6}" r="4" fill="{NOCHE}"/>'; t,hh=para(x+50,y,ww-80,tx,18,500,NOCHE,1.4,where='p6 hecho'); o+=t; y+=hh+8
    return page(6,TOTAL,'Logo','Concepto del isotipo',o,lead='El símbolo es el de Aarón López Sosa (boceto v0.6). Sus trazos están congelados desde el 5 de octubre de 2026.')
def p7():
    o=''; bw=(W-2*MX-28)/2; bh=(760-28)/2
    V=[('h','Horizontal','Versión principal.',['Símbolo = 1.5 C · espacio 0.48 C','Mínimo: 80 px / 25 mm','svg/lealtab-horizontal-*.svg'],440),
       ('v','Vertical','Para espacios más altos que anchos.',['Símbolo = 2 C, arriba y centrado','Separación 0.45 C · mínimo 56 px / 16 mm','svg/lealtab-vertical-*.svg'],None),
       ('i','Isotipo','El símbolo solo: íconos, avatares y favicon.',['222 × 188 u · mínimo 16 px (pixel-fit) / 6 mm','Bajo 48 px se usa el ajuste a píxel','svg/lealtab-isotipo-*.svg'],None),
       ('w','Wordmark','El nombre solo, cuando el símbolo ya está cerca.',['Archivo 75/800 a curvas; no se escribe con texto','Mínimo: 56 px / 15 mm','svg/lealtab-wordmark-*.svg'],380)]
    for i,(k,n,d,specs,lw) in enumerate(V):
        x=MX+(i%2)*(bw+28); y=236+(i//2)*(bh+28)
        o+=box(x,y,bw,bh)+area(x+20,y+20,500,bh-40,LINO)
        if k=='v': o+=logo_c(k,x+270,y+bh/2,h=bh-110)
        elif k=='i': o+=logo_c(k,x+270,y+bh/2,h=150)
        else: o+=logo_c(k,x+270,y+bh/2,w=lw)
        tx=x+548; o+=T(tx,y+64,n,36,800,fam='Archivo')
        t,hh=para(tx,y+108,bw-548-24,d,20,600,NOCHE,1.4,where='p7'); o+=t; yy=y+108+hh+14
        for sp in specs:
            t,hh=para(tx,yy,bw-548-24,sp,16,500,GN if 'svg/' in sp else NOCHE,1.4,where='p7'); o+=t; yy+=hh+6
    return page(7,TOTAL,'Logo','Versiones',o,lead='Cuatro versiones, todas con los trazos congelados. Cada una existe en noche, lino, lino con fondo noche, negro y blanco.')
def p8():
    o=''; n=5; tw_=(W-2*MX-4*24)/n
    T5=[('Noche','#0F2A22',LINO,NOCHE,'Principal, sobre lino.','13.31:1',True),
        ('Lino','#F3EFE6',NOCHE,LINO,'Inversa, sobre noche o bosque.','13.31:1 · 8.54:1',True),
        ('Negro','#000000','#FFFFFF','#000000','Impresión a una tinta.','21:1',True),
        ('Blanco','#FFFFFF','#2A3A33','#FFFFFF','Sobre foto oscura y pareja.','según la foto',True),
        ('Durazno','#FF9F6E',LINO,DUR,'Nunca es color del logo ni fondo de marca.','1.75:1',False)]
    for i,(nm,hx,bg,ink,uso,cr,ok) in enumerate(T5):
        x=MX+i*(tw_+24); o+=box(x,236,tw_,470)
        o+=f'<rect x="{f(x+18)}" y="254" width="{f(tw_-36)}" height="230" rx="10" fill="{bg}"/>'
        o+=logo_c('h',x+tw_/2,369,w=tw_-90,col=ink)
        if not ok: o+=f'<path d="M{f(x+40)} 276L{f(x+tw_-40)} 462" stroke="{OR}" stroke-width="5" stroke-linecap="round"/>'
        o+=mark(x+20,508,ok,28)+T(x+58,530,nm,26,800,fam='Archivo')+T(x+tw_-20,530,hx,16,800,GN,anchor='end')
        t,_=para(x+20,572,tw_-40,uso,19,600,NOCHE,1.4,where='p8'); o+=t
        o+=T(x+20,680,'contraste '+cr,16,700,GN)+(T(x+30,474,'foto oscura simulada',13,700,LINO) if nm=='Blanco' else '')
    o+=box(MX,736,W-2*MX,260)+T(MX+28,790,'Reglas de color',30,800,fam='Archivo')
    rules=['Solo cuatro colores para el logo: **noche, lino, negro y blanco**. Si dudas, usa noche sobre lino.','Fondos que sí: lino, blanco lino, noche, bosque (con logo lino) y foto con una zona limpia.','**Noche sobre durazno no se usa**, aunque pase el contraste: el durazno se reserva para el momento en que se completa una recompensa.','Negro y blanco puros son solo para impresión a una tinta y fotos; en pantalla, noche y lino.']
    y=840; cw=(W-2*MX-56-40)/2
    for i,r in enumerate(rules):
        cx=MX+28+(i%2)*(cw+40); cy=y+(i//2)*72
        t,_=para(cx,cy,cw,r,19,500,NOCHE,1.4,where='p8 reglas'); o+=t
    return page(8,TOTAL,'Logo','Colores del logo',o,lead='El logo va siempre en un solo color y relleno. Contrastes medidos con WCAG 2.1.')
def zona(k,x,y,s,col=NOCHE,bg=LINO,show2x=True):
    lw,lh,_,_,_=LK[k]; M=1.5*X*s; M2=2*X*s; w,h=lw*s,lh*s
    o=''
    if show2x: o+=f'<rect x="{f(x-M2)}" y="{f(y-M2)}" width="{f(w+2*M2)}" height="{f(h+2*M2)}" fill="none" stroke="{NOCHE}" stroke-width="1.5" stroke-dasharray="6 5"/>'
    o+=f'<rect x="{f(x-M)}" y="{f(y-M)}" width="{f(w+2*M)}" height="{f(h+2*M)}" fill="{DCLARO}"/><rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" fill="{bg}"/>'
    o+=logo(k,x,y,w=w,col=col)[0]
    return o,M,M2,w,h
def p9():
    o=box(MX,236,1120,760)+area(MX+24,260,1072,712,LINO)
    s=0.6; t,M,M2,w,h=zona('h',MX+24+40+2*X*s,560,s); x0=MX+24+40+2*X*s; y0=560; o+=t
    o+=dim_h(x0,x0+X*s,y0-M-14,'x',size=17)
    o+=dim_h(x0-M,x0,y0+h/2,'1.5x',size=15)
    o+=T(x0+w+M2-4,y0-M2-10,'2x',16,800,OR,anchor='end')
    s2=0.56; xv=MX+24+1072-40-2*X*s2-396.1125*s2; yv=525; t,Mv,M2v,wv,hv=zona('v',xv,yv,s2); o+=t
    o+=T(x0-M2,y0+h+M2+40,'horizontal',17,800)+T(xv-M2v,yv+hv+M2v+40,'vertical',17,800)
    o+=T(MX+48,940,'Durazno claro: zona libre de 1.5x · línea punteada: 2x recomendado',17,600,GN)
    x=MX+1120+28; ww=W-MX-x
    o+=box(x,236,ww,760)+T(x+28,292,'La unidad x',30,800,fam='Archivo')
    t,hh=para(x+28,340,ww-56,'**x = el grosor del trazo del isotipo (52 u).** Se mide sobre el propio logo, así que crece y se achica con él.',21,500,NOCHE,1.45,where='p9'); o+=t
    y=340+hh+44; o+=T(x+28,y,'Cuánto espacio',30,800,fam='Archivo'); y+=48
    for r in ['**Mínimo: 1.5x por lado** en las cuatro versiones.','**Si hay espacio: 2x por lado.**','En esa zona no entra nada: ni texto, ni bordes, ni otras imágenes. Tampoco puede quedar pegada al borde de la página.','Se mide desde la tinta del logo, no desde un recuadro imaginario.','Los archivos “con-area” ya traen el 1.5x en el lienzo.']:
        o+=f'<circle cx="{x+34}" cy="{y-7}" r="4" fill="{NOCHE}"/>'; t,hh=para(x+50,y,ww-80,r,20,500,NOCHE,1.45,where='p9'); o+=t; y+=hh+12
    return page(9,TOTAL,'Logo','Área de protección',o,lead='El aire alrededor del logo es parte del logo.')
def p10():
    o=box(MX,236,1000,420)+T(MX+28,290,'Mínimos por ancho',30,800,fam='Archivo')
    rows=[('Horizontal','80 px','25 mm','30 mm'),('Vertical','56 px','16 mm','19 mm'),('Isotipo','16 px (con el pixel-fit)','6 mm','7 mm'),('Wordmark','56 px','15 mm','18 mm')]
    t,hh=table(MX+24,314,[200,260,190,300],['Versión','Pantalla','Impreso','Inversa o papel absorbente'],rows,20,12,13,where='p10'); o+=t
    o+=T(MX+28,630,'En inversa (lino sobre noche), serigrafía o papel kraft se suma un 20 %.',17,600,GN)
    o+=box(MX,684,1000,312)+T(MX+28,738,'A tamaño real',30,800,fam='Archivo')+T(MX+1000-28,738,'esta página a 1920 px',15,700,OR,anchor='end')
    a=area(MX+24,758,952,214,LINO); o+=a
    y=820
    o+=logo('h',MX+60,y,w=80)[0]+T(MX+60,y+80,'horizontal 80 px',15,700)
    o+=logo('v',MX+290,y-10,w=56)[0]+T(MX+290,y+80,'vertical 56 px',15,700)
    t,_,_=nest(L+'iconos/pixel/lealtab-isotipo-16px.svg',MX+500,y+8,16,16); o+=t; o+=T(MX+500,y+80,'isotipo 16 px (pixel-fit)',15,700)
    o+=logo('w',MX+760,y+6,w=56)[0]+T(MX+760,y+80,'wordmark 56 px',15,700)
    x=MX+1000+28; ww=W-MX-x
    o+=box(x,236,ww,760)+T(x+28,292,'Cómo se decidió',30,800,fam='Archivo'); y=344
    for r in ['**En pantalla:** la mayúscula mide al menos 12 px de alto y las contraformas de la e, la a y la b se ven abiertas. Se probó en Chrome a 1×, el peor caso.','**Impreso:** la mayúscula mide al menos 3.5 mm y la separación más fina entre letras, al menos 0.10 mm.','**Isotipo bajo 48 px:** usa los ajustes a píxel aprobados (16, 24 y 32 px) a su tamaño exacto. No se escala el vector congelado.','El de 16 px es solo para 16 px: ampliado se ve pixelado.']:
        o+=f'<circle cx="{x+34}" cy="{y-7}" r="4" fill="{NOCHE}"/>'; t,hh=para(x+50,y,ww-80,r,20,500,NOCHE,1.45,where='p10'); o+=t; y+=hh+16
    return page(10,TOTAL,'Logo','Tamaños mínimos',o,lead='Por debajo de estas medidas el logo pierde detalle. Siempre se mide por el ancho.')
# ---------------- usos ----------------
import random
def tile(x,y,w,h,num,title,ok,demo,cap,where=''):
    o=box(x,y,w,h,sh=5)+mark(x+18,y+16,ok,26)+T(x+54,y+36,f'{num:02d} · {title}',19,800,fam='Archivo'); fit(f'{num:02d} · {title}',19,800,w-72,'Archivo',where=where)
    ax,ay,aw,ah=x+16,y+56,w-32,h-56-50
    o+=f'<clipPath id="c{num}{"v" if "vert" in where else ""}"><rect x="{f(ax)}" y="{f(ay)}" width="{f(aw)}" height="{f(ah)}" rx="8"/></clipPath><g clip-path="url(#c{num}{"v" if "vert" in where else ""})">'+demo(ax,ay,aw,ah)+'</g>'
    t,_=para(x+18,y+h-22,w-36,cap,15,600,NOCHE if ok else OR,1.3,where=where); o+=t
    return o
def bg(c): return lambda ax,ay,aw,ah:f'<rect x="{f(ax)}" y="{f(ay)}" width="{f(aw)}" height="{f(ah)}" fill="{c}"/>'
def foto_oscura(ax,ay,aw,ah,uid):
    return f'<defs><radialGradient id="fo{uid}" cx="0.75" cy="0.2" r="0.9"><stop offset="0" stop-color="#5E6B60"/><stop offset="0.55" stop-color="#26332C"/><stop offset="1" stop-color="#151E1A"/></radialGradient></defs><rect x="{f(ax)}" y="{f(ay)}" width="{f(aw)}" height="{f(ah)}" fill="url(#fo{uid})"/>'+T(ax+10,ay+ah-10,'foto oscura simulada',12,700,'#FFFFFF')
def foto_clara(ax,ay,aw,ah,uid):
    return f'<defs><linearGradient id="fc{uid}" x1="0" x2="1"><stop offset="0" stop-color="#EFE7DA"/><stop offset="0.55" stop-color="#E9DFCF"/><stop offset="0.8" stop-color="#B89A78"/><stop offset="1" stop-color="#8C6E52"/></linearGradient></defs><rect x="{f(ax)}" y="{f(ay)}" width="{f(aw)}" height="{f(ah)}" fill="url(#fc{uid})"/>'+T(ax+10,ay+ah-10,'foto simulada · zona limpia',12,700,NOCHE)
def cargado(ax,ay,aw,ah):
    r=random.Random(7); o=''
    cols=['#C9B79C','#7C8F86','#B5532F','#3D4B44','#E2C9A6','#9AA89F','#5B4636']
    for _ in range(90):
        w_=r.uniform(20,70); h_=r.uniform(14,50); o+=f'<rect x="{f(ax+r.uniform(-20,aw))}" y="{f(ay+r.uniform(-20,ah))}" width="{f(w_)}" height="{f(h_)}" fill="{r.choice(cols)}" transform="rotate({r.randint(-30,30)} {f(ax+aw/2)} {f(ay+ah/2)})"/>'
    return f'<rect x="{f(ax)}" y="{f(ay)}" width="{f(aw)}" height="{f(ah)}" fill="#D8CDBB"/>'+o+f'<rect x="{f(ax+4)}" y="{f(ay+ah-28)}" width="{f(tw("foto cargada simulada",12,700)+12)}" height="22" rx="4" fill="{LINO}"/>'+T(ax+10,ay+ah-12,'foto cargada simulada',12,700,NOCHE)
def grid(items,cols,y0=236,h_total=760,where=''):
    n=len(items); rows=(n+cols-1)//cols; gw=(W-2*MX-(cols-1)*22)/cols; gh=(h_total-(rows-1)*22)/rows; o=''
    for i,it in enumerate(items):
        x=MX+(i%cols)*(gw+22); y=y0+(i//cols)*(gh+22); o+=tile(x,y,gw,gh,*it,where=where)
    return o
def C(k,col=NOCHE,w_frac=0.62,hf=None,extra=''):
    def d(ax,ay,aw,ah):
        if k=='v': return logo_c(k,ax+aw/2,ay+ah/2-4,h=ah*(hf or 0.62),col=col,extra=extra)
        return logo_c(k,ax+aw/2,ay+ah/2-4,w=aw*w_frac,col=col,extra=extra)
    return d
def combo(*fs): return lambda ax,ay,aw,ah:''.join(fn(ax,ay,aw,ah) for fn in fs)
def p11():
    it=[(1,'Noche sobre lino',True,combo(bg(LINO),C('h')),'Principal · 13.31:1'),
        (2,'Lino sobre noche',True,combo(bg(NOCHE),C('h',LINO)),'Inversa · 13.31:1'),
        (3,'Negra sobre blanco',True,combo(bg('#FFFFFF'),C('h','#000000')),'Una tinta · 21:1'),
        (4,'Blanca sobre foto oscura',True,combo(lambda a,b,c,d:foto_oscura(a,b,c,d,'4'),C('h','#FFFFFF')),'Solo si la zona del logo es oscura y pareja'),
        (5,'Lino sobre bosque',True,combo(bg(BOSQUE),C('h',LINO)),'8.54:1 · pasa AAA'),
        (6,'Foto con zona limpia',True,combo(lambda a,b,c,d:foto_clara(a,b,c,d,'6'),lambda ax,ay,aw,ah:logo_c('h',ax+aw*0.3,ay+ah/2-6,w=aw*0.4)),'Noche sobre zona clara, con todo el 1.5x libre'),
        (7,'Vertical · noche sobre lino',True,combo(bg(LINO),C('v')),'Proporción congelada: 2 C y 0.45 C'),
        (8,'Vertical · lino sobre bosque',True,combo(bg(BOSQUE),C('v',LINO)),'También lino sobre noche y blanca sobre foto')]
    return page(11,TOTAL,'Logo','Usos correctos',grid(it,4,where='p11'),lead='Siempre con 1.5x de área libre y por encima de los tamaños mínimos. Si dudas, usa noche sobre lino.')
def p12():
    def shadow(ax,ay,aw,ah):
        g1=logo_c('h',ax+aw*0.27+4,ay+ah/2,w=aw*0.42); g2=logo_c('h',ax+aw*0.27,ay+ah/2-4,w=aw*0.42,col=NOCHE)
        g3=logo_c('h',ax+aw*0.73,ay+ah/2-4,w=aw*0.42,col=DUR)
        return bg(LINO)(ax,ay,aw,ah)+g1.replace(f'fill="{NOCHE}"','fill="#9FB3A8"',1)+g2+f'<defs><linearGradient id="gr12" x1="0" x2="1"><stop offset="0" stop-color="{BOSQUE}"/><stop offset="1" stop-color="{DUR}"/></linearGradient></defs>'+g3.replace(f'fill="{DUR}"','fill="url(#gr12)"',1)
    def outline(ax,ay,aw,ah):
        g=logo_c('h',ax+aw/2,ay+ah/2-4,w=aw*0.62,col='none')
        return bg(LINO)(ax,ay,aw,ah)+g.replace('fill="none"','fill="none" stroke="#0F2A22" stroke-width="5"',1)
    def recoloca(ax,ay,aw,ah):
        s=aw*0.5/528.15
        return bg(LINO)(ax,ay,aw,ah)+logo('w',ax+aw*0.18,ay+ah/2-67*s,w=aw*0.5)[0]+logo('i',ax+aw*0.18+aw*0.5+10,ay+ah/2-67*s-30,h=60)[0]
    def deform(ax,ay,aw,ah):
        return bg(LINO)(ax,ay,aw,ah)+f'<g transform="translate({f(ax+aw*0.04)} {f(ay+ah*0.42)}) scale(0.27 0.13)" fill="{NOCHE}">{LK["h"][2]}</g>'+f'<g transform="translate({f(ax+aw*0.58)} {f(ay+ah*0.55)}) rotate(-12) skewX(-10) scale(0.2)" fill="{NOCHE}">{LK["h"][2]}</g>'
    def sincontraste(ax,ay,aw,ah):
        return f'<rect x="{f(ax)}" y="{f(ay)}" width="{f(aw/2)}" height="{f(ah)}" fill="{BOSQUE}"/><rect x="{f(ax+aw/2)}" y="{f(ay)}" width="{f(aw/2)}" height="{f(ah)}" fill="{DUR}"/>'+logo_c('h',ax+aw/4,ay+ah/2-6,w=aw*0.4)+logo_c('h',ax+aw*0.75,ay+ah/2-6,w=aw*0.4,col=LINO)+T(ax+8,ay+ah-10,'noche/bosque 1.56:1',12,700,LINO)+T(ax+aw/2+8,ay+ah-10,'lino/durazno 1.75:1',12,700,NOCHE)
    def invadir(ax,ay,aw,ah):
        s=aw*0.5/810.31; x0=ax+aw*0.25; y0=ay+ah/2-94*s; M=78*s
        b,_=badge(x0+aw*0.5-60,y0+188*s-6,'Nuevo',12)
        return bg(LINO)(ax,ay,aw,ah)+f'<rect x="{f(x0-M)}" y="{f(y0-M)}" width="{f(810.31*s+2*M)}" height="{f(188*s+2*M)}" fill="none" stroke="{OR}" stroke-dasharray="5 4" stroke-width="1.5"/>'+logo('h',x0,y0,w=aw*0.5)[0]+f'<line x1="{f(x0-M/2)}" y1="{f(ay+6)}" x2="{f(x0-M/2)}" y2="{f(ay+ah-6)}" stroke="{NOCHE}" stroke-width="3"/>'+b
    def otra(ax,ay,aw,ah):
        return bg(LINO)(ax,ay,aw,ah)+logo('i',ax+aw*0.12,ay+ah/2-34,h=60)[0]+f'<text x="{f(ax+aw*0.12+82)}" y="{f(ay+ah/2+14)}" font-family="serif" font-style="italic" font-size="{f(aw*0.15)}" fill="{NOCHE}">LealTab</text>'+T(ax+10,ay+ah-10,'serif itálica en lugar de Archivo 75/800',12,700,NOCHE)
    def pix(ax,ay,aw,ah):
        t1,_,_=nest(L+'iconos/pixel/lealtab-isotipo-16px.svg',ax+aw*0.14,ay+(ah-96)/2-8,96,96)
        t2,_,_=nest(L+'iconos/pixel/lealtab-isotipo-16px.svg',ax+aw*0.72,ay+ah/2-8,16,16)
        return bg(LINO)(ax,ay,aw,ah)+f'<g shape-rendering="crispEdges">{t1}</g>'+t2+T(ax+aw*0.72-12,ay+ah/2+34,'16 px: sí',13,700,NOCHE)+T(ax+10,ay+ah-10,'el de 16 px ampliado',12,700,NOCHE)
    it=[(1,'Deformar',False,deform,'No estires, comprimas, rotes ni inclines el logo.'),
        (2,'Logo en durazno',False,combo(bg(LINO),C('h',DUR)),'Durazno es acento del sistema, nunca color del logo.'),
        (3,'Recolocar el símbolo',False,recoloca,'No muevas el símbolo ni cambies su tamaño relativo.'),
        (4,'Contornear o vaciar',False,outline,'El logo va siempre relleno.'),
        (5,'Sombras y efectos',False,shadow,'Ni sombras, ni degradados, ni brillos.'),
        (6,'Fondos sin contraste',False,sincontraste,'Noche sobre bosque y lino sobre durazno no se leen.'),
        (7,'Fondo cargado',False,combo(cargado,C('h')),'Busca una zona limpia o usa un recuadro.'),
        (8,'Invadir el área',False,invadir,'Nada entra en el 1.5x: ni textos ni bordes.'),
        (9,'Otra tipografía',False,otra,'El nombre son curvas fijas; no se reescribe.'),
        (10,'Pixel-fit mal usado',False,pix,'El de 16 px es solo para 16 px.'),
        (11,'Noche sobre durazno',False,combo(bg(DUR),C('h')),'Pasa WCAG, pero durazno es solo de recompensa.')]
    return page(12,TOTAL,'Logo','Usos incorrectos · horizontal',grid(it,4,where='p12'),lead='Lo que nunca se hace con el logo. La sombra dura del estilo es para tarjetas y recuadros, nunca para el logo.',title_size=70)
def p13():
    VL=LK['v'][2]; vw,vh=396.1125,325.945
    def vbox(ax,ay,aw,ah,inner,sx=1,sy=1,rot=0):
        s=ah*0.6/vh; cx,cy=ax+aw/2,ay+ah/2-4
        return bg(LINO)(ax,ay,aw,ah)+f'<g fill="{NOCHE}" transform="translate({f(cx)} {f(cy)}) rotate({rot}) scale({f(s*sx)} {f(s*sy)}) translate({f(-vw/2)} {f(-vh/2)})">{inner}</g>'
    est=lambda a,b,c,d:vbox(a,b,c,d,VL,1.45,0.72)
    esc_=lambda a,b,c,d:vbox(a,b,c,d,'<use href="#isotipo" transform="translate(150.6 100) scale(0.45)"/><use href="#wordmark" transform="translate(-211.62 206.8) scale(0.75)"/>')
    des=lambda a,b,c,d:vbox(a,b,c,d,'<use href="#isotipo" transform="translate(0 0)"/><use href="#wordmark" transform="translate(-211.62 206.8) scale(0.75)"/>')
    sep=lambda a,b,c,d:vbox(a,b,c,d,'<use href="#isotipo" transform="translate(89.5563 -60)"/><use href="#wordmark" transform="translate(-211.62 206.8) scale(0.75)"/>')
    inv=lambda a,b,c,d:vbox(a,b,c,d,'<use href="#wordmark" transform="translate(-211.62 -18.4) scale(0.75)"/><use href="#isotipo" transform="translate(89.5563 137.9)"/>')
    rot=lambda a,b,c,d:vbox(a,b,c,d,VL,rot=-14)
    def inva(ax,ay,aw,ah):
        s=ah*0.6/vh; x0=ax+aw/2-vw*s/2; y0=ay+ah/2-4-vh*s/2; M=78*s; b,_=badge(x0+vw*s-40,y0+vh*s-10,'Nuevo',12)
        return vbox(ax,ay,aw,ah,VL)+f'<rect x="{f(x0-M)}" y="{f(y0-M)}" width="{f(vw*s+2*M)}" height="{f(vh*s+2*M)}" fill="none" stroke="{OR}" stroke-dasharray="5 4" stroke-width="1.5"/>'+b
    it=[(1,'Vertical estirado',False,est,'No cambies las proporciones del vertical.'),
        (2,'Símbolo a otra escala',False,esc_,'El símbolo mide siempre 2 C en el vertical.'),
        (3,'Símbolo desalineado',False,des,'El símbolo va centrado sobre el nombre.'),
        (4,'Separación distinta',False,sep,'Entre símbolo y nombre: siempre 0.45 C.'),
        (5,'Invadir el área',False,inva,'Nada entra en el 1.5x de protección.'),
        (6,'Noche sobre durazno',False,combo(bg(DUR),C('v')),'Durazno es solo para la recompensa.'),
        (7,'Orden invertido',False,inv,'El símbolo va arriba y el nombre abajo.'),
        (8,'Vertical rotado',False,rot,'Nunca rotes ni inclines el logo.')]
    return page(13,TOTAL,'Logo','Usos incorrectos · vertical',grid(it,4,where='p13 vert'),lead='Las mismas reglas valen para el vertical. Además, su proporción congelada no se toca.',title_size=70)
def p14():
    I=L+'iconos/'; o=box(MX,236,W-2*MX,420)+T(MX+28,288,'App, PWA y avatares',30,800,fam='Archivo')+T(W-MX-28,288,'isotipo al 58 % del lado · maskable al 50 %',16,700,OR,anchor='end')
    o+=area(MX+24,310,W-2*MX-48,322,LINO); y=334; x=MX+56
    items=[('app/lealtab-app-icon-180.svg',180,'App icon 180','cuadrado redondeado noche'),('pwa/lealtab-pwa-192.svg',192,'PWA 192',''),('pwa/lealtab-pwa-512.svg',220,'PWA 512','mostrado a 220 px'),('pwa/lealtab-pwa-maskable-512.svg',220,'Maskable 512','zona segura 80 %'),('avatar/lealtab-avatar-lino-400.svg',200,'Avatar lino','400 px'),('avatar/lealtab-avatar-noche-400.svg',200,'Avatar noche','400 px')]
    gap=(W-2*MX-48-64-sum(s for _,s,_,_ in items))/(len(items)-1)
    for p,s,lab,sub in items:
        t,_,_=nest(I+p,x,y+(220-s)/2,s,s); o+=t
        if 'maskable' in p: o+=f'<circle cx="{f(x+s/2)}" cy="{f(y+110)}" r="{f(s*0.4)}" fill="none" stroke="{DUR}" stroke-width="2.5" stroke-dasharray="7 6"/>'
        if 'avatar-lino' in p: o=o.replace(t,f'<rect x="{f(x-6)}" y="{f(y+4)}" width="{f(s+12)}" height="{f(s+12)}" rx="12" fill="{NOCHE}"/>'+t)
        o+=T(x,y+262,lab,18,800)+(T(x,y+286,sub,15,600,GN) if sub else ''); x+=s+gap
    # favicon en pestañas
    bw=(W-2*MX-28)/2
    o+=box(MX,684,bw,312)+T(MX+28,736,'Favicon en pestañas',30,800,fam='Archivo')+T(MX+bw-28,736,'oficial: lino sobre cuadrado noche',16,700,OR,anchor='end')
    for i,(bgc,tab,ink) in enumerate([('#DEE1E6','#FFFFFF',NOCHE),('#202124','#35363A','#E8EAED')]):
        yy=762+i*104; o+=f'<rect x="{MX+24}" y="{yy}" width="{bw-48}" height="84" rx="10" fill="{bgc}"/><rect x="{MX+44}" y="{yy+18}" width="460" height="66" rx="10" fill="{tab}"/>'
        t,_,_=nest(L+'iconos/favicon/favicon.svg',MX+64,yy+35,32,32); o+=t
        o+=T(MX+110,yy+59,'LealTab · Panel',20,600,ink)
        o+=f'<rect x="{MX+520}" y="{yy+30}" width="270" height="42" rx="8" fill="{tab}"/>'
        t2,_,_=nest(L+'iconos/favicon/favicon.svg',MX+534,yy+43,16,16); o+=t2+T(MX+560,yy+57,'LealTab · Panel (16 px real)',15,600,ink)
    x=MX+bw+28
    o+=box(x,684,bw,312)+T(x+28,736,'Ajuste a píxel del isotipo',30,800,fam='Archivo')+T(x+bw-28,736,'para 16 a 48 px',16,700,OR,anchor='end')
    o+=area(x+24,756,bw-48,170,LINO); xx=x+50
    for n in (16,24,32,48):
        t,_,_=nest(I+f'pixel/lealtab-isotipo-{n}px.svg',xx,840-n/2,n,n); o+=t+T(xx,900,f'{n} px',16,700)
        z=min(96,n*4)
        if n<=24:
            t,_,_=nest(I+f'pixel/lealtab-isotipo-{n}px.svg',xx+70,792,z,z); o+=f'<g shape-rendering="crispEdges">{t}</g>'+T(xx+70,900,f'{n} px ×4',16,700,GN); xx+=70+z+50
        else: xx+=n+56
    t,_=para(x+28,956,bw-56,'Son trazos nuevos, dibujados a píxel, que no sustituyen al master. Bajo 48 px se usan estos y no el vector escalado.',16,500,GN,1.4,where='p14'); o+=t
    return page(14,TOTAL,'Logo','Íconos digitales y favicon',o,lead='Todos usan el isotipo congelado; el favicon y los tamaños chicos usan el ajuste a píxel aprobado.')
