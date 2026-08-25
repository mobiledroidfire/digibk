// Lokasi file: src/features/student/types/result.types.ts

import type { LevelData, PhaseData as RiasecPhase } from '@/lib/data/riasec';
import type { ProfileDetailVark, PhaseData as VarkPhase } from '@/lib/data/vark';

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
    raw_score: number | string; // Tetap mempertahankan number | string milikmu
    normalized_score?: number;  // Tambahan dari kodeku untuk database
    rank?: number;              // Tambahan dari kodeku untuk database
}

// ============================================================================
// 2. TIPE RIASEC (DIPERTAHANKAN 100% DARI KODE ASLIMU)
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
// 3. TIPE VARK (GABUNGAN KODE KITA)
// ============================================================================

// Menggunakan alias dari kamus VARK langsung agar 100% sinkron dengan data asli
export type VarkDictItem = ProfileDetailVark;

// Model representasi tabel profil VARK di Supabase
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
    student: StudentInfo; // Menggunakan StudentInfo milikmu agar rapi
    phaseInfo: {
        isTransisi: boolean;
        bannerTitle: string;
        bannerMessage: string;
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