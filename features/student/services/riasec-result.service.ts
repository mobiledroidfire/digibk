// Lokasi file: src/features/student/services/riasec-result.service.ts

import { createClient } from '@/lib/supabase/server';
import { getRiasecResultData } from '@/features/assessments/services/result.service';
import { riasecDictionary, type LevelData, type PhaseData } from '@/lib/data/riasec';
import type { RiasecDisplayData, ScoreItem, RiasecDictItem } from '../types/result.types';

export const riasecTranslations: Record<string, string> = {
    'Realistic': 'Realistis', 'Investigative': 'Investigatif', 'Artistic': 'Artistik',
    'Social': 'Sosial', 'Enterprising': 'Wirausaha', 'Conventional': 'Konvensional'
};

export function cleanCode(code?: string): string {
    return code ? code.trim().toUpperCase() : '';
}

function blendArrays(arr1: string[] = [], arr2: string[] = [], arr3: string[] = [], maxItems: number, isPdf: boolean = false): string[] {
    let combined: string[];
    if (isPdf) {
        combined = [...arr1.slice(0, 4), ...arr2.slice(0, 2), ...arr3.slice(0, 1)];
    } else {
        combined = [...arr1, ...arr2.slice(0, Math.max(1, Math.floor(arr2.length / 2))), ...arr3.slice(0, 1)];
    }
    return [...new Set(combined)].slice(0, maxItems);
}

export async function getRiasecDisplayLogic(resultId?: string, isPdf: boolean = false): Promise<RiasecDisplayData | null> {
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
    let bannerMessage: string | null = null;
    let isTransisi = false;

    if (eduLvl === 'SD' || eduLvl === 'MI') {
        if (grade <= 3) { phaseKey = eduLvl === 'SD' ? 'SD_Awal' : 'MI_Awal'; bannerMessage = "Fase Bermain & Karakter Dasar: Dukung anak bereksplorasi dengan menyenangkan!"; }
        else if (grade <= 5) { phaseKey = eduLvl === 'SD' ? 'SD_Akhir' : 'MI_Akhir'; bannerMessage = "Fase Eksplorasi Minat: Kenalkan anak pada berbagai ekstrakurikuler dasar."; }
        else { phaseKey = eduLvl === 'SD' ? 'SD_Transisi' : 'MI_Transisi'; isTransisi = true; bannerTitle = "Fase Transisi Pendidikan"; bannerMessage = `Persiapan Lulus ${eduLvl}: Fokus persiapkan mental dan pemilihan SMP/MTs yang mendukung minatnya.`; }
    } else if (eduLvl === 'SMP' || eduLvl === 'MTs') {
        if (grade <= 8) { phaseKey = eduLvl === 'SMP' ? 'SMP_Awal' : 'MTs_Awal'; bannerMessage = "Fase Pencarian Jati Diri: Eksplorasi ekstrakurikuler dan organisasi."; }
        else { phaseKey = eduLvl === 'SMP' ? 'SMP_Transisi' : 'MTs_Transisi'; isTransisi = true; bannerTitle = "Fase Transisi Pendidikan"; bannerMessage = "Penentuan Jalur Lanjutan: Mantapkan arah penjurusan ke SMA, MA, atau SMK!"; }
    } else if (eduLvl === 'SMA' || eduLvl === 'MA') {
        if (grade <= 11) { phaseKey = eduLvl === 'SMA' ? 'SMA_Awal' : 'MA_Awal'; bannerMessage = "Fase Peminatan: Perdalam portofolio akademik dan organisasi."; }
        else { phaseKey = eduLvl === 'SMA' ? 'SMA_Transisi' : 'MA_Transisi'; isTransisi = true; bannerTitle = "Fase Transisi Pendidikan"; bannerMessage = "Fokus UTBK & Kuliah: Panduan utama menentukan prodi PTN impian!"; }
    } else if (eduLvl === 'SMK') {
        if (grade <= 11) { phaseKey = 'SMK_Awal'; bannerMessage = "Fase Vokasi: Fokus pengembangan skill praktis dan etika kerja."; }
        else { phaseKey = 'SMK_Transisi'; isTransisi = true; bannerTitle = "Fase Transisi Pendidikan"; bannerMessage = "Persiapan Karier: Perkuat kompetensi uji UKK dan persiapan wawancara kerja."; }
    }

    // --- LOGIKA DATA HASIL ---
    const resultData = await getRiasecResultData(student.id, resultId);
    if (!resultData || !resultData.profile) return null;

    // Type Assertion: Memberi tahu TypeScript bentuk asli dari profile Supabase
    const profile = resultData.profile as {
        primary_code?: string;
        secondary_code?: string;
        tertiary_code?: string;
        riasec_results?: ScoreItem[];
    };

    const rawResults: ScoreItem[] = profile.riasec_results || [];
    // Parameter 'a' dan 'b' kini otomatis dikenali sebagai ScoreItem
    const sortedScores = [...rawResults].sort((a, b) => Number(b.raw_score) - Number(a.raw_score));

    const code1 = cleanCode(profile.primary_code) || 'C';
    const code2 = cleanCode(profile.secondary_code) || 'S';
    const code3 = cleanCode(profile.tertiary_code) || 'I';
    const hyphenatedCodes = `${code1}-${code2}-${code3}`;

    // Casting ke RiasecDictItem agar tidak terjadi error saat memanggil .levels
    const data1 = (riasecDictionary[code1] || riasecDictionary['C']) as RiasecDictItem;
    const data2 = (riasecDictionary[code2] || riasecDictionary['S']) as RiasecDictItem;
    const data3 = (riasecDictionary[code3] || riasecDictionary['I']) as RiasecDictItem;

    const dynamicConclusion = `Tipe dominan kamu adalah ${data1.title} (${data1.indonesianTitle}) dan ${data2.title} (${data2.indonesianTitle}) dengan pola gabungan ${hyphenatedCodes}.\n\n• ${data1.title}: ${data1.desc}\n• ${data2.title}: ${data2.desc}`;
    const dominantTieMessage = `Hebat! Kamu memiliki kecerdasan minat yang seimbang pada beberapa bidang sekaligus. Perpaduan ini membuatmu lebih mudah beradaptasi di berbagai lingkungan!`;

    // Hilangkan pemaksaan "as any", sekarang ini 100% Type-Safe
    const phase1: PhaseData = data1.levels[phaseKey] || data1.levels['SMP_Transisi'];
    const phase2: PhaseData = data2.levels[phaseKey] || data2.levels['SMP_Transisi'];
    const phase3: PhaseData = data3.levels[phaseKey] || data3.levels['SMP_Transisi'];

    const mixedEdu1 = blendArrays(phase1.eduList1, phase2.eduList1, phase3.eduList1, isPdf ? 6 : 5, isPdf);
    const mixedEdu2 = blendArrays(phase1.eduList2, phase2.eduList2, phase3.eduList2, isPdf ? 6 : 5, isPdf);
    const mixedMateri = blendArrays(phase1.materi, phase2.materi, phase3.materi, 6, isPdf);
    const mixedLayanan = blendArrays(phase1.layanan, phase2.layanan, phase3.layanan, 5, isPdf);
    const mixedGuruBk = blendArrays(phase1.guruBk, phase2.guruBk, phase3.guruBk, 4, isPdf);
    const mixedSiswa = blendArrays(phase1.siswa, phase2.siswa, phase3.siswa, 4, isPdf);
    const mixedKarir = blendArrays(data1.karir, data2.karir, data3.karir, 7, isPdf);
    const mixedFreelance = blendArrays(data1.freelance, data2.freelance, data3.freelance, 5, isPdf);

    let tabEducationTitle = "Pengembangan Diri & Studi";
    if (eduLvl === 'SD' || eduLvl === 'MI') tabEducationTitle = "Aktivitas & Ekstrakurikuler";
    if (eduLvl === 'SMK') tabEducationTitle = "Fokus Vokasional";

    return {
        student: { id: student.id, full_name: student.full_name, education_level: eduLvl, grade_level: grade, schoolName },
        phaseInfo: { phaseKey, bannerTitle, bannerMessage, isTransisi },
        profileData: { code1, code2, code3, hyphenatedCodes, dynamicConclusion, dominantTieMessage, sortedScores, data1, data2, data3 },
        mixedData: { mixedEdu1, mixedEdu2, mixedMateri, mixedLayanan, mixedGuruBk, mixedSiswa, mixedKarir, mixedFreelance, phase1 },
        tabEducationTitle
    };
}