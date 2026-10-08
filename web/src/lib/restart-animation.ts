/**
 * Reinicia una animación CSS: quita la clase, fuerza un reflow y la vuelve a poner
 * (v1.7: `el.classList.remove(c); void el.offsetWidth; el.classList.add(c)`).
 * Usa getBoundingClientRect() porque offsetWidth no existe en elementos SVG.
 *
 * Solo toca `classList` del DOM: el `className` del elemento en React debe ser estático
 * (si cambia entre renders, React reescribe el atributo y borra la clase) o llamarse
 * después del commit (efecto).
 */
export function restartAnimation(el: Element | null | undefined, className: string): void {
  if (!el) return;
  el.classList.remove(className);
  void el.getBoundingClientRect();
  el.classList.add(className);
}
