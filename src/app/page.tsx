'use client';
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Clock } from 'lucide-react';

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

  const [timeline, setTimeline] = useState([]);

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
    fetchTimeline();
  };

  const fetchTimeline = async () => {
    const res = await fetch('/api/timeline');
    const data = await res.json();
    setTimeline(data);
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">ฟอร์มรับรองเวลาราชการ</h2>
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
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

      <h3 className="text-xl font-semibold mb-4">Timeline การส่งข้อมูล</h3>
      <div className="relative border-l-2 border-blue-500 pl-6 space-y-4">
        {timeline.map((item: any, idx: number) => (
          <div key={idx} className="relative">
            <span className="absolute -left-3 top-1.5 w-6 h-6 bg-white border-2 border-blue-500 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
            </span>
            <Card className="p-4 shadow-md">
              <p className="font-semibold">{item.firstName} {item.lastName} ({item.govType})</p>
              <p className="text-sm text-gray-600">หน่วย: {item.originUnit}</p>
              <p className="text-sm">เลขหนังสือ: {item.docNumber}</p>
              <p className="text-xs text-gray-500">เมื่อ: {new Date(item.createdAt).toLocaleString()}</p>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}