from r3geo import *
ref='<svg viewBox="140 100 250 220" width="300" height="264"><g fill="none" stroke="#0F2A22" stroke-width="58" stroke-linecap="round" stroke-linejoin="round"><path d="M180 142 V246 Q180 278 212 278 H284"/><path d="M284 142 H316 Q348 142 348 174 V246"/></g></svg>'
cells=''.join(f'<div>{svg(k,"#0F2A22",300)}<p>{k}</p></div>' for k in 'ABCD')
px=svg('PX16','#0F2A22',16)
html=f'<html><body style="margin:0;background:#F3EFE6;font:20px sans-serif;display:flex;flex-wrap:wrap;gap:20px;padding:20px;width:1600px"><div>{ref}<p>ref</p></div>{cells}<div style="image-rendering:pixelated">{px} {svg("A","#0F2A22",16)} {svg("A","#0F2A22",32)}</div></body></html>'
open('/tmp/prev.html','w').write(html)
