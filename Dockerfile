FROM node:22-alpine
WORKDIR /app

# Install openssl for Prisma
RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Fix Windows line endings in entrypoint script
RUN sed -i 's/\r$//' /app/docker-entrypoint.sh && chmod +x /app/docker-entrypoint.sh

RUN npx prisma generate
RUN npm run build

# Storage and data folders
RUN mkdir -p /app/public/storage/logos /app/data && \
    chown -R root:root /app

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production

# Use entrypoint that runs migrations + seed + path fix before starting
ENTRYPOINT ["/app/docker-entrypoint.sh"]
