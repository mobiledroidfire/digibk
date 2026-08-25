// Lokasi file: src/features/assessments/actions/riasec.actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import type { RiasecProfile } from "@/types/database";
import { submitRiasecSchema, type answerItemSchema } from "../schemas/assessment.schema";
import { z } from "zod";

const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type RiasecCode = Exclude<RiasecProfile['primary_code'], null>;
type RiasecAnswer = z.infer<typeof answerItemSchema>;

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

// Tipe data baru untuk hasil query di submitRiasecAssessment
type DatabaseQuestionRecord = {
    id: string;
    dimension_id: string;
    assessment_version_id: string;
    assessment_dimensions:
    | DimensionRecord
    | DimensionRecord[]
    | null;
};

const RIASEC_CODES: RiasecCode[] = ["R", "I", "A", "S", "E", "C"];
const RIASEC_EXPECTED_QUESTIONS = 42;
const RIASEC_SCORING_VERSION = "RIASEC-SCORING-v1";

const RIASEC_VERSION_MAP: Record<string, string> = {
    SD: "RIASEC-SD-v1",
    MI: "RIASEC-MI-v1",
    SMP: "RIASEC-SMP-v1",
    MTs: "RIASEC-MTs-v1",
    SMA: "RIASEC-SMA-v1",
    MA: "RIASEC-MA-v1",
    SMK: "RIASEC-SMK-v1",
};

function normalizeDimensionCode(value: unknown): RiasecCode | null {
    const code = String(value ?? "").trim().toUpperCase();
    if (["R", "I", "A", "S", "E", "C"].includes(code)) {
        return code as RiasecCode;
    }
    return null;
}

// ============================================================
// GET RIASEC QUESTIONS
// ============================================================

export async function getRiasecQuestions() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("User belum login.");

    const { data: student, error: studentError } = await supabase
        .from("students")
        .select("id, education_level")
        .eq("user_id", user.id)
        .single();

    if (studentError || !student) throw new Error("Data siswa tidak ditemukan di database.");

    const targetVersionCode = RIASEC_VERSION_MAP[student.education_level];
    if (!targetVersionCode) throw new Error(`Sistem belum memiliki versi RIASEC untuk jenjang ${student.education_level}.`);

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

    if (questionsError || !questions) throw new Error("Gagal mengambil daftar soal RIASEC.");
    if (questions.length !== RIASEC_EXPECTED_QUESTIONS) {
        throw new Error(`Konfigurasi RIASEC tidak valid. Sistem mengharapkan ${RIASEC_EXPECTED_QUESTIONS} soal, tetapi database memiliki ${questions.length} soal.`);
    }

    const typedQuestions = questions as unknown as QuestionRecord[];
    const invalidQuestions = typedQuestions.filter((q) => {
        const dim = q.assessment_dimensions;
        const rawCode = Array.isArray(dim) ? dim[0]?.code : dim?.code;
        return !normalizeDimensionCode(rawCode);
    });

    if (invalidQuestions.length > 0) throw new Error("Terdapat soal RIASEC dengan dimensi yang tidak valid.");

    const distribution: Record<RiasecCode, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    typedQuestions.forEach((q) => {
        const dim = q.assessment_dimensions;
        const rawCode = Array.isArray(dim) ? dim[0]?.code : dim?.code;
        const code = normalizeDimensionCode(rawCode);
        if (code) distribution[code]++;
    });

    for (const code of RIASEC_CODES) {
        if (distribution[code] !== 7) throw new Error(`Distribusi soal RIASEC tidak valid. Dimensi ${code} memiliki ${distribution[code]} soal, seharusnya 7.`);
    }

    return {
        studentId: student.id,
        educationLevel: student.education_level,
        versionId: version.id,
        versionCode: version.version_code,
        questionCount: typedQuestions.length,
        questions: typedQuestions.map((q) => {
            const dim = q.assessment_dimensions;
            const rawCode = Array.isArray(dim) ? dim[0]?.code : dim?.code;
            return {
                id: q.id,
                text: q.question_text,
                dimensionId: q.dimension_id,
                dimensionCode: normalizeDimensionCode(rawCode),
                displayOrder: q.display_order,
            };
        }),
    };
}

// ============================================================
// SUBMIT RIASEC ASSESSMENT
// ============================================================

export async function submitRiasecAssessment(versionId: string, unvalidatedAnswers: RiasecAnswer[]) {
    // 1. VALIDASI INPUT MENGGUNAKAN ZOD
    const parseResult = submitRiasecSchema.safeParse({
        versionId,
        answers: unvalidatedAnswers,
    });

    if (!parseResult.success) {
        const errorMessage = parseResult.error.issues[0]?.message || "Input tidak valid.";
        throw new Error(errorMessage);
    }

    const { versionId: validVersionId, answers } = parseResult.data;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: student, error: studentError } = await supabase
        .from("students")
        .select("id, education_level")
        .eq("user_id", user.id)
        .single();

    if (studentError || !student) throw new Error("Data siswa tidak ditemukan.");

    const expectedVersionCode = RIASEC_VERSION_MAP[student.education_level];
    if (!expectedVersionCode) throw new Error("Jenjang pendidikan belum memiliki versi RIASEC.");

    const { data: version, error: versionError } = await supabase
        .from("assessment_versions")
        .select(`id, version_code, status`)
        .eq("id", validVersionId)
        .eq("status", "PUBLISHED")
        .single();

    if (versionError || !version) throw new Error("Versi RIASEC tidak valid.");
    if (version.version_code !== expectedVersionCode) throw new Error("Versi asesmen tidak sesuai dengan jenjang siswa.");

    const { data: dbQuestions, error: questionError } = await supabase
        .from("questions")
        .select(`id, dimension_id, assessment_version_id, assessment_dimensions ( code )`)
        .eq("assessment_version_id", validVersionId);

    if (questionError || !dbQuestions || dbQuestions.length !== RIASEC_EXPECTED_QUESTIONS) {
        throw new Error("Konfigurasi soal RIASEC di database tidak valid.");
    }

    // Cek duplikasi pertanyaan
    const uniqueQuestionIds = new Set(answers.map((a) => a.questionId));
    if (uniqueQuestionIds.size !== answers.length) throw new Error("Terdapat jawaban soal yang duplikat.");

    const questionMap = new Map<string, RiasecCode>();

    // PERBAIKAN: Mengganti any[] dengan DatabaseQuestionRecord[]
    for (const question of dbQuestions as unknown as DatabaseQuestionRecord[]) {
        const dim = question.assessment_dimensions;
        const rawCode = Array.isArray(dim) ? dim[0]?.code : dim?.code;
        const code = normalizeDimensionCode(rawCode);
        if (!code) throw new Error("Terdapat soal dengan dimensi RIASEC tidak valid.");
        questionMap.set(question.id, code);
    }

    // Hitung Skor
    const scores: Record<RiasecCode, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    for (const answer of answers) {
        const dimensionCode = questionMap.get(answer.questionId);
        if (!dimensionCode) throw new Error("Terdapat soal yang tidak sesuai dengan versi asesmen ini.");
        scores[dimensionCode] += answer.value;
    }

    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

    const dimensionPriority: Record<RiasecCode, number> = { R: 1, I: 2, A: 3, S: 4, E: 5, C: 6 };
    const sortedScores = Object.entries(scores).sort(([codeA, scoreA], [codeB, scoreB]) => {
        if (scoreB !== scoreA) return scoreB - scoreA;
        return dimensionPriority[codeA as RiasecCode] - dimensionPriority[codeB as RiasecCode];
    });

    const dominantCode = sortedScores[0][0] as RiasecCode;
    const secondaryCode = sortedScores[1][0] as RiasecCode;
    const tertiaryCode = sortedScores[2][0] as RiasecCode;
    const profileCode = sortedScores.slice(0, 3).map(([code]) => code).join("");

    // ----------------------------------------------------------
    // DATABASE INSERTS DENGAN ROLLBACK
    // ----------------------------------------------------------
    const { data: session, error: sessionError } = await supabase
        .from("assessment_sessions")
        .insert({
            student_id: student.id,
            assessment_version_id: validVersionId,
            status: "COMPLETED",
            completed_at: new Date().toISOString(),
        })
        .select("id")
        .single();

    if (sessionError || !session) throw new Error("Gagal membuat sesi asesmen RIASEC.");
    const sessionId = session.id;

    const responsesToInsert = answers.map((answer) => ({
        session_id: sessionId,
        question_id: answer.questionId,
        numeric_value: answer.value,
    }));

    const { error: responseError } = await supabase.from("assessment_responses").insert(responsesToInsert);
    if (responseError) {
        await supabaseAdmin.from("assessment_sessions").delete().eq("id", sessionId);
        throw new Error("Gagal menyimpan jawaban RIASEC.");
    }

    const { data: result, error: resultError } = await supabaseAdmin
        .from("assessment_results")
        .insert({
            session_id: sessionId,
            student_id: student.id,
            assessment_version_id: validVersionId,
            scoring_version: RIASEC_SCORING_VERSION,
            total_score: totalScore,
            profile_code: profileCode,
            interpretation: null,
        })
        .select("id")
        .single();

    if (resultError || !result) {
        await supabaseAdmin.from("assessment_sessions").delete().eq("id", sessionId);
        throw new Error(`Gagal menyimpan hasil RIASEC: ${resultError?.message ?? ""}`);
    }

    const { data: profile, error: profileError } = await supabaseAdmin
        .from("riasec_profiles")
        .insert({
            result_id: result.id,
            code: profileCode,
            primary_code: dominantCode,
            secondary_code: secondaryCode,
            tertiary_code: tertiaryCode,
            profile_name: null,
            interpretation: null,
        })
        .select("id")
        .single();

    if (profileError || !profile) {
        await supabaseAdmin.from("assessment_sessions").delete().eq("id", sessionId);
        throw new Error("Gagal menyimpan profil RIASEC.");
    }

    const riasecResults = RIASEC_CODES.map((code) => ({
        riasec_profile_id: profile.id,
        code,
        raw_score: scores[code],
        normalized_score: null,
        rank: sortedScores.findIndex(([sortedCode]) => sortedCode === code) + 1,
    }));

    const { error: riasecResultsError } = await supabaseAdmin.from("riasec_results").insert(riasecResults);
    if (riasecResultsError) {
        await supabaseAdmin.from("assessment_sessions").delete().eq("id", sessionId);
        throw new Error("Gagal menyimpan skor dimensi RIASEC.");
    }

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