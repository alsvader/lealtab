#!/bin/bash
# Render LealTab pitch piloto HTML → PNG (1920×1080) → PDF (10 pages)
set -euo pipefail
DIR="$(cd "$(dirname "$0")/html" && pwd)"
OUT="$(cd "$(dirname "$0")" && pwd)"
MKT="$(cd "$(dirname "$0")/.." && pwd)"

PAGES=(
  01-portada
  02-problema
  03-solucion
  04-como-funciona
  05-marca
  06-que-ganas
  07-precios
  08-confianza
  09-lo-que-viene
  10-cierre
)

for src in "${PAGES[@]}"; do
  num="${src%%-*}"
  google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
    --allow-file-access-from-files --force-device-scale-factor=1 --window-size=1920,1080 \
    --virtual-time-budget=25000 \
    --screenshot="$OUT/$num.png" \
    "file://$DIR/$src.html" 2>/dev/null
  echo "✓ $num.png (1920×1080) ← $src.html"
done

python3 - << PY
from PIL import Image
from pathlib import Path
out = Path("$OUT")
mkt = Path("$MKT")
imgs = [Image.open(out / f"{i:02d}.png").convert("RGB") for i in range(1, 11)]
pdf = mkt / "05-pitch-piloto.pdf"
imgs[0].save(pdf, "PDF", resolution=96.0, save_all=True, append_images=imgs[1:])
print(f"✓ {pdf.name} ({len(imgs)} páginas, {imgs[0].size[0]}×{imgs[0].size[1]})")
PY
