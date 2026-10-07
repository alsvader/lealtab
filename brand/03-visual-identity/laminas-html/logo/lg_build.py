"""Genera logo/svg, logo/png y logo/favicon."""
import os, subprocess, math, json
from PIL import Image
from lg_lock import *
from lg_px import hinted, to_img
ROOT='/workspace/lealtab/03-visual-identity/logo'
for d in ('svg','png','favicon'): os.makedirs(f'{ROOT}/{d}',exist_ok=True)
COL={'noche':'#0F2A22','lino':'#F3EFE6','negro':'#000000','blanco':'#FFFFFF'}
RGB={'noche':(15,42,34),'lino':(243,239,230)}
VARS={'horizontal':lambda c:horizontal(c,c),'vertical':lambda c:vertical(c,c),'isotipo':isotipo,'wordmark':wordmark}
BASEW={'horizontal':640,'vertical':360,'isotipo':256,'wordmark':480}
TIT={'horizontal':'horizontal principal','vertical':'vertical','isotipo':'isotipo','wordmark':'wordmark'}
def chrome_png(svg,w,h,out):
    html=f'<html><head><style>html,body{{margin:0;background:transparent;overflow:hidden}}svg{{display:block}}</style></head><body>{svg}</body></html>'
    tmp=f'/tmp/lg_{os.getpid()}.html'; open(tmp,'w').write(html)
    subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars','--force-device-scale-factor=1',
        '--default-background-color=00000000',f'--window-size={w},{h}',f'--screenshot={out}',f'file://{tmp}'],capture_output=True)
    im=Image.open(out); 
    if im.size!=(w,h): im.crop((0,0,w,h)).save(out)
def main():
    made=[]
    # SVG + PNG transparentes
    for v,fn in VARS.items():
        for cn,c in COL.items():
            vb,body,m=fn(c); W,H=vb[2],vb[3]
            bw=BASEW[v]; bh=bw*H/W
            doc=svgdoc(vb,body,w=bw,h=bh,title=f'LealTab · {TIT[v]} · {cn}')
            p=f'{ROOT}/svg/lealtab-{v}-{cn}.svg'; open(p,'w').write(doc+'\n'); made.append(p)
            for sc in (1,2,4):
                w=round(bw*sc); h=math.ceil(bh*sc)
                s2=svgdoc(vb,body,w=w,h=bw*sc*H/W)
                suf='' if sc==1 else f'@{sc}x'
                out=f'{ROOT}/png/lealtab-{v}-{cn}{suf}.png'; chrome_png(s2,w,h,out); made.append(out)
        # con fondo (área de protección 2x incluida)
        for bgn,fg,bg in (('fondo-lino','#0F2A22','#F3EFE6'),('fondo-noche','#F3EFE6','#0F2A22')):
            vb,body,m=fn(fg); pad=2*m['x']; W,H=vb[2]+2*pad,vb[3]+2*pad
            bw=BASEW[v]+round(2*pad*BASEW[v]/vb[2]); bh=bw*H/W
            for sc in (1,2,4):
                w=round(bw*sc); h=round(bh*sc)
                s2=svgdoc(vb,body,w=w,h=h,pad=pad,bg=bg)
                suf='' if sc==1 else f'@{sc}x'
                out=f'{ROOT}/png/lealtab-{v}-{bgn}{suf}.png'; chrome_png(s2,w,h,out); made.append(out)
                im=Image.open(out).convert('RGBA'); base=Image.new('RGBA',im.size,bg); base.alpha_composite(im); base.convert('RGB').save(out)
    # ---------- favicon ----------
    F=f'{ROOT}/favicon'
    ims=[to_img(hinted(n),RGB['noche']) for n in (16,32,48)]
    for n,im in zip((16,32,48),ims): im.save(f'{F}/favicon-{n}.png')
    ims[2].save(f'{F}/favicon.ico',format='ICO',sizes=[(16,16),(32,32),(48,48)],append_images=ims[:2])
    # favicon.svg adaptable (claro: noche; oscuro: lino)
    sc=56/SYM_W; ox=(64-56)/2; oy=(64-SYM_H*sc)/2
    fav=(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><title>LealTab</title>'
         f'<style>path{{fill:#0F2A22}}@media (prefers-color-scheme:dark){{path{{fill:#F3EFE6}}}}</style>'
         f'<path transform="translate({fmt(ox)} {fmt(oy)}) scale({sc:.6f})" d="{MASTER_D}"/></svg>')
    open(f'{F}/favicon.svg','w').write(fav+'\n')
    def tile(size,frac,fg,bg,out,radius=0):
        sc=size*frac/SYM_W; ox=(size-SYM_W*sc)/2; oy=(size-SYM_H*sc)/2
        rx=f' rx="{radius}"' if radius else ''
        s=(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" width="{size}" height="{size}">'
           f'<rect width="{size}" height="{size}" fill="{bg}"{rx}/><path transform="translate({fmt(ox)} {fmt(oy)}) scale({sc:.6f})" fill="{fg}" d="{MASTER_D}"/></svg>')
        open(out.replace('.png','.svg'),'w').write(s+'\n') if 'maskable' in out else None
        chrome_png(s,size,size,out); made.append(out)
        Image.open(out).convert('RGB').save(out)
    N,L='#0F2A22','#F3EFE6'
    tile(180,0.60,L,N,f'{F}/apple-touch-icon.png')
    tile(192,0.60,L,N,f'{F}/icon-192.png'); tile(512,0.60,L,N,f'{F}/icon-512.png')
    tile(192,0.46,L,N,f'{F}/icon-192-maskable.png'); tile(512,0.46,L,N,f'{F}/icon-512-maskable.png')
    tile(400,0.52,N,L,f'{F}/avatar-400-lino.png'); tile(400,0.52,L,N,f'{F}/avatar-400-noche.png')
    for f in ('icon-512.svg',): pass
    man={"name":"LealTab","short_name":"LealTab","theme_color":"#0F2A22","background_color":"#F3EFE6","display":"standalone",
         "icons":[{"src":"/icon-192.png","sizes":"192x192","type":"image/png","purpose":"any"},
                  {"src":"/icon-512.png","sizes":"512x512","type":"image/png","purpose":"any"},
                  {"src":"/icon-192-maskable.png","sizes":"192x192","type":"image/png","purpose":"maskable"},
                  {"src":"/icon-512-maskable.png","sizes":"512x512","type":"image/png","purpose":"maskable"}]}
    json.dump(man,open(f'{F}/site.webmanifest','w'),indent=2,ensure_ascii=False)
    print(len(made),'archivos')
if __name__=='__main__': main()
