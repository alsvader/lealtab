import math
C=32
def pt(r,deg):  # deg clockwise from 12 o'clock
    a=math.radians(deg); return (C+r*math.sin(a), C-r*math.cos(a))
def f(p): return f'{p[0]:.2f} {p[1]:.2f}'
def sector(R,r,a0,a1):
    """annulus sector clockwise a0->a1 with flat ends"""
    large=1 if (a1-a0)%360>180 else 0
    return f'M{f(pt(R,a0))} A{R} {R} 0 {large} 1 {f(pt(R,a1))} L{f(pt(r,a1))} A{r} {r} 0 {large} 0 {f(pt(r,a0))} Z'
def cap(R,r,deg):
    m=(R+r)/2; w=(R-r)/2; p=pt(m,deg); return f'<circle cx="{p[0]:.2f}" cy="{p[1]:.2f}" r="{w:.2f}"/>'

def c1():  # Regreso: espiral de poco más de una vuelta (el aro se pasa y regresa)
    pts=[]
    th0=40; span=410; r0=13.5; r1=28
    for i in range(0,121):
        t=i/120; th=th0+span*t; rr=r0+(r1-r0)*t
        pts.append(pt(rr,th))
    xs=[p[0] for p in pts]; ys=[p[1] for p in pts]; h=4.25
    dx=32-(min(xs)+max(xs))/2; dy=32-(min(ys)+max(ys))/2
    pts=[(x+dx,y+dy) for x,y in pts]
    d='M'+' L'.join(f(p) for p in pts)
    return f'<path d="{d}" fill="none" stroke="currentColor" stroke-width="8.5" stroke-linecap="round" stroke-linejoin="round"/>'
def c2():  # Esquina: L + aro
    w=11; rr=18
    end=pt(rr,140)
    d=f'M27 50 L14 50 L14 32 A{rr} {rr} 0 1 1 {end[0]:.2f} {end[1]:.2f}'
    return f'<path d="{d}" fill="none" stroke="currentColor" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="miter"/>'
def c3():  # Vueltas: dos aros abiertos con el hueco alineado
    return (f'<path d="{sector(29,20,62,358)}"/>'+cap(29,20,62)+cap(29,20,358)+
            f'<path d="{sector(14.5,5.5,62,358)}"/>'+cap(14.5,5.5,62)+cap(14.5,5.5,358))
def c4():  # Siguiente: aro + punto
    R,r=26,15
    a0,a1=70,350
    p=pt((R+r)/2,30)
    return f'<path d="{sector(R,r,a0,a1)}"/>'+cap(R,r,a0)+cap(R,r,a1)+f'<circle cx="{p[0]:.2f}" cy="{p[1]:.2f}" r="6.2"/>'
CONCEPTS=[('regreso','Regreso','Un trazo que da poco más de una vuelta y pasa por fuera de su inicio: el cliente se pasa y regresa, como la animación del aro.',c1),
('esquina','Esquina','Un aro con una esquina recta: la L de LealTab dentro del ciclo de regreso.',c2),
('vueltas','Vueltas','Dos aros abiertos hacia el mismo lado: cada regreso suma una vuelta y la relación crece.',c3),
('siguiente','Siguiente','Un aro abierto y un punto en el hueco: la próxima visita que cierra el ciclo.',c4)]
def svg(fn,color,size=None,bg=None):
    s=f' width="{size}" height="{size}"' if size else ''
    b=f'<rect width="64" height="64" fill="{bg}"/>' if bg else ''
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"{s} style="color:{color}">{b}<g fill="{color}" color="{color}">{fn()}</g></svg>'
if __name__=='__main__':
    for key,name,idea,fn in CONCEPTS:
        open(f'../isotipo/isotipo-{key}.svg','w').write(svg(fn,'#0F4D3A').replace(' style="color:#0F4D3A"',''))
    print('ok')
