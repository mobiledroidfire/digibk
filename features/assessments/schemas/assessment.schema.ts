// Lokasi file: src/features/assessments/schemas/assessment.schema.ts
import { z } from "zod";

// Schema Jawaban Individu (Nilai 1-5)
export const answerItemSchema = z.object({
    questionId: z.string().uuid({ message: "ID Pertanyaan harus berupa UUID valid." }),
    value: z
        .number()
        .int()
        .min(1, { message: "Nilai minimal adalah 1." })
        .max(5, { message: "Nilai maksimal adalah 5." }),
});

// Schema Submit RIASEC (Tepat 42 Soal)
export const submitRiasecSchema = z.object({
    versionId: z.string().uuid({ message: "Version ID harus berupa UUID valid." }),
    answers: z
        .array(answerItemSchema)
        .length(42, { message: "Semua 42 soal RIASEC harus dijawab." }),
});

// Schema Submit VARK (Tepat 20 Soal)
export const submitVarkSchema = z.object({
    versionId: z.string().uuid({ message: "Version ID harus berupa UUID valid." }),
    answers: z
        .array(answerItemSchema)
        .length(20, { message: "Semua 20 soal VARK harus dijawab." }),
});

// Ekspor Tipe Otomatis dari Zod
export type SubmitRiasecInput = z.infer<typeof submitRiasecSchema>;
export type SubmitVarkInput = z.infer<typeof submitVarkSchema>;