"""ICO multirresolución, prueba de máscara del maskable y ampliaciones con rejilla."""
import shutil, math, json, struct, io
import numpy as np
from PIL import Image, ImageDraw
from geo import iso_d, flatten
from pixfit import SPECS
OUT='/workspace/lealtab/03-visual-identity/logo/iconos/'
NOCHE,LINO,BLANCO,DUR,GRID=(15,42,34),(243,239,230),(255,253,248),(255,159,110),(216,207,191)
res={}
# --- ICO: un frame PNG por tamaño, cada uno es el pixel-fit renderizado (no se reescala) ----------
def write_ico(frames,path):
    data=[]; 
    for im in frames:
        b=io.BytesIO(); im.save(b,'PNG'); data.append(b.getvalue())
    hdr=struct.pack('<HHH',0,1,len(frames)); off=6+16*len(frames); ent=b''
    for im,d in zip(frames,data):
        ent+=struct.pack('<BBBBHHII',im.width%256,im.height%256,0,0,1,32,len(d),off); off+=len(d)
    open(path,'wb').write(hdr+ent+b''.join(data))
FAVDIR={'a':OUT+'favicon/descartado/opcion-a/','b':OUT+'favicon/'}
for opt in ('a','b'):
    frames=[Image.open(f'/tmp/fav-{opt}-{n}.png').convert('RGBA') for n in (16,32,48)]
    write_ico(frames,FAVDIR[opt]+f'favicon.ico')
    for n,im in zip((16,32,48),frames): im.save(FAVDIR[opt]+f'favicon-{n}.png')
    ico=Image.open(FAVDIR[opt]+f'favicon.ico'); sizes=sorted(ico.info.get('sizes',[]))
    chk={}
    for n,im in zip((16,32,48),frames):
        ico.size=(n,n); fr=ico.copy().convert('RGBA') if False else Image.open(FAVDIR[opt]+f'favicon.ico')
        fr.size=(n,n); fr.load(); chk[n]=bool(np.array_equal(np.array(fr.convert('RGBA')),np.array(im)))
    res[f'favicon-{opt}.ico']={'tamaños':[list(s) for s in sizes],'frames_identicos_a_pixel_fit':chk}
# --- Maskable: máscara circular del 80 % (zona segura mínima) y del 100 % --------------------
m=np.array(Image.open(OUT+'pwa/lealtab-pwa-maskable-512.png').convert('RGB')).astype(int)
diff=np.abs(m-np.array(NOCHE)).sum(2)>12          # píxeles que no son fondo (isotipo + AA)
ys,xs=np.nonzero(diff); r=np.hypot(xs+0.5-256,ys+0.5-256)
rmax=float(r.max()); res['maskable']={'radio_max_isotipo_px':round(rmax,2),'radio_zona_segura_px':204.8,
  'holgura_px':round(204.8-rmax,2),'porcentaje_de_zona_segura':round(rmax/204.8*100,1),'se_recorta':bool(rmax>204.8)}
src=Image.open(OUT+'pwa/lealtab-pwa-maskable-512.png').convert('RGBA')
panel=Image.new('RGBA',(512*3+80,512+40),BLANCO+(255,))
for i,(rad,lab) in enumerate([(None,'sin máscara'),(256,'círculo 100 %'),(204.8,'círculo 80 % (zona segura)')]):
    im=src.copy()
    if rad:
        ss=4; mk=Image.new('L',(512*ss,512*ss),0); ImageDraw.Draw(mk).ellipse([(256-rad)*ss,(256-rad)*ss,(256+rad)*ss,(256+rad)*ss],fill=255)
        im.putalpha(mk.resize((512,512),Image.LANCZOS))
    panel.alpha_composite(im,(20+i*(512+20),20))
d=ImageDraw.Draw(panel)
for k in range(0,360,6):  # zona segura punteada sobre el primero
    a1,a2=math.radians(k),math.radians(k+3); d.arc([20+256-204.8,20+256-204.8,20+256+204.8,20+256+204.8],k,k+3,fill=DUR,width=3)
panel.save(OUT+'pwa/lealtab-pwa-maskable-512-prueba-mascara.png')
# --- Ampliaciones 800 % con rejilla + contorno de referencia del congelado ------------------
FD=list(iso_d().values())
def zoom(N,Z,path,overlay=True):
    im=Image.open(OUT+f'pixel/lealtab-isotipo-{N}px.png').convert('RGBA')
    bg=Image.new('RGBA',(N,N),BLANCO+(255,)); bg.alpha_composite(im); big=bg.resize((N*Z,N*Z),Image.NEAREST).convert('RGB')
    ss=3; big=big.resize((N*Z*ss,N*Z*ss),Image.NEAREST); d=ImageDraw.Draw(big)
    for k in range(N+1):
        w=1*ss; d.line([(k*Z*ss,0),(k*Z*ss,N*Z*ss)],fill=GRID,width=w); d.line([(0,k*Z*ss),(N*Z*ss,k*Z*ss)],fill=GRID,width=w)
    if overlay:
        s=SPECS[N]; k=(s['x1']-s['x0'])/222; oy=s['y0']+((s['y1']-s['y0'])-188*k)/2
        for dd in FD:
            for p in flatten(dd):
                pts=[((s['x0']+x*k)*Z*ss,(oy+y*k)*Z*ss) for x,y in p]; d.line(pts+[pts[0]],fill=DUR,width=int(1.5*ss),joint='curve')
    big=big.resize((N*Z,N*Z),Image.LANCZOS)
    out=Image.new('RGB',(N*Z+2,N*Z+2),NOCHE); out.paste(big,(1,1)); out.save(path)
for N in SPECS:
    zoom(N,8,OUT+f'pixel/lealtab-isotipo-{N}px-800.png')
    zoom(N,6,f'/tmp/zoom6-{N}.png')
json.dump(res,open('/tmp/post-res.json','w'),indent=1,ensure_ascii=False); print(json.dumps(res,ensure_ascii=False,indent=1))
