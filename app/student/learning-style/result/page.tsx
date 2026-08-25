// Lokasi file: src/app/student/learning-style/result/page.tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, ArrowRight, Target, Eye, Headphones, // PERBAIKAN: Menambahkan ArrowRight
    MousePointerClick, Sparkles, Activity,
    BookOpen, Lightbulb, UserCheck, HeartHandshake
} from 'lucide-react';

// Import Service & Komponen
import { getVarkResultData } from '@/features/assessments/services/result.service';
import PrintPdfButton from '@/components/pdf/PrintPdfButton';

// Import Data Dictionary
import { varkDictionary, type LevelData, type PhaseData } from '@/lib/data/vark';

// ============================================================================
// 1. BAGIAN LOGIKA & HELPER (Terpisah dari UI)
// ============================================================================

const getVarkStyle = (code: string) => {
    switch (code.toUpperCase()) {
        case 'V': return { icon: Eye, label: 'Visual (Penglihatan)', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', bar: 'bg-blue-500' };
        case 'A': return { icon: Headphones, label: 'Auditori (Pendengaran)', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', bar: 'bg-emerald-500' };
        case 'R': return { icon: BookOpen, label: 'Read/Write (Membaca/Menulis)', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', bar: 'bg-amber-500' };
        case 'K': return { icon: MousePointerClick, label: 'Kinestetik (Praktik Fisik)', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', bar: 'bg-rose-500' };
        default: return { icon: Activity, label: 'Tidak Diketahui', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200', bar: 'bg-slate-500' };
    }
}

// Helper: Menentukan fase pendidikan
function determinePhaseKey(eduLvl: string, grade: number): keyof LevelData {
    if (eduLvl === 'SD' || eduLvl === 'MI') {
        if (grade <= 3) return 'SD_Awal';
        if (grade <= 5) return 'SD_Akhir';
        return 'SD_Transisi';
    } else if (eduLvl === 'SMP' || eduLvl === 'MTs') {
        return grade <= 8 ? 'SMP_Awal' : 'SMP_Transisi';
    } else if (eduLvl === 'SMA' || eduLvl === 'MA') {
        return grade <= 11 ? 'SMA_Awal' : 'SMA_Transisi';
    } else if (eduLvl === 'SMK') {
        return grade <= 11 ? 'SMK_Awal' : 'SMK_Transisi';
    }
    return 'SMP_Awal'; // Default fallback
}

// Helper: Memproses raw data menjadi data siap pakai untuk UI
function processResultData(profile: any, phaseKey: keyof LevelData) {
    const rawResults = profile.vark_results || profile.vak_results || [];

    // 1. Sorting & Nilai Maksimal
    const sortedScores = [...rawResults].sort((a: any, b: any) => Number(b.raw_score) - Number(a.raw_score));
    const maxScore = Math.max(...sortedScores.map(s => Number(s.raw_score)), 1);

    // 2. Deteksi Multimodal
    const dominantItems = sortedScores.filter(s => Number(s.raw_score) === maxScore);
    const isMultimodal = dominantItems.length > 1;
    const domCodesArray = dominantItems.map(s => (s.code || '').trim().toUpperCase());

    // 3. Ambil data utama (Jika multimodal, ambil yang pertama sebagai baseline fase)
    const primaryCode = domCodesArray[0] || 'V';
    const dominantData = varkDictionary[primaryCode] || varkDictionary['V'];
    const phaseData: PhaseData = dominantData.levels[phaseKey] || dominantData.levels['SMP_Awal'];

    return {
        sortedScores,
        maxScore,
        isMultimodal,
        domCodesArray,
        primaryCode,
        dominantData,
        phaseData
    };
}


// ============================================================================
// 2. BAGIAN UI KOMPONEN UTAMA (Fokus Render Saja)
// ============================================================================

export default async function VarkResultPage({ searchParams }: { searchParams: Promise<{ id?: string }>; }) {
    const resolvedParams = await searchParams;
    const resultId = resolvedParams.id;
    const supabase = await createClient();

    // 1. Validasi Akses & Ambil Data Base
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: student } = await supabase
        .from('students')
        .select(`id, full_name, education_level, grade_level, schools (name)`)
        .eq('user_id', user.id)
        .single();

    if (!student) redirect('/student/dashboard?error=Akses_Ditolak');

    const schoolName = student.schools && typeof student.schools === 'object' && 'name' in student.schools
        ? String(student.schools.name) : 'Sekolah Anda';

    // 2. Ambil Data Hasil dari Database
    const resultData = await getVarkResultData(student.id, resultId);

    if (!resultData || !resultData.profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
                <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                    <h3 className="font-bold text-lg text-slate-800">Profil Belum Ditemukan</h3>
                    <p className="text-slate-500 mt-2 text-sm">Pastikan Anda telah menyelesaikan kuesioner Gaya Belajar versi terbaru.</p>
                    <Link href="/student/dashboard" className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white text-sm font-bold rounded-lg transition-all hover:bg-teal-600/90">
                        Kembali ke Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    // 3. Proses Data dengan Helper (UI tidak memikirkan logika rumit lagi)
    const phaseKey = determinePhaseKey(student.education_level || 'SMP', student.grade_level || 7);
    const uiData = processResultData(resultData.profile, phaseKey);
    const mainStyle = getVarkStyle(uiData.primaryCode);

    // 4. Render UI
    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
            {/* Header Gelap */}
            <div className="bg-slate-900 pt-12 pb-24 px-4 sm:px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <Link href="/student/dashboard" className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-6 text-sm font-medium">
                        <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
                    </Link>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                        <div className="flex items-center gap-3">
                            <Target className="h-6 w-6 text-blue-400" />
                            <h1 className="text-3xl font-bold text-white tracking-tight">Hasil Gaya Belajar</h1>
                        </div>
                        {/* Tombol PDF terintegrasi rapi di Header */}
                        <div className="w-full sm:w-auto">
                            <PrintPdfButton moduleType="VARK" studentData={{ id: student.id, name: student.full_name, school: schoolName }} />
                        </div>
                    </div>
                    <p className="text-slate-400">Analisis preferensi belajar untuk {student.full_name} ({schoolName}).</p>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 -mt-14 relative z-20 space-y-6">

                {/* Kartu Kesimpulan Utama */}
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row gap-8 items-start">
                    <div className="shrink-0 flex flex-col items-center mx-auto sm:mx-0">
                        <div className="text-xs font-bold text-slate-400 mb-3 tracking-widest uppercase">
                            Tipe {uiData.isMultimodal ? 'Multimodal' : 'Dominan'}
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                            {uiData.domCodesArray.map(code => {
                                const style = getVarkStyle(code);
                                return (
                                    <div key={code} className={`h-20 w-20 sm:h-24 sm:w-24 rounded-2xl ${style.bg} border-2 ${style.border} flex flex-col items-center justify-center shadow-sm`}>
                                        <span className={`text-3xl sm:text-4xl font-black ${style.color}`}>{code}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-2xl font-bold text-slate-800 mb-3">
                            {uiData.isMultimodal ? 'Gaya Belajar Fleksibel (Campuran)' : mainStyle.label}
                        </h2>
                        <p className="text-slate-600 leading-relaxed mb-4">
                            {uiData.isMultimodal
                                ? `Luar biasa! Kamu adalah pembelajar yang fleksibel. Kamu dapat menyerap informasi dengan sangat baik melalui kombinasi berbagai metode.`
                                : uiData.dominantData.desc}
                        </p>

                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start text-left">
                            <Lightbulb className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                            <p className="text-sm text-blue-800">
                                {uiData.isMultimodal
                                    ? "Keuntungan Multimodal: Kamu bisa dengan mudah beradaptasi dengan berbagai cara mengajar guru yang berbeda-beda!"
                                    : `Fokus pada kekuatanmu! Memahami bahwa kamu seorang ${mainStyle.label} akan membantumu belajar lebih cepat dan tidak mudah bosan.`}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Kartu Progress Bar Lengkap */}
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                    <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-3">
                        <Activity className="h-5 w-5 text-indigo-500" /> Detail Profil V-A-R-K Kamu
                    </h3>

                    <div className="space-y-6">
                        {uiData.sortedScores.map((score: any) => {
                            const code = (score.code || '').trim().toUpperCase();
                            const scoreVal = Number(score.raw_score);
                            const style = getVarkStyle(code);
                            const IconCmp = style.icon;

                            const isDominant = scoreVal === uiData.maxScore;
                            const percentage = Math.min((scoreVal / uiData.maxScore) * 100, 100);

                            return (
                                <div key={code} className="relative">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${style.bg} border ${style.border}`}>
                                                <IconCmp className={`h-4 w-4 ${style.color}`} />
                                            </div>
                                            <span className="font-bold text-slate-700">{style.label}</span>
                                        </div>
                                        {/* PERBAIKAN: Menambahkan label Pendukung */}
                                        <div className="flex items-center gap-2">
                                            {isDominant ? (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wider">Dominan</span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase tracking-wider">Pendukung</span>
                                            )}
                                            <span className={`text-sm font-bold ${isDominant ? 'text-slate-900' : 'text-slate-500'}`}>{scoreVal} Poin</span>
                                        </div>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ease-out ${style.bar} ${!isDominant && 'opacity-50'}`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Grid Strategi & Karir */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
                            <Lightbulb className="h-4 w-4 text-amber-500" /> Strategi Belajar
                        </h4>
                        <div className="mb-4">
                            <span className="text-xs font-semibold text-slate-400 uppercase">{uiData.phaseData.eduTitle1}</span>
                            <ul className="mt-2 space-y-1.5">
                                {uiData.phaseData.eduList1.map((item, i) => <li key={i} className="text-sm text-slate-700 flex gap-2"><span className="text-slate-400">•</span> {item}</li>)}
                            </ul>
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase">{uiData.phaseData.eduTitle2}</span>
                            <ul className="mt-2 space-y-1.5">
                                {uiData.phaseData.eduList2.map((item, i) => <li key={i} className="text-sm text-slate-700 flex gap-2"><span className="text-slate-400">•</span> {item}</li>)}
                            </ul>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
                            <BookOpen className="h-4 w-4 text-emerald-500" /> Pengayaan & Materi
                        </h4>
                        <div className="mb-4">
                            <span className="text-xs font-semibold text-slate-400 uppercase">Fokus / Trik Ujian</span>
                            <ul className="mt-2 space-y-1.5">
                                {uiData.phaseData.materi.map((item, i) => <li key={i} className="text-sm text-slate-700 flex gap-2"><span className="text-slate-400">•</span> {item}</li>)}
                            </ul>
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase">Prospek Karir Utama</span>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                                {uiData.dominantData.karir.slice(0, 6).map((item, i) => (
                                    <span key={i} className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Grid Saran Guru & Siswa */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-700">
                        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-600 pb-2">
                            <HeartHandshake className="h-4 w-4 text-slate-300" /> Saran untuk Guru / Orang Tua
                        </h4>
                        <ul className="space-y-3">
                            {uiData.phaseData.guruBk.map((item, i) => (
                                <li key={i} className="text-sm text-slate-300 flex items-start gap-3">
                                    <span className="shrink-0 mt-0.5 text-slate-500">-</span>
                                    <span className="leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={`${mainStyle.bg} rounded-xl p-6 shadow-sm border ${mainStyle.border}`}>
                        <h4 className={`text-sm font-bold ${mainStyle.color} mb-4 flex items-center gap-2 border-b ${mainStyle.border} pb-2`}>
                            <UserCheck className="h-4 w-4" /> Apa yang Harus Kamu Lakukan?
                        </h4>
                        <ul className="space-y-3">
                            {uiData.phaseData.siswa.map((item, i) => (
                                <li key={i} className="text-sm text-slate-800 flex items-start gap-3">
                                    <Sparkles className={`h-4 w-4 shrink-0 mt-0.5 ${mainStyle.color}`} />
                                    <span className="leading-relaxed font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Tombol Aksi Bawah - PERBAIKAN: Mengembalikan warna hijau menyala */}
                <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-end items-center gap-4">
                    <Link
                        href="/student/dashboard"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-teal-600 text-white text-sm font-bold rounded-xl transition-all duration-300 hover:bg-teal-500 hover:shadow-lg hover:shadow-teal-500/40 hover:-translate-y-0.5"
                    >
                        Selesai & Kembali <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </main>
        </div>
    );
}