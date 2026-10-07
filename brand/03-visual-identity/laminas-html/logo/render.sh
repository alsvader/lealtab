#!/bin/bash
# uso: bash render.sh logo-final logo-uso logo-antes-despues  → /workspace/lealtab/03-visual-identity/logo/<n>.png
cd /workspace/lealtab/03-visual-identity/laminas-html/logo
for n in "$@"; do google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1600,1000 --virtual-time-budget=8000 --screenshot=../../logo/$n.png file://$PWD/$n.html 2>/dev/null; done
