// Lokasi file: src/app/student/potential/result/page.tsx

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
    Trophy, ArrowRight, Activity,
    School, Briefcase, BookOpen,
    UserCheck, HeartHandshake, Sparkles, Target
} from 'lucide-react';

import {
    dimensionDefs,
    riasecDictionary,
    type AssessmentResult,
    type RiasecProfile,
    type LevelData,
    type PhaseData
} from '@/lib/data/riasec';

function blendArrays(arr1: string[] = [], arr2: string[] = [], arr3: string[] = [], maxItems: number): string[] {
    const combined = [...arr1, ...arr2.slice(0, Math.max(1, Math.floor(arr2.length / 2))), ...arr3.slice(0, 1)];
    return [...new Set(combined)].slice(0, maxItems);
}

function cleanCode(code?: string): string {
    return code ? code.trim().toUpperCase() : '';
}

export default async function ResultPage({ searchParams }: { searchParams: Promise<{ id?: string }>; }) {
    const resolvedParams = await searchParams;
    let resultId = resolvedParams.id;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: student, error: studentError } = await supabase
        .from('students')
        .select(`id, full_name, education_level, grade_level, schools (name)`)
        .eq('user_id', user.id)
        .single();

    if (studentError || !student) {
        redirect('/student/dashboard?error=Akses_Ditolak_Gagal_Ambil_Data');
    }

    const schoolName = student.schools && typeof student.schools === 'object' && 'name' in student.schools
        ? String(student.schools.name) : 'Sekolah Anda';

    const eduLvl = student.education_level || 'SMP';
    const grade = student.grade_level || 7;

    let phaseKey: keyof LevelData = 'SMP_Awal';
    let bannerMessage = null;
    let isTransisi = false;

    if (eduLvl === 'SD') {
        if (grade <= 3) { phaseKey = 'SD_Awal'; bannerMessage = "Fase Bermain & Karakter Dasar: Dukung anak bereksplorasi dengan menyenangkan!"; }
        else if (grade <= 5) { phaseKey = 'SD_Akhir'; bannerMessage = "Fase Eksplorasi Minat: Kenalkan anak pada berbagai ekstrakurikuler dasar."; }
        else { phaseKey = 'SD_Transisi'; isTransisi = true; bannerMessage = "Persiapan Lulus SD: Fokus persiapkan mental dan pemilihan SMP yang mendukung minatnya."; }
    } else if (eduLvl === 'MI') {
        if (grade <= 3) { phaseKey = 'MI_Awal'; bannerMessage = "Fase Bermain Islami & Karakter: Dukung anak bereksplorasi dengan nilai-nilai madrasah."; }
        else if (grade <= 5) { phaseKey = 'MI_Akhir'; bannerMessage = "Fase Eksplorasi Minat Madrasah: Kenalkan anak pada berbagai ekstrakurikuler Islami dasar."; }
        else { phaseKey = 'MI_Transisi'; isTransisi = true; bannerMessage = "Persiapan Lulus MI: Fokus persiapkan mental dan pemilihan MTs/SMP yang mendukung."; }
    } else if (eduLvl === 'SMP') {
        if (grade <= 8) { phaseKey = 'SMP_Awal'; bannerMessage = "Fase Pencarian Jati Diri: Eksplorasi ekstrakurikuler dan organisasi untuk membangun karakter."; }
        else { phaseKey = 'SMP_Transisi'; isTransisi = true; bannerMessage = "Penentuan Jalur Menengah Atas: Gunakan data ini untuk mantap memilih SMA atau SMK yang tepat!"; }
    } else if (eduLvl === 'MTs') {
        if (grade <= 8) { phaseKey = 'MTs_Awal'; bannerMessage = "Fase Pencarian Jati Diri Madrasah: Aktif di organisasi dan ekstrakurikuler untuk membentuk karakter."; }
        else { phaseKey = 'MTs_Transisi'; isTransisi = true; bannerMessage = "Penentuan Jalur Lanjutan: Mantapkan pilihan ke MA, SMA, atau SMK sesuai minat bakatmu!"; }
    } else if (eduLvl === 'SMA') {
        if (grade <= 11) { phaseKey = 'SMA_Awal'; bannerMessage = "Fase Peminatan (E & F): Perdalam portofolio akademik dan keikutsertaan organisasi sekolah."; }
        else { phaseKey = 'SMA_Transisi'; isTransisi = true; bannerMessage = "Fokus UTBK & Kuliah: Panduan utama menentukan prodi PTN dan strategi masuk kampus impian!"; }
    } else if (eduLvl === 'MA') {
        if (grade <= 11) { phaseKey = 'MA_Awal'; bannerMessage = "Fase Peminatan MA (E & F): Perdalam portofolio akademik madrasah dan keikutsertaan organisasi."; }
        else { phaseKey = 'MA_Transisi'; isTransisi = true; bannerMessage = "Fokus UTBK, SPAN-PTKIN & Kuliah: Strategi menembus kampus impianmu!"; }
    } else if (eduLvl === 'SMK') {
        if (grade <= 11) { phaseKey = 'SMK_Awal'; bannerMessage = "Fase Vokasi & PKL: Fokus pada pengembangan skill praktis dan etika kerja industri."; }
        else { phaseKey = 'SMK_Transisi'; isTransisi = true; bannerMessage = "Persiapan Karier Lulusan: Perkuat sertifikasi, uji kompetensi (UKK), dan kesiapan wawancara kerja!"; }
    }

    if (!resultId) {
        const { data: latestResult } = await supabase.from('assessment_results')
            .select('id').eq('student_id', student.id).order('calculated_at', { ascending: false }).limit(1).single();
        if (latestResult) resultId = latestResult.id;
        else redirect('/student/dashboard?error=Hasil_Tidak_Ditemukan');
    }

    // Memanggil primary, secondary, tertiary code langsung dari tabel riasec_profiles
    const { data: resultData, error: resultError } = await supabase.from('assessment_results')
        .select(`
            id, 
            riasec_profiles ( 
                code, primary_code, secondary_code, tertiary_code, 
                riasec_results ( code, raw_score ) 
            )
        `)
        .eq('id', resultId).eq('student_id', student.id).single();

    if (resultError || !resultData) {
        redirect('/student/dashboard?error=Data_Gagal_Dimuat');
    }

    const typedResult = resultData as unknown as AssessmentResult;

    // PERBAIKAN TypeScript: Membuat tipe gabungan (Intersection Type) 
    // agar TypeScript mengenali properti baru tanpa harus merombak file definisi aslinya.
    type ExtendedRiasecProfile = RiasecProfile & {
        primary_code?: string;
        secondary_code?: string;
        tertiary_code?: string;
    };

    const rawProfile = Array.isArray(typedResult.riasec_profiles) ? typedResult.riasec_profiles[0] : typedResult.riasec_profiles;
    const profile = rawProfile as ExtendedRiasecProfile | null;

    if (!profile) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">Profil Belum Ditemukan.</div>
        </div>
    );

    const rawResults = profile.riasec_results || [];
    // Sorting hanya untuk visual grafik batang
    const sortedScores = [...rawResults].sort((a, b) => Number(b.raw_score) - Number(a.raw_score));

    // MENGGUNAKAN SINGLE SOURCE OF TRUTH DARI DATABASE
    const code1 = cleanCode(profile.primary_code) || 'C';
    const code2 = cleanCode(profile.secondary_code) || 'S';
    const code3 = cleanCode(profile.tertiary_code) || 'I';
    const hyphenatedCodes = `${code1}-${code2}-${code3}`;

    const data1 = riasecDictionary[code1] || riasecDictionary['C'];
    const data2 = riasecDictionary[code2] || riasecDictionary['S'];
    const data3 = riasecDictionary[code3] || riasecDictionary['I'];

    // Pesan kesimpulan yang disederhanakan dan presisi
    const dynamicConclusion = `Tipe dominan kamu adalah ${data1.title} (${data1.indonesianTitle}) dan ${data2.title} (${data2.indonesianTitle}) dengan pola gabungan ${hyphenatedCodes}.\n\n• ${data1.title}: ${data1.desc}\n• ${data2.title}: ${data2.desc}`;
    const dominantTieMessage = `Hebat! Kamu memiliki kecerdasan minat yang seimbang pada beberapa bidang sekaligus. Perpaduan ini membuatmu lebih mudah beradaptasi di berbagai lingkungan!`;

    const phase1: PhaseData = data1.levels[phaseKey] || data1.levels['SMP_Awal'];
    const phase2: PhaseData = data2.levels[phaseKey] || data2.levels['SMP_Awal'];
    const phase3: PhaseData = data3.levels[phaseKey] || data3.levels['SMP_Awal'];

    const mixedEdu1 = blendArrays(phase1.eduList1, phase2.eduList1, phase3.eduList1, 5);
    const mixedEdu2 = blendArrays(phase1.eduList2, phase2.eduList2, phase3.eduList2, 5);
    const mixedMateri = blendArrays(phase1.materi, phase2.materi, phase3.materi, 6);
    const mixedLayanan = blendArrays(phase1.layanan, phase2.layanan, phase3.layanan, 5);
    const mixedGuruBk = blendArrays(phase1.guruBk, phase2.guruBk, phase3.guruBk, 4);
    const mixedSiswa = blendArrays(phase1.siswa, phase2.siswa, phase3.siswa, 4);

    const mixedKarir = blendArrays(data1.karir, data2.karir, data3.karir, 7);
    const mixedFreelance = blendArrays(data1.freelance, data2.freelance, data3.freelance, 5);

    let tabEducationTitle = "Pengembangan Diri & Studi";
    if (eduLvl === 'SD' || eduLvl === 'MI') tabEducationTitle = "Aktivitas & Ekstrakurikuler";
    if (eduLvl === 'SMK') tabEducationTitle = "Fokus Vokasional";

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pb-12 font-sans">
            <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                <h1 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <Trophy className="text-blue-600" size={16} /> Laporan Asesmen ({schoolName} - Kelas {grade})
                </h1>
                <Link href="/student/dashboard" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Tutup</Link>
            </header>

            <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
                {bannerMessage && (
                    <div className={`rounded-xl p-5 shadow-md flex items-center gap-4 text-white ${isTransisi ? 'bg-linear-to-r from-indigo-600 to-purple-600' : 'bg-linear-to-r from-blue-600 to-cyan-600'}`}>
                        <div className="bg-white/20 p-3 rounded-full shrink-0">
                            {isTransisi ? <Target className="h-6 w-6 text-white" /> : <Activity className="h-6 w-6 text-white" />}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">{isTransisi ? 'Fase Transisi Pendidikan' : 'Fase Penjelajahan Minat'}</h3>
                            <p className="text-sm text-white/90">{bannerMessage}</p>
                        </div>
                    </div>
                )}

                <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                        <div className="h-20 w-20 bg-blue-50 border border-blue-100 rounded-2xl flex flex-col items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-blue-400 mb-1">PROFIL</span>
                            <span className="text-2xl font-black text-blue-700 tracking-widest">{hyphenatedCodes.replace(/-/g, '')}</span>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-bold text-slate-900 mb-3">Ringkasan Kesimpulan</h2>
                            <p className="text-slate-700 text-sm leading-relaxed mb-4 whitespace-pre-line">{dynamicConclusion}</p>

                            <div className="mb-4 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 flex items-start gap-2">
                                <Sparkles className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" />
                                <p className="text-sm text-indigo-900 leading-relaxed font-medium">{dominantTieMessage}</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200">
                    <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-indigo-500" /> Detail Skor 6 Dimensi
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {sortedScores.map((score) => {
                            const percentage = Math.min((Number(score.raw_score) / 35) * 100, 100);
                            const safeCode = cleanCode(score.code);
                            const dimInfo = dimensionDefs[safeCode] || { name: safeCode, meaning: '' };
                            return (
                                <div key={safeCode} className="flex flex-col gap-2">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <span className="font-bold text-slate-800 text-sm">{dimInfo.name}</span>
                                            <p className="text-xs text-slate-500 mt-0.5">{dimInfo.meaning}</p>
                                        </div>
                                        <span className="text-sm font-bold text-indigo-600">{score.raw_score}</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full bg-indigo-500 transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
                            <School className="h-4 w-4 text-blue-500" /> {tabEducationTitle}
                        </h4>
                        <div className="mb-4">
                            <span className="text-xs font-semibold text-slate-400 uppercase">{phase1.eduTitle1}</span>
                            <ul className="mt-2 space-y-1">{mixedEdu1.map((item, i) => <li key={i} className="text-sm text-slate-700">• {item}</li>)}</ul>
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase">{phase1.eduTitle2}</span>
                            <ul className="mt-2 space-y-1">{mixedEdu2.map((item, i) => <li key={i} className="text-sm text-slate-700">• {item}</li>)}</ul>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2"><Briefcase className="h-4 w-4 text-emerald-500" /> Karier & Usaha</h4>
                        <div className="mb-4">
                            <span className="text-xs font-semibold text-slate-400 uppercase">Pekerjaan Masa Depan</span>
                            <ul className="mt-2 space-y-1">{mixedKarir.map((item, i) => <li key={i} className="text-sm text-slate-700">• {item}</li>)}</ul>
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase">Peluang Pengembangan Khusus</span>
                            <ul className="mt-2 space-y-1">{mixedFreelance.map((item, i) => <li key={i} className="text-sm text-slate-700">• {item}</li>)}</ul>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2"><BookOpen className="h-4 w-4 text-amber-500" /> Pembelajaran</h4>
                        <div className="mb-4">
                            <span className="text-xs font-semibold text-slate-400 uppercase">Fokus Materi ({eduLvl})</span>
                            <ul className="mt-2 space-y-1">{mixedMateri.map((item, i) => <li key={i} className="text-sm text-slate-700">• {item}</li>)}</ul>
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase">Layanan Pendukung</span>
                            <ul className="mt-2 space-y-1">{mixedLayanan.map((item, i) => <li key={i} className="text-sm text-slate-700">• {item}</li>)}</ul>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-700">
                        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-600 pb-2"><HeartHandshake className="h-4 w-4 text-slate-300" /> Saran untuk Guru / Orang Tua</h4>
                        <ul className="space-y-2">{mixedGuruBk.map((item, i) => <li key={i} className="text-sm text-slate-300 flex items-start gap-2"><ArrowRight className="h-4 w-4 shrink-0 mt-0.5 opacity-50" /> {item}</li>)}</ul>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-6 shadow-sm border border-blue-100">
                        <h4 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2 border-b border-blue-200 pb-2"><UserCheck className="h-4 w-4 text-blue-600" /> Saran untuk Kamu (Siswa)</h4>
                        <ul className="space-y-2">{mixedSiswa.map((item, i) => <li key={i} className="text-sm text-blue-800 flex items-start gap-2"><Sparkles className="h-4 w-4 shrink-0 mt-0.5 opacity-50 text-blue-500" /> {item}</li>)}</ul>
                    </div>
                </div>

                <div className="pt-6 pb-12 flex justify-end">
                    <Link href="/student/dashboard" className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
                        Selesai & Kembali <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </main>
        </div>
    );
}