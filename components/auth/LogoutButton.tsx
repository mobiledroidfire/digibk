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
    studentNisn?: string;
}

export default function LogoutButton({ isGuestAccount = false, studentNisn = '' }: LogoutButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const executeLogout = async (isRegistered: boolean) => {
        setIsModalOpen(false);
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
        // PERBAIKAN: Selalu buka modal. Biarkan modal yang memutuskan isinya.
        setIsModalOpen(true);
    };

    const handleSaveAccount = async (nisn: string, password: string) => {
        const result = await claimAccountAction(nisn, password);
        if (!result.success) {
            throw new Error(result.error || 'Gagal memvalidasi data');
        }
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
                onConfirmExit={(isRegistered = false) => executeLogout(isRegistered)}
                onSaveAccount={handleSaveAccount}
                initialNisn={studentNisn}
                isGuestAccount={isGuestAccount} // PERBAIKAN: Kirim status guest ke dalam modal
            />
        </>
    );
}