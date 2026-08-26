// Lokasi file: /src/app/bk/students/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    ArrowLeft, User, GraduationCap, Printer,
    BrainCircuit, Activity, Clock, ShieldAlert, HeartPulse, Info
} from 'lucide-react';
import { getStudentDetailAction, type StudentFullProfile } from '@/features/bk/actions/student-detail.actions';
import type { EmotionType } from '@/features/student/types/emotion.types';

// Import komponen grafik
import StudentRiasecRadar from '@/features/bk/components/StudentRiasecRadar';
import StudentVarkPie from '@/features/bk/components/StudentVarkPie';
import StudentEmotionLine from '@/features/bk/components/StudentEmotionLine';

const EMOTION_MAP: Record<EmotionType, string> = {
    'HAPPY': 'Senang', 'CALM': 'Tenang', 'NEUTRAL': 'Netral',
    'CONFUSED': 'Bingung', 'SAD': 'Sedih', 'DISAPPOINTED': 'Kecewa',
    'ANGRY': 'Marah', 'AFRAID': 'Takut', 'ANXIOUS': 'Cemas', 'OTHER': 'Lainnya'
};

const formatIndonesianDate = (dateString: string) => {
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
    }).format(new Date(dateString)) + ' WIB';
};

export default function StudentProfilePage() {
    const params = useParams();
    const studentId = params.id as string;

    const [profile, setProfile] = useState<StudentFullProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const loadData = async () => {
            const res = await getStudentDetailAction(studentId);
            if (res.success && res.data) {
                setProfile(res.data);
            } else {
                setErrorMsg(res.error || 'Gagal memuat profil siswa.');
            }
            setIsLoading(false);
        };
        loadData();
    }, [studentId]);

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p className="text-slate-500 font-medium animate-pulse">Memuat profil siswa...</p></div>;

    if (errorMsg || !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="p-6 bg-rose-50 text-rose-600 rounded-xl flex items-center gap-3 border border-rose-100 shadow-sm">
                    <ShieldAlert /> <span className="font-bold">{errorMsg}</span>
                    <Link href="/bk/dashboard" className="ml-4 underline text-sm hover:text-rose-800">Kembali</Link>
                </div>
            </div>
        );
    }

    const latestEmotion = profile.recent_emotions[0];
    const isAtRisk = latestEmotion && ['SAD', 'DISAPPOINTED', 'ANGRY', 'AFRAID', 'ANXIOUS'].includes(latestEmotion.emotion) && latestEmotion.intensity >= 7;

    return (
        <div className="min-h-screen bg-slate-50 pb-16 font-sans print:bg-white print:pb-0 print:w-full print:overflow-visible">

            <header className="bg-indigo-700 text-white shadow-md print:hidden sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <Link href="/bk/dashboard" className="flex items-center gap-2 text-indigo-100 hover:text-white transition-colors text-sm font-medium">
                        <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Siswa
                    </Link>
                    <button onClick={handlePrint} className="flex items-center gap-2 bg-white text-indigo-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors shadow-sm active:scale-95">
                        <Printer className="h-4 w-4" /> Cetak Laporan
                    </button>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 mt-8 space-y-6 print:mt-0 print:space-y-6 print:px-0 print:max-w-none print:overflow-visible">

                {/* --- HEADER CETAK DENGAN LOGO TOPI WISUDA --- */}
                <div className="hidden print:flex print:flex-col print:items-center text-center border-b-2 border-slate-800 pb-5 mb-6">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <GraduationCap className="h-10 w-10 text-slate-900" strokeWidth={2.5} />
                        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-widest mt-1">SISTEM DIGIBK</h1>
                    </div>
                    <h2 className="text-lg font-bold text-slate-700">Laporan Profil & Asesmen Psikologis Siswa</h2>
                    <p className="text-sm text-slate-500 mt-1 font-medium">Dicetak pada: {new Date().toLocaleDateString('id-ID')} | ID Dokumen: {profile.student_code}</p>
                </div>

                <section className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative overflow-hidden print:shadow-none print:border-slate-300 print:rounded-lg print:flex-row print:items-start print:break-inside-avoid">
                    <div className="h-24 w-24 rounded-full bg-indigo-50 flex items-center justify-center shrink-0 border-4 border-indigo-100 z-10 print:border-slate-300">
                        <User className="h-10 w-10 text-indigo-500 print:text-slate-700" />
                    </div>
                    <div className="flex-1 text-center sm:text-left z-10 w-full">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:flex-row print:justify-between">
                            <div>
                                <h1 className="text-3xl font-black text-slate-900">{profile.full_name}</h1>
                                <p className="text-slate-500 font-medium mt-1">NISN: {profile.student_code}</p>
                            </div>
                            {isAtRisk && (
                                <div className="inline-flex items-center justify-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-2 rounded-xl text-sm font-bold print:border-rose-500 print:bg-white print:text-rose-600">
                                    <HeartPulse className="h-5 w-5 animate-pulse print:animate-none" /> Perlu Perhatian Khusus
                                </div>
                            )}
                        </div>
                        <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-3 print:justify-start">
                            <span className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-700 print:bg-white print:border print:border-slate-300">
                                <GraduationCap className="h-4 w-4 text-indigo-500 print:text-slate-700" /> Kelas {profile.class_name}
                            </span>
                        </div>
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:flex print:flex-col print:gap-8 print:overflow-visible">

                    {/* --- ASESMEN POTENSI --- */}
                    <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 print:shadow-none print:border-none print:p-0 print:overflow-visible">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-3 print:border-slate-400">
                            <BrainCircuit className="h-5 w-5 text-indigo-500 print:text-slate-800" /> Asesmen Potensi (Jurus 1)
                        </h3>

                        <div className="space-y-6 print:space-y-8">
                            {/* RIASEC */}
                            {/* Mengunci section ini agar tidak terpotong halaman */}
                            <div className="print:break-inside-avoid">
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Minat & Bakat (RIASEC)</p>
                                {profile.riasec_result ? (
                                    <div className="bg-indigo-50/50 border border-indigo-100 p-5 rounded-xl print:bg-white print:border-slate-300 print:p-6">

                                        {/* KUNCI PERBAIKAN: Posisi menyamping (flex-row), lebar tetap, dilarang menyusut (shrink-0) */}
                                        <div className="flex flex-col xl:flex-row gap-6 items-center xl:items-start print:flex print:flex-row print:flex-nowrap print:items-start">

                                            <div className="w-full xl:w-1/3 shrink-0 print:w-[250px] print:h-[250px] flex items-center justify-center">
                                                <StudentRiasecRadar scores={(profile.riasec_result as any).scores} />
                                            </div>

                                            <div className="w-full xl:w-2/3 print:flex-1">
                                                <p className="text-2xl font-black text-indigo-700 tracking-widest print:text-slate-900 mb-1">
                                                    {profile.riasec_result.code}
                                                </p>
                                                <p className="text-sm font-bold text-slate-800 mb-3 border-b border-indigo-100 pb-3 print:border-slate-300">
                                                    {profile.riasec_result.name}
                                                </p>
                                                <div className="flex gap-2 items-start mt-4">
                                                    <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5 print:text-slate-500" />
                                                    <div className="text-sm text-slate-700 leading-relaxed text-justify whitespace-pre-wrap">
                                                        {profile.riasec_result.interpretation}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400 italic">Siswa belum mengerjakan tes RIASEC.</p>
                                )}
                            </div>

                            {/* VARK */}
                            <div className="print:break-inside-avoid">
                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Gaya Belajar (VARK)</p>
                                {profile.vark_result ? (
                                    <div className="bg-teal-50/50 border border-teal-100 p-5 rounded-xl print:bg-white print:border-slate-300 print:p-6">

                                        {/* KUNCI PERBAIKAN: Posisi menyamping (flex-row), lebar tetap, dilarang menyusut (shrink-0) */}
                                        <div className="flex flex-col xl:flex-row gap-6 items-center xl:items-start print:flex print:flex-row print:flex-nowrap print:items-start">

                                            <div className="w-full xl:w-1/3 shrink-0 print:w-[250px] print:h-[250px] flex items-center justify-center">
                                                <StudentVarkPie scores={(profile.vark_result as any).scores} />
                                            </div>

                                            <div className="w-full xl:w-2/3 print:flex-1">
                                                <p className="text-2xl font-black text-teal-700 tracking-widest print:text-slate-900 mb-1">
                                                    {profile.vark_result.code}
                                                </p>
                                                <p className="text-sm font-bold text-slate-800 mb-1">
                                                    {profile.vark_result.name}
                                                </p>
                                                <p className="text-xs font-semibold text-teal-600 mb-3 border-b border-teal-100 pb-3 print:border-slate-300 print:text-slate-600">
                                                    Tipe Dominan: {profile.vark_result.dominant}
                                                </p>
                                                <div className="flex gap-2 items-start mt-4">
                                                    <Info className="h-4 w-4 text-teal-500 shrink-0 mt-0.5 print:text-slate-500" />
                                                    <div className="text-sm text-slate-700 leading-relaxed text-justify whitespace-pre-wrap">
                                                        {profile.vark_result.interpretation}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-slate-400 italic">Siswa belum mengerjakan tes VARK.</p>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* --- RIWAYAT EMOSI --- */}
                    <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 print:shadow-none print:border-none print:p-0 print:break-before-auto">
                        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b pb-3 print:border-slate-400">
                            <Activity className="h-5 w-5 text-rose-500 print:text-slate-800" /> Rekam Emosi (Jurus 2)
                        </h3>

                        {profile.recent_emotions.length === 0 ? (
                            <p className="text-sm text-slate-400 italic text-center py-6">Belum ada rekam check-in emosi dari siswa ini.</p>
                        ) : (
                            <div>
                                <div className="print:break-inside-avoid">
                                    <StudentEmotionLine data={profile.recent_emotions} />
                                </div>

                                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-t pt-4 print:border-slate-300">Riwayat Check-In Terbaru</p>

                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 print:max-h-none print:overflow-visible">
                                    {profile.recent_emotions.map((emo, idx) => (
                                        <div key={emo.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 print:bg-white print:border-slate-300 print:break-inside-avoid">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-md uppercase shadow-sm print:shadow-none print:border-slate-400">
                                                    {EMOTION_MAP[emo.emotion] || emo.emotion} (Skala: {emo.intensity}/10)
                                                </span>
                                                <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 print:text-slate-500">
                                                    <Clock className="h-3 w-3" /> {idx === 0 ? 'Terbaru' : formatIndonesianDate(emo.created_at)}
                                                </span>
                                            </div>
                                            {idx === 0 && (
                                                <p className="text-[10px] font-medium text-slate-400 mb-2 print:text-slate-500">{formatIndonesianDate(emo.created_at)}</p>
                                            )}
                                            <div className="space-y-2 mt-3">
                                                <p className="text-sm text-slate-700"><span className="font-bold text-[11px] text-slate-400 uppercase block print:text-slate-500">Konteks:</span> {emo.context}</p>
                                                <p className="text-sm text-slate-700"><span className="font-bold text-[11px] text-slate-400 uppercase block print:text-slate-500">Respons/Usaha:</span> {emo.coping_response}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}