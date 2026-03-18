const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const org = await prisma.organization.create({
        data: {
          clerk_org_id: 'org_3B2th1HzGZj6kD4WRCqUMfG8tLr',
          name: 'My Agency',
          slug: 'my-agency',
          plan: 'FREE'
        }
    });
    console.log("Created org:", org);

    const update = await prisma.user.updateMany({
        where: { org_id: null },
        data: { org_id: org.id }
    });
    console.log("Updated users:", update);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
