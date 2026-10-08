/**
 * Contrato entre el contenido legal (privacy.ts, terms.ts) y las páginas que lo pintan.
 * El texto se escribe plano; los enlaces y correos se marcan con `links` por bloque.
 */

/** Un fragmento de texto o un enlace dentro de un párrafo o un elemento de lista. */
export type Inline = string | { text: string; href: string };

/** Párrafo o lista: los dos únicos bloques que usan los documentos legales. */
export type LegalBlock =
  | { type: "p"; content: Inline[] }
  | { type: "ul"; items: Inline[][] };

export interface LegalSection {
  /** Ancla estable en kebab-case, p. ej. "datos-que-recabamos". */
  id: string;
  /** Título visible, sin número (la página numera las secciones). */
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalDocument {
  /** <h1> y base del <title>. */
  title: string;
  /** Descripción corta para la meta description. */
  description: string;
  /** Fecha visible de "Última actualización", p. ej. "7 de octubre de 2026". */
  updatedAt: string;
  /** Fecha ISO de la misma actualización, p. ej. "2026-10-07" (para <time dateTime>). */
  updatedAtIso: string;
  /** Párrafos introductorios antes de la primera sección. */
  intro: LegalBlock[];
  sections: LegalSection[];
}
