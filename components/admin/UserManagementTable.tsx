// Lokasi file: /src/components/admin/UserManagementTable.tsx
'use client';

import { useState } from 'react';
import { Trash2, Clock, CheckCircle2, MonitorSmartphone, AlertTriangle, X, Loader2, ActivitySquare } from 'lucide-react';
import DeleteUserButton from '@/components/admin/DeleteUserButton';
import { deleteUsersAction, type UserDashboardData } from '@/features/admin/actions/admin.actions';
import Pagination from '@/components/ui/Pagination'; // <-- 1. Impor komponen Pagination

function getDaysDifference(lastSignInDate: string) {
    const lastDate = new Date(lastSignInDate);
    const now = new Date();
    lastDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(now.getTime() - lastDate.getTime());
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

// 2. Tambahkan currentPage dan totalPages ke dalam parameter (props)
interface UserManagementTableProps {
    users: UserDashboardData[];
    currentPage: number;
    totalPages: number;
}

export default function UserManagementTable({ users, currentPage, totalPages }: UserManagementTableProps) {
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [isBulkDeleting, setIsBulkDeleting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const selectableUsers = users.filter(u => u.role !== 'SUPER_ADMIN');

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedUsers(selectableUsers.map(u => u.id));
        } else {
            setSelectedUsers([]);
        }
    };

    const handleSelectOne = (id: string) => {
        if (selectedUsers.includes(id)) {
            setSelectedUsers(selectedUsers.filter(userId => userId !== id));
        } else {
            setSelectedUsers([...selectedUsers, id]);
        }
    };

    const handleOpenBulkDeleteModal = () => {
        setIsBulkModalOpen(true);
        setErrorMsg(null);
    };

    const executeBulkDelete = async () => {
        setIsBulkDeleting(true);
        setErrorMsg(null);

        try {
            const result = await deleteUsersAction(selectedUsers);
            if (!result.success) throw new Error(result.error);

            setIsBulkModalOpen(false);
            setSelectedUsers([]);
        } catch (error: unknown) {
            const exactError = error instanceof Error ? error.message : "Terjadi kesalahan sistem.";
            setErrorMsg(exactError);
        } finally {
            setIsBulkDeleting(false);
        }
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden relative">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50/80 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                        {selectedUsers.length} Terpilih
                    </span>
                    <span className="text-sm font-medium text-slate-500">
                        Total Data di Halaman Ini: {users.length}
                    </span>
                </div>
                {selectedUsers.length > 0 && (
                    <button
                        onClick={handleOpenBulkDeleteModal}
                        className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-rose-600/20 active:scale-95"
                    >
                        <Trash2 size={16} /> Hapus Data
                    </button>
                )}
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap">
                    {/* ... (Bagian thead dan tbody milikmu tetap SAMA PERSIS seperti sebelumnya) ... */}
                    <thead className="bg-white border-b border-slate-200 text-slate-500">
                        <tr>
                            <th className="px-5 py-4 text-center w-12">
                                <input
                                    type="checkbox"
                                    className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed w-4 h-4 transition-all"
                                    checked={selectedUsers.length === selectableUsers.length && selectableUsers.length > 0}
                                    onChange={handleSelectAll}
                                    disabled={selectableUsers.length === 0}
                                />
                            </th>
                            <th className="px-2 py-4 font-bold text-center w-12">No</th>
                            <th className="px-5 py-4 font-bold">Identitas Pengguna</th>
                            <th className="px-5 py-4 font-bold">Tipe Akun</th>
                            <th className="px-5 py-4 font-bold">Riwayat Aktivitas</th>
                            <th className="px-5 py-4 font-bold text-center">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {users.map((u, index) => {
                            const isSuperAdmin = u.role === 'SUPER_ADMIN';
                            const diffDays = getDaysDifference(u.lastSignIn);

                            let statusConfig = { text: 'Aktif Hari Ini', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
                            if (diffDays > 7) {
                                statusConfig = { text: `Tidak aktif ${diffDays} hari`, color: 'text-rose-600 bg-rose-50 border-rose-200' };
                            } else if (diffDays > 0) {
                                statusConfig = { text: `Aktif ${diffDays} hari lalu`, color: 'text-amber-600 bg-amber-50 border-amber-200' };
                            }

                            // 3. Modifikasi sedikit di bagian Nomor urut agar berlanjut di halaman berikutnya
                            const nomorUrut = (currentPage - 1) * 10 + (index + 1); // Asumsi 10 data per halaman

                            return (
                                <tr key={u.id} className={`hover:bg-slate-50/80 transition-colors ${selectedUsers.includes(u.id) ? 'bg-blue-50/50' : ''}`}>
                                    <td className="px-5 py-5 text-center">
                                        <input
                                            type="checkbox"
                                            className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-slate-100 w-4 h-4 transition-all"
                                            checked={selectedUsers.includes(u.id)}
                                            onChange={() => handleSelectOne(u.id)}
                                            disabled={isSuperAdmin}
                                        />
                                    </td>
                                    <td className="px-2 py-5 text-center text-slate-400 font-semibold">{nomorUrut}</td>
                                    <td className="px-5 py-5">
                                        <div className="font-black text-slate-800 text-base">{u.full_name}</div>
                                        <div className="text-slate-500 text-xs font-medium mt-1">{u.nisn !== '-' ? `NISN: ${u.nisn}` : u.email}</div>
                                    </td>
                                    <td className="px-5 py-5">
                                        <div className="flex flex-col items-start gap-2">
                                            {u.isGuest ? (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100/80 text-amber-700">
                                                    <Clock className="h-3.5 w-3.5" /> TAMU
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100/80 text-emerald-700">
                                                    <CheckCircle2 className="h-3.5 w-3.5" /> PERMANEN
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-5 py-5">
                                        <div className="flex flex-col gap-1.5">
                                            <div className="text-slate-700 font-bold text-sm flex items-center gap-2">
                                                {new Date(u.lastSignIn).toLocaleDateString('id-ID', {
                                                    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                                })}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${statusConfig.color} flex items-center gap-1`}>
                                                    <ActivitySquare size={10} /> {statusConfig.text}
                                                </span>
                                                <span className="flex items-center gap-1.5 text-[11px] text-slate-700 font-bold bg-slate-200/60 px-2.5 py-1 rounded-md border border-slate-300">
                                                    <MonitorSmartphone size={12} className="text-slate-500" />
                                                    {u.ip_address === '::1' ? '127.0.0.1 (Localhost)' : (u.ip_address || 'Tdk Terlacak')}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-5 text-center">
                                        <div className="flex justify-center">
                                            <DeleteUserButton userId={u.id} userName={u.full_name} role={u.role} />
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* 4. TAMPILKAN PAGINATION DI SINI, DI BAWAH TABEL */}
            <Pagination currentPage={currentPage} totalPages={totalPages} />

            {/* MODAL HAPUS MASSAL (Tetap sama) */}
            {isBulkModalOpen && (
                /* ... (kode modal hapus massalmu tetap SAMA PERSIS seperti sebelumnya) ... */
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 whitespace-normal text-left">
                        <div className="flex justify-between items-start mb-5">
                            <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 shadow-inner">
                                <AlertTriangle className="h-7 w-7" />
                            </div>
                            <button onClick={() => setIsBulkModalOpen(false)} disabled={isBulkDeleting} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 mb-2">Hapus {selectedUsers.length} Data?</h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6 font-medium">
                            Anda akan menghapus secara permanen <strong>{selectedUsers.length} pengguna</strong> terpilih. Semua riwayat, nilai, dan akses mereka tidak dapat dipulihkan.
                        </p>
                        {errorMsg && (
                            <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-bold flex items-start gap-2">
                                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                                <span>{errorMsg}</span>
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            <button type="button" disabled={isBulkDeleting} onClick={() => setIsBulkModalOpen(false)} className="flex-1 bg-slate-100 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-all text-sm">
                                Batal
                            </button>
                            <button type="button" disabled={isBulkDeleting} onClick={executeBulkDelete} className="flex-1 bg-rose-600 text-white font-bold py-3.5 rounded-xl hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/30 text-sm flex items-center justify-center gap-2">
                                {isBulkDeleting ? <><Loader2 className="h-5 w-5 animate-spin" /> Menghapus...</> : 'Ya, Hapus Permanen'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}