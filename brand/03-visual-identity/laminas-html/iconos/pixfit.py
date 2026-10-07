"""Generador de isotipos AJUSTADOS A PÍXEL (trazados nuevos, derivados; los congelados no se tocan).
Modelo geométrico del isotipo congelado: dos trazos de grosor t con remates redondos (r = t/2) y esquina
exterior de radio ro (interior ri = ro - t). Todas las medidas en px de la rejilla de destino."""
def f(v):
    s=f'{v:.3f}'.rstrip('0').rstrip('.'); return s if s!='-0' else '0'
def piece_l(x0,y0,y1,t,lend,ro):
    r=t/2; ri=max(ro-t,0)
    d=f'M{f(x0)} {f(y0+r)}A{f(r)} {f(r)} 0 0 1 {f(x0+t)} {f(y0+r)}V{f(y1-t-ri)}'
    if ri>0: d+=f'A{f(ri)} {f(ri)} 0 0 0 {f(x0+t+ri)} {f(y1-t)}'
    d+=f'H{f(lend-r)}A{f(r)} {f(r)} 0 0 1 {f(lend-r)} {f(y1)}H{f(x0+ro)}A{f(ro)} {f(ro)} 0 0 1 {f(x0)} {f(y1-ro)}Z'
    return d
def piece_g(x1,y0,t,gstart,gend,ro):
    r=t/2; ri=max(ro-t,0)
    d=f'M{f(gstart+r)} {f(y0)}H{f(x1-ro)}A{f(ro)} {f(ro)} 0 0 1 {f(x1)} {f(y0+ro)}V{f(gend-r)}'
    d+=f'A{f(r)} {f(r)} 0 0 1 {f(x1-t)} {f(gend-r)}V{f(y0+t+ri)}'
    if ri>0: d+=f'A{f(ri)} {f(ri)} 0 0 0 {f(x1-t-ri)} {f(y0+t)}'
    d+=f'H{f(gstart+r)}A{f(r)} {f(r)} 0 0 1 {f(gstart+r)} {f(y0)}Z'
    return d
def build(s):
    """s: dict con x0,x1,y0,y1,t,lend,gstart,gend,ro (coordenadas absolutas en la rejilla)."""
    return (piece_l(s['x0'],s['y0'],s['y1'],s['t'],s['lend'],s['ro']),
            piece_g(s['x1'],s['y0'],s['t'],s['gstart'],s['gend'],s['ro']))
# Parámetros del congelado (u) para validar el modelo
FROZEN_MODEL=dict(x0=0,x1=222,y0=0,y1=188,t=52,lend=150,gstart=114,gend=156,ro=58)
# Especificaciones ajustadas (px). Bordes rectos en enteros; t entero.
SPECS={
 16:dict(N=16,x0=0,x1=16,y0=1,y1=15,t=4,lend=10,gstart=8,gend=12,ro=4),
 24:dict(N=24,x0=1,x1=23,y0=2,y1=21,t=5,lend=16,gstart=12,gend=18,ro=6),
 32:dict(N=32,x0=1,x1=31,y0=3,y1=28,t=7,lend=21,gstart=16,gend=24,ro=8),
 48:dict(N=48,x0=1,x1=47,y0=4,y1=43,t=11,lend=32,gstart=25,gend=36,ro=12),
}
# Internos para la opción B del favicon (símbolo ~75 % dentro del cuadrado redondeado)
SPECS_B={
 16:dict(N=16,x0=2,x1=14,y0=3,y1=13,t=3,lend=9,gstart=8,gend=11,ro=3),
 32:dict(N=32,x0=5,x1=27,y0=6,y1=25,t=5,lend=20,gstart=16,gend=22,ro=6),
 48:dict(N=48,x0=6,x1=42,y0=9,y1=39,t=8,lend=30,gstart=24,gend=34,ro=9),
}
