import { RevealObserver } from "@/components/ui/RevealObserver";
import { BtnCta } from "@/components/ui/BtnCta";
import { revealDelay } from "@/lib/reveal";

export default function Page() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: "<div class=\"wrap\" id=\"t-wrap\" style=\"padding-top:40px\">\n  <h1 id=\"t-h1\">Haz que tus clientes siempre regresen.</h1>\n  <h2 id=\"t-h2\">Tres pasos y tu tarjeta de cartón se queda en el cajón.</h2>\n  <h3 id=\"t-h3\">Crea tu tarjeta.</h3>\n  <p class=\"lead\" id=\"t-lead\">Tu tarjeta de lealtad, ahora en el celular de tus clientes. La instalan con un toque, sin descargar nada.</p>\n  <p class=\"caption\">Caption 12 px</p>\n  <span class=\"label\">Cómo funciona</span>\n  <p id=\"t-p\">Párrafo normal con <strong>negritas</strong> y un <a href=\"#x\">enlace</a>.</p>\n  <section class=\"section\" id=\"t-section\"><div class=\"stack\" id=\"t-stack\"><p>a</p><p>b</p></div><div class=\"stack-sm\"><p>a</p><p>b</p></div><div class=\"stack-lg\"><p>a</p><p>b</p></div></section>\n  <div class=\"section-tight\"><div class=\"center\"><div class=\"center-block\">centro</div></div></div>\n  <div class=\"btn-row\" id=\"t-btnrow\">\n    <button class=\"btn btn-primary btn-lg\" type=\"button\">Primario grande</button>\n    <a class=\"btn btn-secondary btn-md\" href=\"#t\">Secundario medio</a>\n    <button class=\"btn btn-secondary btn-sm\" type=\"button\">Chico</button>\n  </div>\n  <div class=\"card card-pad\" id=\"t-card\"><h3>Card</h3><p>Texto de la tarjeta</p></div>\n  <p><a class=\"btn-cta\" href=\"#t\" id=\"t-cta\"><span class=\"btn-cta-label\">Crea tu tarjeta gratis</span><span class=\"btn-cta-arrow\" aria-hidden=\"true\"><svg width=\"22\" height=\"22\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12h15M13 6l6 6-6 6\"/></svg></span></a></p>\n  <p><a class=\"btn-cta btn-cta-sm\" href=\"#t\" id=\"t-ctasm\"><span class=\"btn-cta-label\">Empieza gratis</span><span class=\"btn-cta-arrow\" aria-hidden=\"true\"><svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.5\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M4 12h15M13 6l6 6-6 6\"/></svg></span></a></p>\n  <p><a class=\"link-arrow\" href=\"#como-funciona\" id=\"t-link\">Ver cómo funciona ↓</a></p>\n  <span class=\"pwa-badge\" id=\"t-badge\">BN</span>\n  <div class=\"aro-ui\" id=\"t-aro\" style=\"width:68px;height:68px\"><svg viewBox=\"0 0 100 100\"><g fill=\"none\" stroke-width=\"12\"><circle class=\"track\" cx=\"50\" cy=\"50\" r=\"42\"/><circle class=\"fill\" cx=\"50\" cy=\"50\" r=\"42\" pathLength=\"100\" stroke-linecap=\"round\" stroke-dasharray=\"80 100\" transform=\"rotate(-90 50 50)\"/><circle class=\"tip\" cx=\"50\" cy=\"50\" r=\"42\" pathLength=\"100\" stroke-linecap=\"round\" stroke-dasharray=\"3 97\" stroke-dashoffset=\"-86\" transform=\"rotate(-90 50 50)\"/></g></svg><span class=\"aro-ui-num\">4/5<small>cortes</small></span></div>\n  <div class=\"flip-inner\" id=\"t-flip\" style=\"height:60px\"><div class=\"face\">frente</div><div class=\"face face-back\">atrás</div></div>\n  <div class=\"sec-head center-block\" id=\"t-sechead\"><h2 class=\"reveal is-visible\">Encabezado</h2><p class=\"lead\">Lead</p></div>\n  <ul id=\"t-ul\"><li>Uno</li><li>Dos</li></ul>\n  <div class=\"mt-5\" id=\"t-mt5\">mt5</div><div class=\"mt-6\" id=\"t-mt6\">mt6</div>\n  <input class=\"x\" type=\"text\" value=\"x\" id=\"t-input\"><dl id=\"t-dl\"><dt>dt</dt><dd>dd</dd></dl>\n</div>\n" }} />
      <div className="wrap" style={{ paddingTop: 1400 }}>
        <BtnCta href="#x" data-hero-cta size="sm" className="extra">Hola BtnCta</BtnCta>
        <h2 className="reveal" id="r1">Titulo reveal</h2>
        <div data-reveal style={revealDelay(100)} id="d1">bloque 1</div>
        <ol>
          <li data-seen-group id="g1" className="paso">
            <div data-reveal id="d2">bloque en paso</div>
          </li>
        </ol>
        <article data-reveal data-settle id="plan" style={{ marginTop: 600 }}>plan</article>
        <p style={{ height: 600 }} />
      </div>
      <RevealObserver />
    </>
  );
}
