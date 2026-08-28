// Lokasi file: src/lib/constants/vark.constants.ts

export type VarkCode = 'V' | 'A' | 'R' | 'K';

export const VARK_CODES: VarkCode[] = ['V', 'A', 'R', 'K'];

export const VARK_EXPECTED_QUESTIONS = 20;
export const VARK_SCORING_VERSION = 'VARK-SCORING-v1';

export const VARK_VERSION_MAP: Record<string, string> = {
    SD: 'VARK-SD-v1',
    MI: 'VARK-MI-v1',
    SMP: 'VARK-SMP-v1',
    MTs: 'VARK-MTs-v1',
    SMA: 'VARK-SMA-v1',
    MA: 'VARK-MA-v1',
    SMK: 'VARK-SMK-v1',
};

export const VARK_DIMENSION_PRIORITY: Record<VarkCode, number> = {
    V: 1,
    A: 2,
    R: 3,
    K: 4,
};

export const VARK_COLORS: Record<string, string> = {
    V: '#3b82f6', // Blue
    A: '#10b981', // Emerald/Green
    R: '#f59e0b', // Amber/Orange
    K: '#ef4444', // Red
};

export interface VarkShortInfo {
    id: string;
    desc: string;
    color: string;
}

export const VARK_DESC: Record<string, VarkShortInfo> = {
    'V': {
        id: 'Visual',
        desc: 'Kamu peka terhadap informasi visual. Menggunakan gambar, diagram, grafik, atau video akan membuat materi jauh lebih mudah diingat.',
        color: '#3b82f6'
    },
    'A': {
        id: 'Auditori',
        desc: 'Kamu menyerap informasi dengan mendengarkan. Penjelasan guru, diskusi, atau merekam materi adalah metode paling jitu untukmu.',
        color: '#10b981'
    },
    'R': {
        id: 'Read/Write',
        desc: 'Kamu kuat memahami instruksi teks. Membaca buku teks, merangkum materi, atau menulis ulang catatan adalah cara paling efektif.',
        color: '#f59e0b'
    },
    'K': {
        id: 'Kinestetik',
        desc: 'Kamu tipe pembelajar yang harus "bergerak". Melakukan eksperimen, simulasi, atau praktik langsung akan membuatmu cepat paham.',
        color: '#ef4444'
    }
};

export const VARK_MULTIMODAL_DESC =
    'Sebagai seorang pembelajar Multimodal, Anda memiliki keunggulan kognitif dalam memproses informasi melalui berbagai saluran. Alih-alih bergantung pada satu metode tunggal, Anda mampu mengintegrasikan isyarat visual, auditori, teks, dan kinestetik secara bersamaan.';
