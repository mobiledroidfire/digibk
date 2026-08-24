// Lokasi file: src/types/database.ts

// =========================================================================
// ENUMS (Pilihan Statis dari Database V3.0)
// =========================================================================
export type UserRole = 'STUDENT' | 'TEACHER' | 'BK_COUNSELOR' | 'SCHOOL_ADMIN' | 'PARENT' | 'SUPER_ADMIN';
export type EducationLevel = 'SD' | 'MI' | 'SMP' | 'MTs' | 'SMA' | 'MA' | 'SMK';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type AssessmentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
export type SessionStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';

// =========================================================================
// INTERFACES (Struktur Tabel Database)
// =========================================================================

// 1. Data Siswa
export interface Student {
    id: string;
    user_id: string | null;
    school_id: string;
    student_code: string; // NISN / No Absen
    full_name: string;
    education_level: EducationLevel;
    grade_level: number | null;
    status: UserStatus;
}

// 2. Pertanyaan Asesmen (Rating 1-5)
export interface Question {
    id: string;
    assessment_version_id: string;
    dimension_id?: string;
    question_code: string;
    question_text: string;
    question_type: 'RATING';
    is_reverse_scored: boolean;
    display_order: number;
    is_required: boolean;
}

// 3. Jawaban Siswa
export interface AssessmentResponse {
    id: string;
    session_id: string;
    question_id: string;
    numeric_value: number; // Nilai 1, 2, 3, 4, atau 5
    answered_at: string;
}

// 4. Profil VARK (Gaya Belajar)
export interface VarkProfile {
    id: string;
    result_id: string;
    code: string;
    dominant_code: 'V' | 'A' | 'R' | 'K';
    secondary_code?: 'V' | 'A' | 'R' | 'K' | null;
    tertiary_code?: 'V' | 'A' | 'R' | 'K' | null;
    quaternary_code?: 'V' | 'A' | 'R' | 'K' | null;
    interpretation: string;
    created_at: string;
}

// 5. Profil RIASEC (Minat Bakat)
export interface RiasecProfile {
    id: string;
    result_id: string;
    code: string;
    primary_code: 'R' | 'I' | 'A' | 'S' | 'E' | 'C' | null;
    secondary_code?: 'R' | 'I' | 'A' | 'S' | 'E' | 'C' | null;
    tertiary_code?: 'R' | 'I' | 'A' | 'S' | 'E' | 'C' | null;
    profile_name: string;
    interpretation: string;
    created_at: string;
}