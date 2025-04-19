'use client';
import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@/components/ui/table';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function DashboardPage() {
  const [forms, setForms] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('military_forms')
        .select('*')
        .order('doc_date', { ascending: false });

      if (error) {
        console.error('Error fetching data:', error);
      } else {
        setForms(data);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="m-4 p-4 shadow-md rounded-2xl">
      <CardContent>
        <h2 className="text-2xl font-semibold mb-4">รายการแบบฟอร์มที่ส่งเข้ามา</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อ</TableHead>
                <TableHead>หน่วยต้นสังกัด</TableHead>
                <TableHead>วันที่หนังสือ</TableHead>
                <TableHead>ประเภท</TableHead>
                <TableHead>ไฟล์แนบ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {forms.map((form, idx) => (
                <TableRow key={idx}>
                  <TableCell>{`${form.prefix} ${form.first_name} ${form.last_name}`}</TableCell>
                  <TableCell>{form.origin_unit}</TableCell>
                  <TableCell>{form.doc_date}</TableCell>
                  <TableCell>{form.gov_type}</TableCell>
                  <TableCell className="space-y-1">
                    {Object.entries(form)
                      .filter(([key, val]) => key !== 'id' && key !== 'citizen_id' && typeof val === 'string' && val.includes('/'))
                      .map(([key, path], i) => (
                        <div key={i}>
                          <Link
                            href={`https://https://nsawdsddclmzzjifvywz.supabase.co/storage/v1/object/public/military-docs/${path}`}
                            target="_blank"
                            className="text-blue-600 underline"
                          >
                            {key}
                          </Link>
                        </div>
                      ))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
