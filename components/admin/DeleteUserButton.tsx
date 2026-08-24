// src/components/admin/DeleteUserButton.tsx
'use client';

import { useState } from 'react';
import { Trash2, Loader2, AlertTriangle, X } from 'lucide-react';
// PERBAIKAN: Impor fungsi SSOT
import { deleteUsersAction } from '@/features/admin/actions/admin.actions';

interface Props {
    userId: string;
    userName: string;
    role: string;
}

export default function DeleteUserButton({ userId, userName, role }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleOpenModal = () => {
        if (role === 'SUPER_ADMIN') {
            alert('Anda tidak bisa menghapus sesama Super Admin dari sini.');
            return;
        }
        setIsOpen(true);
        setErrorMsg(null);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        setErrorMsg(null);

        try {
            // PERBAIKAN: Memanggil SSOT dengan membungkus userId dalam array
            const result = await deleteUsersAction([userId]);
            if (result.success) {
                setIsOpen(false);
            } else {
                setErrorMsg(result.error || 'Gagal menghapus pengguna.');
            }
        } catch (error) {
            // Penanganan error tanpa 'any'
            const exactError = error instanceof Error ? error.message : "Terjadi kesalahan yang tidak diketahui.";
            setErrorMsg(exactError);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <button
                onClick={handleOpenModal}
                disabled={role === 'SUPER_ADMIN'}
                className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed mx-auto block"
                title="Hapus Pengguna & Datanya"
            >
                <Trash2 className="h-5 w-5" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 whitespace-normal text-left">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500">
                                <AlertTriangle className="h-6 w-6" />
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                disabled={isDeleting}
                                className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <h3 className="text-xl font-black text-slate-900 mb-2">Hapus Pengguna Ini?</h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-6">
                            Anda akan menghapus <strong className="text-slate-800">"{userName}"</strong>. Tindakan ini bersifat permanen.
                        </p>

                        {errorMsg && (
                            <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium">
                                {errorMsg}
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={() => setIsOpen(false)}
                                className="flex-1 bg-slate-100 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-200 transition-all text-sm"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                disabled={isDeleting}
                                onClick={handleConfirmDelete}
                                className="flex-1 bg-rose-600 text-white font-bold py-3.5 rounded-xl hover:bg-rose-500 transition-all shadow-lg shadow-rose-600/30 text-sm flex items-center justify-center gap-2"
                            >
                                {isDeleting ? (
                                    <><Loader2 className="h-4 w-4 animate-spin" /> Menghapus...</>
                                ) : (
                                    'Ya, Hapus Permanen'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}