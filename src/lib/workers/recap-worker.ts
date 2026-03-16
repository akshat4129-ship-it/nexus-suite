import { Worker, Job } from 'bullmq';
import Redis from 'ioredis';
import { QUEUE_NAMES } from '../queue-service';
import { prisma } from '../prisma';
import axios from 'axios';
import { EmailService } from '../email-service';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6381';
const connection = new Redis(REDIS_URL, { maxRetriesPerRequest: null });

/**
 * Worker for recap-pipeline: meeting -> transcribe -> generate -> send
 */
export const recapWorker = new Worker(
  QUEUE_NAMES.RECAP_PIPELINE,
  async (job: Job) => {
    const { meetingId, step = 'TRANSCRIPTION' } = job.data;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005';

    console.log(`[RecapWorker] Processing meeting ${meetingId}, step: ${step}`);

    try {
      if (step === 'TRANSCRIPTION') {
        // 1. Trigger Transcription
        // We call the existing API endpoint for simplicity, or we could refactor the logic here
        await axios.post(`${appUrl}/api/meetings/${meetingId}/transcribe`);
        
        // Move to next step: GENERATION
        await job.updateData({ meetingId, step: 'GENERATION' });
        return { next: 'GENERATION' };
      }

      if (step === 'GENERATION') {
        // 2. Trigger Generation
        await axios.post(`${appUrl}/api/recaps/generate/${meetingId}`);
        
        // Move to next step: SEND
        await job.updateData({ meetingId, step: 'SEND' });
        return { next: 'SEND' };
      }

      if (step === 'SEND') {
        // 3. Trigger Send (Fetch the recap first)
        const recap = await prisma.recap.findFirst({
          where: { meeting_id: meetingId },
          orderBy: { created_at: 'desc' }
        });

        if (recap) {
          await axios.post(`${appUrl}/api/recaps/${recap.id}/send`);
        }
        
        return { status: 'COMPLETED' };
      }

    } catch (error: any) {
      console.error(`[RecapWorker] Error at step ${step}:`, error.response?.data || error.message);
      throw error; // Trigger retry
    }
  },
  { 
    connection,
    concurrency: 2,
  }
);

recapWorker.on('completed', (job) => {
  console.log(`[RecapWorker] Job ${job.id} completed`);
});

recapWorker.on('failed', (job, err) => {
  console.error(`[RecapWorker] Job ${job?.id} failed:`, err);
});
