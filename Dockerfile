FROM node:22-alpine
WORKDIR /app

# Install openssl for Prisma
RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

# Ensure storage and db directories exist and are writable
RUN mkdir -p /app/public/storage/logos && \
    mkdir -p /app/prisma

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use npm start directly to ensure we can run migrations etc. easily
CMD ["npm", "start"]
