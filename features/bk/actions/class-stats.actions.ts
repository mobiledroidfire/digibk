// Lokasi file: /src/features/bk/actions/class-stats.actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';

// --- DEFINISI TIPE DATA YANG KETAT (TANPA 'any') ---
interface VarkProfileObj {
    code: string;
    dominant_code: string;
}

interface RiasecProfileObj {
    primary_code: string;
}

// Supabase bisa mengembalikan relasi sebagai objek tunggal atau array
interface AssessmentWithVark {
    student_id: string;
    vark_profiles: VarkProfileObj | VarkProfileObj[] | null;
}

interface AssessmentWithRiasec {
    student_id: string;
    riasec_profiles: RiasecProfileObj | RiasecProfileObj[] | null;
}

// ==================================================
// 1. STATISTIK VARK
// ==================================================
export async function getVarkClassStatsAction(classId: string) {
    const supabase = await createClient();

    try {
        // TAHAP 1: Ambil ID siswa di kelas
        const { data: memberships, error: memberError } = await supabase
            .from('class_memberships')
            .select('student_id')
            .eq('class_id', classId);

        if (memberError) throw new Error(memberError.message);
        const studentIds = memberships?.map(m => m.student_id) || [];
        if (studentIds.length === 0) return { success: true, data: [] };

        // TAHAP 2: Query langsung ke assessment_results (Lebih kuat & anti-gagal)
        const { data: results, error } = await supabase
            .from('assessment_results')
            .select(`
                student_id,
                vark_profiles!inner ( code, dominant_code )
            `)
            .eq('scoring_version', 'VARK-SCORING-v1')
            .in('student_id', studentIds)
            .returns<AssessmentWithVark[]>(); // <-- Type Safety diterapkan di sini

        if (error) throw new Error(error.message);

        let stats = { Visual: 0, Auditori: 0, ReadWrite: 0, Kinestetik: 0, Multimodal: 0 };
        const processedStudents = new Set<string>();

        // TAHAP 3: Hitung statistik dengan aman
        results?.forEach(result => {
            const studentId = result.student_id;

            if (studentId && !processedStudents.has(studentId)) {
                processedStudents.add(studentId);

                // Tangani bentuk data relasi dengan aman tanpa any
                const profile = Array.isArray(result.vark_profiles)
                    ? result.vark_profiles[0]
                    : result.vark_profiles;

                if (profile && profile.code) {
                    if (profile.code.length > 1) {
                        stats.Multimodal += 1;
                    } else {
                        if (profile.dominant_code === 'V') stats.Visual += 1;
                        if (profile.dominant_code === 'A') stats.Auditori += 1;
                        if (profile.dominant_code === 'R') stats.ReadWrite += 1;
                        if (profile.dominant_code === 'K') stats.Kinestetik += 1;
                    }
                }
            }
        });

        const chartData = [
            { name: 'Visual', value: stats.Visual, fill: '#3b82f6' },
            { name: 'Auditori', value: stats.Auditori, fill: '#10b981' },
            { name: 'Read/Write', value: stats.ReadWrite, fill: '#f59e0b' },
            { name: 'Kinestetik', value: stats.Kinestetik, fill: '#ef4444' },
            { name: 'Multimodal', value: stats.Multimodal, fill: '#8b5cf6' }
        ].filter(item => item.value > 0);

        return { success: true, data: chartData };
    } catch (error: unknown) {
        return { success: false, error: 'Gagal mengambil statistik VARK kelas.' };
    }
}

// ==================================================
// 2. STATISTIK RIASEC
// ==================================================
export async function getRiasecClassStatsAction(classId: string) {
    const supabase = await createClient();

    try {
        // TAHAP 1: Ambil ID siswa di kelas
        const { data: memberships, error: memberError } = await supabase
            .from('class_memberships')
            .select('student_id')
            .eq('class_id', classId);

        if (memberError) throw new Error(memberError.message);
        const studentIds = memberships?.map(m => m.student_id) || [];
        if (studentIds.length === 0) return { success: true, data: [] };

        // TAHAP 2: Query langsung ke assessment_results
        const { data: results, error } = await supabase
            .from('assessment_results')
            .select(`
                student_id,
                riasec_profiles!inner ( primary_code )
            `)
            .eq('scoring_version', 'RIASEC-SCORING-v1')
            .in('student_id', studentIds)
            .returns<AssessmentWithRiasec[]>(); // <-- Type Safety diterapkan di sini

        if (error) throw new Error(error.message);

        let stats = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
        const processedStudents = new Set<string>();

        // TAHAP 3: Hitung statistik dengan aman
        results?.forEach(result => {
            const studentId = result.student_id;

            if (studentId && !processedStudents.has(studentId)) {
                processedStudents.add(studentId);

                // Tangani bentuk data relasi dengan aman tanpa any
                const profile = Array.isArray(result.riasec_profiles)
                    ? result.riasec_profiles[0]
                    : result.riasec_profiles;

                if (profile && profile.primary_code) {
                    const code = profile.primary_code;
                    if (code === 'R') stats.R += 1;
                    else if (code === 'I') stats.I += 1;
                    else if (code === 'A') stats.A += 1;
                    else if (code === 'S') stats.S += 1;
                    else if (code === 'E') stats.E += 1;
                    else if (code === 'C') stats.C += 1;
                }
            }
        });

        const chartData = [
            { name: 'Realistic', short: 'R', value: stats.R, fill: '#ef4444' },
            { name: 'Investigative', short: 'I', value: stats.I, fill: '#f59e0b' },
            { name: 'Artistic', short: 'A', value: stats.A, fill: '#10b981' },
            { name: 'Social', short: 'S', value: stats.S, fill: '#3b82f6' },
            { name: 'Enterprising', short: 'E', value: stats.E, fill: '#8b5cf6' },
            { name: 'Conventional', short: 'C', value: stats.C, fill: '#64748b' }
        ].filter(item => item.value > 0);

        return { success: true, data: chartData };
    } catch (error: unknown) {
        return { success: false, error: 'Gagal mengambil statistik RIASEC kelas.' };
    }
}