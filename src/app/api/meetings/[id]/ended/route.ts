import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { audio_file_path, duration_seconds } = body;

    const meeting = await prisma.meeting.findUnique({
      where: { id }
    });

    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    // IF duration < 180s → set status TOO_SHORT, return early
    if (duration_seconds < 180) {
      await prisma.meeting.update({
        where: { id },
        data: {
          status: 'TOO_SHORT',
          duration_seconds,
          ended_at: new Date()
        }
      });

      await prisma.auditLog.create({
        data: {
          org_id: meeting.org_id,
          entity_type: 'MEETING',
          entity_id: id,
          action: 'STATUS_UPDATED',
          new_value: { status: 'TOO_SHORT', duration: duration_seconds }
        }
      });

      return NextResponse.json({ success: true, message: 'Meeting too short for transcription' });
    }

    // Update Meeting: status → PROCESSING, ended_at, duration_seconds
    await prisma.meeting.update({
      where: { id },
      data: {
        status: 'PROCESSING',
        ended_at: new Date(),
        duration_seconds,
        recording_url: audio_file_path
      }
    });

    await prisma.auditLog.create({
      data: {
        org_id: meeting.org_id,
        entity_type: 'MEETING',
        entity_id: id,
        action: 'STATUS_UPDATED',
        new_value: { status: 'PROCESSING', duration: duration_seconds }
      }
    });

    // Trigger transcription pipeline
    const transcribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/meetings/${id}/transcribe`;
    // We fire and forget or wait depending on requirements. 
    // Usually, we want this to be async background.
    axios.post(transcribeUrl, { audio_file_path }).catch(err => {
        console.error('Transcription Trigger Failed:', err);
    });

    return NextResponse.json({ success: true, status: 'PROCESSING' });
  } catch (error: any) {
    console.error('Meeting Ended Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
