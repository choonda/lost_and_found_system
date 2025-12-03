import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export async function GET(req: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new Response('Unauthorized', { status: 401 });

  // ensure ADMIN
  const currentUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return new Response('Forbidden', { status: 403 });
  }

  try {
    const totalLost = await prisma.item.count({ where: { type: 'LOST' } });
    const totalFound = await prisma.item.count({ where: { type: 'FOUND' } });

    // Lost statuses
    const lostLooking = await prisma.item.count({ where: { type: 'LOST', status: 'LOOKING' } });
    const lostFound = await prisma.item.count({ where: { type: 'LOST', status: 'FOUND' } });
    const lostClaimed = await prisma.item.count({ where: { type: 'LOST', status: 'CLAIMED' } });

    // Found statuses
    const foundFound = await prisma.item.count({ where: { type: 'FOUND', status: 'FOUND' } });
    const foundClaimed = await prisma.item.count({ where: { type: 'FOUND', status: 'CLAIMED' } });

    const result = {
      totalLost,
      totalFound,
      lost: [
        { name: 'Looking', value: lostLooking, fill: '#0088FE' },
        { name: 'Found', value: lostFound, fill: '#00C49F' },
        { name: 'Claimed', value: lostClaimed, fill: '#FFBB28' },
      ],
      found: [
        { name: 'Found', value: foundFound, fill: '#00C49F' },
        { name: 'Claimed', value: foundClaimed, fill: '#FF8042' },
      ],
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Failed to fetch admin stats', err);
    return new Response('Failed to fetch stats', { status: 500 });
  }
}
