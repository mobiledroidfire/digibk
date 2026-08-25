// Lokasi file: /app/student/learning-style/result/page.tsx

import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, ArrowRight, Target, Eye, Headphones,
    MousePointerClick, Sparkles, Activity,
    BookOpen, Lightbulb, UserCheck, HeartHandshake
} from 'lucide-react';

import PrintPdfButton from '@/components/pdf/PrintPdfButton';
import { getVarkDisplayLogic } from '@/features/student/services/vark-result.service';
import type { ScoreItem } from '@/features/student/types/result.types';
import VarkRadarChart from '@/components/charts/VarkRadarChart';

const getVarkStyle = (code: string) => {
    switch (code.toUpperCase()) {
        case 'V': return { icon: Eye, label: 'Visual (Penglihatan)', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', bar: 'bg-blue-500' };
        case 'A': return { icon: Headphones, label: 'Auditori (Pendengaran)', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', bar: 'bg-emerald-500' };
        case 'R': return { icon: BookOpen, label: 'Read/Write (Membaca/Menulis)', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', bar: 'bg-amber-500' };
        case 'K': return { icon: MousePointerClick, label: 'Kinestetik (Praktik Fisik)', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', bar: 'bg-rose-500' };
        default: return { icon: Activity, label: 'Tidak Diketahui', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200', bar: 'bg-slate-500' };
    }
}

const varkDescriptions: Record<string, string> = {
    'V': 'Kamu sangat peka terhadap informasi visual. Menggunakan gambar, diagram, grafik, peta konsep, atau video akan membuat materi pelajaran jauh lebih mudah menempel di ingatanmu.',
    'A': 'Kamu memiliki kekuatan menyerap informasi dengan cara mendengarkan. Penjelasan lisan dari guru, berdiskusi dengan teman, atau merekam dan mendengarkan ulang materi adalah metode belajar paling jitu untukmu.',
    'R': 'Kamu sangat kuat dalam memahami instruksi berbasis teks. Belajar dengan cara membaca buku teks, merangkum materi dengan bahasamu sendiri, atau menulis ulang catatan adalah cara yang paling efektif.',
    'K': 'Kamu adalah tipe pembelajar yang harus "bergerak" atau melakukan tindakan. Melakukan eksperimen, simulasi, bermain peran, atau menyentuh objek secara langsung akan membuatmu sangat cepat paham.'
};

export default async function VarkResultPage({ searchParams }: { searchParams: Promise<{ id?: string }>; }) {
    const resolvedParams = await searchParams;

    let displayData;
    try {
        displayData = await getVarkDisplayLogic(resolvedParams.id);
    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'UNAUTHORIZED') redirect('/login');
        redirect('/student/dashboard?error=Akses_Ditolak');
    }

    if (!displayData) {
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

    const { student, phaseInfo, uiData } = displayData;
    const mainStyle = getVarkStyle(uiData.primaryCode);

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
            <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-4 shadow-sm">
                <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Target className="h-6 w-6 text-blue-400" />
                        <h1 className="text-xl font-bold text-white tracking-tight hidden sm:block">Hasil Gaya Belajar</h1>
                        <h1 className="text-lg font-bold text-white tracking-tight sm:hidden">V-A-R-K</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/student/dashboard" className="hidden sm:inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium">
                            <ArrowLeft className="h-4 w-4" /> Kembali
                        </Link>
                        <PrintPdfButton moduleType="VARK" studentData={{ id: student.id, name: student.full_name, school: student.schoolName }} />
                    </div>
                </div>
            </header>

            <div className="bg-slate-900 pt-8 pb-24 px-4 sm:px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <Link href="/student/dashboard" className="sm:hidden inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-6 text-sm font-medium">
                        <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
                    </Link>
                    <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Profil Preferensi Belajar</h2>
                    <p className="text-slate-400">Analisis asesmen untuk {student.full_name} ({student.schoolName}).</p>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 -mt-14 relative z-20 space-y-6">

                {phaseInfo.bannerMessage && (
                    <div className={`rounded-xl p-5 shadow-md flex items-center gap-4 text-white ${phaseInfo.isTransisi ? 'bg-linear-to-r from-indigo-600 to-purple-600' : 'bg-linear-to-r from-blue-600 to-cyan-600'}`}>
                        <div className="bg-white/20 p-3 rounded-full shrink-0">
                            {phaseInfo.isTransisi ? <Target className="h-6 w-6 text-white" /> : <Activity className="h-6 w-6 text-white" />}
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">{phaseInfo.bannerTitle}</h3>
                            <p className="text-sm text-white/90">{phaseInfo.bannerMessage}</p>
                        </div>
                    </div>
                )}

                {/* --- PERUBAHAN UTAMA: SECTION 1 (PROFIL + RADAR CHART DI BAWAH KOTAK) --- */}
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">

                    <div className="flex flex-col sm:flex-row gap-8 items-start">

                        {/* Kolom Kiri: Kotak Huruf (Badges) + Grafik Radar */}
                        <div className="shrink-0 flex flex-col items-center mx-auto sm:mx-0 w-full sm:w-72">
                            <div className="text-xs font-bold text-slate-400 mb-3 tracking-widest uppercase">
                                Tipe {uiData.isMultimodal ? 'Multimodal' : 'Dominan'}
                            </div>

                            {/* Kotak Huruf */}
                            <div className="flex flex-wrap justify-center gap-2 mb-6">
                                {uiData.domCodesArray.map((code: string) => {
                                    const style = getVarkStyle(code);
                                    return (
                                        <div key={code} className={`h-20 w-20 sm:h-24 sm:w-24 rounded-2xl ${style.bg} border-2 ${style.border} flex flex-col items-center justify-center shadow-sm`}>
                                            <span className={`text-3xl sm:text-4xl font-black ${style.color}`}>{code}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Grafik Radar diletakkan di SINI, tepat di bawah kotak huruf */}
                            <div className="w-full bg-slate-50 rounded-xl border border-slate-100 p-3 shadow-inner">
                                <h4 className="text-center text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
                                    Peta Keseimbangan
                                </h4>
                                {/* Batasi tinggi area grafik agar tidak terlalu besar di kolom kecil */}
                                <div className="h-55 w-full flex items-center justify-center">
                                    <VarkRadarChart data={uiData.sortedScores} />
                                </div>
                            </div>
                        </div>

                        {/* Kolom Kanan: Deskripsi Profil */}
                        <div className="flex-1 text-center sm:text-left">
                            <h2 className="text-2xl font-bold text-slate-800 mb-3">
                                {uiData.isMultimodal ? 'Gaya Belajar Fleksibel (Multimodal)' : mainStyle.label}
                            </h2>
                            <p className="text-slate-600 leading-relaxed mb-4 text-sm sm:text-base text-justify sm:text-left">
                                {uiData.isMultimodal
                                    ? "Sebagai seorang pembelajar Multimodal, Anda memiliki keunggulan kognitif dalam memproses informasi melalui berbagai saluran. Alih-alih bergantung pada satu metode tunggal, Anda mampu mengintegrasikan isyarat visual, auditori, teks, dan kinestetik secara bersamaan. Pendekatan campuran ini memungkinkan Anda memvalidasi pemahaman dari berbagai sudut pandang, memperkuat retensi memori jangka panjang, serta memberikan fleksibilitas tinggi untuk beradaptasi dengan berbagai gaya mengajar instruktur di lingkungan akademik maupun profesional."
                                    : uiData.dominantData.desc}
                            </p>

                            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start text-left">
                                <Lightbulb className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                                <p className="text-sm text-blue-800 leading-relaxed">
                                    {uiData.isMultimodal
                                        ? "Keunggulan Multimodal: Kemampuan adaptasi ini membuat Anda tangguh menghadapi materi kompleks. Gunakan kombinasi strategi (misalnya: membaca materi, menonton video demonstrasi, lalu mendiskusikannya) untuk hasil belajar yang optimal."
                                        : `Fokus pada kekuatanmu! Memahami bahwa kamu seorang ${mainStyle.label} akan membantumu belajar lebih cepat dan tidak mudah bosan.`}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- SECTION 2: DETAIL PROGRESS BAR --- */}
                <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8">
                    <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-3">
                        <Activity className="h-5 w-5 text-indigo-500" /> Detail Profil V-A-R-K Kamu
                    </h3>

                    <div className="space-y-6">
                        {uiData.sortedScores.map((score: ScoreItem) => {
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
                                        <div className="flex items-center gap-2">
                                            {isDominant ? (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 uppercase tracking-wider">Dominan</span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase tracking-wider">Pendukung</span>
                                            )}
                                            <span className={`text-sm font-bold ${isDominant ? 'text-slate-900' : 'text-slate-500'}`}>
                                                {scoreVal} Poin ({Math.round(percentage)}%)
                                            </span>
                                        </div>
                                    </div>

                                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden mb-2.5">
                                        <div
                                            className={`h-full rounded-full transition-all duration-1000 ease-out ${style.bar} ${!isDominant && 'opacity-50'}`}
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>

                                    <p className={`text-sm leading-relaxed ${isDominant ? 'text-slate-700 font-medium' : 'text-slate-500'} pl-11 sm:pl-0`}>
                                        {varkDescriptions[code]}
                                    </p>
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
                            <span className="text-xs font-semibold text-slate-400 uppercase">{uiData.phaseData.eduTitle1}</span>
                            <ul className="mt-2 space-y-1.5">
                                {uiData.phaseData.eduList1.slice(0, 10).map((item: string, i: number) => <li key={i} className="text-sm text-slate-700 flex gap-2"><span className="text-slate-400">•</span> {item}</li>)}
                            </ul>
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase">{uiData.phaseData.eduTitle2}</span>
                            <ul className="mt-2 space-y-1.5">
                                {uiData.phaseData.eduList2.slice(0, 10).map((item: string, i: number) => <li key={i} className="text-sm text-slate-700 flex gap-2"><span className="text-slate-400">•</span> {item}</li>)}
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
                                {uiData.phaseData.materi.slice(0, 10).map((item: string, i: number) => <li key={i} className="text-sm text-slate-700 flex gap-2"><span className="text-slate-400">•</span> {item}</li>)}
                            </ul>
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase">Prospek Karir Utama</span>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                                {uiData.dominantData.karir.slice(0, 10).map((item: string, i: number) => (
                                    <span key={i} className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md border border-slate-200">
                                        {item}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-700">
                        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-600 pb-2">
                            <HeartHandshake className="h-4 w-4 text-slate-300" /> Saran untuk Guru / Orang Tua
                        </h4>
                        <ul className="space-y-3">
                            {uiData.phaseData.guruBk.slice(0, 10).map((item: string, i: number) => (
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
                            {uiData.phaseData.siswa.slice(0, 10).map((item: string, i: number) => (
                                <li key={i} className="text-sm text-slate-800 flex items-start gap-3">
                                    <Sparkles className={`h-4 w-4 shrink-0 mt-0.5 ${mainStyle.color}`} />
                                    <span className="leading-relaxed font-medium">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

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