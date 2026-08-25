// Lokasi file: /src/features/bk/actions/student-detail.actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import type { EmotionType } from '@/features/student/types/emotion.types';

// 1. Definisi struktur data profil lengkap (Untuk digunakan di UI)
export interface StudentFullProfile {
    id: string;
    full_name: string;
    student_code: string;
    class_name: string;
    riasec_result: {
        code: string;
        name: string;
    } | null;
    vark_result: {
        dominant: string;
    } | null;
    recent_emotions: {
        id: string;
        emotion: EmotionType;
        intensity: number;
        context: string;
        coping_response: string;
        created_at: string;
    }[];
}

// 2. Definisi Tipe Database Khusus agar bebas dari 'any'
type StudentWithClass = {
    id: string;
    full_name: string;
    student_code: string;
    school_id: string;
    class_memberships: { classes: { name: string } | null }[] | null;
};

type RiasecRecord = {
    code: string;
    profile_name: string | null;
};

type VarkRecord = {
    dominant_code: string;
};

type EmotionRecord = {
    id: string;
    emotion: EmotionType;
    intensity: number;
    context: string;
    coping_response: string;
    created_at: string;
};

export async function getStudentDetailAction(studentId: string): Promise<{ success: boolean; data?: StudentFullProfile; error?: string }> {
    const supabase = await createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Sesi tidak valid.');

        const { data: roleData } = await supabase
            .from('user_roles')
            .select('school_id, role')
            .eq('user_id', user.id)
            .in('role', ['BK_COUNSELOR', 'SCHOOL_ADMIN', 'SUPER_ADMIN'])
            .single();

        if (!roleData) throw new Error('Akses ditolak.');

        // Menggunakan .returns<StudentWithClass[]>() agar TypeScript paham strukturnya
        const { data: student, error: studentError } = await supabase
            .from('students')
            .select(`
                id, full_name, student_code, school_id,
                class_memberships ( classes ( name ) )
            `)
            .eq('id', studentId)
            .returns<StudentWithClass[]>()
            .single();

        if (studentError || !student) throw new Error('Siswa tidak ditemukan.');

        // Keamanan: Cek apakah Guru BK melihat siswa dari sekolahnya sendiri
        if (roleData.role !== 'SUPER_ADMIN' && student.school_id !== roleData.school_id) {
            throw new Error('Anda tidak memiliki hak akses ke data siswa ini.');
        }

        // Gunakan .maybeSingle() agar tidak error jika siswa belum tes
        const { data: riasecProfile } = await supabase
            .from('riasec_profiles')
            .select('code, profile_name, assessment_results!inner(student_id)')
            .eq('assessment_results.student_id', studentId)
            .order('created_at', { ascending: false })
            .limit(1)
            .returns<RiasecRecord[]>()
            .maybeSingle();

        const { data: varkProfile } = await supabase
            .from('vark_profiles')
            .select('dominant_code, assessment_results!inner(student_id)')
            .eq('assessment_results.student_id', studentId)
            .order('created_at', { ascending: false })
            .limit(1)
            .returns<VarkRecord[]>()
            .maybeSingle();

        const { data: emotions } = await supabase
            .from('emotional_checkins')
            .select('id, emotion, intensity, context, coping_response, created_at')
            .eq('student_id', studentId)
            .order('created_at', { ascending: false })
            .limit(5)
            .returns<EmotionRecord[]>();

        // 3. Merangkai data tanpa satupun peringatan 'any'
        return {
            success: true,
            data: {
                id: student.id,
                full_name: student.full_name,
                student_code: student.student_code,
                class_name: student.class_memberships?.[0]?.classes?.name || 'Belum Ada Kelas',
                riasec_result: riasecProfile ? {
                    code: riasecProfile.code,
                    name: riasecProfile.profile_name || 'Profil Tidak Diketahui'
                } : null,
                vark_result: varkProfile ? {
                    dominant: varkProfile.dominant_code
                } : null,
                recent_emotions: emotions || []
            }
        };

    } catch (error: unknown) {
        if (error instanceof Error) return { success: false, error: error.message };
        return { success: false, error: 'Terjadi kesalahan sistem.' };
    }
}