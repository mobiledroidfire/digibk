// src/features/admin/actions/admin.actions.ts
'use server';

import { createClient as createAdminClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

// Kita menggunakan Supabase Admin Client agar memiliki hak akses penuh (Super Admin)
const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Definisikan tipe balikan agar tidak perlu menebak-nebak
type ActionResponse<T = undefined> = {
    success: boolean;
    data?: T;
    error?: string;
};

// PERBAIKAN: Definisi tipe data spesifik untuk menggantikan 'any'
export type UserDashboardData = {
    id: string;
    full_name: string;
    email: string;
    status: string;
    created_at: string;
    ip_address: string | null;
    role: string;
    nisn: string;
    isGuest: boolean;
    lastSignIn: string;
};

// PERBAIKAN: Menggunakan UserDashboardData[] menggantikan any[]
export async function fetchAllUsersWithAuth(): Promise<ActionResponse<UserDashboardData[]>> {
    try {
        const { data: publicUsers, error: dbError } = await supabaseAdmin
            .from('users')
            .select(`
                id, full_name, email, status, created_at, ip_address,
                user_roles ( role ),
                students ( student_code )
            `)
            .order('created_at', { ascending: false });

        if (dbError) throw dbError;

        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers();
        if (authError) throw authError;

        // TypeScript sekarang akan tahu persis format 'combinedUsers'
        const combinedUsers: UserDashboardData[] = publicUsers.map((pUser) => {
            const authUser = authData.users.find((a) => a.id === pUser.id);
            return {
                id: pUser.id,
                full_name: pUser.full_name,
                email: pUser.email,
                status: pUser.status,
                created_at: pUser.created_at,
                role: pUser.user_roles?.[0]?.role || 'TIDAK DIKETAHUI',
                nisn: pUser.students?.[0]?.student_code || '-',
                isGuest: authUser?.user_metadata?.is_guest === true,
                lastSignIn: authUser?.last_sign_in_at || pUser.created_at,
                ip_address: pUser.ip_address || null
            };
        });

        return { success: true, data: combinedUsers };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Gagal mengambil data pengguna";
        return { success: false, error: errorMessage };
    }
}

export async function deleteUsersAction(userIds: string[]): Promise<ActionResponse> {
    try {
        if (!userIds || userIds.length === 0) {
            throw new Error("Tidak ada pengguna yang dipilih untuk dihapus.");
        }

        for (const id of userIds) {
            const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
            if (error) {
                throw new Error(`Gagal menghapus user ID ${id}: ${error.message}`);
            }
        }

        revalidatePath('/admin/dashboard');

        return { success: true };
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat menghapus pengguna.";
        return { success: false, error: errorMessage };
    }
}