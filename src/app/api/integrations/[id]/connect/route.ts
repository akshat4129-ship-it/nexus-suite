import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!orgId) {
      return NextResponse.json({ error: 'Org not found in session' }, { status: 400 });
    }

    const org = await prisma.organization.findUnique({
      where: { clerk_org_id: orgId }
    });

    if (!org) {
      return NextResponse.json({ error: 'Org not found in database' }, { status: 404 });
    }

    const processedParams = (await params) as { id: string };
    const providerId = processedParams.id.toUpperCase().replace('-', '_');

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005';
    let authUrl = '';

    const state = Buffer.from(JSON.stringify({ orgId: org.id })).toString('base64');

    switch (providerId) {
      case 'HUBSPOT':
        const hubspotScopes = 'crm.objects.contacts.read crm.objects.contacts.write crm.objects.companies.read crm.objects.companies.write oauth';
        authUrl = `https://app.hubspot.com/oauth/authorize?client_id=${process.env.HUBSPOT_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${appUrl}/api/integrations/hubspot/callback`)}&scope=${encodeURIComponent(hubspotScopes)}&state=${state}`;
        break;
      case 'GOOGLE_CALENDAR':
      case 'GOOGLE':
      case 'GOOGLE_MEET':
        const googleScopes = 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email';
        authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${appUrl}/api/integrations/google/callback`)}&response_type=code&scope=${encodeURIComponent(googleScopes)}&access_type=offline&prompt=consent&state=${state}`;
        break;
      case 'MICROSOFT':
      case 'OUTLOOK':
      case 'TEAMS':
      case 'MS_TEAMS':
        const microsoftScopes = 'offline_access Calendars.ReadWrite User.Read';
        authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${process.env.AZURE_CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(`${appUrl}/api/integrations/microsoft/callback`)}&response_mode=query&scope=${encodeURIComponent(microsoftScopes)}&state=${state}`;
        break;
      case 'ZOOM':
        authUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${process.env.ZOOM_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${appUrl}/api/integrations/zoom/callback`)}&state=${state}`;
        break;
      default:
        // Mock fallback for anything not explicitly set up yet
        await prisma.integration.upsert({
          where: {
            org_id_type: {
              org_id: org.id,
              type: providerId as any
            }
          },
          update: {
            access_token: `mock_access_token_${providerId}`,
            refresh_token: `mock_refresh_token_${providerId}`,
            token_expires_at: new Date(Date.now() + 3600 * 1000),
            status: 'CONNECTED'
          },
          create: {
            org_id: org.id,
            type: providerId as any,
            access_token: `mock_access_token_${providerId}`,
            refresh_token: `mock_refresh_token_${providerId}`,
            token_expires_at: new Date(Date.now() + 3600 * 1000),
            status: 'CONNECTED'
          }
        });
        return NextResponse.redirect(`${appUrl}/settings`);
    }

    return NextResponse.redirect(authUrl);
  } catch (error: any) {
    console.error(`Mock Connect Error:`, error);
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || ''}/settings?status=error`);
  }
}
