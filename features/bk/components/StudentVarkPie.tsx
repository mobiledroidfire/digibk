// Lokasi file: /src/features/bk/components/StudentVarkPie.tsx
'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// Definisi tipe data yang ketat (Tanpa 'any')
interface VarkScore {
    name: string;
    score: number;
    fill: string;
}

export default function StudentVarkPie({ scores }: { scores?: VarkScore[] }) {
    if (!scores || scores.length === 0) {
        return <div className="h-48 flex items-center justify-center text-slate-400 text-sm">Data skor tidak tersedia.</div>;
    }

    return (
        <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={scores}
                        cx="50%"
                        cy="45%"
                        innerRadius={40}
                        outerRadius={60}
                        paddingAngle={5}
                        dataKey="score"
                    >
                        {scores.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                    </Pie>
                    <Tooltip
                        // Dibiarkan tanpa tipe eksplisit agar TypeScript yang menyesuaikan otomatis
                        formatter={(value) => [`Skor: ${value}`]}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}