"""Verifica cada <path> de logo/sistema/*.svg contra los congelados. Escribe sistema/verificacion-paths.json."""
import glob, hashlib, json, os, re, xml.etree.ElementTree as ET
M='/workspace/lealtab/03-visual-identity/logo/master/'; S='/workspace/lealtab/03-visual-identity/logo/sistema/'
NS='{http://www.w3.org/2000/svg}'
sha=lambda s:hashlib.sha256(s.encode()).hexdigest()
def paths(file):
    r=ET.parse(file).getroot(); out={}
    for g in r.iter(NS+'g'):
        if g.get('id') in ('isotipo','wordmark'):
            for p in g.iter(NS+'path'): out[p.get('id')]=(g.get('id'),p.get('d'),g.get('transform'))
    allp=[p.get('id') for p in r.iter(NS+'path')]
    return out,allp,r
FH,_,_=paths(M+'lealtab-master-frozen.svg'); FV,_,_=paths(M+'lealtab-vertical-frozen.svg')
REF={i:sha(d) for i,(g,d,t) in FH.items()}
assert all(sha(FV[i][1])==REF[i] for i in REF)
EXP_TR={'vertical':{'isotipo':FV['isotipo-pieza-l'][2],'wordmark':FV['wm-L'][2]},'horizontal':{'isotipo':None,'wordmark':None},'isotipo':{'isotipo':None},'wordmark':{'wordmark':'translate(-282.16 -24.58)'}}
NEED={'horizontal':('isotipo','wordmark'),'vertical':('isotipo','wordmark'),'isotipo':('isotipo',),'wordmark':('wordmark',)}
res={'congelados':{'lealtab-master-frozen.svg':hashlib.sha256(open(M+'lealtab-master-frozen.svg','rb').read()).hexdigest(),
                   'lealtab-vertical-frozen.svg':hashlib.sha256(open(M+'lealtab-vertical-frozen.svg','rb').read()).hexdigest()},
     'd_congelados_sha256':REF,'archivos':{}}
total_ok=True
files=sorted(glob.glob(S+'lealtab-*.svg'))+[S+'sistema-variantes.svg']*os.path.exists(S+'sistema-variantes.svg')
for fp in files:
    name=os.path.basename(fp); P,allp,root=paths(fp); errs=[]
    if name=='sistema-variantes.svg':
        kinds=('isotipo','wordmark'); tr_ok=True
    else:
        lock=name.split('-')[1]; kinds=NEED[lock]
        for k in kinds:
            got={t for i,(g,d,t) in P.items() if g==k}
            if got!={EXP_TR[lock][k]}: errs.append(f'transform de #{k}: {got}')
    exp=[i for i in REF if (i.startswith('isotipo') and 'isotipo' in kinds) or (i.startswith('wm-') and 'wordmark' in kinds)]
    det={}
    for i in exp:
        if i not in P: errs.append(f'falta {i}'); continue
        ok=sha(P[i][1])==REF[i]; det[i]=ok
        if not ok: errs.append(f'd distinto en {i}')
    extra=[i for i in allp if i not in exp]
    if extra: errs.append(f'paths extra: {extra}')
    res['archivos'][name]={'paths_verificados':len(det),'paths_identicos':sum(det.values()),'ok':not errs,'errores':errs,
                           'sha256_archivo':hashlib.sha256(open(fp,'rb').read()).hexdigest()}
    total_ok&=not errs
res['resumen']={'archivos':len(res['archivos']),'todos_ok':total_ok,'paths_comparados':sum(v['paths_verificados'] for v in res['archivos'].values())}
json.dump(res,open(S+'verificacion-paths.json','w'),indent=1,ensure_ascii=False)
print(json.dumps(res['resumen']),[k for k,v in res['archivos'].items() if not v['ok']])
