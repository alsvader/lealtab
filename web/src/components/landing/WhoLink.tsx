"use client";

import type { ReactNode } from "react";
import { SELECT_BIZ_EVENT, type BizKey, type SelectBizDetail } from "@/content/showcase";

interface WhoLinkProps {
  bizKey: BizKey;
  className?: string;
  children: ReactNode;
}

/**
 * "Ver su tarjeta" (v1.7 2589-2594: `.who-link[data-biz]`). Conserva el anclaje nativo a
 * `#la-tarjeta` y, al hacer clic, avisa a La tarjeta con qué negocio abrir. Quien escucha
 * (Showcase) hace el `setBiz` y el `spotlight`; aquí solo se emite.
 */
export function WhoLink({ bizKey, className, children }: WhoLinkProps) {
  return (
    <a
      className={className}
      href="#la-tarjeta"
      data-biz={bizKey}
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent<SelectBizDetail>(SELECT_BIZ_EVENT, { detail: { key: bizKey } }),
        )
      }
    >
      {children}
    </a>
  );
}
