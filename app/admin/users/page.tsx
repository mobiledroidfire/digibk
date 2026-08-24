// src/app/admin/users/page.tsx
import { Users, Activity, BookOpen, Settings } from 'lucide-react';
import Link from 'next/link';
import AdminLogoutButton from '@/components/admin/AdminLogoutButton';
import UserManagementTable from '@/components/admin/UserManagementTable';
import { fetchAllUsersWithAuth } from '@/features/admin/actions/admin.actions';

// TAMBAHKAN BARIS INI: Memaksa halaman dirender secara real-time (tanpa cache)
export const dynamic = 'force-dynamic';

export default async function UserManagementPage() {
    const { data: users } = await fetchAllUsersWithAuth();

    return (
        <div className="min-h-screen bg-slate-50/50 pb-16 font-sans">
            {/* HEADER SIMPEL */}
            <header className="bg-slate-900 text-white border-b border-slate-800 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <span className="font-bold text-xl tracking-tight">Super Admin Panel</span>
                    <AdminLogoutButton />
                </div>
            </header>

            {/* NAVIGASI MENU */}
            <div className="bg-white/70 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-30 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex space-x-8 overflow-x-auto">
                        <Link href="/admin/dashboard" className="flex items-center gap-2 py-4 border-b-2 border-transparent text-slate-500 hover:text-slate-800 font-medium text-sm whitespace-nowrap transition-colors">
                            <Activity size={18} /> Ringkasan Dasbor
                        </Link>
                        <Link href="/admin/users" className="flex items-center gap-2 py-4 border-b-2 border-blue-600 text-blue-600 font-bold text-sm whitespace-nowrap">
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

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Manajemen Pengguna</h1>
                        <p className="text-slate-500 mt-2 font-medium">Pantau aktivitas, IP Address, dan status keaktifan pengguna.</p>
                    </div>
                </div>

                <UserManagementTable users={users || []} />
            </main>
        </div>
    );
}