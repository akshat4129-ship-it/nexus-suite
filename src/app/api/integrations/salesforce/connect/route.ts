import { NextResponse } from 'next/server';
import { requireAuth, getCurrentOrg } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireAuth();
    const org = await getCurrentOrg();
    if (!org) throw new Error('Org not found');

    const clientId = process.env.SALESFORCE_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/integrations/salesforce/callback`;
    
    // Salesforce login URL (use test.salesforce.com for sandbox if needed)
    const baseAuthUrl = 'https://login.salesforce.com/services/oauth2/authorize';
    const authUrl = `${baseAuthUrl}?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=api refresh_token offline_access`;

    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
