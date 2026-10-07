"""Re-congelado limpio: cambia SOLO <title>/<desc>. Verifica que d y transforms no cambian."""
import re, hashlib, json, os, stat
M='/workspace/lealtab/03-visual-identity/logo/master/'
sha=lambda b:hashlib.sha256(b).hexdigest()
def parts(t): return re.findall(r'<path id="([^"]+)" d="([^"]+)"/>',t), re.findall(r'<g id="([^"]+)"(?: fill="[^"]+")?(?: transform="([^"]+)")?>',t)
log={}
for name in ('lealtab-master.svg','lealtab-vertical.svg'):
    b=open(M+name,'rb').read(); t=b.decode()
    log[name]={'sha256_anterior':sha(b),'d_anteriores':{i:sha(d.encode()) for i,d in parts(t)[0]},'g_anteriores':parts(t)[1]}
mh=open(M+'lealtab-master.svg').read()
mh=re.sub(r'<title>.*?</title>','<title>LealTab · Master horizontal · congelado 2026-10-05</title>',mh)
mh=mh.replace('<desc>Lockup horizontal maestro, Ajuste A.','<desc>LealTab · Master horizontal · congelado 2026-10-05 (aprobado por Aarón López Sosa). Ajuste A.')
open(M+'lealtab-master.svg','w').write(mh)
MSHA=sha(mh.encode())
mv=open(M+'lealtab-vertical.svg').read()
mv=re.sub(r'<title>.*?</title>','<title>LealTab · Master vertical · congelado 2026-10-05</title>',mv)
mv=re.sub(r'<desc>.*?</desc>',f'<desc>LealTab · Master vertical · congelado 2026-10-05 (aprobado por Aarón López Sosa). Trazados idénticos a los del master horizontal congelado (lealtab-master-frozen.svg, sha256 {MSHA[:8]}…{MSHA[-5:]}); solo translate/scale uniforme en los grupos. Símbolo = 2 C, espacio = 0.45 C (42.3 u), C = 94 u. Corrección óptica: símbolo desplazado +2.5 u a la derecha del centro geométrico.</desc>',mv,flags=re.S)
open(M+'lealtab-vertical.svg','w').write(mv)
ok=True
for name,fz in (('lealtab-master.svg','lealtab-master-frozen.svg'),('lealtab-vertical.svg','lealtab-vertical-frozen.svg')):
    b=open(M+name,'rb').read(); t=b.decode(); p,g=parts(t)
    dn={i:sha(d.encode()) for i,d in p}
    same=dn==log[name]['d_anteriores'] and g==log[name]['g_anteriores']
    ok&=same
    if os.path.exists(M+fz): os.chmod(M+fz,0o644); os.remove(M+fz)
    open(M+fz,'wb').write(b); os.chmod(M+fz,0o444)
    log[name].update(sha256_nuevo=sha(b),frozen=fz,sha256_frozen=sha(open(M+fz,'rb').read()),d_sin_cambios=dn==log[name]['d_anteriores'],grupos_y_transforms_sin_cambios=g==log[name]['g_anteriores'])
    del log[name]['g_anteriores']
log['ok']=ok
json.dump(log,open('recongelado.json','w'),indent=1,ensure_ascii=False)
print(json.dumps({k:(v if k=='ok' else {a:b for a,b in v.items() if a!='d_anteriores'}) for k,v in log.items()},indent=1,ensure_ascii=False))
