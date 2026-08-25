// Lokasi file: src/components/pdf/PrintPdfButton.tsx
'use client';

import { useState } from 'react';
import { FileText, Loader2 } from 'lucide-react';

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
            const response = await fetch('/api/pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ moduleType, studentData })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                const errorMessage = errorData?.error || response.statusText || 'Kesalahan server tidak diketahui';
                throw new Error(errorMessage);
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');

        } catch (error: any) {
            console.error('Error printing PDF:', error);
            alert(`Maaf, gagal menyiapkan PDF.\nAlasan: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handlePrint}
            disabled={isLoading}
            // PERUBAHAN: hover:bg-red-600 dan penambahan durasi transisi
            className="flex-1 inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-600 text-white text-sm font-bold py-2.5 px-4 rounded-xl disabled:opacity-60 transition-all duration-300 shadow-sm"
        >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
            {isLoading ? 'Menyiapkan...' : 'Unduh PDF'}
        </button>
    );
}