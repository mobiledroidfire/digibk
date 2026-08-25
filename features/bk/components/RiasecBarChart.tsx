// Lokasi file: /src/features/bk/components/RiasecBarChart.tsx
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function RiasecBarChart({ data }: { data: any[] }) {
    if (!data || data.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <p className="text-slate-500 text-sm">Belum ada data tes RIASEC di kelas ini.</p>
            </div>
        );
    }

    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis
                        dataKey="short"
                        tick={{ fontSize: 12, fill: '#64748b', fontWeight: 'bold' }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: '#64748b' }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                    />
                    <Tooltip
                        cursor={{ fill: '#f1f5f9' }}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        formatter={(value: any, _name: any, props: any) => [
                            <span key="val" className="font-bold text-slate-700">{value} Siswa</span>,
                            <span key="name" className="text-slate-500">{props.payload.name}</span>
                        ]}
                        labelStyle={{ display: 'none' }}
                    />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}