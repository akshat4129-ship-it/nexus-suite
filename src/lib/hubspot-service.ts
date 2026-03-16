import { Client } from '@hubspot/api-client';
import { FilterOperatorEnum } from '@hubspot/api-client/lib/codegen/crm/contacts/models/Filter';
import { AssociationSpecAssociationCategoryEnum } from '@hubspot/api-client/lib/codegen/crm/contacts/models/AssociationSpec';
import { prisma } from './prisma';

export class HubSpotService {
  private async getClient(orgId: string) {
    const integration = await prisma.integration.findUnique({
      where: {
        org_id_type: {
          org_id: orgId,
          type: 'HUBSPOT'
        }
      }
    });

    if (!integration || !integration.access_token) {
      throw new Error('HubSpot not connected');
    }

    // Check if token is expired and refresh if needed
    let accessToken = integration.access_token;
    if (integration.token_expires_at && integration.token_expires_at < new Date()) {
        accessToken = await this.refreshToken(integration);
    }

    return new Client({ accessToken });
  }

  private async refreshToken(integration: any) {
      const response = await fetch('https://api.hubapi.com/oauth/v1/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
              grant_type: 'refresh_token',
              client_id: process.env.HUBSPOT_CLIENT_ID!,
              client_secret: process.env.HUBSPOT_CLIENT_SECRET!,
              refresh_token: integration.refresh_token
          })
      });

      const data = await response.json();
      if (!response.ok) throw new Error('Failed to refresh HubSpot token');

      await prisma.integration.update({
          where: { id: integration.id },
          data: {
              access_token: data.access_token,
              refresh_token: data.refresh_token,
              token_expires_at: new Date(Date.now() + data.expires_in * 1000)
          }
      });

      return data.access_token;
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

    const hubspot = await this.getClient(recap.org_id);

    // 1. Find or create Contact
    let contactId: string;
    try {
      const searchRes = await hubspot.crm.contacts.basicApi.getPage(10, undefined, undefined, undefined, undefined, false);
      // Simple search by email (real search API is better but this is for demo)
      const existing = await hubspot.crm.contacts.searchApi.doSearch({
        filterGroups: [{ filters: [{ propertyName: 'email', operator: FilterOperatorEnum.Eq, value: recap.client.email }] }]
      });

      if (existing.results.length > 0) {
        contactId = existing.results[0].id;
      } else {
        const createRes = await hubspot.crm.contacts.basicApi.create({
          properties: {
            email: recap.client.email,
            firstname: recap.client.name.split(' ')[0],
            lastname: recap.client.name.split(' ').slice(1).join(' ') || 'Client'
          }
        });
        contactId = createRes.id;
      }
    } catch (err) {
      console.error('HubSpot Contact Error:', err);
      throw err;
    }

    // 2. Log Recap as Note (Engagement)
    try {
        await hubspot.crm.objects.notes.basicApi.create({
            properties: {
                hs_note_body: `<h3>Meeting Recap: ${recap.meeting.title}</h3><p>${recap.opening_paragraph}</p><p>View full recap in Nexus Suite.</p>`,
                hs_timestamp: new Date().toISOString(),
            },
            associations: [
                {
                    to: { id: contactId },
                    types: [{ associationCategory: AssociationSpecAssociationCategoryEnum.HubspotDefined, associationTypeId: 202 }]
                }
            ]
        });
    } catch (err) {
        console.error('HubSpot Note Error:', err);
    }

    // 3. Create Tasks for Action Items
    for (const item of recap.action_items) {
      try {
        const taskResponse = await hubspot.crm.objects.tasks.basicApi.create({
          properties: {
            hs_task_subject: `Nexus Task: ${item.task_description}`,
            hs_task_body: `From meeting: ${recap.meeting.title}`,
            hs_task_status: 'NOT_STARTED',
            hs_task_priority: item.priority === 'HIGH' ? 'HIGH' : 'MEDIUM',
            hs_timestamp: item.due_date?.toISOString() || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          associations: [
            {
                to: { id: contactId },
                types: [{ associationCategory: AssociationSpecAssociationCategoryEnum.HubspotDefined, associationTypeId: 204 }]
            }
          ]
        });

        await prisma.actionItem.update({
          where: { id: item.id },
          data: {
            crm_task_id: taskResponse.id,
            crm_pushed_at: new Date(),
            status: 'PUSHED'
          }
        });
      } catch (err) {
        console.error('HubSpot Task Error:', err);
      }
    }

    return { success: true };
  }
}

export const hubspotService = new HubSpotService();
