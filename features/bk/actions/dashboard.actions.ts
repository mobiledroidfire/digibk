// Lokasi file: /src/features/bk/actions/dashboard.actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import type { EmotionType } from '@/features/student/types/emotion.types';

export interface StudentListItem {
    id: string;
    full_name: string;
    student_code: string;
    class_name: string;
    latest_emotion: EmotionType | null;
    is_at_risk: boolean;
}

export interface EmotionStat {
    emotion: EmotionType;
    count: number;
    percentage: number;
}

export interface BkDashboardData {
    userRole: string; // BARU: Untuk mengecek apakah ini Super Admin
    totalStudents: number;
    assessedStudents: number;
    emotionStats: EmotionStat[];
    students: StudentListItem[];
    totalPages: number; // BARU: Untuk komponen Pagination
    currentPage: number;
}

type StudentWithClass = {
    id: string;
    full_name: string;
    student_code: string;
    class_memberships: { classes: { name: string } | null }[] | null;
};

export async function getBkDashboardDataAction(page: number = 1, limit: number = 10, searchQuery: string = ''): Promise<{ success: boolean; data?: BkDashboardData; error?: string }> {
    const supabase = await createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Sesi tidak valid.');

        const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select('role, school_id')
            .eq('user_id', user.id)
            .in('role', ['BK_COUNSELOR', 'SCHOOL_ADMIN', 'SUPER_ADMIN'])
            .single();

        if (roleError || !roleData) throw new Error('Akses ditolak.');

        let schoolId = roleData.school_id;
        if (roleData.role === 'SUPER_ADMIN' && !schoolId) {
            const { data: firstSchool } = await supabase.from('schools').select('id').limit(1).single();
            if (firstSchool) schoolId = firstSchool.id;
            else throw new Error('Belum ada sekolah di sistem.');
        } else if (!schoolId) {
            throw new Error('Akun Anda belum ditugaskan ke sekolah.');
        }

        // 1. Ambil ID Semua Siswa (Untuk Statistik Global Grafik)
        const { data: allActiveStudents } = await supabase
            .from('students')
            .select('id')
            .eq('school_id', schoolId)
            .eq('status', 'ACTIVE');

        const totalStudents = allActiveStudents?.length || 0;
        const allStudentIds = allActiveStudents?.map(s => s.id) || [];

        // 2. Ambil Semua Emosi Terakhir (Untuk Statistik Global Grafik)
        const { data: allEmotions } = await supabase
            .from('emotional_checkins')
            .select('student_id, emotion, intensity, created_at')
            .in('student_id', allStudentIds)
            .order('created_at', { ascending: false });

        const emotionCounts: Record<string, number> = {};
        const processedStudentIds = new Set();
        let totalAssessed = 0;

        allEmotions?.forEach((record) => {
            if (!processedStudentIds.has(record.student_id)) {
                processedStudentIds.add(record.student_id);
                totalAssessed++;
                emotionCounts[record.emotion] = (emotionCounts[record.emotion] || 0) + 1;
            }
        });

        const emotionStats: EmotionStat[] = Object.keys(emotionCounts).map(key => ({
            emotion: key as EmotionType,
            count: emotionCounts[key],
            percentage: Math.round((emotionCounts[key] / totalAssessed) * 100)
        })).sort((a, b) => b.count - a.count);

        // 3. Ambil Data Siswa UNTUK TABEL (Berlaku Pagination & Pencarian)
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let query = supabase
            .from('students')
            .select(`id, full_name, student_code, class_memberships ( classes ( name ) )`, { count: 'exact' })
            .eq('school_id', schoolId)
            .eq('status', 'ACTIVE');

        if (searchQuery) {
            query = query.or(`full_name.ilike.%${searchQuery}%,student_code.ilike.%${searchQuery}%`);
        }

        const { data: pagedStudentsRaw, count, error: studentsError } = await query.range(from, to).returns<StudentWithClass[]>();

        if (studentsError) throw new Error('Gagal memuat tabel siswa.');

        const studentList: StudentListItem[] = (pagedStudentsRaw || []).map((student) => {
            // Cocokkan emosinya dari data global tadi
            const studentEmotion = allEmotions?.find(e => e.student_id === student.id);
            const isCritical = studentEmotion
                ? ['SAD', 'DISAPPOINTED', 'ANGRY', 'AFRAID', 'ANXIOUS'].includes(studentEmotion.emotion) && studentEmotion.intensity >= 7
                : false;

            return {
                id: student.id,
                full_name: student.full_name,
                student_code: student.student_code,
                class_name: student.class_memberships?.[0]?.classes?.name || 'Belum Ada Kelas',
                latest_emotion: (studentEmotion?.emotion as EmotionType) || null,
                is_at_risk: isCritical
            };
        });

        return {
            success: true,
            data: {
                userRole: roleData.role, // Kita butuh ini untuk memunculkan tombol 'Kembali'
                totalStudents,
                assessedStudents: totalAssessed,
                emotionStats,
                students: studentList,
                totalPages: Math.ceil((count || 0) / limit),
                currentPage: page
            }
        };

    } catch (error: unknown) {
        if (error instanceof Error) return { success: false, error: error.message };
        return { success: false, error: 'Terjadi kesalahan sistem.' };
    }
}