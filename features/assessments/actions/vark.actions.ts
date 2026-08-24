// Lokasi file: src/features/assessments/actions/vark.actions.ts

"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import type { VarkProfile } from "@/types/database";

// ============================================================
// ADMIN CLIENT
// ============================================================

const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ============================================================
// TYPES
// ============================================================

// Mengambil tipe 'V' | 'A' | 'R' | 'K' langsung dari database.ts
type VarkCode = VarkProfile['dominant_code'];

type DimensionRecord = {
    code: string;
};

type QuestionRecord = {
    id: string;
    question_text: string;
    dimension_id: string;
    assessment_version_id: string;
    display_order: number;
    assessment_dimensions:
    | DimensionRecord
    | DimensionRecord[]
    | null;
};

type VarkAnswer = {
    questionId: string;
    value: number;
};

// ============================================================
// CONFIG
// ============================================================

const VARK_CODES: VarkCode[] = ["V", "A", "R", "K"];

const VARK_EXPECTED_QUESTIONS = 20;
const VARK_SCORE_MIN = 1;
const VARK_SCORE_MAX = 5;
const VARK_SCORING_VERSION = "VARK-SCORING-v1";

// ============================================================
// VERSION MAP
// ============================================================

const VARK_VERSION_MAP: Record<string, string> = {
    SD: "VARK-SD-v1",
    MI: "VARK-MI-v1",
    SMP: "VARK-SMP-v1", // <-- Perbaikan (sebelumnya VARK-SMP-SMA-v1)
    MTs: "VARK-MTs-v1",
    SMA: "VARK-SMA-v1", // <-- Perbaikan (sebelumnya VARK-SMP-SMA-v1)
    MA: "VARK-MA-v1",
    SMK: "VARK-SMK-v1",
};

// ============================================================
// HELPER
// ============================================================

function normalizeDimensionCode(value: unknown): VarkCode | null {
    const code = String(value ?? "").trim().toUpperCase();
    if (code === "V" || code === "A" || code === "R" || code === "K") {
        return code as VarkCode;
    }
    return null;
}

// ============================================================
// GET VARK QUESTIONS
// ============================================================

export async function getVarkQuestions() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User belum login.");

    const { data: student, error: studentError } = await supabase
        .from("students")
        .select("id, education_level")
        .eq("user_id", user.id)
        .single();

    if (studentError || !student) throw new Error("Data siswa tidak ditemukan di database.");

    const targetVersionCode = VARK_VERSION_MAP[student.education_level];
    if (!targetVersionCode) throw new Error(`Sistem belum memiliki versi VARK untuk jenjang ${student.education_level}.`);

    const { data: version, error: versionError } = await supabase
        .from("assessment_versions")
        .select(`id, version_code, status, min_grade, max_grade`)
        .eq("version_code", targetVersionCode)
        .eq("status", "PUBLISHED")
        .single();

    if (versionError || !version) throw new Error(`Versi asesmen ${targetVersionCode} tidak ditemukan atau belum dipublikasikan.`);

    const { data: questions, error: questionsError } = await supabase
        .from("questions")
        .select(`id, question_text, dimension_id, assessment_version_id, display_order, assessment_dimensions ( code )`)
        .eq("assessment_version_id", version.id)
        .order("display_order", { ascending: true });

    if (questionsError || !questions) throw new Error("Gagal mengambil daftar soal VARK.");
    if (questions.length !== VARK_EXPECTED_QUESTIONS) {
        throw new Error(`Konfigurasi VARK tidak valid. Sistem mengharapkan ${VARK_EXPECTED_QUESTIONS} soal, tetapi database memiliki ${questions.length} soal.`);
    }

    const typedQuestions = questions as unknown as QuestionRecord[];
    const distribution: Record<VarkCode, number> = { V: 0, A: 0, R: 0, K: 0 };

    for (const question of typedQuestions) {
        const dim = question.assessment_dimensions;
        const rawCode = Array.isArray(dim) ? dim[0]?.code : dim?.code;
        const code = normalizeDimensionCode(rawCode);

        if (!code) throw new Error("Terdapat soal VARK dengan dimensi tidak valid.");
        distribution[code]++;
    }

    for (const code of VARK_CODES) {
        if (distribution[code] !== 5) {
            throw new Error(`Distribusi soal VARK tidak valid. Dimensi ${code} memiliki ${distribution[code]} soal, seharusnya 5.`);
        }
    }

    return {
        studentId: student.id,
        educationLevel: student.education_level,
        versionId: version.id,
        versionCode: version.version_code,
        questionCount: typedQuestions.length,
        questions: typedQuestions.map((question) => {
            const dim = question.assessment_dimensions;
            const rawCode = Array.isArray(dim) ? dim[0]?.code : dim?.code;
            return {
                id: question.id,
                text: question.question_text,
                dimensionId: question.dimension_id,
                dimensionCode: normalizeDimensionCode(rawCode),
                displayOrder: question.display_order,
            };
        }),
    };
}

// ============================================================
// SUBMIT VARK
// ============================================================

export async function submitVarkAssessment(versionId: string, answers: VarkAnswer[]) {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: student, error: studentError } = await supabase
        .from("students")
        .select("id, education_level")
        .eq("user_id", user.id)
        .single();

    if (studentError || !student) throw new Error("Data siswa tidak ditemukan.");

    const expectedVersionCode = VARK_VERSION_MAP[student.education_level];
    if (!expectedVersionCode) throw new Error("Jenjang pendidikan belum memiliki versi VARK.");

    const { data: version, error: versionError } = await supabase
        .from("assessment_versions")
        .select(`id, version_code, status`)
        .eq("id", versionId)
        .eq("status", "PUBLISHED")
        .single();

    if (versionError || !version) throw new Error("Versi VARK tidak valid.");
    if (version.version_code !== expectedVersionCode) throw new Error("Versi asesmen tidak sesuai dengan jenjang siswa.");

    const { data: dbQuestions, error: questionError } = await supabase
        .from("questions")
        .select(`id, dimension_id, assessment_version_id, assessment_dimensions ( code )`)
        .eq("assessment_version_id", versionId);

    if (questionError || !dbQuestions) throw new Error("Gagal memvalidasi soal VARK.");
    if (dbQuestions.length !== VARK_EXPECTED_QUESTIONS) throw new Error("Konfigurasi soal VARK di database tidak valid.");
    if (!Array.isArray(answers) || answers.length !== VARK_EXPECTED_QUESTIONS) throw new Error(`Semua ${VARK_EXPECTED_QUESTIONS} soal VARK harus dijawab.`);

    const questionIds = answers.map((answer) => answer.questionId);
    const uniqueQuestionIds = new Set(questionIds);
    if (uniqueQuestionIds.size !== answers.length) throw new Error("Terdapat jawaban soal yang duplikat.");

    const questionMap = new Map<string, VarkCode>();
    const typedDbQuestions = dbQuestions as unknown as QuestionRecord[];

    for (const question of typedDbQuestions) {
        const dim = question.assessment_dimensions;
        const rawCode = Array.isArray(dim) ? dim[0]?.code : dim?.code;
        const code = normalizeDimensionCode(rawCode);

        if (!code) throw new Error("Terdapat soal VARK dengan dimensi tidak valid.");
        questionMap.set(question.id, code);
    }

    for (const answer of answers) {
        if (!questionMap.has(answer.questionId)) throw new Error("Terdapat question ID yang bukan bagian dari asesmen VARK ini.");
        if (!Number.isFinite(answer.value) || answer.value < VARK_SCORE_MIN || answer.value > VARK_SCORE_MAX) {
            throw new Error("Nilai jawaban VARK tidak valid.");
        }
    }

    const scores: Record<VarkCode, number> = { V: 0, A: 0, R: 0, K: 0 };
    for (const answer of answers) {
        const dimensionCode = questionMap.get(answer.questionId);
        if (!dimensionCode) throw new Error("Dimensi soal tidak ditemukan.");
        scores[dimensionCode] += answer.value;
    }

    const totalScore = Object.values(scores).reduce((total, score) => total + score, 0);

    const dimensionPriority: Record<VarkCode, number> = { V: 1, A: 2, R: 3, K: 4 };
    const sortedScores = Object.entries(scores).sort(([codeA, scoreA], [codeB, scoreB]) => {
        if (scoreB !== scoreA) return scoreB - scoreA;
        return dimensionPriority[codeA as VarkCode] - dimensionPriority[codeB as VarkCode];
    });

    const dominantCode = sortedScores[0][0] as VarkCode;
    const secondaryCode = sortedScores[1][0] as VarkCode;
    const tertiaryCode = sortedScores[2][0] as VarkCode;
    // 1. TAMBAHKAN BARIS INI
    const quaternaryCode = sortedScores[3][0] as VarkCode;
    const profileCode = sortedScores.map(([code]) => code).join("");

    // ----------------------------------------------------------
    // SESSION (TABEL INDUK)
    // ----------------------------------------------------------
    const { data: session, error: sessionError } = await supabase
        .from("assessment_sessions")
        .insert({
            student_id: student.id,
            assessment_version_id: versionId,
            status: "COMPLETED",
            completed_at: new Date().toISOString(),
        })
        .select("id")
        .single();

    if (sessionError || !session) throw new Error("Gagal membuat sesi asesmen VARK.");
    const sessionId = session.id;

    // ----------------------------------------------------------
    // RESPONSES & RESULTS DENGAN ROLLBACK MANUAL
    // ----------------------------------------------------------
    const responsesToInsert = answers.map((answer) => ({
        session_id: sessionId,
        question_id: answer.questionId,
        numeric_value: answer.value,
    }));

    const { error: responseError } = await supabase.from("assessment_responses").insert(responsesToInsert);
    if (responseError) {
        await supabaseAdmin.from("assessment_sessions").delete().eq("id", sessionId); // ROLLBACK
        throw new Error("Gagal menyimpan jawaban VARK.");
    }

    const { data: result, error: resultError } = await supabaseAdmin
        .from("assessment_results")
        .insert({
            session_id: sessionId,
            student_id: student.id,
            assessment_version_id: versionId,
            scoring_version: VARK_SCORING_VERSION,
            total_score: totalScore,
            profile_code: profileCode,
            interpretation: null,
        })
        .select("id")
        .single();

    if (resultError || !result) {
        await supabaseAdmin.from("assessment_sessions").delete().eq("id", sessionId); // ROLLBACK
        throw new Error(`Gagal menyimpan hasil VARK: ${resultError?.message ?? ""}`);
    }

    const { data: profile, error: profileError } = await supabaseAdmin
        .from("vark_profiles")
        .insert({
            result_id: result.id,
            code: profileCode,
            dominant_code: dominantCode,
            secondary_code: secondaryCode,
            tertiary_code: tertiaryCode,
            // 2. TAMBAHKAN BARIS INI
            quaternary_code: quaternaryCode,
        })
        .select("id")
        .single();

    if (profileError || !profile) {
        await supabaseAdmin.from("assessment_sessions").delete().eq("id", sessionId); // ROLLBACK
        throw new Error("Gagal menyimpan profil VARK.");
    }

    const varkResults = VARK_CODES.map((code) => ({
        vark_profile_id: profile.id,
        code,
        raw_score: scores[code],
        normalized_score: null,
        rank: sortedScores.findIndex(([sortedCode]) => sortedCode === code) + 1,
    }));

    const { error: varkResultsError } = await supabaseAdmin.from("vark_results").insert(varkResults);
    if (varkResultsError) {
        await supabaseAdmin.from("assessment_sessions").delete().eq("id", sessionId); // ROLLBACK
        throw new Error("Gagal menyimpan skor dimensi VARK.");
    }

    // ----------------------------------------------------------
    // RETURN
    // ----------------------------------------------------------
    return {
        resultId: result.id,
        sessionId,
        profileCode,
        dominantCode,
        secondaryCode,
        tertiaryCode,
        scores,
    };
}