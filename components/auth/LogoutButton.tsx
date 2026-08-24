// Lokasi file: src/components/auth/LogoutButton.tsx
'use client';

import { useState } from 'react';
import { LogOut, Loader2 } from 'lucide-react';
import ExitConfirmationModal from '@/components/auth/ExitConfirmationModal'; // Pastikan path benar
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
// IMPORT ACTION BARU
import { claimAccountAction } from '@/features/auth/actions/auth.actions';

interface LogoutButtonProps {
    isGuestAccount?: boolean;
}

export default function LogoutButton({ isGuestAccount = false }: LogoutButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const executeLogout = async () => {
        setIsLoggingOut(true);
        try {
            await supabase.auth.signOut();
            router.push('/login');
            router.refresh();
        } catch (error) {
            console.error('Gagal keluar:', error);
            setIsLoggingOut(false);
        }
    };

    const handleLogoutClick = () => {
        if (isGuestAccount) {
            setIsModalOpen(true);
        } else {
            executeLogout();
        }
    };

    // PERBAIKAN: Memanggil Server Action yang divalidasi Zod
    const handleSaveAccount = async (nisn: string, password: string) => {
        // Panggil Server Action claimAccountAction
        const result = await claimAccountAction(nisn, password);

        if (!result.success) {
            // Jika Zod menemukan error (misal password kurang dari 6), lempar error ke modal
            throw new Error(result.error || 'Gagal memvalidasi data');
        }

        alert('Akun berhasil diamankan! Anda bisa login dengan NISN dan password ini nanti.');
        setIsModalOpen(false);

        // Opsional: Muat ulang halaman agar header/status tamu diperbarui
        router.refresh();
    };

    return (
        <>
            <button
                onClick={handleLogoutClick}
                disabled={isLoggingOut}
                className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoggingOut ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <LogOut className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">
                    {isLoggingOut ? 'Keluar...' : 'Keluar'}
                </span>
            </button>

            <ExitConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirmExit={executeLogout}
                onSaveAccount={handleSaveAccount}
            />
        </>
    );
}