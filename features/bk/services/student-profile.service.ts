// Lokasi file: src/features/bk/services/student-profile.service.ts

import { RIASEC_DESC } from '@/lib/constants/riasec.constants';
import { VARK_DESC, VARK_MULTIMODAL_DESC, VARK_COLORS } from '@/lib/constants/vark.constants';
import type { ChartScoreItem, VarkChartScoreItem } from '@/features/student/types/result.types';

export type ScoreResult = { code: string; raw_score: number };
export type BaseProfile = { code: string };

export type RiasecProfileRaw = BaseProfile & {
    primary_code?: string;
    secondary_code?: string;
    tertiary_code?: string;
    riasec_results?: ScoreResult[];
};

export type VarkProfileRaw = BaseProfile & {
    dominant_code?: string;
    vark_results?: ScoreResult[];
};

export interface AssembledRiasecResult {
    code: string;
    name: string;
    interpretation: string;
    scores: ChartScoreItem[];
}

export interface AssembledVarkResult {
    code: string;
    name: string;
    dominant: string;
    interpretation: string;
    scores: VarkChartScoreItem[];
}

/**
 * Service: Merakit hasil asesmen RIASEC mentah dari database menjadi format tampilan profil siswa.
 */
export function assembleRiasecProfile(riasecData?: RiasecProfileRaw | null): AssembledRiasecResult | null {
    if (!riasecData || !riasecData.code) return null;

    const c1 = riasecData.primary_code || riasecData.code[0] || 'C';
    const c2 = riasecData.secondary_code || riasecData.code[1] || 'S';
    const c3 = riasecData.tertiary_code || riasecData.code[2] || 'I';

    const d1 = RIASEC_DESC[c1] || RIASEC_DESC['C'];
    const d2 = RIASEC_DESC[c2] || RIASEC_DESC['C'];
    const d3 = RIASEC_DESC[c3] || RIASEC_DESC['C'];

    const scores: ChartScoreItem[] = (riasecData.riasec_results || []).map(r => ({
        name: RIASEC_DESC[r.code]?.title || r.code,
        score: Number(r.raw_score) || 0
    }));

    return {
        code: riasecData.code,
        name: `${d1.id}, ${d2.id}, & ${d3.id}`,
        interpretation: `Tipe dominan kamu membentuk pola gabungan ${c1}-${c2}-${c3}, yang mewakili ${d1.title} (${d1.id}), ${d2.title} (${d2.id}), dan ${d3.title} (${d3.id}).\n\n• ${d1.title}: ${d1.desc}\n• ${d2.title}: ${d2.desc}\n• ${d3.title}: ${d3.desc}`,
        scores
    };
}

/**
 * Service: Merakit hasil asesmen VARK mentah dari database menjadi format tampilan profil siswa.
 */
export function assembleVarkProfile(varkData?: VarkProfileRaw | null): AssembledVarkResult | null {
    if (!varkData || !varkData.code) return null;

    const isMultimodal = varkData.code.length > 1;

    const varkParts = varkData.code.split('').map(char => VARK_DESC[char]?.id || char);
    let varkName = varkParts.join(', ');
    if (varkParts.length > 1) {
        const last = varkParts.pop();
        varkName = `${varkParts.join(', ')} & ${last}`;
    }

    const varkScores: VarkChartScoreItem[] = (varkData.vark_results || []).map(r => ({
        name: VARK_DESC[r.code]?.id || r.code,
        score: Number(r.raw_score) || 0,
        fill: VARK_COLORS[r.code] || '#cbd5e1'
    }));

    const dominantCode = varkData.dominant_code || varkData.code[0] || 'V';

    return {
        code: varkData.code,
        name: varkName,
        dominant: isMultimodal ? 'Gaya Belajar Fleksibel (Multimodal)' : (VARK_DESC[dominantCode]?.id || 'Tunggal'),
        interpretation: isMultimodal ? VARK_MULTIMODAL_DESC : (VARK_DESC[dominantCode]?.desc || 'Data gaya belajar ditemukan.'),
        scores: varkScores
    };
}
