// Lokasi file: /src/features/bk/components/StudentRiasecRadar.tsx
'use client';

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function StudentRiasecRadar({ scores }: { scores?: { name: string; score: number }[] }) {
    if (!scores || scores.length === 0) {
        return <div className="h-48 flex items-center justify-center text-slate-400 text-sm">Data skor tidak tersedia.</div>;
    }

    return (
        <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={scores}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11, fontWeight: 'bold' }} />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                    <Radar name="Skor Minat" dataKey="score" stroke="#6366f1" fill="#818cf8" fillOpacity={0.5} />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}