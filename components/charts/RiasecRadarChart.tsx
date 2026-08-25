// components/charts/RiasecRadarChart.tsx
'use client';

import React from 'react';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip,
    TooltipContentProps
} from 'recharts';

// 1. Tipe data dari API/Database
export interface RiasecScoreItem {
    code: string;
    raw_score: number | string;
}

interface RiasecRadarChartProps {
    data: RiasecScoreItem[];
}

const riasecNames: Record<string, string> = {
    'R': 'Realistis',
    'I': 'Investigatif',
    'A': 'Artistik',
    'S': 'Sosial',
    'E': 'Enterprising',
    'C': 'Konvensional'
};

// 2. [BARU] Mendefinisikan bentuk data yang masuk ke dalam grafik
interface ChartDataPoint {
    subject: string;
    score: number;
    fullMark: number;
}

// 3. Memperbaiki Custom Tooltip agar bebas error TypeScript
const CustomTooltip = ({ active, payload }: TooltipContentProps) => {
    if (active && payload && payload.length > 0) {
        const item = payload[0];

        // [PERBAIKAN] Memberi tahu TypeScript bahwa 'item.payload' adalah ChartDataPoint
        const originalData = item.payload as ChartDataPoint;

        return (
            <div className="bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xl border border-slate-700">
                {/* Menggunakan originalData.subject alih-alih item.payload.subject */}
                {originalData.subject}: <span className="text-indigo-400">{item.value} Poin</span>
            </div>
        );
    }
    return null;
};

export default function RiasecRadarChart({ data }: RiasecRadarChartProps) {
    const chartData = data.map((item) => ({
        subject: riasecNames[item.code.toUpperCase()] || item.code,
        score: Number(item.raw_score),
        fullMark: 35
    }));

    return (
        // Menggunakan min-h-[250px] karena min-h-62.5 mungkin tidak valid di pengaturan standar Tailwind
        <div className="w-full h-full min-h-62.5 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>

                    <PolarGrid stroke="#e2e8f0" />

                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }}
                    />

                    <PolarRadiusAxis
                        angle={30}
                        domain={[0, 35]}
                        tick={{ fill: '#94a3b8', fontSize: 9 }}
                        tickCount={5}
                    />

                    <Tooltip content={CustomTooltip} />

                    <Radar
                        name="Skor RIASEC"
                        dataKey="score"
                        stroke="#4f46e5"
                        fill="#6366f1"
                        fillOpacity={0.4}
                        animationDuration={1500}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}