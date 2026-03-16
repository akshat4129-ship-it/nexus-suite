import { NextResponse } from 'next/server';
import { QueueService } from '@/lib/queue-service';
import { requireAuth } from '@/lib/auth';

/**
 * Trigger Recap Pipeline manually or from webhook
 */
export async function POST(req: Request) {
  try {
    const { meetingId } = await req.json();
    if (!meetingId) return new NextResponse('Missing meetingId', { status: 400 });

    const job = await QueueService.enqueueRecap(meetingId);
    return NextResponse.json({ success: true, jobId: job.id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
