# LealTab · muestra visual pitch piloto (3 páginas)

Fase 5, Marketing · 6 de octubre de 2026 · **muestra corta**, no deck completo.

## Entregables

| Archivo | Qué es |
|---|---|
| [`05-pitch-piloto-muestra.pdf`](./05-pitch-piloto-muestra.pdf) | PDF de 3 páginas (1920×1080 landscape) |
| [`pitch-piloto/muestra-01.png`](./pitch-piloto/muestra-01.png) | Portada |
| [`pitch-piloto/muestra-02.png`](./pitch-piloto/muestra-02.png) | Cómo funciona |
| [`pitch-piloto/muestra-03.png`](./pitch-piloto/muestra-03.png) | Precios |
| [`pitch-piloto/html/`](./pitch-piloto/html/) | Fuente HTML (Ciclo v2) para regenerar |

## Páginas

1. **Portada** — logo horizontal lino sobre bosque, lema *Haz que tus clientes siempre regresen.*, @getlealtab, aro motif.
2. **Cómo funciona** — 3 pasos: crea tu tarjeta · QR e instala · ves quién regresa (íconos activos + números).
3. **Precios** — 30 días gratis; Inicio $299 + IVA; Negocio $449 + IVA (recomendado); Pro Próximamente sin precio.

## Diseño

- Paleta Ciclo v2: lino / blanco-lino / noche / bosque / menta; durazno solo en acento (badge Recomendado + punto).
- Tipografía: Archivo ExtraBold condensada (titulares) + Manrope (cuerpo).
- Logo real: `03-visual-identity/logo/entregables/svg/lealtab-horizontal-*.svg`.
- Español México, tú. Sin Wallet, sin look de cupón, sin Tabasco.

## Regenerar

```bash
# PNG
google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
  --allow-file-access-from-files --force-device-scale-factor=1 --window-size=1920,1080 \
  --virtual-time-budget=20000 \
  --screenshot=/workspace/lealtab/05-marketing/pitch-piloto/muestra-0N.png \
  file:///workspace/lealtab/05-marketing/pitch-piloto/html/0N-….html
```

Luego unir PNG → PDF con Pillow (como en la generación de este entregable).
