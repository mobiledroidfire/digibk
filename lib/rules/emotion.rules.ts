// Lokasi file: src/lib/rules/emotion.rules.ts

import type { EmotionType } from '@/features/student/types/emotion.types';
import {
    EMOTION_LABEL_MAP,
    AT_RISK_EMOTIONS,
    AT_RISK_INTENSITY_THRESHOLD
} from '@/lib/constants/emotion.constants';

export type RiskLevel = 'CRITICAL' | 'STABLE' | 'UNCHECKED';

/**
 * Rule Engine: Menilai apakah seorang siswa berada pada kategori risiko tinggi (Kritis).
 * Siswa dianggap kritis jika emosi terakhir termasuk emosi berisiko (SAD, DISAPPOINTED, ANGRY, AFRAID, ANXIOUS)
 * DAN intensitas emosi bernilai >= threshold (default: 7).
 */
export function isAtRisk(emotion?: EmotionType | null, intensity?: number | null): boolean {
    if (!emotion || intensity === undefined || intensity === null) {
        return false;
    }
    return AT_RISK_EMOTIONS.includes(emotion) && intensity >= AT_RISK_INTENSITY_THRESHOLD;
}

/**
 * Rule Engine: Mengembalikan status evaluasi risiko lengkap ('CRITICAL' | 'STABLE' | 'UNCHECKED').
 */
export function assessRisk(emotion?: EmotionType | null, intensity?: number | null): RiskLevel {
    if (!emotion || intensity === undefined || intensity === null) {
        return 'UNCHECKED';
    }
    if (isAtRisk(emotion, intensity)) {
        return 'CRITICAL';
    }
    return 'STABLE';
}

/**
 * Rule Engine: Mengembalikan teks terjemahan label emosi dalam Bahasa Indonesia.
 */
export function getEmotionLabel(emotion?: EmotionType | null): string {
    if (!emotion) return 'Tidak Diketahui';
    return EMOTION_LABEL_MAP[emotion] || emotion;
}
