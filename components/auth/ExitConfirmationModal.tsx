// Lokasi file: src/components/auth/ExitConfirmationModal.tsx
'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Save, LogOut, X, Key, User, Loader2 } from 'lucide-react';

interface ExitConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirmExit: () => void;
    onSaveAccount: (nisn: string, password: string) => Promise<void>;
}

export default function ExitConfirmationModal({ isOpen, onClose, onConfirmExit, onSaveAccount }: ExitConfirmationModalProps) {
    const [mode, setMode] = useState<'warning' | 'register'>('warning');
    const [nisn, setNisn] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) setMode('warning');
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onSaveAccount(nisn, password);
        } catch (error) {
            console.error("Gagal menyimpan", error);
        } finally {
            setIsLoading(false);
        }
    };

    const modalContent = (
        /* PERBAIKAN: Mengubah z-[9999] menjadi z-50 untuk menghilangkan warning linter */
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
                >
                    <X size={20} />
                </button>

                {mode === 'warning' ? (
                    <div className="p-8 text-center mt-2">
                        <div className="w-20 h-20 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <AlertTriangle size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-3">Tunggu Dulu!</h2>
                        <p className="text-slate-600 mb-8 leading-relaxed">
                            Progres tes potensi dan gaya belajarmu belum tersimpan secara permanen. Jika kamu keluar sekarang,
                            <span className="font-bold text-rose-500"> semua hasilmu akan terhapus oleh sistem.</span>
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={() => setMode('register')}
                                className="w-full py-3.5 px-4 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md shadow-teal-500/30"
                            >
                                <Save size={18} /> Simpan & Buat Akun Permanen
                            </button>
                            <button
                                onClick={onConfirmExit}
                                className="w-full py-3.5 px-4 bg-white border-2 border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-slate-600 font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                            >
                                <LogOut size={18} /> Keluar Tanpa Menyimpan
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-8">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Simpan Hasilmu</h2>
                            <p className="text-slate-500 text-sm">Buat akun agar kamu bisa melihat hasil tesmu kapan saja nanti.</p>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">NISN / Nomor Induk</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={nisn}
                                        onChange={(e) => setNisn(e.target.value)}
                                        placeholder="Contoh: 0012345678"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Kata Sandi Baru</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                        <Key size={18} />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Buat kata sandi minimal 6 karakter"
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setMode('warning')}
                                    className="px-4 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                                >
                                    Kembali
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading || nisn.length < 3 || password.length < 6}
                                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                    {isLoading ? 'Menyimpan...' : 'Simpan Akun'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}