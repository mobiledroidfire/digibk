// Lokasi file: /src/app/bk/dashboard/page.tsx
import React from 'react';
import Link from 'next/link';
import {
    Users, ShieldAlert, BookOpen, Activity,
    Search, Filter, HeartPulse, ShieldCheck, ArrowLeft
} from 'lucide-react';
import { getBkDashboardDataAction } from '@/features/bk/actions/dashboard.actions';
import EmotionSummaryChart from '@/components/charts/EmotionSummaryChart';
import Pagination from '@/components/ui/Pagination';
import LogoutConfirmButton from '@/components/admin/AdminLogoutButton';

export const dynamic = 'force-dynamic';

// Karena ini Next.js App Router, kita bisa menangkap searchParams dari props
interface BkDashboardProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BkDashboardPage({ searchParams }: BkDashboardProps) {
    // 1. Ambil parameter dari URL untuk Pagination & Pencarian
    const resolvedParams = await searchParams;
    const currentPage = Number(resolvedParams?.page) || 1;
    const searchQuery = typeof resolvedParams?.search === 'string' ? resolvedParams.search : '';
    const limit = 10; // Jumlah data per halaman

    // 2. Panggil Logika Server
    const { success, data, error } = await getBkDashboardDataAction(currentPage, limit, searchQuery);

    if (!success || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="p-6 bg-rose-50 text-rose-600 rounded-xl flex items-center gap-3 border border-rose-100 shadow-sm">
                    <ShieldAlert className="h-6 w-6" /> <span className="font-bold">Gagal memuat data: {error}</span>
                </div>
            </div>
        );
    }

    const { userRole, totalStudents, assessedStudents, emotionStats, students, totalPages } = data;
    const criticalStudentsCount = students.filter(s => s.is_at_risk).length;

    return (
        <div className="min-h-screen bg-slate-50/50 pb-16 font-sans">

            {/* --- HEADER --- */}
            <header className="relative z-50 bg-slate-900 text-white overflow-hidden shadow-xl shadow-slate-900/10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between z-10">

                    {/* Bagian Kiri: Logo dan Judul */}
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10">
                            <BookOpen className="h-6 w-6 text-indigo-300" />
                        </div>
                        <div>
                            <h1 className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400 leading-tight">
                                Dashboard Guru BK
                            </h1>
                            {userRole === 'SUPER_ADMIN' && <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-300 bg-indigo-900/50 px-2 py-0.5 rounded-sm">Mode Pratinjau Admin</span>}
                        </div>
                    </div>

                    {/* Bagian Kanan: Tombol Kembali (Jika Admin) dan Tombol Keluar */}
                    <div className="flex items-center gap-4">
                        {/* Jika Super Admin, tampilkan tombol kembali ke Dashboard Admin */}
                        {userRole === 'SUPER_ADMIN' && (
                            <Link href="/admin/dashboard" className="p-2 bg-white/5 hover:bg-white/20 border border-white/10 rounded-lg transition-colors group" title="Kembali ke Admin">
                                <ArrowLeft className="h-5 w-5 text-slate-300 group-hover:text-white" />
                            </Link>
                        )}

                        {/* Menggunakan Komponen Logout Ber-Dialog */}
                        <LogoutConfirmButton />
                    </div>

                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-8">

                {/* --- STATISTIK ATAS --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-sm font-bold text-slate-500 mb-1">Total Siswa Binaan</p>
                            <h3 className="text-4xl font-black text-slate-800">{totalStudents}</h3>
                        </div>
                        <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center relative z-10">
                            <Users size={28} />
                        </div>
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-50 rounded-full group-hover:scale-125 transition-transform duration-500 z-0 opacity-50" />
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-sm font-bold text-slate-500 mb-1">Partisipasi Asesmen</p>
                            <h3 className="text-4xl font-black text-slate-800">{assessedStudents}</h3>
                        </div>
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center relative z-10">
                            <Activity size={28} />
                        </div>
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-125 transition-transform duration-500 z-0 opacity-50" />
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-rose-200 shadow-sm flex items-center justify-between relative overflow-hidden group bg-linear-to-br from-white to-rose-50/50">
                        <div className="relative z-10">
                            <p className="text-sm font-bold text-rose-600 mb-1">Perlu Perhatian (Kritis)</p>
                            <h3 className="text-4xl font-black text-rose-700">{criticalStudentsCount}</h3>
                        </div>
                        <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center relative z-10 shadow-sm border border-rose-200">
                            <HeartPulse size={28} />
                        </div>
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-100 rounded-full group-hover:scale-125 transition-transform duration-500 z-0 opacity-50" />
                    </div>
                </div>

                {/* --- GRAFIK EMOSI KESELURUHAN --- */}
                <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Peta Emosi Siswa Keseluruhan</h3>
                            <p className="text-sm text-slate-500 mt-1">Berdasarkan data check-in terakhir yang dilakukan oleh siswa di sistem.</p>
                        </div>
                    </div>
                    <EmotionSummaryChart data={emotionStats} total={assessedStudents} />
                </section>

                {/* --- TABEL DAFTAR SISWA --- */}
                <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
                        <h2 className="text-lg font-bold text-slate-800 w-full sm:w-auto">Daftar Siswa Binaan</h2>

                        {/* Nantinya form ini akan dibuat Client Component untuk handle ketikan search, tapi secara UI kita siapkan dulu */}
                        <div className="flex w-full sm:w-auto items-center gap-3">
                            <form action="/bk/dashboard" method="GET" className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    name="search"
                                    type="text"
                                    defaultValue={searchQuery}
                                    placeholder="Cari nama atau NISN..."
                                    className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-xs transition-colors"
                                />
                            </form>
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors shrink-0 shadow-xs">
                                <Filter className="h-4 w-4" /> Kelas
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-white text-slate-500 font-bold border-b border-slate-200 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 w-16">No</th>
                                    <th className="px-6 py-4">Siswa</th>
                                    <th className="px-6 py-4">Kelas</th>
                                    <th className="px-6 py-4">Status Emosi (Terakhir)</th>
                                    <th className="px-6 py-4 text-right">Tindakan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {students.map((student, index) => {
                                    // Menghitung nomor urut otomatis
                                    const nomorUrut = (currentPage - 1) * limit + (index + 1);

                                    return (
                                        <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-slate-400">
                                                {nomorUrut}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-slate-800">{student.full_name}</p>
                                                <p className="text-xs text-slate-500 font-medium mt-0.5">NISN: {student.student_code}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
                                                    {student.class_name}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                {student.is_at_risk ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 animate-pulse">
                                                        <ShieldAlert className="h-3 w-3" /> Kritis
                                                    </span>
                                                ) : student.latest_emotion ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200">
                                                        <ShieldCheck className="h-3 w-3" /> Stabil
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-bold border border-slate-200">
                                                        Belum Check-in
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link href={`/bk/students/${student.id}`} className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors shadow-sm">
                                                    Detail Profil
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {students.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                            Belum ada data siswa yang ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* --- KOMPONEN PAGINATION REUSABLE --- */}
                    <Pagination currentPage={currentPage} totalPages={totalPages} />

                </section>
            </main>
        </div>
    );
}