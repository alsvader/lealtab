import sys,subprocess,os
sys.path.insert(0,'../iconos'); from render import render_one
tag=sys.argv[1]
for n in sys.argv[2:]:
    render_one(f'/tmp/bbp/p{n}.svg',1920,1080,f'/tmp/bbp/p{n}-{tag}.png')
