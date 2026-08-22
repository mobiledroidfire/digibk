// Lokasi: src/features/assessments/actions/riasec.actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

// Definisi tipe data balikan dari database untuk menghindari 'any'
type QuestionRecord = {
    id: string;
    question_text: string;
    dimension_id: string;
    assessment_dimensions: { code: string } | null;
};

// Mengambil daftar pertanyaan dari database
export async function getRiasecQuestions() {
    const supabase = await createClient();

    // Ambil ID versi asesmen MVP
    const { data: version } = await supabase
        .from('assessment_versions')
        .select('id')
        .eq('version_code', 'RIASEC-MVP-v1')
        .single();

    if (!version) throw new Error('Versi asesmen tidak ditemukan');

    // Ambil 42 soal beserta kode dimensinya
    const { data: questions, error } = await supabase
        .from('questions')
        .select(`
            id,
            question_text,
            dimension_id,
            assessment_dimensions ( code )
        `)
        .eq('assessment_version_id', version.id)
        .order('display_order');

    if (error || !questions) throw new Error('Gagal mengambil soal');

    // Casting hasil query ke tipe yang ketat
    const typedQuestions = questions as unknown as QuestionRecord[];

    // Format ulang data agar lebih mudah digunakan di Frontend (tanpa any)
    return {
        versionId: version.id,
        questions: typedQuestions.map((q) => ({
            id: q.id,
            text: q.question_text,
            dimensionId: q.dimension_id,
            // Fallback aman jika relasi gagal
            dimensionCode: q.assessment_dimensions?.code || ''
        }))
    };
}

// Menyimpan jawaban dan memproses skor akhir
export async function submitRiasecAssessment(
    versionId: string,
    answers: { questionId: string; dimensionId: string; dimensionCode: string; value: number }[]
) {
    const supabase = await createClient();

    // 1. Dapatkan data siswa yang sedang login
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user.id)
        .single();

    if (!student) throw new Error('Data siswa tidak ditemukan');

    // 2. Buat Sesi Asesmen baru
    const { data: session, error: sessionError } = await supabase
        .from('assessment_sessions')
        .insert({
            student_id: student.id,
            assessment_version_id: versionId,
            status: 'COMPLETED',
            completed_at: new Date().toISOString()
        })
        .select('id')
        .single();

    if (sessionError || !session) throw new Error('Gagal membuat sesi');
    const sessionId = session.id;

    // 3. Simpan semua jawaban (Responses)
    const responsesToInsert = answers.map((ans) => ({
        session_id: sessionId,
        question_id: ans.questionId,
        numeric_value: ans.value
    }));
    await supabase.from('assessment_responses').insert(responsesToInsert);

    // 4. Kalkulasi Skor Mentah (Raw Score) per Dimensi
    const scores: Record<string, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    answers.forEach((ans) => {
        if (scores[ans.dimensionCode] !== undefined) {
            scores[ans.dimensionCode] += ans.value;
        }
    });

    // 5. Buat Hasil Asesmen Induk (Result)
    const { data: result, error: resultError } = await supabase
        .from('assessment_results')
        .insert({
            session_id: sessionId,
            student_id: student.id,
            assessment_version_id: versionId,
            scoring_version: 'RIASEC-SCORING-v1',
            total_score: Object.values(scores).reduce((a, b) => a + b, 0)
        })
        .select('id')
        .single();

    if (resultError || !result) {
        throw new Error(`Gagal menyimpan hasil: ${resultError?.message}`);
    }
    const resultId = result.id;

    // 6. Tentukan 3 Kode Teratas (Top 3 Profile)
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const top3Code = sortedScores.slice(0, 3).map((s) => s[0]).join('');

    // 7. Simpan Profil RIASEC
    const { data: profile, error: profileError } = await supabase
        .from('riasec_profiles')
        .insert({
            result_id: resultId,
            code: top3Code,
            primary_code: sortedScores[0][0],
            secondary_code: sortedScores[1][0],
            tertiary_code: sortedScores[2][0]
        })
        .select('id')
        .single();

    if (profileError || !profile) throw new Error('Gagal menyimpan profil.');
    const profileId = profile.id;

    // 8. Simpan Skor Detail per Dimensi
    const riasecResultsToInsert = Object.entries(scores).map(([code, score]) => ({
        riasec_profile_id: profileId,
        code: code,
        raw_score: score
    }));
    await supabase.from('riasec_results').insert(riasecResultsToInsert);

    // Selesai! Kembalikan ID hasil untuk diarahkan ke halaman laporan
    return resultId;
}