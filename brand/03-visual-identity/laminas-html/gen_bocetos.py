import r2_sketch as S
import iso2, iso4, iso5, fin
from iso2 import path
B='#0F4D3A'
def P(g): return f'<path fill="{B}" fill-rule="evenodd" d="{path(g)}"/>'
SK={n:(i,g) for n,i,g in S.SK}
V={'Encaje':('fin','La pieza de vuelta encaja en la L.'),
'Pliegue':('x','Se lee “LJ” o U; el doblez no se entiende en un color.'),
'Ligadura':('x','Refinada se lee “U+”: demasiado cerca de LG U+.'),
'Umbral':('evo','Arco + punto: candado o persona. Evoluciona a Pásale.'),
'Bucle ℓ':('x','Lazo = Lasso (competidor en México); ℓ genérica.'),
'Huellas':('x','Ilustrativa; a 16 px son dos manchas.'),
'Mosaico':('x','2×2 ≈ Windows / Fidelity. Evoluciona a Visitas.'),
'Ritmo L':('x','Se lee como gráfica de barras o señal.'),
'Vínculo':('x','Ícono de sincronizar / eslabón.'),
'Horizonte':('x','Amanecer genérico, miles de logos.'),
'Ojal':('x','Se lee “P”: estacionamiento, Pinterest, Slice.'),
'Pétalos':('x','L de hojas: cliché eco de stock.'),
'Puerta L':('x','Bloque cuadrado: se lee tarjeta.'),
'Ciclo T':('x','Hongo o paraguas.'),
'Local':('x','L-edificio con puerta: género inmobiliario de stock.'),
'Golondrina':('x','“Siempre regresan”, pero ilustrativa y ruidosa a 16 px.'),
'Conteo':('x','Palitos + vuelta: se lee 卌, puente o código.'),
'Vuelta':('fin','Contraforma: la L vive dentro de la vuelta.'),
'Pásale':('fin','Umbral en L con puerta entreabierta.'),
'Visitas':('fin','Se arma por piezas, una por visita.')}
NEW={'Local':('L-edificio con puerta y ventana en arco.',P(iso2.local())),
'Golondrina':('Las golondrinas siempre regresan.',P(iso4.golondrina())),
'Conteo':('Tres palitos y la vuelta que los cierra.',P(iso5.conteo())),
'Vuelta':('Un cuarto de vuelta con una L en su contraforma.',P(fin.vuelta())),
'Pásale':('Marco en L y puerta entreabierta.',P(fin.pasale())),
'Visitas':('Tres módulos que arman la L, uno por visita.',P(fin.visitas()))}
order=[n for n,_,_ in S.SK]+list(NEW)
cells=''
for i,n in enumerate(order,1):
    idea,g=SK[n] if n in SK else NEW[n]
    st,why=V[n]
    tag={'fin':('Finalista','var(--durazno)'),'evo':('Evoluciona','var(--menta)'),'x':('Descartada','#E4DED2')}[st]
    cells+=f'''<div class="c{' pk' if st=='fin' else ''}"><div class="top"><span class="num">{i:02d}</span><span class="stk flat" style="background:{tag[1]}">{tag[0]}</span></div>
<svg viewBox="0 0 64 64" width="96" height="96" style="opacity:{1 if st!='x' else .78}">{g}</svg>
<div class="sm"><svg viewBox="0 0 64 64" width="32" height="32">{g}</svg><svg viewBox="0 0 64 64" width="16" height="16">{g}</svg></div>
<div class="n disp">{n}</div><div class="i">{idea}</div><div class="w"><b>{'Por qué sigue' if st=='fin' else 'Veredicto'}:</b> {why}</div></div>'''
html=f'''<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=Manrope:wght@400;500;600;700;800&display=block" rel="stylesheet"><link rel="stylesheet" href="ciclo-v2.css">
<style>.wrap{{padding:22px 30px;height:1000px;box-sizing:border-box;display:flex;flex-direction:column;gap:12px}}
h1{{font-size:40px;line-height:.9;text-transform:uppercase}}
.g{{display:grid;grid-template-columns:repeat(7,1fr);grid-template-rows:repeat(3,1fr);gap:12px;flex:1;min-height:0}}
.c{{position:relative;border:var(--b);border-radius:12px;background:var(--claro);padding:8px 10px;display:flex;flex-direction:column;align-items:center;gap:4px}}
.pk{{box-shadow:5px 5px 0 var(--noche)}}.top{{display:flex;justify-content:space-between;width:100%;align-items:center}}
.num{{font-size:11px;font-weight:800}}.sm{{display:flex;gap:10px;align-items:end}}.n{{font-size:19px;text-transform:uppercase;line-height:1}}
.i{{font-size:10.5px;text-align:center;line-height:1.3;color:#2E4A40}}.w{{font-size:10px;line-height:1.3;color:#4D635A;text-align:center;margin-top:auto;border-top:1px dashed #4D635A;padding-top:4px;width:100%}}
.leg{{display:flex;flex-direction:column;justify-content:center;gap:8px;font-size:12px;line-height:1.4;color:#2E4A40;padding:6px 4px}}</style></head><body><div class="wrap">
<div style="display:flex;justify-content:space-between;align-items:flex-end"><div><div class="lbl" style="margin-bottom:6px">LealTab · Fase 3 · Isotipo ronda 2 · Lámina interna de bocetos</div><h1 class="disp">20 ideas, 4 finalistas</h1></div>
<div style="font-size:12px;max-width:640px;text-align:right;line-height:1.45;color:#2E4A40">Bocetos rápidos a 96, 32 y 16 px. Se descartó todo lo que se lee como letra ajena, ícono de sistema, género de stock o un competidor. Las finalistas llevan sombra dura.</div></div>
<div class="g">{cells}<div class="leg"><div><b>Criterios</b></div><div>1. Idea de Ciclo legible sin explicación.</div><div>2. Que no sea solo un aro ni una tarjeta.</div><div>3. Se sostiene a 16 px, un color y negativo.</div><div>4. Sin parecido claro con marcas conocidas.</div></div></div>
</div></body></html>'''
open('isotipo-r2-bocetos.html','w').write(html)
