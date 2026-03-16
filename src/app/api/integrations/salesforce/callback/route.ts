import { NextResponse } from 'next/server';
import { requireAuth, getCurrentOrg } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import axios from 'axios';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await requireAuth();
    const org = await getCurrentOrg();
    if (!org) throw new Error('Org not found');

    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'No code provided' }, { status: 400 });
    }

    // Exchange code for tokens
    const response = await axios.post('https://login.salesforce.com/services/oauth2/token', new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.SALESFORCE_CLIENT_ID!,
      client_secret: process.env.SALESFORCE_CLIENT_SECRET!,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/salesforce/callback`,
      code
    }));

    const { access_token, refresh_token, instance_url } = response.data;

    // Store in Integration table
    await prisma.integration.upsert({
      where: {
        org_id_type: {
          org_id: org.id,
          type: 'SALESFORCE'
        }
      },
      update: {
        access_token,
        refresh_token,
        status: 'CONNECTED',
        metadata: { instance_url }
      },
      create: {
        org_id: org.id,
        type: 'SALESFORCE',
        access_token,
        refresh_token,
        status: 'CONNECTED',
        metadata: { instance_url }
      }
    });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?integration=salesforce&status=success`);
  } catch (error: any) {
    console.error('Salesforce Callback Error:', error.response?.data || error.message);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?integration=salesforce&status=error`);
  }
}
