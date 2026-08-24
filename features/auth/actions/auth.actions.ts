// src/features/auth/actions/auth.actions.ts

'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { headers } from 'next/headers';
import { publicLoginSchema, registeredLoginSchema, claimSchema } from '@/features/auth/schemas/auth.schema';

export type AuthState = {
    error: string | null;
    success: boolean;
};

const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function detectEducationLevel(schoolName: string): 'SD' | 'MI' | 'SMP' | 'SMA' | 'SMK' | 'MTs' | 'MA' {
    const name = schoolName.toUpperCase();
    if (/\b(MI|MIN|MIS)\b/.test(name)) return 'MI';
    if (/\b(SD|SDN|SDS|SDIT)\b/.test(name)) return 'SD';
    if (/\b(SMK|SMKN|SMKS|SMKIT|MAK|STM|SMEA)\b/.test(name)) return 'SMK';
    if (/\b(MA|MAN|MAS)\b/.test(name)) return 'MA';
    if (/\b(MTS|MTSN|MTSS)\b/.test(name)) return 'MTs';
    if (/\b(SMA|SMAN|SMAS|SMAIT|SMU)\b/.test(name)) return 'SMA';
    if (/\b(SMP|SMPN|SMPS|SMPIT|SLTP)\b/.test(name)) return 'SMP';
    return 'SMP';
}

// FUNGSI PEMBANTU UNTUK MENDAPATKAN IP ADDRESS (Super Deteksi)
async function getIpAddress(): Promise<string> {
    const headersList = await headers();

    const fallbacks = [
        headersList.get('cf-connecting-ip'),
        headersList.get('x-real-ip'),
        headersList.get('x-forwarded-for'),
        headersList.get('x-client-ip')
    ];

    for (const ip of fallbacks) {
        if (ip) {
            return ip.split(',')[0].trim();
        }
    }

    return '127.0.0.1 (Localhost)';
}

export async function publicLoginAction(prevState: AuthState | null, formData: FormData): Promise<AuthState> {
    const validated = publicLoginSchema.safeParse({
        studentCode: formData.get('studentCode')?.toString().trim(),
        fullName: formData.get('fullName')?.toString().trim(),
        className: formData.get('className')?.toString().trim().toUpperCase(),
        schoolName: formData.get('schoolName')?.toString().trim().toUpperCase(),
    });

    if (!validated.success) return { error: validated.error.issues[0].message, success: false };

    const { studentCode, fullName, className, schoolName } = validated.data;
    const supabase = await createClient();
    const detectedLevel = detectEducationLevel(schoolName);
    const GUEST_PASSWORD = 'DigibkGuest2026!';

    // TANGKAP IP ADDRESS
    const currentIp = await getIpAddress();

    try {
        let schoolId;
        const { data: existSchool } = await supabaseAdmin.from('schools').select('id').ilike('name', schoolName).limit(1).maybeSingle();
        if (existSchool) {
            schoolId = existSchool.id;
        } else {
            const randomSch = Math.random().toString(36).substring(2, 8);
            const { data: newSchool, error: schoolErr } = await supabaseAdmin.from('schools').insert({ name: schoolName, code: `SCH-${randomSch}`, education_level: detectedLevel }).select('id').single();
            if (schoolErr || !newSchool) throw new Error(`Gagal menyimpan sekolah: ${schoolErr?.message}`);
            schoolId = newSchool.id;
        }

        let classId;
        const { data: existClass } = await supabaseAdmin.from('classes').select('id').eq('school_id', schoolId).ilike('name', className).limit(1).maybeSingle();
        if (existClass) {
            classId = existClass.id;
        } else {
            const { data: newClass, error: classErr } = await supabaseAdmin.from('classes').insert({ school_id: schoolId, name: className, education_level: detectedLevel }).select('id').single();
            if (classErr || !newClass) throw new Error(`Gagal menyimpan kelas: ${classErr?.message}`);
            classId = newClass.id;
        }

        const { data: existingStudent } = await supabaseAdmin
            .from('students')
            .select('id, user_id, full_name')
            .eq('school_id', schoolId)
            .eq('student_code', studentCode)
            .limit(1)
            .maybeSingle();

        if (existingStudent) {
            if (existingStudent.full_name.toLowerCase() !== fullName.toLowerCase()) {
                return { error: 'NISN/Nomor Induk ini sudah terdaftar atas nama orang lain. Silakan periksa kembali.', success: false };
            }

            const { data: authData, error: authErr } = await supabaseAdmin.auth.admin.getUserById(existingStudent.user_id);
            if (authErr || !authData.user) throw new Error('Data autentikasi siswa tidak ditemukan.');

            const isGuest = authData.user.user_metadata?.is_guest;
            const userEmail = authData.user.email;

            if (!isGuest) {
                return { error: 'Akun Anda sudah disimpan permanen! Silakan masuk melalui tab "Gunakan Akun".', success: false };
            }

            await supabaseAdmin.auth.admin.updateUserById(existingStudent.user_id, { password: GUEST_PASSWORD });
            const { error: signInErr } = await supabase.auth.signInWithPassword({ email: userEmail!, password: GUEST_PASSWORD });
            if (signInErr) throw new Error('Gagal memulihkan sesi Tamu.');

            // PERBAIKAN 1: UPDATE IP ADDRESS SAAT PEMULIHAN SESI DENGAN PENANGKAP ERROR
            const { error: updateIpErr1 } = await supabaseAdmin.from('users').update({ ip_address: currentIp }).eq('id', existingStudent.user_id);
            if (updateIpErr1) console.error("Gagal update IP (Pemulihan Tamu):", updateIpErr1.message);

        } else {
            const randomId = Math.random().toString(36).substring(2, 8);
            const guestEmail = `guest-${studentCode.replace(/\s/g, '')}-${randomId}@digibk.local`;

            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email: guestEmail,
                password: GUEST_PASSWORD,
                options: { data: { full_name: fullName, is_guest: true } }
            });

            if (signUpError || !signUpData.user) return { error: 'Gagal membuat sesi publik. Coba lagi.', success: false };
            const userId = signUpData.user.id;

            const { error: roleErr } = await supabaseAdmin.from('user_roles').insert({ user_id: userId, role: 'STUDENT', school_id: schoolId });
            if (roleErr) throw new Error(`Gagal menetapkan peran: ${roleErr.message}`);

            const { data: studentRecord, error: studentErr } = await supabaseAdmin.from('students').insert({ user_id: userId, school_id: schoolId, student_code: studentCode, full_name: fullName, education_level: detectedLevel }).select('id').single();
            if (studentErr || !studentRecord) throw new Error(`Gagal membuat profil siswa: ${studentErr?.message}`);

            const { error: memberErr } = await supabaseAdmin.from('class_memberships').insert({ class_id: classId, student_id: studentRecord.id, is_active: true });
            if (memberErr) throw new Error(`Gagal menetapkan anggota kelas: ${memberErr.message}`);

            // PERBAIKAN 2: UPDATE IP ADDRESS SAAT AKUN BARU DIBUAT DENGAN PENANGKAP ERROR
            const { error: updateIpErr2 } = await supabaseAdmin.from('users').update({ ip_address: currentIp }).eq('id', userId);
            if (updateIpErr2) console.error("Gagal update IP (Tamu Baru):", updateIpErr2.message);
        }

    } catch (err: unknown) {
        const exactError = err instanceof Error ? err.message : String(err);
        return { error: `Sistem Database: ${exactError}`, success: false };
    }

    redirect('/student/dashboard');
}

export async function registeredLoginAction(prevState: AuthState | null, formData: FormData): Promise<AuthState> {
    const validated = registeredLoginSchema.safeParse({
        identifier: formData.get('identifier')?.toString().trim(),
        password: formData.get('password')?.toString()
    });

    if (!validated.success) return { error: validated.error.issues[0].message, success: false };

    const { identifier, password } = validated.data;
    const supabase = await createClient();
    let loginEmail = identifier;

    if (!identifier.includes('@')) {
        const { data: student } = await supabase.from('students').select('user_id').eq('student_code', identifier).limit(1).maybeSingle();
        if (!student) return { error: 'NISN tidak terdaftar. Jika Anda pengguna baru, silakan gunakan tab "Masuk Publik".', success: false };

        const { data: userData } = await supabaseAdmin.auth.admin.getUserById(student.user_id);
        if (userData?.user?.email) {
            loginEmail = userData.user.email;
        } else {
            return { error: 'Terjadi kesalahan sistem saat melacak akun.', success: false };
        }
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmail, password });
    if (error || !data.user) return { error: 'Kredensial salah. Pastikan NISN/Email dan Kata Sandi benar.', success: false };

    // PERBAIKAN 3: TANGKAP DAN UPDATE IP ADDRESS SETELAH LOGIN SUKSES DENGAN PENANGKAP ERROR
    const currentIp = await getIpAddress();
    const { error: updateIpErr3 } = await supabaseAdmin.from('users').update({ ip_address: currentIp }).eq('id', data.user.id);
    if (updateIpErr3) console.error("Gagal update IP (Login Permanen):", updateIpErr3.message);

    const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', data.user.id).limit(1).single();

    if (roleData) {
        if (roleData.role === 'SUPER_ADMIN') {
            redirect('/admin/dashboard');
        } else if (['BK_COUNSELOR', 'TEACHER'].includes(roleData.role)) {
            redirect('/bk/dashboard');
        } else {
            redirect('/student/dashboard');
        }
    } else {
        redirect('/student/dashboard');
    }
}

export async function logoutAction(): Promise<void> {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login');
}

export async function claimAccountAction(nisn: string, password: string): Promise<AuthState> {
    const validated = claimSchema.safeParse({
        newNisn: nisn,
        newPassword: password
    });

    if (!validated.success) {
        return { error: validated.error.issues[0].message, success: false };
    }

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        return { error: 'Sesi tidak valid. Silakan muat ulang halaman.', success: false };
    }

    try {
        const { error: dbError } = await supabase
            .from('students')
            .update({ student_code: validated.data.newNisn })
            .eq('user_id', user.id);

        if (dbError) throw new Error('Gagal memperbarui data NISN di database.');

        const { error: authError } = await supabase.auth.updateUser({
            password: validated.data.newPassword,
            data: { is_guest: false }
        });

        if (authError) throw authError;

        return { error: null, success: true };
    } catch (err: unknown) {
        const exactError = err instanceof Error ? err.message : String(err);
        return { error: `Gagal menyimpan: ${exactError}`, success: false };
    }
}