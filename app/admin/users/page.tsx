// Lokasi file: /src/app/admin/users/page.tsx
import { Users, Activity, BookOpen, Settings, UserCog } from 'lucide-react';
import Link from 'next/link';
import AdminLogoutButton from '@/components/admin/AdminLogoutButton';
import UserManagementTable from '@/components/admin/UserManagementTable';
import { fetchAllUsersWithAuth } from '@/features/admin/actions/admin.actions';

// Memaksa halaman dirender secara real-time (tanpa cache)
export const dynamic = 'force-dynamic';

// 1. Tambahkan tipe untuk menerima parameter URL (searchParams)
interface UserManagementPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function UserManagementPage({ searchParams }: UserManagementPageProps) {
    // 2. Baca parameter halaman dari URL (misal: ?page=2)
    const resolvedParams = await searchParams;
    const currentPage = Number(resolvedParams?.page) || 1;
    const limit = 10; // Jumlah data per halaman yang ingin ditampilkan

    // 3. Ambil data pengguna dari database
    const { data: allUsers } = await fetchAllUsersWithAuth();
    const users = allUsers || [];

    // 4. Logika Paginasi (Memotong data sesuai halaman)
    const totalPages = Math.ceil(users.length / limit);
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;

    // Data yang hanya ditampilkan di halaman saat ini
    const paginatedUsers = users.slice(startIndex, endIndex);

    return (
        <div className="min-h-screen bg-slate-50/50 pb-16 font-sans">
            {/* HEADER SIMPEL */}
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

                {/* PERBAIKAN: Penulisan props tanpa tanda kutip ganda */}
                <UserManagementTable
                    users={paginatedUsers}
                    currentPage={currentPage}
                    totalPages={totalPages}
                />
            </main>
        </div>
    );
}