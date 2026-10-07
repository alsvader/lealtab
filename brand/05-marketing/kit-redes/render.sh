#!/bin/bash
# Render kit-redes HTML → PNG (Ciclo v2). Run from anywhere.
set -euo pipefail
DIR="$(cd "$(dirname "$0")/html" && pwd)"
OUT="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

render_feed() {
  local name="$1"
  google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
    --allow-file-access-from-files --force-device-scale-factor=1 --window-size=1080,1080 \
    --virtual-time-budget=15000 \
    --screenshot="$OUT/$name.png" \
    "file://$DIR/$name.html" 2>/dev/null
  echo "✓ $name.png (1080×1080)"
}
render_story() {
  local name="$1"
  google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
    --allow-file-access-from-files --force-device-scale-factor=1 --window-size=1080,1920 \
    --virtual-time-budget=15000 \
    --screenshot="$OUT/$name.png" \
    "file://$DIR/$name.html" 2>/dev/null
  echo "✓ $name.png (1080×1920)"
}

for n in 01-lema 02-adios-carton 03-como-funciona 04-barberia 05-estetica 06-tapioca 07-prueba-30; do
  render_feed "$n"
done
for n in story-01-cta story-02-qr; do
  render_story "$n"
done
