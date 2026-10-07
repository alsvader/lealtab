"""Iconografía del sistema · rejilla 24 · trazo 2 · remates redondos · esquinas con la proporción del isotipo."""
from comun import *
C=lambda cx,cy,r:arc(cx,cy,r,0,360)
P=poly
def rrect(x,y,w,h): return P([(x,y),(x+w,y),(x+w,y+h),(x,y+h)],closed=True)
I={}  # nombre: (etiqueta, [trazos], [rellenos activos])
I['visita']=('Visita',[arc(12,12,8,0,292),C(12,12,2.2)],[C(12,12,2.2)])
I['recompensa']=('Recompensa',[C(12,9,6),P([(8.6,14),(7.2,21),(10,19.6),(12,21.2)]),P([(15.4,14),(16.8,21),(14,19.6),(12,21.2)])],[C(12,9,6)])
I['cliente']=('Cliente',[C(12,7.5,3.5),'M5 20.5A7 7 0 0 1 19 20.5'],[C(12,7.5,3.5),'M5 20.5A7 7 0 0 1 19 20.5Z'])
I['negocio']=('Negocio',['M3 9A3 3 0 0 0 9 9A3 3 0 0 0 15 9A3 3 0 0 0 21 9',P([(3,9),(4.6,3.5),(19.4,3.5),(21,9)]),P([(5,12.5),(5,20.5),(19,20.5),(19,12.5)]),P([(10,20.5),(10,15.5),(14,15.5),(14,20.5)])],
            [P([(3,9),(4.6,3.5),(19.4,3.5),(21,9)],closed=True)+'M3 9A3 3 0 0 0 9 9A3 3 0 0 0 15 9A3 3 0 0 0 21 9Z'])
I['escanear']=('Escanear QR',[P([(3,8),(3,3),(8,3)]),P([(16,3),(21,3),(21,8)]),P([(21,16),(21,21),(16,21)]),P([(8,21),(3,21),(3,16)]),rrect(7.5,7.5,9,9),'M7.5 12H16.5'],[rrect(7.5,7.5,9,9)])
I['aviso']=('Notificación',['M5.5 17V11A6.5 6.5 0 0 1 18.5 11V17','M3.5 17H20.5','M10 20.5H14','M12 2.8V4.5'],['M5.5 17V11A6.5 6.5 0 0 1 18.5 11V17Z'])
I['calendario']=('Calendario',[rrect(3.5,5,17,16),'M8 3V7','M16 3V7','M3.5 10.5H20.5','M8 15H11'],[rrect(3.5,5,17,16)])
I['estadisticas']=('Estadísticas',[P([(3.5,3.5),(3.5,20.5),(20.5,20.5)]),'M8.5 16V13','M13 16V9','M17.5 16V5.5'],[P([(3.5,3.5),(20.5,3.5),(20.5,20.5),(3.5,20.5)],closed=True)])
I['ajustes']=('Configuración',['M3.5 7H6.5','M11.5 7H20.5',C(9,7,2.5),'M3.5 17H12.5','M17.5 17H20.5',C(15,17,2.5)],[C(9,7,2.5),C(15,17,2.5)])
I['compartir']=('Compartir',[P([(8.5,10),(5,10),(5,21),(19,21),(19,10),(15.5,10)]),'M12 14.5V3','M8.5 6.5L12 3L15.5 6.5'],[P([(5,10),(19,10),(19,21),(5,21)],closed=True)])
I['mensaje']=('Mensaje',[P([(3,4),(21,4),(21,17),(10.5,17),(6,21),(6,17),(3,17)],closed=True),'M7.5 9H16.5','M7.5 12.5H13'],[P([(3,4),(21,4),(21,17),(10.5,17),(6,21),(6,17),(3,17)],closed=True)])
I['ubicacion']=('Ubicación',['M12 21.5C12 21.5 5 15.3 5 9.8A7 7 0 0 1 19 9.8C19 15.3 12 21.5 12 21.5Z',C(12,9.8,2.6)],['M12 21.5C12 21.5 5 15.3 5 9.8A7 7 0 0 1 19 9.8C19 15.3 12 21.5 12 21.5Z'])
I['regalo']=('Regalo',[rrect(3,8,18,4.5),P([(4.8,12.5),(4.8,21),(19.2,21),(19.2,12.5)]),'M12 8V21','M12 8C10.5 4.2 6.6 3.2 6.6 5.8C6.6 7.3 8 8 9.5 8','M12 8C13.5 4.2 17.4 3.2 17.4 5.8C17.4 7.3 16 8 14.5 8'],[rrect(3,8,18,4.5),P([(4.8,12.5),(19.2,12.5),(19.2,21),(4.8,21)],closed=True)])
I['check']=('Listo',['M5 12.5L10 17.5L19.5 6.5'],[C(12,12,10.5)])
I['agregar']=('Agregar',['M12 5V19','M5 12H19'],[C(12,12,10.5)])
I['buscar']=('Buscar',[arc(10.5,10.5,6.5,-20,290),'M15.5 15.5L20.5 20.5'],[C(10.5,10.5,6.5)])
I['inicio']=('Inicio',[P([(3,11),(12,3.5),(21,11)]),P([(5.5,9.5),(5.5,20.5),(18.5,20.5),(18.5,9.5)]),P([(10,20.5),(10,15),(14,15),(14,20.5)])],[P([(5.5,9),(12,3.8),(18.5,9),(18.5,20.5),(5.5,20.5)],closed=True)])
I['perfil']=('Perfil',[arc(12,12,9,25,335),C(12,10,3),'M6.6 18.4A6.4 5.4 0 0 1 17.4 18.4'],[C(12,12,9)])
ORDEN=list(I)
def glyph(k,activo=False,sw=2,col=NOCHE,fill=MENTA):
    _,ls,fs=I[k]; o=''
    if activo: o+=''.join(f'<path d="{d}" fill="{fill}"/>' for d in fs)
    o+=f'<g fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round">'+''.join(f'<path d="{d}"/>' for d in ls)+'</g>'
    return o
if __name__=='__main__':
    for k in ORDEN:
        lab=I[k][0]
        write(f'iconos/linea/lt-icono-{k}.svg',svgdoc(24,24,glyph(k),f'LealTab · ícono {lab} · línea','Rejilla 24 · trazo 2 noche · remates redondos · Aprobado 2026-10-06'))
        write(f'iconos/activo/lt-icono-{k}-activo.svg',svgdoc(24,24,glyph(k,True),f'LealTab · ícono {lab} · activo','Relleno plano menta gris #CFE3D6 + trazo noche · Aprobado 2026-10-06'))
    # sprite con <symbol>
    sym=''.join(f'<symbol id="lt-{k}" viewBox="0 0 24 24">{glyph(k,sw=2,col="currentColor")}</symbol><symbol id="lt-{k}-activo" viewBox="0 0 24 24">{glyph(k,True,col="currentColor")}</symbol>' for k in ORDEN)
    write('iconos/lt-iconos-sprite.svg',f'<svg xmlns="http://www.w3.org/2000/svg" style="display:none"><title>LealTab · sprite de íconos (aprobado 2026-10-06)</title>{sym}</svg>\n')
    print(len(ORDEN),'íconos')
