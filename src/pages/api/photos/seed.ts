import { NextApiRequest, NextApiResponse } from 'next';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { PrismaClient } = require('@prisma/client');

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const prisma = new PrismaClient({ log: ['query'] });
  const photos = [
    {
      label: 'pumpkin',
      url:
        'https://firebasestorage.googleapis.com/v0/b/image-uploader-84022.appspot.com/o/pumpkin-5711688_640.jpg?alt=media&token=0f784115-d7e3-46ad-a4e6-971669a237fc',
    },
    {
      label: 'autumn',
      url:
        'https://firebasestorage.googleapis.com/v0/b/image-uploader-84022.appspot.com/o/autumn-5704791_640.jpg?alt=media&token=eab299e4-dd1e-467c-a7d9-56c56ea182b1',
    },
    {
      label: 'berries',
      url:
        'https://firebasestorage.googleapis.com/v0/b/image-uploader-84022.appspot.com/o/berries-5507771_640.jpg?alt=media&token=b890e7b8-ac6f-44da-b6be-1345cdc68e56',
    },
    {
      label: 'budapest',
      url:
        'https://firebasestorage.googleapis.com/v0/b/image-uploader-84022.appspot.com/o/budapest-4011922_640.jpg?alt=media&token=a7ee2731-9fc8-48fe-9d48-035bd76e801e',
    },
    {
      label: 'cat',
      url:
        'https://firebasestorage.googleapis.com/v0/b/image-uploader-84022.appspot.com/o/cat-4218424_640.jpg?alt=media&token=87bf237f-1040-4313-a638-ff82fc37eab7',
    },
    {
      label: 'cathedral',
      url:
        'https://firebasestorage.googleapis.com/v0/b/image-uploader-84022.appspot.com/o/cathedral-5756535_1280.jpg?alt=media&token=46e3d3af-16fe-4f40-8c31-9d0f3567f654',
    },
    {
      label: 'columns',
      url:
        'https://firebasestorage.googleapis.com/v0/b/image-uploader-84022.appspot.com/o/columns-5747584_1920.jpg?alt=media&token=9851fe87-2c43-4a00-ba57-d806e1a31a7b',
    },
    {
      label: 'empire',
      url:
        'https://firebasestorage.googleapis.com/v0/b/image-uploader-84022.appspot.com/o/empire-state-building-5677823_640.jpg?alt=media&token=3855de84-2682-4c9f-8c7f-e5e6631f2353',
    },
    {
      label: 'glass',
      url:
        'https://firebasestorage.googleapis.com/v0/b/image-uploader-84022.appspot.com/o/glass-5705718_640.jpg?alt=media&token=3a8e59ca-0e30-4509-a01f-8a185a58e55c',
    },
  ];

  const promiseArr = photos.map(photo => {
    return prisma.photo.create({ data: photo });
  });

  try {
    await Promise.all(promiseArr);
    res.status(201);
    res.end();
  } catch (e) {
    res.status(500);
    res.json({ error: e.message });
  } finally {
    await prisma.$disconnect();
  }
};
