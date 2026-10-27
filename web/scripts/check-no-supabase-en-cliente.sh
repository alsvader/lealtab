#!/bin/sh
# Guarda de artefacto (ADR-007 §2.8, arquitectura.md §5.7): tras `pnpm build`, el JavaScript y el CSS
# que llegan al navegador (.next/static) no deben traer Supabase ni sus llaves.
set -eu
DIR=".next/static"
if [ ! -d "$DIR" ]; then
  echo "No existe $DIR: corre pnpm build antes de pnpm check:cliente." >&2
  exit 2
fi
fallo=0
for cadena in supabase sb_publishable sb_secret 127.0.0.1:54321; do
  if grep -rIil -e "$cadena" "$DIR" > .check-cliente.tmp 2>/dev/null; then
    echo "ERROR: "${cadena}" aparece en el código del navegador:" >&2
    sed 's/^/  /' .check-cliente.tmp >&2
    fallo=1
  fi
done
rm -f .check-cliente.tmp
if [ "$fallo" -ne 0 ]; then exit 1; fi
echo "OK: .next/static no contiene supabase, sb_publishable, sb_secret ni 127.0.0.1:54321."
