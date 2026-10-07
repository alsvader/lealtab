# LealTab · pitch piloto completo (10 páginas)

Fase 5, Marketing · 6 de octubre de 2026 · Dirección visual aprobada a partir de la muestra de 3 páginas.

## Entregables

| Archivo | Qué es |
|---|---|
| [`05-pitch-piloto.pdf`](./05-pitch-piloto.pdf) | PDF completo, 10 páginas · 1920×1080 landscape |
| [`pitch-piloto/01.png`](./pitch-piloto/01.png) … [`10.png`](./pitch-piloto/10.png) | Previews PNG del deck |
| [`pitch-piloto/html/`](./pitch-piloto/html/) | Fuente HTML Ciclo v2 |
| [`pitch-piloto/render.sh`](./pitch-piloto/render.sh) | Regenera PNG → PDF |
| [`05-pitch-piloto-muestra.pdf`](./05-pitch-piloto-muestra.pdf) | Muestra corta aprobada (se conserva) |
| [`pitch-piloto/muestra-*.png`](./pitch-piloto/) | Previews de la muestra (sin cambios) |

## Outline

1. **Portada** — lema, subtítulo, @getlealtab · lealtab.com (bosque)
2. **El problema** — cartón se pierde / se olvida / no ves quién se fue
3. **La solución** — tarjeta digital a un toque (PWA); QR → Agregar a inicio → listo
4. **Cómo funciona** — crea · escanea e instala · sumas visitas y ves quién regresa
5. **Se ve como tu marca** — barbería, estética, tapioca + línea de cierre
6. **Qué ganas** — fidelidad visible · tablero · datos tuyos (MVP honesto)
7. **Precios** — 30 días gratis; Inicio $299 + IVA; Negocio $449 recomendado; Pro Próximamente
8. **Confianza** — WhatsApp persona real · exportar · privacidad · fin de prueba
9. **Lo que viene** — avisos, campañas, sucursales, Wallet (próximamente; sin fechas)
10. **Cierre** — lema + CTA → app.lealtab.com · WhatsApp secundario

## Diseño

- Paleta Ciclo v2: lino `#F3EFE6`, blanco-lino `#FFFDF8`, noche `#0F2A22`, bosque `#0F4D3A`, menta `#CFE3D6`; durazno `#FF9F6E` solo acento (badge Recomendado, puntos).
- Tipografía local: Archivo ExtraBold condensada + Manrope (`_base.css`).
- Contornos 3 px noche, sombra dura 6×6, cards ~14 px, aros de `recursos/aro/` (sin parcial con cifra en portada/cierre).
- Logos, íconos e ilustraciones reales de `03-visual-identity/`.
- ES-MX tú. Sin Wallet como promesa de lanzamiento (solo slide 9). Sin precio fundador, sin cupón, sin Tabasco. Sin CFDI / API / OXXO.

## Regenerar

```bash
/workspace/lealtab/05-marketing/pitch-piloto/render.sh
```
