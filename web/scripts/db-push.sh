#!/bin/sh
# Push manual de migraciones (ADR-005 §2.5).
#   sh scripts/db-push.sh            usa SUPABASE_DB_URL_MIGRACIONES
#   sh scripts/db-push.sh --pruebas  usa SUPABASE_DB_URL_PRUEBAS
#
# Candado: una URL de producción no se migra fuera de Vercel
# (VERCEL=1 y VERCEL_ENV=production) sin LT_CONFIRMA_PRODUCCION=1.
# Es producción si la URL contiene SUPABASE_REF_PRODUCCION, o si apunta a un
# host de Supabase alojado y no contiene SUPABASE_REF_PRUEBAS.
# No imprime la URL: trae la contraseña.
set -eu
cd "$(dirname "$0")/.."

# Rellena solo lo que el entorno todavía no trae. Lo ya exportado manda.
if [ -f .env.local ]; then
  while IFS= read -r linea || [ -n "$linea" ]; do
    case "$linea" in
      ''|\#*) continue ;;
    esac
    nombre=${linea%%=*}
    valor=${linea#*=}
    case "$nombre" in
      *[!A-Za-z0-9_]*) continue ;;
    esac
    if eval "[ \"\${$nombre+x}\" != x ]"; then
      case "$valor" in
        \"*\") valor=${valor#\"}; valor=${valor%\"} ;;
        \'*\') valor=${valor#\'}; valor=${valor%\'} ;;
      esac
      export "$nombre=$valor"
    fi
  done < .env.local
fi

if [ "${1:-}" = "--pruebas" ]; then
  url=${SUPABASE_DB_URL_PRUEBAS:-}
  if [ -z "$url" ]; then
    echo "Falta SUPABASE_DB_URL_PRUEBAS." >&2
    exit 1
  fi
else
  url=${SUPABASE_DB_URL_MIGRACIONES:-}
  if [ -z "$url" ]; then
    echo "Falta SUPABASE_DB_URL_MIGRACIONES." >&2
    exit 1
  fi
fi

ref_prod=${SUPABASE_REF_PRODUCCION:-}
ref_pruebas=${SUPABASE_REF_PRUEBAS:-}
produccion=0
if [ -n "$ref_prod" ] && printf '%s' "$url" | grep -Fq -- "$ref_prod"; then
  produccion=1
elif printf '%s' "$url" | grep -Eq 'supabase\.(co|com)'; then
  if [ -z "$ref_pruebas" ] || ! printf '%s' "$url" | grep -Fq -- "$ref_pruebas"; then
    produccion=1
  fi
fi

en_vercel=0
if [ "${VERCEL:-}" = "1" ] && [ "${VERCEL_ENV:-}" = "production" ]; then
  en_vercel=1
fi
if [ "$produccion" = 1 ] && [ "$en_vercel" != 1 ] && [ "${LT_CONFIRMA_PRODUCCION:-}" != 1 ]; then
  echo "db-push se niega a migrar producción fuera de Vercel sin LT_CONFIRMA_PRODUCCION=1." >&2
  exit 1
fi

pnpm exec supabase db push --yes --db-url "$url"
