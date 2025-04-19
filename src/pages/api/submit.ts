import { supabase } from '@/lib/supabase';
import formidable from 'formidable';
import { promises as fs } from 'fs';


export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({ multiples: true });

  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        reject({ error: 'File parsing error' });
        return;
      }
      for (const key in files) {
        const file = Array.isArray(files[key]) ? files[key][0] : files[key];
        if (file?.size === 0) {
          reject({ error: 'File size should be greater than 0' });
          return;
        }
      }
      resolve({ fields, files });
    });
  });
  
  

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

    const fileUpload = async (fileInput, filenamePrefix = '') => {
      const file = Array.isArray(fileInput) ? fileInput[0] : fileInput;
      if (!file || !file.filepath || file.size === 0) return null;
    
      const data = await fs.readFile(file.filepath);
      const safeName = encodeURIComponent(file.originalFilename || 'file').replace(/%/g, '');
      const safePrefix = encodeURIComponent(filenamePrefix).replace(/%/g, '');
      const fileName = `${safePrefix}-${Date.now()}-${safeName}`;
    
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
      filePaths[key] = await fileUpload(files[key], key);
    }

    const { error: insertError } = await supabase.from('military_forms').insert([
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

    return res.status(200).json({ message: 'บันทึกสำเร็จ' });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการบันทึก' });
  }
}
