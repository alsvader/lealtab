"""Utilidades comunes de recursos gráficos (Fase 3 · aprobado 2026-10-06)."""
import math, os, subprocess
R='/workspace/lealtab/03-visual-identity/recursos/'
NOCHE,LINO,CLARO,DUR,BOSQUE,MENTA,GN,OR='#0F2A22','#F3EFE6','#FFFDF8','#FF9F6E','#0F4D3A','#CFE3D6','#4D635A','#C2560F'
PALETA={NOCHE,LINO,CLARO,DUR,BOSQUE,MENTA,GN}
f=lambda v:f'{v:.3f}'.rstrip('0').rstrip('.') if abs(v)>=5e-4 else '0'
FONTS="<style>@font-face{font-family:'Archivo';src:url('file:///usr/share/fonts/truetype/sand-box/google/Archivo/Archivo-VariableFont_wdth,wght.ttf');font-weight:100 900;font-stretch:62% 125%}@font-face{font-family:'Manrope';src:url('file:///usr/share/fonts/truetype/sand-box/google/Manrope/Manrope-VariableFont_wght.ttf');font-weight:200 800}</style>"
def T(x,y,s,size=13,w=600,fill=NOCHE,fam='Manrope',anchor='start',extra=''):
    st='font-stretch:75%;text-transform:uppercase;' if fam=='Archivo' else 'font-variant-numeric:tabular-nums;'
    return f'<text x="{f(x)}" y="{f(y)}" font-family="{fam}" font-weight="{w}" font-size="{size}" fill="{fill}" text-anchor="{anchor}" style="{st}" {extra}>{s}</text>'

# ---------- esquinas con la proporción del isotipo ----------
# Isotipo: trazo 52, radio exterior 58, interior 6 → eje 32/52 = 0.615 del trazo.
# Íconos (trazo 2): eje 1.25 → exterior 2.25 (1.12 × trazo) e interior 0.25 (0.12 × trazo).
def poly(pts,r=1.25,closed=False):
    n=len(pts); out=[]
    def corner(p0,p1,p2):
        v1=(p0[0]-p1[0],p0[1]-p1[1]); v2=(p2[0]-p1[0],p2[1]-p1[1])
        l1=math.hypot(*v1); l2=math.hypot(*v2); u1=(v1[0]/l1,v1[1]/l1); u2=(v2[0]/l2,v2[1]/l2)
        ang=math.acos(max(-1,min(1,u1[0]*u2[0]+u1[1]*u2[1])))
        t=min(r/math.tan(ang/2),l1/2,l2/2); rr=t*math.tan(ang/2)
        a=(p1[0]+u1[0]*t,p1[1]+u1[1]*t); b=(p1[0]+u2[0]*t,p1[1]+u2[1]*t)
        sweep=1 if (u1[0]*u2[1]-u1[1]*u2[0])<0 else 0
        return a,b,rr,sweep
    if closed:
        cs=[corner(pts[i-1],pts[i],pts[(i+1)%n]) for i in range(n)]
        d=f'M{f(cs[0][1][0])} {f(cs[0][1][1])}'
        for i in range(1,n+1):
            a,b,rr,sw=cs[i%n]; d+=f'L{f(a[0])} {f(a[1])}A{f(rr)} {f(rr)} 0 0 {sw} {f(b[0])} {f(b[1])}'
        return d+'Z'
    d=f'M{f(pts[0][0])} {f(pts[0][1])}'
    for i in range(1,n-1):
        a,b,rr,sw=corner(pts[i-1],pts[i],pts[i+1]); d+=f'L{f(a[0])} {f(a[1])}A{f(rr)} {f(rr)} 0 0 {sw} {f(b[0])} {f(b[1])}'
    return d+f'L{f(pts[-1][0])} {f(pts[-1][1])}'
def arc(cx,cy,r,a0,a1):
    """Arco en grados, 0 = las 12, sentido horario."""
    p=lambda a:(cx+r*math.sin(math.radians(a)),cy-r*math.cos(math.radians(a)))
    x0,y0=p(a0); x1,y1=p(a1); large=1 if (a1-a0)%360>180 else 0
    if abs(a1-a0)>=359.999:
        xm,ym=p(a0+180); return f'M{f(x0)} {f(y0)}A{f(r)} {f(r)} 0 1 1 {f(xm)} {f(ym)}A{f(r)} {f(r)} 0 1 1 {f(x0)} {f(y0)}'
    return f'M{f(x0)} {f(y0)}A{f(r)} {f(r)} 0 {large} 1 {f(x1)} {f(y1)}'

# ---------- texto a curvas (para SVG sueltos, sin depender de fuentes) ----------
_FONTS={}
def _font(name):
    if name in _FONTS: return _FONTS[name]
    from fontTools.ttLib import TTFont
    from fontTools.varLib import instancer
    src={'archivo':('/usr/share/fonts/truetype/sand-box/google/Archivo/Archivo-VariableFont_wdth,wght.ttf',{'wdth':75,'wght':800}),
         'manrope':('/usr/share/fonts/truetype/sand-box/google/Manrope/Manrope-VariableFont_wght.ttf',{'wght':800})}[name]
    out=f'/tmp/lt-{name}-static.ttf'
    if not os.path.exists(out):
        ft=instancer.instantiateVariableFont(TTFont(src[0]),src[1]); ft.save(out)
    import uharfbuzz as hb
    from fontTools.ttLib import TTFont as TT
    blob=hb.Blob.from_file_path(out); face=hb.Face(blob); font=hb.Font(face); tt=TT(out)
    _FONTS[name]=(font,tt,face.upem); return _FONTS[name]
def text_path(s,size,name='archivo',tracking=0.0,feat=None):
    """Devuelve (d, ancho) con la línea base en y=0. tracking en em."""
    import uharfbuzz as hb
    from fontTools.pens.svgPathPen import SVGPathPen
    from fontTools.pens.transformPen import TransformPen
    font,tt,upem=_font(name); buf=hb.Buffer(); buf.add_str(s); buf.guess_segment_properties()
    hb.shape(font,buf,feat or {'kern':True,'liga':True,'tnum':True})
    gs=tt.getGlyphSet(); order=tt.getGlyphOrder(); sc=size/upem; x=0; ds=[]
    for info,pos in zip(buf.glyph_infos,buf.glyph_positions):
        pen=SVGPathPen(gs,ntos=lambda v:f(v)); tp=TransformPen(pen,(sc,0,0,-sc,x+pos.x_offset*sc,-pos.y_offset*sc))
        gs[order[info.codepoint]].draw(tp); ds.append(pen.getCommands()); x+=pos.x_advance*sc+tracking*size
    return ''.join(ds), x-tracking*size

def svgdoc(w,h,body,title,desc='',vb=None):
    vb=vb or f'0 0 {f(w)} {f(h)}'
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}" width="{f(w)}" height="{f(h)}"><title>{title}</title>'+(f'<desc>{desc}</desc>' if desc else '')+body+'</svg>\n'
def write(rel,txt):
    p=R+rel; os.makedirs(os.path.dirname(p),exist_ok=True); open(p,'w').write(txt); return p
