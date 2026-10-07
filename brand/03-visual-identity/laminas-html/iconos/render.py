"""Rasteriza varios SVG con Chrome (Skia) a tamaño exacto en una sola captura y recorta cada uno."""
import subprocess, os, tempfile
from PIL import Image
def render_many(items, tmpdir='/tmp/lealtab-render'):
    """items: lista de (svg_path, w, h, png_out). Fondo transparente."""
    os.makedirs(tmpdir,exist_ok=True)
    x=y=0; rowh=0; W=2200; pos=[]
    for svg,w,h,out in items:
        if x+w>W: x=0; y+=rowh+8; rowh=0
        pos.append((x,y)); x+=w+8; rowh=max(rowh,h)
    H=y+rowh+8
    html='<html><body style="margin:0;background:transparent">'+''.join(
        f'<img src="file://{svg}" width="{w}" height="{h}" style="position:absolute;left:{px}px;top:{py}px">'
        for (svg,w,h,_),(px,py) in zip(items,pos))+'</body></html>'
    hp=os.path.join(tmpdir,'r.html'); open(hp,'w').write(html); shot=os.path.join(tmpdir,'r.png')
    subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars',
        '--force-device-scale-factor=1',f'--window-size={W},{H}','--default-background-color=00000000',
        '--virtual-time-budget=4000',f'--screenshot={shot}','file://'+hp],check=True,capture_output=True)
    im=Image.open(shot).convert('RGBA')
    for (svg,w,h,out),(px,py) in zip(items,pos):
        im.crop((px,py,px+w,py+h)).save(out)
def render_one(svg,w,h,out):
    d='/tmp/lealtab-render1'; os.makedirs(d,exist_ok=True)
    subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars',
        '--force-device-scale-factor=1',f'--window-size={w},{h}','--default-background-color=00000000',
        '--virtual-time-budget=8000',f'--screenshot={out}','file://'+svg],check=True,capture_output=True)
