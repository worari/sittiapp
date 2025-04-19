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

      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];

      const fileUpload = async (file, filenamePrefix = '') => {
        if (!file) return null;

        if (!allowedTypes.includes(file.mimetype)) {
          throw new Error(`ไฟล์ประเภท ${file.mimetype} ไม่ได้รับอนุญาต`);
        }

        const data = await fs.readFile(file.filepath);

        const folder = `docs/${citizen_id}`;
        const fileName = `${folder}/${filenamePrefix}-${Date.now()}-${file.originalFilename}`;

        const { data: uploadData, error } = await supabase.storage
          .from('military-docs')
          .upload(fileName, data, {
            contentType: file.mimetype,
            upsert: true,
          });

        if (error) throw error;
        return uploadData.path;
      };

      const filePaths = {};
      for (const key in files) {
        const fileItem = files[key];

        // รองรับกรณี array ของไฟล์
        if (Array.isArray(fileItem)) {
          const uploadedPaths = await Promise.all(
            fileItem.map((f, i) => fileUpload(f, `${key}-${i}`))
          );
          filePaths[key] = uploadedPaths.join(','); // หรือเก็บเป็น array ขึ้นกับ DB schema
        } else {
          filePaths[key] = await fileUpload(fileItem, key);
        }
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
      res.status(500).json({ error: error.message || 'เกิดข้อผิดพลาดในการบันทึก' });
    }
  });
}
