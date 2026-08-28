// Lokasi file: src/components/student/EmotionFeedbackModal.tsx
'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, ShieldAlert, X, HeartHandshake, ArrowRight, RefreshCcw } from 'lucide-react';
import type { EmotionType } from '@/features/student/types/emotion.types';
import { getEmotionLabelWithEmoji, getEmotionConfig } from '@/lib/rules/emotion.rules';

interface EmotionFeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: 'success' | 'error';
    title?: string;
    message?: string;
    submittedData?: {
        emotion: EmotionType;
        intensity: number;
        isCritical: boolean;
    } | null;
    onGoToDashboard?: () => void;
}

export default function EmotionFeedbackModal({
    isOpen,
    onClose,
    type,
    title,
    message,
    submittedData,
    onGoToDashboard
}: EmotionFeedbackModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!isOpen || !mounted) return null;

    const emotionConfig = submittedData ? getEmotionConfig(submittedData.emotion) : null;
    const isCritical = submittedData?.isCritical;

    const modalContent = (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-300 border border-slate-100">
                
                {/* Tombol Tutup Silang */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
                    aria-label="Tutup"
                >
                    <X size={20} />
                </button>

                {type === 'success' ? (
                    <div className="p-8 sm:p-10 text-center flex flex-col items-center">
                        {/* Avatar / Icon Sukses dengan Nuansa Elegan */}
                        <div className="relative mb-5">
                            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center shadow-inner ring-8 ring-emerald-50">
                                <CheckCircle2 size={42} strokeWidth={2.5} />
                            </div>
                            <span className="absolute -bottom-2 -right-2 text-2xl animate-bounce">
                                ✨
                            </span>
                        </div>

                        <h2 className="text-2xl font-black text-slate-800 mb-2">
                            {title || 'Refleksi Emosi Tersimpan!'}
                        </h2>
                        <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                            {message || 'Terima kasih sudah jujur dengan perasaanmu. Setiap emosi yang kamu sadari adalah langkah awal untuk bertumbuh.'}
                        </p>

                        {/* Kartu Ringkasan Data yang Baru Saja Di-submit */}
                        {submittedData && emotionConfig && (
                            <div className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-6 text-left space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Perasaanmu</span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-700 shadow-2xs">
                                        <span className="text-base">{emotionConfig.emoji}</span>
                                        <span>{emotionConfig.label}</span>
                                    </span>
                                </div>

                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Intensitas</span>
                                    <span className="text-xs font-black text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-md">
                                        {submittedData.intensity} / 10
                                    </span>
                                </div>

                                {isCritical && (
                                    <div className="pt-2 border-t border-slate-200/60 flex items-start gap-2 text-rose-700 bg-rose-50/80 -mx-4 -mb-4 p-3 rounded-b-2xl">
                                        <HeartHandshake className="h-4 w-4 shrink-0 mt-0.5 text-rose-500" />
                                        <p className="text-xs font-medium leading-tight">
                                            Notifikasi telah diteruskan ke Guru BK agar kamu bisa mendapat ruang bercerita yang aman.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tombol Aksi */}
                        <div className="w-full space-y-2.5">
                            <button
                                onClick={onClose}
                                className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 text-sm"
                            >
                                Selesai & Lanjut Check-In
                            </button>
                            {onGoToDashboard && (
                                <button
                                    onClick={onGoToDashboard}
                                    className="w-full py-3 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors text-sm"
                                >
                                    <span>Ke Dashboard Siswa</span>
                                    <ArrowRight size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    /* TAMPILAN ERROR / GAGAL */
                    <div className="p-8 sm:p-10 text-center flex flex-col items-center">
                        <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-3xl flex items-center justify-center mb-5 shadow-inner ring-8 ring-rose-50">
                            <ShieldAlert size={40} />
                        </div>

                        <h2 className="text-2xl font-bold text-slate-800 mb-2">
                            {title || 'Gagal Menyimpan'}
                        </h2>
                        <p className="text-slate-600 text-sm mb-8 leading-relaxed">
                            {message || 'Terjadi kendala saat menyimpan refleksi emosi. Silakan periksa koneksi atau coba beberapa saat lagi.'}
                        </p>

                        <button
                            onClick={onClose}
                            className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md text-sm"
                        >
                            <RefreshCcw size={16} />
                            <span>Coba Lagi</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}
