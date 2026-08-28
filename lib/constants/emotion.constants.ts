// Lokasi file: src/lib/constants/emotion.constants.ts

import type { EmotionType } from '@/features/student/types/emotion.types';

export const EMOTION_LABEL_MAP: Record<EmotionType, string> = {
    HAPPY: 'Senang',
    CALM: 'Tenang',
    NEUTRAL: 'Netral',
    CONFUSED: 'Bingung',
    SAD: 'Sedih',
    DISAPPOINTED: 'Kecewa',
    ANGRY: 'Marah',
    AFRAID: 'Takut',
    ANXIOUS: 'Cemas',
    OTHER: 'Lainnya'
};

export const EMOTION_EMOJI_MAP: Record<EmotionType, string> = {
    HAPPY: '😊',
    CALM: '😌',
    NEUTRAL: '😐',
    CONFUSED: '😕',
    SAD: '😢',
    DISAPPOINTED: '😞',
    ANGRY: '😡',
    AFRAID: '😨',
    ANXIOUS: '😰',
    OTHER: '🤔'
};

export interface EmotionMeta {
    label: string;
    emoji: string;
    color: string;
    bgLight: string;
    border: string;
    activeClass: string;
}

export const EMOTION_CONFIG: Record<EmotionType, EmotionMeta> = {
    HAPPY: {
        label: 'Senang',
        emoji: '😊',
        color: 'text-amber-700',
        bgLight: 'bg-amber-50',
        border: 'border-amber-200',
        activeClass: 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-200'
    },
    CALM: {
        label: 'Tenang',
        emoji: '😌',
        color: 'text-emerald-700',
        bgLight: 'bg-emerald-50',
        border: 'border-emerald-200',
        activeClass: 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200'
    },
    NEUTRAL: {
        label: 'Netral',
        emoji: '😐',
        color: 'text-slate-700',
        bgLight: 'bg-slate-50',
        border: 'border-slate-200',
        activeClass: 'bg-slate-700 text-white border-slate-700 shadow-md shadow-slate-300'
    },
    CONFUSED: {
        label: 'Bingung',
        emoji: '😕',
        color: 'text-purple-700',
        bgLight: 'bg-purple-50',
        border: 'border-purple-200',
        activeClass: 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-200'
    },
    SAD: {
        label: 'Sedih',
        emoji: '😢',
        color: 'text-blue-700',
        bgLight: 'bg-blue-50',
        border: 'border-blue-200',
        activeClass: 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200'
    },
    DISAPPOINTED: {
        label: 'Kecewa',
        emoji: '😞',
        color: 'text-orange-700',
        bgLight: 'bg-orange-50',
        border: 'border-orange-200',
        activeClass: 'bg-orange-600 text-white border-orange-600 shadow-md shadow-orange-200'
    },
    ANGRY: {
        label: 'Marah',
        emoji: '😡',
        color: 'text-rose-700',
        bgLight: 'bg-rose-50',
        border: 'border-rose-200',
        activeClass: 'bg-rose-600 text-white border-rose-600 shadow-md shadow-rose-200'
    },
    AFRAID: {
        label: 'Takut',
        emoji: '😨',
        color: 'text-indigo-700',
        bgLight: 'bg-indigo-50',
        border: 'border-indigo-200',
        activeClass: 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
    },
    ANXIOUS: {
        label: 'Cemas',
        emoji: '😰',
        color: 'text-yellow-800',
        bgLight: 'bg-yellow-50',
        border: 'border-yellow-200',
        activeClass: 'bg-yellow-600 text-white border-yellow-600 shadow-md shadow-yellow-200'
    },
    OTHER: {
        label: 'Lainnya',
        emoji: '🤔',
        color: 'text-teal-700',
        bgLight: 'bg-teal-50',
        border: 'border-teal-200',
        activeClass: 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-200'
    }
};

export const AT_RISK_EMOTIONS: readonly EmotionType[] = [
    'SAD',
    'DISAPPOINTED',
    'ANGRY',
    'AFRAID',
    'ANXIOUS'
] as const;

export const AT_RISK_INTENSITY_THRESHOLD = 7;
