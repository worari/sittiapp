'use client';
import { useState } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    citizenId: '',
    firstName: '',
    lastName: '',
    originUnit: '',
    docNumber: '',
    docDate: '',
    govType: '',
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify({
        ...formData,
        docDate: new Date(formData.docDate)
      }),
    });
    alert('ส่งข้อมูลเรียบร้อย');
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">ฟอร์มรับรองเวลาราชการ</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="citizenId" placeholder="เลขบัตรประชาชน" onChange={handleChange} className="w-full p-2 border" required />
        <input name="firstName" placeholder="ชื่อ" onChange={handleChange} className="w-full p-2 border" required />
        <input name="lastName" placeholder="นามสกุล" onChange={handleChange} className="w-full p-2 border" required />
        <input name="originUnit" placeholder="หน่วยต้นเรื่อง" onChange={handleChange} className="w-full p-2 border" required />
        <input name="docNumber" placeholder="เลขหนังสือเข้า" onChange={handleChange} className="w-full p-2 border" required />
        <input name="docDate" type="date" onChange={handleChange} className="w-full p-2 border" required />
        <select name="govType" onChange={handleChange} className="w-full p-2 border" required>
          <option value="">-- เลือกประเภทข้าราชการ --</option>
          <option value="ในกห">ใน กห.</option>
          <option value="นอกกห">นอก กห.</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">ส่งข้อมูล</button>
      </form>
    </div>
  );
}