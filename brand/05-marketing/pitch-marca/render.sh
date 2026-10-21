#!/bin/bash
# LealTab pitch de marca (Propuesta A): build.py → HTML → PNG 1920×1080 → PDF 11 páginas
set -euo pipefail
DIR="$(cd "$(dirname "$0")/html" && pwd)"
OUT="$(cd "$(dirname "$0")" && pwd)"
MKT="$(cd "$(dirname "$0")/.." && pwd)"
python3 "$DIR/build.py"
PAGES=(01-portada 02-por-que 03-problema 04-propuesta-a 05-producto 06-para-quien 07-como-nos-vemos 08-modelo 09-piloto 10-hacia-donde 11-cierre)
for src in "${PAGES[@]}"; do
  num="${src%%-*}"
  google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
    --allow-file-access-from-files --force-device-scale-factor=1 --window-size=1920,1080 \
    --virtual-time-budget=25000 --screenshot="$OUT/$num.png" "file://$DIR/$src.html" 2>/dev/null
  echo "✓ $num.png ← $src.html"
done
python3 - << PY
from PIL import Image
imgs=[Image.open(f"$OUT/{i:02d}.png").convert("RGB") for i in range(1,12)]
imgs[0].save("$MKT/06-pitch-marca.pdf","PDF",resolution=96.0,save_all=True,append_images=imgs[1:])
print("✓ 06-pitch-marca.pdf", len(imgs), "páginas")
PY
