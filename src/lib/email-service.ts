import * as postmark from 'postmark';
import { prisma } from './prisma';
import { renderRecapHtml, generateConfirmationUrl } from './recap-renderer';

export class EmailService {
  private getClient() {
    return new postmark.ServerClient(process.env.POSTMARK_API_KEY || 'fake_key_for_build');
  }

  /**
   * Send a meeting recap to the client via Postmark
   */
  async sendRecap(recapId: string) {
    try {
      // 1. Fetch recap + client + organization
      const recap = await prisma.recap.findUnique({
        where: { id: recapId },
        include: {
          client: true,
          organization: true,
          meeting: true
        }
      });

      if (!recap) throw new Error('Recap not found');

      const { client, organization, meeting } = recap;

      // 2. Generate confirmation URL
      const confirmationUrl = generateConfirmationUrl(recap.id);

      // 3. Get rendered HTML
      const htmlBody = renderRecapHtml({
        agency_name: organization.name,
        client_name: client.name,
        meeting_date: meeting.scheduled_at ? new Date(meeting.scheduled_at).toLocaleDateString() : 'N/A',
        decisions: recap.decisions as any || [],
        action_items: (await prisma.actionItem.findMany({ where: { recap_id: recapId } })).map((ai: any) => ({
          task: ai.task_description,
          owner_name: ai.owner_name || undefined,
          owner_email: ai.owner_email || undefined,
          due_date: ai.due_date ? new Date(ai.due_date).toLocaleDateString() : undefined,
          priority: ai.priority,
        })),
        next_steps: recap.next_steps as any || [],
        next_meeting: recap.next_meeting_at ? recap.next_meeting_at.toISOString() : undefined,
        confirmation_url: confirmationUrl
      });

      // 4. Send via Postmark
      const fromEmail = process.env.POSTMARK_FROM_EMAIL || 'recap@agencyrecap.com';
      const sender = organization.custom_domain 
        ? `recap@${organization.custom_domain}` 
        : fromEmail;

      const postmarkClient = this.getClient();
      const response = await postmarkClient.sendEmail({
        From: sender,
        To: client.email,
        Subject: recap.subject_line,
        HtmlBody: htmlBody,
        TrackOpens: true,
        TrackLinks: postmark.Models.LinkTrackingOptions.HtmlOnly,
        MessageStream: 'outbound'
      });

      // 5. Update Recap status & insert EmailEvent
      await prisma.recap.update({
        where: { id: recapId },
        data: {
          status: 'SENT',
          sent_at: new Date()
        }
      });

      await prisma.emailEvent.create({
        data: {
          recap_id: recapId,
          event_type: 'SENT',
          occurred_at: new Date(),
          postmark_message_id: response.MessageID,
          metadata: JSON.parse(JSON.stringify({ to: client.email, response }))
        }
      });

      // Audit Log
      await prisma.auditLog.create({
        data: {
          org_id: organization.id,
          entity_type: 'RECAP',
          entity_id: recapId,
          action: 'SENT_TO_CLIENT',
          new_value: { message_id: response.MessageID }
        }
      });

      return { success: true, messageId: response.MessageID };

    } catch (error: any) {
      console.error('Email Delivery Error:', error);
      
      await prisma.emailEvent.create({
        data: {
          recap_id: recapId,
          event_type: 'BOUNCED', // Using BOUNCED as a placeholder for failure here
          occurred_at: new Date(),
          metadata: { error: error.message }
        }
      }).catch(() => {});

      throw error;
    }
  }
}

export const emailService = new EmailService();
