import { google } from 'googleapis';
import { prisma } from '@/lib/prisma';
import { requireAuth, getCurrentUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const userId = await requireAuth();
    const user = await getCurrentUser();

    if (!user || !user.org_id) {
      return NextResponse.json({ error: 'User or Organization not found' }, { status: 404 });
    }

    // NOTE: In a production app, you would retrieve the user's Google OAuth token from Clerk or your DB.
    // For this implementation, we assume the necessary credentials/auth is handled.
    // We'll use a placeholder for the auth client.
    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    
    // auth.setCredentials({ access_token: '...' });

    const calendar = google.calendar({ version: 'v3', auth });

    const now = new Date().toISOString();
    const events = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now,
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const meetingItems = events.data.items || [];
    const syncedMeetings = [];

    for (const event of meetingItems) {
      // Filter: Only meetings with external attendees (client-facing)
      const attendees = event.attendees || [];
      const hasExternalAttendee = attendees.some(a => {
        // Simple check: different domain than user email? 
        // Or just check if they are not in the organization's domain if we had it.
        // For now, let's assume any attendee other than the organizer is "external" for demonstration,
        // or refine it if we had domain info.
        return !a.self && a.email !== user.email;
      });

      if (!hasExternalAttendee) continue;

      const meeting = await prisma.meeting.upsert({
        where: { external_id: event.id || '' },
        update: {
          title: event.summary || 'Untitled Meeting',
          scheduled_at: event.start?.dateTime ? new Date(event.start.dateTime) : null,
          ended_at: event.end?.dateTime ? new Date(event.end.dateTime) : null,
        },
        create: {
          external_id: event.id || '',
          org_id: user.org_id,
          user_id: user.id,
          title: event.summary || 'Untitled Meeting',
          platform: 'ZOOM', // Defaulting to Zoom as per request
          scheduled_at: event.start?.dateTime ? new Date(event.start.dateTime) : null,
          ended_at: event.end?.dateTime ? new Date(event.end.dateTime) : null,
          bot_joined: true, // Auto-join true for client-facing
          status: 'SCHEDULED',
        },
      });

      // Audit Log for state change
      await prisma.auditLog.create({
        data: {
          org_id: user.org_id,
          user_id: user.id,
          entity_type: 'MEETING',
          entity_id: meeting.id,
          action: 'SYNCED_FROM_CALENDAR',
          new_value: { status: 'SCHEDULED', bot_joined: true },
        },
      });

      syncedMeetings.push(meeting);
    }

    return NextResponse.json({ success: true, count: syncedMeetings.length, meetings: syncedMeetings });
  } catch (error: any) {
    console.error('Calendar Sync Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
