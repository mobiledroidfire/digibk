// Lokasi file: src/features/student/services/vark-result.service.ts

import { createClient } from '@/lib/supabase/server';
import { getVarkResultData } from '@/features/assessments/services/result.service';
import { varkDictionary, type LevelData, type PhaseData } from '@/lib/data/vark';
import type { VarkDisplayData, ScoreItem, VarkDictItem } from '../types/result.types';
import { cleanCode } from './riasec-result.service';

export async function getVarkDisplayLogic(resultId?: string): Promise<VarkDisplayData | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('UNAUTHORIZED');

    const { data: student } = await supabase
        .from('students')
        .select(`id, full_name, education_level, grade_level, schools (name)`)
        .eq('user_id', user.id)
        .single();

    if (!student) throw new Error('STUDENT_NOT_FOUND');

    const schoolName = student.schools && typeof student.schools === 'object' && 'name' in student.schools
        ? String(student.schools.name) : 'Sekolah Anda';

    const eduLvl = student.education_level || 'SMP';
    let grade = student.grade_level;

    if (!grade) {
        if (eduLvl === 'SD' || eduLvl === 'MI') grade = 6;
        else if (eduLvl === 'SMA' || eduLvl === 'MA' || eduLvl === 'SMK') grade = 12;
        else grade = 7;
    }

    // --- LOGIKA FASE ---
    let phaseKey: keyof LevelData = 'SMP_Awal';
    let bannerTitle = 'Fase Penjelajahan Minat';
    let bannerMessage = 'Eksplorasi minat dan bakat siswa.';
    let isTransisi = false;

    if (eduLvl === 'SD' || eduLvl === 'MI') {
        if (grade <= 3) { phaseKey = 'SD_Awal'; bannerMessage = "Fase Bermain & Karakter Dasar: Dukung anak bereksplorasi dengan menyenangkan!"; }
        else if (grade <= 5) { phaseKey = 'SD_Akhir'; bannerMessage = "Fase Eksplorasi Minat: Kenalkan anak pada berbagai ekstrakurikuler dasar."; }
        else { phaseKey = 'SD_Transisi'; bannerTitle = "Fase Transisi Pendidikan"; bannerMessage = "Persiapan Lulus SD/MI: Fokus persiapkan mental dan pemilihan SMP/MTs yang mendukung minatnya."; isTransisi = true; }
    } else if (eduLvl === 'SMP' || eduLvl === 'MTs') {
        if (grade <= 8) { phaseKey = 'SMP_Awal'; bannerMessage = "Fase Pencarian Jati Diri: Eksplorasi ekstrakurikuler dan organisasi."; }
        else { phaseKey = 'SMP_Transisi'; bannerTitle = "Fase Transisi Pendidikan"; bannerMessage = "Penentuan Jalur Lanjutan: Mantapkan arah penjurusan ke SMA, MA, atau SMK!"; isTransisi = true; }
    } else if (eduLvl === 'SMA' || eduLvl === 'MA') {
        if (grade <= 11) { phaseKey = 'SMA_Awal'; bannerMessage = "Fase Peminatan: Perdalam portofolio akademik dan organisasi."; }
        else { phaseKey = 'SMA_Transisi'; bannerTitle = "Fase Transisi Pendidikan"; bannerMessage = "Fokus UTBK & Kuliah: Panduan utama menentukan prodi PTN impian!"; isTransisi = true; }
    } else if (eduLvl === 'SMK') {
        if (grade <= 11) { phaseKey = 'SMK_Awal'; bannerMessage = "Fase Vokasi: Fokus pengembangan skill praktis dan etika kerja."; }
        else { phaseKey = 'SMK_Transisi'; bannerTitle = "Fase Transisi Pendidikan"; bannerMessage = "Persiapan Karier: Perkuat kompetensi uji UKK dan persiapan wawancara kerja."; isTransisi = true; }
    }

    // --- LOGIKA DATA HASIL ---
    const resultData = await getVarkResultData(student.id, resultId);
    if (!resultData || !resultData.profile) return null;

    const profile = resultData.profile as {
        vark_results?: ScoreItem[];
    };

    const rawResults: ScoreItem[] = profile.vark_results || [];

    const sortedScores = [...rawResults].sort((a, b) => Number(b.raw_score) - Number(a.raw_score));
    const maxScore = Math.max(...sortedScores.map(s => Number(s.raw_score)), 1);

    const dominantItems = sortedScores.filter(s => Number(s.raw_score) === maxScore);
    const isMultimodal = dominantItems.length > 1;
    const domCodesArray = dominantItems.map(s => cleanCode(s.code));

    const primaryCode = domCodesArray[0] || 'V';

    const dominantData = (varkDictionary[primaryCode] || varkDictionary['V']) as VarkDictItem;
    const phaseData: PhaseData = dominantData.levels[phaseKey] || dominantData.levels['SMP_Transisi'];

    return {
        student: { id: student.id, full_name: student.full_name, education_level: eduLvl, grade_level: grade, schoolName },
        phaseInfo: { bannerTitle, bannerMessage, isTransisi },
        uiData: { sortedScores, maxScore, isMultimodal, domCodesArray, primaryCode, dominantData, phaseData }
    };
}