// Lokasi file: src/app/student/dashboard/page.tsx

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import {
    User, GraduationCap, School, PlayCircle,
    CheckCircle2, BrainCircuit,
    Clock, Lock, Activity, ShieldCheck,
    Target, Users, Handshake, Lightbulb
} from 'lucide-react';
import Link from 'next/link';

// Import komponen PrintPdfButton
import PrintPdfButton from '@/components/pdf/PrintPdfButton';
// Import komponen LogoutButton yang baru dibuat
import LogoutButton from '@/components/auth/LogoutButton';

// 1. Mendefinisikan Tipe Data
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

// Tipe khusus untuk mengatasi Error Overlap TypeScript
type AssessmentStatusType = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export default async function StudentDashboardPage() {
    const supabase = await createClient();

    // 2. Validasi Sesi Pengguna
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    // === Deteksi otomatis akun Tamu (Guest) ===
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

    const studentData = studentRaw as unknown as StudentData;
    const schoolName = studentData.schools?.name || 'Sekolah Belum Diatur';
    const className = studentData.class_memberships?.[0]?.classes?.name || 'Kelas Belum Diatur';

    // 4. Inisialisasi Status Asesmen
    let riasecStatus: AssessmentStatusType = 'NOT_STARTED';
    let varkStatus: AssessmentStatusType = 'NOT_STARTED'; // PERBAIKAN: Ubah nama variabel ke VARK

    // Ambil data sesi
    const { data: sessionsRaw } = await supabase
        .from('assessment_sessions')
        .select(`
            id,
            status,
            assessment_versions!inner ( assessments!inner ( code ) )
        `)
        .eq('student_id', studentData.id);

    // PERBAIKAN (Jaring Pengaman): Ambil data dari tabel hasil tes. 
    // Jika ada hasil, berarti tes PASTI sudah selesai, apa pun status sesinya.
    const { data: resultsRaw } = await supabase
        .from('assessment_results')
        .select('session_id')
        .eq('student_id', studentData.id);

    const completedSessionIds = resultsRaw?.map(r => r.session_id) || [];

    if (sessionsRaw) {
        const sessions = sessionsRaw as unknown as SessionData[];

        for (const session of sessions) {
            const code = session.assessment_versions?.assessments?.code;

            // Logika baru: Selesai jika statusnya COMPLETED ATAU ID sesi ada di tabel hasil
            const isCompleted = session.status === 'COMPLETED' || completedSessionIds.includes(session.id);
            const isProgress = session.status === 'IN_PROGRESS' && !isCompleted;

            // Pengecekan Status RIASEC
            if (code === 'RIASEC') {
                if (isCompleted) riasecStatus = 'COMPLETED';
                else if (riasecStatus !== 'COMPLETED' && isProgress) riasecStatus = 'IN_PROGRESS';
            }
            // Pengecekan Status VARK (PERBAIKAN: VAK menjadi VARK)
            else if (code === 'VARK') {
                if (isCompleted) varkStatus = 'COMPLETED';
                else if (varkStatus !== 'COMPLETED' && isProgress) varkStatus = 'IN_PROGRESS';
            }
        }
    }

    // 5. Data Konfigurasi untuk Jurus 2 sampai 7 (Terkunci)
    const lockedJurus = [
        { id: 2, title: "Kelola Emosi", icon: Activity, color: "text-rose-500", bg: "bg-rose-50" },
        { id: 3, title: "Tumbuhkan Resiliensi", icon: ShieldCheck, color: "text-orange-500", bg: "bg-orange-50" },
        { id: 4, title: "Jaga Konsistensi", icon: Target, color: "text-emerald-500", bg: "bg-emerald-50" },
        { id: 5, title: "Jalin Koneksi", icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
        { id: 6, title: "Bangun Kolaborasi", icon: Handshake, color: "text-blue-500", bg: "bg-blue-50" },
        { id: 7, title: "Menata Situasi", icon: Lightbulb, color: "text-amber-500", bg: "bg-amber-50" },
    ];

    // 6. Render Tampilan UI Modern
    return (
        <div className="min-h-screen bg-slate-50 pb-16 font-sans text-slate-900">
            {/* HEADER NAVBAR */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-600 p-1.5 rounded-lg">
                            <GraduationCap className="h-5 w-5 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-slate-900">DIGIBK</span>
                    </div>
                    <LogoutButton isGuestAccount={isGuest} />
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">

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
                            <div className="bg-slate-900 p-5 md:p-6 flex items-center gap-4">
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
                                        {riasecStatus === 'COMPLETED' ? <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200"><CheckCircle2 className="h-4 w-4" /> Selesai</span> : null}
                                        {riasecStatus === 'IN_PROGRESS' ? <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200"><Clock className="h-4 w-4" /> Tertunda</span> : null}
                                        {riasecStatus === 'NOT_STARTED' ? <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">Belum</span> : null}
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
                                                <PrintPdfButton
                                                    moduleType="RIASEC"
                                                    studentData={{
                                                        id: studentData.id,
                                                        name: studentData.full_name,
                                                        school: schoolName
                                                    }}
                                                />
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
                                        {varkStatus === 'COMPLETED' ? <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200"><CheckCircle2 className="h-4 w-4" /> Selesai</span> : null}
                                        {varkStatus === 'IN_PROGRESS' ? <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200"><Clock className="h-4 w-4" /> Tertunda</span> : null}
                                        {varkStatus === 'NOT_STARTED' ? <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-500 border border-slate-200">Belum</span> : null}
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
                                                <PrintPdfButton
                                                    moduleType="VAK"
                                                    studentData={{
                                                        id: studentData.id,
                                                        name: studentData.full_name,
                                                        school: schoolName
                                                    }}
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* JURUS 2 SAMPAI 7 (TERKUNCI) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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