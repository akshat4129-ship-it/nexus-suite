import Fuse from 'fuse.js';
import { prisma } from './prisma';

interface Matchable {
  name: string;
  email: string;
}

/**
 * Fuzzy matches an owner name to meeting attendees or organization users
 */
export async function matchOwner(
  ownerName: string,
  meetingId: string,
  orgId: string
): Promise<string | null> {
  if (!ownerName) return null;

  // 1. Fetch meeting attendees
  const attendees = await prisma.meetingAttendee.findMany({
    where: { meeting_id: meetingId },
    select: { name: true, email: true }
  });

  // 2. Fetch organization users
  const users = await prisma.user.findMany({
    where: { org_id: orgId },
    select: { name: true, email: true }
  });

  // Combine lists
  const matchables: Matchable[] = [
    ...attendees.map((a: any) => ({ name: a.name, email: a.email })),
    ...users.map((u: any) => ({ name: u.name, email: u.email }))
  ];

  // Remove duplicates by email
  const uniqueMatchables = Array.from(new Map(matchables.map((m: any) => [m.email, m])).values());

  if (uniqueMatchables.length === 0) return null;

  // Fuse.js options
  const fuse = new Fuse(uniqueMatchables, {
    keys: ['name'],
    threshold: 0.4, // Adjust for sensitivity
  });

  const results = fuse.search(ownerName);

  if (results.length > 0) {
    return results[0].item.email;
  }

  return null;
}
