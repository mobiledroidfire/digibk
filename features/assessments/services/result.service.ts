// src/features/assessments/services/result.service.ts

import { createClient } from '@/lib/supabase/server';

/**
 * Mengambil data hasil asesmen RIASEC (Single Source of Truth)
 */
export async function getRiasecResultData(studentId: string, resultId?: string) {
    const supabase = await createClient();

    // Query dasar
    let query = supabase
        .from('assessment_results')
        .select(`
            id, 
            riasec_profiles ( 
                code, primary_code, secondary_code, tertiary_code, 
                riasec_results ( code, raw_score ) 
            )
        `)
        .eq('student_id', studentId)
        // Sesuai dengan seed database: RIASEC-SCORING-v1
        .eq('scoring_version', 'RIASEC-SCORING-v1');

    // Jika ada ID spesifik (dari URL), gunakan ID tersebut. 
    // Jika tidak ada, ambil hasil yang paling baru.
    if (resultId) {
        query = query.eq('id', resultId);
    } else {
        query = query.order('calculated_at', { ascending: false }).limit(1);
    }

    const { data, error } = await query.single();

    if (error || !data) return null;

    // Bersihkan format array bentukan relasi Supabase
    const profile = Array.isArray(data.riasec_profiles) ? data.riasec_profiles[0] : data.riasec_profiles;

    if (!profile) return null;

    return { resultId: data.id, profile };
}

/**
 * Mengambil data hasil asesmen VARK (Single Source of Truth)
 */
export async function getVarkResultData(studentId: string, resultId?: string) {
    const supabase = await createClient();

    let query = supabase
        .from('assessment_results')
        .select(`
            id, total_score,
            vark_profiles ( 
                code, dominant_code, secondary_code, tertiary_code, quaternary_code,
                vark_results ( code, raw_score ) 
            )
        `)
        .eq('student_id', studentId)
        // Sesuai dengan seed database: VARK-SCORING-v1
        .eq('scoring_version', 'VARK-SCORING-v1');

    if (resultId) {
        query = query.eq('id', resultId);
    } else {
        query = query.order('calculated_at', { ascending: false }).limit(1);
    }

    const { data, error } = await query.single();

    if (error || !data) return null;

    const profile = Array.isArray(data.vark_profiles) ? data.vark_profiles[0] : data.vark_profiles;

    if (!profile) return null;

    return { resultId: data.id, profile, total_score: data.total_score };
}