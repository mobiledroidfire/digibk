// Lokasi file: src/features/student/types/result.types.ts

import type { LevelData, PhaseData as RiasecPhase } from '@/lib/data/riasec';
import type { PhaseData as VarkPhase } from '@/lib/data/vark';

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
}

export interface RiasecDictItem {
    title: string;
    indonesianTitle: string;
    desc: string;
    levels: Record<string, RiasecPhase>;
    karir: string[];
    freelance: string[];
}

export interface VarkDictItem {
    desc: string;
    levels: Record<string, VarkPhase>;
    karir: string[];
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

export interface VarkDisplayData {
    student: StudentInfo;
    phaseInfo: {
        isTransisi: boolean; // <-- PERBAIKAN: Mengubah 'any' menjadi 'boolean'
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