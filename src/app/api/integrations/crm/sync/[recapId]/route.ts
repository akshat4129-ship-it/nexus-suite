import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hubspotService } from '@/lib/hubspot-service';
import { salesforceService } from '@/lib/salesforce-service';

export const dynamic = 'force-dynamic';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ recapId: string }> }
) {
  const { recapId } = await params;

  try {
    const recap = await prisma.recap.findUnique({
      where: { id: recapId }
    });

    if (!recap) {
      return NextResponse.json({ error: 'Recap not found' }, { status: 404 });
    }

    // Check for connected integrations
    const integrations = await prisma.integration.findMany({
      where: {
        org_id: recap.org_id,
        status: 'CONNECTED'
      }
    });

    const results = [];

    for (const integration of integrations) {
      if (integration.type === 'HUBSPOT') {
        try {
          await hubspotService.syncRecap(recapId);
          results.push({ type: 'HUBSPOT', success: true });
        } catch (err: any) {
          results.push({ type: 'HUBSPOT', success: false, error: err.message });
        }
      }

      if (integration.type === 'SALESFORCE') {
        try {
          await salesforceService.syncRecap(recapId);
          results.push({ type: 'SALESFORCE', success: true });
        } catch (err: any) {
          results.push({ type: 'SALESFORCE', success: false, error: err.message });
        }
      }
    }

    // Audit Log the sync
    await prisma.auditLog.create({
        data: {
          org_id: recap.org_id,
          entity_type: 'RECAP',
          entity_id: recapId,
          action: 'CRM_SYNC_COMPLETED',
          new_value: { results }
        }
    });

    return NextResponse.json({ success: true, results });

  } catch (error: any) {
    console.error('CRM Sync Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
