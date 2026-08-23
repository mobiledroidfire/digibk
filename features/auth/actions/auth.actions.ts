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

    if (error || !data.user) {
        return { error: 'Email atau kata sandi salah. Silakan periksa kembali.', success: false };
    }

    const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .limit(1)
        .single();

    if (roleData && ['BK_COUNSELOR', 'TEACHER', 'SUPER_ADMIN'].includes(roleData.role)) {
        // Berhasil login dan rolenya sesuai, Next.js akan memproses redirect di bawah
    } else {
        // Jika rolenya STUDENT atau tidak ada, paksa logout dan kembalikan error
        await supabase.auth.signOut();
        return { error: 'Akses ditolak. Akun Anda tidak memiliki izin untuk halaman ini.', success: false };
    }

    // Redirect dilakukan di luar blok kondisional agar Next.js bisa menangkapnya
    redirect('/bk/dashboard');
}

// ========================================================================
// FUNGSI PENDETEKSI TINGKAT SEKOLAH (SUPER CERDAS & LENGKAP)
// ========================================================================
function detectEducationLevel(schoolName: string): 'SD' | 'MI' | 'SMP' | 'SMA' | 'SMK' | 'MTs' | 'MA' {
    const name = schoolName.toUpperCase();
    // Gunakan RegEx (\b) untuk mendeteksi batas kata. 
    // Ini mencegah kata "SMART" terdeteksi sebagai "MA", atau "TAMTAM" terdeteksi "MT"

    // 1. Deteksi Madrasah Ibtidaiyah (MI)
    if (/\b(MI|MIN|MIS)\b/.test(name)) return 'MI';

    // 2. Deteksi SD (termasuk SDIT, SDN, SDS)
    if (/\b(SD|SDN|SDS|SDIT)\b/.test(name)) return 'SD';

    // 3. Deteksi SMK (termasuk SMKN, SMKS, SMKIT, MAK, STM, SMEA)
    if (/\b(SMK|SMKN|SMKS|SMKIT|MAK|STM|SMEA)\b/.test(name)) return 'SMK';

    // 4. Deteksi MA dan MTs
    if (/\b(MA|MAN|MAS)\b/.test(name)) return 'MA';
    if (/\b(MTS|MTSN|MTSS)\b/.test(name)) return 'MTs';

    // 5. Deteksi SMA (termasuk SMAN, SMAS, SMAIT, SMU)
    if (/\b(SMA|SMAN|SMAS|SMAIT|SMU)\b/.test(name)) return 'SMA';

    // 6. Deteksi SMP (termasuk SMPN, SMPS, SMPIT, SLTP)
    if (/\b(SMP|SMPN|SMPS|SMPIT|SLTP)\b/.test(name)) return 'SMP';

    // Default jatuh ke SMP jika nama sekolah benar-benar tidak tertebak
    return 'SMP';
}

// ========================================================================
// 2. ACTION UNTUK SISWA ("Smart Login": Cari lalu Login, atau Daftar Baru)
// ========================================================================
export async function studentLoginAction(
    prevState: AuthState | null,
    formData: FormData
): Promise<AuthState> {
    const supabase = await createClient();

    const studentCode = formData.get('studentCode')?.toString().trim() || '';
    const fullName = formData.get('fullName')?.toString().trim() || '';
    const className = formData.get('className')?.toString().trim().toUpperCase() || '';
    const schoolName = formData.get('schoolName')?.toString().trim().toUpperCase() || '';

    if (!studentCode || !fullName || !className || !schoolName) {
        return { error: 'Semua kolom wajib diisi.', success: false };
    }

    const defaultPassword = 'DigibkStudent2026!';
    let isSuccess = false;
    const detectedLevel = detectEducationLevel(schoolName);

    try {
        // ==========================================
        // FASE 1: PENCARIAN SEKOLAH
        // ==========================================
        const { data: schools } = await supabase.from('schools').select('id').ilike('name', schoolName).limit(1);
        let schoolId = schools?.[0]?.id || null;
        let classId = null;

        if (schoolId) {
            const { data: classes } = await supabase.from('classes').select('id').eq('school_id', schoolId).ilike('name', className).limit(1);
            classId = classes?.[0]?.id || null;

            // ==========================================
            // FASE 2: CEK APAKAH SISWA SUDAH TERDAFTAR
            // ==========================================
            const { data: existingStudents } = await supabase
                .from('students')
                .select('id, user_id, full_name')
                .eq('school_id', schoolId)
                .eq('student_code', studentCode)
                .limit(1);

            const existingStudent = existingStudents?.[0] || null;

            if (existingStudent && existingStudent.user_id) {
                // Verifikasi agar tidak ada penyusup yang memakai nomor absen orang lain
                if (existingStudent.full_name.toLowerCase() !== fullName.toLowerCase()) {
                    return { error: 'Nomor Absen/NISN ini sudah digunakan oleh nama siswa lain.', success: false };
                }

                // Ambil email dari tabel users
                const { data: users } = await supabase.from('users').select('email').eq('id', existingStudent.user_id).limit(1);
                const userData = users?.[0] || null;

                if (userData && userData.email) {
                    const { error: signInError } = await supabase.auth.signInWithPassword({
                        email: userData.email,
                        password: defaultPassword
                    });

                    if (signInError) {
                        return { error: 'Sesi gagal dipulihkan. Silakan hubungi Guru BK.', success: false };
                    }

                    // BUG FIX SANGAT PINTAR: Jika siswa pindah kelas (mengetik nama kelas yang berbeda dari sebelumnya)
                    if (!classId) {
                        const { data: newClass, error: classErr } = await supabase
                            .from('classes')
                            .insert({ school_id: schoolId, name: className, education_level: detectedLevel })
                            .select('id')
                            .single();
                        if (!classErr && newClass) classId = newClass.id;
                    }

                    if (classId) {
                        // Cek apakah siswa sudah tercatat di kelas ini (untuk menghindari duplikasi keanggotaan)
                        const { data: membership } = await supabase.from('class_memberships')
                            .select('id')
                            .eq('student_id', existingStudent.id)
                            .eq('class_id', classId)
                            .limit(1)
                            .single();

                        if (!membership) {
                            // Nonaktifkan riwayat kelas lama
                            await supabase.from('class_memberships')
                                .update({ is_active: false, left_at: new Date().toISOString() })
                                .eq('student_id', existingStudent.id);

                            // Masukkan ke kelas baru
                            await supabase.from('class_memberships')
                                .insert({ class_id: classId, student_id: existingStudent.id, is_active: true });
                        }
                    }

                    isSuccess = true;
                } else {
                    return { error: 'Data akun tidak lengkap. Silakan hubungi Guru BK.', success: false };
                }
            }
        }

        // ==========================================
        // FASE 3: PENDAFTARAN BARU (AUTO-REGISTER)
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

            if (!schoolId) {
                const { data: newSchool, error: schoolErr } = await supabase
                    .from('schools').insert({ name: schoolName, code: `SCH-${randomId}`, education_level: detectedLevel })
                    .select('id').single();
                if (schoolErr) throw schoolErr;
                schoolId = newSchool.id;
            }

            if (!classId && schoolId) {
                const { data: newClass, error: classErr } = await supabase
                    .from('classes').insert({ school_id: schoolId, name: className, education_level: detectedLevel })
                    .select('id').single();
                if (classErr) throw classErr;
                classId = newClass.id;
            }

            if (schoolId && classId) {
                await supabase.from('user_roles').insert({ user_id: userId, role: 'STUDENT', school_id: schoolId });

                const { data: studentRecord, error: studentErr } = await supabase.from('students').insert({
                    user_id: userId,
                    school_id: schoolId,
                    student_code: studentCode,
                    full_name: fullName,
                    education_level: detectedLevel,
                }).select('id').single();

                if (studentErr) throw studentErr;

                await supabase.from('class_memberships').insert({
                    class_id: classId,
                    student_id: studentRecord.id
                });

                isSuccess = true;
            } else {
                throw new Error("Sistem gagal memproses ID Sekolah atau Kelas.");
            }
        }

    } catch (err: unknown) {
        const exactError = err instanceof Error ? err.message : String(err);
        console.error("Database Error Detail:", exactError);
        return { error: `Gagal memproses data: ${exactError}`, success: false };
    }

    // ==========================================
    // FASE 4: PENGALIHAN HALAMAN
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