// Lokasi file: /src/app/bk/dashboard/page.tsx
import React from 'react';
import Link from 'next/link';
import {
    Users, ShieldAlert, BookOpen, Activity,
    Search, HeartPulse, ShieldCheck, ArrowLeft, BarChart3, PieChart
} from 'lucide-react';
import { getBkDashboardDataAction } from '@/features/bk/actions/dashboard.actions';
import { getVarkClassStatsAction, getRiasecClassStatsAction } from '@/features/bk/actions/class-stats.actions';
import EmotionSummaryChart from '@/components/charts/EmotionSummaryChart';
import Pagination from '@/components/ui/Pagination';
import LogoutConfirmButton from '@/components/admin/AdminLogoutButton';
import VarkPieChart from '@/features/bk/components/VarkPieChart';
import RiasecBarChart from '@/features/bk/components/RiasecBarChart';
import ClassSelector from '@/features/bk/components/ClassSelector';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

interface BkDashboardProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BkDashboardPage({ searchParams }: BkDashboardProps) {
    const resolvedParams = await searchParams;
    const currentPage = Number(resolvedParams?.page) || 1;
    const searchQuery = typeof resolvedParams?.search === 'string' ? resolvedParams.search : '';
    const selectedClassId = typeof resolvedParams?.class === 'string' ? resolvedParams.class : '';
    const limit = 10;

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    const { data: roleData } = await supabase.from('user_roles').select('role, school_id').eq('user_id', user?.id).single();

    let classesQuery = supabase.from('classes').select('id, name').order('name');

    if (roleData?.role !== 'SUPER_ADMIN' && roleData?.school_id) {
        classesQuery = classesQuery.eq('school_id', roleData.school_id);
    }

    const { data: classesData } = await classesQuery;
    const availableClasses = classesData || [];
    const activeClassId = selectedClassId || (availableClasses.length > 0 ? availableClasses[0].id : '');

    const { success, data, error } = await getBkDashboardDataAction(currentPage, limit, searchQuery, activeClassId);

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

    // AMBIL DATA KEDUA GRAFIK SECARA PARALEL (Lebih Cepat)
    const [varkStats, riasecStats] = await Promise.all([
        activeClassId ? getVarkClassStatsAction(activeClassId) : Promise.resolve(null),
        activeClassId ? getRiasecClassStatsAction(activeClassId) : Promise.resolve(null)
    ]);

    return (
        <div className="min-h-screen bg-slate-50/50 pb-16 font-sans">
            {/* --- HEADER --- */}
            <header className="relative z-40 bg-slate-900 text-white overflow-hidden shadow-xl shadow-slate-900/10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between z-10">
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
                    <div className="flex items-center gap-4">
                        {userRole === 'SUPER_ADMIN' && (
                            <Link href="/admin/dashboard" className="p-2 bg-white/5 hover:bg-white/20 border border-white/10 rounded-lg transition-colors group" title="Kembali ke Admin">
                                <ArrowLeft className="h-5 w-5 text-slate-300 group-hover:text-white" />
                            </Link>
                        )}
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
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between relative overflow-hidden group">
                        <div className="relative z-10">
                            <p className="text-sm font-bold text-slate-500 mb-1">Partisipasi Asesmen</p>
                            <h3 className="text-4xl font-black text-slate-800">{assessedStudents}</h3>
                        </div>
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center relative z-10">
                            <Activity size={28} />
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-rose-200 shadow-sm flex items-center justify-between relative overflow-hidden group bg-linear-to-br from-white to-rose-50/50">
                        <div className="relative z-10">
                            <p className="text-sm font-bold text-rose-600 mb-1">Perlu Perhatian (Kritis)</p>
                            <h3 className="text-4xl font-black text-rose-700">{criticalStudentsCount}</h3>
                        </div>
                        <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center relative z-10 shadow-sm border border-rose-200">
                            <HeartPulse size={28} />
                        </div>
                    </div>
                </div>

                {/* --- ANALISIS KELAS (GRAFIK VARK & RIASEC) --- */}
                <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-indigo-500" /> Analisis Asesmen Kelas
                            </h3>
                            <p className="text-sm text-slate-500 mt-1">Pilih kelas untuk melihat mayoritas gaya belajar (VARK) dan minat (RIASEC).</p>
                        </div>
                        <ClassSelector classes={availableClasses} selectedClassId={activeClassId} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* KOTAK GRAFIK VARK */}
                        <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-6">
                                <PieChart className="h-4 w-4 text-slate-400" />
                                <h4 className="font-bold text-slate-700 text-sm">Distribusi Gaya Belajar (VARK)</h4>
                            </div>
                            {varkStats?.success && varkStats.data ? (
                                <VarkPieChart data={varkStats.data} />
                            ) : (
                                <div className="flex items-center justify-center h-64">
                                    <p className="text-slate-400 text-sm">{varkStats?.error || 'Tidak ada data.'}</p>
                                </div>
                            )}
                        </div>

                        {/* KOTAK GRAFIK RIASEC */}
                        <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-5">
                            <div className="flex items-center gap-2 mb-6">
                                <BarChart3 className="h-4 w-4 text-slate-400" />
                                <h4 className="font-bold text-slate-700 text-sm">Distribusi Minat Karier (RIASEC)</h4>
                            </div>
                            {riasecStats?.success && riasecStats.data ? (
                                <RiasecBarChart data={riasecStats.data} />
                            ) : (
                                <div className="flex items-center justify-center h-64">
                                    <p className="text-slate-400 text-sm">{riasecStats?.error || 'Tidak ada data.'}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* --- GRAFIK EMOSI KESELURUHAN --- */}
                <section className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-800">Peta Emosi Siswa Keseluruhan</h3>
                        <p className="text-sm text-slate-500 mt-1">Berdasarkan data check-in terakhir yang dilakukan oleh siswa di sistem.</p>
                    </div>
                    <EmotionSummaryChart data={emotionStats} total={assessedStudents} />
                </section>

                {/* --- TABEL DAFTAR SISWA --- */}
                <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
                        <h2 className="text-lg font-bold text-slate-800 w-full sm:w-auto">Daftar Siswa Binaan</h2>
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
                                {activeClassId && <input type="hidden" name="class" value={activeClassId} />}
                            </form>
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
                                    const nomorUrut = (currentPage - 1) * limit + (index + 1);
                                    return (
                                        <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-slate-400">{nomorUrut}</td>
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
                    <Pagination currentPage={currentPage} totalPages={totalPages} />
                </section>
            </main>
        </div>
    );
}