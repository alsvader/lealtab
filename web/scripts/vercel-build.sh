#!/bin/sh
# Build de Vercel (ADR-005 §2.5, arquitectura.md §2.5, RNF-STK-15).
# Compila primero: un error de compilación no deja la base adelantada.
# Migra solo con VERCEL_ENV=production. Cualquier otro entorno (preview, vacío, local)
# imprime «Vista previa: sin migraciones» y termina en 0.
#
# LT_OMITIR_BUILD=1 salta `next build` para probar la decisión de migración en local.
# Si VERCEL=1, esa variable se rechaza: en Vercel el build siempre corre.
set -eu
cd "$(dirname "$0")/.."

if [ "${LT_OMITIR_BUILD:-}" = "1" ]; then
  if [ "${VERCEL:-}" = "1" ]; then
    echo "LT_OMITIR_BUILD no se permite en Vercel." >&2
    exit 1
  fi
else
  pnpm exec next build
fi

if [ "${VERCEL_ENV:-}" = "production" ]; then
  if [ -z "${SUPABASE_DB_URL_MIGRACIONES:-}" ]; then
    echo "Falta SUPABASE_DB_URL_MIGRACIONES. El build de producción no migra sin la URL del pooler." >&2
    exit 1
  fi
  echo "Migraciones: dry-run"
  pnpm exec supabase db push --dry-run --db-url "$SUPABASE_DB_URL_MIGRACIONES"
  echo "Migraciones: push"
  pnpm exec supabase db push --yes --db-url "$SUPABASE_DB_URL_MIGRACIONES"
else
  echo "Vista previa: sin migraciones"
fi
