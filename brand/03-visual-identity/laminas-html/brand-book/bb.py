"""Brand book LealTab · utilidades de página (1920×1080)."""
import re, os, sys, math
sys.path.insert(0,'../recursos')
import comun
from comun import NOCHE,LINO,CLARO,DUR,BOSQUE,MENTA,GN,OR,f,arc
L='/workspace/lealtab/03-visual-identity/logo/'; RC='/workspace/lealtab/03-visual-identity/recursos/'
OUT='/workspace/lealtab/03-visual-identity/brand-book/'
W,H=1920,1080; MX=96
DCLARO='#FFD9C4'; RULE='#D8CFBF'; GRIS='#E4DED2'
FONTS=comun.FONTS
FR=open(L+'master/lealtab-master-frozen.svg').read()
def block(gid): return re.findall(r'<path id="[^"]+" d="[^"]+"/>',re.search(rf'<g id="{gid}"[^>]*>(.*?)</g>',FR,re.S).group(1))
DEFS='<defs><g id="isotipo">'+''.join(block('isotipo'))+'</g><g id="wordmark">'+''.join(block('wordmark'))+'</g></defs>'
LK={'h':(810.31,188,'<use href="#isotipo"/><use href="#wordmark"/>',0,0),
    'v':(396.1125,325.945,'<use href="#isotipo" transform="translate(89.5563 0)"/><use href="#wordmark" transform="translate(-211.62 206.8) scale(0.75)"/>',0,0),
    'i':(222,188,'<use href="#isotipo"/>',0,0),
    'w':(528.15,134.27,'<use href="#wordmark" transform="translate(-282.16 -24.58)"/>',0,0)}
def logo(k,x,y,w=None,h=None,col=NOCHE,extra=''):
    lw,lh,inner,_,_=LK[k]; s=(w/lw) if w else (h/lh)
    return f'<g fill="{col}" transform="translate({f(x)} {f(y)}) scale({f(s)})" {extra}>{inner}</g>', lw*s, lh*s
def logo_c(k,cx,cy,w=None,h=None,col=NOCHE,extra=''):
    lw,lh,_,_,_=LK[k]; s=(w/lw) if w else (h/lh)
    return logo(k,cx-lw*s/2,cy-lh*s/2,w,h,col,extra)[0]
# ---------- texto ----------
_HB={}
def _font(fam,wt):
    key=(fam,wt)
    if key in _HB: return _HB[key]
    from fontTools.ttLib import TTFont
    from fontTools.varLib import instancer
    import uharfbuzz as hb
    src={'Manrope':('/usr/share/fonts/truetype/sand-box/google/Manrope/Manrope-VariableFont_wght.ttf',{'wght':wt}),
         'Archivo':('/usr/share/fonts/truetype/sand-box/google/Archivo/Archivo-VariableFont_wdth,wght.ttf',{'wdth':75,'wght':wt})}[fam]
    out=f'/tmp/bb-{fam}-{wt}.ttf'
    if not os.path.exists(out): instancer.instantiateVariableFont(TTFont(src[0]),src[1]).save(out)
    face=hb.Face(hb.Blob.from_file_path(out)); font=hb.Font(face); _HB[key]=(font,face.upem); return _HB[key]
def tw(s,size,wt=500,fam='Manrope',ls=0):
    import uharfbuzz as hb
    if fam=='Archivo': s=s.upper()
    font,upem=_font(fam,wt); b=hb.Buffer(); b.add_str(s); b.guess_segment_properties(); hb.shape(font,b,{'kern':True})
    return sum(p.x_advance for p in b.glyph_positions)*size/upem+ls*max(0,len(s)-1)
esc=lambda s:s.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')
def T(x,y,s,size=18,wt=500,fill=NOCHE,fam='Manrope',anchor='start',ls=0,extra=''):
    st='font-stretch:75%;text-transform:uppercase;' if fam=='Archivo' else 'font-variant-numeric:tabular-nums;'
    lsa=f' letter-spacing="{ls}"' if ls else ''
    return f'<text x="{f(x)}" y="{f(y)}" font-family="{fam}" font-weight="{wt}" font-size="{size}" fill="{fill}" text-anchor="{anchor}" style="{st}"{lsa} {extra}>{esc(s)}</text>'
CHECKS=[]  # (página, texto, ancho, máximo) para verificar desbordes
def fit(s,size,wt,maxw,fam='Manrope',ls=0,where=''):
    w=tw(s,size,wt,fam,ls); CHECKS.append((where,s,round(w,1),round(maxw,1))); return w
def para(x,y,w,s,size=18,wt=500,fill=NOCHE,lh=1.45,bold=700,where='',fam='Manrope'):
    """Párrafo con **negritas**; devuelve (svg, alto). y = línea base de la primera línea."""
    runs=[]
    for i,part in enumerate(re.split(r'\*\*',s)):
        ws=part.split(' ')
        for j,word in enumerate(ws):
            if not word: continue
            g=bold if i%2 else wt
            if j==0 and runs and not part.startswith(' ') and not (i>0 and re.split(r'\*\*',s)[i-1].endswith(' ')):
                runs[-1]=runs[-1]+[(word,g)] if isinstance(runs[-1],list) else [runs[-1],(word,g)]
            else: runs.append((word,g))
    runs=[r if isinstance(r,list) else [r] for r in runs]  # cada "palabra" = lista de trozos pegados
    lines=[]; cur=[]; curw=0; sp=tw(' ',size,wt)
    for pieces in runs:
        ww=sum(tw(a,size,g) for a,g in pieces)
        if cur and curw+sp+ww>w: lines.append(cur); cur=[]; curw=0
        curw+= (sp if cur else 0)+ww; cur.append(pieces)
    if cur: lines.append(cur)
    o=f'<text font-family="{fam}" font-size="{size}" fill="{fill}" style="font-variant-numeric:tabular-nums" xml:space="preserve">'
    for li,ln in enumerate(lines):
        yy=y+li*size*lh; segs=[]
        for wi,pieces in enumerate(ln):
            for pi,(word,wgt) in enumerate(pieces):
                pre=' ' if (wi>0 and pi==0) else ''
                if segs and segs[-1][1]==wgt: segs[-1][0]+=pre+word
                else: segs.append([pre+word,wgt])
        o+=''.join((f'<tspan x="{f(x)}" y="{f(yy)}"' if k==0 else '<tspan')+f' font-weight="{g}">{esc(t)}</tspan>' for k,(t,g) in enumerate(segs))
        CHECKS.append((where,''.join(t for t,_ in segs),round(sum(tw(a,size,g) for p in ln for a,g in p)+sp*(len(ln)-1),1),round(w,1)))
    return o+'</text>', len(lines)*size*lh
def box(x,y,w,h,fill=CLARO,sh=6,rx=14,sw=2.5):
    return (f'<rect x="{f(x+sh)}" y="{f(y+sh)}" width="{f(w)}" height="{f(h)}" rx="{rx}" fill="{NOCHE}"/>' if sh else '')+f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" rx="{rx}" fill="{fill}" stroke="{NOCHE}" stroke-width="{sw}"/>'
def area(x,y,w,h,fill=LINO,rx=10,stroke=None):
    return f'<rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" rx="{rx}" fill="{fill}"'+(f' stroke="{stroke}" stroke-width="1.5"' if stroke else '')+'/>'
def card(x,y,w,h,title,sub='',fill=CLARO,where=''):
    o=box(x,y,w,h,fill)+T(x+24,y+42,title,24,800,fam='Archivo')
    if title: fit(title,24,800,w-48-(tw(sub,15,700)+16 if sub else 0),'Archivo',where=where)
    if sub: o+=T(x+w-24,y+42,sub,15,700,OR,anchor='end')
    return o
def badge(x,y,s,size=15,fill=DUR,ink=NOCHE):
    w=tw(s,size,800,'Archivo',0.4)+28; h=size*2.1
    return f'<rect x="{f(x+3)}" y="{f(y+3)}" width="{f(w)}" height="{f(h)}" rx="6" fill="{NOCHE}"/><rect x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" rx="6" fill="{fill}" stroke="{NOCHE}" stroke-width="2"/>'+T(x+14,y+h/2+size*0.36,s,size,800,ink,'Archivo',ls=0.4), w
ETQ='Aprobado 2026-10-06'
def page(n,total,seccion,titulo,body,lead=None,title_size=76):
    o=f'<rect width="{W}" height="{H}" fill="{LINO}"/>'
    o+=T(MX,82,f'LEALTAB · BRAND BOOK · {n:02d} · {seccion.upper()}',15,800,ls=2.2)
    o+=T(MX,166,titulo,title_size,800,fam='Archivo'); fit(titulo,title_size,800,1100 if lead else W-2*MX,'Archivo',where=f'p{n} título')
    if lead:
        t,hh=para(1240,112,W-MX-1240,lead,19,500,GN,1.45,where=f'p{n} lead'); o+=t
    o+=body
    o+=f'<line x1="{MX}" y1="1026" x2="{W-MX}" y2="1026" stroke="{RULE}" stroke-width="1.5"/>'
    o+=T(MX,1056,f'LealTab · Brand book · {ETQ}',14,600,GN)+T(W-MX,1056,f'{n:02d} / {total:02d}',14,800,anchor='end')
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}"><title>LealTab · Brand book · {n:02d} · {esc(titulo)} · {ETQ}</title>{FONTS}{DEFS}{o}</svg>\n'
# ---------- incrustar SVG aprobados (vectorial) ----------
def nest(path,x,y,w=None,h=None):
    s=open(path).read(); s=s[s.index('<svg'):]
    vb=re.search(r'viewBox="([^"]+)"',s).group(1); vw,vh=map(float,vb.split()[2:])
    if w and not h: h=w*vh/vw
    if h and not w: w=h*vw/vh
    s=re.sub(r'<title>.*?</title>|<desc>.*?</desc>','',s,flags=re.S)
    s=re.sub(r'^<svg[^>]*>',f'<svg x="{f(x)}" y="{f(y)}" width="{f(w)}" height="{f(h)}" viewBox="{vb}" overflow="hidden">',s,count=1)
    return s,w,h
def table(x,y,cols,header,rows,size=16,pad=12,hsize=13,where='',zebra=True,bolds=(0,)):
    """cols: anchos. Devuelve (svg, alto)."""
    o=''; yy=y; W_=sum(cols)
    hx=x
    for c,hd in zip(cols,header): o+=T(hx+pad,yy+hsize+4,hd.upper(),hsize,800,GN,ls=1.2); fit(hd.upper(),hsize,800,c-2*pad,ls=1.2,where=where); hx+=c
    yy+=hsize+16; o+=f'<line x1="{f(x)}" y1="{f(yy)}" x2="{f(x+W_)}" y2="{f(yy)}" stroke="{NOCHE}" stroke-width="1.5"/>'
    for ri,r in enumerate(rows):
        parts=[]; hmax=0; cx=x
        for ci,(c,cell) in enumerate(zip(cols,r)):
            t,hh=para(cx+pad,yy+pad+size*0.95,c-2*pad,cell,size,700 if ci in bolds else 500,NOCHE,1.38,where=where); parts.append(t); hmax=max(hmax,hh); cx+=c
        rh=hmax+2*pad-size*0.38+4
        if zebra and ri%2==0: o+=f'<rect x="{f(x)}" y="{f(yy)}" width="{f(W_)}" height="{f(rh)}" fill="{LINO}"/>'
        o+=''.join(parts); yy+=rh
        o+=f'<line x1="{f(x)}" y1="{f(yy)}" x2="{f(x+W_)}" y2="{f(yy)}" stroke="{RULE}" stroke-width="1"/>'
    return o, yy-y
def mark(x,y,ok=True,s=26):
    """✓ noche o ✕ naranja de láminas (#C2560F), como en las láminas de usos aprobadas."""
    c=NOCHE if ok else OR; r=s/2
    p=f'M{f(x+s*0.28)} {f(y+s*0.52)}L{f(x+s*0.44)} {f(y+s*0.68)}L{f(x+s*0.73)} {f(y+s*0.35)}' if ok else f'M{f(x+s*0.33)} {f(y+s*0.33)}L{f(x+s*0.67)} {f(y+s*0.67)}M{f(x+s*0.67)} {f(y+s*0.33)}L{f(x+s*0.33)} {f(y+s*0.67)}'
    return f'<circle cx="{f(x+r)}" cy="{f(y+r)}" r="{f(r)}" fill="{c}"/><path d="{p}" fill="none" stroke="{CLARO}" stroke-width="{f(s*0.11)}" stroke-linecap="round" stroke-linejoin="round"/>'
