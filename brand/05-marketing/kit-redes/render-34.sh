#!/bin/bash
# Render kit-redes versión 3:4 (1080×1440) → kit-redes/34/  + hoja de contacto preview-34.png
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
DIR="$ROOT/html-34"
OUT="$ROOT/34"
mkdir -p "$OUT"
cd "$DIR"
for n in 01-lema 02-adios-carton 03-como-funciona 04-barberia 05-estetica 06-tapioca 07-prueba-30; do
  google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
    --allow-file-access-from-files --force-device-scale-factor=1 --window-size=1080,1440 \
    --virtual-time-budget=15000 \
    --screenshot="$OUT/$n.png" \
    "file://$DIR/$n.html" 2>/dev/null
  echo "✓ 34/$n.png (1080×1440)"
done
google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
  --allow-file-access-from-files --force-device-scale-factor=1 --window-size=1720,1320 \
  --virtual-time-budget=15000 \
  --screenshot="$OUT/preview-34.png" \
  "file://$DIR/preview-34.html" 2>/dev/null
echo "✓ 34/preview-34.png (1720×1320)"
