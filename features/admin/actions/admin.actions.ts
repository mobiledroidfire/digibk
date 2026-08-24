'use server';

import { createClient as createAdminClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// Kita menggunakan Supabase Admin Client agar memiliki hak akses penuh (Super Admin)
const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function fetchAllUsersWithAuth() {
    try {
        // 1. Ambil data dari tabel public.users dan relasinya
        const { data: publicUsers, error: dbError } = await supabaseAdmin
            .from('users')
            .select(`
                id, full_name, email, status, created_at,
                user_roles ( role ),
                students ( student_code )
            `)
            .order('created_at', { ascending: false });

        if (dbError) throw dbError;

        // 2. Ambil data asli dari Supabase Auth (untuk mengecek is_guest dan last_sign_in_at)
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
        if (authError) throw authError;

        // 3. Gabungkan kedua data tersebut
        const combinedUsers = publicUsers.map((pUser) => {
            const authUser = authData.users.find((a) => a.id === pUser.id);
            return {
                ...pUser,
                role: pUser.user_roles?.[0]?.role || 'TIDAK DIKETAHUI',
                nisn: pUser.students?.[0]?.student_code || '-',
                isGuest: authUser?.user_metadata?.is_guest === true,
                lastSignIn: authUser?.last_sign_in_at || pUser.created_at,
            };
        });

        return { success: true, data: combinedUsers };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export async function deleteUserAction(userId: string) {
    try {
        // KEAJAIBAN CASCADE: 
        // Dengan menghapus user dari Supabase Auth, otomatis tabel public.users, 
        // students, assessment_sessions, dan semua hasilnya akan ikut terhapus!
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

        if (error) throw error;

        // Segarkan halaman tabel secara otomatis
        revalidatePath('/admin/dashboard');

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}