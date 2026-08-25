// components/charts/VarkRadarChart.tsx
'use client';

import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip
} from 'recharts';

// Mendefinisikan tipe data yang diterima oleh komponen ini
interface VarkRadarChartProps {
    data: {
        code: string;
        raw_score: number | string;
    }[];
}

// Kamus untuk mengubah kode huruf menjadi teks lengkap di grafik
const varkFullNames: Record<string, string> = {
    'V': 'Visual',
    'A': 'Auditori',
    'R': 'Read/Write',
    'K': 'Kinestetik'
};

export default function VarkRadarChart({ data }: VarkRadarChartProps) {
    // 1. Memformat data dari database agar sesuai dengan format Recharts
    const chartData = data.map((item) => ({
        subject: varkFullNames[item.code.toUpperCase()] || item.code,
        score: Number(item.raw_score),
        fullMark: 20 // Asumsi nilai maksimal dari 20 soal adalah 20 poin
    }));

    // 2. Custom Tooltip agar saat grafik disentuh, tampilannya rapi
    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-xl border border-slate-700">
                    {payload[0].payload.subject}: <span className="text-teal-400">{payload[0].value} Poin</span>
                </div>
            );
        }
        return null;
    };

    // 3. Render Grafik
    return (
        <div className="w-full h-75 sm:h-87.5 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    {/* PolarGrid adalah garis jaring laba-laba di latar belakang */}
                    <PolarGrid stroke="#e2e8f0" />

                    {/* PolarAngleAxis adalah teks label (Visual, Auditori, dll) di ujung jaring */}
                    <PolarAngleAxis
                        dataKey="subject"
                        tick={{ fill: '#475569', fontSize: 12, fontWeight: 'bold' }}
                    />

                    {/* PolarRadiusAxis adalah skala angka (0 sampai 20) */}
                    <PolarRadiusAxis
                        angle={30}
                        domain={[0, 20]}
                        tick={{ fill: '#94a3b8', fontSize: 10 }}
                    />

                    <Tooltip content={<CustomTooltip />} />

                    {/* Radar adalah area yang terisi warna berdasarkan skor siswa */}
                    <Radar
                        name="Skor VARK"
                        dataKey="score"
                        stroke="#0d9488" /* Warna Teal-600 */
                        fill="#14b8a6"   /* Warna Teal-500 */
                        fillOpacity={0.5}
                        animationDuration={1500}
                    />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}