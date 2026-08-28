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

export const AT_RISK_EMOTIONS: readonly EmotionType[] = [
    'SAD',
    'DISAPPOINTED',
    'ANGRY',
    'AFRAID',
    'ANXIOUS'
] as const;

export const AT_RISK_INTENSITY_THRESHOLD = 7;
