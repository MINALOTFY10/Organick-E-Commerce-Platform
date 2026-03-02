import { auth } from "../src/lib/auth"; // Import your server-side auth config
import { prisma } from "../src/lib/prisma";

async function createAdmin() {}

createAdmin()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
