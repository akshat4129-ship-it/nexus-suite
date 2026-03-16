import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function getCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { clerk_user_id: userId },
    include: { organization: true },
  });

  return user;
}

export async function getCurrentOrg() {
  const user = await getCurrentUser();
  return user?.organization || null;
}

export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  return userId;
}

export async function requireOrgMember(orgId: string) {
  const { userId, orgId: clerkOrgId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { clerk_user_id: userId },
  });

  if (!user || user.org_id !== orgId) {
    throw new Error("Forbidden");
  }

  return user;
}
