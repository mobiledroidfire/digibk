// src/features/assessments/actions/vak.actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type DimensionRecord = { code: string; };
type QuestionRecord = {
    id: string;
    question_text: string;
    dimension_id: string;
    assessment_dimensions: DimensionRecord | DimensionRecord[] | null;
};

export async function getVakQuestions() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User belum login');

    const { data: student, error: studentError } = await supabase
        .from('students')
        .select('education_level')
        .eq('user_id', user.id)
        .single();

    if (studentError || !student) throw new Error('Data siswa tidak ditemukan di database.');

    const versionMap: Record<string, string> = {
        'SD': 'VAK-SD-v1',
        'MI': 'VAK-MI-v1',
        'SMP': 'VAK-SMP-SMA-v1',
        'MTs': 'VAK-MTS-v1',
        'SMA': 'VAK-SMP-SMA-v1',
        'MA': 'VAK-MA-v1',
        'SMK': 'VAK-SMP-SMA-v1'
    };

    const targetVersionCode = versionMap[student.education_level];
    if (!targetVersionCode) throw new Error(`Sistem belum memiliki versi soal untuk jenjang: ${student.education_level}`);

    const { data: version } = await supabase
        .from('assessment_versions')
        .select('id')
        .eq('version_code', targetVersionCode)
        .single();

    if (!version) throw new Error(`Versi asesmen ${targetVersionCode} tidak ditemukan`);

    const { data: questions, error } = await supabase
        .from('questions')
        .select(`id, question_text, dimension_id, assessment_dimensions ( code )`)
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

    const responsesToInsert = answers.map((ans) => ({
        session_id: sessionId,
        question_id: ans.questionId,
        numeric_value: ans.value
    }));
    await supabase.from('assessment_responses').insert(responsesToInsert);

    const scores: Record<string, number> = { V: 0, A: 0, K: 0 };
    answers.forEach((ans) => {
        const code = ans.dimensionCode?.trim().toUpperCase();
        if (code && scores[code] !== undefined) {
            scores[code] += ans.value;
        }
    });

    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

    const sortedScores = Object.entries(scores).sort((a, b) => {
        if (b[1] !== a[1]) return b[1] - a[1];
        return a[0].localeCompare(b[0]); // Tie-breaker alfabet
    });

    const dominantCode = sortedScores[0][0];
    const secondaryCode = sortedScores[1][0];
    const tertiaryCode = sortedScores[2][0];
    const profileCode = sortedScores.map(s => s[0]).join('');

    // Simpan ke database via Admin Client
    const { data: result, error: resultError } = await supabaseAdmin
        .from('assessment_results')
        .insert({
            session_id: sessionId,
            student_id: student.id,
            assessment_version_id: versionId,
            scoring_version: 'VAK-SCORING-v1',
            total_score: totalScore,
            profile_code: profileCode
        })
        .select('id')
        .single();

    if (resultError || !result) throw new Error(`Gagal menyimpan hasil VAK: ${resultError.message}`);

    const { data: profile, error: profileError } = await supabaseAdmin
        .from('vak_profiles')
        .insert({
            result_id: result.id,
            code: profileCode,
            dominant_code: dominantCode,
            secondary_code: secondaryCode,
            tertiary_code: tertiaryCode
        })
        .select('id')
        .single();

    if (profileError || !profile) throw new Error('Gagal menyimpan profil VAK.');

    const vakResultsToInsert = Object.entries(scores).map(([code, score]) => ({
        vak_profile_id: profile.id,
        code: code,
        raw_score: score
    }));

    await supabaseAdmin.from('vak_results').insert(vakResultsToInsert);

    return result.id;
}