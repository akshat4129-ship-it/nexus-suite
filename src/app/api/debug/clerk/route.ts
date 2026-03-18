import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await auth();

  return Response.json({
    userId: session?.userId,
    orgId: session?.orgId,
    orgRole: session?.orgRole,
    sessionClaims: session?.sessionClaims,
  });
}
