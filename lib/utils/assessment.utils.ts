// Lokasi file: src/lib/utils/assessment.utils.ts

import type { LevelData } from '@/lib/data/riasec';

export type EducationPhaseKey = keyof LevelData;

export interface PhaseResolution {
    phaseKey: EducationPhaseKey;
    bannerTitle: string;
    bannerMessage: string | null;
    isTransisi: boolean;
    tabEducationTitle: string;
}

/**
 * Membersihkan kode dari spasi dan memastikan huruf kapital (cth: " r " -> "R").
 */
export function cleanCode(code?: string | null): string {
    return code ? code.trim().toUpperCase() : '';
}

/**
 * Menggabungkan array teks dan menghilangkan duplikasi sambil membatasi jumlah maksimum elemen.
 */
export function blendArrays(
    arr1: string[] = [],
    arr2: string[] = [],
    arr3: string[] = [],
    maxItems: number = 10
): string[] {
    const combined = [...arr1, ...arr2, ...arr3];
    return [...new Set(combined)].slice(0, maxItems);
}

/**
 * Normalisasi jenjang pendidikan dan kelas siswa ke fase rekomendasi asesmen (SSOT).
 * Mendukung SD, MI, SMP, MTs, SMA, MA, SMK secara konsisten di seluruh modul (RIASEC & VARK).
 */
export function resolveEducationPhase(
    educationLevel?: string | null,
    gradeLevel?: number | null
): PhaseResolution {
    const eduLvl = (educationLevel || 'SMP').trim().toUpperCase();
    let grade = gradeLevel;

    // Fallback jika grade_level kosong di database
    if (!grade) {
        if (eduLvl === 'SD' || eduLvl === 'MI') grade = 6;
        else if (eduLvl === 'SMA' || eduLvl === 'MA' || eduLvl === 'SMK') grade = 12;
        else grade = 7;
    }

    let phaseKey: EducationPhaseKey = 'SMP_Awal';
    let bannerTitle = 'Fase Penjelajahan Minat';
    let bannerMessage: string | null = null;
    let isTransisi = false;

    if (eduLvl === 'SD' || eduLvl === 'MI') {
        if (grade <= 3) {
            phaseKey = eduLvl === 'SD' ? 'SD_Awal' : 'MI_Awal';
            bannerMessage = 'Fase Bermain & Karakter Dasar: Dukung anak bereksplorasi dengan menyenangkan!';
        } else if (grade <= 5) {
            phaseKey = eduLvl === 'SD' ? 'SD_Akhir' : 'MI_Akhir';
            bannerMessage = 'Fase Eksplorasi Minat: Kenalkan anak pada berbagai ekstrakurikuler dasar.';
        } else {
            phaseKey = eduLvl === 'SD' ? 'SD_Transisi' : 'MI_Transisi';
            isTransisi = true;
            bannerTitle = 'Fase Transisi Pendidikan';
            bannerMessage = `Persiapan Lulus ${eduLvl}: Fokus persiapkan mental dan pemilihan SMP/MTs yang mendukung minatnya.`;
        }
    } else if (eduLvl === 'SMP' || eduLvl === 'MTs') {
        if (grade <= 8) {
            phaseKey = eduLvl === 'SMP' ? 'SMP_Awal' : 'MTs_Awal';
            bannerMessage = 'Fase Pencarian Jati Diri: Eksplorasi ekstrakurikuler dan organisasi.';
        } else {
            phaseKey = eduLvl === 'SMP' ? 'SMP_Transisi' : 'MTs_Transisi';
            isTransisi = true;
            bannerTitle = 'Fase Transisi Pendidikan';
            bannerMessage = 'Penentuan Jalur Lanjutan: Mantapkan arah penjurusan ke SMA, MA, atau SMK!';
        }
    } else if (eduLvl === 'SMA' || eduLvl === 'MA') {
        if (grade <= 11) {
            phaseKey = eduLvl === 'SMA' ? 'SMA_Awal' : 'MA_Awal';
            bannerMessage = 'Fase Peminatan: Perdalam portofolio akademik dan organisasi.';
        } else {
            phaseKey = eduLvl === 'SMA' ? 'SMA_Transisi' : 'MA_Transisi';
            isTransisi = true;
            bannerTitle = 'Fase Transisi Pendidikan';
            bannerMessage = 'Fokus UTBK & Kuliah: Panduan utama menentukan prodi PTN impian!';
        }
    } else if (eduLvl === 'SMK') {
        if (grade <= 11) {
            phaseKey = 'SMK_Awal';
            bannerMessage = 'Fase Vokasi: Fokus pengembangan skill praktis dan etika kerja.';
        } else {
            phaseKey = 'SMK_Transisi';
            isTransisi = true;
            bannerTitle = 'Fase Transisi Pendidikan';
            bannerMessage = 'Persiapan Karier: Perkuat kompetensi uji UKK dan persiapan wawancara kerja.';
        }
    }

    let tabEducationTitle = 'Pengembangan Diri & Studi';
    if (eduLvl === 'SD' || eduLvl === 'MI') tabEducationTitle = 'Aktivitas & Ekstrakurikuler';
    else if (eduLvl === 'SMK') tabEducationTitle = 'Fokus Vokasional';

    return {
        phaseKey,
        bannerTitle,
        bannerMessage,
        isTransisi,
        tabEducationTitle
    };
}
