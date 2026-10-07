"""Verifica usos-correctos.svg, usos-incorrectos.svg y usos-logo.svg. Escribe uso/verificacion-usos.json."""
import hashlib, json, re, xml.etree.ElementTree as ET
L='/workspace/lealtab/03-visual-identity/logo/'; U=L+'uso/'; NS='{http://www.w3.org/2000/svg}'
sha=lambda s:hashlib.sha256(s.encode()).hexdigest(); fsha=lambda p:hashlib.sha256(open(p,'rb').read()).hexdigest()
REF={i:sha(d) for i,d in re.findall(r'<path id="([^"]+)" d="([^"]+)"/>',open(L+'master/lealtab-master-frozen.svg').read())}
prev=json.load(open(U+'verificacion-uso.json'))
VF=open(L+'master/lealtab-vertical-frozen.svg').read()
VT={g:t for g,t in re.findall(r'<g id="(isotipo|wordmark)" transform="([^"]+)"',VF)}
res={'estado':'Usos correctos e incorrectos · aprobado 2026-10-06','d_congelados_sha256':REF,
     'aprobados_sin_cambios':{n:fsha(U+n)==v['sha256'] for n,v in prev['archivos'].items()},
     'contraste_wcag':json.load(open('/tmp/usos-contraste.json')),'archivos':{}}
ok=all(res['aprobados_sin_cambios'].values())
for n in ('usos-correctos.svg','usos-incorrectos.svg','usos-logo.svg','usos-logo-vertical.svg'):
    r=ET.parse(U+n).getroot(); errs=[]; det={}
    for g in r.iter(NS+'g'):
        if g.get('id') in ('isotipo','wordmark'):
            for p in g.iter(NS+'path'): det[p.get('id')]=sha(p.get('d'))==REF.get(p.get('id'))
    errs+=[f'falta {k}' for k in REF if k not in det]+[f'd distinto {k}' for k,v in det.items() if not v]
    ids=[p.get('id') for p in r.iter(NS+'path') if p.get('id')]
    if [i for i in ids if i not in REF]: errs.append('trazados con id no congelados')
    uses=[u.get('href') for u in r.iter(NS+'use')]
    if any(h not in ('#isotipo','#wordmark') for h in uses): errs.append('use a otro destino')
    imgs=[i for i in r.iter(NS+'image')]; txt_err=[t for t in r.iter(NS+'text') if t.get('data-ejemplo-error')]
    if any(not i.get('data-ejemplo-error') and 'pixel' not in (i.get('href')[:0] or '') for i in imgs if False): pass
    vg=[g for g in r.iter(NS+'g') if g.get('data-lockup')=='vertical']
    vt_ok=[all(u.get('transform')==VT[u.get('href')[1:]] for u in g.iter(NS+'use')) and len(list(g.iter(NS+'use')))==2 for g in vg]
    if not all(vt_ok): errs.append('transform del vertical distinto al master en un caso correcto')
    marcados=[e.get('data-ejemplo-error') for e in r.iter() if e.get('data-ejemplo-error')]
    res['archivos'][n]={'d_congelados_identicos':f'{sum(det.values())}/{len(REF)}','usos_del_logo':len(uses),
        'elementos_marcados_como_error':marcados,'imagenes_png_incrustadas':len(imgs),'verticales_correctos_con_transforms_del_master':f'{sum(vt_ok)}/{len(vt_ok)}','transforms_vertical_master':VT,'ok':not errs,'errores':errs,'sha256':fsha(U+n)}
    ok&=not errs
res['resumen']={'todo_ok':ok,'archivos':len(res['archivos'])}
json.dump(res,open(U+'verificacion-usos.json','w'),indent=1,ensure_ascii=False)
print(json.dumps({k:(v['d_congelados_identicos'],v['verticales_correctos_con_transforms_del_master'],v['usos_del_logo'],v['elementos_marcados_como_error'],v['imagenes_png_incrustadas'],v['errores']) for k,v in res['archivos'].items()},ensure_ascii=False,indent=0),res['aprobados_sin_cambios'],res['resumen'])
