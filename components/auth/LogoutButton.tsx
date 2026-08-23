// src/components/auth/LogoutButton.tsx
'use client';

import { useState } from 'react';
import { LogOut, AlertTriangle, X } from 'lucide-react';
import { logoutAction } from '@/features/auth/actions/auth.actions';

export default function LogoutButton() {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            {/* Tombol Pemicu Pop-up */}
            <button
                type="button"
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-red-600 transition-all duration-300 bg-slate-100 hover:bg-red-50 px-4 py-2.5 rounded-xl hover:shadow-md hover:shadow-red-500/20 hover:-translate-y-0.5"
            >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Keluar</span>
            </button>

            {/* Pop-up Modal Konfirmasi */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        {/* Header Modal */}
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
                                <AlertTriangle className="h-6 w-6 text-red-500" />
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Konten Modal */}
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Yakin ingin keluar?</h3>
                        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                            Sesi Anda akan diakhiri. Anda harus masuk kembali (login) untuk melanjutkan aktivitas.
                        </p>

                        {/* Tombol Aksi Modal */}
                        <div className="flex gap-3 w-full">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
                            >
                                Batal
                            </button>
                            <form action={logoutAction} className="flex-1">
                                <button
                                    type="submit"
                                    className="w-full px-4 py-3 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/30 hover:-translate-y-0.5 transition-all"
                                >
                                    Ya, Keluar
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}