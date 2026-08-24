// src/components/admin/AdminLogoutButton.tsx
'use client';

import { useState } from 'react';
import { LogOut, X, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function AdminLogoutButton() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogout = async () => {
        setIsLoading(true);
        try {
            const supabase = createClient();
            await supabase.auth.signOut();

            router.push('/login?tab=registered');
            router.refresh();
        } catch (error) {
            console.error('Gagal logout:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white rounded-lg transition-all duration-300 text-sm font-semibold"
            >
                <LogOut className="h-4 w-4" /> Keluar
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-999 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
                    {/* Komentar JSX diletakkan di dalam div agar tidak memicu error TypeScript */}
                    {/* z-999 dan fixed inset-0 memastikan efek blur menutupi seluruh layar */}
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 text-left whitespace-normal">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center text-rose-600">
                                <LogOut className="h-6 w-6" />
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <h3 className="text-xl font-black text-slate-800 mb-2">Keluar dari Admin?</h3>
                        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                            Sesi Anda akan diakhiri dan Anda harus masuk kembali menggunakan kredensial admin untuk mengakses panel ini.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setIsOpen(false)}
                                disabled={isLoading}
                                className="flex-1 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleLogout}
                                disabled={isLoading}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-rose-600/20"
                            >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ya, Keluar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}