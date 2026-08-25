// Lokasi file: /src/features/bk/components/StudentEmotionLine.tsx
'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Definisi tipe data yang ketat (Tanpa 'any')
interface EmotionData {
    created_at: string;
    intensity: number;
    emotion: string;
}

interface CustomTooltipPayload {
    payload?: {
        emosi?: string;
    };
}

export default function StudentEmotionLine({ data }: { data: EmotionData[] }) {
    if (!data || data.length === 0) return null;

    const chartData = [...data].reverse().map(e => ({
        tanggal: new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(new Date(e.created_at)),
        intensitas: e.intensity,
        emosi: e.emotion
    }));

    return (
        <div className="h-48 w-full mb-6">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="tanggal" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 10]} tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <Tooltip
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        // Dibiarkan tanpa tipe eksplisit agar TypeScript yang menyesuaikan otomatis
                        formatter={(value, name, props) => {
                            const tooltipProps = props as unknown as CustomTooltipPayload;
                            const emosi = tooltipProps?.payload?.emosi || '';
                            return [`Skor: ${value} (${emosi})`, 'Intensitas'];
                        }}
                    />
                    <Line type="monotone" dataKey="intensitas" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}