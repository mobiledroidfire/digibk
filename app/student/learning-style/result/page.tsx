// Lokasi file: src/app/student/learning-style/result/page.tsx

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
    Trophy, ArrowRight, Eye, Headphones,
    MousePointerClick, Sparkles, School, Activity,
    BookOpen, Lightbulb, UserCheck, HeartHandshake
} from 'lucide-react';

import {
    vakDictionary,
    type AssessmentResultVak,
    type VakProfile,
    type LevelData,
    type PhaseData
} from '@/lib/data/vak';

const getVakStyle = (code: string) => {
    if (code === 'V') return { icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', bar: 'bg-blue-500' };
    if (code === 'A') return { icon: Headphones, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', bar: 'bg-emerald-500' };
    return { icon: MousePointerClick, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', bar: 'bg-amber-500' };
}

function cleanCode(code?: string): string {
    return code ? code.trim().toUpperCase() : '';
}

export default async function VakResultPage({ searchParams }: { searchParams: Promise<{ id?: string }>; }) {
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
        redirect('/student/dashboard?error=Akses_Ditolak');
    }

    const schoolName = student.schools && typeof student.schools === 'object' && 'name' in student.schools
        ? String(student.schools.name) : 'Sekolah Anda';

    const eduLvl = student.education_level || 'SMP';
    const grade = student.grade_level || 7;

    let phaseKey: keyof LevelData = 'SMP_Awal';

    if (eduLvl === 'SD') {
        if (grade <= 3) phaseKey = 'SD_Awal';
        else if (grade <= 5) phaseKey = 'SD_Akhir';
        else phaseKey = 'SD_Transisi';
    } else if (eduLvl === 'MI') {
        if (grade <= 3) phaseKey = 'MI_Awal';
        else if (grade <= 5) phaseKey = 'MI_Akhir';
        else phaseKey = 'MI_Transisi';
    } else if (eduLvl === 'SMP') {
        if (grade <= 8) phaseKey = 'SMP_Awal';
        else phaseKey = 'SMP_Transisi';
    } else if (eduLvl === 'MTs') {
        if (grade <= 8) phaseKey = 'MTs_Awal';
        else phaseKey = 'MTs_Transisi';
    } else if (eduLvl === 'SMA') {
        if (grade <= 11) phaseKey = 'SMA_Awal';
        else phaseKey = 'SMA_Transisi';
    } else if (eduLvl === 'MA') {
        if (grade <= 11) phaseKey = 'MA_Awal';
        else phaseKey = 'MA_Transisi';
    } else if (eduLvl === 'SMK') {
        if (grade <= 11) phaseKey = 'SMK_Awal';
        else phaseKey = 'SMK_Transisi';
    }

    if (!resultId) {
        const { data: latestResult } = await supabase
            .from('assessment_results')
            .select('id')
            .eq('student_id', student.id)
            .eq('scoring_version', 'VAK-SCORING-v1')
            .order('calculated_at', { ascending: false })
            .limit(1)
            .single();

        if (latestResult) resultId = latestResult.id;
        else redirect('/student/dashboard?error=Hasil_Tidak_Ditemukan');
    }

    // PERBAIKAN SSOT: Memanggil dominant_code langsung dari tabel vak_profiles
    const { data: resultData, error: resultError } = await supabase
        .from('assessment_results')
        .select(`
            id, total_score,
            vak_profiles ( code, dominant_code, vak_results ( code, raw_score ) )
        `)
        .eq('id', resultId)
        .eq('student_id', student.id)
        .single();

    if (resultError || !resultData) {
        redirect('/student/dashboard?error=Data_Gagal_Dimuat');
    }

    // Tambahkan penegasan tipe data agar sinkron dengan src/lib/data/vak.ts
    const typedResult = resultData as unknown as AssessmentResultVak;
    const rawProfile = Array.isArray(typedResult.vak_profiles) ? typedResult.vak_profiles[0] : typedResult.vak_profiles;
    const profile = rawProfile as VakProfile | null;

    if (!profile) return <div className="p-8 text-center bg-slate-50 min-h-screen pt-20">Profil VAK Belum Ditemukan.</div>;

    const rawResults = profile.vak_results || [];

    // Sorting hanya untuk keperluan visual grafik batang
    const sortedScores = [...rawResults].sort((a, b) => Number(b.raw_score) - Number(a.raw_score));
    const maxScore = Math.max(...sortedScores.map(s => Number(s.raw_score)), 1);

    // MENGGUNAKAN SINGLE SOURCE OF TRUTH DARI DATABASE
    const dominantCode = cleanCode(profile.dominant_code) || 'V';
    const dominantData = vakDictionary[dominantCode];
    const dominantStyle = getVakStyle(dominantCode);
    const DominantIcon = dominantStyle.icon;

    const phaseData: PhaseData = dominantData.levels[phaseKey] || dominantData.levels['SMP_Awal'];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pb-12 font-sans">
            <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                <h1 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <Trophy className="text-teal-600" size={16} /> Hasil Gaya Belajar ({schoolName})
                </h1>
                <Link href="/student/dashboard" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Tutup</Link>
            </header>

            <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
                <section className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-slate-200 overflow-hidden relative">
                    <div className={`absolute top-0 right-0 w-64 h-64 ${dominantStyle.bg} rounded-full blur-3xl -mr-20 -mt-20 opacity-60`}></div>

                    <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
                        <div className={`h-32 w-32 ${dominantStyle.bg} border ${dominantStyle.border} rounded-full flex flex-col items-center justify-center shrink-0 shadow-inner`}>
                            <DominantIcon className={`h-12 w-12 ${dominantStyle.color}`} />
                            <span className="text-xl font-black text-slate-800 mt-1">{dominantCode}</span>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${dominantStyle.bg} ${dominantStyle.color} text-xs font-bold uppercase tracking-widest mb-3`}>
                                <Sparkles size={14} /> Dominan
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">{dominantData.title}</h2>
                            <p className="text-slate-600 leading-relaxed">{dominantData.desc}</p>
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
                    <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-3">
                        <Activity className="h-5 w-5 text-teal-500" /> Profil Detail V-A-K Kamu
                    </h3>
                    <div className="space-y-6">
                        {sortedScores.map((score) => {
                            const code = cleanCode(score.code);
                            const data = vakDictionary[code] || { title: code };
                            const style = getVakStyle(code);
                            const rawScoreNum = Number(score.raw_score);
                            const percentage = Math.min((rawScoreNum / maxScore) * 100, 100);
                            const Icon = style.icon;

                            return (
                                <div key={code} className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100">
                                        <Icon className={`h-5 w-5 ${style.color}`} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-slate-800 text-sm">{data.title}</span>
                                            <span className="text-sm font-bold text-slate-600">{rawScoreNum} Poin</span>
                                        </div>
                                        <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ${style.bar}`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
                            <Lightbulb className="h-4 w-4 text-amber-500" /> Strategi Belajar
                        </h4>
                        <div className="mb-4">
                            <span className="text-xs font-semibold text-slate-400 uppercase">{phaseData.eduTitle1}</span>
                            <ul className="mt-2 space-y-1.5">
                                {phaseData.eduList1.map((item, i) => <li key={i} className="text-sm text-slate-700">• {item}</li>)}
                            </ul>
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase">{phaseData.eduTitle2}</span>
                            <ul className="mt-2 space-y-1.5">
                                {phaseData.eduList2.map((item, i) => <li key={i} className="text-sm text-slate-700">• {item}</li>)}
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
                                {phaseData.materi.map((item, i) => <li key={i} className="text-sm text-slate-700">• {item}</li>)}
                            </ul>
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase">Prospek Karir Utama</span>
                            <ul className="mt-2 space-y-1.5 flex flex-wrap gap-1">
                                {dominantData.karir.map((item, i) => (
                                    <li key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{item}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-700">
                        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-600 pb-2">
                            <HeartHandshake className="h-4 w-4 text-slate-300" /> Saran untuk Guru / Orang Tua
                        </h4>
                        <ul className="space-y-3">
                            {phaseData.guruBk.map((item, i) => (
                                <li key={i} className="text-sm text-slate-300 flex items-start gap-3">
                                    <ArrowRight className="h-4 w-4 shrink-0 mt-0.5 opacity-50" />
                                    <span className="leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={`${dominantStyle.bg} rounded-xl p-6 shadow-sm border ${dominantStyle.border}`}>
                        <h4 className={`text-sm font-bold ${dominantStyle.color} mb-4 flex items-center gap-2 border-b ${dominantStyle.border} pb-2`}>
                            <UserCheck className="h-4 w-4" /> Apa yang Harus Kamu Lakukan?
                        </h4>
                        <ul className="space-y-3">
                            {phaseData.siswa.map((item, i) => (
                                <li key={i} className={`text-sm text-slate-800 flex items-start gap-3`}>
                                    <Sparkles className={`h-4 w-4 shrink-0 mt-0.5 ${dominantStyle.color}`} />
                                    <span className="leading-relaxed font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="pt-4 pb-12 flex justify-end">
                    <Link href="/student/dashboard" className="inline-flex items-center gap-2 px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl transition-colors shadow-sm">
                        Selesai & Kembali <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </main>
        </div>
    );
}