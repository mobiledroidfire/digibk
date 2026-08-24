// src/app/student/learning-style/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getVarkQuestions, submitVarkAssessment } from '@/features/assessments/actions/vark.actions';
import { BookOpen, Loader2, ArrowLeft, ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

type Question = {
    id: string;
    text: string;
    dimensionId?: string | null;
    dimensionCode?: string | null;
    displayOrder?: number;
};

type Answer = {
    questionId: string;
    value: number;
};

export default function VarkAssessmentPage() {
    const router = useRouter();
    const [versionId, setVersionId] = useState<string>('');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isRestored, setIsRestored] = useState(false);

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const data = await getVarkQuestions();
                setVersionId(data.versionId);
                setQuestions(data.questions);

                const savedAnswers = localStorage.getItem('varkProgress_answers');
                const savedIndex = localStorage.getItem('varkProgress_index');

                if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
                if (savedIndex) setCurrentIndex(parseInt(savedIndex, 10));

            } catch (error) {
                setErrorMessage('Gagal memuat soal. Silakan muat ulang halaman.');
            } finally {
                setIsLoading(false);
                setIsRestored(true);
            }
        }
        fetchQuestions();
    }, []);

    useEffect(() => {
        if (isRestored && questions.length > 0) {
            localStorage.setItem('varkProgress_answers', JSON.stringify(answers));
            localStorage.setItem('varkProgress_index', currentIndex.toString());
        }
    }, [answers, currentIndex, isRestored, questions]);

    const handleAnswer = (value: number) => {
        const currentQ = questions[currentIndex];

        const newAnswer: Answer = {
            questionId: currentQ.id,
            value
        };

        setAnswers((prev) => {
            const existingIndex = prev.findIndex((a) => a.questionId === currentQ.id);
            if (existingIndex >= 0) {
                const updatedAnswers = [...prev];
                updatedAnswers[existingIndex] = newAnswer;
                return updatedAnswers;
            }
            return [...prev, newAnswer];
        });

        if (currentIndex < questions.length - 1) {
            setTimeout(() => {
                setCurrentIndex((prev) => prev + 1);
            }, 200);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        }
    };

    const submitAssessment = async (finalAnswers: Answer[]) => {
        setIsSubmitting(true);
        setErrorMessage(null);
        try {
            const result = await submitVarkAssessment(versionId, finalAnswers);
            localStorage.removeItem('varkProgress_answers');
            localStorage.removeItem('varkProgress_index');
            router.push(`/student/learning-style/result?id=${result.resultId}`);
        } catch (error: unknown) {
            // PERBAIKAN: Mengganti error: any menjadi error: unknown
            console.error(error);
            setIsSubmitting(false);
            const errMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan jawaban. Silakan coba lagi.';
            setErrorMessage(errMessage);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-emerald-50 to-teal-100">
                <Loader2 className="h-12 w-12 text-teal-600 animate-spin mb-4" />
                <p className="text-slate-600 font-bold tracking-wider uppercase text-sm">Menyiapkan Kuesioner...</p>
            </div>
        );
    }

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
    const hasAnsweredCurrent = !!currentAnswer;
    const isLastQuestion = currentIndex === questions.length - 1;

    return (
        <div className="min-h-screen bg-linear-to-br from-teal-50 via-slate-50 to-emerald-50 flex flex-col relative overflow-hidden">
            {errorMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md px-4">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95">
                        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6 mx-auto">
                            <AlertCircle className="h-8 w-8 text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 text-center mb-3">Mohon Periksa Kembali</h3>
                        <p className="text-sm text-slate-500 text-center mb-8 leading-relaxed">{errorMessage}</p>
                        <button
                            type="button"
                            onClick={() => setErrorMessage(null)}
                            className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-lg"
                        >
                            Oke, Saya Perbaiki
                        </button>
                    </div>
                </div>
            )}

            <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 px-6 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
                <button
                    type="button"
                    onClick={() => router.push('/student/dashboard')}
                    className="p-2 bg-white rounded-full transition-all duration-300 text-slate-500 shadow-sm hover:text-teal-600 hover:bg-teal-50 hover:shadow-md hover:shadow-teal-500/30 hover:-translate-y-0.5"
                    title="Kembali ke Dashboard"
                >
                    <ArrowLeft size={18} />
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-extrabold text-transparent bg-clip-text bg-linear-to-r from-teal-600 to-emerald-600 flex items-center gap-2">
                        <BookOpen className="text-teal-600" size={20} /> Gaya Belajar
                    </h1>
                </div>
                <div className="text-sm font-extrabold text-teal-700 bg-teal-50 px-4 py-2 rounded-xl ring-1 ring-teal-600/20 shadow-inner">
                    Soal {currentIndex + 1} dari {questions.length}
                </div>
            </header>

            <div className="w-full bg-slate-200/50 h-2">
                <div
                    className="bg-linear-to-r from-teal-400 to-emerald-500 h-2 transition-all duration-700 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>

            <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 md:p-12 flex flex-col justify-center pb-20">
                <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] p-6 md:p-12 shadow-2xl shadow-teal-100/50 border border-white relative flex flex-col">

                    <div className="flex flex-col-reverse sm:flex-row items-center justify-between mb-8 gap-4 w-full">
                        <div className="w-full sm:w-1/3 flex justify-start">
                            {currentIndex > 0 && (
                                <button
                                    type="button"
                                    onClick={handlePrevious}
                                    className="flex items-center gap-1.5 px-4 py-2 w-full sm:w-auto justify-center bg-slate-50 border border-slate-200 rounded-full text-xs font-bold text-slate-600 transition-all duration-300 hover:text-teal-700 hover:border-teal-400 hover:bg-teal-100 hover:shadow-md hover:-translate-y-0.5"
                                >
                                    <ArrowLeft size={14} /> Ke Soal Sebelumnya
                                </button>
                            )}
                        </div>

                        <div className="w-full sm:w-1/3 flex justify-center">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-600 text-xs font-bold uppercase tracking-widest ring-1 ring-teal-600/20">
                                <Sparkles size={14} /> Pernyataan
                            </span>
                        </div>

                        <div className="w-full sm:w-1/3 flex justify-end">
                            {(currentIndex < questions.length - 1 && hasAnsweredCurrent) ? (
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (hasAnsweredCurrent) setCurrentIndex(prev => prev + 1);
                                    }}
                                    className="flex items-center gap-1.5 px-4 py-2 w-full sm:w-auto justify-center bg-slate-50 border border-slate-200 rounded-full text-xs font-bold text-slate-600 transition-all duration-300 hover:text-emerald-700 hover:border-emerald-400 hover:bg-emerald-100 hover:shadow-md hover:-translate-y-0.5"
                                >
                                    Selanjutnya <ArrowRight size={14} />
                                </button>
                            ) : (
                                <div className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-400">
                                    <CheckCircle2 size={14} className="text-teal-500" /> Tersimpan
                                </div>
                            )}
                        </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black text-slate-800 text-center leading-relaxed mb-12">
                        "{questions[currentIndex]?.text}"
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
                        {[
                            { value: 1, label: 'Sangat Tidak Sesuai', emoji: '🙅', activeColor: 'bg-rose-100 border-rose-400 ring-4 ring-rose-100', hoverColor: 'hover:bg-rose-50 hover:border-rose-300' },
                            { value: 2, label: 'Tidak Sesuai', emoji: '😕', activeColor: 'bg-orange-100 border-orange-400 ring-4 ring-orange-100', hoverColor: 'hover:bg-orange-50 hover:border-orange-300' },
                            { value: 3, label: 'Biasa Saja', emoji: '😐', activeColor: 'bg-slate-200 border-slate-500 ring-4 ring-slate-100', hoverColor: 'hover:bg-slate-50 hover:border-slate-300' },
                            { value: 4, label: 'Sesuai', emoji: '👍', activeColor: 'bg-blue-100 border-blue-400 ring-4 ring-blue-100', hoverColor: 'hover:bg-blue-50 hover:border-blue-300' },
                            { value: 5, label: 'Sangat Sesuai', emoji: '🙌', activeColor: 'bg-emerald-100 border-emerald-400 ring-4 ring-emerald-100', hoverColor: 'hover:bg-emerald-50 hover:border-emerald-300' }
                        ].map((option) => {
                            const isSelected = currentAnswer?.value === option.value;

                            return (
                                <button
                                    type="button"
                                    key={option.value}
                                    onClick={() => handleAnswer(option.value)}
                                    className={`flex flex-col items-center justify-center gap-3 p-4 sm:py-6 rounded-2xl border-2 transition-all duration-200 active:scale-90 shadow-sm col-span-1 
                    ${option.value === 3 ? 'col-span-2 md:col-span-1' : ''} 
                    ${isSelected ? option.activeColor : `bg-white border-slate-100 ${option.hoverColor}`}`}
                                >
                                    <div className={`text-3xl transition-transform duration-200 ${isSelected ? 'scale-125' : 'hover:scale-110'}`}>
                                        {option.emoji}
                                    </div>
                                    <span className={`text-xs sm:text-sm font-bold text-center leading-tight ${isSelected ? 'text-slate-800' : 'text-slate-600'}`}>
                                        {option.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {isLastQuestion && (
                        <div className="mt-10 flex justify-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <button
                                type="button"
                                onClick={() => {
                                    const missingNumbers: number[] = [];
                                    questions.forEach((q, index) => {
                                        const isAnswered = answers.some((a) => a.questionId === q.id);
                                        if (!isAnswered) {
                                            missingNumbers.push(index + 1);
                                        }
                                    });

                                    if (missingNumbers.length > 0) {
                                        const displayNumbers = missingNumbers.length > 5
                                            ? `${missingNumbers.slice(0, 5).join(', ')}, dan ${missingNumbers.length - 5} soal lainnya`
                                            : missingNumbers.join(', ');

                                        setErrorMessage(`Tunggu sebentar! Soal nomor ${displayNumbers} belum terjawab. Kami sudah memindahkan layar Anda kembali ke soal yang kosong tersebut.`);

                                        setCurrentIndex(missingNumbers[0] - 1);
                                    } else {
                                        submitAssessment(answers);
                                    }
                                }}
                                className="px-8 py-4 bg-teal-600 text-white font-bold rounded-2xl shadow-sm transition-all duration-300 hover:bg-teal-500 hover:shadow-lg hover:shadow-teal-500/40 hover:-translate-y-1 flex items-center gap-3"
                            >
                                <CheckCircle2 size={24} />
                                <span className="text-lg">Selesai & Kumpulkan Jawaban</span>
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}