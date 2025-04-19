import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import formidable from 'formidable';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const form = formidable({ multiples: true });

  const data = await new Promise((resolve, reject) => {
    form.parse(req as any, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

  const { fields, files }: any = data;
  const uploadPath = fields.gov_type === 'ใน กห.' ? 'military/internal' : 'military/external';

  const uploadedFiles: Record<string, string> = {};

  for (const key in files) {
    const file = Array.isArray(files[key]) ? files[key][0] : files[key];
    const fileStream = fs.createReadStream(file.filepath);
    const fileExt = file.originalFilename?.split('.').pop();
    const filename = `${uuidv4()}.${fileExt}`;
    const { data: uploadData, error } = await supabase.storage
      .from('military-docs')
      .upload(`${uploadPath}/${filename}`, fileStream, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      console.error('Upload error:', error);
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }

    uploadedFiles[key] = uploadData?.path || '';
  }

  await prisma.militaryForm.create({
    data: {
      citizenId: fields.citizen_id,
      prefix: fields.prefix,
      firstName: fields.first_name,
      lastName: fields.last_name,
      originUnit: fields.origin_unit,
      docNumber: fields.doc_number,
      docDate: new Date(fields.doc_date),
      govType: fields.gov_type,
      docs: uploadedFiles,
    },
  });

  return NextResponse.json({ message: 'Submitted successfully' });
}
