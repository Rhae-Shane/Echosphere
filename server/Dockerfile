# ---- Base: install deps (skip esbuild postinstall — not needed for tsc build) ----
FROM node:20-bookworm-slim AS base
WORKDIR /app

ENV CI=true
ENV npm_config_update_notifier=false

# Native modules (bcrypt) + Prisma engines
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY prisma ./prisma

RUN npm ci --ignore-scripts \
    && npm rebuild bcrypt @prisma/engines --foreground-scripts \
    && npx prisma generate

# ---- Build stage ----
FROM base AS build
WORKDIR /app

COPY tsconfig.json ./
COPY src ./src

RUN npm run build

# ---- Production runtime ----
FROM node:20-bookworm-slim AS prod
WORKDIR /app

ENV NODE_ENV=production
ENV CI=true

RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY prisma ./prisma

# Production deps only; prisma CLI kept for migrate deploy
RUN npm ci --omit=dev --ignore-scripts \
    && npm install prisma@^5.14.0 --no-save \
    && npm rebuild bcrypt @prisma/engines --foreground-scripts \
    && npx prisma generate

COPY --from=build /app/dist ./dist

EXPOSE 5000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
