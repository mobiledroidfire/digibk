// Lokasi file: src/lib/rules/emotion.rules.ts

import type { EmotionType } from '@/features/student/types/emotion.types';
import {
    EMOTION_LABEL_MAP,
    EMOTION_EMOJI_MAP,
    EMOTION_CONFIG,
    AT_RISK_EMOTIONS,
    AT_RISK_INTENSITY_THRESHOLD,
    type EmotionMeta
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

/**
 * Rule Engine: Mengembalikan emoji yang sesuai untuk tipe emosi.
 */
export function getEmotionEmoji(emotion?: EmotionType | null): string {
    if (!emotion) return '✨';
    return EMOTION_EMOJI_MAP[emotion] || '✨';
}

/**
 * Rule Engine: Mengembalikan label emosi berformat gabungan dengan emoji (cth: "😊 Senang").
 */
export function getEmotionLabelWithEmoji(emotion?: EmotionType | null): string {
    if (!emotion) return 'Tidak Diketahui';
    const emoji = getEmotionEmoji(emotion);
    const label = getEmotionLabel(emotion);
    return `${emoji} ${label}`;
}

/**
 * Rule Engine: Mengembalikan konfigurasi lengkap styling & metadata emosi.
 */
export function getEmotionConfig(emotion?: EmotionType | null): EmotionMeta {
    if (!emotion || !EMOTION_CONFIG[emotion]) {
        return {
            label: 'Netral',
            emoji: '😐',
            color: 'text-slate-700',
            bgLight: 'bg-slate-50',
            border: 'border-slate-200',
            activeClass: 'bg-slate-700 text-white border-slate-700 shadow-md shadow-slate-300'
        };
    }
    return EMOTION_CONFIG[emotion];
}
