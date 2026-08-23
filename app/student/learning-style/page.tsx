// Lokasi file: src/app/student/learning-style/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getVakQuestions, submitVakAssessment } from '@/features/assessments/actions/vak.actions';
import { BookOpen, Loader2, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react';

type Question = {
    id: string;
    text: string;
    dimensionId: string;
    dimensionCode: string;
};

type Answer = {
    questionId: string;
    dimensionId: string;
    dimensionCode: string;
    value: number;
};

export default function VakAssessmentPage() {
    const router = useRouter();
    const [versionId, setVersionId] = useState<string>('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Memuat soal VAK saat halaman pertama kali dibuka
    useEffect(() => {
        async function fetchQuestions() {
            try {
                const data = await getVakQuestions();
                setVersionId(data.versionId);
                setQuestions(data.questions);
            } catch (error) {
                setErrorMessage('Gagal memuat soal. Silakan muat ulang halaman.');
            } finally {
                setIsLoading(false);
            }
        }
        fetchQuestions();
    }, []);

    // Menyimpan jawaban dan pindah ke soal berikutnya
    const handleAnswer = (value: number) => {
        const currentQ = questions[currentIndex];
        const newAnswer: Answer = {
            questionId: currentQ.id,
            dimensionId: currentQ.dimensionId,
            dimensionCode: currentQ.dimensionCode,
            value
        };

        setAnswers((prev) => {
            const existingIndex = prev.findIndex((a) => a.questionId === currentQ.id);
            if (existingIndex >= 0) {
                // Timpa jika sudah pernah dijawab (kasus tombol Back)
                const updatedAnswers = [...prev];
                updatedAnswers[existingIndex] = newAnswer;
                return updatedAnswers;
            }
            return [...prev, newAnswer];
        });

        // Lanjut atau Submit
        if (currentIndex < questions.length - 1) {
            setTimeout(() => {
                setCurrentIndex((prev) => prev + 1);
            }, 200);
        } else {
            // Gunakan final state untuk dikirim ke backend
            const finalAnswers = [...answers.filter(a => a.questionId !== currentQ.id), newAnswer];
            submitAssessment(finalAnswers);
        }
    };

    // Fungsi untuk kembali ke soal sebelumnya
    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    // Fungsi untuk mengirim seluruh jawaban ke backend
    const submitAssessment = async (finalAnswers: Answer[]) => {
        setIsSubmitting(true);
        setErrorMessage(null);
        try {
            const resultId = await submitVakAssessment(versionId, finalAnswers);
            // Arahkan ke halaman hasil
            router.push(`/student/learning-style/result?id=${resultId}`);
        } catch (error: any) {
            console.error(error);
            setIsSubmitting(false);
            setErrorMessage(error.message || 'Terjadi kesalahan saat menyimpan jawaban. Silakan coba lagi.');
        }
    };

    // State: Sedang Memuat Soal (Diperbarui dengan bg-linear-to-br)
    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-emerald-50 to-teal-100">
                <Loader2 className="h-12 w-12 text-teal-600 animate-spin mb-4" />
                <p className="text-slate-600 font-bold tracking-wider uppercase text-sm">Menyiapkan Kuesioner...</p>
            </div>
        );
    }

    // State: Sedang Menghitung Hasil (Diperbarui dengan bg-linear-to-br)
    if (isSubmitting && !errorMessage) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-emerald-50 to-teal-100">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl animate-bounce">
                    <Sparkles className="h-10 w-10 text-teal-600" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Selesai!</h2>
                <p className="text-slate-600 font-medium">Sistem sedang menganalisis gaya belajarmu...</p>
            </div>
        );
    }

    const progressPercentage = (currentIndex / questions.length) * 100;
    const currentAnswer = answers.find(a => a.questionId === questions[currentIndex]?.id);

    return (
        // Wrapper Utama (Diperbarui dengan bg-linear-to-br)
        <div className="min-h-screen bg-linear-to-br from-teal-50 via-slate-50 to-emerald-50 flex flex-col relative overflow-hidden">

            {/* Modal Error */}
            {errorMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md px-4">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95">
                        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6 mx-auto">
                            <AlertCircle className="h-8 w-8 text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 text-center mb-3">Oops, Ada Masalah</h3>
                        <p className="text-sm text-slate-500 text-center mb-8">{errorMessage}</p>
                        <button
                            onClick={() => setErrorMessage(null)}
                            className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
                        >
                            Tutup & Coba Lagi
                        </button>
                    </div>
                </div>
            )}

            {/* Header Sticky */}
            <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 px-6 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
                <button
                    onClick={currentIndex > 0 ? handlePrevious : () => router.push('/student/dashboard')}
                    className="p-2 bg-white shadow-sm hover:shadow-md rounded-full transition-all text-slate-500"
                >
                    <ArrowLeft size={18} />
                </button>
                <div className="flex-1">
                    {/* Judul (Diperbarui dengan bg-linear-to-r) */}
                    <h1 className="text-lg font-extrabold text-transparent bg-clip-text bg-linear-to-r from-teal-600 to-emerald-600 flex items-center gap-2">
                        <BookOpen className="text-teal-600" size={20} /> Gaya Belajar
                    </h1>
                </div>
                <div className="text-sm font-extrabold text-teal-700 bg-teal-50 px-4 py-2 rounded-xl ring-1 ring-teal-600/20 shadow-inner">
                    Soal {currentIndex + 1} dari {questions.length}
                </div>
            </header>

            {/* Progress Bar (Diperbarui dengan bg-linear-to-r) */}
            <div className="w-full bg-slate-200/50 h-2">
                <div
                    className="bg-linear-to-r from-teal-400 to-emerald-500 h-2 transition-all duration-700 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>

            {/* Main Content */}
            <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 md:p-12 flex flex-col justify-center">
                <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-teal-100/50 border border-white relative">

                    {/* Tombol Mundur Ekstra (Desktop) */}
                    {currentIndex > 0 && (
                        <button
                            onClick={handlePrevious}
                            className="hidden md:flex absolute -top-5 left-1/2 -translate-x-1/2 items-center gap-1.5 px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 hover:text-teal-600 hover:border-teal-300 shadow-sm transition-all"
                        >
                            <ArrowLeft size={14} /> Ke Pernyataan Sebelumnya
                        </button>
                    )}

                    <div className="flex justify-center mb-6 mt-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-xs font-bold uppercase tracking-widest ring-1 ring-teal-600/20">
                            <Sparkles size={14} /> Pernyataan
                        </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black text-slate-800 text-center leading-relaxed mb-12">
                        "{questions[currentIndex]?.text}"
                    </h2>

                    {/* Opsi Jawaban */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                        {[
                            { value: 1, label: 'Sangat Tidak Sesuai', emoji: '🙅', activeColor: 'bg-rose-100 border-rose-400 ring-4 ring-rose-100', hoverColor: 'hover:bg-rose-50 hover:border-rose-300' },
                            { value: 2, label: 'Tidak Sesuai', emoji: '😕', activeColor: 'bg-orange-100 border-orange-400 ring-4 ring-orange-100', hoverColor: 'hover:bg-orange-50 hover:border-orange-300' },
                            { value: 3, label: 'Sesuai', emoji: '👍', activeColor: 'bg-blue-100 border-blue-400 ring-4 ring-blue-100', hoverColor: 'hover:bg-blue-50 hover:border-blue-300' },
                            { value: 4, label: 'Sangat Sesuai', emoji: '🙌', activeColor: 'bg-emerald-100 border-emerald-400 ring-4 ring-emerald-100', hoverColor: 'hover:bg-emerald-50 hover:border-emerald-300' }
                        ].map((option) => {
                            const isSelected = currentAnswer?.value === option.value;

                            return (
                                <button
                                    key={option.value}
                                    onClick={() => handleAnswer(option.value)}
                                    className={`flex flex-col items-center justify-center gap-3 p-4 sm:py-6 rounded-2xl border-2 transition-all duration-200 active:scale-90 shadow-sm col-span-1 
                                        ${isSelected ? option.activeColor : `bg-white border-slate-100 ${option.hoverColor}`}`}
                                >
                                    <div className={`text-3xl transition-transform duration-200 ${isSelected ? 'scale-125' : 'group-hover:scale-110'}`}>
                                        {option.emoji}
                                    </div>
                                    <span className={`text-xs sm:text-sm font-bold text-center leading-tight ${isSelected ? 'text-slate-800' : 'text-slate-600'}`}>
                                        {option.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}