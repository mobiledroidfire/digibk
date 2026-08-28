// Lokasi file: /src/features/bk/actions/dashboard.actions.ts
'use server';

import { createClient } from '@/lib/supabase/server';
import type { EmotionType } from '@/features/student/types/emotion.types';
import { isAtRisk } from '@/lib/rules/emotion.rules';

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
    class_memberships: { class_id: string; classes: { name: string } | null }[] | null;
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

        // ==============================================================
        // PERBAIKAN BUG SUPER ADMIN (TAMU)
        // Jika ada kelas yang dipilih, baca school_id langsung dari kelasnya
        // ==============================================================
        if (classId) {
            const { data: classData } = await supabase
                .from('classes')
                .select('school_id')
                .eq('id', classId)
                .single();

            if (classData?.school_id) {
                schoolId = classData.school_id;
            }
        }

        // Logika bawaan (*fallback*) jika tidak ada kelas yang dipilih
        if (roleData.role === 'SUPER_ADMIN' && !schoolId) {
            const { data: firstSchool } = await supabase.from('schools').select('id').limit(1).single();
            if (firstSchool) schoolId = firstSchool.id;
            else throw new Error('Belum ada sekolah di sistem.');
        } else if (!schoolId) {
            throw new Error('Akun Anda belum ditugaskan ke sekolah.');
        }

        // ==============================================================
        // TAHAP 1: Ambil Total Siswa & ID untuk Statistik Emosi
        // ==============================================================
        let allStudentIds: string[] = [];
        let totalStudents = 0;

        if (classId) {
            const { data, error } = await supabase
                .from('students')
                .select('id, class_memberships!inner(class_id)')
                .eq('school_id', schoolId)
                .eq('class_memberships.class_id', classId);

            if (error) throw new Error('Gagal mengambil data kelas.');
            allStudentIds = data?.map(s => s.id) || [];
            totalStudents = allStudentIds.length;
        } else {
            const { data, error } = await supabase
                .from('students')
                .select('id')
                .eq('school_id', schoolId);

            if (error) throw new Error('Gagal mengambil data global.');
            allStudentIds = data?.map(s => s.id) || [];
            totalStudents = allStudentIds.length;
        }

        if (totalStudents === 0) {
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

        // ==============================================================
        // TAHAP 2: Hitung Peta Emosi
        // ==============================================================
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

        // ==============================================================
        // TAHAP 3: Ambil Data Tabel Siswa
        // ==============================================================
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let pagedStudentsRaw: StudentWithClass[] | null = [];
        let count = 0;

        if (classId) {
            let query = supabase
                .from('students')
                .select('id, full_name, student_code, class_memberships!inner(class_id, classes(name))', { count: 'exact' })
                .eq('school_id', schoolId)
                .eq('class_memberships.class_id', classId);

            if (searchQuery) {
                query = query.or(`full_name.ilike.%${searchQuery}%,student_code.ilike.%${searchQuery}%`);
            }

            const { data, count: c, error } = await query
                .order('full_name', { ascending: true })
                .range(from, to)
                .returns<StudentWithClass[]>();

            if (error) throw new Error('Gagal memuat tabel siswa kelas.');
            pagedStudentsRaw = data;
            count = c || 0;
        } else {
            let query = supabase
                .from('students')
                .select('id, full_name, student_code, class_memberships(class_id, classes(name))', { count: 'exact' })
                .eq('school_id', schoolId);

            if (searchQuery) {
                query = query.or(`full_name.ilike.%${searchQuery}%,student_code.ilike.%${searchQuery}%`);
            }

            const { data, count: c, error } = await query
                .order('full_name', { ascending: true })
                .range(from, to)
                .returns<StudentWithClass[]>();

            if (error) throw new Error('Gagal memuat tabel siswa global.');
            pagedStudentsRaw = data;
            count = c || 0;
        }

        const studentList: StudentListItem[] = (pagedStudentsRaw || []).map((student) => {
            const studentEmotion = allEmotions?.find(e => e.student_id === student.id);
            const isCritical = isAtRisk(studentEmotion?.emotion, studentEmotion?.intensity);

            let cName = 'Belum Ada Kelas';
            if (student.class_memberships && student.class_memberships.length > 0) {
                cName = student.class_memberships[0].classes?.name || 'Belum Ada Kelas';
            }

            return {
                id: student.id,
                full_name: student.full_name,
                student_code: student.student_code,
                class_name: cName,
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
                totalPages: Math.ceil(count / limit),
                currentPage: page
            }
        };

    } catch (error: unknown) {
        if (error instanceof Error) return { success: false, error: error.message };
        return { success: false, error: 'Terjadi kesalahan sistem.' };
    }
}