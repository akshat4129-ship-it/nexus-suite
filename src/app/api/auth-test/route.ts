import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const session = await auth();
  console.log("Clerk session claims:", session?.sessionClaims);
  console.log("Clerk orgId:", session?.orgId);
  console.log("Clerk orgRole:", session?.orgRole);

  return Response.json({ ok: true });
}
