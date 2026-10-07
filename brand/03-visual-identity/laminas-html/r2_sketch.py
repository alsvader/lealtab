B='#0F4D3A'
S=lambda d,w=10: f'<path d="{d}" fill="none" stroke="{B}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"/>'
F=lambda d: f'<path d="{d}" fill="{B}" fill-rule="evenodd"/>'
SK=[
('Encaje','L + pieza de un cuarto de aro que encaja: el cliente completa al negocio.',
 F('M10 14a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v22h22a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4Z')+F('M33 31V10a21 21 0 0 1 21 21Z')),
('Pliegue','Cinta que forma una L y se dobla hacia arriba: la vuelta en U del regreso.',
 F('M10 12a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v28h16v14H14a4 4 0 0 1-4-4Z')+F('M42 54V40h12v14Z')+F('M42 37V22a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v14Z')),
('Ligadura','Monograma l+t en un solo trazo; la cola de la t regresa hacia la l.',
 S('M20 8V44a10 10 0 0 0 10 10h2')+S('M30 22h20')+S('M40 12V42a10 10 0 0 0 10 10h3',10)),
('Umbral','Arco de puerta con alguien que llega: regresar al lugar de siempre.',
 S('M16 56V30a16 16 0 0 1 32 0V56')+'<circle cx="32" cy="46" r="7" fill="#0F4D3A"/>'),
('Bucle ℓ','La l cursiva con un lazo: el cliente da la vuelta y regresa.',
 S('M12 50C26 44 44 30 44 18a8 8 0 0 0-16 0c0 14 0 28 6 32s12 2 18-2')),
('Huellas','Dos pisadas sobre un arco: el camino de regreso.',
 '<ellipse cx="22" cy="40" rx="8" ry="13" transform="rotate(-20 22 40)" fill="#0F4D3A"/><ellipse cx="42" cy="24" rx="8" ry="13" transform="rotate(20 42 24)" fill="#0F4D3A"/>'),
('Mosaico','Cuatro módulos que se arman con cada visita.',
 F('M10 10h20v20H10Z')+F('M34 30V10a20 20 0 0 1 20 20Z')+F('M30 34v20a20 20 0 0 1-20-20Z')+F('M34 34h20v20H34Z')),
('Ritmo L','Una L hecha de barras que crecen: visitas que se acumulan.',
 F('M10 10h10v44H10Z')+F('M24 44h10v10H24Z')+F('M38 36h8v18h-8Z')+F('M50 28h6v26h-6Z')),
('Vínculo','Dos medias lunas que se enlazan: negocio y cliente.',
 S('M30 14a16 16 0 1 0 0 32',10)+S('M34 18a16 16 0 1 1 0 32',10)),
('Horizonte','Un sol que vuelve a salir sobre la línea.',
 S('M14 42a18 18 0 0 1 36 0')+S('M8 54h48')),
('Ojal','Una pestaña con ojal: el "tab" que se jala para volver.',
 F('M14 8h22a20 20 0 0 1 0 40H30v8H14Z M32 18a10 10 0 1 0 0.01 0Z')),
('Pétalos','Dos hojas que giran una tras otra.',
 F('M32 32C32 16 20 8 10 8c0 14 8 24 22 24Z')+F('M32 32c0 16 12 24 22 24c0-14-8-24-22-24Z')),
('Puerta L','Bloque con una ranura en L que lo divide en dos piezas que encajan.',
 F('M14 8h36a6 6 0 0 1 6 6v36a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6V14a6 6 0 0 1 6-6Z M24 8v28h32v6H18V8Z')),
('Ciclo T','Una T cuyo travesaño se curva y regresa como arco.',
 S('M32 22V56')+S('M10 22a22 14 0 0 1 44 0',10)),
]
PICK={'Encaje','Pliegue','Ligadura','Umbral'}
cells=''
for i,(n,idea,g) in enumerate(SK,1):
    pk=n in PICK
    cells+=f'''<div class="c{' pk' if pk else ''}"><div class="num">{i:02d}</div><svg viewBox="0 0 64 64" width="150" height="150">{g}</svg>
<div class="sm"><svg viewBox="0 0 64 64" width="32" height="32">{g}</svg><svg viewBox="0 0 64 64" width="16" height="16">{g}</svg></div>
<div class="n disp">{n}</div><div class="i">{idea}</div>{'<span class="stk flat" style="background:var(--durazno);position:absolute;top:10px;right:10px">Pasa a refinar</span>' if pk else ''}</div>'''
open('sk_cells.html','w').write(cells)
