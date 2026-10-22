# syntax=docker/dockerfile:1
# Imagen de la app para el entorno local (arquitectura.md §2.3, ADR-005).
# En producción Vercel compila web/; este contenedor no se despliega (RNF-STK-14).

# --- base: Node 24 y pnpm fijado al de packageManager ---
FROM node:24-slim AS base
ENV PNPM_HOME=/pnpm \
    PATH=/pnpm:$PATH \
    NEXT_TELEMETRY_DISABLED=1
RUN corepack enable && corepack prepare pnpm@10.28.2 --activate
WORKDIR /app

# --- deps: solo manifiestos, para cachear la instalación ---
# pnpm-workspace.yaml lleva ignoredBuiltDependencies, que pnpm necesita para instalar igual que en el anfitrión.
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile

# --- dev: recarga en caliente; el código entra por bind mount ---
FROM deps AS dev
ENV NODE_ENV=development
RUN mkdir -p /app/.next && chown -R node:node /app
USER node
EXPOSE 3000
CMD ["pnpm", "dev", "-H", "0.0.0.0"]

# --- build: compila sin base de datos ni variables ---
FROM deps AS build
COPY . .
RUN NEXT_OUTPUT=standalone pnpm build

# --- runner: solo lo necesario para servir ---
FROM node:24-slim AS runner
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000
WORKDIR /app
RUN groupadd --system --gid 10001 app && useradd --system --uid 10001 --gid app --no-create-home app
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
USER app
EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3000/api/salud').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"]
CMD ["node", "server.js"]
