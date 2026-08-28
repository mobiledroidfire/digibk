// Lokasi file: /src/features/bk/actions/student-detail.actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import type { EmotionType } from '@/features/student/types/emotion.types';
import type { ChartScoreItem, VarkChartScoreItem } from '@/features/student/types/result.types';
import {
    assembleRiasecProfile,
    assembleVarkProfile,
    type RiasecProfileRaw,
    type VarkProfileRaw,
    type AssembledRiasecResult,
    type AssembledVarkResult
} from '../services/student-profile.service';

export type ScoreItem = ChartScoreItem;
export type VarkScoreItem = VarkChartScoreItem;

export interface StudentFullProfile {
    id: string;
    full_name: string;
    student_code: string;
    class_name: string;
    riasec_result: AssembledRiasecResult | null;
    vark_result: AssembledVarkResult | null;
    recent_emotions: {
        id: string;
        emotion: EmotionType;
        intensity: number;
        context: string;
        coping_response: string;
        created_at: string;
    }[];
}

type StudentWithClass = {
    id: string;
    full_name: string;
    student_code: string;
    school_id: string;
    class_memberships: { classes: { name: string } | null }[] | null;
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

        const { data: student, error: studentError } = await supabase
            .from('students')
            .select(`id, full_name, student_code, school_id, class_memberships ( classes ( name ) )`)
            .eq('id', studentId)
            .returns<StudentWithClass[]>()
            .single();

        if (studentError || !student) throw new Error('Siswa tidak ditemukan.');
        if (roleData.role !== 'SUPER_ADMIN' && student.school_id !== roleData.school_id) {
            throw new Error('Anda tidak memiliki hak akses ke data siswa ini.');
        }

        // Ambil data hasil tes & emosi dari database
        const { data: riasecData } = await supabase
            .from('riasec_profiles')
            .select('code, primary_code, secondary_code, tertiary_code, riasec_results(code, raw_score), assessment_results!inner(student_id)')
            .eq('assessment_results.student_id', studentId)
            .order('created_at', { ascending: false })
            .limit(1)
            .returns<RiasecProfileRaw[]>()
            .maybeSingle();

        const { data: varkData } = await supabase
            .from('vark_profiles')
            .select('code, dominant_code, vark_results(code, raw_score), assessment_results!inner(student_id)')
            .eq('assessment_results.student_id', studentId)
            .order('created_at', { ascending: false })
            .limit(1)
            .returns<VarkProfileRaw[]>()
            .maybeSingle();

        const { data: emotions } = await supabase
            .from('emotional_checkins')
            .select('id, emotion, intensity, context, coping_response, created_at')
            .eq('student_id', studentId)
            .order('created_at', { ascending: false })
            .limit(10)
            .returns<EmotionRecord[]>();

        // Delegasikan logika perakitan ke Service Layer (Separation of Concerns)
        const finalRiasec = assembleRiasecProfile(riasecData);
        const finalVark = assembleVarkProfile(varkData);

        return {
            success: true,
            data: {
                id: student.id,
                full_name: student.full_name,
                student_code: student.student_code,
                class_name: student.class_memberships?.[0]?.classes?.name || 'Belum Ada Kelas',
                riasec_result: finalRiasec,
                vark_result: finalVark,
                recent_emotions: emotions || []
            }
        };
    } catch (error: unknown) {
        if (error instanceof Error) return { success: false, error: error.message };
        return { success: false, error: 'Terjadi kesalahan sistem.' };
    }
}