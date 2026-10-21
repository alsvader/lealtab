"""Genera las 11 páginas HTML del pitch de marca (Propuesta A). Fuente única; editar aquí y correr render.sh."""
from pathlib import Path
D = Path(__file__).parent
V = '../../../03-visual-identity'
LOGO_N = f'{V}/logo/entregables/svg/lealtab-horizontal-noche.svg'
LOGO_L = f'{V}/logo/entregables/svg/lealtab-horizontal-lino.svg'
IC = lambda n: f'{V}/recursos/iconos/activo/lt-icono-{n}-activo.svg'
IL = lambda n: f'{V}/recursos/ilustraciones/lt-ilustracion-{n}.svg'
ARO = lambda n: f'assets/aro-{n}.svg'
WHITE = 'filter:brightness(0) invert(1);'

EXTRA = """
<style>
.pg{position:absolute;right:88px;bottom:40px;font-size:14px;font-weight:600;color:#4D635A;letter-spacing:.08em;z-index:3}
.bg-bosque .pg,.bg-noche .pg{color:#CFE3D6}
.quote{font-family:var(--font-display);font-weight:800;font-variation-settings:"wdth" 75,"wght" 800;font-size:46px;line-height:1.02;letter-spacing:-.01em}
.sw{width:100%;height:110px;border:3px solid #0F2A22;border-radius:12px;box-shadow:4px 4px 0 #0F2A22}
.chip{display:inline-flex;padding:8px 14px;border:2.5px solid #0F2A22;border-radius:10px;background:#FFFDF8;font-weight:700;font-size:18px;box-shadow:3px 3px 0 #0F2A22}
.mini li{list-style:none;font-size:18px;line-height:1.4;color:#4D635A;display:flex;gap:10px;align-items:flex-start}
.mini li img{width:20px;height:20px;margin-top:3px;flex-shrink:0}
.mini{display:flex;flex-direction:column;gap:10px}
.mini.big li{font-size:24px;}.mini.big li img{width:26px;height:26px;}
.tag{font-size:13px;font-weight:700;letter-spacing:.1em;text-transform:uppercase}
</style>"""

def page(body, cls='', n=0):
    return f"""<!DOCTYPE html>
<html lang="es-MX"><head><meta charset="utf-8" /><link rel="stylesheet" href="_base.css" />{EXTRA}</head>
<body><div class="slide pad {cls}" style="display:flex;flex-direction:column;gap:40px;">
{body}
{'<span class="pg num">%02d / 11</span>' % n if n not in (1, 11) else ''}
</div></body></html>"""

def top(dark=False):
    return f"""<div class="topbar"><img class="logo-h" src="{LOGO_L if dark else LOGO_N}" alt="LealTab" /><span class="handle">@getlealtab</span></div>"""

def head(lbl, title, lead='', w=1200):
    l = f'<p class="lead" style="max-width:1000px;">{lead}</p>' if lead else ''
    return f"""<div class="stack gap-16" style="position:relative;z-index:1;max-width:{w}px;"><p class="lbl">{lbl}</p><h1 class="h1">{title}</h1>{l}</div>"""

def card(icon, title, text, extra=''):
    return f"""<div class="card stack gap-20" style="flex:1;padding:34px 30px;{extra}"><div class="feature-icon"><img src="{IC(icon)}" alt="" /></div><p class="h3">{title}</p><p class="body">{text}</p></div>"""

P = {}

P['01-portada'] = page(f"""
<img class="aro-corner aro-tr" src="{ARO('parcial-sin-cifra')}" alt="" style="{WHITE}opacity:.16;width:640px;height:640px;" />
<div class="topbar"><img class="logo-h-lg" src="{LOGO_L}" alt="LealTab" /><span class="badge" style="transform:rotate(-3deg);">Propuesta de marca y producto</span></div>
<div class="stack gap-32" style="flex:1;justify-content:center;position:relative;z-index:1;max-width:1300px;">
  <h1 class="display" style="font-size:120px;">Haz que tus clientes siempre regresen.</h1>
  <p class="lead" style="max-width:900px;">Tu tarjeta digital siempre a un toque.</p>
</div>
<div class="row" style="justify-content:space-between;position:relative;z-index:1;"><span class="handle" style="font-size:24px;">@getlealtab</span>
<div class="row gap-12"><span class="accent-dot"></span><span style="font-weight:600;font-size:20px;color:#FFFDF8;">lealtab.com</span></div></div>
""", 'bg-bosque', 1)

P['02-por-que'] = page(f"""
{top()}
{head('Por qué existimos', 'Que ningún buen cliente se vaya sin que te des cuenta.')}
<div class="row gap-32" style="flex:1;align-items:stretch;position:relative;z-index:1;">
  <div class="card stack gap-24" style="flex:1;padding:44px 40px;">
    <p class="tag" style="color:#0F4D3A;">Misión</p>
    <p class="quote">Ayudar a los negocios a que sus clientes regresen, con tecnología de lealtad fácil de usar, confiable y de primer nivel.</p>
  </div>
  <div class="card stack gap-24" style="flex:1;padding:44px 40px;background:#0F4D3A;">
    <p class="tag" style="color:#CFE3D6;">Visión</p>
    <p class="quote" style="color:#FFFDF8;font-size:40px;">Que cualquier negocio, del local de la esquina a la cadena más grande y en cualquier país, tenga en LealTab la plataforma para conocer a sus clientes y hacer que regresen.</p>
  </div>
</div>
""", n=2)

P['03-problema'] = page(f"""
<img class="aro-corner aro-br" src="{ARO('vacio')}" alt="" style="opacity:.3;" />
{top()}
{head('El problema', 'Negocios que viven de que el cliente vuelva, con lealtad en papel.', 'Cafeterías, estéticas, barberías y negocios parecidos, de 1 a 3 sucursales, con el dueño operando. Hoy usan tarjeta de cartón, los puntos de su punto de venta o nada.')}
<div class="row gap-28" style="flex:1;align-items:stretch;position:relative;z-index:1;">
  {card('cliente','El cartón se pierde','Se olvida, se rompe o se queda en otra cartera. El cliente no la trae cuando vuelve.')}
  {card('visita','Las bajas son silenciosas','El cliente frecuente deja de venir sin aviso, y nadie lo nota a tiempo.')}
  {card('estadisticas','No hay datos claros','El dueño no sabe quién es frecuente ni quién se fue. Las promociones se hacen a ojo.')}
</div>
""", n=3)

P['04-propuesta-a'] = page(f"""
<img class="aro-corner aro-tr" src="{ARO('vacio')}" alt="" style="opacity:.3;" />
{top()}
<div class="row gap-48" style="flex:1;align-items:center;position:relative;z-index:1;">
  <div class="stack gap-24" style="flex:1.05;">
    <p class="lbl">Propuesta A · al lanzar</p>
    <h1 class="h1" style="font-size:76px;">La tarjeta digital más simple y bonita.</h1>
    <p class="lead">El negocio la crea en minutos; el cliente la instala en su pantalla de inicio con un toque, sin tienda de apps. Se ve y se siente premium, con la imagen del negocio, en cualquier celular.</p>
    <p class="body" style="color:#0F2A22;font-weight:600;">Al lanzar, la tarjeta es la protagonista. La marca está lista para crecer sin cambiar de nombre, logo ni lema.</p>
  </div>
  <div class="stack gap-20" style="flex:.95;">
    <div class="card row gap-20" style="padding:24px 28px;"><div class="feature-icon"><img src="{IC('check')}" alt=""/></div><div class="stack gap-8"><p class="h3">Lista hoy</p><p class="body">El negocio la configura solo, sin llamar a ventas.</p></div></div>
    <div class="card row gap-20" style="padding:24px 28px;"><div class="feature-icon"><img src="{IC('escanear')}" alt=""/></div><div class="stack gap-8"><p class="h3">Cero fricción para el cliente</p><p class="body">Escanea un QR, la instala como ícono y listo.</p></div></div>
    <div class="card row gap-20" style="padding:24px 28px;"><div class="feature-icon"><img src="{IC('negocio')}" alt=""/></div><div class="stack gap-8"><p class="h3">Se ve como tu marca</p><p class="body">Logo, colores y diseño cuidado, no plantilla genérica.</p></div></div>
    <div class="card row gap-20" style="padding:24px 28px;"><div class="feature-icon"><img src="{IC('recompensa')}" alt=""/></div><div class="stack gap-8"><p class="h3">Precio claro</p><p class="body">Sin cotizador ni pago inicial. Precios públicos.</p></div></div>
  </div>
</div>
""", n=4)

P['05-producto'] = page(f"""
{top()}
{head('El producto', 'Tu tarjeta digital siempre a un toque.')}
<div class="row gap-28" style="flex:1;align-items:stretch;position:relative;z-index:1;">
  <div class="card stack gap-20" style="flex:1;padding:34px 30px;">
    <div class="feature-icon"><img src="{IC('inicio')}" alt=""/></div>
    <p class="h3">Tarjeta a un toque</p>
    <p class="body">App web instalable (PWA): se guarda como ícono en la pantalla de inicio, en iPhone o Android. Sin tienda de apps.</p>
  </div>
  <div class="card stack gap-20" style="flex:1;padding:34px 30px;align-items:flex-start;">
    <img src="{ARO('parcial-sin-cifra')}" alt="" style="width:150px;height:150px;" />
    <p class="h3">El aro que se completa</p>
    <p class="body">Cada visita avanza el aro. El cliente ve cuánto le falta para su recompensa.</p>
  </div>
  <div class="card stack gap-20" style="flex:1;padding:34px 30px;">
    <div class="feature-icon"><img src="{IC('estadisticas')}" alt=""/></div>
    <p class="h3">Tablero de quién regresa</p>
    <p class="body">Un tablero básico con quién regresa y quién no. Los datos son del negocio y se pueden exportar.</p>
  </div>
</div>
<p class="body" style="position:relative;z-index:1;">Al lanzar: módulos <b style="color:#0F2A22;">Tarjeta</b> y <b style="color:#0F2A22;">Clientes</b>, soporte por WhatsApp, exportación de datos y aviso de privacidad.</p>
""", n=5)

def oficio(il, t, s):
    return f"""<div class="card stack gap-14" style="flex:1;padding:18px 18px 24px;"><img class="illust" src="{IL(il)}" alt="{t}" /><p class="h3" style="padding:0 6px;">{t}</p><p class="body" style="padding:0 6px;font-size:18px;">{s}</p></div>"""

P['06-para-quien'] = page(f"""
{top()}
{head('Para quién', 'Negocios donde el cliente vuelve cada semana o cada mes.')}
<div class="row gap-24" style="flex:1;align-items:stretch;position:relative;z-index:1;">
  {oficio('barberia','Barberías','Clientes que vuelven cada 2 o 3 semanas.')}
  {oficio('estetica','Estéticas y salones de belleza','Clientas frecuentes que hoy dejan de venir sin aviso.')}
  {oficio('tapioca','Tapiocas','Clientes jóvenes que todo lo hacen en el celular.')}
  <div class="card stack gap-20" style="flex:.85;padding:30px 26px;background:#CFE3D6;justify-content:space-between;">
    <div class="stack gap-20"><div class="feature-icon" style="background:#FFFDF8;"><img src="{IC('negocio')}" alt=""/></div>
    <p class="h3">Cafeterías y más</p>
    <p class="body" style="color:#0F2A22;font-size:18px;">Gimnasios, uñas, spas, panaderías, lavanderías: cualquier negocio de visita recurrente.</p></div>
    <p class="tag" style="color:#0F4D3A;">1 a 3 sucursales</p>
  </div>
</div>
""", n=6)

def sw(c, name, hexv, role, fg='#0F2A22'):
    return f"""<div class="stack gap-8" style="flex:1;"><div class="sw" style="background:{c};"></div><p style="font-weight:700;font-size:17px;">{name}</p><p class="num" style="font-size:14px;color:#4D635A;">{hexv} · {role}</p></div>"""

P['07-como-nos-vemos'] = page(f"""
{top()}
{head('Cómo nos vemos y cómo hablamos', 'Simple, Confiable, Humana, Premium.')}
<div class="row gap-28" style="flex:1;align-items:stretch;position:relative;z-index:1;">
  <div class="card stack gap-18" style="flex:1;padding:30px 28px;">
    <p class="tag" style="color:#0F4D3A;">Voz</p>
    <ul class="mini">
      <li><img src="{IC('check')}" alt=""/>Claro antes que ingenioso.</li>
      <li><img src="{IC('check')}" alt=""/>Concreto, no adjetivos.</li>
      <li><img src="{IC('check')}" alt=""/>Cercano y respetuoso. De tú.</li>
      <li><img src="{IC('check')}" alt=""/>Seguro, sin exagerar ni urgencia falsa.</li>
    </ul>
    <div class="stack gap-8" style="margin-top:auto;border-top:2px solid #0F2A22;padding-top:16px;">
      <p class="body" style="font-size:17px;"><b style="color:#0F2A22;">Decimos:</b> “Ves quién regresa y quién no.”</p>
      <p class="body" style="font-size:17px;"><b style="color:#0F2A22;">No decimos:</b> “Analítica avanzada impulsada por IA.”</p>
    </div>
  </div>
  <div class="card stack gap-20" style="flex:1.25;padding:30px 28px;">
    <p class="tag" style="color:#0F4D3A;">Paleta y tipografía</p>
    <div class="row gap-14" style="align-items:flex-start;">
      {sw('#F3EFE6','Lino','#F3EFE6','fondo')}{sw('#0F4D3A','Bosque','#0F4D3A','protagonista')}{sw('#0F2A22','Noche','#0F2A22','texto')}{sw('#CFE3D6','Menta','#CFE3D6','apoyo')}
      <div class="stack gap-8" style="flex:.55;"><div class="sw" style="background:#FF9F6E;height:110px;width:56px;"></div><p style="font-weight:700;font-size:17px;">Durazno</p><p style="font-size:14px;color:#4D635A;">solo acento</p></div>
    </div>
    <div class="row gap-32" style="margin-top:auto;align-items:flex-end;">
      <div class="stack gap-4"><p class="h1" style="font-size:72px;">Archivo</p><p class="body" style="font-size:16px;">Condensada 800 · titulares</p></div>
      <div class="stack gap-4"><p style="font-size:48px;font-weight:700;line-height:1;">Manrope</p><p class="body" style="font-size:16px;">Texto, interfaz y cifras</p></div>
    </div>
  </div>
  <div class="card stack gap-18" style="flex:.85;padding:30px 28px;background:#0F4D3A;">
    <p class="tag" style="color:#CFE3D6;">El aro</p>
    <img src="{ARO('parcial-sin-cifra')}" alt="" style="width:170px;height:170px;" />
    <p class="body" style="color:#FFFDF8;font-size:19px;">Cada regreso cierra un círculo y abre el siguiente. Uno grande por pieza, nunca en hileras como sellos.</p>
  </div>
</div>
""", n=7)

P['08-modelo'] = page(f"""
{top()}
<div class="row" style="justify-content:space-between;align-items:flex-end;position:relative;z-index:1;">
  <div class="stack gap-12"><p class="lbl">Modelo</p><h1 class="h1">Precios públicos. Alta sin llamada de ventas.</h1></div>
  <div class="card row gap-16" style="padding:16px 24px;background:#CFE3D6;"><span class="accent-dot"></span><div class="stack"><p class="h3" style="font-size:22px;">Prueba gratis 30 días</p><p class="body" style="font-size:15px;color:#0F2A22;">Sin tarjeta de crédito</p></div></div>
</div>
<div class="row gap-24" style="flex:1;align-items:stretch;position:relative;z-index:1;">
  <div class="card plan" style="min-height:0;">
    <p class="lbl">Inicio</p><p class="price num">$299</p><p class="price-sub body" style="color:#0F2A22;">MXN/mes + IVA</p>
    <ul><li><img class="check" src="{IC('check')}" alt=""/>Hasta 200 clientes activos</li><li><img class="check" src="{IC('check')}" alt=""/>1 tarjeta · 1 sucursal</li><li><img class="check" src="{IC('check')}" alt=""/>Soporte por WhatsApp</li></ul>
  </div>
  <div class="card plan featured" style="min-height:0;">
    <div class="row" style="justify-content:space-between;"><p class="lbl">Negocio</p><span class="badge badge-durazno" style="transform:rotate(-3deg);font-size:12px;padding:6px 11px;">Recomendado</span></div>
    <p class="price num">$449</p><p class="price-sub" style="color:#CFE3D6;">MXN/mes + IVA</p>
    <ul><li>· Clientes activos ilimitados</li><li>· Varias tarjetas y recompensas</li><li>· Hasta 3 sucursales</li><li>· Soporte por WhatsApp</li></ul>
  </div>
  <div class="card plan muted" style="min-height:0;">
    <p class="lbl" style="color:#0F2A22;">Pro</p><p class="price" style="font-size:38px;margin-top:14px;">Próximamente</p><p class="price-sub body" style="color:#0F2A22;">Sin precio por ahora</p>
    <ul><li style="color:#0F2A22;">Llega junto con avisos, campañas y varias sucursales.</li></ul>
  </div>
</div>
<p class="body" style="text-align:center;position:relative;z-index:1;">Sin contratos, cancelas cuando quieras. Todos los precios + IVA.</p>
""", n=8)

P['09-piloto'] = page(f"""
<img class="aro-corner aro-br" src="{ARO('vacio')}" alt="" style="opacity:.3;" />
{top()}
<div class="row gap-48" style="flex:1;align-items:stretch;position:relative;z-index:1;">
  <div class="stack gap-24" style="flex:.9;justify-content:center;">
    <p class="lbl">Piloto</p>
    <h1 class="h1" style="font-size:72px;">Piloto en Villahermosa.</h1>
    <p class="lead">Entre 5 y 10 negocios: barberías, estéticas y tapiocas. Cafeterías y gimnasios quedan para después.</p>
    <span class="badge" style="align-self:flex-start;transform:rotate(-3deg);">En preparación · sin resultados todavía</span>
  </div>
  <div class="card stack gap-32" style="flex:1.1;padding:48px 44px;justify-content:center;">
    <p class="h2" style="font-size:40px;">Qué buscamos aprender</p>
    <ul class="mini big" style="gap:30px;">
      <li><img src="{IC('check')}" alt=""/><span><b style="color:#0F2A22;">Precio.</b> Probar precios distintos con negocios parecidos y ver cuál aceptan.</span></li>
      <li><img src="{IC('check')}" alt=""/><span><b style="color:#0F2A22;">Alta sin ayuda.</b> Cuánto tarda un dueño en crear su tarjeta solo.</span></li>
      <li><img src="{IC('check')}" alt=""/><span><b style="color:#0F2A22;">Instalación.</b> Que el flujo QR → pantalla de inicio funcione en iPhone y Android.</span></li>
      <li><img src="{IC('check')}" alt=""/><span><b style="color:#0F2A22;">Uso real.</b> Si los clientes la usan y si el tablero ayuda a ver quién regresa.</span></li>
      <li><img src="{IC('check')}" alt=""/><span><b style="color:#0F2A22;">Qué piden después.</b> Avisos, campañas, sucursales o más datos.</span></li>
    </ul>
  </div>
</div>
""", n=9)

def soon(icon, t, s):
    return f"""<div class="card row gap-20" style="padding:24px 26px;background:#16352C;border-color:#CFE3D6;box-shadow:5px 5px 0 #0A1A15;align-items:flex-start;flex:1;">
<div class="feature-icon"><img src="{IC(icon)}" alt=""/></div><div class="stack gap-8" style="flex:1;"><div class="row" style="justify-content:space-between;gap:12px;"><p class="h3">{t}</p><span class="soon-tag">Próximamente</span></div><p class="body">{s}</p></div></div>"""

P['10-hacia-donde'] = page(f"""
<img class="aro-corner aro-tr" src="{ARO('vacio')}" alt="" style="{WHITE}opacity:.1;" />
{top(True)}
{head('Hacia dónde vamos', 'De la tarjeta a la plataforma de lealtad.', 'Cuando el producto y el piloto lo respalden, el mensaje pasa de la tarjeta al resultado: clientes que regresan. Sin fechas; depende de señales, no del calendario.', 1300)}
<div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;flex:1;position:relative;z-index:1;">
  {soon('aviso','Avisos para tus clientes','Para que vuelvan en el momento justo.')}
  {soon('calendario','Campañas para días flojos','Una promoción para los clientes de siempre.')}
  {soon('ubicacion','Varias sucursales','Todas las sucursales en una sola cuenta.')}
  {soon('inicio','Apple y Google Wallet','La tarjeta también en la cartera del celular, como un canal más.')}
</div>
""", 'bg-noche', 10)

P['11-cierre'] = page(f"""
<img class="aro-corner aro-tr" src="{ARO('completo-sin-cifra')}" alt="" style="{WHITE}opacity:.14;width:620px;height:620px;" />
<div class="topbar"><img class="logo-h-lg" src="{LOGO_L}" alt="LealTab" /></div>
<div class="stack gap-32" style="flex:1;justify-content:center;position:relative;z-index:1;max-width:1300px;">
  <h1 class="display" style="font-size:120px;">Haz que tus clientes siempre regresen.</h1>
  <p class="lead">Gracias. Platiquemos.</p>
</div>
<div class="row gap-32" style="position:relative;z-index:1;align-items:center;">
  <div class="btn btn-lg" style="background:#FFFDF8;color:#0F2A22;">lealtab.com</div>
  <span class="handle" style="font-size:28px;">@getlealtab</span>
  <span class="accent-dot" style="margin-left:auto;"></span>
</div>
""", 'bg-bosque', 11)

for name, html in P.items():
    (D / f'{name}.html').write_text(html)
print(len(P), 'pages')
