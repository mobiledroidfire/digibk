// Lokasi file: src/components/admin/DeleteUserButton.tsx
'use client';

import { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteUserAction } from '@/features/admin/actions/admin.actions';

interface Props {
    userId: string;
    userName: string;
    role: string;
}

export default function DeleteUserButton({ userId, userName, role }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        // Cegah admin menghapus dirinya sendiri atau Super Admin lain secara tidak sengaja
        if (role === 'SUPER_ADMIN') {
            alert('Anda tidak bisa menghapus sesama Super Admin dari sini.');
            return;
        }

        const confirm = window.confirm(`Apakah Anda yakin ingin menghapus "${userName}"?\n\nPERINGATAN: Semua data hasil asesmen dan riwayat aktivitas pengguna ini akan ikut terhapus selamanya!`);

        if (!confirm) return;

        setIsDeleting(true);
        const result = await deleteUserAction(userId);
        setIsDeleting(false);

        if (!result.success) {
            alert(`Gagal menghapus: ${result.error}`);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting || role === 'SUPER_ADMIN'}
            className="p-2 text-rose-500 hover:bg-rose-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mx-auto block"
            title="Hapus Pengguna & Datanya"
        >
            {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
        </button>
    );
}