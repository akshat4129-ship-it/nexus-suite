import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  try {
    const secret = process.env.CONFIRMATION_JWT_SECRET || 'nexus_fallback_secret';
    
    // 1. Verify JWT
    const decoded = jwt.verify(token, secret) as { recapId: string };
    const { recapId } = decoded;

    // 2. Fetch Recap
    const recap = await prisma.recap.findUnique({
      where: { id: recapId },
      include: { organization: true, client: true }
    });

    if (!recap) {
      return new NextResponse('<h1>Recap not found</h1>', { status: 404, headers: { 'Content-Type': 'text/html' } });
    }

    // 3. Update Status
    await prisma.recap.update({
      where: { id: recapId },
      data: {
        status: 'CONFIRMED',
        confirmed_at: new Date()
      }
    });

    // 4. Record Event
    await prisma.emailEvent.create({
      data: {
        recap_id: recapId,
        event_type: 'CONFIRMED',
        occurred_at: new Date(),
        metadata: { method: 'client_click' }
      }
    });

    // 5. Trigger CRM Sync
    const crmSyncUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/crm/sync/${recapId}`;
    axios.post(crmSyncUrl).catch(err => {
        console.error('CRM Sync Trigger Failed:', err);
    });

    // 6. Return Branded Thank You Page
    const thankYouHtml = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Recap Confirmed</title>
          <style>
              body { font-family: 'Inter', -apple-system, sans-serif; height: 100vh; display: flex; align-items: center; justify-content: center; background: #f7fafc; margin: 0; }
              .card { background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
              .icon { font-size: 48px; color: #48bb78; margin-bottom: 20px; }
              h1 { color: #1a1f36; margin: 0 0 10px 0; }
              p { color: #718096; margin-bottom: 30px; }
              .brand { font-weight: bold; color: #5469d4; }
          </style>
      </head>
      <body>
          <div class="card">
              <div class="icon">✓</div>
              <h1>Recap Confirmed</h1>
              <p>Thank you for approving the meeting notes for <span class="brand">${recap.organization.name}</span>.</p>
              <p>The action items have been synchronized with our team.</p>
          </div>
      </body>
      </html>
    `;

    return new NextResponse(thankYouHtml, { headers: { 'Content-Type': 'text/html' } });

  } catch (error: any) {
    console.error('Confirmation Error:', error);
    return new NextResponse('<h1>Invalid or Expired Link</h1><p>Please contact your agency representative for a new link.</p>', { 
        status: 401, 
        headers: { 'Content-Type': 'text/html' } 
    });
  }
}
