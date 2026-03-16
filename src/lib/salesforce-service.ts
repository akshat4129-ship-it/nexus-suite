import jsforce from 'jsforce';
import { prisma } from './prisma';

export class SalesforceService {
  private async getClient(orgId: string) {
    const integration = await prisma.integration.findUnique({
      where: {
        org_id_type: {
          org_id: orgId,
          type: 'SALESFORCE'
        }
      }
    });

    if (!integration || !integration.access_token || !integration.refresh_token) {
      throw new Error('Salesforce not connected');
    }

    const conn = new jsforce.Connection({
      oauth2: {
        clientId: process.env.SALESFORCE_CLIENT_ID!,
        clientSecret: process.env.SALESFORCE_CLIENT_SECRET!,
        redirectUri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/salesforce/callback`
      },
      instanceUrl: (integration.metadata as any)?.instance_url,
      accessToken: integration.access_token,
      refreshToken: integration.refresh_token
    });

    // Handle token refresh
    conn.on('refresh', async (accessToken, res) => {
        await prisma.integration.update({
            where: { id: integration.id },
            data: { access_token: accessToken }
        });
    });

    return conn;
  }

  async syncRecap(recapId: string) {
    const recap = await prisma.recap.findUnique({
      where: { id: recapId },
      include: {
        client: true,
        meeting: true,
        action_items: true
      }
    });

    if (!recap) throw new Error('Recap not found');

    const conn = await this.getClient(recap.org_id);

    // 1. Find Contact in Salesforce
    let contactId: string | null = null;
    try {
      const result = await conn.query(`SELECT Id FROM Contact WHERE Email = '${recap.client.email}' LIMIT 1`);
      if (result.totalSize > 0) {
        contactId = (result.records[0] as any).Id;
      }
    } catch (err) {
      console.error('Salesforce Contact Search Error:', err);
    }

    // 2. Log Activity (Event/Task) for the Recap
    try {
        await conn.sobject('Task').create({
            WhoId: contactId,
            Subject: `Nexus Meeting Recap: ${recap.meeting.title}`,
            Description: recap.opening_paragraph,
            Status: 'Completed',
            Priority: 'Normal',
            ActivityDate: new Date().toISOString().split('T')[0]
        });
    } catch (err) {
        console.error('Salesforce Activity Log Error:', err);
    }

    // 3. Create Tasks for Action Items
    for (const item of recap.action_items) {
      try {
        const sfTask = await conn.sobject('Task').create({
          WhoId: contactId,
          Subject: `Nexus Action Item: ${item.task_description}`,
          Priority: item.priority === 'HIGH' ? 'High' : 'Normal',
          Status: 'Not Started',
          ActivityDate: item.due_date?.toISOString().split('T')[0] || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });

        await prisma.actionItem.update({
          where: { id: item.id },
          data: {
            crm_task_id: (sfTask as any).id,
            crm_pushed_at: new Date(),
            status: 'PUSHED'
          }
        });
      } catch (err) {
        console.error('Salesforce Task Error:', err);
      }
    }

    return { success: true };
  }
}

export const salesforceService = new SalesforceService();
