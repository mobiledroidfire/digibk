// Lokasi file: src/components/auth/LogoutButton.tsx
'use client';

import { useState } from 'react';
import { LogOut, Loader2 } from 'lucide-react';
import ExitConfirmationModal from '@/components/auth/ExitConfirmationModal';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { claimAccountAction } from '@/features/auth/actions/auth.actions';

interface LogoutButtonProps {
    isGuestAccount?: boolean;
    studentNisn?: string; // TAMBAHAN 1: Menerima data NISN dari halaman utama
}

export default function LogoutButton({ isGuestAccount = false, studentNisn = '' }: LogoutButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const executeLogout = async (isRegistered: boolean) => {
        setIsLoggingOut(true);
        try {
            await supabase.auth.signOut();
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
        executeLogout(true);
    };

    const handleForceExit = () => {
        executeLogout(false);
    };

    return (
        <>
            <button
                onClick={handleLogoutClick}
                disabled={isLoggingOut}
                className="flex items-center gap-2 px-4 py-2 bg-red-900 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
                onConfirmExit={handleForceExit}
                onSaveAccount={handleSaveAccount}
                initialNisn={studentNisn} // TAMBAHAN 2: Meneruskan NISN ke pop-up
            />
        </>
    );
}