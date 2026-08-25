// Lokasi file: /features/student/types/emotion.types.ts

export type EmotionType =
    | 'HAPPY' | 'CALM' | 'SAD' | 'DISAPPOINTED' | 'ANGRY'
    | 'AFRAID' | 'ANXIOUS' | 'CONFUSED' | 'NEUTRAL' | 'OTHER';

export interface EmotionalCheckinPayload {
    student_id?: string; // Dibuat opsional agar Server Action tidak error
    emotion: EmotionType;
    intensity: number;
    context: string;
    coping_response: string;
    help_seeking?: string;
    wants_to_talk: boolean;
}

export interface EmotionalCheckinHistory extends EmotionalCheckinPayload {
    id: string;
    created_at: string;
}

// Kita tambahkan ini agar emotion.service.ts yang lama tidak error
export interface EmotionalCheckinResponse extends EmotionalCheckinHistory { }