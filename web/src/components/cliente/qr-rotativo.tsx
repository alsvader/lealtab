"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { bytesDeHex, hmacPaso } from "@/lib/qr/hmac";
import { contenidoQr, pasoDe } from "@/lib/qr/paso";
import { C3 } from "@/content/tarjeta";

/** El paso se recalcula en el teléfono. No vuelve a pedir la llave. */
export function QrRotativo({ tarjetaId, negocioId, llaveHex }: { tarjetaId: string; negocioId: string; llaveHex: string }) {
  const [contenido, setContenido] = useState("");
  const [src, setSrc] = useState("");

  useEffect(() => {
    let vivo = true;
    async function pintar() {
      const mac = await hmacPaso(bytesDeHex(llaveHex), tarjetaId, negocioId, pasoDe());
      const texto = contenidoQr(tarjetaId, pasoDe(), mac);
      if (!vivo) return;
      setContenido(texto);
      const url = await QRCode.toDataURL(texto, { margin: 1, width: 240, errorCorrectionLevel: "M" });
      if (vivo) setSrc(url);
    }
    const id = window.setInterval(() => void pintar(), 1000);
    void pintar();
    return () => {
      vivo = false;
      window.clearInterval(id);
    };
  }, [tarjetaId, negocioId, llaveHex]);

  return (
    // El contenido firmado vive en data-qr para la prueba del paso. La imagen es el código.
    <img alt={C3.muestra} width={240} height={240} src={src || undefined} data-qr={contenido} />
  );
}
