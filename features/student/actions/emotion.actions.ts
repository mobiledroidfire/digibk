// Lokasi file: /src/features/student/actions/emotion.actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { EmotionalCheckinPayload, EmotionalCheckinHistory } from '../types/emotion.types';

// 1. Logika untuk menyimpan Check-in Emosi
export async function submitEmotionAction(payload: EmotionalCheckinPayload) {
    const supabase = await createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Sesi tidak valid. Silakan login kembali.');

        const { data: student } = await supabase
            .from('students')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (!student) throw new Error('Data siswa tidak ditemukan.');

        const { error } = await supabase.from('emotional_checkins').insert([{
            student_id: student.id,
            emotion: payload.emotion,
            intensity: payload.intensity,
            context: payload.context,
            coping_response: payload.coping_response,
            help_seeking: payload.help_seeking,
            wants_to_talk: payload.wants_to_talk
        }]);

        if (error) throw new Error(`Gagal menyimpan: ${error.message}`);

        // Refresh cache halaman
        revalidatePath('/student/emotion');
        return { success: true };
    } catch (error: unknown) {
        if (error instanceof Error) return { success: false, error: error.message };
        return { success: false, error: 'Terjadi kesalahan sistem.' };
    }
}

// 2. Logika untuk mengambil Riwayat Emosi (KINI MENDUKUNG PAGINATION)
export async function getEmotionHistoryAction(page: number = 1, limit: number = 5): Promise<{ data: EmotionalCheckinHistory[], total: number }> {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { data: [], total: 0 };

    const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user.id)
        .single();

    if (!student) return { data: [], total: 0 };

    // Menghitung range untuk pagination database
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    // Mengambil data beserta total barisnya (count: 'exact')
    const { data, error, count } = await supabase
        .from('emotional_checkins')
        .select('*', { count: 'exact' })
        .eq('student_id', student.id)
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) return { data: [], total: 0 };

    return {
        data: data as EmotionalCheckinHistory[],
        total: count || 0
    };
}