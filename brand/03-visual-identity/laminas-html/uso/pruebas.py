"""Pruebas reales de tamaño: renderiza cada versión (Chrome/Skia, 1×) a varios anchos sobre lino."""
import sys; sys.path.insert(0,'../iconos')
from render import render_many
from PIL import Image
S='/workspace/lealtab/03-visual-identity/logo/sistema/'; P='/workspace/lealtab/03-visual-identity/logo/iconos/pixel/'
V={'horizontal':(S+'lealtab-horizontal-noche.svg',810.31/188,[48,64,72,80,96,112,128]),
   'vertical':(S+'lealtab-vertical-noche.svg',396.1125/325.945,[32,40,48,56,64,80]),
   'wordmark':(S+'lealtab-wordmark-noche.svg',528.15/134.27,[32,40,48,56,64,80]),
   'isotipo':(S+'lealtab-isotipo-noche.svg',222/188,[12,16,20,24,32])}
items=[];meta=[]
for k,(f,ar,ws) in V.items():
    for w in ws:
        h=round(w/ar); out=f'/tmp/prueba-{k}-{w}.png'; items.append((f,w,h,out)); meta.append((k,w,h,out))
for n in (16,24,32): items.append((P+f'lealtab-isotipo-{n}px.svg',n,n,f'/tmp/prueba-pix-{n}.png')); meta.append(('pix',n,n,f'/tmp/prueba-pix-{n}.png'))
render_many(items)
# hoja de inspección: cada render ×4 vecino más cercano, sobre lino
Z=4; rows={}
for k,w,h,out in meta: rows.setdefault(k,[]).append((w,h,out))
W=1800; y=10; sheet=Image.new('RGB',(W,2000),(243,239,230))
for k,lst in rows.items():
    x=10; mh=0
    for w,h,out in lst:
        im=Image.open(out).convert('RGBA'); bg=Image.new('RGBA',im.size,(243,239,230,255)); bg.alpha_composite(im)
        big=bg.resize((w*Z,h*Z),Image.NEAREST)
        if x+w*Z>W: x=10; y+=mh+12; mh=0
        sheet.paste(big,(x,y)); sheet.paste(bg,(x,y+h*Z+4)); x+=w*Z+16; mh=max(mh,h*Z+h+8)
    y+=mh+20
sheet.crop((0,0,W,y)).save('/tmp/pruebas-hoja.png'); print(y)
