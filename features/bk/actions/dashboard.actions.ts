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
    userRole: string;
    totalStudents: number;
    assessedStudents: number;
    emotionStats: EmotionStat[];
    students: StudentListItem[];
    totalPages: number;
    currentPage: number;
}

type StudentWithClass = {
    id: string;
    full_name: string;
    student_code: string;
    class_memberships: { class_id?: string, classes: { name: string } | null }[] | null;
};

export async function getBkDashboardDataAction(
    page: number = 1,
    limit: number = 10,
    searchQuery: string = '',
    classId: string = ''
): Promise<{ success: boolean; data?: BkDashboardData; error?: string }> {
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

        // TAHAP 1: Cari ID Siswa di Kelas tersebut
        let filteredStudentIds: string[] | null = null;
        if (classId) {
            const { data: memberships } = await supabase
                .from('class_memberships')
                .select('student_id')
                .eq('class_id', classId);

            filteredStudentIds = memberships?.map(m => m.student_id) || [];

            if (filteredStudentIds.length === 0) {
                return {
                    success: true,
                    data: {
                        userRole: roleData.role,
                        totalStudents: 0,
                        assessedStudents: 0,
                        emotionStats: [],
                        students: [],
                        totalPages: 1,
                        currentPage: page
                    }
                };
            }
        }

        // TAHAP 2: Ambil Data Global Siswa
        // PERBAIKAN: .eq('status', 'ACTIVE') Dihapus agar siswa tetap tampil 
        // meskipun status di databasenya kosong atau berbeda penulisan.
        let globalQuery = supabase.from('students').select('id').eq('school_id', schoolId);
        if (filteredStudentIds !== null) {
            globalQuery = globalQuery.in('id', filteredStudentIds);
        }

        const { data: allActiveStudents } = await globalQuery;
        const totalStudents = allActiveStudents?.length || 0;
        const allStudentIds = allActiveStudents?.map(s => s.id) || [];

        // TAHAP 3: Ambil Emosi Terakhir
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

        // TAHAP 4: Ambil Data Siswa UNTUK TABEL 
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        // PERBAIKAN: Menggunakan !inner join agar tabel hanya memunculkan siswa di kelas yang dipilih
        const selectString = classId
            ? 'id, full_name, student_code, class_memberships!inner ( class_id, classes ( name ) )'
            : 'id, full_name, student_code, class_memberships ( classes ( name ) )';

        // PERBAIKAN: .eq('status', 'ACTIVE') juga Dihapus dari sini
        let tableQuery = supabase
            .from('students')
            .select(selectString, { count: 'exact' })
            .eq('school_id', schoolId);

        if (classId) {
            tableQuery = tableQuery.eq('class_memberships.class_id', classId);
        }

        if (searchQuery) {
            tableQuery = tableQuery.or(`full_name.ilike.%${searchQuery}%,student_code.ilike.%${searchQuery}%`);
        }

        const { data: pagedStudentsRaw, count, error: studentsError } = await tableQuery.range(from, to).returns<StudentWithClass[]>();

        if (studentsError) throw new Error('Gagal memuat tabel siswa.');

        const studentList: StudentListItem[] = (pagedStudentsRaw || []).map((student) => {
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
                userRole: roleData.role,
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