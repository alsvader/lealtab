"""Prueba de fidelidad por raster: v0.6 (trazo) contra master (relleno), y wordmark en curvas contra texto vivo."""
import subprocess, json, re, numpy as np
from PIL import Image
from build_master import S1,S2,pd,glyphs,M,OX,OY
SC=4  # escala de raster
def shot(svgbody,w,h,out,extra_css=''):
    html=f'<html><head><style>@font-face{{font-family:A;src:url("file:///usr/share/fonts/truetype/sand-box/google/Archivo/Archivo-VariableFont_wdth,wght.ttf");font-weight:100 900;font-stretch:62% 125%}}html,body{{margin:0;background:#fff}}{extra_css}</style></head><body>{svgbody}</body></html>'
    open('/tmp/vf.html','w').write(html)
    subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars','--force-device-scale-factor=1',f'--window-size={w},{h}','--virtual-time-budget=4000',f'--screenshot={out}','file:///tmp/vf.html'],capture_output=True)
    a=np.asarray(Image.open(out).convert('L'),dtype=np.float32)[:h,:w]; return 1-a/255
W,H=222*SC,188*SC
orig=shot(f'<svg width="{W}" height="{H}" viewBox="{OX} {OY} 222 188"><g fill="none" stroke="#000" stroke-width="52" stroke-linecap="round" stroke-linejoin="round"><path d="M40 20 V124 Q40 156 72 156 H138"/><path d="M154 20 H178 Q210 20 210 52 V124"/></g></svg>',W,H,'/tmp/v_orig.png')
mast=shot(f'<svg width="{W}" height="{H}" viewBox="0 0 222 188"><path d="{pd(S1)}"/><path d="{pd(S2)}"/></svg>',W,H,'/tmp/v_mast.png')
def stats(a,b):
    d=np.abs(a-b); ink=((a>.5)|(b>.5)).sum()
    return dict(max_diff=float(d.max()),px_diff_gt_50=int((d>.5).sum()),px_diff_gt_10=int((d>.1).sum()),ink_px=int(ink),mean_diff_on_ink=float(d[(a>.02)|(b>.02)].mean()))
iso=stats(orig,mast)
def overlay(a,b,out):
    # rojo = solo v0.6, verde = solo master, noche = ambos
    rgb=np.ones(a.shape+(3,))*np.array([243,239,230])
    both=np.minimum(a,b); oa=np.clip(a-b,0,1); ob=np.clip(b-a,0,1)
    for col,amt in ((np.array([15,42,34]),both),(np.array([230,30,30]),oa),(np.array([20,170,60]),ob)):
        rgb=rgb*(1-amt[...,None])+col*amt[...,None]
    Image.fromarray(rgb.round().astype(np.uint8)).save(out)
overlay(orig,mast,'/tmp/v_iso_overlay.png')
# wordmark: curvas vs texto vivo (misma fuente, ancho 75, 800, tracking −28/1000)
C=M['C']; fs=C/0.687; ww=(M['WX1']-M['tx']+20)*SC; wh=int(190*SC)
wm_paths=''.join(f'<path d="{d}"/>' for _,d in glyphs)
x0=M['tx']
curv=shot(f'<svg width="{ww:.0f}" height="{wh}" viewBox="{x0} 0 {ww/SC:.3f} 190">{wm_paths}</svg>',int(ww),wh,'/tmp/v_wc.png')
live=shot(f'<svg width="{ww:.0f}" height="{wh}" viewBox="{x0} 0 {ww/SC:.3f} 190"><text x="{x0}" y="{M["base"]}" font-family="A" font-size="{fs:.4f}" style="font-stretch:75%;font-weight:800;letter-spacing:{-0.028*fs:.4f}px;font-kerning:normal">LealTab</text></svg>',int(ww),wh,'/tmp/v_wl.png')
wm=stats(live,curv)
overlay(live,curv,'/tmp/v_wm_overlay.png')
json.dump(dict(iso=iso,wordmark=wm,scale=SC),open('/tmp/verify.json','w'),indent=1)
print(json.dumps(dict(iso=iso,wordmark=wm),indent=1))
