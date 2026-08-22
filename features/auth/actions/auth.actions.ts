// Lokasi file: src/features/auth/actions/auth.actions.ts
'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export type AuthState = {
    error: string | null;
    success: boolean;
};

// ========================================================================
// 1. ACTION UNTUK GURU & ADMIN (Email + Password Asli)
// ========================================================================
export async function teacherLoginAction(
    prevState: AuthState | null,
    formData: FormData
): Promise<AuthState> {
    const supabase = await createClient();
    const email = formData.get('email')?.toString().trim() || '';
    const password = formData.get('password')?.toString() || '';

    if (!email || !password) {
        return { error: 'Email dan kata sandi wajib diisi.', success: false };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        return { error: 'Email atau kata sandi salah. Silakan periksa kembali.', success: false };
    }

    if (data.user) {
        const { data: roleData } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', data.user.id)
            .limit(1)
            .single();

        if (roleData?.role === 'BK_COUNSELOR' || roleData?.role === 'TEACHER' || roleData?.role === 'SUPER_ADMIN') {
            redirect('/bk/dashboard');
        }
    }

    redirect('/login?error=Akses tidak diizinkan untuk peran ini.');
}

// Tambahkan fungsi pendeteksi tingkat sekolah ini di luar/atas fungsi studentLoginAction
function detectEducationLevel(schoolName: string): 'SD' | 'SMP' | 'SMA' | 'SMK' {
    const name = schoolName.toUpperCase();
    if (name.includes('SD') || name.includes('MI')) return 'SD';
    if (name.includes('SMA') || name.includes('MA')) return 'SMA';
    if (name.includes('SMK') || name.includes('MAK')) return 'SMK';
    return 'SMP'; // Default jika tidak terdeteksi
}

// ========================================================================
// 2. ACTION UNTUK SISWA ("Smart Login": Cari lalu Login, atau Daftar Baru)
// ========================================================================
export async function studentLoginAction(
    prevState: AuthState | null,
    formData: FormData
): Promise<AuthState> {
    const supabase = await createClient();

    // Tangkap data dari form
    const studentCode = formData.get('studentCode')?.toString().trim() || '';
    const fullName = formData.get('fullName')?.toString().trim() || '';
    const className = formData.get('className')?.toString().trim().toUpperCase() || '';
    const schoolName = formData.get('schoolName')?.toString().trim().toUpperCase() || '';

    if (!studentCode || !fullName || !className || !schoolName) {
        return { error: 'Semua kolom wajib diisi.', success: false };
    }

    const defaultPassword = 'DigibkStudent2026!';
    let isSuccess = false;

    // Deteksi tingkat pendidikan otomatis dari nama sekolah
    const detectedLevel = detectEducationLevel(schoolName);

    try {
        // ==========================================
        // FASE 1: PENCARIAN SEKOLAH DAN KELAS
        // Menggunakan .limit(1) untuk menghindari error database jika ada duplikat nama
        // ==========================================
        const { data: schools } = await supabase.from('schools').select('id').ilike('name', schoolName).limit(1);
        let school = schools?.[0] || null;

        let classData = null;

        if (school) {
            const { data: classes } = await supabase.from('classes').select('id').eq('school_id', school.id).ilike('name', className).limit(1);
            classData = classes?.[0] || null;

            // ==========================================
            // FASE 2: CEK APAKAH SISWA SUDAH TERDAFTAR
            // ==========================================
            const { data: existingStudents } = await supabase
                .from('students')
                .select('id, user_id, full_name')
                .eq('school_id', school.id)
                .eq('student_code', studentCode)
                .limit(1);

            const existingStudent = existingStudents?.[0] || null;

            if (existingStudent && existingStudent.user_id) {
                // Verifikasi nama agar absen tidak dipakai orang lain
                if (existingStudent.full_name.toLowerCase() !== fullName.toLowerCase()) {
                    return { error: 'Nomor Absen/NISN ini sudah digunakan oleh nama siswa lain di sekolah ini.', success: false };
                }

                // Lakukan pemulihan sesi dengan mengambil email dari tabel users
                const { data: users } = await supabase.from('users').select('email').eq('id', existingStudent.user_id).limit(1);
                const userData = users?.[0] || null;

                if (userData && userData.email) {
                    const { error: signInError } = await supabase.auth.signInWithPassword({
                        email: userData.email,
                        password: defaultPassword
                    });

                    if (signInError) {
                        return { error: 'Gagal memulihkan sesi lama. Lapor ke Guru BK.', success: false };
                    }

                    // Jika berhasil memulihkan sesi, tandai sukses agar tidak masuk ke Fase 3
                    isSuccess = true;
                } else {
                    return { error: 'Data email tidak ditemukan untuk pemulihan.', success: false };
                }
            }
        }

        // ==========================================
        // FASE 3: JIKA BELUM ADA, LAKUKAN PENDAFTARAN (AUTO-REGISTER)
        // Fase ini HANYA berjalan jika isSuccess masih false
        // ==========================================
        if (!isSuccess) {
            const randomId = Math.random().toString(36).substring(2, 10);
            const ghostEmail = `siswa-${studentCode.replace(/\s/g, '')}-${randomId}@digitech.id`;

            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email: ghostEmail,
                password: defaultPassword,
                options: { data: { full_name: fullName } }
            });

            if (signUpError || !signUpData.user) {
                return { error: `Gagal membuat akun: ${signUpError?.message || 'Sistem menolak email'}`, success: false };
            }

            const userId = signUpData.user.id;

            // Jika sekolah belum ada, buat baru
            if (!school) {
                const { data: newSchool, error: schoolErr } = await supabase
                    .from('schools').insert({ name: schoolName, code: `SCH-${randomId}`, education_level: detectedLevel })
                    .select('id').single();
                if (schoolErr) throw schoolErr;
                school = newSchool;
            }

            // Jika kelas belum ada, buat baru
            if (!classData) {
                const { data: newClass, error: classErr } = await supabase
                    .from('classes').insert({ school_id: school!.id, name: className })
                    .select('id').single();
                if (classErr) throw classErr;
                classData = newClass;
            }

            await supabase.from('user_roles').insert({ user_id: userId, role: 'STUDENT', school_id: school!.id });

            // Gunakan detectedLevel untuk edukasi siswa
            const { data: studentRecord, error: studentErr } = await supabase.from('students').insert({
                user_id: userId,
                school_id: school!.id,
                student_code: studentCode,
                full_name: fullName,
                education_level: detectedLevel,
            }).select('id').single();

            if (studentErr) throw studentErr;

            await supabase.from('class_memberships').insert({
                class_id: classData!.id,
                student_id: studentRecord!.id
            });

            isSuccess = true;
        }

    } catch (err: unknown) {
        // Menghindari 'any', memastikan error tertangkap sebagai string dengan aman
        const exactError = err instanceof Error ? err.message : String(err);
        console.error("Database Error Detail:", exactError);
        return { error: `Gagal: ${exactError}`, success: false };
    }

    // ==========================================
    // FASE 4: PENGALIHAN HALAMAN
    // Ditaruh di luar try-catch agar fungsi redirect() dari Next.js tidak terblokir
    // ==========================================
    if (isSuccess) {
        redirect('/student/dashboard');
    }

    return { error: 'Proses terhenti sebelum selesai.', success: false };
}

export async function logoutAction(): Promise<void> {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login');
}