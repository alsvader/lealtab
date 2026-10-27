import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// Guardas de aislamiento (ADR-007 §2.6 y §2.8, arquitectura.md §5.7): el navegador nunca habla con Supabase.
const PATRON_SUPABASE = /^@supabase\/|(^|\/)lib\/supabase(\/|$)/;

const reglaSinSupabaseEnCliente = {
  meta: {
    type: "problem",
    schema: [],
    messages: {
      prohibido:
        "Un componente de cliente ('use client') no puede importar Supabase ni src/lib/supabase: el navegador nunca habla con Supabase (RNF-STK-10).",
    },
  },
  create(context) {
    let esCliente = false;
    return {
      Program(node) {
        esCliente = node.body.some(
          (n) => n.type === "ExpressionStatement" && n.directive === "use client",
        );
      },
      ImportDeclaration(node) {
        if (esCliente && PATRON_SUPABASE.test(String(node.source.value))) {
          context.report({ node, messageId: "prohibido" });
        }
      },
    };
  },
};

const sinSupabase = (mensaje) => ({
  patterns: [
    { group: ["@supabase/*"], message: mensaje },
    { group: ["@/lib/supabase", "@/lib/supabase/*", "**/lib/supabase", "**/lib/supabase/*"], message: mensaje },
  ],
});

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Logos, íconos e ilustraciones de marca son SVG ya optimizados: next/image no aporta nada
      // con SVG y la v1.7 usa <img> con width/height. Se permite <img>.
      "@next/next/no-img-element": "off",
    },
  },
  {
    plugins: { lealtab: { rules: { "no-supabase-en-cliente": reglaSinSupabaseEnCliente } } },
    rules: {
      "lealtab/no-supabase-en-cliente": "error",
      // `createBrowserClient` no existe en este producto.
      "no-restricted-imports": [
        "error",
        { paths: [{ name: "@supabase/ssr", importNames: ["createBrowserClient"], message: "No hay cliente de Supabase en el navegador (ADR-003 §2.4)." }] },
      ],
    },
  },
  // `@supabase/*` solo dentro de src/lib/supabase (con server-only) y en pruebas y scripts.
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/lib/supabase/**", "src/test/**", "**/*.test.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [{ name: "@supabase/ssr", importNames: ["createBrowserClient"], message: "No hay cliente de Supabase en el navegador (ADR-003 §2.4)." }],
          patterns: [{ group: ["@supabase/*"], message: "`@supabase/*` solo se importa dentro de src/lib/supabase (arquitectura.md §5.7)." }],
        },
      ],
    },
  },
  // La landing y sus componentes no importan nada de Supabase.
  {
    files: ["src/components/landing/**/*.{ts,tsx}", "src/app/(landing)/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", sinSupabase("La landing no importa Supabase ni src/lib/supabase (ADR-007 §2.6).")],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
