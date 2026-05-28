# syntax=docker/dockerfile:1

# ---- builder: install deps + build Next.js standalone in one stage ----
# Merging avoids a class of multi-stage / BuildKit quirks where COPY --from
# can silently drop dependency binaries; also no build-cache to lose since
# CI runners are fresh anyway.
FROM node:20-alpine AS builder
WORKDIR /app
# Default to npmjs.org (works on GitHub Actions runners abroad).
# Local builds in China override via: --build-arg NPM_REGISTRY=https://registry.npmmirror.com
ARG NPM_REGISTRY=https://registry.npmjs.org
# node:20 ships npm 10.8.2 which has a known "Exit handler never called" bug
# during `npm ci` on alpine. Upgrade to npm 11 before installing deps.
RUN npm install -g npm@11 --registry=${NPM_REGISTRY} --no-audit --no-fund
COPY package.json package-lock.json* ./
# package-lock.json's `resolved` URLs are pinned to the corp bnpm.byted.org
# (only resolvable on the corp dev box). Rewrite them to NPM_REGISTRY so the
# same lockfile works in CI (npmjs.org) and locally (npmmirror.com).
RUN sed -i "s|https://bnpm.byted.org|${NPM_REGISTRY}|g" package-lock.json
RUN set -ex \
 && npm ci --registry=${NPM_REGISTRY} --include=optional --no-audit --no-fund \
 && test -x node_modules/.bin/next \
 && echo "next binary OK: $(node_modules/.bin/next --version 2>&1 | tail -1)"
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- runner: minimal runtime image ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
# PORT / HOSTNAME are overridden at runtime via --env-file (default 0.0.0.0:3000)
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
