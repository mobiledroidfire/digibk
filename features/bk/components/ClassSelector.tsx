// Lokasi file: /src/features/bk/components/ClassSelector.tsx
'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Filter } from 'lucide-react';

interface ClassOption {
    id: string;
    name: string;
}

interface ClassSelectorProps {
    classes: ClassOption[];
    selectedClassId: string;
}

export default function ClassSelector({ classes, selectedClassId }: ClassSelectorProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const params = new URLSearchParams(searchParams);
        const newClassId = e.target.value;

        if (newClassId) {
            params.set('class', newClassId);
        } else {
            params.delete('class');
        }

        // Kembalikan ke halaman 1 setiap kali mengganti kelas
        params.set('page', '1');

        // Perbarui URL tanpa me-reload halaman secara penuh
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-3 shadow-xs">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
                value={selectedClassId}
                onChange={handleChange}
                className="bg-transparent py-2.5 text-sm font-medium text-slate-700 focus:outline-none cursor-pointer w-full sm:w-auto"
            >
                <option value="">-- Pilih Kelas --</option>
                {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                        Kelas {c.name}
                    </option>
                ))}
            </select>
        </div>
    );
}