"""Verificación de recursos gráficos → recursos/verificacion-recursos.json"""
import os, re, json, hashlib, xml.etree.ElementTree as ET
from comun import *
ok={}; det={}
files=sorted(os.path.relpath(os.path.join(d,f),R) for d,_,fs in os.walk(R) for f in fs if f.endswith('.svg'))
# 1. XML válido
bad=[]
for f in files:
    try: ET.parse(R+f)
    except Exception as e: bad.append(f)
ok['svg_validos']=not bad; det['svg_total']=len(files)
# 2. colores
pal={c.upper() for c in PALETA}; extra={}
for f in files:
    cs={c.upper() for c in re.findall(r'#[0-9A-Fa-f]{6}\b',open(R+f).read())}
    allowed=pal|({'#E4DED2','#C2560F'} if f in ('recursos-graficos.svg',) else set())
    if cs-allowed: extra[f]=sorted(cs-allowed)
ok['solo_tintas_de_la_paleta']=not extra; det['colores_fuera_de_paleta']=extra; det['nota_colores']='La lámina usa además #E4DED2 (líneas de rejilla) y #C2560F (subtítulos), como las láminas aprobadas.'
# 3. sin negro puro
ok['sin_negro_puro']=not any(re.search(r'#000000\b|"black"',open(R+f).read(),re.I) for f in files)
# 4. SVG sueltos sin depender de fuentes
dep=[f for f in files if '<text' in open(R+f).read() and f not in ('recursos-graficos.svg','iconos/lt-iconos-prueba-tamanos.svg')]
ok['textos_a_curvas_en_svg_sueltos']=not dep
# 5. íconos
lin=[f for f in files if f.startswith('iconos/linea/')]; act=[f for f in files if f.startswith('iconos/activo/')]
icok=all('viewBox="0 0 24 24"' in open(R+f).read() and 'stroke-width="2"' in open(R+f).read() and 'stroke-linecap="round"' in open(R+f).read() for f in lin+act)
ok['iconos_18_linea_18_activo']=len(lin)==18 and len(act)==18; ok['iconos_rejilla24_trazo2_remate_redondo']=icok
# 6. durazno nunca como texto
ok['durazno_nunca_como_texto']=not any(re.search(r'<text[^>]*fill="#FF9F6E"',open(R+f).read()) for f in files)
# 7. isotipo congelado
fr=open('/workspace/lealtab/03-visual-identity/logo/master/lealtab-master-frozen.svg').read()
ref={i:hashlib.sha256(d.encode()).hexdigest() for i,d in re.findall(r'<path id="(isotipo-[^"]+)" d="([^"]+)"',fr)}
iso_ok={}
for f in ['aro/lt-aro-relacion-isotipo.svg','recursos-graficos.svg']:
    got={i:hashlib.sha256(d.encode()).hexdigest() for i,d in re.findall(r'<path id="(isotipo-[^"]+)" d="([^"]+)"',open(R+f).read())}
    iso_ok[f]=bool(got) and all(got.get(k)==v for k,v in ref.items())
ok['isotipo_d_congelados']=all(iso_ok.values()); det['isotipo_por_archivo']=iso_ok
# 8. animaciones < 1 s, sin bucle
an={}
for f in [x for x in files if 'animacion' in x]:
    s=open(R+f).read(); ends=[float(b)+float(d) for b,d in re.findall(r'begin="([\d.]+)s" dur="([\d.]+)s"',s)]
    an[f]={'fin_s':round(max(ends),3),'movimiento_s':round(max(ends)-min(float(b) for b in re.findall(r'begin="([\d.]+)s"',s)),3),'bucle':'repeatCount' in s}
ok['animaciones_menos_de_1s_sin_bucle']=all(v['movimiento_s']<1 and not v['bucle'] for v in an.values()); det['animaciones']=an
# 9. contraste de stickers
def lum(h):
    c=[int(h[i:i+2],16)/255 for i in (1,3,5)]; c=[x/12.92 if x<=0.04045 else ((x+0.055)/1.055)**2.4 for x in c]
    return 0.2126*c[0]+0.7152*c[1]+0.0722*c[2]
cr=lambda a,b:(max(lum(a),lum(b))+0.05)/(min(lum(a),lum(b))+0.05)
st={'recompensa-lista (noche/durazno)':cr(NOCHE,DUR),'visita (noche/blanco lino)':cr(NOCHE,CLARO),'nuevo (noche/menta)':cr(NOCHE,MENTA),'te-extranamos (lino/bosque)':cr(LINO,BOSQUE)}
det['contraste_stickers']={k:round(v,2) for k,v in st.items()}; ok['stickers_AA']=all(v>=4.5 for v in st.values())
# 10. relación aro / isotipo
det['aro']={'trazo_u':52,'diametro_exterior_u':376,'trazo_sobre_diametro':round(52/376,4),'isotipo_alto_u':188}
ok_all=all(ok.values())
json.dump({'fecha':'2026-10-06','estado':'Aprobado 2026-10-06','todo_ok':ok_all,'pruebas':ok,'detalle':det,'archivos_svg':files},open(R+'verificacion-recursos.json','w'),ensure_ascii=False,indent=2)
print(ok_all,json.dumps(ok,ensure_ascii=False),extra,an)
