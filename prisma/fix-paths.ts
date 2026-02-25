import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Fix studio logos: /storage/... → /api/storage/...
  const studioResult = await prisma.$executeRawUnsafe(
    `UPDATE Studio SET logoPath = '/api' || logoPath WHERE logoPath LIKE '/storage/%' AND logoPath NOT LIKE '/api/%'`
  );
  console.log(`Fixed ${studioResult} studio logo paths`);

  // Fix series images: /storage/... → /api/storage/...
  const seriesResult = await prisma.$executeRawUnsafe(
    `UPDATE Series SET imagePath = '/api' || imagePath WHERE imagePath LIKE '/storage/%' AND imagePath NOT LIKE '/api/%'`
  );
  console.log(`Fixed ${seriesResult} series image paths`);
}

main()
  .catch((e) => {
    console.error("Path fix error:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
