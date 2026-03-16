import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const eventType = body.RecordType; // Postmark RecordType: Delivery, Open, Click, Bounce, SpamComplaint
    const messageId = body.MessageID;

    // Find the record associated with this Postmark MessageID
    const emailEvent = await prisma.emailEvent.findFirst({
      where: { postmark_message_id: messageId }
    });

    if (!emailEvent) {
      return NextResponse.json({ message: 'Message ID not found' }, { status: 404 });
    }

    const recapId = emailEvent.recap_id;

    // Map Postmark types to our Enum
    const mappedType = mapPostmarkEvent(eventType);

    if (mappedType) {
      await prisma.emailEvent.create({
        data: {
          recap_id: recapId,
          event_type: mappedType,
          occurred_at: new Date(body.ReceivedAt || Date.now()),
          postmark_message_id: messageId,
          metadata: body
        }
      });

      // Special handling for bounces/complaints
      if (mappedType === 'BOUNCED' || eventType === 'SpamComplaint') {
        await prisma.recap.update({
          where: { id: recapId },
          data: { status: 'FAILED' }
        });

        // Trigger notification (Mocked)
        console.log(`CRITICAL: Email to client for recap ${recapId} ${eventType}`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Postmark Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function mapPostmarkEvent(postmarkType: string): any {
  switch (postmarkType) {
    case 'Delivery': return 'DELIVERED';
    case 'Open': return 'OPENED';
    case 'Click': return 'CLICKED';
    case 'Bounce': return 'BOUNCED';
    default: return null;
  }
}
