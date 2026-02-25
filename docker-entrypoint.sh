#!/bin/sh
set -e

echo "=== Running Prisma DB push ==="
npx prisma db push --skip-generate

echo "=== Seeding the database ==="
npx tsx prisma/seed.ts || true

echo "=== Fixing old image paths ==="
npx tsx prisma/fix-paths.ts || true

echo "=== Starting Next.js ==="
exec npm start
