// Lokasi file: src/components/pdf/PrintPdfButton.tsx
'use client'; // Wajib ditambahkan agar tombol bisa diklik

import { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';

// Menentukan tipe data yang dibutuhkan oleh tombol
type PrintPdfButtonProps = {
    moduleType: string;
    studentData: {
        id: string;
        name: string;
        school: string;
    };
};

export default function PrintPdfButton({ moduleType, studentData }: PrintPdfButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handlePrint = async () => {
        setIsLoading(true);
        try {
            // Memanggil API route pembuat PDF yang sudah kita buat sebelumnya
            const response = await fetch('/api/pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ moduleType, studentData })
            });

            if (!response.ok) throw new Error('Gagal memproses PDF');

            // Menerima file PDF dan membukanya di tab baru
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');

        } catch (error) {
            console.error('Error printing PDF:', error);
            alert('Maaf, terjadi kesalahan saat menyiapkan PDF.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handlePrint}
            disabled={isLoading}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-900 text-white text-sm font-bold py-2.5 px-4 rounded-xl disabled:opacity-60 transition-colors shadow-sm"
        >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            {isLoading ? 'Menyiapkan...' : 'Unduh PDF'}
        </button>
    );
}