// Lokasi file: src/app/student/dashboard/page.tsx

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import {
    User, GraduationCap, School, PlayCircle,
    CheckCircle2, BrainCircuit,
    Clock, Lock, Activity, ShieldCheck,
    Target, Users, Handshake, Lightbulb, Heart
} from 'lucide-react';
import Link from 'next/link';

import PrintPdfButton from '@/components/pdf/PrintPdfButton';
import LogoutButton from '@/components/auth/LogoutButton';

// 1. Mendefinisikan Tipe Data Secara Ketat
type StudentData = {
    id: string;
    full_name: string;
    student_code: string;
    schools: { name: string } | null;
    class_memberships: { classes: { name: string } | null }[] | null;
};

type SessionData = {
    id: string;
    status: string;
    assessment_versions: { assessments: { code: string; } }
};

type AssessmentStatusType = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export default async function StudentDashboardPage() {
    const supabase = await createClient();

    // 2. Validasi Sesi Pengguna
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const isGuest = user.user_metadata?.is_guest === true;

    // 3. Ambil Data Profil Siswa
    const { data: studentRaw, error: studentError } = await supabase
        .from('students')
        .select(`
            id, full_name, student_code,
            schools ( name ), class_memberships ( classes ( name ) )
        `)
        .eq('user_id', user.id)
        .single();

    if (studentError || !studentRaw) {
        await supabase.auth.signOut();
        redirect('/login?error=Data siswa tidak ditemukan.');
    }

    // Penegasan tipe (Type Assertion) yang aman karena kita sudah mendefinisikan strukturnberwarna-warni
    const studentData = studentRaw as unknown as StudentData;
    const schoolName = studentData.schools?.name || 'Sekolah Belum Diatur';
    const className = studentData.class_memberships?.[0]?.classes?.name || 'Kelas Belum Diatur';

    // 4. Inisialisasi Status Asesmen Jurus 1
    let riasecStatus: AssessmentStatusType = 'NOT_STARTED';
    let varkStatus: AssessmentStatusType = 'NOT_STARTED';

    const { data: sessionsRaw } = await supabase
        .from('assessment_sessions')
        .select(`
            id,
            status,
            assessment_versions!inner ( assessments!inner ( code ) )
        `)
        .eq('student_id', studentData.id);

    const { data: resultsRaw } = await supabase
        .from('assessment_results')
        .select('session_id')
        .eq('student_id', studentData.id);

    const completedSessionIds = resultsRaw?.map(r => r.session_id) || [];

    if (sessionsRaw) {
        const sessions = sessionsRaw as unknown as SessionData[];

        for (const session of sessions) {
            const code = session.assessment_versions?.assessments?.code;
            const isCompleted = session.status === 'COMPLETED' || completedSessionIds.includes(session.id);
            const isProgress = session.status === 'IN_PROGRESS' && !isCompleted;

            if (code === 'RIASEC') {
                if (isCompleted) riasecStatus = 'COMPLETED';
                else if (riasecStatus !== 'COMPLETED' && isProgress) riasecStatus = 'IN_PROGRESS';
            }
            else if (code === 'VARK') {
                if (isCompleted) varkStatus = 'COMPLETED';
                else if (varkStatus !== 'COMPLETED' && isProgress) varkStatus = 'IN_PROGRESS';
            }
        }
    }

    // 5. Cek apakah Jurus 1 sudah selesai semua untuk membuka Jurus 2
    const isJurus1Completed = riasecStatus === 'COMPLETED' && varkStatus === 'COMPLETED';

    // Jurus 3 sampai 7 yang masih dikunci
    const lockedJurus = [
        { id: 3, title: "Tumbuhkan Resiliensi", icon: ShieldCheck, color: "text-orange-500", bg: "bg-orange-50" },
        { id: 4, title: "Jaga Konsistensi", icon: Target, color: "text-emerald-500", bg: "bg-emerald-50" },
        { id: 5, title: "Jalin Koneksi", icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
        { id: 6, title: "Bangun Kolaborasi", icon: Handshake, color: "text-blue-500", bg: "bg-blue-50" },
        { id: 7, title: "Menata Situasi", icon: Lightbulb, color: "text-amber-500", bg: "bg-amber-50" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 pb-16 font-sans text-slate-900">
            <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-4 shadow-sm">
                <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-500/20 p-1.5 rounded-lg border border-blue-500/30">
                            <GraduationCap className="h-5 w-5 text-blue-400" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">DIGIBK</span>
                    </div>
                    <LogoutButton isGuestAccount={isGuest} studentNisn={studentData.student_code} />
                </div>
            </header>

            <div className="bg-slate-900 pt-8 pb-28 px-4 sm:px-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <h2 className="text-3xl font-bold text-white tracking-tight mb-2">Dashboard Siswa</h2>
                    <p className="text-slate-400">Selamat datang kembali, kelola aktivitas asesmenmu di sini.</p>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 relative z-20 space-y-8">
                {/* KARTU PROFIL SISWA */}
                <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-6 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60 z-0"></div>
                    <div className="h-20 w-20 rounded-full bg-linear-to-br from-blue-100 to-indigo-100 flex items-center justify-center shrink-0 border border-blue-200 z-10 shadow-inner">
                        <User className="h-10 w-10 text-blue-600" />
                    </div>
                    <div className="flex-1 z-10">
                        <h1 className="text-2xl font-bold text-slate-900">{studentData.full_name}</h1>
                        <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-slate-600 font-medium">
                            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-md">
                                <School className="h-4 w-4 text-blue-500" />
                                <span>{schoolName}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-md">
                                <GraduationCap className="h-4 w-4 text-indigo-500" />
                                <span>Kelas {className}</span>
                            </div>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-800 mb-6">Peta Perjalananmu (7 Jurus)</h2>
                    <div className="flex flex-col gap-6">

                        {/* JURUS 1: SATU BINGKAI BESAR UNTUK RIASEC & VARK */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-slate-900 p-5 md:p-6 flex items-center gap-4 border-b border-slate-800">
                                <div className="h-12 w-12 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/30 shrink-0">
                                    <BrainCircuit className="h-6 w-6 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Jurus 1: Kenali Potensi</h3>
                                    <p className="text-sm text-slate-400 mt-1">Selesaikan dua asesmen dasar ini untuk membuka kunci ke jurus berikutnya.</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                                {/* Modul 1: RIASEC */}
                                <div className="p-6 md:p-8 flex flex-col h-full bg-slate-50/50">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-lg">1. Minat & Bakat (RIASEC)</h4>
                                            <p className="text-sm text-slate-500 mt-1 mb-6">Kenali potensi karir dan penjurusan yang sesuai dengan kepribadianmu.</p>
                                        </div>
                                        {riasecStatus === 'COMPLETED' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200"><CheckCircle2 className="h-4 w-4" /> Selesai</span>}
                                        {riasecStatus === 'IN_PROGRESS' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200"><Clock className="h-4 w-4" /> Tertunda</span>}
                                        {riasecStatus === 'NOT_STARTED' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">Belum</span>}
                                    </div>
                                    <div className="mt-auto flex flex-col sm:flex-row gap-3">
                                        {riasecStatus !== 'COMPLETED' ? (
                                            <Link href="/student/potential" className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm">
                                                <PlayCircle className="h-4 w-4" /> {riasecStatus === 'IN_PROGRESS' ? 'Lanjutkan' : 'Mulai Tes'}
                                            </Link>
                                        ) : (
                                            <>
                                                <Link href="/student/potential/result" className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-sm font-bold py-2.5 px-4 rounded-xl transition-colors">
                                                    Lihat Hasil
                                                </Link>
                                                <PrintPdfButton moduleType="RIASEC" studentData={{ id: studentData.id, name: studentData.full_name, school: schoolName }} />
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Modul 2: VARK */}
                                <div className="p-6 md:p-8 flex flex-col h-full bg-white">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h4 className="font-bold text-slate-800 text-lg">2. Gaya Belajar (VARK)</h4>
                                            <p className="text-sm text-slate-500 mt-1 mb-6">Ketahui cara belajar paling efektif: Visual, Auditori, Reading, atau Kinestetik.</p>
                                        </div>
                                        {varkStatus === 'COMPLETED' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200"><CheckCircle2 className="h-4 w-4" /> Selesai</span>}
                                        {varkStatus === 'IN_PROGRESS' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200"><Clock className="h-4 w-4" /> Tertunda</span>}
                                        {varkStatus === 'NOT_STARTED' && <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">Belum</span>}
                                    </div>
                                    <div className="mt-auto flex flex-col sm:flex-row gap-3">
                                        {varkStatus !== 'COMPLETED' ? (
                                            <Link href="/student/learning-style" className="flex-1 inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm">
                                                <PlayCircle className="h-4 w-4" /> {varkStatus === 'IN_PROGRESS' ? 'Lanjutkan' : 'Mulai Tes'}
                                            </Link>
                                        ) : (
                                            <>
                                                <Link href="/student/learning-style/result" className="flex-1 inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-sm font-bold py-2.5 px-4 rounded-xl transition-colors">
                                                    Lihat Hasil
                                                </Link>
                                                <PrintPdfButton moduleType="VARK" studentData={{ id: studentData.id, name: studentData.full_name, school: schoolName }} />
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* JURUS 2 SAMPAI 7 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {/* LOGIKA JURUS 2: Terbuka jika isJurus1Completed bernilai True */}
                            {isJurus1Completed ? (
                                <Link href="/student/emotion" className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-rose-300 flex flex-col h-full min-h-64 relative transition-all duration-300">
                                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                                        <div className="h-16 w-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-4 border border-rose-100 shadow-xs group-hover:scale-110 transition-transform">
                                            <Heart className="h-8 w-8 text-rose-500" />
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-800">Jurus 2</h3>
                                        <p className="font-semibold text-rose-600 mt-1">Kelola Emosi</p>
                                        <p className="text-xs text-slate-500 mt-4 px-2">Bagaimana perasaanmu hari ini? Yuk, ceritakan kondisimu.</p>
                                    </div>
                                    <div className="absolute top-4 right-4 bg-rose-100 text-rose-600 p-1.5 rounded-full">
                                        <PlayCircle className="h-4 w-4" />
                                    </div>
                                </Link>
                            ) : (
                                <div className="bg-slate-100/50 rounded-2xl p-6 border border-slate-200 border-dashed flex flex-col h-full min-h-64 relative group overflow-hidden">
                                    <div className="absolute top-4 right-4 p-2 bg-white/50 rounded-lg">
                                        <Lock className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                                        <div className="h-16 w-16 rounded-2xl bg-rose-50 flex items-center justify-center mb-4 border border-white shadow-xs">
                                            <Activity className="h-8 w-8 text-rose-500 opacity-60" />
                                        </div>
                                        <h3 className="font-bold text-lg text-slate-600">Jurus 2</h3>
                                        <p className="font-semibold text-slate-700 mt-1">Kelola Emosi</p>
                                        <span className="text-xs font-medium bg-rose-100 text-rose-600 px-3 py-1 rounded-full mt-4">
                                            Kunci: Selesaikan Jurus 1
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* JURUS 3-7 (TERKUNCI) */}
                            {lockedJurus.map((jurus) => {
                                const IconComponent = jurus.icon;
                                return (
                                    <div key={jurus.id} className="bg-slate-100/50 rounded-2xl p-6 border border-slate-200 border-dashed flex flex-col h-full min-h-64 relative group overflow-hidden">
                                        <div className="absolute top-4 right-4 p-2 bg-white/50 rounded-lg">
                                            <Lock className="h-4 w-4 text-slate-400" />
                                        </div>
                                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                                            <div className={`h-16 w-16 rounded-2xl ${jurus.bg} flex items-center justify-center mb-4 border border-white shadow-xs`}>
                                                <IconComponent className={`h-8 w-8 ${jurus.color} opacity-60`} />
                                            </div>
                                            <h3 className="font-bold text-lg text-slate-600">Jurus {jurus.id}</h3>
                                            <p className="font-semibold text-slate-700 mt-1">{jurus.title}</p>
                                            <span className="text-xs font-medium bg-slate-200 text-slate-500 px-3 py-1 rounded-full mt-4">
                                                Segera Hadir
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}