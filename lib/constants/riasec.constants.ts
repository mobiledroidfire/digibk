// Lokasi file: src/lib/constants/riasec.constants.ts

export type RiasecCode = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export const RIASEC_CODES: RiasecCode[] = ['R', 'I', 'A', 'S', 'E', 'C'];

export const RIASEC_EXPECTED_QUESTIONS = 42;
export const RIASEC_SCORING_VERSION = 'RIASEC-SCORING-v1';

export const RIASEC_VERSION_MAP: Record<string, string> = {
    SD: 'RIASEC-SD-v1',
    MI: 'RIASEC-MI-v1',
    SMP: 'RIASEC-SMP-v1',
    MTs: 'RIASEC-MTs-v1',
    SMA: 'RIASEC-SMA-v1',
    MA: 'RIASEC-MA-v1',
    SMK: 'RIASEC-SMK-v1',
};

export const RIASEC_DIMENSION_PRIORITY: Record<RiasecCode, number> = {
    R: 1,
    I: 2,
    A: 3,
    S: 4,
    E: 5,
    C: 6,
};

export interface RiasecShortInfo {
    title: string;
    id: string;
    desc: string;
}

export const RIASEC_DESC: Record<string, RiasecShortInfo> = {
    'R': { title: 'Realistic', id: 'Realistis', desc: 'Menyukai aktivitas fisik, mesin, alat, dan lingkungan luar ruangan.' },
    'I': { title: 'Investigative', id: 'Investigatif', desc: 'Memiliki rasa ingin tahu yang tinggi, menyukai analisis, dan sains.' },
    'A': { title: 'Artistic', id: 'Artistik', desc: 'Menyukai kreativitas, seni, kebebasan berekspresi, dan inovasi.' },
    'S': { title: 'Social', id: 'Sosial', desc: 'Menyukai interaksi, gemar menolong, dan membimbing orang lain.' },
    'E': { title: 'Enterprising', id: 'Wirausaha', desc: 'Menyukai kepemimpinan, mampu memengaruhi orang lain, dan berani mengambil risiko.' },
    'C': { title: 'Conventional', id: 'Konvensional', desc: 'Menyukai keteraturan, mengolah data, dan aktivitas yang terstruktur.' }
};

export const RIASEC_TRANSLATIONS: Record<string, string> = {
    Realistic: 'Realistis',
    Investigative: 'Investigatif',
    Artistic: 'Artistik',
    Social: 'Sosial',
    Enterprising: 'Wirausaha',
    Conventional: 'Konvensional'
};
