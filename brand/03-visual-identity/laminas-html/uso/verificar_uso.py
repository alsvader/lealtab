"""Verifica logo/uso/*.svg: cada <path> con id de #isotipo/#wordmark = d congelado (sha256); el único trazado
derivado permitido es el pixel-fit 16 px aprobado (igual al de logo/iconos/pixel/). Escribe uso/verificacion-uso.json."""
import glob, hashlib, json, os, re, xml.etree.ElementTree as ET
L='/workspace/lealtab/03-visual-identity/logo/'; NS='{http://www.w3.org/2000/svg}'
sha=lambda s:hashlib.sha256(s.encode()).hexdigest(); fsha=lambda p:hashlib.sha256(open(p,'rb').read()).hexdigest()
fr=open(L+'master/lealtab-master-frozen.svg').read(); vfr=open(L+'master/lealtab-vertical-frozen.svg').read()
REF={i:sha(d) for i,d in re.findall(r'<path id="([^"]+)" d="([^"]+)"/>',fr)}
PIX={i:sha(d) for i,d in re.findall(r'<path id="([^"]+)" d="([^"]+)"/>',open(L+'iconos/pixel/lealtab-isotipo-16px.svg').read())}
VT=re.findall(r'<g id="(?:isotipo|wordmark)" transform="([^"]+)"',vfr)
prev=json.load(open(L+'sistema/verificacion-paths.json'))['congelados']
res={'estado':'Área de protección y tamaños mínimos · aprobado 2026-10-05',
     'congelados_intactos':{n:fsha(L+'master/'+n)==h for n,h in prev.items()},'d_congelados_sha256':REF,'archivos':{}}
ok=all(res['congelados_intactos'].values())
for fp in sorted(glob.glob(L+'uso/*.svg')):
    r=ET.parse(fp).getroot(); errs=[]; det={}
    for g in r.iter(NS+'g'):
        if g.get('id') in ('isotipo','wordmark'):
            for p in g.iter(NS+'path'): det[p.get('id')]=sha(p.get('d'))==REF.get(p.get('id'))
    errs+=[f'falta {k}' for k in REF if k not in det]+[f'd distinto: {k}' for k,v in det.items() if not v]
    der=[p.get('id') for g in r.iter(NS+'g') if g.get('data-derivado')=='pixel-fit' for p in g.iter(NS+'path')]
    der_ok={i:sha(p.get('d'))==PIX.get(i) for g in r.iter(NS+'g') if g.get('data-derivado')=='pixel-fit' for p in g.iter(NS+'path') for i in [p.get('id')]}
    otros=[p.get('id') for p in r.iter(NS+'path') if p.get('id') and p.get('id') not in REF and p.get('id') not in der]
    if otros: errs.append(f'trazados de logo no reconocidos: {otros}')
    if not all(der_ok.values()): errs.append('pixel-fit distinto del aprobado')
    t=open(fp).read(); vt_ok=all(v in t for v in VT) if 'transform="'+VT[0]+'"' in t else None
    res['archivos'][os.path.basename(fp)]={'d_congelados_identicos':f'{sum(det.values())}/{len(REF)}','derivados_pixel_fit_aprobados':der_ok,
        'transforms_vertical_congelados':vt_ok,'ok':not errs,'errores':errs,'sha256':fsha(fp)}
    ok&=not errs
res['resumen']={'todo_ok':ok,'archivos':len(res['archivos'])}
json.dump(res,open(L+'uso/verificacion-uso.json','w'),indent=1,ensure_ascii=False)
print(json.dumps({k:(v['d_congelados_identicos'],v['derivados_pixel_fit_aprobados'],v['transforms_vertical_congelados'],v['errores']) for k,v in res['archivos'].items()},ensure_ascii=False),res['resumen'],res['congelados_intactos'])
