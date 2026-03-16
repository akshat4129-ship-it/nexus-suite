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
    const response = await axios.post('https://api.hubapi.com/oauth/v1/token', new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.HUBSPOT_CLIENT_ID!,
      client_secret: process.env.HUBSPOT_CLIENT_SECRET!,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/hubspot/callback`,
      code
    }));

    const { access_token, refresh_token, expires_in } = response.data;

    // Store in Integration table
    await prisma.integration.upsert({
      where: {
        org_id_type: {
          org_id: org.id,
          type: 'HUBSPOT'
        }
      },
      update: {
        access_token,
        refresh_token,
        token_expires_at: new Date(Date.now() + expires_in * 1000),
        status: 'CONNECTED'
      },
      create: {
        org_id: org.id,
        type: 'HUBSPOT',
        access_token,
        refresh_token,
        token_expires_at: new Date(Date.now() + expires_in * 1000),
        status: 'CONNECTED'
      }
    });

    // Redirect to settings or dashboard
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?integration=hubspot&status=success`);
  } catch (error: any) {
    console.error('HubSpot Callback Error:', error.response?.data || error.message);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings?integration=hubspot&status=error`);
  }
}
