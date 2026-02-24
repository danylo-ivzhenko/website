# ── Stage 1: Dependencies ──
FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache openssl
COPY package.json package-lock.json ./
RUN npm ci

# ── Stage 2: Build ──
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ── Stage 3: Runner ──
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
RUN apk add --no-cache openssl

# Standard standalone output requires copying public and static manually
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy Prisma schema for migrations/push
COPY --from=builder /app/prisma ./prisma

# Create persistent folders and set ownership
# Standalone server runs as root by default unless specified
RUN mkdir -p /app/data /app/public/storage/logos

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Fix potential permissions
RUN chown -R root:root /app

CMD ["node", "server.js"]
