"""Sistema del aro de progreso. Mismo trazo que el isotipo (52 u) con un diámetro exterior de 2 alturas del isotipo (376 u): trazo = 13.8 % del diámetro. Remates redondos."""
import re
from comun import *
D_U,SW_U=376,52; RC_U=(D_U-SW_U)/2   # radio del eje = 68 u
FR=open('/workspace/lealtab/03-visual-identity/logo/master/lealtab-master-frozen.svg').read()
ISO=''.join(re.findall(r'<path id="isotipo-[^"]+" d="[^"]+"/>',FR))
def aro(cx,cy,D,frac,modo='marketing',col=None,track=None,outline=None,shadow=None,cap_extra=0):
    """D = diámetro exterior. frac 0..1. modo marketing: contorno + sombra dura noche; ui: plano."""
    k=D/D_U; sw=SW_U*k; r=RC_U*k; o=''
    complete=frac>=1
    col=col or (DUR if complete else BOSQUE); track=track or MENTA
    if modo=='marketing':
        ol=outline if outline is not None else max(2,3*D/300); sh=shadow if shadow is not None else max(3,6*D/300)
        full=arc(cx,cy,r,0,360)
        # sombra dura (un solo nivel) + contorno exterior e interior del carril
        o+=f'<g transform="translate({f(sh)} {f(sh)})"><path d="{full}" fill="none" stroke="{NOCHE}" stroke-width="{f(sw+ol)}"/></g>'
        o+=f'<path d="{full}" fill="none" stroke="{NOCHE}" stroke-width="{f(sw+ol)}"/><path d="{full}" fill="none" stroke="{track}" stroke-width="{f(sw-ol)}"/>'
        if 0<frac:
            p=arc(cx,cy,r,0,360*frac) if not complete else full
            o+=f'<path d="{p}" fill="none" stroke="{NOCHE}" stroke-width="{f(sw+ol)}" stroke-linecap="round"/><path d="{p}" fill="none" stroke="{col}" stroke-width="{f(sw-ol)}" stroke-linecap="round"/>'
    else:
        o+=f'<path d="{arc(cx,cy,r,0,360)}" fill="none" stroke="{track}" stroke-width="{f(sw)}"/>'
        if 0<frac:
            p=arc(cx,cy,r,0,360*frac) if not complete else arc(cx,cy,r,0,360)
            o+=f'<path d="{p}" fill="none" stroke="{col}" stroke-width="{f(sw)}" stroke-linecap="round"/>'
    return o
def numero(cx,cy,txt,size,col=NOCHE,name='manrope'):
    d,w=text_path(txt,size,name); return f'<path transform="translate({f(cx-w/2)} {f(cy+size*0.36)})" d="{d}" fill="{col}"/>'
if __name__=='__main__':
    D=300; W=H=D+20
    casos=[('vacio',0,'Aro vacío (0 de 8)',''),('parcial-3de8',3/8,'Aro parcial (3 de 8 visitas)','3/8'),('completo',1,'Aro completo en durazno (8 de 8)','8/8')]
    for k,fr,tit,num in casos:
        b=aro(D/2+4,D/2+4,D,fr)+(numero(D/2+4,D/2+4,num,40) if num else '')
        write(f'aro/lt-aro-marketing-{k}.svg',svgdoc(W,H,b,f'LealTab · {tit} · marketing','Diámetro exterior 300 · trazo = 52/376 del diámetro (el trazo del isotipo con 2 alturas de isotipo) · contorno y sombra dura noche · Aprobado 2026-10-06'))
        for d_ui in (56,24):
            b=aro(d_ui/2,d_ui/2,d_ui,fr,'ui')+(numero(d_ui/2,d_ui/2,num,13) if (num and d_ui>=56) else '')
            write(f'aro/lt-aro-ui-{d_ui}-{k}.svg',svgdoc(d_ui,d_ui,b,f'LealTab · {tit} · interfaz {d_ui} px','Plano, sin contorno ni sombra · Aprobado 2026-10-06'))
    # relación con el isotipo
    b=f'<g fill="{NOCHE}" transform="translate(0 94)">{ISO}</g>'+f'<g transform="translate(282 0)">{aro(188,188,376,3/8,"ui",col=NOCHE,track=MENTA)}</g>'
    write('aro/lt-aro-relacion-isotipo.svg',svgdoc(658,376,b,'LealTab · aro e isotipo: mismo trazo (52 u), remates redondos, diámetro = 2 × alto del isotipo','Isotipo con los d congelados del master (sin cambios). Aprobado 2026-10-06'))
    # animaciones (SMIL, sin bucle): avance 0→3/8 con rebote y cierre 7/8→8/8 con cambio a durazno
    def anim(nombre,f0,f1,complete):
        Dd=300; c=Dd/2+4; k=Dd/D_U; sw=SW_U*k; r=RC_U*k; ol=3; full=arc(c,c,r,0,360)
        base=aro(c,c,Dd,0)
        a0,a1=100*f0,100*f1; over=min(100,a1+3.5)
        dash=f'stroke-dasharray="0 100" pathLength="100"'
        vals=f'0 100;{f(over)} 100;{f(a1)} 100' if not complete else f'{f(a0)} 100;100 0'
        kt='0;0.8;1' if not complete else '0;1'; sp='0.2 0.8 0.2 1;0.2 0.8 0.2 1' if not complete else '0.2 0.8 0.2 1'
        if not complete: vals=f'{f(a0)} 100;{f(over)} 100;{f(a1)} 100'
        an=f'<animate attributeName="stroke-dasharray" begin="0.3s" dur="{"0.65s" if not complete else "0.52s"}" values="{vals}" keyTimes="{kt}" calcMode="spline" keySplines="{sp}" fill="freeze"/>'
        b=base+f'<g id="avance"><path d="{full}" fill="none" stroke="{NOCHE}" stroke-width="{f(sw+ol)}" stroke-linecap="round" stroke-dasharray="{f(a0)} 100" pathLength="100">{an}</path>'
        col_anim=f'<animate attributeName="stroke" begin="0.82s" dur="0.12s" from="{BOSQUE}" to="{DUR}" fill="freeze"/>' if complete else ''
        b+=f'<path d="{full}" fill="none" stroke="{BOSQUE}" stroke-width="{f(sw-ol)}" stroke-linecap="round" stroke-dasharray="{f(a0)} 100" pathLength="100">{an}{col_anim}</path></g>'
        if complete:
            inner=b[len(base):]
            b=base+f'<g transform="translate({f(c)} {f(c)})"><g><animateTransform attributeName="transform" type="scale" begin="0.82s" dur="0.16s" values="1;1.04;1" fill="freeze"/><g transform="translate({f(-c)} {f(-c)})">{inner}</g></g></g>'
        else:
            b=b.replace('pathLength="100">','pathLength="100" stroke-opacity="0"><set attributeName="stroke-opacity" to="1" begin="0.3s" fill="freeze"/>')
        write(f'aro/{nombre}.svg',svgdoc(Dd+20,Dd+20,b,f'LealTab · animación del aro · {"cierre y cambio a durazno" if complete else "avance a 3 de 8 con un rebote"}','SMIL, sin bucle, dura menos de 1 s. Referencia para desarrollo (CSS o JS en producto). Respeta reducir movimiento: mostrar el estado final sin animar. Aprobado 2026-10-06'))
    anim('lt-aro-animacion-avance',0,3/8,False); anim('lt-aro-animacion-cierre',7/8,1,True)
    print('ok')
