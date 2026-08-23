import { NextResponse } from 'next/server';
import { renderToBuffer, Text, View, StyleSheet } from '@react-pdf/renderer';
import MasterPdfTemplate from '@/components/pdf/MasterPdfTemplate';
import { createClient } from '@/lib/supabase/server';

// Import Data
import {
    riasecDictionary,
    dimensionDefs,
    PhaseData as RiasecPhaseData,
    type AssessmentResult,
    type RiasecProfile
} from '@/lib/data/riasec';

import {
    vakDictionary,
    PhaseData as VakPhaseData,
    type AssessmentResultVak,
    type VakProfile
} from '@/lib/data/vak';

// Helper: Proporsi dominan yang lebih akurat
function blendAccurate(arr1: string[] = [], arr2: string[] = [], arr3: string[] = [], maxItems: number): string[] {
    const combined = [...arr1.slice(0, 4), ...arr2.slice(0, 2), ...arr3.slice(0, 1)];
    return [...new Set(combined)].slice(0, maxItems);
}

function cleanCode(code?: string): string {
    return code ? code.trim().toUpperCase() : '';
}

// STYLESHEET 
const styles = StyleSheet.create({
    container: { padding: 5 },
    phaseBanner: { backgroundColor: '#3b82f6', padding: 12, borderRadius: 8, marginBottom: 15 },
    phaseTitle: { color: '#ffffff', fontSize: 13, fontWeight: 'bold', marginBottom: 2 },
    phaseSub: { color: '#eff6ff', fontSize: 10 },

    sectionCard: { backgroundColor: '#ffffff', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 15 },
    sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#0f172a', marginBottom: 8, textTransform: 'uppercase' },

    badgeProfil: { backgroundColor: '#eff6ff', padding: '6 12', borderRadius: 6, width: 80, textAlign: 'center', marginBottom: 8 },
    badgeText: { fontSize: 16, fontWeight: 'bold', color: '#1d4ed8' },

    alertBlue: { backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: 10, borderRadius: 6, marginTop: 8 },
    alertBlueText: { color: '#1e40af', fontSize: 9.5, lineHeight: 1.4 },

    // Desain Grafik Bar Modern
    scoreRowContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    scoreItem: { width: '48%' },
    scoreItemFull: { width: '100%', marginBottom: 12 },
    scoreTextRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
    scoreLabel: { fontSize: 10, fontWeight: 'bold', color: '#1e293b' },
    scoreSub: { fontSize: 8.5, color: '#64748b', marginTop: 2 },
    scoreVal: { fontSize: 10, fontWeight: 'bold', color: '#1d4ed8' },
    barBg: { height: 6, backgroundColor: '#e2e8f0', borderRadius: 3, width: '100%', marginTop: 2 },
    barFill: { height: 6, borderRadius: 3 },

    // Grid
    gridRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginBottom: 15 },
    gridCol: { flex: 1, backgroundColor: '#ffffff', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' },

    colHeader: { fontSize: 11, fontWeight: 'bold', color: '#0f172a', marginBottom: 6, borderBottom: '1px solid #f1f5f9', paddingBottom: 4 },
    colSubHeader: { fontSize: 9, fontWeight: 'bold', color: '#64748b', marginTop: 6, marginBottom: 3, textTransform: 'uppercase' },

    // Bullet Point
    bulletContainer: { flexDirection: 'row', marginBottom: 4, alignItems: 'flex-start' },
    bulletPoint: { width: 12, fontSize: 10, color: '#64748b' },
    bulletItem: { flex: 1, fontSize: 9.5, color: '#334155', lineHeight: 1.4 },

    boxDark: { flex: 1, backgroundColor: '#1e293b', padding: 12, borderRadius: 8 },
    boxDarkTitle: { fontSize: 11, fontWeight: 'bold', color: '#ffffff', marginBottom: 8 },
    boxDarkText: { flex: 1, fontSize: 9.5, color: '#cbd5e1', lineHeight: 1.4 },

    boxLight: { flex: 1, backgroundColor: '#eff6ff', padding: 12, borderRadius: 8, border: '1px solid #bfdbfe' },
    boxLightTitle: { fontSize: 11, fontWeight: 'bold', color: '#1e40af', marginBottom: 8 },
    boxLightText: { flex: 1, fontSize: 9.5, color: '#1e3a8a', lineHeight: 1.4 }
});

// Kamus Terjemahan & Warna Dinamis
const hollandTranslations: Record<string, string> = {
    'Realistic': 'Realistis',
    'Investigative': 'Investigatif',
    'Artistic': 'Artistik',
    'Social': 'Sosial',
    'Enterprising': 'Wirausaha',
    'Conventional': 'Konvensional'
};

const riasecColors: Record<string, string> = {
    'R': '#ef4444', // Merah
    'I': '#f59e0b', // Kuning/Amber
    'A': '#10b981', // Hijau
    'S': '#3b82f6', // Biru
    'E': '#8b5cf6', // Ungu
    'C': '#64748b'  // Abu-abu kebiruan
};

const vakTranslations: Record<string, string> = {
    'V': 'Penglihatan',
    'A': 'Pendengaran',
    'K': 'Gerak / Praktik'
};

const vakColors: Record<string, string> = {
    'V': '#3b82f6', // Biru
    'A': '#10b981', // Hijau
    'K': '#f59e0b'  // Oranye
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { moduleType } = body;
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Belum login' }, { status: 401 });

        const { data: student } = await supabase
            .from('students')
            .select(`id, full_name, education_level, grade_level, schools (name)`)
            .eq('user_id', user.id)
            .single();

        if (!student) return NextResponse.json({ error: 'Data siswa tidak ditemukan' }, { status: 404 });

        const studentName = student.full_name;
        const schoolObj = student.schools;
        const baseSchoolName = schoolObj && typeof schoolObj === 'object' && 'name' in schoolObj ? String(schoolObj.name) : 'Sekolah Anda';
        const eduLvl = student.education_level || 'SMP';

        let defaultGrade = 7;
        if (eduLvl === 'SD' || eduLvl === 'MI') defaultGrade = 6;
        else if (eduLvl === 'SMA' || eduLvl === 'MA' || eduLvl === 'SMK') defaultGrade = 12;

        const grade = student.grade_level ?? defaultGrade;
        const schoolNameWithGrade = `${baseSchoolName} - Kelas ${grade}`;

        let phaseKey = 'SMP_Awal';
        let bannerTitle = 'Fase Penjelajahan Minat';
        let bannerMessage = 'Eksplorasi minat dan bakat siswa.';

        if (eduLvl === 'SD' || eduLvl === 'MI') {
            if (grade <= 3) { phaseKey = 'SD_Awal'; bannerMessage = "Fase Bermain & Karakter Dasar: Dukung anak bereksplorasi dengan menyenangkan!"; }
            else if (grade <= 5) { phaseKey = 'SD_Akhir'; bannerMessage = "Fase Eksplorasi Minat: Kenalkan anak pada berbagai ekstrakurikuler dasar."; }
            else { phaseKey = 'SD_Transisi'; bannerTitle = "Fase Transisi Pendidikan"; bannerMessage = "Persiapan Lulus SD/MI: Fokus persiapkan mental dan pemilihan SMP/MTs yang mendukung minatnya."; }
        } else if (eduLvl === 'SMP' || eduLvl === 'MTs') {
            if (grade <= 8) { phaseKey = 'SMP_Awal'; bannerMessage = "Fase Pencarian Jati Diri: Eksplorasi ekstrakurikuler dan organisasi."; }
            else { phaseKey = 'SMP_Transisi'; bannerTitle = "Fase Transisi Pendidikan"; bannerMessage = "Penentuan Jalur Lanjutan: Mantapkan arah penjurusan ke SMA, MA, atau SMK!"; }
        } else if (eduLvl === 'SMA' || eduLvl === 'MA') {
            if (grade <= 11) { phaseKey = 'SMA_Awal'; bannerMessage = "Fase Peminatan: Perdalam portofolio akademik dan organisasi."; }
            else { phaseKey = 'SMA_Transisi'; bannerTitle = "Fase Transisi Pendidikan"; bannerMessage = "Fokus UTBK & Kuliah: Panduan utama menentukan prodi PTN impian!"; }
        } else if (eduLvl === 'SMK') {
            if (grade <= 11) { phaseKey = 'SMK_Awal'; bannerMessage = "Fase Vokasi: Fokus pengembangan skill praktis dan etika kerja."; }
            else { phaseKey = 'SMK_Transisi'; bannerTitle = "Fase Transisi Pendidikan"; bannerMessage = "Persiapan Karier: Perkuat kompetensi uji UKK dan persiapan wawancara kerja."; }
        }

        let ModuleContent;
        let moduleTitle = '';

        // ==========================================================
        // RENDER PDF: RIASEC
        // ==========================================================
        if (moduleType === 'RIASEC') {
            moduleTitle = `Laporan Potensi Bakat Minat`;

            const { data: results } = await supabase
                .from('assessment_results')
                .select(`
                    id, 
                    riasec_profiles ( 
                        code, primary_code, secondary_code, tertiary_code, 
                        riasec_results ( code, raw_score ) 
                    )
                `)
                .eq('student_id', student.id)
                .eq('scoring_version', 'RIASEC-SCORING-v1')
                .order('calculated_at', { ascending: false });

            const validResult = results?.find(r => r.riasec_profiles && (Array.isArray(r.riasec_profiles) ? r.riasec_profiles.length > 0 : true));
            const typedResult = validResult as unknown as AssessmentResult;
            const rawProfile = typedResult ? (Array.isArray(typedResult.riasec_profiles) ? typedResult.riasec_profiles[0] : typedResult.riasec_profiles) : null;
            const actualProfile = rawProfile as RiasecProfile | null;

            if (!actualProfile) {
                ModuleContent = <View><Text style={{ fontSize: 10 }}>Data hasil RIASEC belum tersedia.</Text></View>;
            } else {
                const rawResults = actualProfile.riasec_results || [];
                const sortedScores = [...rawResults].sort((a, b) => Number(b.raw_score) - Number(a.raw_score));

                const code1 = cleanCode(actualProfile.primary_code) || 'C';
                const code2 = cleanCode(actualProfile.secondary_code) || 'S';
                const code3 = cleanCode(actualProfile.tertiary_code) || 'I';
                const hyphenatedCodes = `${code1}-${code2}-${code3}`;

                const data1 = riasecDictionary[code1] || riasecDictionary['C'];
                const data2 = riasecDictionary[code2] || riasecDictionary['S'];
                const data3 = riasecDictionary[code3] || riasecDictionary['I'];

                const phase1: RiasecPhaseData = (data1.levels as any)[phaseKey] || data1.levels['SMP_Transisi'];
                const phase2: RiasecPhaseData = (data2.levels as any)[phaseKey] || data2.levels['SMP_Transisi'];
                const phase3: RiasecPhaseData = (data3.levels as any)[phaseKey] || data3.levels['SMP_Transisi'];

                const mixedEdu1 = blendAccurate(phase1.eduList1, phase2.eduList1, phase3.eduList1, 6);
                const mixedEdu2 = blendAccurate(phase1.eduList2, phase2.eduList2, phase3.eduList2, 6);
                const mixedKarir = blendAccurate(data1.karir, data2.karir, data3.karir, 7);
                const mixedFreelance = blendAccurate(data1.freelance, data2.freelance, data3.freelance, 5);
                const mixedMateri = blendAccurate(phase1.materi, phase2.materi, phase3.materi, 6);
                const mixedLayanan = blendAccurate(phase1.layanan, phase2.layanan, phase3.layanan, 5);
                const mixedGuruBk = blendAccurate(phase1.guruBk, phase2.guruBk, phase3.guruBk, 4);
                const mixedSiswa = blendAccurate(phase1.siswa, phase2.siswa, phase3.siswa, 4);

                // Membagi skor menjadi 2 kolom
                const scoreRows = [];
                for (let i = 0; i < sortedScores.length; i += 2) {
                    scoreRows.push(sortedScores.slice(i, i + 2));
                }

                ModuleContent = (
                    <View style={styles.container}>
                        <View style={styles.phaseBanner} wrap={false}>
                            <Text style={styles.phaseTitle}>{bannerTitle}</Text>
                            <Text style={styles.phaseSub}>{bannerMessage}</Text>
                        </View>

                        <View style={styles.sectionCard} wrap={false}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.badgeProfil}>
                                    <Text style={{ fontSize: 8, color: '#3b82f6', textAlign: 'center', marginBottom: 2 }}>KODE PROFIL</Text>
                                    <Text style={styles.badgeText}>{hyphenatedCodes.replace(/-/g, '')}</Text>
                                </View>
                                <View style={{ flex: 1, paddingLeft: 12 }}>
                                    <Text style={styles.sectionTitle}>Ringkasan Kesimpulan</Text>
                                    <Text style={{ fontSize: 9.5, color: '#334155', lineHeight: 1.4 }}>
                                        Tipe dominan kamu adalah <Text style={{ fontWeight: 'bold' }}>{data1.title} ({data1.indonesianTitle})</Text> dengan pola gabungan {hyphenatedCodes}.
                                    </Text>
                                    <Text style={{ fontSize: 9, color: '#475569', marginTop: 4 }}>• {data1.title}: {data1.desc}</Text>
                                    <Text style={{ fontSize: 9, color: '#475569', marginTop: 2 }}>• {data2.title}: {data2.desc}</Text>
                                </View>
                            </View>
                            <View style={styles.alertBlue}>
                                <Text style={styles.alertBlueText}>* Kamu memiliki kecerdasan minat yang saling mendukung. Perpaduan ini menjadi kekuatan utamamu dalam menentukan pendidikan lanjutan dan karier masa depan!</Text>
                            </View>
                        </View>

                        <View style={styles.sectionCard} wrap={false}>
                            <Text style={styles.sectionTitle}>Ringkasan Skor 6 Dimensi (RIASEC)</Text>

                            {scoreRows.map((row, idx) => (
                                <View key={idx} style={styles.scoreRowContainer}>
                                    {row.map((sc) => {
                                        const code = cleanCode(sc.code);
                                        const def = dimensionDefs[code] || { name: code, meaning: '' };
                                        const translatedName = hollandTranslations[def.name] || def.name;
                                        const scoreNum = Number(sc.raw_score);
                                        const pct = Math.min(Math.round((scoreNum / 35) * 100), 100);
                                        // Mengambil warna dinamis
                                        const barColor = riasecColors[code] || '#3b82f6';

                                        return (
                                            <View key={code} style={styles.scoreItem}>
                                                <View style={styles.scoreTextRow}>
                                                    <View style={{ flex: 1, paddingRight: 8 }}>
                                                        <Text style={styles.scoreLabel}>{code} - {def.name} ({translatedName})</Text>
                                                        <Text style={styles.scoreSub}>{def.meaning}</Text>
                                                    </View>
                                                    <Text style={[styles.scoreVal, { color: barColor }]}>{scoreNum} ({pct}%)</Text>
                                                </View>
                                                <View style={styles.barBg}>
                                                    <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: barColor }]} />
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                            ))}
                        </View>

                        <View style={styles.gridRow} break>
                            <View style={styles.gridCol}>
                                <Text style={styles.colHeader}>Studi Lanjut & Karier</Text>
                                <Text style={styles.colSubHeader}>REKOMENDASI STUDI / JURUSAN</Text>
                                {mixedEdu1.map((item, i) => (
                                    <View key={`edu1-${i}`} style={styles.bulletContainer}><Text style={styles.bulletPoint}>•</Text><Text style={styles.bulletItem}>{item}</Text></View>
                                ))}
                                <Text style={styles.colSubHeader}>PILIHAN ALTERNATIF (VOKASI)</Text>
                                {mixedEdu2.map((item, i) => (
                                    <View key={`edu2-${i}`} style={styles.bulletContainer}><Text style={styles.bulletPoint}>•</Text><Text style={styles.bulletItem}>{item}</Text></View>
                                ))}
                                <Text style={styles.colSubHeader}>PEKERJAAN MASA DEPAN</Text>
                                {mixedKarir.map((item, i) => (
                                    <View key={`karir-${i}`} style={styles.bulletContainer}><Text style={styles.bulletPoint}>•</Text><Text style={styles.bulletItem}>{item}</Text></View>
                                ))}
                            </View>

                            <View style={styles.gridCol}>
                                <Text style={styles.colHeader}>Pengembangan Diri</Text>
                                <Text style={styles.colSubHeader}>MATERI YANG PERLU DIPERKUAT</Text>
                                {mixedMateri.map((item, i) => (
                                    <View key={`mat-${i}`} style={styles.bulletContainer}><Text style={styles.bulletPoint}>•</Text><Text style={styles.bulletItem}>{item}</Text></View>
                                ))}
                                <Text style={styles.colSubHeader}>PELUANG FREELANCE / MANDIRI</Text>
                                {mixedFreelance.map((item, i) => (
                                    <View key={`free-${i}`} style={styles.bulletContainer}><Text style={styles.bulletPoint}>•</Text><Text style={styles.bulletItem}>{item}</Text></View>
                                ))}
                                <Text style={styles.colSubHeader}>LAYANAN PENDUKUNG IDEAL</Text>
                                {mixedLayanan.map((item, i) => (
                                    <View key={`lay-${i}`} style={styles.bulletContainer}><Text style={styles.bulletPoint}>•</Text><Text style={styles.bulletItem}>{item}</Text></View>
                                ))}
                            </View>
                        </View>

                        <View style={styles.gridRow} wrap={false}>
                            <View style={styles.boxDark}>
                                <Text style={styles.boxDarkTitle}>Yang Perlu Dilakukan Guru / Orang Tua</Text>
                                {mixedGuruBk.map((item, i) => (
                                    <View key={`gbk-${i}`} style={styles.bulletContainer}><Text style={styles.bulletPoint}>-</Text><Text style={styles.boxDarkText}>{item}</Text></View>
                                ))}
                            </View>
                            <View style={styles.boxLight}>
                                <Text style={styles.boxLightTitle}>Yang Perlu Kamu Lakukan (Siswa)</Text>
                                {mixedSiswa.map((item, i) => (
                                    <View key={`sis-${i}`} style={styles.bulletContainer}><Text style={styles.bulletPoint}>-</Text><Text style={styles.boxLightText}>{item}</Text></View>
                                ))}
                            </View>
                        </View>
                    </View>
                );
            }
        }
        // ==========================================================
        // RENDER PDF: VAK
        // ==========================================================
        else if (moduleType === 'VAK') {
            moduleTitle = `Laporan Gaya Belajar`;

            const { data: results } = await supabase
                .from('assessment_results')
                .select(`
                    id, 
                    vak_profiles ( 
                        code, dominant_code, secondary_code, tertiary_code, 
                        vak_results ( code, raw_score ) 
                    )
                `)
                .eq('student_id', student.id)
                .eq('scoring_version', 'VAK-SCORING-v1')
                .order('calculated_at', { ascending: false });

            const validResult = results?.find(r => r.vak_profiles && (Array.isArray(r.vak_profiles) ? r.vak_profiles.length > 0 : true));
            const typedResult = validResult as unknown as AssessmentResultVak;
            const rawProfile = typedResult ? (Array.isArray(typedResult.vak_profiles) ? typedResult.vak_profiles[0] : typedResult.vak_profiles) : null;
            const actualProfile = rawProfile as VakProfile | null;

            if (!actualProfile) {
                ModuleContent = <View><Text style={{ fontSize: 10 }}>Data hasil VAK belum tersedia.</Text></View>;
            } else {
                const rawResults = actualProfile.vak_results || [];
                const sortedScores = [...rawResults].sort((a, b) => Number(b.raw_score) - Number(a.raw_score));

                const domCode = cleanCode(actualProfile.dominant_code) || 'V';
                const domData = vakDictionary[domCode] || vakDictionary['V'];
                const phaseData: VakPhaseData = (domData.levels as any)[phaseKey] || domData.levels['SMP_Transisi'];

                // Menentukan nilai tertinggi untuk mencari yang Dominan
                const maxScore = Math.max(...sortedScores.map(s => Number(s.raw_score)), 1);

                ModuleContent = (
                    <View style={styles.container}>
                        <View style={styles.phaseBanner} wrap={false}>
                            <Text style={styles.phaseTitle}>{bannerTitle}</Text>
                            <Text style={styles.phaseSub}>{bannerMessage}</Text>
                        </View>

                        <View style={styles.sectionCard} wrap={false}>
                            <View style={{ flexDirection: 'row' }}>
                                <View style={styles.badgeProfil}>
                                    <Text style={{ fontSize: 8, color: '#3b82f6', textAlign: 'center', marginBottom: 2 }}>DOMINAN</Text>
                                    <Text style={styles.badgeText}>{domCode}</Text>
                                </View>
                                <View style={{ flex: 1, paddingLeft: 12 }}>
                                    <Text style={styles.sectionTitle}>{domData.title} ({domData.indonesianTitle})</Text>
                                    <Text style={{ fontSize: 9.5, color: '#334155', lineHeight: 1.4 }}>
                                        {domData.desc}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.sectionCard} wrap={false}>
                            <Text style={styles.sectionTitle}>Ringkasan Skor V-A-K</Text>

                            {sortedScores.map((sc) => {
                                const code = cleanCode(sc.code);
                                const dictRef = vakDictionary[code] || { title: code, indonesianTitle: '' };
                                const scoreNum = Number(sc.raw_score);
                                const translatedName = vakTranslations[code] || dictRef.indonesianTitle || '';

                                // PERBAIKAN: Mengecek jika skornya menyentuh nilai tertinggi (seri di pucuk)
                                const isDominant = scoreNum === maxScore;
                                const status = isDominant ? 'Dominan' : 'Pendukung';

                                const pct = Math.min((scoreNum / maxScore) * 100, 100);
                                const barColor = vakColors[code] || '#3b82f6';

                                return (
                                    <View key={code} style={styles.scoreItemFull}>
                                        <View style={styles.scoreTextRow}>
                                            <View style={{ flex: 1, paddingRight: 8 }}>
                                                <Text style={styles.scoreLabel}>{code} - {dictRef.title} ({translatedName})</Text>
                                            </View>
                                            <Text style={[styles.scoreVal, { color: isDominant ? '#10b981' : '#64748b' }]}>
                                                {scoreNum} Poin ({status})
                                            </Text>
                                        </View>
                                        <View style={styles.barBg}>
                                            <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: barColor }]} />
                                        </View>
                                    </View>
                                );
                            })}
                        </View>

                        <View style={styles.gridRow} break>
                            <View style={styles.gridCol}>
                                <Text style={styles.colHeader}>Strategi Belajar</Text>
                                <Text style={styles.colSubHeader}>{phaseData.eduTitle1}</Text>
                                {phaseData.eduList1.map((item, i) => (
                                    <View key={`str1-${i}`} style={styles.bulletContainer}><Text style={styles.bulletPoint}>•</Text><Text style={styles.bulletItem}>{item}</Text></View>
                                ))}
                                <Text style={styles.colSubHeader}>{phaseData.eduTitle2}</Text>
                                {phaseData.eduList2.map((item, i) => (
                                    <View key={`str2-${i}`} style={styles.bulletContainer}><Text style={styles.bulletPoint}>•</Text><Text style={styles.bulletItem}>{item}</Text></View>
                                ))}
                            </View>

                            <View style={styles.gridCol}>
                                <Text style={styles.colHeader}>Pengayaan & Materi</Text>
                                <Text style={styles.colSubHeader}>FOKUS / TRIK UJIAN</Text>
                                {phaseData.materi.map((item, i) => (
                                    <View key={`mat-${i}`} style={styles.bulletContainer}><Text style={styles.bulletPoint}>•</Text><Text style={styles.bulletItem}>{item}</Text></View>
                                ))}
                                <Text style={styles.colSubHeader}>PROSPEK KARIR UTAMA</Text>
                                {domData.karir.slice(0, 5).map((item, i) => (
                                    <View key={`kar-${i}`} style={styles.bulletContainer}><Text style={styles.bulletPoint}>•</Text><Text style={styles.bulletItem}>{item}</Text></View>
                                ))}
                            </View>
                        </View>

                        <View style={styles.gridRow} wrap={false}>
                            <View style={styles.boxDark}>
                                <Text style={styles.boxDarkTitle}>Saran untuk Guru / Orang Tua</Text>
                                {phaseData.guruBk.map((item, i) => (
                                    <View key={`gbk-${i}`} style={styles.bulletContainer}><Text style={styles.bulletPoint}>-</Text><Text style={styles.boxDarkText}>{item}</Text></View>
                                ))}
                            </View>
                            <View style={styles.boxLight}>
                                <Text style={styles.boxLightTitle}>Apa yang Harus Kamu Lakukan?</Text>
                                {phaseData.siswa.map((item, i) => (
                                    <View key={`sis-${i}`} style={styles.bulletContainer}><Text style={styles.bulletPoint}>-</Text><Text style={styles.boxLightText}>{item}</Text></View>
                                ))}
                            </View>
                        </View>
                    </View>
                );
            }
        } else {
            return NextResponse.json({ error: 'Modul tidak dikenali' }, { status: 400 });
        }

        const MyDocument = (
            <MasterPdfTemplate moduleName={moduleTitle} studentName={studentName}
                schoolName={schoolNameWithGrade}
            >
                {ModuleContent}
            </MasterPdfTemplate>
        );

        const pdfBuffer = await renderToBuffer(MyDocument);
        const webBuffer = new Uint8Array(pdfBuffer);
        const safeStudentName = studentName.replace(/\s+/g, '_');

        return new NextResponse(webBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Hasil_${moduleType}_${safeStudentName}.pdf"`,
            },
        });

    } catch (error) {
        console.error('Gagal membuat PDF:', error);
        return NextResponse.json({ error: 'Gagal membuat file PDF' }, { status: 500 });
    }
}