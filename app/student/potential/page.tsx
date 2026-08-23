'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRiasecQuestions, submitRiasecAssessment } from '@/features/assessments/actions/riasec.actions';
import { Brain, Loader2, ArrowLeft, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

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

                // Mengambil progres dari localStorage
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

    // Menyimpan progres ke localStorage
    useEffect(() => {
        if (isRestored && questions.length > 0) {
            localStorage.setItem('riasecProgress_answers', JSON.stringify(answers));
            localStorage.setItem('riasecProgress_index', currentIndex.toString());
        }
    }, [answers, currentIndex, isRestored, questions]);

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
        } else {
            const finalAnswers = [...answers.filter(a => a.questionId !== currentQ.id), newAnswer];
            submitAssessment(finalAnswers);
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
            const resultId = await submitRiasecAssessment(versionId, finalAnswers);
            // Hapus cache setelah beres
            localStorage.removeItem('riasecProgress_answers');
            localStorage.removeItem('riasecProgress_index');
            router.push(`/student/potential/result?id=${resultId}`);
        } catch (error: any) {
            console.error(error);
            setIsSubmitting(false);
            setErrorMessage(error.message || 'Terjadi kesalahan saat menyimpan jawaban. Silakan coba lagi.');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-600 font-bold tracking-wider uppercase text-sm">Menyiapkan Asesmen...</p>
            </div>
        );
    }

    if (isSubmitting && !errorMessage) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-indigo-50 to-purple-100">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-2xl animate-bounce">
                    <Sparkles className="h-10 w-10 text-indigo-600" />
                </div>
                <h2 className="text-3xl font-extrabold text-slate-800 mb-2">Hebat!</h2>
                <p className="text-slate-600 font-medium">Sistem sedang menganalisis potensi terbaikmu...</p>
            </div>
        );
    }

    const progressPercentage = (currentIndex / questions.length) * 100;
    const currentAnswer = answers.find(a => a.questionId === questions[currentIndex]?.id);

    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 via-slate-50 to-indigo-50 flex flex-col relative overflow-hidden">
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

            <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 px-6 py-4 flex items-center gap-4 sticky top-0 z-10 shadow-sm">
                <button
                    onClick={() => router.push('/student/dashboard')}
                    className="p-2 bg-white shadow-sm hover:shadow-md hover:bg-slate-50 rounded-full transition-all text-slate-500"
                    title="Kembali ke Dashboard"
                >
                    <ArrowLeft size={18} />
                </button>
                <div className="flex-1">
                    <h1 className="text-lg font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 flex items-center gap-2">
                        <Brain className="text-blue-600" size={20} /> Asesmen Potensi
                    </h1>
                </div>
                <div className="text-sm font-extrabold text-indigo-700 bg-indigo-50 px-4 py-2 rounded-xl ring-1 ring-indigo-600/20 shadow-inner">
                    Soal {currentIndex + 1} dari {questions.length}
                </div>
            </header>

            <div className="w-full bg-slate-200/50 h-2">
                <div
                    className="bg-linear-to-r from-blue-500 to-indigo-500 h-2 transition-all duration-700 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                ></div>
            </div>

            <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 md:p-12 flex flex-col justify-center">
                <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] p-6 md:p-12 shadow-2xl shadow-indigo-100/50 border border-white relative flex flex-col">

                    {/* Desain Header Kartu: Tombol Kembali & Label */}
                    <div className="flex flex-col-reverse sm:flex-row items-center justify-between mb-8 gap-4 w-full">
                        <div className="w-full sm:w-1/3 flex justify-start">
                            {currentIndex > 0 && (
                                <button
                                    onClick={handlePrevious}
                                    className="flex items-center gap-1.5 px-4 py-2 w-full sm:w-auto justify-center bg-slate-50 border border-slate-200 rounded-full text-xs font-bold text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 shadow-sm transition-all"
                                >
                                    <ArrowLeft size={14} /> Ke Soal Sebelumnya
                                </button>
                            )}
                        </div>

                        <div className="w-full sm:w-1/3 flex justify-center">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest ring-1 ring-blue-600/20">
                                <Sparkles size={14} /> Aktivitas
                            </span>
                        </div>

                        <div className="w-full sm:w-1/3 flex justify-end">
                            <div className="hidden md:flex items-center gap-1.5 text-xs font-medium text-slate-400">
                                <CheckCircle2 size={14} className="text-blue-500" /> Tersimpan
                            </div>
                        </div>
                    </div>

                    <h2 className="text-2xl md:text-4xl font-black text-slate-800 text-center leading-tight mb-12">
                        "{questions[currentIndex]?.text}"
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
                        {[
                            { value: 1, label: 'Sangat Tidak Suka', emoji: '😞', activeColor: 'bg-rose-100 border-rose-400 ring-4 ring-rose-100', hoverColor: 'hover:bg-rose-50 hover:border-rose-300' },
                            { value: 2, label: 'Tidak Suka', emoji: '☹️', activeColor: 'bg-orange-100 border-orange-400 ring-4 ring-orange-100', hoverColor: 'hover:bg-orange-50 hover:border-orange-300' },
                            { value: 3, label: 'Biasa Saja', emoji: '😐', activeColor: 'bg-slate-200 border-slate-500 ring-4 ring-slate-100', hoverColor: 'hover:bg-slate-50 hover:border-slate-300' },
                            { value: 4, label: 'Suka', emoji: '🙂', activeColor: 'bg-blue-100 border-blue-400 ring-4 ring-blue-100', hoverColor: 'hover:bg-blue-50 hover:border-blue-300' },
                            { value: 5, label: 'Sangat Suka', emoji: '🤩', activeColor: 'bg-emerald-100 border-emerald-400 ring-4 ring-emerald-100', hoverColor: 'hover:bg-emerald-50 hover:border-emerald-300' }
                        ].map((option) => {
                            const isSelected = currentAnswer?.value === option.value;

                            return (
                                <button
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
                </div>
            </main>
        </div>
    );
}