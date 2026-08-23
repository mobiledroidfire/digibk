// Lokasi file: src/app/(auth)/login/page.tsx
'use client';

import { useState, useActionState, useEffect } from 'react';
import { studentLoginAction, teacherLoginAction, type AuthState } from '@/features/auth/actions/auth.actions';
import { Loader2, GraduationCap, ShieldCheck, ArrowLeft, AlertCircle, Eye, EyeOff, BrainCircuit, ActivitySquare } from 'lucide-react';
import Link from 'next/link';

const initialState: AuthState = { error: null, success: false };

// =========================================================================
// CUSTOM HOOK: Untuk membuat efek tulisan berjalan (Marquee) pada Placeholder
// =========================================================================
function useMarqueePlaceholder(text: string, speed: number = 150) {
    // Menambahkan spasi di akhir agar ada jarak sebelum teks mengulang
    const [placeholder, setPlaceholder] = useState(text + " \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 ");

    useEffect(() => {
        const interval = setInterval(() => {
            setPlaceholder((prev) => prev.substring(1) + prev[0]);
        }, speed);

        return () => clearInterval(interval);
    }, [text, speed]);

    return placeholder;
}

export default function LoginPage() {
    // State untuk mode form dan visibilitas password
    const [isStudentMode, setIsStudentMode] = useState<boolean>(true);
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const [studentState, studentAction, isStudentPending] = useActionState(studentLoginAction, initialState);
    const [teacherState, teacherAction, isTeacherPending] = useActionState(teacherLoginAction, initialState);

    const isPending = isStudentPending || isTeacherPending;
    const currentError = isStudentMode ? studentState.error : teacherState.error;

    // Mengaktifkan efek Marquee untuk input yang panjang
    const schoolPlaceholder = useMarqueePlaceholder("Contoh: SD Muhammadiyah 1 Surakarta atau SMAN 1 Jakarta", 150);
    const namePlaceholder = useMarqueePlaceholder("Contoh: Hendi Prasetyo Sangat Panjang Sekali Namanya", 150);

    return (
        <main className="flex min-h-screen bg-white font-sans text-slate-900">
            {/* ============================================================= */}
            {/* BAGIAN KIRI: HERO SECTION (Premium Modern SaaS Look) */}
            {/* ============================================================= */}
            <div className="hidden lg:flex lg:w-5/12 flex-col justify-between bg-linear-to-br from-slate-900 via-blue-950 to-blue-900 p-12 text-white relative overflow-hidden">

                <div className="absolute top-0 right-0 w-125 h-125 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-100 h-100 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div>
                        {/* Brand Logo */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 shadow-xl">
                                <GraduationCap className="h-6 w-6 text-blue-200" strokeWidth={2.5} />
                            </div>
                            <span className="font-bold text-2xl tracking-tight text-white">DIGIBK</span>
                        </div>

                        {/* Value Proposition */}
                        <div className="mt-12">
                            <h1 className="text-4xl xl:text-5xl font-bold leading-[1.15] mb-6 text-transparent bg-clip-text bg-linear-to-r from-white to-blue-200">
                                Kenali Potensi,<br />Raih Masa Depan.
                            </h1>
                            <p className="text-blue-100/80 text-lg leading-relaxed max-w-md font-medium">
                                Platform Bimbingan & Konseling Digital dengan 7 Jurus utama untuk memetakan minat bakat dan mendampingi perkembangan psikologis siswa.
                            </p>

                            {/* Daftar Fitur */}
                            <div className="mt-12 space-y-8">
                                <div className="flex items-start gap-4">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600/50 backdrop-blur-sm border border-blue-400/30 shrink-0 shadow-lg">
                                        <BrainCircuit className="h-5 w-5 text-blue-200" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-base text-white">Asesmen Potensi & RIASEC</h3>
                                        <p className="text-blue-200/70 text-sm mt-1">Temukan bakat, minat, serta gaya belajar idealmu.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600/50 backdrop-blur-sm border border-blue-400/30 shrink-0 shadow-lg">
                                        <ActivitySquare className="h-5 w-5 text-blue-200" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-base text-white">Manajemen Emosi</h3>
                                        <p className="text-blue-200/70 text-sm mt-1">Kenali perasaan harianmu dan kelola emosi dengan lebih baik.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600/50 backdrop-blur-sm border border-blue-400/30 shrink-0 shadow-lg">
                                        <ShieldCheck className="h-5 w-5 text-blue-200" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-base text-white">Tumbuhkan Resiliensi</h3>
                                        <p className="text-blue-200/70 text-sm mt-1">Bangun ketangguhan mental untuk hadapi tantangan belajar.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Kiri */}
                    <div className="mt-auto pt-12 text-sm text-blue-200/50 font-medium">
                        © 2026 Sistem Informasi BK. All rights reserved.
                    </div>
                </div>
            </div>

            {/* ============================================================= */}
            {/* BAGIAN KANAN: FORM LOGIN (Clean & Minimalist) */}
            {/* ============================================================= */}
            <div className="w-full lg:w-7/12 flex flex-col min-h-screen relative">

                {/* Navigasi Kembali */}
                <div className="fixed top-0 right-0 z-50 w-full lg:w-7/12 flex justify-end p-4 sm:p-6 bg-white/95 backdrop-blur-md border-b border-slate-100 lg:border-none lg:bg-transparent lg:backdrop-blur-none lg:p-8">
                    <Link
                        href="/"
                        className="group flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors bg-white hover:bg-slate-50 px-4 py-2.5 rounded-full border border-slate-200 shadow-sm"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        <span className="hidden sm:inline">Kembali ke Beranda</span>
                    </Link>
                </div>

                {/* Container Form Utama */}
                <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-12 w-full max-w-lg mx-auto pb-12 pt-24 lg:pt-0">

                    {/* Header Mobile */}
                    <div className="lg:hidden flex flex-col items-center text-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 mb-5">
                            <GraduationCap className="h-7 w-7 text-white" strokeWidth={2.5} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Selamat Datang di DIGIBK</h2>
                        <p className="text-sm text-slate-500 mt-2 font-medium">Silakan masuk ke akun Anda</p>
                    </div>

                    {/* Header Desktop */}
                    <div className="hidden lg:block w-full mb-8">
                        <h2 className="text-3xl font-bold text-slate-900">Masuk ke Akun</h2>
                        <p className="text-slate-500 mt-2 font-medium">Pilih peran Anda untuk melanjutkan</p>
                    </div>

                    {/* Segmented Control (Tab Perpindahan) */}
                    <div className="flex p-1 bg-slate-100 rounded-xl w-full mb-8 shadow-inner">
                        <button
                            type="button"
                            onClick={() => setIsStudentMode(true)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${isStudentMode
                                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <GraduationCap className="h-4 w-4" /> Siswa
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsStudentMode(false)}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold rounded-lg transition-all duration-200 ${!isStudentMode
                                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            <ShieldCheck className="h-4 w-4" /> Guru BK
                        </button>
                    </div>

                    {/* Container Form */}
                    <div className="w-full overflow-hidden">
                        {isStudentMode ? (
                            /* FORM SISWA */
                            <form action={studentAction} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="space-y-2">
                                    <label htmlFor="studentCode" className="text-sm font-semibold text-slate-700">NISN / Nomor Absen</label>
                                    <input
                                        id="studentCode" name="studentCode" type="text" required disabled={isPending}
                                        placeholder="Contoh: 0012345678 (Ketik NISN)"
                                        className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 px-4 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all disabled:opacity-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="fullName" className="text-sm font-semibold text-slate-700">Nama Lengkap</label>
                                    {/* MENGGUNAKAN STATE MARQUEE */}
                                    <input
                                        id="fullName" name="fullName" type="text" required disabled={isPending}
                                        placeholder={namePlaceholder}
                                        className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 px-4 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all disabled:opacity-50"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="className" className="text-sm font-semibold text-slate-700">Kelas</label>
                                        <input
                                            id="className" name="className" type="text" required disabled={isPending}
                                            placeholder="Ex: 6 A atau 10 MIPA"
                                            className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 px-4 text-sm font-medium text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all disabled:opacity-50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="schoolName" className="text-sm font-semibold text-slate-700">Asal Sekolah</label>
                                        {/* MENGGUNAKAN STATE MARQUEE */}
                                        <input
                                            id="schoolName" name="schoolName" type="text" required disabled={isPending}
                                            placeholder={schoolPlaceholder}
                                            className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 px-4 text-sm font-medium text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all disabled:opacity-50"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit" disabled={isPending}
                                    className="w-full h-12 mt-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none shadow-md shadow-blue-600/20"
                                >
                                    {isStudentPending ? <><Loader2 className="h-5 w-5 animate-spin" /> Menyiapkan...</> : 'Mulai Asesmen'}
                                </button>
                            </form>
                        ) : (
                            /* FORM GURU BK */
                            <form action={teacherAction} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-semibold text-slate-700">Email Kerja</label>
                                    <input
                                        id="email" name="email" type="email" required disabled={isPending}
                                        placeholder="guru@sekolah.com"
                                        className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 px-4 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all disabled:opacity-50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label htmlFor="password" className="text-sm font-semibold text-slate-700">Kata Sandi</label>
                                    </div>
                                    <div className="relative">
                                        <input
                                            id="password" name="password"
                                            type={showPassword ? "text" : "password"}
                                            required disabled={isPending}
                                            placeholder="••••••••"
                                            className="w-full h-12 rounded-xl bg-slate-50 border border-slate-200 pl-4 pr-12 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900/10 transition-all disabled:opacity-50"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors focus:outline-none"
                                            tabIndex={-1}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="submit" disabled={isPending}
                                    className="w-full h-12 mt-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none shadow-md shadow-slate-900/10"
                                >
                                    {isTeacherPending ? <><Loader2 className="h-5 w-5 animate-spin" /> Memverifikasi...</> : 'Masuk Panel Guru'}
                                </button>
                            </form>
                        )}

                        {/* TAMPILAN PESAN ERROR */}
                        {currentError && (
                            <div className="mt-6 rounded-xl bg-red-50 p-4 border border-red-100 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
                                <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
                                <p className="text-sm font-medium text-red-700 leading-relaxed">{currentError}</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </main>
    );
}