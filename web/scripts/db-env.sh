#!/bin/sh
# Escribe las variables de Supabase local en .env.local desde `supabase status -o env`.
# Conserva el resto del archivo. Depende de T3 (supabase/config.toml) y de `pnpm db:up`.
# [SUPUESTO] los nombres PUBLISHABLE_KEY y SECRET_KEY de `status -o env` en CLI 2.121.0; se verifica en T3.
set -eu
[ -f .env.local ] || cp .env.local.example .env.local
estado=$(pnpm exec supabase status -o env)
valor() { printf '%s\n' "$estado" | sed -n "s/^$1=\"\{0,1\}\([^\"]*\)\"\{0,1\}$/\1/p" | head -n 1; }
poner() {
  [ -n "$2" ] || { echo "No se encontró $1 en supabase status" >&2; exit 1; }
  grep -v "^$1=" .env.local > .env.local.tmp || true
  printf '%s=%s\n' "$1" "$2" >> .env.local.tmp
  mv .env.local.tmp .env.local
}
poner SUPABASE_URL "$(valor API_URL)"
poner SUPABASE_PUBLISHABLE_KEY "$(valor PUBLISHABLE_KEY)"
poner SUPABASE_SECRET_KEY "$(valor SECRET_KEY)"
poner SUPABASE_DB_URL "$(valor DB_URL)"
echo ".env.local actualizado"
