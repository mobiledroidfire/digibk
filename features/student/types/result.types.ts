// Lokasi file: src/features/student/types/result.types.ts

import type { LevelData, PhaseData as RiasecPhase } from '@/lib/data/riasec';
import type { ProfileDetailVark, PhaseData as VarkPhase } from '@/lib/data/vark';
export type { RiskLevel } from '@/lib/rules/emotion.rules';

// ============================================================================
// 1. TIPE REUSABLE (DIGUNAKAN BERSAMA OLEH RIASEC DAN VARK)
// ============================================================================
export interface StudentInfo {
    id: string;
    full_name: string;
    education_level: string;
    grade_level: number;
    schoolName: string;
}

export interface ScoreItem {
    code: string;
    raw_score: number | string;
    normalized_score?: number | null;
    rank?: number | null;
}

export interface ChartScoreItem {
    name: string;
    score: number;
}

export interface VarkChartScoreItem extends ChartScoreItem {
    fill: string;
}

// ============================================================================
// 2. TIPE RIASEC
// ============================================================================
export interface RiasecDictItem {
    title: string;
    indonesianTitle: string;
    desc: string;
    levels: Record<string, RiasecPhase>;
    karir: string[];
    freelance: string[];
}

export interface RiasecDisplayData {
    student: StudentInfo;
    phaseInfo: {
        phaseKey: keyof LevelData;
        bannerTitle: string;
        bannerMessage: string | null;
        isTransisi: boolean;
    };
    profileData: {
        code1: string;
        code2: string;
        code3: string;
        hyphenatedCodes: string;
        dynamicConclusion: string;
        dominantTieMessage: string;
        sortedScores: ScoreItem[];
        data1: RiasecDictItem;
        data2: RiasecDictItem;
        data3: RiasecDictItem;
    };
    mixedData: {
        mixedEdu1: string[];
        mixedEdu2: string[];
        mixedMateri: string[];
        mixedLayanan: string[];
        mixedGuruBk: string[];
        mixedSiswa: string[];
        mixedKarir: string[];
        mixedFreelance: string[];
        phase1: RiasecPhase;
    };
    tabEducationTitle: string;
}

// ============================================================================
// 3. TIPE VARK
// ============================================================================
export type VarkDictItem = ProfileDetailVark;

export interface VarkProfileModel {
    id: string;
    result_id: string;
    code: string;
    dominant_code: string;
    secondary_code?: string;
    tertiary_code?: string;
    quaternary_code?: string;
    interpretation?: string;
    vark_results: ScoreItem[];
}

export interface VarkDisplayData {
    student: StudentInfo;
    phaseInfo: {
        isTransisi: boolean;
        bannerTitle: string;
        bannerMessage: string | null;
    };
    uiData: {
        sortedScores: ScoreItem[];
        maxScore: number;
        isMultimodal: boolean;
        domCodesArray: string[];
        primaryCode: string;
        dominantData: VarkDictItem;
        phaseData: VarkPhase;
    };
}