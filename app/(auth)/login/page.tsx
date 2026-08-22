// Lokasi file: src/app/(auth)/login/page.tsx
'use client';

import { useState, useActionState } from 'react';
import { studentLoginAction, teacherLoginAction, type AuthState } from '@/features/auth/actions/auth.actions';
import { Loader2, GraduationCap, ShieldCheck, BrainCircuit, ActivitySquare, ArrowLeft, Target, Users } from 'lucide-react';
import Link from 'next/link';

const initialState: AuthState = { error: null, success: false };

export default function LoginPage() {
    const [isStudentMode, setIsStudentMode] = useState<boolean>(true);

    const [studentState, studentAction, isStudentPending] = useActionState(studentLoginAction, initialState);
    const [teacherState, teacherAction, isTeacherPending] = useActionState(teacherLoginAction, initialState);

    const isPending = isStudentPending || isTeacherPending;
    const currentError = isStudentMode ? studentState.error : teacherState.error;

    return (
        <main className="flex min-h-screen bg-white">

            {/* ============================================================= */}
            {/* BAGIAN KIRI: KONTEN LANDING PAGE (Tampil di Layar Besar/Laptop) */}
            {/* ============================================================= */}
            <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-blue-600 p-12 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
                <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-500 blur-3xl opacity-50" />

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-12">
                        <GraduationCap className="h-10 w-10 text-yellow-300" strokeWidth={2.5} />
                        <span className="font-extrabold text-2xl tracking-widest">DIGIBK</span>
                    </div>

                    <h1 className="text-4xl xl:text-5xl font-extrabold leading-tight mb-6">
                        Kenali Potensi,<br />Raih Masa Depan.
                    </h1>
                    <p className="text-blue-100 text-base xl:text-lg max-w-md leading-relaxed mb-10">
                        Platform Bimbingan & Konseling Digital yang dirancang dengan 7 Jurus utama untuk memetakan minat bakat dan mendampingi perkembangan psikologis siswa.
                    </p>

                    {/* DAFTAR FITUR YANG DIPERLUAS */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/50 backdrop-blur-sm shadow-sm shrink-0">
                                <BrainCircuit className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Asesmen Potensi & RIASEC</h3>
                                <p className="text-blue-100 text-sm">Temukan bakat, minat, serta gaya belajar idealmu.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/50 backdrop-blur-sm shadow-sm shrink-0">
                                <ActivitySquare className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Manajemen Emosi</h3>
                                <p className="text-blue-100 text-sm">Kenali perasaan harianmu dan kelola emosi dengan lebih baik.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/50 backdrop-blur-sm shadow-sm shrink-0">
                                <ShieldCheck className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Tumbuhkan Resiliensi</h3>
                                <p className="text-blue-100 text-sm">Bangun ketangguhan mental untuk hadapi tantangan belajar.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/50 backdrop-blur-sm shadow-sm shrink-0">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-lg">Relasi & Kolaborasi</h3>
                                <p className="text-blue-100 text-sm">Pelajari cara menjalin koneksi dan membangun kerja sama tim.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-sm text-blue-200 font-medium">
                    © 2026 Sistem Informasi Bimbingan Konseling.
                </div>
            </div>

            {/* ============================================================= */}
            {/* BAGIAN KANAN: FORM PENDAFTARAN & LOGIN */}
            {/* ============================================================= */}
            <div className="w-full lg:w-1/2 flex flex-col bg-slate-50 lg:bg-white min-h-screen">

                {/* BARIS 1: AREA TOMBOL KEMBALI */}
                <div className="w-full flex justify-end p-6 sm:p-8">
                    <Link
                        href="/"
                        className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-all bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm hover:shadow-md active:scale-95"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        <span>Halaman Awal</span>
                    </Link>
                </div>

                {/* BARIS 2: AREA FORM */}
                <div className="flex-1 flex flex-col justify-center items-center w-full px-6 sm:px-12 pb-12">
                    <div className="w-full max-w-md">

                        {/* BAGIAN LOGO UNTUK HP */}
                        <div className="lg:hidden text-center mb-8">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-4 shadow-inner ring-4 ring-white">
                                <GraduationCap className="h-10 w-10 text-blue-600" strokeWidth={2} />
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">DIGIBK</h1>
                            <p className="mt-2 text-sm text-slate-500 font-medium">Asesmen Potensi & Karir Siswa</p>
                        </div>

                        <div className="bg-white lg:bg-transparent p-8 lg:p-0 rounded-3xl shadow-xl lg:shadow-none ring-1 ring-slate-200 lg:ring-0">
                            {/* Toggle Tab Guru/Siswa */}
                            <div className="flex rounded-xl bg-slate-100 p-1 mb-8 shadow-inner">
                                <button
                                    type="button"
                                    onClick={() => setIsStudentMode(true)}
                                    className={`flex w-1/2 items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold transition-all ${isStudentMode ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <GraduationCap className="h-5 w-5" /> Siswa
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsStudentMode(false)}
                                    className={`flex w-1/2 items-center justify-center gap-2 rounded-lg py-3 text-sm font-bold transition-all ${!isStudentMode ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
                                >
                                    <ShieldCheck className="h-5 w-5" /> Guru BK
                                </button>
                            </div>

                            {/* FORM SISWA */}
                            {isStudentMode ? (
                                <form action={studentAction} className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="space-y-1.5">
                                        <label htmlFor="studentCode" className="text-xs font-bold uppercase tracking-wider text-slate-500">NISN / Nomor Absen</label>
                                        <input
                                            id="studentCode" name="studentCode" type="text" required disabled={isPending}
                                            placeholder="Contoh: 0012345678 atau 15"
                                            className="flex h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-600/20 disabled:opacity-50 transition-all"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-slate-500">Nama Lengkap</label>
                                        <input
                                            id="fullName" name="fullName" type="text" required disabled={isPending}
                                            placeholder="Contoh: Andi Wijaya"
                                            className="flex h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm font-medium focus:ring-2 focus:ring-blue-600/20 disabled:opacity-50 transition-all"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="className" className="text-xs font-bold uppercase tracking-wider text-slate-500">Kelas</label>
                                        <input
                                            id="className" name="className" type="text" required disabled={isPending}
                                            placeholder="Contoh: 6A atau 10 MIPA 1"
                                            className="flex h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm font-medium uppercase focus:ring-2 focus:ring-blue-600/20 disabled:opacity-50 transition-all"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label htmlFor="schoolName" className="text-xs font-bold uppercase tracking-wider text-slate-500">Asal Sekolah</label>
                                        <input
                                            id="schoolName" name="schoolName" type="text" required disabled={isPending}
                                            placeholder="Contoh: SD MUHAMMADIYAH PAJANGAN 1"
                                            className="flex h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm font-medium uppercase focus:ring-2 focus:ring-blue-600/20 disabled:opacity-50 transition-all"
                                        />
                                        <p className="text-[11px] text-slate-400 mt-1">Atau: SMA MUHAMMADIYAH KALASAN</p>
                                    </div>

                                    <button
                                        type="submit" disabled={isPending}
                                        className="mt-8 flex h-12 w-full items-center justify-center rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-70"
                                    >
                                        {isStudentPending ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Menyiapkan Lembar Tes...</> : 'Mulai Asesmen'}
                                    </button>
                                </form>
                            ) : (
                                /* FORM GURU */
                                <form action={teacherAction} className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="space-y-1.5">
                                        <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Akun Guru</label>
                                        <input
                                            id="email" name="email" type="email" required disabled={isPending}
                                            placeholder="guru@sekolah.com"
                                            className="flex h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm font-medium focus:ring-2 focus:ring-slate-900/20 disabled:opacity-50 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-500">Kata Sandi</label>
                                        <input
                                            id="password" name="password" type="password" required disabled={isPending}
                                            placeholder="••••••••"
                                            className="flex h-12 w-full rounded-xl border border-slate-300 bg-slate-50 px-4 text-sm font-medium focus:ring-2 focus:ring-slate-900/20 disabled:opacity-50 transition-all"
                                        />
                                    </div>
                                    <button
                                        type="submit" disabled={isPending}
                                        className="mt-8 flex h-12 w-full items-center justify-center rounded-xl bg-slate-900 text-white font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-70"
                                    >
                                        {isTeacherPending ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memverifikasi Kredensial...</> : 'Masuk Panel Guru'}
                                    </button>
                                </form>
                            )}

                            {currentError && (
                                <div className="mt-6 rounded-xl bg-red-50 p-4 text-sm font-bold text-red-600 ring-1 ring-inset ring-red-600/20 animate-in fade-in flex items-start gap-3">
                                    <div className="mt-0.5">⚠️</div>
                                    <p>{currentError}</p>
                                </div>
                            )}

                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}