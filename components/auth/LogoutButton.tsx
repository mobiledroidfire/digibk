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

    // PERBAIKAN: Fungsi logout sekarang menerima parameter isRegistered
    const executeLogout = async (isRegistered: boolean) => {
        setIsLoggingOut(true);
        try {
            await supabase.auth.signOut();

            // Logika pengarahan (Redirect)
            if (isRegistered) {
                router.push('/login?tab=registered');
            } else {
                router.push('/login');
            }

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
            // Sudah permanen -> keluar dan arahkan ke tab Gunakan Akun (true)
            executeLogout(true);
        }
    };

    const handleSaveAccount = async (nisn: string, password: string) => {
        const result = await claimAccountAction(nisn, password);

        if (!result.success) {
            throw new Error(result.error || 'Gagal memvalidasi data');
        }

        alert('Akun berhasil diamankan! Anda bisa login dengan NISN dan password ini nanti.');
        setIsModalOpen(false);

        // Setelah berhasil mendaftar, keluar dan arahkan ke tab Gunakan Akun (true)
        executeLogout(true);
    };

    const handleForceExit = () => {
        // Keluar paksa sebagai tamu -> arahkan ke tab Publik (false)
        executeLogout(false);
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
                // PERBAIKAN: Gunakan handleForceExit saat memilih Keluar Tanpa Menyimpan
                onConfirmExit={handleForceExit}
                onSaveAccount={handleSaveAccount}
            />
        </>
    );
}