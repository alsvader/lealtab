#!/bin/bash
cd /workspace/lealtab/02-creative-direction/laminas-html
for n in "$@"; do
google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars --window-size=1600,1000 --virtual-time-budget=15000 --screenshot=../$n.png file://$PWD/$n.html 2>/dev/null
done
