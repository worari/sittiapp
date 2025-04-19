// pages/api/person.ts
import { IncomingForm } from 'formidable';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const form = new IncomingForm({ uploadDir: './public/uploads', keepExtensions: true });

  form.parse(req, async (err, fields, files) => {
    try {
      const { citizenId, prefix, firstName, lastName, unit, documentFrom, documentDate, officerType } = fields;

      const exists = await prisma.person.findUnique({ where: { citizenId } });
      if (exists) return res.status(400).json({ error: 'มีข้อมูลบัตรประชาชนนี้อยู่แล้ว' });

      const getPath = (f) => (f ? '/uploads/' + path.basename(f[0].filepath) : null);

      const created = await prisma.person.create({
        data: {
          citizenId,
          prefix,
          firstName,
          lastName,
          unit,
          documentFrom,
          documentDate: new Date(documentDate),
          officerType,

          doc_sor3: getPath(files.doc_sor3),
          doc_sor8: getPath(files.doc_sor8),
          doc_student: getPath(files.doc_student),
          doc_start: getPath(files.doc_start),
          doc_end: getPath(files.doc_end),
          doc_transfer_out: getPath(files.doc_transfer_out),
          doc_transfer_in: getPath(files.doc_transfer_in),
          doc_move: getPath(files.doc_move),
          doc_history: getPath(files.doc_history),
          doc_other: getPath(files.doc_other),
          doc_citizencard: getPath(files.doc_citizencard),
          doc_gov: getPath(files.doc_gov),
        }
      });

      res.status(200).json(created);
    } catch (e) {
      res.status(500).json({ error: 'ไม่สามารถบันทึกข้อมูลได้' });
    }
  });
}
ื