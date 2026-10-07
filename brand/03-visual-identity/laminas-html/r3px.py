"""Rasteriza el símbolo A de 16 px con píxeles alineados (Chrome) para mostrar el zoom de píxeles."""
import subprocess, base64, io
from PIL import Image
from r3geo import svg
def raster16(fill,bg,name):
    html=f'<html><body style="margin:0;background:{bg}">{svg("PX16",fill,16)}</body></html>'
    open(f'/tmp/{name}.html','w').write(html)
    subprocess.run(['google-chrome','--headless=new','--no-sandbox','--disable-gpu','--hide-scrollbars','--force-device-scale-factor=1','--window-size=200,200',f'--screenshot=/tmp/{name}.png',f'file:///tmp/{name}.html'],capture_output=True)
    im=Image.open(f'/tmp/{name}.png').convert('RGB').crop((0,0,16,16))
    b=io.BytesIO(); im.save(b,'PNG'); return 'data:image/png;base64,'+base64.b64encode(b.getvalue()).decode(), im
if __name__=='__main__':
    u,im=raster16('#0F4D3A','#F3EFE6','px'); im.resize((320,320),Image.NEAREST).save('/workspace/tmp/px16.png'); print('ok')
