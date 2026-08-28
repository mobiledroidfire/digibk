// Lokasi file: src/features/student/services/vark-result.service.ts

import { createClient } from '@/lib/supabase/server';
import { getVarkResultData } from '@/features/assessments/services/result.service';
import { varkDictionary, type PhaseData } from '@/lib/data/vark';
import { resolveEducationPhase, cleanCode } from '@/lib/utils/assessment.utils';
import type { VarkDisplayData, ScoreItem, VarkDictItem } from '../types/result.types';

export { cleanCode };

export async function getVarkDisplayLogic(resultId?: string): Promise<VarkDisplayData | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('UNAUTHORIZED');

    // Mengambil data siswa dan sekolah (SSOT)
    const { data: student } = await supabase
        .from('students')
        .select(`id, full_name, education_level, grade_level, schools (name)`)
        .eq('user_id', user.id)
        .single();

    if (!student) throw new Error('STUDENT_NOT_FOUND');

    const schoolName = student.schools && typeof student.schools === 'object' && 'name' in student.schools
        ? String(student.schools.name) : 'Sekolah Anda';

    const eduLvl = student.education_level || 'SMP';
    const grade = student.grade_level;

    // --- LOGIKA FASE PENDIDIKAN (SSOT) ---
    const { phaseKey, bannerTitle, bannerMessage, isTransisi } = resolveEducationPhase(eduLvl, grade);

    // --- LOGIKA DATA HASIL (DATABASE KE UI) ---
    const resultData = await getVarkResultData(student.id, resultId);
    if (!resultData || !resultData.profile) return null;

    // Melekatkan tipe ke data kembalian dari database
    const profile = resultData.profile as { vark_results?: ScoreItem[] };
    const rawResults: ScoreItem[] = profile.vark_results || [];

    // Mengurutkan skor dari yang tertinggi ke terendah
    const sortedScores = [...rawResults].sort((a, b) => Number(b.raw_score) - Number(a.raw_score));
    const maxScore = sortedScores.length > 0 ? Number(sortedScores[0].raw_score) : 1;

    // Mendapatkan item yang memilik skor tertinggi (Mengecek Multimodal)
    const dominantItems = sortedScores.filter(s => Number(s.raw_score) === maxScore);
    const isMultimodal = dominantItems.length > 1;
    const domCodesArray = dominantItems.map(s => cleanCode(s.code));

    // Menentukan primaryCode (Ambil yang pertama dari hasil sorting)
    const primaryCode = domCodesArray[0] || 'V';

    // Mencocokkan dengan kamus vark.ts
    const dominantData = (varkDictionary[primaryCode] || varkDictionary['V']) as VarkDictItem;
    const phaseData: PhaseData = dominantData.levels[phaseKey] || dominantData.levels['SMP_Transisi'];

    // Mengembalikan objek rapi siap pakai untuk Komponen UI (Frontend)
    return {
        student: { id: student.id, full_name: student.full_name, education_level: eduLvl, grade_level: grade || 7, schoolName },
        phaseInfo: { bannerTitle, bannerMessage: bannerMessage || 'Eksplorasi gaya belajar siswa.', isTransisi },
        uiData: { sortedScores, maxScore, isMultimodal, domCodesArray, primaryCode, dominantData, phaseData }
    };
}