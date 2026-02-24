import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SUPERADMIN_EMAIL || "danylevskii@gmail.com";
  const login = process.env.SUPERADMIN_LOGIN || "danylevskii";
  const password = process.env.SUPERADMIN_PASSWORD || "LQkMjec2DHgyx";

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await prisma.user.upsert({
    where: { login },
    update: {},
    create: {
      login,
      email,
      password: hashedPassword,
      status: "SUPERADMIN",
    },
  });

  console.log(`SuperAdmin seeded: ${user.login} (${user.id})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
