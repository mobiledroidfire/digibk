// Lokasi file: src/app/student/dashboard/page.tsx

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { logoutAction } from '@/features/auth/actions/auth.actions';
import {
    User,
    GraduationCap,
    School,
    PlayCircle,
    CheckCircle2,
    FileText,
    LogOut,
    BrainCircuit,
    Clock
} from 'lucide-react';
import Link from 'next/link';

// 1. Mendefinisikan Tipe Data dengan Ketat (Tanpa 'any')
// Ini memberitahu TypeScript bentuk pasti dari data yang akan kita terima dari Supabase
type StudentData = {
    id: string;
    full_name: string;
    student_code: string;
    schools: { name: string } | null;
    class_memberships: {
        classes: { name: string } | null
    }[] | null;
};

export default async function StudentDashboardPage() {
    const supabase = await createClient();

    // 2. Validasi Sesi Pengguna
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    // 3. Ambil Data Profil Siswa (Join dengan tabel schools dan class_memberships)
    const { data, error: studentError } = await supabase
        .from('students')
        .select(`
            id,
            full_name,
            student_code,
            schools ( name ),
            class_memberships (
                classes ( name )
            )
        `)
        .eq('user_id', user.id)
        .single();

    if (studentError || !data) {
        // Jika data tidak ditemukan, bersihkan sesi yang nyangkut
        await supabase.auth.signOut();
        redirect('/login?error=Data siswa tidak ditemukan. Silakan login kembali.');
    }

    // 4. Casting Tipe Data: Kita pastikan data sesuai dengan tipe 'StudentData'
    const studentData = data as unknown as StudentData;

    // 5. Ekstraksi Data dengan Aman (TypeScript sekarang paham strukturnya)
    // Supabase mengembalikan object untuk relasi 1-to-1 (schools)
    const schoolName = studentData.schools
        ? studentData.schools.name
        : 'Sekolah Belum Diatur';

    // Supabase mengembalikan array untuk relasi 1-to-many (class_memberships)
    const className = studentData.class_memberships && studentData.class_memberships.length > 0 && studentData.class_memberships[0].classes
        ? studentData.class_memberships[0].classes.name
        : 'Kelas Belum Diatur';

    // 6. Ambil Status Asesmen RIASEC
    let assessmentStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' = 'NOT_STARTED';

    const { data: riasecVersion } = await supabase
        .from('assessment_versions')
        .select('id')
        .eq('version_code', 'RIASEC-MVP-v1')
        .single();

    if (riasecVersion) {
        const { data: sessionData } = await supabase
            .from('assessment_sessions')
            .select('status, completed_at')
            .eq('student_id', studentData.id)
            .eq('assessment_version_id', riasecVersion.id)
            .order('started_at', { ascending: false })
            .limit(1)
            .single();

        if (sessionData) {
            assessmentStatus = sessionData.status === 'COMPLETED' ? 'COMPLETED' : 'IN_PROGRESS';
        }
    }

    // 7. Render Tampilan (UI Premium)
    return (
        <div className="min-h-screen bg-slate-50 pb-12">
            {/* HEADER NAVBAR */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-6 w-6 text-blue-600" />
                        <span className="font-bold text-lg tracking-tight text-slate-900">DIGIBK</span>
                    </div>

                    <form action={logoutAction}>
                        <button
                            type="submit"
                            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Keluar</span>
                        </button>
                    </form>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">

                {/* KARTU PROFIL SISWA */}
                <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="h-20 w-20 rounded-full bg-blue-100 flex items-center justify-center shrink-0 ring-4 ring-slate-50">
                        <User className="h-10 w-10 text-blue-600" />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-slate-900">{studentData.full_name}</h1>
                        <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                                <School className="h-4 w-4 text-slate-400" />
                                <span>{schoolName}</span>
                            </div>
                            <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                            <div className="flex items-center gap-2">
                                <GraduationCap className="h-4 w-4 text-slate-400" />
                                <span>Kelas {className}</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* DAFTAR ASESMEN */}
                <section>
                    <h2 className="text-lg font-bold text-slate-900 mb-4">Tugas & Asesmen Anda</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* KARTU JURUS 1: RIASEC */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col h-full">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                        <BrainCircuit className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Jurus 1: Kenali Potensi</h3>
                                        <p className="text-xs text-slate-500 mt-0.5">Tes Minat Bakat RIASEC</p>
                                    </div>
                                </div>

                                {/* BADGE STATUS */}
                                {assessmentStatus === 'COMPLETED' && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20">
                                        <CheckCircle2 className="h-3 w-3" /> Selesai
                                    </span>
                                )}
                                {assessmentStatus === 'IN_PROGRESS' && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20">
                                        <Clock className="h-3 w-3" /> Belum Selesai
                                    </span>
                                )}
                                {assessmentStatus === 'NOT_STARTED' && (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                        Belum Dimulai
                                    </span>
                                )}
                            </div>

                            <p className="text-sm text-slate-600 mb-6 flex-1">
                                Kenali aktivitas apa saja yang paling cocok dengan kepribadianmu untuk merencanakan masa depan.
                            </p>

                            {/* ACTION BUTTONS */}
                            <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                                {assessmentStatus !== 'COMPLETED' ? (
                                    <Link
                                        href="/student/potential"
                                        className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors"
                                    >
                                        <PlayCircle className="h-4 w-4" />
                                        {assessmentStatus === 'IN_PROGRESS' ? 'Lanjutkan Asesmen' : 'Mulai Asesmen'}
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href="/student/potential/result"
                                            className="flex-1 inline-flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors"
                                        >
                                            Lihat Hasil
                                        </Link>
                                        <button
                                            disabled // Kita disable dulu karena fitur PDF akan kita buat nanti
                                            className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            title="Fitur Cetak PDF akan segera hadir"
                                        >
                                            <FileText className="h-4 w-4" />
                                            Unduh PDF
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Ruang untuk Jurus 2: Kelola Emosi */}
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 border-dashed flex flex-col items-center justify-center text-center h-full min-h-62.5">
                            <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center mb-3">
                                <span className="text-xl text-slate-400">🔒</span>
                            </div>
                            <h3 className="font-bold text-slate-700">Jurus 2: Kelola Emosi</h3>
                            <p className="text-sm text-slate-500 mt-2 max-w-50">
                                Akan terbuka setelah kamu menyelesaikan Jurus 1.
                            </p>
                        </div>

                    </div>
                </section>
            </main>
        </div>
    );
}