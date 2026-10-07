import re
N='#0F2A22'
def sh(g,dx=6,dy=6):
    s=re.sub(r'fill="(?!none)[^"]*"','fill="%s"'%N,g)
    s=re.sub(r'stroke="[^"]*"','stroke="%s"'%N,s)
    return f'<g transform="translate({dx} {dy})">{s}</g>{g}'
st='stroke="#0F2A22" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"'
# --- illustration objects
scissors=f'''<g transform="translate(30 30) scale(1.15)">
<path d="M40 44 L72 66" stroke="#0F2A22" stroke-width="12" stroke-linecap="round"/><path d="M40 44 L72 66" stroke="#0F4D3A" stroke-width="6" stroke-linecap="round"/>
<path d="M40 92 L72 66" stroke="#0F2A22" stroke-width="12" stroke-linecap="round"/><path d="M40 92 L72 66" stroke="#0F4D3A" stroke-width="6" stroke-linecap="round"/>
<path d="M66 72 L176 28 L180 38 L72 82 Z" fill="#F3EFE6" {st}/>
<path d="M66 60 L176 104 L172 114 L60 70 Z" fill="#F3EFE6" {st}/>
<circle cx="30" cy="38" r="20" fill="#0F4D3A" {st}/><circle cx="30" cy="38" r="9" fill="#CFE3D6" {st}/>
<circle cx="30" cy="98" r="20" fill="#0F4D3A" {st}/><circle cx="30" cy="98" r="9" fill="#CFE3D6" {st}/>
<circle cx="68" cy="66" r="6" fill="#FF9F6E" {st}/></g>'''
comb=f'''<g transform="translate(110 168)"><rect x="0" y="0" width="190" height="26" rx="6" fill="#FF9F6E" {st}/>
'''+''.join(f'<path d="M{12+i*12} 26 L{12+i*12} 50" {st} fill="none"/>' for i in range(15))+'</g>'
razor=f'''<g transform="translate(205 40) rotate(25)"><rect x="0" y="0" width="34" height="110" rx="12" fill="#0F4D3A" {st}/><path d="M34 6 L80 -10 L84 30 L34 34 Z" fill="#F3EFE6" {st}/><circle cx="17" cy="16" r="5" fill="#CFE3D6" {st}/></g>'''
barber_ill=sh(scissors)+sh(comb)

dryer=f'''<g transform="translate(30 50)"><rect x="70" y="40" width="70" height="38" rx="8" fill="#0F4D3A" {st}/><rect x="40" y="80" width="32" height="96" rx="12" transform="rotate(-12 56 128)" fill="#0F4D3A" {st}/><circle cx="60" cy="60" r="48" fill="#FF9F6E" {st}/><circle cx="60" cy="60" r="20" fill="#F3EFE6" {st}/><path d="M48 60 h24 M60 48 v24" {st} fill="none"/></g>'''
mirror=f'''<g transform="translate(200 40)"><rect x="34" y="96" width="22" height="90" rx="9" fill="#FF9F6E" {st}/><circle cx="45" cy="60" r="48" fill="#F3EFE6" {st}/><circle cx="45" cy="60" r="36" fill="#CFE3D6" {st}/><path d="M26 44 Q34 30 50 28" stroke="#F3EFE6" stroke-width="5" fill="none" stroke-linecap="round"/></g>'''
polish=f'''<g transform="translate(150 175)"><rect x="12" y="0" width="22" height="30" rx="4" fill="#0F2A22" {st}/><rect x="0" y="26" width="46" height="46" rx="12" fill="#0F4D3A" {st}/><rect x="10" y="38" width="10" height="20" rx="4" fill="#CFE3D6"/></g>'''
estet_ill=sh(dryer)+sh(mirror)+sh(polish)

cup=f'''<g transform="translate(46 14) scale(.9)"><rect x="70" y="-6" width="14" height="80" rx="4" transform="rotate(12 77 34)" fill="#0F4D3A" {st}/>
<path d="M20 60 L120 60 L108 230 L32 230 Z" fill="#F3EFE6" {st}/><path d="M24 116 L116 116 L108 230 L32 230 Z" fill="#CFE3D6" {st}/>
<path d="M12 60 Q70 18 128 60 Z" fill="#F3EFE6" {st}/>
<g fill="#0F2A22"><circle cx="50" cy="214" r="9"/><circle cx="70" cy="218" r="9"/><circle cx="90" cy="213" r="9"/><circle cx="60" cy="198" r="9"/><circle cx="80" cy="197" r="9"/></g></g>'''
phone=f'''<g transform="translate(205 70) rotate(10)"><rect x="0" y="0" width="84" height="150" rx="16" fill="#F3EFE6" {st}/><rect x="12" y="28" width="60" height="60" rx="6" fill="#FFFDF8" {st}/>
<rect x="18" y="34" width="16" height="16" fill="#0F2A22"/><rect x="50" y="34" width="16" height="16" fill="#0F2A22"/><rect x="18" y="66" width="16" height="16" fill="#0F2A22"/><rect x="44" y="60" width="8" height="8" fill="#0F2A22"/><rect x="56" y="72" width="10" height="10" fill="#0F2A22"/>
<rect x="12" y="102" width="60" height="18" rx="5" fill="#FF9F6E" {st}/></g>'''
tapi_ill=sh(cup)+sh(phone)

# --- photo placeholders (flat tones)
def frame_marks():
    return '''<g stroke="#FFFDF8" stroke-width="1.5" stroke-dasharray="5 5" opacity=".8"><path d="M100 0 V270 M200 0 V270 M0 90 H300 M0 180 H300"/></g>
<g stroke="#FFFDF8" stroke-width="3" fill="none"><path d="M10 28 V10 H28 M272 10 H290 V28 M290 242 V260 H272 M28 260 H10 V242"/></g>'''
barb_ph=f'''<rect width="300" height="270" fill="#CDBFA8"/><polygon points="0,0 140,0 60,270 0,270" fill="#DCD0BC"/>
<rect x="18" y="34" width="86" height="150" rx="6" fill="#B9C6BE" stroke="#3B3229" stroke-width="3"/>
<rect x="30" y="190" width="70" height="80" rx="8" fill="#6B4E3D"/>
<circle cx="205" cy="92" r="32" fill="#3B3229"/><path d="M130 270 Q130 150 205 140 Q280 150 280 270 Z" fill="#3B3229"/>
<rect x="148" y="176" width="114" height="34" rx="16" fill="#54463A"/>
{frame_marks()}'''
est_ph=f'''<rect width="300" height="270" fill="#D8C7B4"/><polygon points="300,0 170,0 250,270 300,270" fill="#E6D9C8"/>
<ellipse cx="150" cy="110" rx="92" ry="100" fill="#C3CEC6" stroke="#3B3229" stroke-width="3"/>
<circle cx="150" cy="92" r="28" fill="#5E4A3C"/><path d="M95 200 Q100 135 150 128 Q200 135 205 200 Z" fill="#5E4A3C"/>
<rect x="0" y="212" width="300" height="58" fill="#8C6A52"/>
<rect x="40" y="176" width="22" height="38" rx="5" fill="#FF9F6E"/><rect x="70" y="186" width="18" height="28" rx="5" fill="#CFE3D6"/><rect x="226" y="172" width="26" height="42" rx="6" fill="#0F4D3A"/>
{frame_marks()}'''
tap_ph=f'''<rect width="300" height="270" fill="#C7B9A3"/><rect x="30" y="20" width="140" height="190" fill="#F4ECDD"/>
<path d="M62 70 L138 70 L128 230 L72 230 Z" fill="#9BC4AE" opacity=".9"/><path d="M56 70 Q100 40 144 70 Z" fill="#E8EFE9"/>
<g fill="#2E2621"><circle cx="86" cy="220" r="7"/><circle cx="100" cy="223" r="7"/><circle cx="114" cy="219" r="7"/></g>
<rect x="0" y="230" width="300" height="40" fill="#7D5E48"/>
<g transform="translate(200 90) rotate(-8)"><rect width="64" height="112" rx="12" fill="#2E2621"/><rect x="8" y="16" width="48" height="70" rx="4" fill="#F3EFE6"/></g>
<path d="M300 150 Q240 160 228 200 L250 270 L300 270 Z" fill="#8A6650"/>
{frame_marks()}'''
cut=sh('''<g transform="translate(30 40) scale(.8)"><circle cx="150" cy="78" r="38" fill="#3B3229" stroke="#F3EFE6" stroke-width="12" paint-order="stroke"/><path d="M60 270 Q62 140 150 128 Q238 140 240 270 Z" fill="#3B3229" stroke="#F3EFE6" stroke-width="12" paint-order="stroke"/></g>''',8,8)

def photo(svg,title,notes):
    lis=''.join(f'<li><b>{a}</b> {b}</li>' for a,b in notes)
    return f'''<div class="ph"><div class="pic"><svg viewBox="0 0 300 270" preserveAspectRatio="xMidYMid slice">{svg}</svg><span class="ptag">[ foto propia ]</span></div>
<div class="pt disp">{title}</div><ul>{lis}</ul></div>'''

html=f'''<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Manrope:wght@400;500;600;700;800&display=block" rel="stylesheet">
<link rel="stylesheet" href="ciclo-v2.css">
<style>
.wrap{{padding:38px 40px;height:1000px;display:flex;flex-direction:column;gap:20px}}
.head{{display:flex;justify-content:space-between;align-items:flex-end}}
h1{{font-size:54px;line-height:.86;text-transform:uppercase}}
.sec{{display:flex;align-items:center;gap:12px}}
.sec h2{{font-size:24px;text-transform:uppercase}}
.sec p{{font-size:12.5px;color:#2E4A40}}
.row{{display:grid;grid-template-columns:repeat(4,1fr);gap:22px}}
.ph{{display:flex;flex-direction:column;gap:7px}}
.pic{{border:var(--b);border-radius:14px;box-shadow:5px 5px 0 var(--noche);overflow:hidden;height:282px;position:relative}}
.pic svg{{width:100%;height:100%;display:block}}
.ptag{{position:absolute;right:10px;top:10px;font-size:9.5px;font-weight:800;letter-spacing:.1em;background:var(--claro);border:1.5px solid var(--noche);border-radius:5px;padding:2px 6px}}
.pt{{font-size:19px;text-transform:uppercase;margin-top:4px}}
.ph ul{{list-style:none;display:flex;flex-direction:column;gap:2px;font-size:11.5px;line-height:1.38;color:#2E4A40}}
.ph b{{color:var(--noche)}}
.il{{border:var(--b);border-radius:14px;box-shadow:5px 5px 0 var(--noche);overflow:hidden;height:304px;position:relative}}
.il svg{{width:100%;height:100%;display:block}}
.ilc{{display:flex;flex-direction:column;gap:7px}}
.ilc p{{font-size:11.5px;line-height:1.38;color:#2E4A40}}
.av{{padding:18px 20px;background:var(--claro);display:flex;flex-direction:column;gap:12px}}
.av div{{display:flex;align-items:center;gap:10px;font-size:12.5px;font-weight:600}}
.av i{{font-style:normal;width:22px;height:22px;border:2px solid #A8461A;border-radius:6px;display:grid;place-items:center;color:#A8461A;font-weight:800;font-size:13px;flex:none}}
</style></head><body><div class="wrap">
<div class="head"><div><div class="lbl" style="margin-bottom:8px">LealTab · Fase 2 · Moodboard 2 de 3</div><h1 class="disp">Fotografía e ilustración</h1></div>
<div style="font-size:12.5px;max-width:560px;text-align:right;line-height:1.45;color:#2E4A40">Las fotos son placeholders con notas de dirección: toda la fotografía será producción propia con los negocios del piloto en Villahermosa. La ilustración es plana, con contorno, sombra dura y objetos de oficio.</div></div>
<div class="sec"><h2 class="disp">Fotografía</h2><p>Luz natural cálida · encuadre cercano y honesto · una sola idea por foto · el gesto de regresar</p></div>
<div class="row">
{photo(barb_ph,"Barbería · retrato",[("Encuadre:","medio cuerpo, ojos en el tercio superior, brazos cruzados."),("Luz:","de la puerta, lateral izquierda, de tarde."),("Espacio:","espejo a un lado; aire para el titular.")])}
{photo(est_ph,"Estética · tocador",[("Encuadre:","la clienta frente al espejo, de frente o en reflejo."),("Luz:","ventana lateral; sin flash."),("Color:","tonos naturales, negros llevados hacia noche.")])}
{photo(tap_ph,"Tapioca · mostrador",[("Encuadre:","el vaso a contraluz y la mano que escanea el QR."),("Luz:","ventana de fondo; los colores de la bebida, vivos."),("Gesto:","cliente joven, celular en la mano, sin posar.")])}
<div class="ph"><div class="pic" style="background:var(--durazno)"><svg viewBox="0 0 300 270" preserveAspectRatio="xMidYMid slice">{cut}</svg>
<span class="stk" style="position:absolute;left:14px;top:16px;background:var(--claro);transform:rotate(-5deg);font-size:13px">Don Chuy · 12 años</span></div>
<div class="pt disp">Recorte sobre color plano</div><ul><li><b>Borde:</b> lino de 6 a 8 px, como sticker, y sombra dura en marketing.</li><li><b>Fondo:</b> bosque, durazno o menta; un recorte por pieza.</li><li><b>Uso:</b> redes, mostrador, casos de clientes.</li></ul></div>
</div>
<div class="sec" style="margin-top:4px"><h2 class="disp">Ilustración</h2><p>Plana, tipo papel recortado · contorno noche de 3 px · sombra dura · solo las 5 tintas · objetos antes que personajes</p></div>
<div class="row">
<div class="ilc"><div class="il" style="background:var(--menta)"><svg viewBox="0 0 340 250">{barber_ill}</svg></div><p><b>Barbería:</b> tijeras y peine. Formas geométricas y extremos redondeados.</p></div>
<div class="ilc"><div class="il grain" style="background:var(--lino)"><svg viewBox="0 0 340 250">{estet_ill}</svg></div><p><b>Estética:</b> secadora, espejo y esmalte. Grano de papel sutil, solo en marketing.</p></div>
<div class="ilc"><div class="il" style="background:var(--durazno)"><svg viewBox="0 0 340 250">{tapi_ill}</svg></div><p><b>Tapioca:</b> vaso con perlas y el celular escaneando. El QR se dibuja simplificado.</p></div>
<div class="ilc"><div class="il av"><div class="disp" style="font-size:20px;text-transform:uppercase;font-weight:800">Evitar</div>
<div><i>×</i>Fotos de stock y sonrisas forzadas</div><div><i>×</i>Mascotas, robots y emojis gigantes</div><div><i>×</i>3D brillante, degradados y vidrio</div><div><i>×</i>Tarjetas de plástico o de sellos</div><div><i>×</i>Monedas, regalos, cohetes y planetas</div><div><i>×</i>Ilustración infantil o kawaii</div></div>
<p>Las personas se ilustran solo como siluetas simples; la diversidad real la pone la foto.</p></div>
</div>
</div></body></html>'''
open('moodboard-2-foto-ilustracion.html','w').write(html)
