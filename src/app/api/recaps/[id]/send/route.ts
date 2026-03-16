import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, getCurrentOrg } from '@/lib/auth';
import { EmailService } from '@/lib/email-service';

export const dynamic = 'force-dynamic';

const emailService = new EmailService();

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await requireAuth();
    const org = await getCurrentOrg();
    if (!org) return NextResponse.json({ error: 'Org not found' }, { status: 404 });

    const recap = await prisma.recap.findFirst({
      where: { id, org_id: org.id },
    });

    if (!recap) {
      return NextResponse.json({ error: 'Recap not found' }, { status: 404 });
    }

    // Trigger Email Send
    await emailService.sendRecap(id);

    return NextResponse.json({ success: true, message: 'Recap email triggered' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
