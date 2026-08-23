// Lokasi file: src/features/assessments/actions/vak.actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

// ============================================================================
// 1. DEFINISI TIPE DATA YANG KETAT
// ============================================================================
type DimensionRecord = {
    code: string;
};

type QuestionRecord = {
    id: string;
    question_text: string;
    dimension_id: string;
    assessment_dimensions: DimensionRecord | DimensionRecord[] | null;
};

// ============================================================================
// 2. FUNGSI MENGAMBIL SOAL VAK (DINAMIS SESUAI JENJANG)
// ============================================================================
export async function getVakQuestions() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        throw new Error('User belum login');
    }

    const { data: student, error: studentError } = await supabase
        .from('students')
        .select('education_level')
        .eq('user_id', user.id)
        .single();

    if (studentError || !student) {
        throw new Error('Data siswa tidak ditemukan di database.');
    }

    const eduLevel = student.education_level;

    // PETA JENJANG VAK: Mencocokkan jenjang siswa dengan versi soal VAK
    const versionMap: Record<string, string> = {
        'SD': 'VAK-SD-v1',
        'MI': 'VAK-MI-v1',
        'SMP': 'VAK-SMP-SMA-v1',
        'MTs': 'VAK-MTS-v1',
        'SMA': 'VAK-SMP-SMA-v1',
        'MA': 'VAK-MA-v1',
        'SMK': 'VAK-SMP-SMA-v1'
    };

    const targetVersionCode = versionMap[eduLevel as string];
    if (!targetVersionCode) {
        throw new Error(`Sistem belum memiliki versi soal untuk jenjang: ${eduLevel}`);
    }

    const { data: version } = await supabase
        .from('assessment_versions')
        .select('id')
        .eq('version_code', targetVersionCode)
        .single();

    if (!version) throw new Error(`Versi asesmen ${targetVersionCode} tidak ditemukan`);

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

    if (error || !questions) throw new Error('Gagal mengambil daftar soal VAK');

    const typedQuestions = questions as unknown as QuestionRecord[];

    return {
        versionId: version.id,
        questions: typedQuestions.map((q) => {
            const dim = q.assessment_dimensions;
            const dimCode = Array.isArray(dim) ? dim[0]?.code : dim?.code;

            return {
                id: q.id,
                text: q.question_text,
                dimensionId: q.dimension_id,
                dimensionCode: dimCode || ''
            };
        })
    };
}

// ============================================================================
// 3. FUNGSI MENYIMPAN JAWABAN & MENGHITUNG SKOR VAK
// ============================================================================
export async function submitVakAssessment(
    versionId: string,
    answers: { questionId: string; dimensionId: string; dimensionCode: string; value: number }[]
) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: student } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user.id)
        .single();

    if (!student) throw new Error('Data siswa tidak ditemukan');

    // Langkah A: Buat Sesi Asesmen
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

    if (sessionError || !session) throw new Error('Gagal membuat sesi asesmen VAK');
    const sessionId = session.id;

    // Langkah B: Simpan jawaban detail ke tabel assessment_responses
    const responsesToInsert = answers.map((ans) => ({
        session_id: sessionId,
        question_id: ans.questionId,
        numeric_value: ans.value
    }));
    await supabase.from('assessment_responses').insert(responsesToInsert);

    // Langkah C: Hitung Skor V, A, dan K
    const scores: Record<string, number> = { V: 0, A: 0, K: 0 };
    answers.forEach((ans) => {
        const code = ans.dimensionCode?.trim().toUpperCase();
        if (code && scores[code] !== undefined) {
            scores[code] += ans.value;
        }
    });

    // Langkah D: Buat Hasil Asesmen Induk
    const { data: result, error: resultError } = await supabase
        .from('assessment_results')
        .insert({
            session_id: sessionId,
            student_id: student.id,
            assessment_version_id: versionId,
            scoring_version: 'VAK-SCORING-v1',
            total_score: Object.values(scores).reduce((a, b) => a + b, 0)
        })
        .select('id')
        .single();

    if (resultError || !result) throw new Error(`Gagal menyimpan hasil VAK: ${resultError.message}`);
    const resultId = result.id;

    // Langkah E: Cari Gaya Belajar Dominan
    // DITAMBAHKAN TIE-BREAKER ALFABET AGAR KONSISTEN JIKA SKOR SERI
    const sortedScores = Object.entries(scores).sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1]; // Urutkan skor dari tertinggi ke terendah
        return a[0].localeCompare(b[0]);       // Jika seri, urutkan berdasarkan abjad (A, K, V)
    });

    const dominantCode = sortedScores[0][0]; // Juara 1
    const secondaryCode = sortedScores[1][0]; // Juara 2
    const tertiaryCode = sortedScores[2][0]; // Juara 3

    // Gabungkan kode (contoh: VAK, AVK, KVA)
    const profileCode = sortedScores.map(s => s[0]).join('');

    // Langkah F: Simpan ke tabel KHUSUS vak_profiles (Fitur V2 Database Anda)
    const { data: profile, error: profileError } = await supabase
        .from('vak_profiles')
        .insert({
            result_id: resultId,
            code: profileCode,
            dominant_code: dominantCode,
            secondary_code: secondaryCode,
            tertiary_code: tertiaryCode
        })
        .select('id')
        .single();

    if (profileError || !profile) throw new Error('Gagal menyimpan profil VAK.');
    const profileId = profile.id;

    // Langkah G: Simpan detail skor V, A, dan K ke tabel KHUSUS vak_results
    const vakResultsToInsert = Object.entries(scores).map(([code, score]) => ({
        vak_profile_id: profileId,
        code: code,
        raw_score: score
    }));
    await supabase.from('vak_results').insert(vakResultsToInsert);

    return resultId; // Mengembalikan ID untuk diarahkan ke halaman hasil
}