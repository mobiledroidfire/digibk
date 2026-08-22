// Lokasi file: src/app/student/potential/result/page.tsx

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
    BrainCircuit, Trophy, ArrowRight, Activity,
    GraduationCap, School, Briefcase, BookOpen,
    UserCheck, HeartHandshake, Sparkles, Star, Target
} from 'lucide-react';

import {
    dimensionDefs,
    riasecDictionary,
    type AssessmentResult,
    type RiasecProfile
} from '@/lib/data/riasec';

function blendArrays(arr1: string[] = [], arr2: string[] = [], arr3: string[] = [], maxItems: number): string[] {
    const combined = [...arr1, ...arr2.slice(0, Math.max(1, Math.floor(arr2.length / 2))), ...arr3.slice(0, 1)];
    return [...new Set(combined)].slice(0, maxItems);
}

export default async function ResultPage({ searchParams }: { searchParams: Promise<{ id?: string }>; }) {
    const resolvedParams = await searchParams;
    let resultId = resolvedParams.id;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: student, error: studentError } = await supabase
        .from('students')
        .select(`id, full_name, education_level, grade_level, schools (name)`)
        .eq('user_id', user.id)
        .single();

    if (studentError || !student) {
        console.error("🚨 ERROR AMBIL DATA SISWA:", studentError?.message);
        redirect('/student/dashboard?error=Akses_Ditolak_Gagal_Ambil_Data');
    }

    const schoolName = student.schools && typeof student.schools === 'object' && 'name' in student.schools
        ? String(student.schools.name) : 'Sekolah Anda';

    const eduLvl: 'SD' | 'SMP' | 'SMA' = (student.education_level === 'SD' || student.education_level === 'SMA')
        ? student.education_level : 'SMP';

    const grade = student.grade_level;
    const isKelas6 = eduLvl === 'SD' && grade === 6;
    const isKelas9 = eduLvl === 'SMP' && grade === 9;
    const isKelas12 = (eduLvl === 'SMA' || student.education_level === 'SMK' || student.education_level === 'MA') && grade === 12;

    const isTransisi = isKelas6 || isKelas9 || isKelas12;

    let transitionMessage = null;
    if (isKelas6) transitionMessage = "Fokus Transisi SMP: Persiapkan dirimu untuk memilih lingkungan dan ekstrakurikuler yang tepat di SMP nanti!";
    if (isKelas9) transitionMessage = "Fokus Jurusan SMA/SMK: Gunakan hasil ini untuk mantap memilih penjurusan di tingkat menengah atas!";
    if (isKelas12) transitionMessage = "Fokus Kuliah & Karier: Ini adalah panduan utamamu untuk menentukan program studi atau rencana karier setelah lulus!";

    if (!resultId) {
        const { data: latestResult } = await supabase.from('assessment_results')
            .select('id').eq('student_id', student.id).order('calculated_at', { ascending: false }).limit(1).single();
        if (latestResult) resultId = latestResult.id;
        else redirect('/student/dashboard?error=Hasil_Tidak_Ditemukan');
    }

    const { data: resultData, error: resultError } = await supabase.from('assessment_results')
        .select(`id, riasec_profiles ( code, riasec_results ( code, raw_score ) )`)
        .eq('id', resultId).eq('student_id', student.id).single();

    if (resultError || !resultData) {
        console.error("🚨 ERROR AMBIL HASIL ASESMEN:", resultError?.message);
        redirect('/student/dashboard?error=Data_Gagal_Dimuat');
    }

    const typedResult = resultData as unknown as AssessmentResult;
    const profile: RiasecProfile | null = Array.isArray(typedResult.riasec_profiles) ? typedResult.riasec_profiles[0] : typedResult.riasec_profiles;

    if (!profile) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">Profil Belum Ditemukan.</div>
        </div>
    );

    const rawResults = profile.riasec_results || [];
    const sortedScores = [...rawResults].sort((a, b) => b.raw_score !== a.raw_score ? b.raw_score - a.raw_score : a.code.localeCompare(b.code));

    const topThree = sortedScores.slice(0, 3);
    const code1 = topThree[0]?.code || 'S';
    const code2 = topThree[1]?.code || 'C';
    const code3 = topThree[2]?.code || 'I';
    const hyphenatedCodes = `${code1}-${code2}-${code3}`;

    const highestScore = sortedScores[0]?.raw_score || 0;
    const dominantTies = sortedScores.filter((item) => item.raw_score === highestScore);
    const isDominantTie = dominantTies.length > 1;

    const cutoffScore = topThree[2]?.raw_score ?? 0;
    const tiedAtCutoff = sortedScores.filter((item) => item.raw_score === cutoffScore);
    const additionalTiedCodes = tiedAtCutoff.filter((item) => !topThree.some((topItem) => topItem.code === item.code)).map((item) => dimensionDefs[item.code].name);

    const cutoffMotivationMessage = additionalTiedCodes.length > 0
        ? `Selain pola di atas, kamu juga memiliki potensi kuat di bidang ${additionalTiedCodes.join(' dan ')} (Skor ${cutoffScore}). Jadikan ini opsi cadangan atau keterampilan tambahan yang unik!`
        : null;

    const data1 = riasecDictionary[code1];
    const data2 = riasecDictionary[code2];
    const data3 = riasecDictionary[code3];

    const level1 = data1.levels[eduLvl];
    const level2 = data2.levels[eduLvl];
    const level3 = data3.levels[eduLvl];

    // ========================================================================
    // LOGIKA PENDETEKSI KELAS DINAMIS (Memilih Data dari riasec.ts)
    // ========================================================================
    const list1_1 = isTransisi ? level1.transisiList1 : level1.eduList1;
    const list1_2 = isTransisi ? level2.transisiList1 : level2.eduList1;
    const list1_3 = isTransisi ? level3.transisiList1 : level3.eduList1;

    const list2_1 = isTransisi ? level1.transisiList2 : level1.eduList2;
    const list2_2 = isTransisi ? level2.transisiList2 : level2.eduList2;
    const list2_3 = isTransisi ? level3.transisiList2 : level3.eduList2;

    const displayTitleEdu1 = isTransisi ? level1.transisiTitle1 : level1.eduTitle1;
    const displayTitleEdu2 = isTransisi ? level1.transisiTitle2 : level1.eduTitle2;
    // ========================================================================

    const mixedEdu1 = blendArrays(list1_1, list1_2, list1_3, 5);
    const mixedEdu2 = blendArrays(list2_1, list2_2, list2_3, 5);
    const mixedMateri = blendArrays(level1.materi, level2.materi, level3.materi, 6);
    const mixedKarir = blendArrays(data1.karir, data2.karir, data3.karir, 7);
    const mixedFreelance = blendArrays(data1.freelance, data2.freelance, data3.freelance, 5);
    const mixedLayanan = blendArrays(level1.layanan, level2.layanan, level3.layanan, 5);
    const mixedGuruBk = blendArrays(level1.guruBk, level2.guruBk, level3.guruBk, 4);
    const mixedSiswa = blendArrays(level1.siswa, level2.siswa, level3.siswa, 4);

    const dynamicConclusion = `Tipe dominan kamu adalah ${data1.title} (${data1.indonesianTitle}) dengan pola gabungan ${hyphenatedCodes}. ${data1.desc} Secara khusus, kamu memadukan dorongan utama dari ${dimensionDefs[code1].name}, gaya pendekatan ${dimensionDefs[code2].behavior}, serta didukung oleh insting ${dimensionDefs[code3].behavior}.`;

    let dominantTieMessage = null;
    if (isDominantTie) {
        const tieNames = dominantTies.map(t => riasecDictionary[t.code].indonesianTitle).join(" dan ");
        dominantTieMessage = `Luar biasa! Kamu memiliki skor tertinggi yang seimbang pada tipe ${tieNames}. Ini menunjukkan bahwa kamu adalah pribadi yang fleksibel. Jadikan ini keunggulanmu!`;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pb-12 font-sans">
            <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                <h1 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <Trophy className="text-blue-600" size={16} /> Laporan Asesmen ({schoolName} - Kelas {grade || '-'})
                </h1>
                <Link href="/student/dashboard" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Tutup</Link>
            </header>

            <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6 space-y-6">

                {transitionMessage && (
                    <div className="bg-linear-to-r from-blue-600 to-indigo-600 rounded-xl p-5 shadow-md flex items-center gap-4 text-white">
                        <div className="bg-white/20 p-3 rounded-full shrink-0">
                            <Target className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">Masa Transisi Pendidikan</h3>
                            <p className="text-sm text-blue-50 opacity-90">{transitionMessage}</p>
                        </div>
                    </div>
                )}

                <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                        <div className="h-20 w-20 bg-blue-50 border border-blue-100 rounded-2xl flex flex-col items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-blue-400 mb-1">PROFIL</span>
                            <span className="text-2xl font-black text-blue-700 tracking-widest">{hyphenatedCodes.replace(/-/g, '')}</span>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-bold text-slate-900 mb-3">Ringkasan Kesimpulan</h2>
                            <p className="text-slate-700 text-sm leading-relaxed mb-4">{dynamicConclusion}</p>

                            {dominantTieMessage && (
                                <div className="mb-4 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 flex items-start gap-2">
                                    <Star className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" />
                                    <p className="text-sm text-indigo-900 leading-relaxed font-medium">{dominantTieMessage}</p>
                                </div>
                            )}

                            {cutoffMotivationMessage && (
                                <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 flex items-start gap-2">
                                    <Activity className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                                    <p className="text-sm text-amber-900 leading-relaxed">{cutoffMotivationMessage}</p>
                                </div>
                            )}

                            {dominantTies.map((tie, index) => {
                                const tieData = riasecDictionary[tie.code];
                                return (
                                    <div key={tie.code} className={`pt-4 ${index > 0 ? "mt-4" : "mt-5 border-t border-slate-100"}`}>
                                        <h3 className="text-base font-bold text-slate-900 mb-1">Tipe Dominan: {tieData.title} ({tieData.indonesianTitle})</h3>
                                        <p className="text-slate-700 text-sm leading-relaxed">{tieData.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200">
                    <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-indigo-500" /> Detail Skor 6 Dimensi
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {sortedScores.map((score) => {
                            const percentage = Math.min((score.raw_score / 35) * 100, 100);
                            const dimInfo = dimensionDefs[score.code];
                            const sameScoreCodes = sortedScores.filter((item) => item.raw_score === score.raw_score && item.code !== score.code).map((item) => item.code);

                            return (
                                <div key={score.code} className="flex flex-col gap-2">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <span className="font-bold text-slate-800 text-sm">{dimInfo.name}</span>
                                            <p className="text-xs text-slate-500 mt-0.5">{dimInfo.meaning}</p>
                                            {sameScoreCodes.length > 0 && <p className="text-[11px] font-medium text-amber-600 mt-1">Skor sama dengan: {sameScoreCodes.join(', ')}</p>}
                                        </div>
                                        <span className="text-sm font-bold text-indigo-600">{score.raw_score}</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full bg-indigo-500 transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2"><School className="h-4 w-4 text-blue-500" /> {isTransisi ? "Fokus Lulusan" : "Pengembangan Diri"}</h4>

                        <div className="mb-4">
                            <span className="text-xs font-semibold text-slate-400 uppercase">{displayTitleEdu1}</span>
                            <ul className="mt-2 space-y-1">{mixedEdu1.map((item, i) => <li key={i} className="text-sm text-slate-700">• {item}</li>)}</ul>
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase">{displayTitleEdu2}</span>
                            <ul className="mt-2 space-y-1">{mixedEdu2.map((item, i) => <li key={i} className="text-sm text-slate-700">• {item}</li>)}</ul>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2"><Briefcase className="h-4 w-4 text-emerald-500" /> Karier & Usaha</h4>
                        <div className="mb-4">
                            <span className="text-xs font-semibold text-slate-400 uppercase">Pekerjaan Masa Depan</span>
                            <ul className="mt-2 space-y-1">{mixedKarir.map((item, i) => <li key={i} className="text-sm text-slate-700">• {item}</li>)}</ul>
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase">Peluang Pengembangan</span>
                            <ul className="mt-2 space-y-1">{mixedFreelance.map((item, i) => <li key={i} className="text-sm text-slate-700">• {item}</li>)}</ul>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2"><BookOpen className="h-4 w-4 text-amber-500" /> Pembelajaran</h4>
                        <div className="mb-4">
                            <span className="text-xs font-semibold text-slate-400 uppercase">Materi Pelajaran ({eduLvl})</span>
                            <ul className="mt-2 space-y-1">{mixedMateri.map((item, i) => <li key={i} className="text-sm text-slate-700">• {item}</li>)}</ul>
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase">Jenis Layanan Pendukung</span>
                            <ul className="mt-2 space-y-1">{mixedLayanan.map((item, i) => <li key={i} className="text-sm text-slate-700">• {item}</li>)}</ul>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-700">
                        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-600 pb-2"><HeartHandshake className="h-4 w-4 text-slate-300" /> Yang Perlu Dilakukan Guru / Orang Tua</h4>
                        <ul className="space-y-2">{mixedGuruBk.map((item, i) => <li key={i} className="text-sm text-slate-300 flex items-start gap-2"><ArrowRight className="h-4 w-4 shrink-0 mt-0.5 opacity-50" /> {item}</li>)}</ul>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-6 shadow-sm border border-blue-100">
                        <h4 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2 border-b border-blue-200 pb-2"><UserCheck className="h-4 w-4 text-blue-600" /> Yang Perlu Dilakukan Siswa</h4>
                        <ul className="space-y-2">{mixedSiswa.map((item, i) => <li key={i} className="text-sm text-blue-800 flex items-start gap-2"><Sparkles className="h-4 w-4 shrink-0 mt-0.5 opacity-50 text-blue-500" /> {item}</li>)}</ul>
                    </div>
                </div>

                <div className="pt-6 pb-12 flex justify-end">
                    <Link href="/student/dashboard" className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
                        Selesai <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </main>
        </div>
    );
}