// src/app/admin/dashboard/page.tsx
import { ShieldAlert, UserCog, Users, BookOpen, Settings, Activity, Clock } from 'lucide-react';
import Link from 'next/link';
import AdminLogoutButton from '@/components/admin/AdminLogoutButton';
import { fetchAllUsersWithAuth } from '@/features/admin/actions/admin.actions';

// TAMBAHKAN BARIS INI: Memaksa halaman dirender secara real-time (tanpa cache)
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
    const { success, data: users, error } = await fetchAllUsersWithAuth();

    if (!success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="p-6 bg-rose-50 text-rose-600 rounded-xl flex items-center gap-3 shadow-sm border border-rose-100">
                    <ShieldAlert /> <span className="font-bold">Gagal memuat data: {error}</span>
                </div>
            </div>
        );
    }

    const totalUsers = users?.length || 0;
    const guestUsers = users?.filter(u => u.isGuest).length || 0;
    const permanentUsers = totalUsers - guestUsers;

    return (
        <div className="min-h-screen bg-slate-50/50 pb-16 font-sans selection:bg-blue-500/30">
            {/* PERBAIKAN: Menambahkan z-50 di header agar selalu berada di lapisan paling atas */}
            <header className="relative z-50 bg-slate-900 text-white overflow-hidden shadow-2xl shadow-slate-900/20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3" />
                <div className="absolute bottom-0 left-0 w-72 h-72 bg-rose-500/20 rounded-full blur-[80px] -translate-x-1/3 translate-y-1/3" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 backdrop-blur-md p-2 rounded-xl border border-white/10 shadow-inner">
                            <UserCog className="h-6 w-6 text-blue-300" />
                        </div>
                        <div>
                            <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white to-slate-400">
                                Super Admin Panel
                            </span>
                        </div>
                    </div>
                    <AdminLogoutButton />
                </div>
            </header>

            {/* NAVIGASI MENU MODERN */}
            <div className="bg-white/70 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-30 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8 overflow-x-auto">
                        <Link href="/admin/dashboard" className="flex items-center gap-2 py-4 border-b-2 border-blue-600 text-blue-600 font-bold text-sm whitespace-nowrap">
                            <Activity size={18} /> Ringkasan Dasbor
                        </Link>
                        <Link href="/admin/users" className="flex items-center gap-2 py-4 border-b-2 border-transparent text-slate-500 hover:text-slate-800 font-medium text-sm whitespace-nowrap transition-colors">
                            <Users size={18} /> Manajemen Pengguna
                        </Link>
                        <Link href="/bk/dashboard" className="flex items-center gap-2 py-4 border-b-2 border-transparent text-slate-500 hover:text-slate-800 font-medium text-sm whitespace-nowrap transition-colors">
                            <BookOpen size={18} /> Panel Guru BK
                        </Link>
                        <Link href="#" className="flex items-center gap-2 py-4 border-b-2 border-transparent text-slate-500 hover:text-slate-800 font-medium text-sm whitespace-nowrap transition-colors">
                            <Settings size={18} /> Pengaturan Sistem
                        </Link>
                    </nav>
                </div>
            </div>

            {/* KONTEN OVERVIEW */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">Selamat Datang, Admin</h1>
                    <p className="text-slate-500 mt-2 font-medium">Berikut adalah ringkasan sistem DIGIBK hari ini.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute -right-6 -top-6 w-32 h-32 bg-blue-50 rounded-full group-hover:scale-110 transition-transform duration-500" />
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-500 mb-1">Total Pengguna</p>
                                <h3 className="text-4xl font-black text-slate-800">{totalUsers}</h3>
                            </div>
                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                                <Users size={28} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-50 rounded-full group-hover:scale-110 transition-transform duration-500" />
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-500 mb-1">Akun Permanen</p>
                                <h3 className="text-4xl font-black text-slate-800">{permanentUsers}</h3>
                            </div>
                            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                                <ShieldAlert size={28} />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
                        <div className="absolute -right-6 -top-6 w-32 h-32 bg-amber-50 rounded-full group-hover:scale-110 transition-transform duration-500" />
                        <div className="relative z-10 flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-slate-500 mb-1">Akun Tamu (Guest)</p>
                                <h3 className="text-4xl font-black text-slate-800">{guestUsers}</h3>
                            </div>
                            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                                <Clock size={28} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}