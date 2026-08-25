// Lokasi file: /src/features/bk/actions/student-detail.actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import type { EmotionType } from '@/features/student/types/emotion.types';

export interface StudentFullProfile {
    id: string;
    full_name: string;
    student_code: string;
    class_name: string;
    riasec_result: {
        code: string;
        name: string;
        interpretation: string;
    } | null;
    vark_result: {
        code: string;
        name: string; // BARU: Untuk menampung "Auditori & Kinestetik"
        dominant: string;
        interpretation: string;
    } | null;
    recent_emotions: {
        id: string;
        emotion: EmotionType;
        intensity: number;
        context: string;
        coping_response: string;
        created_at: string;
    }[];
}

type StudentWithClass = {
    id: string;
    full_name: string;
    student_code: string;
    school_id: string;
    class_memberships: { classes: { name: string } | null }[] | null;
};

type RiasecRecord = {
    code: string;
    primary_code: string;
    secondary_code: string;
    tertiary_code: string;
};

type VarkRecord = {
    code: string;
    dominant_code: string;
};

type EmotionRecord = {
    id: string;
    emotion: EmotionType;
    intensity: number;
    context: string;
    coping_response: string;
    created_at: string;
};

// --- KAMUS DESKRIPSI (Single Source of Truth) ---
const RIASEC_DESC: Record<string, { title: string, id: string, desc: string }> = {
    'R': { title: 'Realistic', id: 'Realistis', desc: 'Menyukai aktivitas fisik, mesin, alat, dan lingkungan luar ruangan.' },
    'I': { title: 'Investigative', id: 'Investigatif', desc: 'Memiliki rasa ingin tahu yang tinggi, menyukai analisis, dan sains.' },
    'A': { title: 'Artistic', id: 'Artistik', desc: 'Menyukai kreativitas, seni, kebebasan berekspresi, dan inovasi.' },
    'S': { title: 'Social', id: 'Sosial', desc: 'Menyukai interaksi, gemar menolong, dan membimbing orang lain.' },
    'E': { title: 'Enterprising', id: 'Wirausaha', desc: 'Menyukai kepemimpinan, mampu memengaruhi orang lain, dan berani mengambil risiko.' },
    'C': { title: 'Conventional', id: 'Konvensional', desc: 'Menyukai keteraturan, mengolah data, dan aktivitas yang terstruktur.' }
};

const VARK_DESC: Record<string, { id: string, desc: string }> = {
    'V': { id: 'Visual', desc: 'Kamu peka terhadap informasi visual. Menggunakan gambar, diagram, grafik, atau video akan membuat materi jauh lebih mudah diingat.' },
    'A': { id: 'Auditori', desc: 'Kamu menyerap informasi dengan mendengarkan. Penjelasan guru, diskusi, atau merekam materi adalah metode paling jitu untukmu.' },
    'R': { id: 'Read/Write', desc: 'Kamu kuat memahami instruksi teks. Membaca buku teks, merangkum materi, atau menulis ulang catatan adalah cara paling efektif.' },
    'K': { id: 'Kinestetik', desc: 'Kamu tipe pembelajar yang harus "bergerak". Melakukan eksperimen, simulasi, atau praktik langsung akan membuatmu cepat paham.' }
};

const VARK_MULTIMODAL = 'Sebagai seorang pembelajar Multimodal, Anda memiliki keunggulan kognitif dalam memproses informasi melalui berbagai saluran. Alih-alih bergantung pada satu metode tunggal, Anda mampu mengintegrasikan isyarat visual, auditori, teks, dan kinestetik secara bersamaan.';

export async function getStudentDetailAction(studentId: string): Promise<{ success: boolean; data?: StudentFullProfile; error?: string }> {
    const supabase = await createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Sesi tidak valid.');

        const { data: roleData } = await supabase.from('user_roles').select('school_id, role').eq('user_id', user.id).in('role', ['BK_COUNSELOR', 'SCHOOL_ADMIN', 'SUPER_ADMIN']).single();
        if (!roleData) throw new Error('Akses ditolak.');

        const { data: student, error: studentError } = await supabase.from('students').select(`id, full_name, student_code, school_id, class_memberships ( classes ( name ) )`).eq('id', studentId).returns<StudentWithClass[]>().single();
        if (studentError || !student) throw new Error('Siswa tidak ditemukan.');
        if (roleData.role !== 'SUPER_ADMIN' && student.school_id !== roleData.school_id) throw new Error('Anda tidak memiliki hak akses ke data siswa ini.');

        const { data: riasecProfile } = await supabase.from('riasec_profiles').select('code, primary_code, secondary_code, tertiary_code, assessment_results!inner(student_id)').eq('assessment_results.student_id', studentId).order('created_at', { ascending: false }).limit(1).returns<RiasecRecord[]>().maybeSingle();
        const { data: varkProfile } = await supabase.from('vark_profiles').select('code, dominant_code, assessment_results!inner(student_id)').eq('assessment_results.student_id', studentId).order('created_at', { ascending: false }).limit(1).returns<VarkRecord[]>().maybeSingle();
        const { data: emotions } = await supabase.from('emotional_checkins').select('id, emotion, intensity, context, coping_response, created_at').eq('student_id', studentId).order('created_at', { ascending: false }).limit(5).returns<EmotionRecord[]>();

        // --- MERAKIT RIASEC ---
        let finalRiasec = null;
        if (riasecProfile && riasecProfile.code) {
            const c1 = riasecProfile.primary_code || riasecProfile.code[0];
            const c2 = riasecProfile.secondary_code || riasecProfile.code[1];
            const c3 = riasecProfile.tertiary_code || riasecProfile.code[2];

            const d1 = RIASEC_DESC[c1] || RIASEC_DESC['C'];
            const d2 = RIASEC_DESC[c2] || RIASEC_DESC['C'];
            const d3 = RIASEC_DESC[c3] || RIASEC_DESC['C'];

            finalRiasec = {
                code: riasecProfile.code,
                name: `${d1.id}, ${d2.id}, & ${d3.id}`,
                interpretation: `Tipe dominan kamu membentuk pola gabungan ${c1}-${c2}-${c3}, yang mewakili ${d1.title} (${d1.id}), ${d2.title} (${d2.id}), dan ${d3.title} (${d3.id}).\n\n• ${d1.title}: ${d1.desc}\n• ${d2.title}: ${d2.desc}\n• ${d3.title}: ${d3.desc}`
            };
        }

        // --- MERAKIT VARK ---
        let finalVark = null;
        if (varkProfile && varkProfile.code) {
            const isMultimodal = varkProfile.code.length > 1;

            // Merakit nama seperti "Auditori & Kinestetik"
            const varkParts = varkProfile.code.split('').map(char => VARK_DESC[char]?.id || char);
            let varkName = varkParts.join(', ');
            if (varkParts.length > 1) {
                const last = varkParts.pop();
                varkName = `${varkParts.join(', ')} & ${last}`;
            }

            finalVark = {
                code: varkProfile.code,
                name: varkName,
                dominant: isMultimodal ? 'Gaya Belajar Fleksibel (Multimodal)' : (VARK_DESC[varkProfile.dominant_code]?.id || 'Tunggal'),
                interpretation: isMultimodal ? VARK_MULTIMODAL : (VARK_DESC[varkProfile.dominant_code]?.desc || 'Data gaya belajar ditemukan.')
            };
        }

        return {
            success: true,
            data: {
                id: student.id,
                full_name: student.full_name,
                student_code: student.student_code,
                class_name: student.class_memberships?.[0]?.classes?.name || 'Belum Ada Kelas',
                riasec_result: finalRiasec,
                vark_result: finalVark,
                recent_emotions: emotions || []
            }
        };
    } catch (error: unknown) {
        if (error instanceof Error) return { success: false, error: error.message };
        return { success: false, error: 'Terjadi kesalahan sistem.' };
    }
}