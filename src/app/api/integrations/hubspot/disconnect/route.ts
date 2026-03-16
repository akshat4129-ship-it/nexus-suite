import { NextResponse } from 'next/server';
import { requireAuth, getCurrentOrg } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await requireAuth();
    const org = await getCurrentOrg();
    if (!org) throw new Error('Org not found');

    await prisma.integration.delete({
      where: {
        org_id_type: {
          org_id: org.id,
          type: 'HUBSPOT'
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
