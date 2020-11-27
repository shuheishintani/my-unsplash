import { NextApiRequest, NextApiResponse } from 'next';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const { PrismaClient } = require('@prisma/client');
import { PrismaClient } from '@prisma/client';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const prisma = new PrismaClient({ log: ['query'] });

  if (req.method === 'POST') {
    try {
      const { label, url } = req.body;
      const photo = await prisma.photo.create({
        data: { label, url },
      });

      res.status(201);
      res.json({ photo });
    } catch (e) {
      console.error(e);

      res.status(500);
      res.json({ error: 'Sorry unable to save photo to database' });
    } finally {
      await prisma.$disconnect();
    }
  }

  if (req.method === 'GET') {
    try {
      const photos = await prisma.photo.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      res.status(200);
      res.json({ photos });
    } catch (e) {
      console.error(e);

      res.status(500);
      res.json({ error: 'Sorry unable to fetch photos from database' });
    } finally {
      await prisma.$disconnect();
    }
  }
};
