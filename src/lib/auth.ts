import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

// Fallback user for demo if not logged in
const DEMO_USER_ID = "user_seed_owner_001";

export async function getCurrentUser() {
  let userId = null;
  try {
    const session = await auth();
    userId = session?.userId;
  } catch (e) {
    // ignore
  }

  if (!userId) {
    userId = DEMO_USER_ID; // DEMO OVERRIDE
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
  let userId = null;
  try {
    const session = await auth();
    userId = session?.userId;
  } catch (e) {
    // ignore
  }

  if (!userId) {
    userId = DEMO_USER_ID; // DEMO OVERRIDE
  }
  return userId;
}

export async function requireOrgMember(orgId: string) {
  let userId = null;
  try {
    const session = await auth();
    userId = session?.userId;
  } catch (e) {
    // ignore
  }

  if (!userId) {
    userId = DEMO_USER_ID; // DEMO OVERRIDE
  }

  const user = await prisma.user.findUnique({
    where: { clerk_user_id: userId },
  });

  if (!user || user.org_id !== orgId) {
    // In demo, we just allow it since the seed user is owner of the demo org
    if (userId === DEMO_USER_ID) return user;
    throw new Error("Forbidden");
  }

  return user;
}
