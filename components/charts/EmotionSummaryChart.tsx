// Lokasi file: /src/components/charts/EmotionSummaryChart.tsx
'use client';

import React from 'react';
import type { EmotionStat } from '@/features/bk/actions/dashboard.actions';
import type { EmotionType } from '@/features/student/types/emotion.types';
import { getEmotionEmoji } from '@/lib/rules/emotion.rules';

const EMOTION_CONFIG: Record<EmotionType, { label: string, color: string, bg: string }> = {
    'HAPPY': { label: 'Senang', color: 'bg-emerald-500', bg: 'bg-emerald-50' },
    'CALM': { label: 'Tenang', color: 'bg-teal-400', bg: 'bg-teal-50' },
    'NEUTRAL': { label: 'Netral', color: 'bg-slate-400', bg: 'bg-slate-50' },
    'CONFUSED': { label: 'Bingung', color: 'bg-amber-400', bg: 'bg-amber-50' },
    'SAD': { label: 'Sedih', color: 'bg-blue-500', bg: 'bg-blue-50' },
    'DISAPPOINTED': { label: 'Kecewa', color: 'bg-indigo-500', bg: 'bg-indigo-50' },
    'ANGRY': { label: 'Marah', color: 'bg-rose-500', bg: 'bg-rose-50' },
    'AFRAID': { label: 'Takut', color: 'bg-purple-500', bg: 'bg-purple-50' },
    'ANXIOUS': { label: 'Cemas', color: 'bg-orange-500', bg: 'bg-orange-50' },
    'OTHER': { label: 'Lainnya', color: 'bg-slate-300', bg: 'bg-slate-100' }
};

interface EmotionSummaryChartProps {
    data: EmotionStat[];
    total: number;
}

export default function EmotionSummaryChart({ data, total }: EmotionSummaryChartProps) {
    if (!data || data.length === 0 || total === 0) {
        return (
            <div className="h-40 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                <p className="text-sm text-slate-400 font-medium">Belum ada data emosi minggu ini.</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* 1. Bar Visual Utama */}
            <div className="w-full h-6 flex rounded-full overflow-hidden mb-6 bg-slate-100 shadow-inner">
                {data.map((stat, idx) => (
                    <div
                        key={stat.emotion}
                        style={{ width: `${stat.percentage}%` }}
                        className={`h-full ${EMOTION_CONFIG[stat.emotion].color} transition-all duration-1000 ease-out border-r border-white/20 first:rounded-l-full last:rounded-r-full hover:opacity-80 cursor-pointer`}
                        title={`${EMOTION_CONFIG[stat.emotion].label}: ${stat.percentage}%`}
                    />
                ))}
            </div>

            {/* 2. Legenda / Detail Rincian */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {data.map((stat) => {
                    const config = EMOTION_CONFIG[stat.emotion];
                    return (
                        <div key={stat.emotion} className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${config.color} shadow-xs shrink-0`} />
                            <div>
                                <p className="text-xs font-bold text-slate-700 flex items-center gap-1">
                                    <span>{getEmotionEmoji(stat.emotion)}</span>
                                    <span>{config.label}</span>
                                </p>
                                <p className="text-[11px] font-medium text-slate-400">{stat.count} Siswa ({stat.percentage}%)</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}