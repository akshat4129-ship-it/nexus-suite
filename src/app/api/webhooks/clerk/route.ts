import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: WebhookEvent

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  const { id } = evt.data
  const eventType = evt.type

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, image_url } = evt.data
    const email = email_addresses[0].email_address
    const name = `${first_name || ''} ${last_name || ''}`.trim()

    await prisma.user.create({
      data: {
        clerk_user_id: id,
        email,
        name,
        avatar_url: image_url,
      },
    })
  }

  if (eventType === 'organization.created') {
    const { id, name, slug } = evt.data
    
    await prisma.organization.create({
      data: {
        clerk_org_id: id,
        name,
        slug: slug || id,
      },
    })
  }

  if (eventType === 'organizationMembership.created') {
    const { organization, public_user_data, role } = evt.data
    
    const dbOrg = await prisma.organization.findUnique({
      where: { clerk_org_id: organization.id }
    })

    if (dbOrg) {
      await prisma.user.update({
        where: { clerk_user_id: public_user_data.user_id },
        data: {
          org_id: dbOrg.id,
          role: role === 'admin' ? 'ADMIN' : role === 'owner' ? 'OWNER' : 'MEMBER'
        }
      })
    }
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data
    if (id) {
        await prisma.user.update({
            where: { clerk_user_id: id },
            data: { 
                deleted_at: new Date()
            }
        }).catch(() => {})
    }
  }

  return new Response('', { status: 200 })
}
