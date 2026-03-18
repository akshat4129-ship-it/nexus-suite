import { prisma } from './src/lib/prisma'; 

async function main() {
  console.log("Linking the dummy auth user to the new connected Org...");

  // Since you're not logged in, auth.ts falls back to user_seed_owner_001
  const update = await prisma.user.update({
    where: { clerk_user_id: 'user_seed_owner_001' },
    data: { 
        org_id: 'f6756316-2091-4502-9cfb-82f7ee23c931' // The ID of the generic org created in the previous step
    }
  });

  console.log("Successfully linked!");
  console.log(update);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
