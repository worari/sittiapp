'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function MilitaryForm() {
  const [govType, setGovType] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await fetch('/api/submit', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      toast.success('ส่งข้อมูลเรียบร้อยแล้ว!');
    } else {
      toast.error('เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">รับรองเวลาราชการตอนเป็นทหาร</h2>
      <form onSubmit={handleSubmit} className="bg-white border border-sky-400 rounded-xl shadow p-6 space-y-4">
        <div>
          <label className="block font-medium text-gray-700">เลขบัตรประชาชน</label>
          <input type="text" name="citizen_id" className="mt-1 w-full border border-gray-300 rounded-lg p-2" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-medium text-gray-700">คำนำหน้า</label>
            <input type="text" name="prefix" className="mt-1 w-full border border-gray-300 rounded-lg p-2" required />
          </div>
          <div>
            <label className="block font-medium text-gray-700">ชื่อ</label>
            <input type="text" name="first_name" className="mt-1 w-full border border-gray-300 rounded-lg p-2" required />
          </div>
          <div>
            <label className="block font-medium text-gray-700">นามสกุล</label>
            <input type="text" name="last_name" className="mt-1 w-full border border-gray-300 rounded-lg p-2" required />
          </div>
        </div>

        <div>
          <label className="block font-medium text-gray-700">หน่วยต้นเรื่องหนังสือ</label>
          <input type="text" name="origin_unit" className="mt-1 w-full border border-gray-300 rounded-lg p-2" required />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700">ที่หนังสือเข้า</label>
            <input type="text" name="doc_number" className="mt-1 w-full border border-gray-300 rounded-lg p-2" required />
          </div>
          <div>
            <label className="block font-medium text-gray-700">วันที่หนังสือ</label>
            <input type="date" name="doc_date" className="mt-1 w-full border border-gray-300 rounded-lg p-2" required />
          </div>
        </div>

        <div>
          <label className="block font-medium text-gray-700">ประเภทข้าราชการ</label>
          <select
            name="gov_type"
            value={govType}
            onChange={(e) => setGovType(e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-lg p-2"
            required
          >
            <option value="">-- เลือก --</option>
            <option value="ในกห">ใน กห.</option>
            <option value="นอกกห">นอก กห.</option>
          </select>
        </div>

        {govType === 'ในกห' && (
          <div>
            <h4 className="mt-6 mb-2 text-green-600 font-semibold">แนบไฟล์เอกสาร (ใน กห.)</h4>
            {['doc_sor3', 'doc_sor8', 'doc_student', 'doc_start', 'doc_end', 'doc_transfer_out', 'doc_transfer_in', 'doc_move', 'doc_history', 'doc_other'].map((name, i) => (
              <input key={i} type="file" name={name} className="mb-2 w-full border border-sky-400 rounded-lg p-2" />
            ))}
          </div>
        )}

        {govType === 'นอกกห' && (
          <div>
            <h4 className="mt-6 mb-2 text-green-600 font-semibold">แนบไฟล์เอกสาร (นอก กห.)</h4>
            {['doc_sor3', 'doc_sor8', 'doc_citizencard', 'doc_gov', 'doc_other'].map((name, i) => (
              <input key={i} type="file" name={name} className="mb-2 w-full border border-sky-400 rounded-lg p-2" />
            ))}
          </div>
        )}

        <button type="submit" className="bg-blue-700 text-white py-2 px-4 rounded-lg hover:bg-blue-800 transition">
          ส่งข้อมูล
        </button>
      </form>
    </div>
  );
}
