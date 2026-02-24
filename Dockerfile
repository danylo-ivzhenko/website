FROM node:22-alpine
WORKDIR /app

# Install openssl for Prisma
RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

# Next.js will serve the public folder normally in this mode
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production

# Ensure storage and data folders exist
RUN mkdir -p /app/public/storage/logos /app/data

CMD ["npm", "start"]
