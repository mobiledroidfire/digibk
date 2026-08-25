// Lokasi file: /features/student/services/emotion.service.ts
import { createClient } from '@/lib/supabase/client';
import type { EmotionalCheckinPayload, EmotionalCheckinResponse } from '../types/emotion.types';

export const submitEmotionalCheckin = async (
    payload: EmotionalCheckinPayload
): Promise<EmotionalCheckinResponse> => {
    const supabase = createClient();

    // Logika pengiriman data ke tabel 'emotional_checkins'
    const { data, error } = await supabase
        .from('emotional_checkins')
        .insert([{
            student_id: payload.student_id,
            emotion: payload.emotion,
            intensity: payload.intensity,
            context: payload.context,
            coping_response: payload.coping_response, // PENTING: Sudah diganti menjadi coping_response
            wants_to_talk: payload.wants_to_talk
        }])
        .select()
        .single();

    if (error) {
        throw new Error(`Gagal menyimpan data emosi: ${error.message}`);
    }

    // Mengembalikan data dengan tipe yang sangat ketat
    return data as EmotionalCheckinResponse;
};