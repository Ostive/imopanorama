# syntax=docker/dockerfile:1
# ─────────────────────────────────────────────
# Stage 1 — deps
# ─────────────────────────────────────────────
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm ci

# ─────────────────────────────────────────────
# Stage 2 — builder
# ─────────────────────────────────────────────
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client (required before build)
RUN npx prisma generate

# Build Next.js (standalone output)
# NODE_OPTIONS caps V8's heap so it triggers GC before the host OOM-kills the
# build (Next.js's TypeScript-checking pass is the most memory-hungry phase).
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=3072"
RUN npm run build

# Strip Prisma packages not needed at runtime (~150 MB saved):
# - studio-core / dev: CLI-only tools
# - engines: schema migration engine (not used by the WASM query client)
# - non-postgresql WASM engines: only postgresql is used
RUN rm -rf \
    node_modules/@prisma/studio-core \
    node_modules/@prisma/dev \
    node_modules/@prisma/engines && \
    rm -f \
    node_modules/@prisma/client/runtime/*cockroachdb* \
    node_modules/@prisma/client/runtime/*mysql* \
    node_modules/@prisma/client/runtime/*sqlite* \
    node_modules/@prisma/client/runtime/*sqlserver*

# ─────────────────────────────────────────────
# Stage 3 — runner (minimal production image)
# ─────────────────────────────────────────────
FROM node:22-alpine AS runner
RUN apk add --no-cache openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser  --system --uid 1001 nextjs

# Static assets
COPY --from=builder /app/public ./public

# Standalone server + static chunks
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static    ./.next/static

# Prisma: generated client + postgresql WASM runtime only (standalone already has @prisma/client traced)
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma/client/runtime ./node_modules/@prisma/client/runtime
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma/client/package.json ./node_modules/@prisma/client/package.json

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
