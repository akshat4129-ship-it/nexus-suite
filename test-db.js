const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();
    console.log("Users:", JSON.stringify(users, null, 2));
    const orgs = await prisma.organization.findMany();
    console.log("Orgs:", JSON.stringify(orgs, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
