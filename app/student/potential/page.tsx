// src/app/student/potential/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRiasecQuestions, submitRiasecAssessment } from '@/features/assessments/actions/riasec.actions';
import { Brain, Loader2, ArrowLeft, ArrowRight, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

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

export default function PotentialAssessmentPage() {
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
                const data = await getRiasecQuestions();
                setVersionId(data.versionId);
                setQuestions(data.questions);

                const savedAnswers = localStorage.getItem('riasecProgress_answers');
                const savedIndex = localStorage.getItem('riasecProgress_index');

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
            localStorage.setItem('riasecProgress_answers', JSON.stringify(answers));
            localStorage.setItem('riasecProgress_index', currentIndex.toString());
        }
    }, [answers, currentIndex, isRestored, questions]);

    const handleAnswer = (value: number) => {
        const currentQ = questions[currentIndex];

        // PERBAIKAN: Guard clause untuk mencegah error jika currentQ bernilai undefined
        // Ini melindungi aplikasi jika user mengklik terlalu cepat di akhir soal
        if (!currentQ) return;

        const newAnswer: Answer = { questionId: currentQ.id, value };

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
            setTimeout(() => { setCurrentIndex((prev) => prev + 1); }, 250);
        }
    };

    const submitAssessment = async (finalAnswers: Answer[]) => {
        setIsSubmitting(true);
        setErrorMessage(null);
        try {
            const result = await submitRiasecAssessment(versionId, finalAnswers);
            localStorage.removeItem('riasecProgress_answers');
            localStorage.removeItem('riasecProgress_index');
            router.push(`/student/potential/result?id=${result.resultId}`);
        } catch (error: unknown) {
            setIsSubmitting(false);
            setErrorMessage(error instanceof Error ? error.message : 'Terjadi kesalahan saat menyimpan jawaban. Silakan coba lagi.');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-600 font-bold tracking-wider uppercase text-sm">Menyiapkan Asesmen...</p>
            </div>
        );
    }

    if (isSubmitting && !errorMessage) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-xl animate-bounce border border-indigo-100">
                    <Sparkles className="h-10 w-10 text-indigo-600" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Hebat!</h2>
                <p className="text-slate-600 font-medium">Sistem sedang menganalisis potensi terbaikmu...</p>
            </div>
        );
    }

    const progressPercentage = (currentIndex / questions.length) * 100;
    const currentAnswer = answers.find(a => a.questionId === questions[currentIndex]?.id);
    const isLastQuestion = currentIndex === questions.length - 1;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col relative">
            {errorMessage && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
                        <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-6 mx-auto">
                            <AlertCircle className="h-8 w-8 text-red-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Mohon Periksa Kembali</h3>
                        <p className="text-sm text-slate-500 mb-8 leading-relaxed">{errorMessage}</p>
                        <button
                            type="button"
                            onClick={() => setErrorMessage(null)}
                            className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl hover:bg-slate-800 transition-all active:scale-95"
                        >
                            Oke, Mengerti
                        </button>
                    </div>
                </div>
            )}

            <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
                <button
                    type="button"
                    onClick={() => router.push('/student/dashboard')}
                    className="p-2 bg-slate-50 rounded-full text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                >
                    <ArrowLeft size={18} />
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Brain className="text-blue-600" size={20} /> Asesmen Potensi
                    </h1>
                </div>
                <div className="text-sm font-bold text-indigo-700 bg-indigo-50 px-4 py-1.5 rounded-lg border border-indigo-100">
                    Soal {currentIndex + 1} / {questions.length}
                </div>
            </header>

            <div className="w-full bg-slate-200 h-1.5">
                <div className="bg-blue-600 h-1.5 transition-all duration-500 ease-out" style={{ width: `${progressPercentage}%` }} />
            </div>

            <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 md:p-12 flex flex-col justify-center pb-12">
                <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-slate-200">

                    <div className="flex justify-between items-center mb-8">
                        <div className="w-1/3">
                            {currentIndex > 0 && (
                                <button type="button" onClick={() => setCurrentIndex(p => p - 1)} className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">
                                    <ArrowLeft size={16} /> Sebelumnya
                                </button>
                            )}
                        </div>
                        <div className="w-1/3 text-center">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest border border-blue-100">
                                <Sparkles size={14} /> Aktivitas
                            </span>
                        </div>
                        <div className="w-1/3 flex justify-end">
                            {(currentIndex < questions.length - 1 && currentAnswer) ? (
                                <button type="button" onClick={() => setCurrentIndex(p => p + 1)} className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                                    Selanjutnya <ArrowRight size={16} />
                                </button>
                            ) : currentAnswer ? (
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                    <CheckCircle2 size={14} className="text-blue-500" /> Tersimpan
                                </div>
                            ) : null}
                        </div>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 text-center leading-tight mb-12">
                        "{questions[currentIndex]?.text}"
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
                        {[
                            { value: 1, label: 'Sangat Tidak Suka', emoji: '😞', activeColor: 'bg-rose-50 border-rose-400 text-rose-700', hoverColor: 'hover:bg-slate-50 hover:border-slate-300' },
                            { value: 2, label: 'Tidak Suka', emoji: '☹️', activeColor: 'bg-orange-50 border-orange-400 text-orange-700', hoverColor: 'hover:bg-slate-50 hover:border-slate-300' },
                            { value: 3, label: 'Biasa Saja', emoji: '😐', activeColor: 'bg-slate-100 border-slate-500 text-slate-800', hoverColor: 'hover:bg-slate-50 hover:border-slate-300' },
                            { value: 4, label: 'Suka', emoji: '🙂', activeColor: 'bg-blue-50 border-blue-400 text-blue-700', hoverColor: 'hover:bg-slate-50 hover:border-slate-300' },
                            { value: 5, label: 'Sangat Suka', emoji: '🤩', activeColor: 'bg-emerald-50 border-emerald-400 text-emerald-700', hoverColor: 'hover:bg-slate-50 hover:border-slate-300' }
                        ].map((option) => {
                            const isSelected = currentAnswer?.value === option.value;
                            return (
                                <button
                                    type="button"
                                    key={option.value}
                                    onClick={() => handleAnswer(option.value)}
                                    className={`flex flex-col items-center justify-center gap-3 p-4 sm:py-6 rounded-2xl border-2 transition-all duration-200 col-span-1 
                                        ${option.value === 3 ? 'col-span-2 md:col-span-1' : ''} 
                                        ${isSelected ? option.activeColor : `bg-white border-slate-200 text-slate-600 ${option.hoverColor}`}`}
                                >
                                    <div className={`text-3xl transition-transform ${isSelected ? 'scale-125' : ''}`}>
                                        {option.emoji}
                                    </div>
                                    <span className="text-xs sm:text-sm font-bold text-center leading-tight">
                                        {option.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {isLastQuestion && (
                        <div className="mt-12 flex justify-center">
                            <button
                                type="button"
                                onClick={() => {
                                    const missingNumbers: number[] = [];
                                    questions.forEach((q, index) => {
                                        if (!answers.some((a) => a.questionId === q.id)) missingNumbers.push(index + 1);
                                    });

                                    if (missingNumbers.length > 0) {
                                        const displayNumbers = missingNumbers.length > 5 ? `${missingNumbers.slice(0, 5).join(', ')}...` : missingNumbers.join(', ');
                                        setErrorMessage(`Ada soal yang terlewat! Soal nomor ${displayNumbers} belum terjawab.`);
                                        setCurrentIndex(missingNumbers[0] - 1);
                                    } else {
                                        submitAssessment(answers);
                                    }
                                }}
                                className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-md hover:bg-indigo-700 transition-colors flex items-center gap-3 w-full sm:w-auto justify-center"
                            >
                                <CheckCircle2 size={24} />
                                <span>Selesai & Kumpulkan Jawaban</span>
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}