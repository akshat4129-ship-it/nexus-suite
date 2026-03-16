import { NextResponse } from 'next/server';
import { QueueService } from '@/lib/queue-service';

/**
 * Meeting detection cron - scheduled every 15 min
 */
export async function GET(req: Request) {
  try {
    const job = await QueueService.scheduleMeetingDetection();
    return NextResponse.json({ success: true, jobId: job.id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
