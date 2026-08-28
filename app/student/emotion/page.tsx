// Lokasi file: /src/app/student/emotion/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { submitEmotionAction, getEmotionHistoryAction } from '@/features/student/actions/emotion.actions';
import type { EmotionType, EmotionalCheckinHistory } from '@/features/student/types/emotion.types';
import {
    ArrowLeft, Heart, Loader2, ShieldAlert,
    Clock, Activity, MessageSquareHeart, ChevronLeft, ChevronRight, CalendarDays,
    Sparkles
} from 'lucide-react';
import {
    EMOTION_CONFIG,
    type EmotionMeta
} from '@/lib/constants/emotion.constants';
import {
    isAtRisk as checkRisk,
    getEmotionLabel,
    getEmotionEmoji,
    getEmotionConfig
} from '@/lib/rules/emotion.rules';
import { formatIndonesianDate } from '@/lib/utils/date.utils';
import EmotionFeedbackModal from '@/components/student/EmotionFeedbackModal';

const emotionKeys = Object.keys(EMOTION_CONFIG) as EmotionType[];
const ITEMS_PER_PAGE = 5;

export default function EmotionCheckinPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // State Riwayat & Pagination
    const [history, setHistory] = useState<EmotionalCheckinHistory[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);

    // State Form
    const [emotion, setEmotion] = useState<EmotionType>('NEUTRAL');
    const [intensity, setIntensity] = useState<number>(5);
    const [context, setContext] = useState<string>('');
    const [copingResponse, setCopingResponse] = useState<string>('');
    const [wantsToTalk, setWantsToTalk] = useState<boolean>(false);

    // State Modal Feedback Modern
    const [modalState, setModalState] = useState<{
        isOpen: boolean;
        type: 'success' | 'error';
        title?: string;
        message?: string;
        submittedData?: {
            emotion: EmotionType;
            intensity: number;
            isCritical: boolean;
        } | null;
    }>({
        isOpen: false,
        type: 'success',
        submittedData: null
    });

    // Ambil riwayat setiap kali `currentPage` berubah
    const fetchHistory = async (page: number) => {
        setIsLoadingHistory(true);
        const { data, total } = await getEmotionHistoryAction(page, ITEMS_PER_PAGE);
        setHistory(data);
        setTotalRecords(total);
        setIsLoadingHistory(false);
    };

    useEffect(() => {
        fetchHistory(currentPage);
    }, [currentPage]);

    // Menggunakan Rule Engine: Emosi berisiko dengan intensitas >= threshold
    const isCritical = checkRisk(emotion, intensity);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const currentSubmittedData = {
            emotion,
            intensity,
            isCritical
        };

        const res = await submitEmotionAction({
            emotion,
            intensity,
            context,
            coping_response: copingResponse,
            help_seeking: '',
            wants_to_talk: wantsToTalk || isCritical,
        });

        setIsLoading(false);

        if (res.success) {
            // Reset form
            setEmotion('NEUTRAL');
            setIntensity(5);
            setContext('');
            setCopingResponse('');
            setWantsToTalk(false);

            // Buka Modal Sukses Modern
            setModalState({
                isOpen: true,
                type: 'success',
                title: 'Refleksi Emosi Tersimpan! 🎉',
                message: 'Terima kasih sudah meluangkan waktu untuk mengenali perasaanmu hari ini.',
                submittedData: currentSubmittedData
            });

            // Refresh riwayat ke halaman 1
            setCurrentPage(1);
            fetchHistory(1);
        } else {
            // Buka Modal Error Modern
            setModalState({
                isOpen: true,
                type: 'error',
                title: 'Gagal Menyimpan Refleksi',
                message: res.error || 'Terjadi kesalahan sistem saat menyimpan refleksi emosi.',
                submittedData: null
            });
        }
    };

    const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE);
    const activeEmotionMeta: EmotionMeta = getEmotionConfig(emotion);

    // Helper untuk warna dinamis slider berdasarkan intensitas (Lebih interaktif & menarik)
    const getIntensityTheme = (val: number) => {
        if (val <= 3) {
            return {
                color: '#10b981', // emerald
                badge: 'bg-emerald-500 text-white',
                label: 'Ringan & Terkendali',
                accent: 'accent-emerald-500'
            };
        }
        if (val <= 6) {
            return {
                color: '#3b82f6', // blue
                badge: 'bg-blue-600 text-white',
                label: 'Sedang / Cukup Terasa',
                accent: 'accent-blue-600'
            };
        }
        if (val <= 8) {
            return {
                color: '#f59e0b', // amber
                badge: 'bg-amber-500 text-white',
                label: 'Kuat & Perlu Perhatian',
                accent: 'accent-amber-500'
            };
        }
        return {
            color: '#f43f5e', // rose
            badge: 'bg-rose-600 text-white animate-pulse',
            label: 'Sangat Kuat / Luar Biasa',
            accent: 'accent-rose-600'
        };
    };

    const intensityTheme = getIntensityTheme(intensity);
    const sliderPercentage = ((intensity - 1) / 9) * 100;

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">

            {/* MODAL FEEDBACK MODERN (PENGGANTI ALERT JADUL) */}
            <EmotionFeedbackModal
                isOpen={modalState.isOpen}
                onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
                type={modalState.type}
                title={modalState.title}
                message={modalState.message}
                submittedData={modalState.submittedData}
                onGoToDashboard={() => router.push('/student/dashboard')}
            />

            <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-4 shadow-sm">
                <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-rose-500/20 p-1.5 rounded-lg border border-rose-500/30">
                            <Heart className="h-5 w-5 text-rose-400" />
                        </div>
                        <h1 className="text-xl font-bold text-white tracking-tight hidden sm:block">Kelola Emosi</h1>
                        <h1 className="text-lg font-bold text-white tracking-tight sm:hidden">Emosi</h1>
                    </div>
                    <Link href="/student/dashboard" className="inline-flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium">
                        <ArrowLeft className="h-4 w-4" /> Kembali
                    </Link>
                </div>
            </header>

            <div className="bg-slate-900 pt-8 pb-24 px-4 sm:px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold mb-3">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>Jurus 2: Asesmen Reflektif</span>
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Kelola & Petakan Emosimu</h2>
                    <p className="text-slate-400">Bagaimana perasaanmu hari ini? Kenali, akui, dan kelola bersama.</p>
                </div>
            </div>

            {/* --- LAYOUT GRID --- */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 -mt-14 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* BAGIAN KIRI: FORM CHECK-IN (Lebar 7 Kolom) */}
                    <div className="lg:col-span-7 space-y-6">
                        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 h-full">
                            <form onSubmit={handleSubmit} className="space-y-8">

                                {/* PILIHAN EMOTICON / EMOSI */}
                                <div>
                                    <label className="text-sm font-bold text-slate-700 mb-4 flex items-center justify-between">
                                        <span className="flex items-center gap-2">
                                            <Activity className="h-4 w-4 text-rose-500" /> Apa yang paling kamu rasakan saat ini?
                                        </span>
                                        <span className="text-xs font-semibold text-slate-400">Pilih 1 emosi</span>
                                    </label>

                                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                                        {emotionKeys.map((emoKey) => {
                                            const meta = EMOTION_CONFIG[emoKey];
                                            const isSelected = emotion === emoKey;

                                            return (
                                                <button
                                                    key={emoKey}
                                                    type="button"
                                                    onClick={() => setEmotion(emoKey)}
                                                    className={`px-3 py-3 rounded-2xl text-xs font-bold transition-all border flex flex-col items-center justify-center gap-1.5 active:scale-95 ${isSelected
                                                        ? `${meta.activeClass} scale-102 ring-2 ring-offset-2 ring-slate-900/10`
                                                        : 'bg-slate-50/70 text-slate-600 border-slate-200 hover:bg-white hover:border-slate-300 hover:shadow-xs'
                                                        }`}
                                                >
                                                    <span className="text-2xl transition-transform transform group-hover:scale-110">
                                                        {meta.emoji}
                                                    </span>
                                                    <span className="tracking-tight">{meta.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {isCritical && (
                                    <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex gap-3 animate-in fade-in slide-in-from-top-2">
                                        <ShieldAlert className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-bold text-rose-800 flex items-center gap-1.5">
                                                <span>Kami menyadari perasaanmu</span>
                                                <span>{activeEmotionMeta.emoji}</span>
                                            </h4>
                                            <p className="text-xs sm:text-sm text-rose-700 mt-1 leading-relaxed">
                                                Merasa <span className="font-bold">{activeEmotionMeta.label.toLowerCase()}</span> yang mendalam adalah hal yang wajar. Sistem akan otomatis memberi notifikasi ke Guru BK agar kamu mendapat dukungan dan ruang bercerita yang aman.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <hr className="border-slate-100" />

                                {/* SLIDER INTENSITAS DINAMIS & BERWARNA */}
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <label className="text-sm font-bold text-slate-700 block">
                                                Seberapa kuat perasaan itu?
                                            </label>
                                            <span className="text-xs font-medium text-slate-500">
                                                Tingkat: <span className="font-bold" style={{ color: intensityTheme.color }}>{intensityTheme.label}</span>
                                            </span>
                                        </div>
                                        <span className={`inline-flex items-center gap-1 px-3.5 py-1 rounded-full text-xs font-black transition-all shadow-xs ${intensityTheme.badge}`}>
                                            <span>Skala {intensity}</span>
                                            <span className="text-[10px] opacity-80">/ 10</span>
                                        </span>
                                    </div>

                                    <div className="relative pt-1 pb-1">
                                        <input
                                            type="range"
                                            min="1"
                                            max="10"
                                            value={intensity}
                                            onChange={(e) => setIntensity(Number(e.target.value))}
                                            style={{
                                                background: `linear-gradient(to right, ${intensityTheme.color} 0%, ${intensityTheme.color} ${sliderPercentage}%, #e2e8f0 ${sliderPercentage}%, #e2e8f0 100%)`
                                            }}
                                            className={`w-full h-3 rounded-full appearance-none cursor-pointer transition-all ${intensityTheme.accent}`}
                                        />
                                    </div>

                                    <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                                        <span className={intensity <= 3 ? 'text-emerald-600 font-bold' : ''}>1 (Ringan)</span>
                                        <span className={intensity >= 4 && intensity <= 6 ? 'text-blue-600 font-bold' : ''}>5 (Sedang)</span>
                                        <span className={intensity >= 7 && intensity <= 8 ? 'text-amber-600 font-bold' : ''}>8 (Kuat)</span>
                                        <span className={intensity >= 9 ? 'text-rose-600 font-bold' : ''}>10 (Sangat Kuat)</span>
                                    </div>
                                </div>

                                {/* PENYEBAB / KONTEKS */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Apa yang menyebabkan kamu merasa seperti itu? <span className="text-rose-500">*</span>
                                    </label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={context}
                                        onChange={(e) => setContext(e.target.value)}
                                        className="w-full p-3.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all placeholder:text-slate-400"
                                        placeholder="Ceritakan sedikit kejadian atau hal yang memicunya..."
                                    />
                                </div>

                                {/* RESPONS / USAHA */}
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Apa yang sudah atau akan kamu lakukan untuk menghadapinya? <span className="text-rose-500">*</span>
                                    </label>
                                    <textarea
                                        required
                                        rows={2}
                                        value={copingResponse}
                                        onChange={(e) => setCopingResponse(e.target.value)}
                                        className="w-full p-3.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-400 transition-all placeholder:text-slate-400"
                                        placeholder="Misal: menarik napas dalam, mendengarkan musik, beristirahat sejenak, atau berbicara dengan teman..."
                                    />
                                </div>

                                {/* CEKLIS KONSULTASI BK */}
                                <div className="flex items-center gap-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                                    <input
                                        type="checkbox"
                                        id="talk"
                                        checked={wantsToTalk || isCritical}
                                        disabled={isCritical}
                                        onChange={(e) => setWantsToTalk(e.target.checked)}
                                        className="h-5 w-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
                                    />
                                    <label htmlFor="talk" className={`text-sm font-medium flex gap-2 items-center cursor-pointer ${isCritical ? 'text-indigo-900/70' : 'text-indigo-900'}`}>
                                        <MessageSquareHeart className="h-4 w-4 shrink-0 text-indigo-500" />
                                        <span>Saya ingin membicarakan hal ini lebih lanjut dengan Guru BK.</span>
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading || !context.trim() || !copingResponse.trim()}
                                    className="w-full py-4 bg-slate-900 text-white text-sm font-bold rounded-2xl transition-all hover:bg-slate-800 active:scale-99 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-md shadow-slate-900/10"
                                >
                                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                    <span>{isLoading ? 'Menyimpan Refleksi...' : 'Simpan Refleksi Emosi'}</span>
                                </button>
                            </form>
                        </section>
                    </div>

                    {/* BAGIAN KANAN: RIWAYAT CHECK-IN (Lebar 5 Kolom) */}
                    <div className="lg:col-span-5 space-y-6">
                        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 flex flex-col h-full">
                            <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center justify-between border-b border-slate-100 pb-3">
                                <span className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-slate-400" /> Riwayat Emosi
                                </span>
                                <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md">
                                    {totalRecords} Catatan
                                </span>
                            </h3>

                            {isLoadingHistory ? (
                                <div className="flex-1 flex flex-col items-center justify-center py-10">
                                    <Loader2 className="h-6 w-6 text-indigo-500 animate-spin mb-2" />
                                    <p className="text-sm text-slate-500">Memuat riwayat...</p>
                                </div>
                            ) : history.length === 0 ? (
                                <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border border-slate-200/60 border-dashed space-y-2">
                                    <span className="text-3xl">🌱</span>
                                    <p className="text-sm font-bold text-slate-700">Belum ada catatan emosi</p>
                                    <p className="text-xs text-slate-400">
                                        Mulai isi form di sebelah kiri untuk mencatat refleksi emosimu hari ini.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4 flex-1">
                                    {history.map((entry, index) => {
                                        const itemNumber = (currentPage - 1) * ITEMS_PER_PAGE + (index + 1);
                                        const emoji = getEmotionEmoji(entry.emotion);
                                        const label = getEmotionLabel(entry.emotion);

                                        return (
                                            <div
                                                key={entry.id}
                                                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:border-slate-200 hover:bg-white transition-all shadow-2xs"
                                            >
                                                <div className="flex justify-between items-center mb-2.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-black text-slate-300">#{itemNumber}</span>
                                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white border border-slate-200 text-slate-800 text-xs font-bold rounded-lg shadow-2xs">
                                                            <span>{emoji}</span>
                                                            <span>{label}</span>
                                                        </span>
                                                        <span className="text-xs text-slate-600 font-bold bg-slate-200/60 px-2 py-0.5 rounded-md">
                                                            {entry.intensity}/10
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1.5 mb-3 text-[11px] font-medium text-slate-400">
                                                    <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                                                    <span>{formatIndonesianDate(entry.created_at)}</span>
                                                </div>

                                                <div className="space-y-2 text-xs">
                                                    <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                                                        <span className="font-bold text-slate-400 text-[10px] block uppercase tracking-wider mb-0.5">Konteks / Pemicu</span>
                                                        <p className="text-slate-700 leading-relaxed">{entry.context}</p>
                                                    </div>
                                                    <div className="bg-white p-2.5 rounded-xl border border-slate-100">
                                                        <span className="font-bold text-slate-400 text-[10px] block uppercase tracking-wider mb-0.5">Respons / Usaha</span>
                                                        <p className="text-slate-600 leading-relaxed">{entry.coping_response}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Kontrol Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1 || isLoadingHistory}
                                        className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        aria-label="Halaman sebelumnya"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <span className="text-xs font-bold text-slate-600">
                                        Halaman {currentPage} dari {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages || isLoadingHistory}
                                        className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        aria-label="Halaman berikutnya"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                        </section>
                    </div>

                </div>
            </main>
        </div>
    );
}