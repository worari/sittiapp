import { supabase } from '@/lib/supabase';
import formidable from 'formidable';
import { promises as fs } from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');

  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'File parsing error' });

    try {
      const {
        citizen_id,
        prefix,
        first_name,
        last_name,
        origin_unit,
        doc_number,
        doc_date,
        gov_type,
      } = fields;

      const fileUpload = async (file, filenamePrefix = '') => {
        if (!file) return null;
        const data = await fs.readFile(file.filepath);
        const fileName = `${filenamePrefix}-${Date.now()}-${file.originalFilename}`;
        const { data: uploadData, error } = await supabase.storage
          .from('military-docs')
          .upload(fileName, data, {
            contentType: file.mimetype,
            upsert: true,
          });
        if (error) throw error;
        return uploadData.path;
      };

      const filePaths: Record<string, string | null> = {};
      for (const key in files) {
        filePaths[key] = await fileUpload(files[key], key);
      }

      const { error: insertError } = await supabase
        .from('military_forms')
        .insert([
          {
            citizen_id,
            prefix,
            first_name,
            last_name,
            origin_unit,
            doc_number,
            doc_date,
            gov_type,
            ...filePaths,
          },
        ]);

      if (insertError) throw insertError;

      res.status(200).json({ message: 'บันทึกสำเร็จ' });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'เกิดข้อผิดพลาดในการบันทึก' });
    }
  });
}
