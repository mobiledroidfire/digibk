// D:\APLIKASI\digibk\features\auth\actions\auth.actions.ts
'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
// IMPORT SKEMA YANG BARU DIBUAT
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

    try {
        const randomId = Math.random().toString(36).substring(2, 8);
        const guestEmail = `guest-${studentCode.replace(/\s/g, '')}-${randomId}@digibk.local`;
        const tempPassword = `Temp${randomId}!`;

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: guestEmail,
            password: tempPassword,
            options: { data: { full_name: fullName, is_guest: true } }
        });

        if (signUpError || !signUpData.user) return { error: 'Gagal membuat sesi publik. Coba lagi.', success: false };
        const userId = signUpData.user.id;

        let schoolId;
        const { data: existSchool } = await supabase.from('schools').select('id').ilike('name', schoolName).limit(1).maybeSingle();
        if (existSchool) {
            schoolId = existSchool.id;
        } else {
            const { data: newSchool } = await supabase.from('schools').insert({ name: schoolName, code: `SCH-${randomId}`, education_level: detectedLevel }).select('id').single();
            schoolId = newSchool!.id;
        }

        let classId;
        const { data: existClass } = await supabase.from('classes').select('id').eq('school_id', schoolId).ilike('name', className).limit(1).maybeSingle();
        if (existClass) {
            classId = existClass.id;
        } else {
            const { data: newClass } = await supabase.from('classes').insert({ school_id: schoolId, name: className, education_level: detectedLevel }).select('id').single();
            classId = newClass!.id;
        }

        await supabase.from('user_roles').insert({ user_id: userId, role: 'STUDENT', school_id: schoolId });
        const { data: studentRecord } = await supabase.from('students').insert({ user_id: userId, school_id: schoolId, student_code: studentCode, full_name: fullName, education_level: detectedLevel }).select('id').single();
        await supabase.from('class_memberships').insert({ class_id: classId, student_id: studentRecord!.id, is_active: true });

    } catch (err: unknown) {
        const exactError = err instanceof Error ? err.message : String(err);
        return { error: `Sistem Error: ${exactError}`, success: false };
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

    const { data: roleData } = await supabase.from('user_roles').select('role').eq('user_id', data.user.id).limit(1).single();

    if (roleData && ['BK_COUNSELOR', 'TEACHER', 'SUPER_ADMIN'].includes(roleData.role)) {
        redirect('/bk/dashboard');
    } else {
        redirect('/student/dashboard');
    }
}

export async function logoutAction(): Promise<void> {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login');
}

// Tambahkan fungsi ini di baris paling bawah pada auth.actions.ts

export async function claimAccountAction(nisn: string, password: string): Promise<AuthState> {
    // 1. Validasi dengan Zod (claimSchema yang sudah Anda buat)
    const validated = claimSchema.safeParse({
        newNisn: nisn,
        newPassword: password
    });

    if (!validated.success) {
        return { error: validated.error.issues[0].message, success: false };
    }

    const supabase = await createClient();

    // 2. Pastikan user sedang login
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        return { error: 'Sesi tidak valid. Silakan muat ulang halaman.', success: false };
    }

    try {
        // 3. Update NISN di tabel 'students' (jika siswa mengganti NISN sementaranya)
        const { error: dbError } = await supabase
            .from('students')
            .update({ student_code: validated.data.newNisn })
            .eq('user_id', user.id);

        if (dbError) throw new Error('Gagal memperbarui data NISN di database.');

        // 4. Update Password dan hapus label 'is_guest' di Supabase Auth
        const { error: authError } = await supabase.auth.updateUser({
            password: validated.data.newPassword,
            data: { is_guest: false } // Mengubah status menjadi akun permanen
        });

        if (authError) throw authError;

        return { error: null, success: true };
    } catch (err: unknown) {
        const exactError = err instanceof Error ? err.message : String(err);
        return { error: `Gagal menyimpan: ${exactError}`, success: false };
    }
}