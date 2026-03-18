import { prisma } from './src/lib/prisma'; // Using your app's properly initialized Prisma client

async function main() {
  console.log("Connecting to database to fix Org ID...");
  
  // 1. Create the new Organization mapped to your Clerk ID
  const org = await prisma.organization.create({
    data: {
      clerk_org_id: 'org_3B2th1HzGZj6kD4WRCqUMfG8tLr',
      name: 'My Agency',
      slug: 'my-agency',
      plan: 'FREE'
    }
  });
  console.log("✅ Created Organization:", org.id);

  // 2. Attach all existing users without an Org to this new one
  const update = await prisma.user.updateMany({
    where: { org_id: null },
    data: { org_id: org.id }
  });
  console.log(`✅ Updated ${update.count} user(s) to belong to the new Org.`);
}

main()
  .catch((e) => {
    console.error("❌ Error fixing database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Database connection closed.");
  });
