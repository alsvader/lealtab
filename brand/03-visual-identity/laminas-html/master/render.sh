#!/bin/bash
cd /workspace/lealtab/03-visual-identity/laminas-html/master
google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --window-size=1600,1000 --virtual-time-budget=8000 --screenshot=../../logo/master/verification.png file://$PWD/verification.html 2>/dev/null
sed -e "s|href=\"../r3fonts.css\"|href=\"../../laminas-html/r3fonts.css\"|; s|href=\"../ciclo-v2.css\"|href=\"../../laminas-html/ciclo-v2.css\"|; s|src=\"../../logo/master/lealtab-master.svg\"|src=\"lealtab-master.svg\"|" verification.html > ../../logo/master/verification.html
