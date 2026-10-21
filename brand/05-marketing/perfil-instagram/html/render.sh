#!/bin/bash
# LealTab · Perfil de Instagram: genera HTML (build.py) y renderiza PNG con Chrome headless.
set -euo pipefail
DIR="$(cd "$(dirname "$0")" && pwd)"
OUT="$(cd "$DIR/.." && pwd)"
cd "$DIR"
python3 build.py

shot() { # html  png  ancho  alto
  google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars \
    --allow-file-access-from-files --force-device-scale-factor=1 --window-size="$3,$4" \
    --virtual-time-budget=15000 --screenshot="$2" "file://$DIR/$1" 2>/dev/null
  echo "✓ $(basename "$2") ($3×$4)"
}

for f in destacado-*.html; do
  n="${f#destacado-}"; n="${n%.html}"
  shot "$f" "$OUT/destacados/$n.png" 1080 1920
done
shot destacados-preview.html "$OUT/destacados-preview.png" 1460 1380
shot avatar-preview.html     "$OUT/avatar-preview.png"     1760 1110
shot perfil-mockup.html      "$OUT/perfil-mockup.png"      1080 3108
