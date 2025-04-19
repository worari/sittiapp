import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { citizenId } = req.query;

  if (!citizenId || typeof citizenId !== 'string') {
    return res.status(400).json({ error: 'กรุณาระบุ citizenId' });
  }

  try {
    const result = await prisma.person.findMany({
      where: {
        citizenId,
      },
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: 'เกิดข้อผิดพลาดขณะค้นหา' });
  }
}
