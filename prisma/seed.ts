import 'dotenv/config';
import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, Plan, Role, Platform, MeetingStatus, TranscriptStatus, RecapStatus, ActionItemStatus, Priority, EmailEventType, IntegrationType, IntegrationStatus, TemplateTone } from '@prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });




async function main() {
  console.log('🌱 Starting AgencyRecap seed...');

  // ──────────────────────────────
  // ORGANIZATION
  // ──────────────────────────────
  const org = await prisma.organization.create({
    data: {
      clerk_org_id: 'org_seed_demo_001',
      name: 'Apex Digital Agency',
      slug: 'apex-digital',
      logo_url: 'https://cdn.agencyrecap.io/logos/apex-digital.png',
      brand_color: '#4F46E5',
      email_signature: '<p>Best regards,<br/><strong>Apex Digital Team</strong></p>',
      custom_domain: 'recap.apexdigital.io',
      plan: Plan.PRO,
      plan_expires_at: new Date('2027-03-16T00:00:00Z'),
    },
  });
  console.log(`  ✓ Organization: ${org.name} [${org.id}]`);

  // ──────────────────────────────
  // USERS
  // ──────────────────────────────
  const owner = await prisma.user.create({
    data: {
      clerk_user_id: 'user_seed_owner_001',
      email: 'sarah.chen@apexdigital.io',
      name: 'Sarah Chen',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      role: Role.OWNER,
      org_id: org.id,
    },
  });

  const admin = await prisma.user.create({
    data: {
      clerk_user_id: 'user_seed_admin_001',
      email: 'marcus.jones@apexdigital.io',
      name: 'Marcus Jones',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marcus',
      role: Role.ADMIN,
      org_id: org.id,
    },
  });

  const member = await prisma.user.create({
    data: {
      clerk_user_id: 'user_seed_member_001',
      email: 'priya.patel@apexdigital.io',
      name: 'Priya Patel',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
      role: Role.MEMBER,
      org_id: org.id,
    },
  });
  console.log('  ✓ Users: Sarah (OWNER), Marcus (ADMIN), Priya (MEMBER)');

  // ──────────────────────────────
  // CLIENTS
  // ──────────────────────────────
  const clientNova = await prisma.client.create({
    data: {
      org_id: org.id,
      name: 'Jordan Lee',
      email: 'jordan.lee@novatech.com',
      company: 'NovaTech Solutions',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=jordan',
      confirmation_required: true,
      timezone: 'America/New_York',
    },
  });

  const clientBlue = await prisma.client.create({
    data: {
      org_id: org.id,
      name: 'Taylor Brooks',
      email: 'taylor@bluepoint.co',
      company: 'Bluepoint Creative',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=taylor',
      confirmation_required: false,
      timezone: 'America/Chicago',
    },
  });

  const clientPeak = await prisma.client.create({
    data: {
      org_id: org.id,
      name: 'Alex Rivera',
      email: 'alex.rivera@peaklegal.com',
      company: 'Peak Legal Group',
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
      confirmation_required: true,
      timezone: 'America/Los_Angeles',
    },
  });
  console.log('  ✓ Clients: NovaTech, Bluepoint Creative, Peak Legal Group');

  // ──────────────────────────────
  // RECAP TEMPLATES
  // ──────────────────────────────
  const templateStandard = await prisma.recapTemplate.create({
    data: {
      org_id: org.id,
      name: 'Standard Recap',
      is_default: true,
      tone: TemplateTone.STANDARD,
      subject_template: 'Meeting Recap — {{meeting_title}} · {{meeting_date}}',
      opening_template: 'Hi {{client_name}}, great connecting today! Here\'s a summary of what we covered.',
      sections_config: {
        show_decisions: true,
        show_next_steps: true,
        show_next_meeting: true,
        show_action_items: true,
      },
      html_template: '<!DOCTYPE html><html><head><style>body{font-family:Inter,sans-serif;color:#111;max-width:600px;margin:0 auto;padding:24px}.header{background:{{brand_color}};padding:20px;border-radius:8px}.recap-section{margin:20px 0;padding:16px;background:#f9f9f9;border-radius:6px}</style></head><body><div class="header"><h2 style="color:#fff;margin:0">{{org_name}}</h2></div><p>{{opening_paragraph}}</p><div class="recap-section"><h3>🎯 Decisions</h3>{{decisions}}</div><div class="recap-section"><h3>✅ Next Steps</h3>{{next_steps}}</div><div class="recap-section"><h3>📅 Next Meeting</h3>{{next_meeting_at}}</div>{{email_signature}}</body></html>',
    },
  });

  const templateFormal = await prisma.recapTemplate.create({
    data: {
      org_id: org.id,
      name: 'Formal Legal Recap',
      is_default: false,
      tone: TemplateTone.FORMAL,
      subject_template: 'Meeting Minutes: {{meeting_title}} | {{meeting_date}}',
      opening_template: 'Dear {{client_name}}, please find below the formal minutes from our meeting held on {{meeting_date}}.',
      sections_config: {
        show_decisions: true,
        show_next_steps: true,
        show_next_meeting: true,
        show_action_items: true,
        show_attendees: true,
      },
      html_template: '<!DOCTYPE html><html><head><style>body{font-family:Georgia,serif;color:#222;max-width:600px;margin:0 auto;padding:32px}.header{border-bottom:2px solid {{brand_color}};padding-bottom:16px}.recap-section{margin:24px 0}</style></head><body><div class="header"><h2>{{org_name}}</h2><p style="color:#666">Confidential Meeting Minutes</p></div><p>{{opening_paragraph}}</p><div class="recap-section"><h3>Resolutions &amp; Decisions</h3>{{decisions}}</div><div class="recap-section"><h3>Action Items &amp; Responsibilities</h3>{{next_steps}}</div>{{email_signature}}</body></html>',
    },
  });
  console.log('  ✓ Templates: Standard Recap (default), Formal Legal Recap');

  // ──────────────────────────────
  // MEETINGS
  // ──────────────────────────────
  const meetingScheduled = await prisma.meeting.create({
    data: {
      org_id: org.id,
      user_id: owner.id,
      client_id: clientNova.id,
      external_id: 'zoom_ext_001',
      title: 'Q2 Strategy Kickoff — NovaTech',
      platform: Platform.ZOOM,
      scheduled_at: new Date('2026-03-20T14:00:00Z'),
      status: MeetingStatus.SCHEDULED,
      bot_joined: false,
      attendees: {
        create: [
          { name: 'Sarah Chen', email: 'sarah.chen@apexdigital.io', is_internal: true },
          { name: 'Jordan Lee', email: 'jordan.lee@novatech.com', is_internal: false },
        ],
      },
    },
  });

  const meetingCompleted1 = await prisma.meeting.create({
    data: {
      org_id: org.id,
      user_id: owner.id,
      client_id: clientNova.id,
      external_id: 'zoom_ext_002',
      title: 'Brand Identity Review — NovaTech',
      platform: Platform.ZOOM,
      scheduled_at: new Date('2026-03-10T15:00:00Z'),
      started_at: new Date('2026-03-10T15:02:00Z'),
      ended_at: new Date('2026-03-10T16:05:00Z'),
      duration_seconds: 3780,
      status: MeetingStatus.COMPLETED,
      bot_joined: true,
      recording_url: 'https://zoom.us/rec/abc123',
      audio_file_path: '/recordings/org_001/meeting_002.mp3',
      attendees: {
        create: [
          { name: 'Sarah Chen', email: 'sarah.chen@apexdigital.io', is_internal: true },
          { name: 'Marcus Jones', email: 'marcus.jones@apexdigital.io', is_internal: true },
          { name: 'Jordan Lee', email: 'jordan.lee@novatech.com', is_internal: false },
        ],
      },
    },
  });

  const meetingCompleted2 = await prisma.meeting.create({
    data: {
      org_id: org.id,
      user_id: admin.id,
      client_id: clientBlue.id,
      external_id: 'gmeet_ext_001',
      title: 'Website Redesign Sprint Planning',
      platform: Platform.GOOGLE_MEET,
      scheduled_at: new Date('2026-03-08T10:00:00Z'),
      started_at: new Date('2026-03-08T10:00:00Z'),
      ended_at: new Date('2026-03-08T10:52:00Z'),
      duration_seconds: 3120,
      status: MeetingStatus.COMPLETED,
      bot_joined: true,
      recording_url: null,
      audio_file_path: '/recordings/org_001/meeting_003.mp3',
      attendees: {
        create: [
          { name: 'Marcus Jones', email: 'marcus.jones@apexdigital.io', is_internal: true },
          { name: 'Taylor Brooks', email: 'taylor@bluepoint.co', is_internal: false },
        ],
      },
    },
  });

  const meetingProcessing = await prisma.meeting.create({
    data: {
      org_id: org.id,
      user_id: member.id,
      client_id: clientPeak.id,
      external_id: 'teams_ext_001',
      title: 'Legal Services Onboarding',
      platform: Platform.TEAMS,
      scheduled_at: new Date('2026-03-15T09:00:00Z'),
      started_at: new Date('2026-03-15T09:01:00Z'),
      ended_at: new Date('2026-03-15T09:48:00Z'),
      duration_seconds: 2820,
      status: MeetingStatus.PROCESSING,
      bot_joined: true,
      audio_file_path: '/recordings/org_001/meeting_004.mp3',
      attendees: {
        create: [
          { name: 'Priya Patel', email: 'priya.patel@apexdigital.io', is_internal: true },
          { name: 'Alex Rivera', email: 'alex.rivera@peaklegal.com', is_internal: false },
        ],
      },
    },
  });

  const meetingFailed = await prisma.meeting.create({
    data: {
      org_id: org.id,
      user_id: owner.id,
      client_id: clientBlue.id,
      external_id: 'zoom_ext_003',
      title: 'Campaign Review — Bluepoint',
      platform: Platform.ZOOM,
      scheduled_at: new Date('2026-03-12T11:00:00Z'),
      started_at: new Date('2026-03-12T11:01:00Z'),
      ended_at: new Date('2026-03-12T11:04:00Z'),
      duration_seconds: 180,
      status: MeetingStatus.FAILED,
      bot_joined: true,
      attendees: {
        create: [
          { name: 'Sarah Chen', email: 'sarah.chen@apexdigital.io', is_internal: true },
          { name: 'Taylor Brooks', email: 'taylor@bluepoint.co', is_internal: false },
        ],
      },
    },
  });
  console.log('  ✓ Meetings: SCHEDULED, COMPLETED×2, PROCESSING, FAILED');

  // ──────────────────────────────
  // TRANSCRIPTS (for completed meetings)
  // ──────────────────────────────
  await prisma.transcript.create({
    data: {
      meeting_id: meetingCompleted1.id,
      raw_text: 'Sarah: Welcome everyone. Today we\'re reviewing the NovaTech brand identity refresh...\nJordan: We want to move toward a more modern, tech-forward look...\nSarah: Agreed. We\'ll propose three directions by end of week.\nMarcus: I can own the motion design concepts.\nJordan: Perfect. Let\'s also confirm the new color palette before our next call.',
      word_count: 62,
      language: 'en',
      confidence_score: 0.97,
      speaker_segments: [
        { speaker: 'Sarah Chen', start: 0, end: 12.4, text: 'Welcome everyone. Today we\'re reviewing the NovaTech brand identity refresh...' },
        { speaker: 'Jordan Lee', start: 13.0, end: 24.6, text: 'We want to move toward a more modern, tech-forward look...' },
      ],
      whisper_job_id: 'wjob_001_abc',
      status: TranscriptStatus.DONE,
      processed_json: {
        summary: 'Brand identity refresh discussion for NovaTech',
        topics: ['brand identity', 'color palette', 'motion design'],
      },
    },
  });

  await prisma.transcript.create({
    data: {
      meeting_id: meetingCompleted2.id,
      raw_text: 'Marcus: Thanks for joining Taylor. Let\'s walk through the sprint plan...\nTaylor: We need the homepage done by March 25th.\nMarcus: That\'s achievable. Priya will handle the CMS integration.\nTaylor: Great. Please send me the Figma prototype link after this.',
      word_count: 48,
      language: 'en',
      confidence_score: 0.95,
      speaker_segments: [
        { speaker: 'Marcus Jones', start: 0, end: 10.2, text: 'Thanks for joining Taylor. Let\'s walk through the sprint plan...' },
        { speaker: 'Taylor Brooks', start: 11.0, end: 18.5, text: 'We need the homepage done by March 25th.' },
      ],
      whisper_job_id: 'wjob_002_def',
      status: TranscriptStatus.DONE,
      processed_json: {
        summary: 'Website redesign sprint planning session',
        topics: ['homepage', 'CMS integration', 'Figma prototype'],
      },
    },
  });
  console.log('  ✓ Transcripts created for completed meetings');

  // ──────────────────────────────
  // RECAPS
  // ──────────────────────────────
  const recapDraft = await prisma.recap.create({
    data: {
      meeting_id: meetingCompleted1.id,
      org_id: org.id,
      client_id: clientNova.id,
      generated_by_user_id: owner.id,
      template_id: templateStandard.id,
      subject_line: 'Meeting Recap — Brand Identity Review · March 10, 2026',
      opening_paragraph: 'Hi Jordan, great session today! Here\'s a summary of our brand identity review conversation.',
      decisions: [
        { id: 1, text: 'Proceed with three brand direction concepts' },
        { id: 2, text: 'New color palette to be approved before next meeting' },
      ],
      next_steps: [
        { id: 1, text: 'Apex to propose 3 brand directions', assignee: 'Sarah Chen', due: '2026-03-17' },
        { id: 2, text: 'Marcus to own motion design concepts', assignee: 'Marcus Jones', due: '2026-03-18' },
      ],
      next_meeting_at: new Date('2026-03-24T15:00:00Z'),
      quality_score: 88,
      ai_model_version: 'gpt-4o-2024-11-20',
      status: RecapStatus.DRAFT,
    },
  });

  const recapSent = await prisma.recap.create({
    data: {
      meeting_id: meetingCompleted2.id,
      org_id: org.id,
      client_id: clientBlue.id,
      generated_by_user_id: admin.id,
      template_id: templateStandard.id,
      subject_line: 'Meeting Recap — Website Redesign Sprint Planning · March 8, 2026',
      opening_paragraph: 'Hi Taylor, thanks for the productive sprint planning session. Here\'s what we aligned on.',
      decisions: [
        { id: 1, text: 'Homepage delivery target: March 25, 2026' },
        { id: 2, text: 'Priya Patel assigned as CMS integration lead' },
      ],
      next_steps: [
        { id: 1, text: 'Share Figma prototype link', assignee: 'Marcus Jones', due: '2026-03-09' },
        { id: 2, text: 'Priya starts CMS integration build', assignee: 'Priya Patel', due: '2026-03-11' },
      ],
      next_meeting_at: new Date('2026-03-22T10:00:00Z'),
      quality_score: 92,
      ai_model_version: 'gpt-4o-2024-11-20',
      status: RecapStatus.SENT,
      sent_at: new Date('2026-03-08T11:15:00Z'),
    },
  });

  const recapConfirmed = await prisma.recap.create({
    data: {
      meeting_id: meetingProcessing.id,
      org_id: org.id,
      client_id: clientPeak.id,
      generated_by_user_id: member.id,
      template_id: templateFormal.id,
      subject_line: 'Meeting Minutes: Legal Services Onboarding | March 15, 2026',
      opening_paragraph: 'Dear Alex, please find below the formal minutes from our onboarding meeting held on March 15, 2026.',
      decisions: [
        { id: 1, text: 'Engage Apex Digital for 6-month retainer commencing April 1, 2026' },
        { id: 2, text: 'Monthly reporting cadence agreed: first Friday of each month' },
      ],
      next_steps: [
        { id: 1, text: 'Apex to send contract and SOW', assignee: 'Priya Patel', due: '2026-03-18' },
        { id: 2, text: 'Alex to provide brand assets', assignee: 'Alex Rivera', due: '2026-03-20' },
      ],
      next_meeting_at: new Date('2026-04-04T09:00:00Z'),
      quality_score: 96,
      ai_model_version: 'gpt-4o-2024-11-20',
      status: RecapStatus.CONFIRMED,
      sent_at: new Date('2026-03-15T10:30:00Z'),
      confirmed_at: new Date('2026-03-15T14:22:00Z'),
    },
  });
  console.log('  ✓ Recaps: DRAFT, SENT, CONFIRMED');

  // ──────────────────────────────
  // ACTION ITEMS
  // ──────────────────────────────
  await prisma.actionItem.createMany({
    data: [
      {
        recap_id: recapDraft.id,
        task_description: 'Prepare 3 brand direction concept decks for NovaTech review',
        owner_name: 'Sarah Chen',
        owner_email: 'sarah.chen@apexdigital.io',
        due_date: new Date('2026-03-17T23:59:00Z'),
        priority: Priority.HIGH,
        status: ActionItemStatus.PENDING,
      },
      {
        recap_id: recapDraft.id,
        task_description: 'Create motion design concept variations',
        owner_name: 'Marcus Jones',
        owner_email: 'marcus.jones@apexdigital.io',
        due_date: new Date('2026-03-18T23:59:00Z'),
        priority: Priority.MEDIUM,
        status: ActionItemStatus.PENDING,
      },
      {
        recap_id: recapSent.id,
        task_description: 'Share Figma prototype link with Taylor',
        owner_name: 'Marcus Jones',
        owner_email: 'marcus.jones@apexdigital.io',
        due_date: new Date('2026-03-09T23:59:00Z'),
        priority: Priority.HIGH,
        crm_task_id: 'hs_task_001',
        crm_pushed_at: new Date('2026-03-08T11:20:00Z'),
        status: ActionItemStatus.PUSHED,
      },
      {
        recap_id: recapConfirmed.id,
        task_description: 'Draft and send contract + SOW to Alex Rivera',
        owner_name: 'Priya Patel',
        owner_email: 'priya.patel@apexdigital.io',
        due_date: new Date('2026-03-18T23:59:00Z'),
        priority: Priority.HIGH,
        crm_task_id: 'hs_task_002',
        crm_pushed_at: new Date('2026-03-15T10:35:00Z'),
        status: ActionItemStatus.COMPLETED,
      },
      {
        recap_id: recapConfirmed.id,
        task_description: 'Receive and catalogue brand assets from Peak Legal',
        owner_name: 'Priya Patel',
        owner_email: 'priya.patel@apexdigital.io',
        due_date: new Date('2026-03-21T23:59:00Z'),
        priority: Priority.MEDIUM,
        status: ActionItemStatus.PENDING,
      },
    ],
  });
  console.log('  ✓ Action Items: 5 items across recaps (PENDING, PUSHED, COMPLETED)');

  // ──────────────────────────────
  // EMAIL EVENTS (for confirmed recap)
  // ──────────────────────────────
  await prisma.emailEvent.createMany({
    data: [
      {
        recap_id: recapConfirmed.id,
        event_type: EmailEventType.SENT,
        occurred_at: new Date('2026-03-15T10:30:00Z'),
        postmark_message_id: 'pm_msg_001abc',
        metadata: { recipient: 'alex.rivera@peaklegal.com', subject: 'Meeting Minutes: Legal Services Onboarding | March 15, 2026' },
      },
      {
        recap_id: recapConfirmed.id,
        event_type: EmailEventType.DELIVERED,
        occurred_at: new Date('2026-03-15T10:30:18Z'),
        postmark_message_id: 'pm_msg_001abc',
        metadata: { recipient: 'alex.rivera@peaklegal.com' },
      },
      {
        recap_id: recapConfirmed.id,
        event_type: EmailEventType.OPENED,
        occurred_at: new Date('2026-03-15T13:45:00Z'),
        postmark_message_id: 'pm_msg_001abc',
        metadata: { recipient: 'alex.rivera@peaklegal.com', user_agent: 'Mozilla/5.0', city: 'Los Angeles' },
      },
      {
        recap_id: recapConfirmed.id,
        event_type: EmailEventType.CLICKED,
        occurred_at: new Date('2026-03-15T14:10:00Z'),
        postmark_message_id: 'pm_msg_001abc',
        metadata: { recipient: 'alex.rivera@peaklegal.com', link: 'https://recap.apexdigital.io/confirm/abc123' },
      },
      {
        recap_id: recapConfirmed.id,
        event_type: EmailEventType.CONFIRMED,
        occurred_at: new Date('2026-03-15T14:22:00Z'),
        postmark_message_id: 'pm_msg_001abc',
        metadata: { recipient: 'alex.rivera@peaklegal.com', confirmation_token: 'tok_abc123' },
      },
    ],
  });
  console.log('  ✓ Email Events: SENT → DELIVERED → OPENED → CLICKED → CONFIRMED');

  // ──────────────────────────────
  // INTEGRATIONS
  // ──────────────────────────────
  await prisma.integration.createMany({
    data: [
      {
        org_id: org.id,
        type: IntegrationType.HUBSPOT,
        status: IntegrationStatus.CONNECTED,
        access_token: 'hs_access_token_seed_placeholder',
        refresh_token: 'hs_refresh_token_seed_placeholder',
        token_expires_at: new Date('2026-06-16T00:00:00Z'),
        metadata: {
          portal_id: '12345678',
          hub_domain: 'apexdigital.hubspot.com',
          scopes: ['crm.objects.contacts.write', 'crm.objects.deals.write'],
        },
      },
      {
        org_id: org.id,
        type: IntegrationType.ZOOM,
        status: IntegrationStatus.CONNECTED,
        access_token: 'zoom_access_token_seed_placeholder',
        refresh_token: 'zoom_refresh_token_seed_placeholder',
        token_expires_at: new Date('2026-04-16T00:00:00Z'),
        metadata: {
          account_id: 'zoom_acct_001',
          user_email: 'sarah.chen@apexdigital.io',
          bot_enabled: true,
        },
      },
    ],
  });
  console.log('  ✓ Integrations: HubSpot (CONNECTED), Zoom (CONNECTED)');

  console.log('\n✅ AgencyRecap seed complete!');
  console.log(`   Org ID:            ${org.id}`);
  console.log(`   Owner User ID:     ${owner.id}`);
  console.log(`   Draft Recap ID:    ${recapDraft.id}`);
  console.log(`   Confirmed Recap ID:${recapConfirmed.id}`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
