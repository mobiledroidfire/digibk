// Lokasi file: src/app/admin/dashboard/page.tsx
import { fetchAllUsersWithAuth } from '@/features/admin/actions/admin.actions';
import { ShieldAlert, Trash2, UserCog, User, Clock, CheckCircle2 } from 'lucide-react';
import DeleteUserButton from '@/components/admin/DeleteUserButton';

export default async function AdminDashboardPage() {
    const { success, data: users, error } = await fetchAllUsersWithAuth();

    if (!success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="p-6 bg-red-50 text-red-600 rounded-xl flex items-center gap-3">
                    <ShieldAlert /> <span className="font-bold">Gagal memuat data: {error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-16 font-sans">
            <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-20 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-rose-500 p-1.5 rounded-lg">
                            <UserCog className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">Super Admin Panel</span>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="mb-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Manajemen Pengguna</h1>
                        <p className="text-slate-500 mt-1">Pantau aktivitas pengguna dan bersihkan data akun tamu yang tidak aktif.</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm font-semibold text-slate-700">
                        Total: {users?.length || 0} Pengguna
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                                <tr>
                                    <th className="px-6 py-4 font-semibold">Nama / NISN</th>
                                    <th className="px-6 py-4 font-semibold">Status Akun</th>
                                    <th className="px-6 py-4 font-semibold">Peran</th>
                                    <th className="px-6 py-4 font-semibold">Terakhir Aktif</th>
                                    <th className="px-6 py-4 font-semibold text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users?.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-800">{u.full_name}</div>
                                            <div className="text-slate-500 text-xs mt-0.5">{u.nisn !== '-' ? `NISN: ${u.nisn}` : u.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {u.isGuest ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                                                    <Clock className="h-3 w-3" /> Tamu (Belum Disimpan)
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                                                    <CheckCircle2 className="h-3 w-3" /> Permanen
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-slate-600 font-medium px-2 py-1 bg-slate-100 rounded-md">
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
                                            {new Date(u.lastSignIn).toLocaleDateString('id-ID', {
                                                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {/* Kita panggil komponen tombol hapus */}
                                            <DeleteUserButton userId={u.id} userName={u.full_name} role={u.role} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {users?.length === 0 && (
                            <div className="p-8 text-center text-slate-500">Belum ada pengguna terdaftar.</div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}