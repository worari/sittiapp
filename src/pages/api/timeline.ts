import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/db';

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  try {
    const timeline = await prisma.submission.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json(timeline);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Timeline fetch failed' });
  }
}