FROM node:22-alpine
WORKDIR /app

# Install openssl for Prisma
RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

# Ensure storage and db directories exist
RUN mkdir -p /app/public/storage/logos && \
    mkdir -p /app/data

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run as root to avoid permission issues with mounted volumes and node_modules
# In a real production env, we would tune this, but for now root is safer.
USER root

CMD ["npm", "start"]
