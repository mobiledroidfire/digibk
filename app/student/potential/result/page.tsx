// Lokasi file: src/app/student/potential/result/page.tsx

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
    BrainCircuit, Trophy, ArrowRight, Activity,
    GraduationCap, School, Briefcase, BookOpen,
    UserCheck, HeartHandshake, Sparkles, Star, Target
} from 'lucide-react';

import {
    dimensionDefs,
    riasecDictionary,
    type AssessmentResult,
    type RiasecProfile,
    type LevelData, // Pastikan tipe ini di-import dari update terbaru kita
    type PhaseData
} from '@/lib/data/riasec';

function blendArrays(arr1: string[] = [], arr2: string[] = [], arr3: string[] = [], maxItems: number): string[] {
    const combined = [...arr1, ...arr2.slice(0, Math.max(1, Math.floor(arr2.length / 2))), ...arr3.slice(0, 1)];
    return [...new Set(combined)].slice(0, maxItems);
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
        console.error("🚨 ERROR AMBIL DATA SISWA:", studentError?.message);
        redirect('/student/dashboard?error=Akses_Ditolak_Gagal_Ambil_Data');
    }

    const schoolName = student.schools && typeof student.schools === 'object' && 'name' in student.schools
        ? String(student.schools.name) : 'Sekolah Anda';

    const eduLvl = student.education_level || 'SMP';
    const grade = student.grade_level || 7;

    // ========================================================================
    // 1. LOGIKA PENENTUAN FASE SANGAT DETAIL (SD, SMP, SMA, SMK)
    // ========================================================================
    let phaseKey: keyof LevelData = 'SMP_Awal'; // Default
    let bannerMessage = null;
    let isTransisi = false;

    if (eduLvl === 'SD') {
        if (grade <= 3) {
            phaseKey = 'SD_Awal';
            bannerMessage = "Fase Bermain & Karakter Dasar: Dukung anak bereksplorasi dengan menyenangkan!";
        } else if (grade <= 5) {
            phaseKey = 'SD_Akhir';
            bannerMessage = "Fase Eksplorasi Minat: Kenalkan anak pada berbagai ekstrakurikuler dasar.";
        } else {
            phaseKey = 'SD_Transisi';
            isTransisi = true;
            bannerMessage = "Persiapan Lulus SD: Fokus persiapkan mental dan pemilihan SMP yang mendukung minatnya.";
        }
    } else if (eduLvl === 'SMP') {
        if (grade <= 8) {
            phaseKey = 'SMP_Awal';
            bannerMessage = "Fase Pencarian Jati Diri: Eksplorasi ekstrakurikuler dan organisasi untuk membangun karakter.";
        } else {
            phaseKey = 'SMP_Transisi';
            isTransisi = true;
            bannerMessage = "Penentuan Jalur Menengah Atas: Gunakan data ini untuk mantap memilih SMA atau SMK yang tepat!";
        }
    } else if (eduLvl === 'SMA' || eduLvl === 'MA') {
        if (grade <= 11) {
            phaseKey = 'SMA_Awal';
            bannerMessage = "Fase Peminatan (E & F): Perdalam portofolio akademik dan keikutsertaan organisasi sekolah.";
        } else {
            phaseKey = 'SMA_Transisi';
            isTransisi = true;
            bannerMessage = "Fokus UTBK & Kuliah: Panduan utama menentukan prodi PTN dan strategi masuk kampus impian!";
        }
    } else if (eduLvl === 'SMK') {
        if (grade <= 11) {
            phaseKey = 'SMK_Awal';
            bannerMessage = "Fase Vokasi & PKL: Fokus pada pengembangan skill praktis dan etika kerja industri.";
        } else {
            phaseKey = 'SMK_Transisi';
            isTransisi = true;
            bannerMessage = "Persiapan Karier Lulusan: Perkuat sertifikasi, uji kompetensi (UKK), dan kesiapan wawancara kerja!";
        }
    }
    // ========================================================================

    if (!resultId) {
        const { data: latestResult } = await supabase.from('assessment_results')
            .select('id').eq('student_id', student.id).order('calculated_at', { ascending: false }).limit(1).single();
        if (latestResult) resultId = latestResult.id;
        else redirect('/student/dashboard?error=Hasil_Tidak_Ditemukan');
    }

    const { data: resultData, error: resultError } = await supabase.from('assessment_results')
        .select(`id, riasec_profiles ( code, riasec_results ( code, raw_score ) )`)
        .eq('id', resultId).eq('student_id', student.id).single();

    if (resultError || !resultData) {
        console.error("🚨 ERROR AMBIL HASIL ASESMEN:", resultError?.message);
        redirect('/student/dashboard?error=Data_Gagal_Dimuat');
    }

    const typedResult = resultData as unknown as AssessmentResult;
    const profile: RiasecProfile | null = Array.isArray(typedResult.riasec_profiles) ? typedResult.riasec_profiles[0] : typedResult.riasec_profiles;

    if (!profile) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">Profil Belum Ditemukan.</div>
        </div>
    );

    const rawResults = profile.riasec_results || [];
    const sortedScores = [...rawResults].sort((a, b) => b.raw_score !== a.raw_score ? b.raw_score - a.raw_score : a.code.localeCompare(b.code));

    const topThree = sortedScores.slice(0, 3);
    const code1 = topThree[0]?.code || 'S';
    const code2 = topThree[1]?.code || 'C';
    const code3 = topThree[2]?.code || 'I';
    const hyphenatedCodes = `${code1}-${code2}-${code3}`;

    const highestScore = sortedScores[0]?.raw_score || 0;
    const dominantTies = sortedScores.filter((item) => item.raw_score === highestScore);
    const isDominantTie = dominantTies.length > 1;

    const cutoffScore = topThree[2]?.raw_score ?? 0;
    const tiedAtCutoff = sortedScores.filter((item) => item.raw_score === cutoffScore);
    const additionalTiedCodes = tiedAtCutoff.filter((item) => !topThree.some((topItem) => topItem.code === item.code)).map((item) => dimensionDefs[item.code].name);

    const cutoffMotivationMessage = additionalTiedCodes.length > 0
        ? `Selain pola di atas, kamu juga memiliki potensi kuat di bidang ${additionalTiedCodes.join(' dan ')} (Skor ${cutoffScore}). Jadikan opsi keterampilan unik!`
        : null;

    const data1 = riasecDictionary[code1];
    const data2 = riasecDictionary[code2];
    const data3 = riasecDictionary[code3];

    // ========================================================================
    // 2. MENGAMBIL DATA BERDASARKAN KUNCI FASE (phaseKey)
    // ========================================================================
    const phase1: PhaseData = data1.levels[phaseKey];
    const phase2: PhaseData = data2.levels[phaseKey];
    const phase3: PhaseData = data3.levels[phaseKey];

    // Menggabungkan data HANYA dari fase yang sedang aktif!
    const mixedEdu1 = blendArrays(phase1.eduList1, phase2.eduList1, phase3.eduList1, 5);
    const mixedEdu2 = blendArrays(phase1.eduList2, phase2.eduList2, phase3.eduList2, 5);
    const mixedMateri = blendArrays(phase1.materi, phase2.materi, phase3.materi, 6);
    const mixedLayanan = blendArrays(phase1.layanan, phase2.layanan, phase3.layanan, 5);
    const mixedGuruBk = blendArrays(phase1.guruBk, phase2.guruBk, phase3.guruBk, 4);
    const mixedSiswa = blendArrays(phase1.siswa, phase2.siswa, phase3.siswa, 4);

    // Karir & Freelance (Bebas lintas fase)
    const mixedKarir = blendArrays(data1.karir, data2.karir, data3.karir, 7);
    const mixedFreelance = blendArrays(data1.freelance, data2.freelance, data3.freelance, 5);
    // ========================================================================

    const dynamicConclusion = `Tipe dominan kamu adalah ${data1.title} (${data1.indonesianTitle}) dengan pola gabungan ${hyphenatedCodes}. ${data1.desc} Secara khusus, kamu memadukan dorongan dari ${dimensionDefs[code1].name}, gaya pendekatan ${dimensionDefs[code2].behavior}, didukung insting ${dimensionDefs[code3].behavior}.`;

    let dominantTieMessage = null;
    if (isDominantTie) {
        const tieNames = dominantTies.map(t => riasecDictionary[t.code].indonesianTitle).join(" dan ");
        dominantTieMessage = `Luar biasa! Skor tertinggi seimbang pada tipe ${tieNames}. Jadikan kepribadian fleksibel ini sebagai keunggulanmu!`;
    }

    // Penyesuaian nama tab berdasarkan tingkat yang spesifik
    let tabEducationTitle = "Pengembangan Diri & Studi";
    if (eduLvl === 'SD') tabEducationTitle = "Aktivitas & Ekstrakurikuler";
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
                            <p className="text-slate-700 text-sm leading-relaxed mb-4">{dynamicConclusion}</p>

                            {dominantTieMessage && (
                                <div className="mb-4 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 flex items-start gap-2">
                                    <Star className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" />
                                    <p className="text-sm text-indigo-900 leading-relaxed font-medium">{dominantTieMessage}</p>
                                </div>
                            )}

                            {cutoffMotivationMessage && (
                                <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-2">
                                    <Activity className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                                    <p className="text-sm text-amber-900 leading-relaxed">{cutoffMotivationMessage}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200">
                    <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-indigo-500" /> Detail Skor 6 Dimensi
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {sortedScores.map((score) => {
                            const percentage = Math.min((score.raw_score / 35) * 100, 100);
                            const dimInfo = dimensionDefs[score.code];
                            return (
                                <div key={score.code} className="flex flex-col gap-2">
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
                        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-600 pb-2"><HeartHandshake className="h-4 w-4 text-slate-300" /> Yang Perlu Dilakukan Guru / Orang Tua</h4>
                        <ul className="space-y-2">{mixedGuruBk.map((item, i) => <li key={i} className="text-sm text-slate-300 flex items-start gap-2"><ArrowRight className="h-4 w-4 shrink-0 mt-0.5 opacity-50" /> {item}</li>)}</ul>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-6 shadow-sm border border-blue-100">
                        <h4 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2 border-b border-blue-200 pb-2"><UserCheck className="h-4 w-4 text-blue-600" /> Yang Perlu Kamu Lakukan (Siswa)</h4>
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