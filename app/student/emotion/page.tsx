// Lokasi file: /src/app/student/emotion/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { submitEmotionAction, getEmotionHistoryAction } from '@/features/student/actions/emotion.actions';
import type { EmotionType, EmotionalCheckinHistory } from '@/features/student/types/emotion.types';
import {
    ArrowLeft, Heart, Loader2, ShieldAlert,
    Clock, Activity, MessageSquareHeart, ChevronLeft, ChevronRight, CalendarDays
} from 'lucide-react';

const EMOTION_MAP: Record<EmotionType, string> = {
    'HAPPY': 'Senang',
    'CALM': 'Tenang',
    'NEUTRAL': 'Netral',
    'CONFUSED': 'Bingung',
    'SAD': 'Sedih',
    'DISAPPOINTED': 'Kecewa',
    'ANGRY': 'Marah',
    'AFRAID': 'Takut',
    'ANXIOUS': 'Cemas',
    'OTHER': 'Lainnya'
};

const emotionKeys = Object.keys(EMOTION_MAP) as EmotionType[];
const ITEMS_PER_PAGE = 5;

// Fungsi pembantu untuk format tanggal ke format Indonesia
const formatIndonesianDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date) + ' WIB';
};

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

    // Emosi negatif dengan intensitas 7 ke atas
    const isCritical = ['SAD', 'DISAPPOINTED', 'ANGRY', 'AFRAID', 'ANXIOUS'].includes(emotion) && intensity >= 7;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

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

            // Refresh riwayat ke halaman 1
            setCurrentPage(1);
            fetchHistory(1);

            // Berikan notifikasi sukses kecil (opsional) atau tetap di halaman ini
            alert("Refleksi emosi berhasil disimpan!");
        } else {
            alert(res.error);
        }
    };

    const totalPages = Math.ceil(totalRecords / ITEMS_PER_PAGE);

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">

            <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-4 shadow-sm">
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
                    <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Jurus 2: Kelola Emosi</h2>
                    <p className="text-slate-400">Bagaimana perasaanmu hari ini? Mari petakan dan kelola bersama.</p>
                </div>
            </div>

            {/* --- LAYOUT GRID: DIPERLEBAR MENJADI max-w-7xl --- */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 -mt-14 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* BAGIAN KIRI: FORM CHECK-IN (Lebar 7 Kolom) */}
                    <div className="lg:col-span-7 space-y-6">
                        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 h-full">
                            <form onSubmit={handleSubmit} className="space-y-8">

                                <div>
                                    <label className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                                        <Activity className="h-4 w-4 text-indigo-500" /> Apa yang paling kamu rasakan saat ini?
                                    </label>
                                    <div className="flex flex-wrap gap-2.5">
                                        {emotionKeys.map((emoKey) => (
                                            <button
                                                key={emoKey}
                                                type="button"
                                                onClick={() => setEmotion(emoKey)}
                                                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all border ${emotion === emoKey
                                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                                                    }`}
                                            >
                                                {EMOTION_MAP[emoKey]}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {isCritical && (
                                    <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex gap-3 animate-in fade-in slide-in-from-top-2">
                                        <ShieldAlert className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="text-sm font-bold text-rose-800">Kami menyadari perasaanmu.</h4>
                                            <p className="text-sm text-rose-700 mt-1 leading-relaxed">
                                                Merasa {EMOTION_MAP[emotion].toLowerCase()} yang mendalam adalah hal yang manusiawi. Sistem akan memberi notifikasi ke Guru BK-mu agar mereka bisa memberikan dukungan terbaik jika kamu membutuhkannya.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <hr className="border-slate-100" />

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Seberapa kuat perasaan itu? (Skala 1-10): <span className="text-blue-600">{intensity}</span>
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="10"
                                        value={intensity}
                                        onChange={(e) => setIntensity(Number(e.target.value))}
                                        className="w-full cursor-pointer accent-blue-600"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Apa yang menyebabkan kamu merasa seperti itu?</label>
                                    <textarea
                                        required
                                        rows={3}
                                        value={context}
                                        onChange={(e) => setContext(e.target.value)}
                                        className="w-full p-3.5 bg-slate-50 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                        placeholder="Ceritakan sedikit kejadiannya di sini..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Apa yang akan kamu lakukan untuk menghadapinya?</label>
                                    <textarea
                                        required
                                        rows={2}
                                        value={copingResponse}
                                        onChange={(e) => setCopingResponse(e.target.value)}
                                        className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                                        placeholder="Misal: menarik napas panjang, mendengarkan musik, beristirahat..."
                                    />
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                                    <input
                                        type="checkbox"
                                        id="talk"
                                        checked={wantsToTalk || isCritical}
                                        disabled={isCritical}
                                        onChange={(e) => setWantsToTalk(e.target.checked)}
                                        className="h-5 w-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer disabled:opacity-50"
                                    />
                                    <label htmlFor="talk" className={`text-sm font-medium flex gap-2 items-center cursor-pointer ${isCritical ? 'text-indigo-900/50' : 'text-indigo-900'}`}>
                                        <MessageSquareHeart className="h-4 w-4" /> Saya ingin membicarakan hal ini dengan Guru BK.
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3.5 bg-slate-900 text-white text-sm font-bold rounded-xl transition-all hover:bg-slate-800 disabled:opacity-50 flex justify-center items-center gap-2 shadow-sm"
                                >
                                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {isLoading ? 'Menyimpan...' : 'Simpan Refleksi Emosi'}
                                </button>
                            </form>
                        </section>
                    </div>

                    {/* BAGIAN KANAN: RIWAYAT (Lebar 5 Kolom) */}
                    <div className="lg:col-span-5 space-y-6">
                        <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 flex flex-col h-full">
                            <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center justify-between border-b pb-3">
                                <span className="flex items-center gap-2"><Clock className="h-5 w-5 text-slate-400" /> Riwayat Emosi</span>
                                <span className="text-xs font-semibold bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md">{totalRecords} Catatan</span>
                            </h3>

                            {isLoadingHistory ? (
                                <div className="flex-1 flex flex-col items-center justify-center py-10">
                                    <Loader2 className="h-6 w-6 text-indigo-500 animate-spin mb-2" />
                                    <p className="text-sm text-slate-500">Memuat riwayat...</p>
                                </div>
                            ) : history.length === 0 ? (
                                <p className="text-sm text-slate-500 text-center py-6 bg-slate-50 rounded-xl border border-slate-100 border-dashed">
                                    Belum ada riwayat check-in emosi.
                                </p>
                            ) : (
                                <div className="space-y-4 flex-1">
                                    {history.map((entry, index) => {
                                        // Menghitung nomor urut berdasar pagination
                                        const itemNumber = (currentPage - 1) * ITEMS_PER_PAGE + (index + 1);

                                        return (
                                            <div key={entry.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-black text-slate-300">#{itemNumber}</span>
                                                        <span className="px-2.5 py-1 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-md">
                                                            {EMOTION_MAP[entry.emotion]}
                                                        </span>
                                                        <span className="text-xs text-slate-500 font-bold bg-slate-200/50 px-2 py-1 rounded-md">
                                                            {entry.intensity}/10
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1.5 mb-3 text-[11px] font-medium text-slate-400">
                                                    <CalendarDays className="h-3 w-3" />
                                                    {formatIndonesianDate(entry.created_at)}
                                                </div>

                                                <div className="space-y-2.5">
                                                    <p className="text-sm text-slate-700 leading-relaxed"><span className="font-semibold text-slate-500 text-[10px] block mb-0.5 uppercase tracking-wider">Konteks</span> {entry.context}</p>
                                                    <p className="text-sm text-slate-600 leading-relaxed"><span className="font-semibold text-slate-500 text-[10px] block mb-0.5 uppercase tracking-wider">Respons / Usaha</span> {entry.coping_response}</p>
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
                                        className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </button>
                                    <span className="text-xs font-bold text-slate-500">
                                        Hal {currentPage} dari {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages || isLoadingHistory}
                                        className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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