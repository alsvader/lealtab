"""Rasterizado y PDF con Chrome headless (Skia). Un proceso por archivo, en paralelo."""
import subprocess, os, tempfile, shutil
from concurrent.futures import ThreadPoolExecutor
CH=['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars','--force-device-scale-factor=1']
def _png(job):
    svg,w,h,out=job; d=tempfile.mkdtemp(prefix='lt-')
    html=os.path.join(d,'r.html')
    open(html,'w').write(f'<html><body style="margin:0;background:transparent"><img src="file://{svg}" width="{w}" height="{h}" style="display:block"></body></html>')
    subprocess.run(CH+[f'--user-data-dir={d}/u',f'--window-size={max(w,64)},{max(h,64)}','--default-background-color=00000000',
                   '--virtual-time-budget=3000',f'--screenshot={d}/s.png','file://'+html],check=True,capture_output=True)
    from PIL import Image
    Image.open(f'{d}/s.png').convert('RGBA').crop((0,0,w,h)).save(out,optimize=False)
    shutil.rmtree(d,ignore_errors=True); return out
def render_png(jobs,workers=6):
    with ThreadPoolExecutor(workers) as ex: return list(ex.map(_png,jobs))
def pdf(svg_text,w_mm,h_mm,out):
    d=tempfile.mkdtemp(prefix='ltpdf-'); html=os.path.join(d,'p.html')
    body=svg_text[svg_text.index('<svg'):]
    body=body.replace('<svg ','<svg style="display:block;width:100%;height:100%" preserveAspectRatio="xMidYMid meet" ',1)
    open(html,'w').write(f'<html><head><style>@page{{size:{w_mm}mm {h_mm}mm;margin:0}}html,body{{margin:0;width:{w_mm}mm;height:{h_mm}mm;overflow:hidden}}</style></head><body>{body}</body></html>')
    subprocess.run(CH+[f'--user-data-dir={d}/u','--no-pdf-header-footer',f'--print-to-pdf={out}','file://'+html],check=True,capture_output=True)
    shutil.rmtree(d,ignore_errors=True)
