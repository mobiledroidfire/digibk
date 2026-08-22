// Lokasi file: src/app/student/potential/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRiasecQuestions, submitRiasecAssessment } from '@/features/assessments/actions/riasec.actions';
import { Brain, CheckCircle2, Loader2, ArrowLeft, AlertCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';

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

    useEffect(() => {
        async function fetchQuestions() {
            try {
                const data = await getRiasecQuestions();
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

    const handleAnswer = (value: number) => {
        const currentQ = questions[currentIndex];
        const newAnswer: Answer = {
            questionId: currentQ.id,
            dimensionId: currentQ.dimensionId,
            dimensionCode: currentQ.dimensionCode,
            value
        };

        setAnswers((prev) => [...prev, newAnswer]);

        if (currentIndex < questions.length - 1) {
            setTimeout(() => {
                setCurrentIndex((prev) => prev + 1);
            }, 300);
        } else {
            submitAssessment([...answers, newAnswer]);
        }
    };

    const submitAssessment = async (finalAnswers: Answer[]) => {
        setIsSubmitting(true);
        setErrorMessage(null);
        try {
            const resultId = await submitRiasecAssessment(versionId, finalAnswers);
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

    const progressPercentage = ((currentIndex) / questions.length) * 100;

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
                <Link href="/student/dashboard" className="p-2 bg-white shadow-sm hover:shadow-md rounded-full transition-all text-slate-500">
                    <ArrowLeft size={18} />
                </Link>
                <div className="flex-1">
                    <h1 className="text-lg font-extrabold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600 flex items-center gap-2">
                        <Brain className="text-blue-600" size={20} /> Jurus 1
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
                <div className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-indigo-100/50 border border-white">
                    <div className="flex justify-center mb-6">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-widest ring-1 ring-blue-600/20">
                            <Sparkles size={14} /> Aktivitas
                        </span>
                    </div>

                    <h2 className="text-2xl md:text-4xl font-black text-slate-800 text-center leading-tight mb-12">
                        "{questions[currentIndex]?.text}"
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
                        {[
                            { value: 1, label: 'Sangat Tidak Suka', emoji: '😞', color: 'hover:bg-rose-50 hover:border-rose-300' },
                            { value: 2, label: 'Tidak Suka', emoji: '☹️', color: 'hover:bg-orange-50 hover:border-orange-300' },
                            { value: 3, label: 'Biasa Saja', emoji: '😐', color: 'hover:bg-slate-50 hover:border-slate-300' },
                            { value: 4, label: 'Suka', emoji: '🙂', color: 'hover:bg-blue-50 hover:border-blue-300' },
                            { value: 5, label: 'Sangat Suka', emoji: '🤩', color: 'hover:bg-emerald-50 hover:border-emerald-300' }
                        ].map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleAnswer(option.value)}
                                className={`flex flex-col items-center justify-center gap-3 p-4 sm:py-6 rounded-2xl border-2 border-slate-100 bg-white shadow-sm transition-all duration-200 active:scale-90 hover:shadow-md ${option.color} group col-span-1 ${option.value === 3 ? 'col-span-2 md:col-span-1' : ''}`}
                            >
                                <div className="text-3xl group-hover:scale-110 transition-transform duration-200">
                                    {option.emoji}
                                </div>
                                <span className="text-xs sm:text-sm font-bold text-slate-600 text-center leading-tight">
                                    {option.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}