import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';
import { matchOwner } from '@/lib/owner-matcher';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ meetingId: string }> }
) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const { meetingId } = await params;

  try {
    // 1. Fetch transcript from Prisma by meeting_id
    const transcript = await prisma.transcript.findUnique({
      where: { meeting_id: meetingId },
      include: { meeting: { include: { organization: true, client: true, user: true } } }
    });

    if (!transcript || !transcript.raw_text) {
      if (transcript) {
        await prisma.meeting.update({
          where: { id: meetingId },
          data: { status: 'FAILED' }
        });
      }
      return NextResponse.json({ error: 'Empty transcript, skipping recap generation' }, { status: 400 });
    }

    const { meeting } = transcript;

    // 2. GPT-4o Analysis
    let recapJson: any = null;
    let attempts = 0;

    while (attempts < 2 && !recapJson) {
      try {
        attempts++;
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are an expert meeting analyst for a professional agency.
Given a meeting transcript with speaker labels, extract:
- decisions_made: Array of {decision: string, context: string}
- action_items: Array of {task, owner_name, owner_email (if mentioned),
  due_date (infer if not stated — default 7 days from today), 
  priority: HIGH/MEDIUM/LOW}
- next_steps: Ordered array of strings
- next_meeting: ISO date string if mentioned, null if not
- meeting_sentiment: POSITIVE/NEUTRAL/CONCERN/URGENT
- quality_score: 0-100 based on completeness

Return ONLY valid JSON. No prose. No markdown. Raw JSON only.`
            },
            {
              role: "user",
              content: transcript.raw_text
            }
          ],
          response_format: { type: "json_object" }
        });

        const content = completion.choices[0].message.content;
        if (content) {
          recapJson = JSON.parse(content);
        }
      } catch (err) {
        console.error(`GPT Attempt ${attempts} Failed:`, err);
        if (attempts === 2) throw err;
      }
    }

    if (!recapJson) {
        throw new Error("Failed to generate recap from GPT-4o");
    }

    // 3. Process Action Items & Match Owners
    const processedActionItems = [];
    for (const item of (recapJson.action_items || [])) {
      // Fuzzy match owner
      let matchedEmail = item.owner_email || null;
      if (!matchedEmail && item.owner_name) {
        matchedEmail = await matchOwner(item.owner_name, meetingId, meeting.org_id);
      }

      processedActionItems.push({
        task_description: item.task,
        owner_name: item.owner_name,
        owner_email: matchedEmail,
        due_date: item.due_date ? new Date(item.due_date) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        priority: item.priority as any || 'MEDIUM'
      });
    }

    // 4. Create Recap Record in Prisma
    const qualityScore = recapJson.quality_score || 0;
    
    const recap = await prisma.recap.create({
      data: {
        meeting_id: meetingId,
        org_id: meeting.org_id,
        client_id: meeting.client_id || '',
        generated_by_user_id: meeting.user_id,
        subject_line: `Recap: ${meeting.title}`,
        opening_paragraph: `Here is the summary of our meeting regarding ${meeting.title}.`,
        decisions: recapJson.decisions_made,
        next_steps: recapJson.next_steps,
        next_meeting_at: recapJson.next_meeting ? new Date(recapJson.next_meeting) : null,
        quality_score: qualityScore,
        ai_model_version: "gpt-4o",
        status: 'DRAFT',
        action_items: {
          create: processedActionItems
        }
      }
    });

    // 5. Logic based on quality_score
    const needsReview = qualityScore < 70 || (recapJson.action_items || []).length === 0;
    
    if (needsReview) {
      // Flag for review & notify
      await prisma.auditLog.create({
        data: {
          org_id: meeting.org_id,
          entity_type: 'RECAP',
          entity_id: recap.id,
          action: 'NEEDS_REVIEW',
          new_value: { quality_score: qualityScore, reason: qualityScore < 70 ? 'low_score' : 'no_action_items' }
        }
      });

      // Notify external service
      axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/api/notifications/review-needed`, {
        recap_id: recap.id,
        meeting_title: meeting.title
      }).catch(() => {});
    } else {
        // Auto-proceed logic could go here (e.g. queueing email send)
        await prisma.auditLog.create({
            data: {
              org_id: meeting.org_id,
              entity_type: 'RECAP',
              entity_id: recap.id,
              action: 'AUTO_PROCEEDED',
              new_value: { quality_score: qualityScore }
            }
          });
    }

    return NextResponse.json({ success: true, recap_id: recap.id, quality_score: qualityScore });

  } catch (error: any) {
    console.error('Recap Generation Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
