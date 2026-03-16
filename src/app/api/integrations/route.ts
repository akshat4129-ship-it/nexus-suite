import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, getCurrentOrg } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAuth();
    const org = await getCurrentOrg();
    if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 });

    const integrations = await prisma.integration.findMany({
      where: {
        org_id: org.id,
      },
      select: {
        type: true,
        status: true,
        metadata: true,
      },
    });

    return NextResponse.json(integrations);
  } catch (error: any) {
    console.error('Integrations Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
