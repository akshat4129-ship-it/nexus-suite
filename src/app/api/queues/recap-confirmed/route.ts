import { NextResponse } from 'next/server';
import { QueueService } from '@/lib/queue-service';

/**
 * Trigger CRM Sync after recap confirmation
 */
export async function POST(req: Request) {
  try {
    const { recapId } = await req.json();
    if (!recapId) return new NextResponse('Missing recapId', { status: 400 });

    const job = await QueueService.enqueueCrmSync(recapId);
    return NextResponse.json({ success: true, jobId: job.id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
