#!/usr/bin/env python3
"""LealTab · Perfil de Instagram @getlealtab — genera los HTML de destacados,
la hoja de destacados, la vista de avatares y el mockup del perfil.
Fuente única: editar aquí y correr `bash render.sh` (llama a este script)."""
import pathlib, re, unicodedata

HERE = pathlib.Path(__file__).resolve().parent
VI = "../../../03-visual-identity"
ICONOS = HERE.parents[2] / "03-visual-identity/recursos/iconos/activo"
KIT = "../../kit-redes/34"  # versión 3:4 (1080×1440)
AV = f"{VI}/logo/entregables/redes"

LINO, BLANCO, NOCHE, BOSQUE, MENTA, DURAZNO, GRIS = (
    "#F3EFE6", "#FFFDF8", "#0F2A22", "#0F4D3A", "#CFE3D6", "#FF9F6E", "#4D635A")

# ---------------------------------------------------------------- contenido
NOMBRE = "LealTab · Tarjeta de lealtad digital"
CATEGORIA = "Software"
BIO = ("Haz que tus clientes siempre regresen.\n"
       "Tu tarjeta de lealtad digital, siempre a un toque y sin descargar nada.\n"
       "Prueba gratis 30 días ↓")
LINK = "lealtab.com"

# (archivo, nombre visible ≤15, ícono aprobado)
DESTACADOS = [
    ("01-3-pasos",   "3 pasos",   "visita"),
    ("02-negocios",  "Negocios",  "negocio"),
    ("03-precios",   "Precios",   "calendario"),
    ("04-instalar",  "Instalar",  "escanear"),
    ("05-preguntas", "Preguntas", "mensaje"),
    ("06-piloto",    "Piloto",    "ubicacion"),
]

# Cuadrícula: 3 fijados + resto del más nuevo al más viejo. None = espacio libre.
GRID = [
    ("01-lema", True), ("03-como-funciona", True), ("07-prueba-30", True),
    ("06-tapioca", False), ("05-estetica", False), ("04-barberia", False),
    ("02-adios-carton", False), None, None,
]

assert len(unicodedata.normalize("NFC", BIO)) <= 150
assert all(len(n) <= 15 for _, n, _ in DESTACADOS)

FONTS = ('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?'
         'family=Archivo:wdth,wght@75,700;75,800&family=Manrope:wght@400;500;600;700;800&display=swap">')

def icono(nombre, trazo=LINO, relleno=MENTA):
    """SVG aprobado (activo) recoloreado para fondo bosque: trazo lino, relleno menta."""
    svg = (ICONOS / f"lt-icono-{nombre}-activo.svg").read_text()
    svg = re.sub(r"<title>.*?</title><desc>.*?</desc>", "", svg)
    svg = svg.replace('stroke="#0F2A22"', f'stroke="{trazo}"').replace('fill="#CFE3D6"', f'fill="{relleno}"')
    svg = re.sub(r'width="24" height="24"', 'width="100%" height="100%"', svg, count=1)
    return svg

def page(body, css, w, h, title):
    return f"""<!DOCTYPE html>
<html lang="es-MX"><head><meta charset="utf-8"><title>{title}</title>{FONTS}
<style>
*,*::before,*::after{{box-sizing:border-box;margin:0;padding:0}}
html,body{{width:{w}px;height:{h}px;overflow:hidden}}
body{{font-family:Manrope,system-ui,sans-serif;color:{NOCHE}}}
.disp{{font-family:Archivo,"Arial Narrow",sans-serif;font-weight:800;font-stretch:condensed;
  font-variation-settings:"wdth" 75,"wght" 800;letter-spacing:-0.01em;line-height:.95}}
{css}
</style></head><body>
{body}
</body></html>
"""

# ---------------------------------------------------------------- portadas
COVER_CSS = f"""
.cover{{width:1080px;height:1920px;background:{BOSQUE};position:relative}}
.icon{{position:absolute;left:50%;top:50%;width:540px;height:540px;transform:translate(-50%,-50%)}}
"""
def portada(icon):
    body = f'<div class="cover"><div class="icon">{icono(icon)}</div></div>'
    return page(body, COVER_CSS, 1080, 1920, "Portada destacado")

# ---------------------------------------------------------------- hoja de destacados
def hoja():
    def fila(modo):
        bg, fg, ring = ("#FFFFFF", "#000000", "#DBDBDB") if modo == "claro" else ("#000000", "#F5F5F5", "#363636")
        items = "".join(
            f'<div class="hl"><div class="ring" style="border-color:{ring};background:{bg}">'
            f'<img src="../destacados/{f}.png"></div><span style="color:{fg}">{n}</span></div>'
            for f, n, _ in DESTACADOS)
        small = "".join(
            f'<div class="hl sm"><div class="ring" style="border-color:{ring};background:{bg}">'
            f'<img src="../destacados/{f}.png"></div><span style="color:{fg}">{n}</span></div>'
            for f, n, _ in DESTACADOS)
        return (f'<div class="panel" style="background:{bg}"><p class="lbl" style="color:{fg}">Modo {modo} · grande</p>'
                f'<div class="row">{items}</div>'
                f'<p class="lbl" style="color:{fg}">Modo {modo} · tamaño real aprox. (64 px)</p><div class="row">{small}</div></div>')
    css = f"""
body{{background:{LINO}}}
.head{{padding:56px 64px 24px}}
.head h1{{font-size:56px}} .head p{{font-size:24px;color:{GRIS};margin-top:12px;font-weight:500}}
.panel{{margin:24px 64px;border:3px solid {NOCHE};border-radius:14px;padding:32px 40px 40px;box-shadow:6px 6px 0 {NOCHE}}}
.lbl{{font-size:20px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.65;margin:8px 0 22px}}
.row{{display:flex;gap:40px;margin-bottom:28px}}
.hl{{display:flex;flex-direction:column;align-items:center;gap:14px;width:180px}}
.ring{{width:180px;height:180px;border-radius:50%;border:3px solid;padding:7px}}
.ring img{{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block}}
.hl span{{font-size:26px;font-weight:500;white-space:nowrap;font-family:system-ui,-apple-system,"Segoe UI",Roboto,Manrope,sans-serif}}
.hl.sm{{width:90px;gap:8px}} .hl.sm .ring{{width:72px;height:72px;border-width:1.5px;padding:3px}}
.hl.sm span{{font-size:13px}}
.foot{{padding:8px 64px;font-size:20px;color:{GRIS};font-weight:500}}
"""
    body = (f'<div class="head"><h1 class="disp">Destacados · @getlealtab</h1>'
            f'<p>Vista previa: así se ven las portadas recortadas en círculo, con su nombre debajo.</p></div>'
            f'{fila("claro")}{fila("oscuro")}'
            f'<p class="foot">Portadas 1080×1920 · fondo bosque · íconos aprobados (activo) en lino con relleno menta · Simulación, no captura real.</p>')
    return page(body, css, 1460, 1380, "Destacados preview")

# ---------------------------------------------------------------- avatares
def avatares():
    def bloque(color, titulo, nota):
        img = f"{AV}/lealtab-avatar-{color}-cuadrado-1080.png"
        def fila(bg, fg, modo):
            return (f'<div class="fila" style="background:{bg}">'
                    f'<img class="c" style="width:280px;height:280px" src="{img}">'
                    f'<div class="col"><img class="c" style="width:110px;height:110px" src="{img}"><span style="color:{fg}">110 px</span></div>'
                    f'<div class="col"><img class="c" style="width:40px;height:40px" src="{img}"><span style="color:{fg}">40 px</span></div>'
                    f'<div class="col"><div class="cmt"><img class="c" style="width:32px;height:32px" src="{img}">'
                    f'<b style="color:{fg}">getlealtab</b></div><span style="color:{fg}">32 px · comentario</span></div>'
                    f'<span class="modo" style="color:{fg}">{modo}</span></div>')
        return (f'<div class="blk"><h2 class="disp">{titulo}</h2><p class="nota">{nota}</p>'
                f'{fila("#FFFFFF", "#000", "Modo claro")}{fila("#000000", "#F5F5F5", "Modo oscuro")}</div>')
    css = f"""
body{{background:{LINO}}}
.head{{padding:56px 64px 8px}} .head h1{{font-size:56px}} .head p{{font-size:24px;color:{GRIS};margin-top:12px;font-weight:500}}
.wrap{{display:flex;gap:40px;padding:24px 64px}}
.blk{{flex:1;min-width:0;border:3px solid {NOCHE};border-radius:14px;box-shadow:6px 6px 0 {NOCHE};background:{BLANCO};padding:28px 28px 32px}}
.blk h2{{font-size:44px}} .nota{{font-size:20px;color:{GRIS};margin:8px 0 20px;font-weight:600}}
.fila{{display:flex;align-items:center;gap:30px;padding:24px 24px;border-radius:10px;margin-top:16px;position:relative;border:1.5px solid #DBDBDB}}
.c{{border-radius:50%;display:block;object-fit:cover}}
.col{{display:flex;flex-direction:column;align-items:center;gap:10px}}
.col span{{font-size:16px;font-weight:600;white-space:nowrap}}
.cmt{{display:flex;align-items:center;gap:8px;font-size:15px;white-space:nowrap}}
.modo{{position:absolute;top:12px;right:16px;font-size:15px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;opacity:.6}}
.rec{{display:inline-block;background:{MENTA};border:2.5px solid {NOCHE};border-radius:6px;box-shadow:3px 3px 0 {NOCHE};
 font-family:Archivo,sans-serif;font-weight:800;font-stretch:condensed;font-variation-settings:"wdth" 75,"wght" 800;
 font-size:18px;letter-spacing:.04em;text-transform:uppercase;padding:6px 12px;margin-left:12px;vertical-align:middle;transform:rotate(-3deg)}}
.foot{{padding:4px 64px;font-size:20px;color:{GRIS};font-weight:500}}
"""
    body = (f'<div class="head"><h1 class="disp">Avatar · @getlealtab</h1>'
            f'<p>Recorte circular como lo hace Instagram (se sube la versión cuadrada de 1080 px).</p></div>'
            f'<div class="wrap">'
            + bloque("noche", 'Noche <span class="rec">Recomendado</span>',
                     "lealtab-avatar-noche-cuadrado-1080.png · isotipo lino sobre noche")
            + bloque("lino", "Lino", "lealtab-avatar-lino-cuadrado-1080.png · isotipo noche sobre lino")
            + '</div><p class="foot">En modo claro el avatar lino casi se funde con el fondo blanco. En el noche, el isotipo lino resalta igual en modo claro y oscuro.</p>')
    return page(body, css, 1760, 1110, "Avatar preview")

# ---------------------------------------------------------------- mockup
def mockup():
    IG = 'font-family:system-ui,-apple-system,"Segoe UI",Roboto,Manrope,sans-serif'
    bio_html = BIO.replace("\n", "<br>")
    hl = "".join(
        f'<div class="hl"><div class="ring"><img src="../destacados/{f}.png"></div><span>{n}</span></div>'
        for f, n, _ in DESTACADOS)
    pin = ('<svg class="pin" viewBox="0 0 24 24"><path d="M15 3l6 6-3 1-4 4 1 5-2 2-4-4-5 5-1-1 5-5-4-4 2-2 5 1 4-4z" '
           'fill="#fff" stroke="rgba(0,0,0,.35)" stroke-width=".8" stroke-linejoin="round"/></svg>')
    tiles = ""
    for g in GRID:
        if g is None:
            tiles += '<div class="tile empty"><span>Espacio libre<br>(post 8 / 9)</span></div>'
        else:
            f, pinned = g
            tiles += f'<div class="tile"><img src="{KIT}/{f}.png">{pin if pinned else ""}</div>'
    link_svg = ('<svg viewBox="0 0 24 24" class="lk"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3'
                'a4 4 0 0 0 5.7 5.7l1-1" fill="none" stroke="#00376B" stroke-width="2.2" stroke-linecap="round"/></svg>')
    css = f"""
body{{background:#fff;{IG};color:#000}}
.label{{height:96px;background:{NOCHE};color:{LINO};display:flex;align-items:center;justify-content:space-between;padding:0 48px}}
.label b{{font-family:Archivo,sans-serif;font-weight:800;font-stretch:condensed;font-variation-settings:"wdth" 75,"wght" 800;font-size:36px;letter-spacing:.02em;white-space:nowrap}}
.label span{{font-family:Manrope,sans-serif;font-size:20px;white-space:nowrap;font-weight:600;color:{MENTA}}}
.status{{height:84px;display:flex;align-items:center;justify-content:space-between;padding:0 56px;font-size:34px;font-weight:600}}
.top{{height:120px;display:flex;align-items:center;padding:0 40px;gap:28px}}
.top .u{{font-size:46px;font-weight:700;flex:1}}
.ic{{width:60px;height:60px}}
.hdr{{display:flex;align-items:center;gap:44px;padding:12px 44px 0}}
.av{{width:250px;height:250px;border-radius:50%;flex-shrink:0;display:block}}
.hdr-r{{flex:1;display:flex;flex-direction:column;gap:22px}}
.name{{font-size:40px;font-weight:700;line-height:1.2}}
.stats{{display:flex;gap:56px}}
.stats div{{display:flex;flex-direction:column;font-size:33px;line-height:1.25}}
.stats b{{font-size:38px}}
.info{{padding:30px 44px 0;font-size:38px;line-height:1.36}}
.cat{{color:#737373}}
.link{{color:#00376B;font-weight:600;display:flex;align-items:center;gap:10px;margin-top:4px}}
.lk{{width:40px;height:40px}}
.btns{{display:flex;gap:16px;padding:36px 44px 0}}
.btn{{flex:1;height:92px;border-radius:22px;background:#EFEFEF;display:flex;align-items:center;justify-content:center;font-size:35px;font-weight:600}}
.btn.p{{background:#0095F6;color:#fff}}
.btn.sq{{flex:0 0 92px}}
.hls{{display:flex;gap:34px;padding:44px 44px 0;overflow:hidden;white-space:nowrap}}
.hl{{display:flex;flex-direction:column;align-items:center;gap:14px;flex:0 0 176px}}
.ring{{width:176px;height:176px;border-radius:50%;border:2.5px solid #DBDBDB;padding:7px}}
.ring img{{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block}}
.hl span{{font-size:32px}}
.tabs{{display:flex;margin-top:40px;border-top:1px solid #DBDBDB}}
.tabs div{{flex:1;height:120px;display:flex;align-items:center;justify-content:center}}
.tabs div.on{{border-bottom:3px solid #000}}
.tabs svg{{width:60px;height:60px}}
.grid{{display:grid;grid-template-columns:repeat(3,1fr);gap:3px}}
.tile{{aspect-ratio:3/4;position:relative;overflow:hidden;background:#EFEFEF}}
.tile img{{width:100%;height:100%;object-fit:cover;object-position:center;display:block}}
.pin{{position:absolute;top:16px;right:16px;width:46px;height:46px;filter:drop-shadow(0 1px 3px rgba(0,0,0,.45))}}
.tile.empty{{background:#fff;border:3px dashed #C7C7C7;display:flex;align-items:center;justify-content:center;text-align:center}}
.tile.empty span{{font-size:28px;color:#8E8E8E;font-weight:600;line-height:1.35}}
.note{{background:{LINO};font-family:Manrope,sans-serif;font-size:24px;line-height:1.45;color:{NOCHE};padding:28px 48px;border-top:3px solid {NOCHE}}}
.note b{{font-weight:800}}
"""
    stroke = 'fill="none" stroke="#000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"'
    body = f"""
<div class="label"><b>MOCKUP · PERFIL DE INSTAGRAM</b><span>Simulación para aprobación · no es captura real</span></div>
<div class="status"><span>9:41</span><span>5G · 100 %</span></div>
<div class="top">
  <svg class="ic" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" {stroke}/></svg>
  <span class="u">getlealtab</span>
  <svg class="ic" viewBox="0 0 24 24"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0" {stroke}/></svg>
  <svg class="ic" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.6" fill="#000"/><circle cx="12" cy="12" r="1.6" fill="#000"/><circle cx="19" cy="12" r="1.6" fill="#000"/></svg>
</div>
<div class="hdr">
  <img class="av" src="{AV}/lealtab-avatar-noche-cuadrado-1080.png">
  <div class="hdr-r">
    <div class="name">{NOMBRE}</div>
    <div class="stats"><div><b>7</b>publicaciones</div><div><b>—</b>seguidores</div><div><b>—</b>seguidos</div></div>
  </div>
</div>
<div class="info">
  <div class="cat">{CATEGORIA}</div>
  <div>{bio_html}</div>
  <div class="link">{link_svg}<span>{LINK}</span></div>
</div>
<div class="btns"><div class="btn p">Seguir</div><div class="btn">Mensaje</div><div class="btn">WhatsApp</div>
  <div class="btn sq"><svg viewBox="0 0 24 24" style="width:44px;height:44px"><circle cx="10" cy="8" r="3.5" {stroke}/><path d="M3.5 19c.8-3.4 3.4-5 6.5-5s5.7 1.6 6.5 5M19 8v6M16 11h6" {stroke}/></svg></div></div>
<div class="hls">{hl}</div>
<div class="tabs">
  <div class="on"><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" {stroke}/><path d="M9 3v18M15 3v18M3 9h18M3 15h18" {stroke}/></svg></div>
  <div><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4" {stroke}/><path d="M3 8h18M8 3l3 5M14 3l3 5M10 12v5l4.5-2.5z" {stroke}/></svg></div>
  <div><svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" {stroke}/><circle cx="12" cy="10" r="3" {stroke}/><path d="M6.5 19c1-2.6 3-4 5.5-4s4.5 1.4 5.5 4" {stroke}/></svg></div>
</div>
<div class="grid">{tiles}</div>
<div class="note"><b>Cómo leer esta cuadrícula:</b> Instagram muestra cada post del perfil en vertical 3:4.
Aquí se usan las versiones 3:4 del kit (1080×1440, <i>kit-redes/34/</i>), que se ven completas: logo, titular y @.
Fila 1 = 3 posts fijados (lema, cómo funciona, prueba 30 días). Faltan 2 posts para llenar 3×3.</div>
"""
    return page(body, css, 1080, 3108, "Mockup perfil")

# ---------------------------------------------------------------- escribir
def main():
    for f, n, icon in DESTACADOS:
        (HERE / f"destacado-{f}.html").write_text(portada(icon))
    (HERE / "destacados-preview.html").write_text(hoja())
    (HERE / "avatar-preview.html").write_text(avatares())
    (HERE / "perfil-mockup.html").write_text(mockup())
    print("HTML generados en", HERE)

if __name__ == "__main__":
    main()
