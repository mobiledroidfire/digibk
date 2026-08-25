// Lokasi file: /src/features/bk/components/VarkPieChart.tsx
'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function VarkPieChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <p className="text-slate-500 text-sm">Belum ada data gaya belajar di kelas ini.</p>
            </div>
        );
    }

    return (
        <div className="h-75 w-full pb-4">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="45%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: any) => [`${value} Siswa`]}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    {/* PERBAIKAN: Menambahkan margin/jarak di atas teks legend */}
                    <Legend
                        verticalAlign="bottom"
                        iconType="circle"
                        wrapperStyle={{ paddingTop: '15px' }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}