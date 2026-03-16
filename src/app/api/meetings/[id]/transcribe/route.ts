import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import axios from 'axios';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await req.json();
    const { audio_file_path } = body;

    const meeting = await prisma.meeting.findUnique({
      where: { id }
    });

    if (!meeting) {
        return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    // Initialize/Update Transcript status to PROCESSING
    const transcript = await prisma.transcript.upsert({
      where: { meeting_id: id },
      update: { status: 'PROCESSING' },
      create: {
        meeting_id: id,
        raw_text: '',
        status: 'PROCESSING',
      },
    });

    await prisma.auditLog.create({
      data: {
        org_id: meeting.org_id,
        entity_type: 'TRANSCRIPT',
        entity_id: transcript.id,
        action: 'STATUS_UPDATED',
        new_value: { status: 'PROCESSING' }
      }
    });

    // Transcription with 3x retry
    let rawText = '';
    let speakerSegments: any = [];
    let success = false;
    let attempts = 0;

    while (attempts < 3 && !success) {
      try {
        attempts++;
        console.log(`OpenAI Whisper Attempt ${attempts} for meeting ${id}...`);
        
        // In a real scenario, you'd download the audio from the path (URL/local)
        // For this demo, we assume the file is accessible or mocked.
        // const response = await openai.audio.transcriptions.create({
        //   file: fs.createReadStream(audio_file_path),
        //   model: 'whisper-1',
        //   response_format: 'verbose_json',
        // });
        
        // Mocking behavior for demonstration
        rawText = "This is a transcribed meeting text from Whisper.";
        speakerSegments = [{ speaker: "A", text: "Hello", start: 0, end: 1 }];
        
        success = true;
      } catch (err) {
        console.error(`Whisper Attempt ${attempts} Failed:`, err);
        if (attempts === 3) throw err;
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s before retry
      }
    }

    // Store Result
    await prisma.transcript.update({
      where: { meeting_id: id },
      data: {
        raw_text: rawText,
        speaker_segments: speakerSegments,
        status: 'DONE',
        confidence_score: 0.95, // Mock
        word_count: rawText.split(' ').length,
      },
    });

    await prisma.auditLog.create({
      data: {
        org_id: meeting.org_id,
        entity_type: 'TRANSCRIPT',
        entity_id: transcript.id,
        action: 'STATUS_UPDATED',
        new_value: { status: 'DONE', word_count: rawText.split(' ').length }
      }
    });

    // Update Meeting status to COMPLETED
    await prisma.meeting.update({
        where: { id },
        data: { status: 'COMPLETED' }
    });

    // On completion: trigger POST /api/recaps/generate/[meetingId]
    const recapUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/recaps/generate/${id}`;
    axios.post(recapUrl).catch(err => {
        console.error('Recap Generation Trigger Failed:', err);
    });

    return NextResponse.json({ success: true, status: 'DONE' });
  } catch (error: any) {
    console.error('Transcription Pipeline Error:', error);
    
    // On final failure: set Transcript.status = FAILED
    await prisma.transcript.update({
      where: { meeting_id: id },
      data: { status: 'FAILED' },
    }).catch(() => {});

    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
