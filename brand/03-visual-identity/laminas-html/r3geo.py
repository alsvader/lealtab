"""LealTab isotipo r3: reconstrucción del símbolo de Aarón (dos piezas en L) como formas rellenas.
Retícula de 64 u. Pieza 1 = L (fuste vertical + pie). Pieza 2 = la misma pieza girada 180° (simetría rotacional)."""
def f(v): 
    s=f'{v:.3f}'.rstrip('0').rstrip('.'); return s if s!='-0' else '0'

# Parámetros de A (versión fiel refinada)
A=dict(X0=7,X1=57,Y0=7,Y1=57,Tv=13,Th=12,R=14,r=4,g=8,gb=6,short=7,term='round',tr=0,ov=0.75)
VAR={
 'A':dict(A),
 'B':dict(A,g=4,gb=3),                     # aberturas cerradas
 'C':dict(A,term='flat',tr=1.5,ov=0,gb=8),   # terminales rectos
 'D':dict(A,R=7,r=2),                   # esquinas tensas
}
# 16 px con píxeles alineados (sólo A): unidades = píxeles
PX16=dict(X0=2,X1=14,Y0=2,Y1=14,Tv=3,Th=3,R=3,r=0.5,g=2,gb=2,short=2,term='flat',tr=0.75,ov=0)

def piece(p,rot=False):
    X0,X1,Y0,Y1,Tv,Th,R,r,g=(p[k] for k in 'X0 X1 Y0 Y1 Tv Th R r g'.split())
    ov=p['ov']; Xe=X1-Tv-p.get('gb',g)
    if rot: Y0=Y0+p.get('short',0); ov=ov if p.get('short',0)==0 else 0
    YS=p['Y0']+p['Y1']
    T=lambda x,y:((X0+X1-x,YS-y) if rot else (x,y))
    out=[]
    def M(x,y): out.append('M'+f(T(x,y)[0])+' '+f(T(x,y)[1]))
    def L(x,y): out.append('L'+f(T(x,y)[0])+' '+f(T(x,y)[1]))
    def Aa(rad,sw,x,y): 
        if rad<=0: L(x,y); return
        out.append(f'A{f(rad)} {f(rad)} 0 0 {sw} '+f(T(x,y)[0])+' '+f(T(x,y)[1]))
    if p['term']=='round':
        rt=Tv/2; M(X0,Y0-ov+rt); Aa(rt,1,X0+Tv,Y0-ov+rt)
    else:
        t=p['tr']; M(X0,Y0+t); Aa(t,1,X0+t,Y0); L(X0+Tv-t,Y0); Aa(t,1,X0+Tv,Y0+t)
    L(X0+Tv,Y1-Th-r); Aa(r,0,X0+Tv+r,Y1-Th)
    if p['term']=='round':
        rh=Th/2; L(Xe-rh,Y1-Th); Aa(rh,1,Xe-rh,Y1)
    else:
        t=p['tr']; L(Xe-t,Y1-Th); Aa(t,1,Xe,Y1-Th+t); L(Xe,Y1-t); Aa(t,1,Xe-t,Y1)
    L(X0+R,Y1); Aa(R,1,X0,Y1-R); out.append('Z')
    return ''.join(out)

def d(k): 
    p=VAR[k] if isinstance(k,str) else k
    return piece(p)+piece(p,True)

def svg(k,fill,size,extra=''):
    vb='0 0 16 16' if k=='PX16' else '0 0 64 64'
    p=PX16 if k=='PX16' else k
    sr=' shape-rendering="crispEdges"' if False else ''
    return f'<svg viewBox="{vb}" width="{size}" height="{size}"{extra}><path d="{d(p)}" fill="{fill}"/></svg>'
