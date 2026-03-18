import { prisma } from './src/lib/prisma'; 

async function main() {
  const users = await prisma.user.findMany();
  console.log("Current users in DB:", users);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
