// Lokasi file: /app/student/potential/result/page.tsx

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Activity, School, Briefcase, BookOpen, UserCheck, HeartHandshake, Sparkles, Target } from 'lucide-react';
import PrintPdfButton from '@/components/pdf/PrintPdfButton';
import { dimensionDefs } from '@/lib/data/riasec';
import { getRiasecDisplayLogic, riasecTranslations, cleanCode } from '@/features/student/services/riasec-result.service';
import type { ScoreItem } from '@/features/student/types/result.types';

import RiasecRadarChart from '@/components/charts/RiasecRadarChart';

const getRiasecStyle = (code: string) => {
    switch (code) {
        case 'R': return { color: 'text-red-600', bar: 'bg-red-500', bg: 'bg-red-50', border: 'border-red-200' };
        case 'I': return { color: 'text-amber-600', bar: 'bg-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' };
        case 'A': return { color: 'text-emerald-600', bar: 'bg-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' };
        case 'S': return { color: 'text-blue-600', bar: 'bg-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' };
        case 'E': return { color: 'text-violet-600', bar: 'bg-violet-500', bg: 'bg-violet-50', border: 'border-violet-200' };
        case 'C': return { color: 'text-slate-600', bar: 'bg-slate-500', bg: 'bg-slate-50', border: 'border-slate-200' };
        default: return { color: 'text-indigo-600', bar: 'bg-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200' };
    }
}

export default async function RiasecResultPage({ searchParams }: { searchParams: Promise<{ id?: string }>; }) {
    const resolvedParams = await searchParams;

    let displayData;
    try {
        displayData = await getRiasecDisplayLogic(resolvedParams.id, false);
    } catch (error: unknown) {
        if (error instanceof Error && error.message === 'UNAUTHORIZED') redirect('/login');
        redirect('/student/dashboard?error=Akses_Ditolak');
    }

    if (!displayData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
                <div className="bg-white p-8 rounded-xl shadow-sm text-center">
                    <h3 className="font-bold text-lg text-slate-800">Profil Belum Ditemukan</h3>
                    <p className="text-slate-500 mt-2 text-sm">Pastikan Anda telah menyelesaikan kuesioner.</p>
                    <Link href="/student/dashboard" className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg transition-all hover:bg-blue-700">
                        <ArrowRight className="h-4 w-4" /> Kembali ke Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    const { student, phaseInfo, profileData, mixedData, tabEducationTitle } = displayData;

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
            <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-4 shadow-sm">
                <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Target className="h-6 w-6 text-blue-400" />
                        <h1 className="text-xl font-bold text-white tracking-tight hidden sm:block">Laporan Asesmen</h1>
                        <h1 className="text-lg font-bold text-white tracking-tight sm:hidden">RIASEC</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/student/dashboard" className="hidden sm:inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium">
                            <ArrowLeft className="h-4 w-4" /> Kembali
                        </Link>
                        <PrintPdfButton moduleType="RIASEC" studentData={{ id: student.id, name: student.full_name, school: student.schoolName }} />
                    </div>
                </div>
            </header>

            <div className="bg-slate-900 pt-8 pb-24 px-4 sm:px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <Link href="/student/dashboard" className="sm:hidden inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors mb-6 text-sm font-medium">
                        <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
                    </Link>
                    <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Profil Potensi Bakat Minat</h2>
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

                <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200">
                    <div className="flex flex-col md:flex-row gap-8 items-start">

                        {/* Kolom Kiri: Kotak Huruf (Badges) + Grafik Radar */}
                        <div className="shrink-0 flex flex-col items-center mx-auto md:mx-0 w-full md:w-80">
                            <div className="text-xs font-bold text-slate-400 mb-3 tracking-widest uppercase">
                                KODE PROFIL
                            </div>

                            <div className="flex flex-wrap justify-center gap-2 mb-6">
                                {profileData.hyphenatedCodes.split('-').map((char: string, index: number) => {
                                    const style = getRiasecStyle(char);
                                    return (
                                        // PERBAIKAN 3: Mengubah ukuran kotak (h-14 w-14 sm:h-16 sm:w-16) agar lebih kecil dan rapi
                                        <div key={index} className={`h-14 w-14 sm:h-16 sm:w-16 rounded-2xl ${style.bg} border-2 ${style.border} flex flex-col items-center justify-center shadow-sm`}>
                                            {/* PERBAIKAN 4: Mengubah ukuran teks (text-2xl sm:text-3xl) agar proporsional */}
                                            <span className={`text-2xl sm:text-3xl font-black ${style.color}`}>{char}</span>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Grafik Radar diletakkan di SINI */}
                            <div className="w-full bg-slate-50 rounded-xl border border-slate-100 p-3 shadow-inner">
                                <h4 className="text-center text-[11px] font-bold text-slate-500 mb-1 uppercase tracking-wider">
                                    Peta Potensi RIASEC
                                </h4>
                                {/* PERBAIKAN 5: Mengubah class "h-55" menjadi "h-[260px]" */}
                                <div className="h-65 w-full flex items-center justify-center">
                                    <RiasecRadarChart data={profileData.sortedScores} />
                                </div>
                            </div>
                        </div>

                        {/* Kolom Kanan: Deskripsi Profil */}
                        <div className="flex-1 text-center md:text-left">
                            {/* Ukuran judul diperkecil dari text-2xl menjadi text-xl */}
                            <h2 className="text-xl font-bold text-slate-800 mb-3">Ringkasan Kesimpulan</h2>

                            {/* Ukuran paragraf diperkecil menjadi text-sm (menghapus sm:text-base) */}
                            <p className="text-slate-700 text-sm leading-relaxed mb-5 whitespace-pre-line text-justify md:text-left">
                                {profileData.dynamicConclusion}
                            </p>

                            <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 flex items-start gap-3 text-left">
                                <Sparkles className="h-5 w-5 text-indigo-600 mt-0.5 shrink-0" />
                                {/* Teks pesan alert juga diperkecil sedikit menjadi text-xs sm:text-sm */}
                                <p className="text-xs sm:text-sm text-indigo-900 leading-relaxed font-medium">
                                    {profileData.dominantTieMessage}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200">
                    <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-3">
                        <Activity className="h-5 w-5 text-indigo-500" /> Detail Skor 6 Dimensi
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {profileData.sortedScores.map((score: ScoreItem) => {
                            const percentage = Math.min((Number(score.raw_score) / 35) * 100, 100);
                            const safeCode = cleanCode(score.code);
                            const dimInfo = dimensionDefs[safeCode] || { name: safeCode, meaning: '' };
                            const style = getRiasecStyle(safeCode);
                            const indonesianName = riasecTranslations[dimInfo.name];
                            const displayName = indonesianName ? `${dimInfo.name} (${indonesianName})` : dimInfo.name;

                            return (
                                <div key={safeCode} className="flex flex-col gap-2 relative">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <span className="font-bold text-slate-800 text-sm">{displayName}</span>
                                            <p className="text-xs text-slate-500 mt-0.5">{dimInfo.meaning}</p>
                                        </div>
                                        <span className={`text-sm font-bold ${style.color}`}>{score.raw_score} Poin ({Math.round(percentage)}%)</span>
                                    </div>
                                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full transition-all duration-1000 ease-out ${style.bar}`} style={{ width: `${percentage}%` }}></div>
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
                            <span className="text-xs font-semibold text-slate-400 uppercase">{mixedData.phase1.eduTitle1}</span>
                            <ul className="mt-2 space-y-1.5">{mixedData.mixedEdu1.slice(0, 10).map((item: string, i: number) => <li key={i} className="text-sm text-slate-700 flex gap-2"><span className="text-slate-400">•</span> {item}</li>)}</ul>
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase">{mixedData.phase1.eduTitle2}</span>
                            <ul className="mt-2 space-y-1.5">{mixedData.mixedEdu2.slice(0, 10).map((item: string, i: number) => <li key={i} className="text-sm text-slate-700 flex gap-2"><span className="text-slate-400">•</span> {item}</li>)}</ul>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
                            <Briefcase className="h-4 w-4 text-emerald-500" /> Karier & Usaha
                        </h4>
                        <div className="mb-4">
                            <span className="text-xs font-semibold text-slate-400 uppercase">Pekerjaan Masa Depan</span>
                            <div className="mt-2 flex flex-wrap gap-1.5">
                                {mixedData.mixedKarir.slice(0, 10).map((item: string, i: number) => <span key={i} className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md border">{item}</span>)}
                            </div>
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase">Peluang Khusus</span>
                            <ul className="mt-2 space-y-1.5">{mixedData.mixedFreelance.slice(0, 10).map((item: string, i: number) => <li key={i} className="text-sm text-slate-700 flex gap-2"><span className="text-slate-400">•</span> {item}</li>)}</ul>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
                            <BookOpen className="h-4 w-4 text-amber-500" /> Pembelajaran
                        </h4>
                        <div className="mb-4">
                            <span className="text-xs font-semibold text-slate-400 uppercase">Fokus Materi ({student.education_level})</span>
                            <ul className="mt-2 space-y-1.5">{mixedData.mixedMateri.slice(0, 10).map((item: string, i: number) => <li key={i} className="text-sm text-slate-700 flex gap-2"><span className="text-slate-400">•</span> {item}</li>)}</ul>
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase">Layanan Pendukung</span>
                            <ul className="mt-2 space-y-1.5">{mixedData.mixedLayanan.slice(0, 10).map((item: string, i: number) => <li key={i} className="text-sm text-slate-700 flex gap-2"><span className="text-slate-400">•</span> {item}</li>)}</ul>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-700">
                        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-600 pb-2">
                            <HeartHandshake className="h-4 w-4 text-slate-300" /> Saran untuk Guru / Orang Tua
                        </h4>
                        <ul className="space-y-3">{mixedData.mixedGuruBk.slice(0, 10).map((item: string, i: number) => <li key={i} className="text-sm text-slate-300 flex items-start gap-3"><span className="shrink-0 mt-0.5 text-slate-500">-</span> <span>{item}</span></li>)}</ul>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-6 shadow-sm border border-blue-100">
                        <h4 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2 border-b border-blue-200 pb-2">
                            <UserCheck className="h-4 w-4 text-blue-600" /> Saran untuk Kamu
                        </h4>
                        <ul className="space-y-3">{mixedData.mixedSiswa.slice(0, 10).map((item: string, i: number) => <li key={i} className="text-sm text-blue-800 flex items-start gap-3"><Sparkles className="h-4 w-4 shrink-0 mt-0.5 opacity-50" /> <span>{item}</span></li>)}</ul>
                    </div>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-200 flex flex-col sm:flex-row justify-end items-center gap-4">
                    <Link
                        href="/student/dashboard"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl transition-all duration-300 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/40 hover:-translate-y-0.5"
                    >
                        Selesai & Kembali <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </main>
        </div>
    );
}