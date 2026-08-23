// Lokasi file: src/app/api/pdf/route.tsx
import { NextResponse } from 'next/server';
import { renderToBuffer, Text, View, StyleSheet } from '@react-pdf/renderer';
import MasterPdfTemplate from '@/components/pdf/MasterPdfTemplate';
import { createClient } from '@/lib/supabase/server';

// Mengimpor data dictionary seperti di page.tsx
import { riasecDictionary, dimensionDefs, PhaseData as RiasecPhaseData, LevelData as RiasecLevelData } from '@/lib/data/riasec';
import { vakDictionary, PhaseData as VakPhaseData, LevelData as VakLevelData } from '@/lib/data/vak';

// Helper untuk RIASEC
function blendArrays(arr1: string[] = [], arr2: string[] = [], arr3: string[] = [], maxItems: number): string[] {
    const combined = [...arr1, ...arr2.slice(0, Math.max(1, Math.floor(arr2.length / 2))), ...arr3.slice(0, 1)];
    return [...new Set(combined)].slice(0, maxItems);
}

function cleanCode(code?: string): string {
    return code ? code.trim().toUpperCase() : '';
}

// Styling khusus untuk PDF (Mirip dengan kotak-kotak di Tailwind Web Anda)
const styles = StyleSheet.create({
    title: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, color: '#0f172a' },
    highlight: { fontWeight: 'bold', color: '#2563eb' },
    textNormal: { fontSize: 11, color: '#334155', lineHeight: 1.5, marginBottom: 10 },

    card: { backgroundColor: '#f8fafc', padding: 12, borderRadius: 6, border: '1px solid #e2e8f0', marginBottom: 10 },
    cardTitle: { fontSize: 12, fontWeight: 'bold', color: '#0f172a', marginBottom: 8, borderBottom: '1px solid #cbd5e1', paddingBottom: 4 },
    subHeading: { fontSize: 10, fontWeight: 'bold', color: '#64748b', marginBottom: 4, marginTop: 6, textTransform: 'uppercase' },

    bulletContainer: { flexDirection: 'row', marginBottom: 3 },
    bulletPoint: { width: 12, fontSize: 11, color: '#475569' },
    bulletText: { flex: 1, fontSize: 11, color: '#475569', lineHeight: 1.4 }
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { moduleType } = body;
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Belum login' }, { status: 401 });

        // AMBIL DATA SISWA (Termasuk Jenjang & Kelas untuk menentukan Fase)
        const { data: student } = await supabase
            .from('students')
            .select(`id, full_name, education_level, grade_level, schools (name)`)
            .eq('user_id', user.id)
            .single();

        if (!student) return NextResponse.json({ error: 'Data siswa tidak ditemukan' }, { status: 404 });

        const studentName = student.full_name;
        const schoolObj = student.schools;
        const schoolName = schoolObj && typeof schoolObj === 'object' && 'name' in schoolObj ? String(schoolObj.name) : 'Sekolah Anda';
        const eduLvl = student.education_level || 'SMP';
        const grade = student.grade_level || 7;

        // ========================================================================
        // LOGIKA PENENTUAN FASE (PERSIS SEPERTI PAGE.TSX)
        // ========================================================================
        let phaseKey = 'SMP_Awal'; // Default
        if (eduLvl === 'SD') {
            if (grade <= 3) phaseKey = 'SD_Awal'; else if (grade <= 5) phaseKey = 'SD_Akhir'; else phaseKey = 'SD_Transisi';
        } else if (eduLvl === 'MI') {
            if (grade <= 3) phaseKey = 'MI_Awal'; else if (grade <= 5) phaseKey = 'MI_Akhir'; else phaseKey = 'MI_Transisi';
        } else if (eduLvl === 'SMP') {
            if (grade <= 8) phaseKey = 'SMP_Awal'; else phaseKey = 'SMP_Transisi';
        } else if (eduLvl === 'MTs') {
            if (grade <= 8) phaseKey = 'MTs_Awal'; else phaseKey = 'MTs_Transisi';
        } else if (eduLvl === 'SMA') {
            if (grade <= 11) phaseKey = 'SMA_Awal'; else phaseKey = 'SMA_Transisi';
        } else if (eduLvl === 'MA') {
            if (grade <= 11) phaseKey = 'MA_Awal'; else phaseKey = 'MA_Transisi';
        } else if (eduLvl === 'SMK') {
            if (grade <= 11) phaseKey = 'SMK_Awal'; else phaseKey = 'SMK_Transisi';
        }

        let ModuleContent;
        let moduleTitle = '';

        // ==========================================================
        // 1. RENDER PDF: RIASEC
        // ==========================================================
        if (moduleType === 'RIASEC') {
            moduleTitle = 'Jurus 1: Kenali Potensi (RIASEC)';

            const { data: resultData } = await supabase
                .from('assessment_results')
                .select(`id, riasec_profiles ( code, riasec_results ( code, raw_score ) )`)
                .eq('student_id', student.id)
                .order('calculated_at', { ascending: false })
                .limit(1)
                .single();

            const profile = resultData?.riasec_profiles;
            const actualProfile = Array.isArray(profile) ? profile[0] : profile;

            if (!actualProfile) {
                ModuleContent = <View><Text style={styles.textNormal}>Data hasil RIASEC belum tersedia.</Text></View>;
            } else {
                const rawResults = actualProfile.riasec_results || [];
                const sortedScores = [...rawResults].sort((a, b) => {
                    if (Number(b.raw_score) !== Number(a.raw_score)) return Number(b.raw_score) - Number(a.raw_score);
                    return cleanCode(a.code).localeCompare(cleanCode(b.code));
                });

                const topThree = sortedScores.slice(0, 3);
                const code1 = cleanCode(topThree[0]?.code) || 'S';
                const code2 = cleanCode(topThree[1]?.code) || 'C';
                const code3 = cleanCode(topThree[2]?.code) || 'I';
                const hyphenatedCodes = `${code1}-${code2}-${code3}`;

                const data1 = riasecDictionary[code1] || riasecDictionary['S'];
                const data2 = riasecDictionary[code2] || riasecDictionary['C'];
                const data3 = riasecDictionary[code3] || riasecDictionary['I'];

                // Ambil Fase
                const phase1: RiasecPhaseData = (data1.levels as any)[phaseKey] || data1.levels['SMP_Awal'];
                const phase2: RiasecPhaseData = (data2.levels as any)[phaseKey] || data2.levels['SMP_Awal'];
                const phase3: RiasecPhaseData = (data3.levels as any)[phaseKey] || data3.levels['SMP_Awal'];

                // Blend Arrays
                const mixedEdu1 = blendArrays(phase1.eduList1, phase2.eduList1, phase3.eduList1, 5);
                const mixedKarir = blendArrays(data1.karir, data2.karir, data3.karir, 5);
                const mixedGuruBk = blendArrays(phase1.guruBk, phase2.guruBk, phase3.guruBk, 4);
                const mixedSiswa = blendArrays(phase1.siswa, phase2.siswa, phase3.siswa, 4);

                ModuleContent = (
                    <View>
                        <Text style={styles.title}>Ringkasan Hasil (RIASEC)</Text>
                        <Text style={styles.textNormal}>
                            Tipe Dominan: <Text style={styles.highlight}>{data1.title}</Text> | Profil: <Text style={styles.highlight}>{hyphenatedCodes}</Text>
                        </Text>
                        <Text style={styles.textNormal}>{data1.desc}</Text>

                        {/* Kotak Aktivitas & Studi */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Pengembangan Diri & Studi</Text>
                            <Text style={styles.subHeading}>{phase1.eduTitle1}</Text>
                            {mixedEdu1.map((item, i) => (
                                <View key={i} style={styles.bulletContainer}><Text style={styles.bulletPoint}>•</Text><Text style={styles.bulletText}>{item}</Text></View>
                            ))}
                        </View>

                        {/* Kotak Karier */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Karier & Usaha</Text>
                            <Text style={styles.subHeading}>Pekerjaan Masa Depan</Text>
                            {mixedKarir.map((item, i) => (
                                <View key={i} style={styles.bulletContainer}><Text style={styles.bulletPoint}>•</Text><Text style={styles.bulletText}>{item}</Text></View>
                            ))}
                        </View>

                        {/* Kotak Saran Guru & Siswa */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Rekomendasi Tindakan</Text>
                            <Text style={styles.subHeading}>Saran untuk Kamu (Siswa):</Text>
                            {mixedSiswa.map((item, i) => (
                                <View key={i} style={styles.bulletContainer}><Text style={styles.bulletPoint}>-</Text><Text style={styles.bulletText}>{item}</Text></View>
                            ))}
                            <Text style={styles.subHeading}>Saran untuk Guru / Orang Tua:</Text>
                            {mixedGuruBk.map((item, i) => (
                                <View key={i} style={styles.bulletContainer}><Text style={styles.bulletPoint}>-</Text><Text style={styles.bulletText}>{item}</Text></View>
                            ))}
                        </View>
                    </View>
                );
            }
        }
        // ==========================================================
        // 2. RENDER PDF: VAK
        // ==========================================================
        else if (moduleType === 'VAK') {
            moduleTitle = 'Jurus 2: Gaya Belajar (VAK)';

            const { data: resultData } = await supabase
                .from('assessment_results')
                .select(`id, vak_profiles ( code, dominant_code, vak_results ( code, raw_score ) )`)
                .eq('student_id', student.id)
                .order('calculated_at', { ascending: false })
                .limit(1)
                .single();

            const profile = resultData?.vak_profiles;
            const actualProfile = Array.isArray(profile) ? profile[0] : profile;

            if (!actualProfile) {
                ModuleContent = <View><Text style={styles.textNormal}>Data hasil VAK belum tersedia.</Text></View>;
            } else {
                const rawResults = actualProfile.vak_results || [];
                const sortedScores = [...rawResults].sort((a, b) => {
                    if (Number(b.raw_score) !== Number(a.raw_score)) return Number(b.raw_score) - Number(a.raw_score);
                    return cleanCode(a.code).localeCompare(cleanCode(b.code));
                });

                const dominantCode = actualProfile.dominant_code || sortedScores[0]?.code || 'V';
                const dominantData = vakDictionary[dominantCode];
                // Ambil Fase
                const phaseData: VakPhaseData = (dominantData.levels as any)[phaseKey] || dominantData.levels['SMP_Awal'];

                ModuleContent = (
                    <View>
                        <Text style={styles.title}>Hasil Gaya Belajar (VAK)</Text>
                        <Text style={styles.textNormal}>
                            Gaya Dominan: <Text style={styles.highlight}>{dominantData.title} ({dominantData.indonesianTitle})</Text>
                        </Text>
                        <Text style={styles.textNormal}>{dominantData.desc}</Text>

                        {/* Kotak Strategi */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Strategi Belajar</Text>
                            <Text style={styles.subHeading}>{phaseData.eduTitle1}</Text>
                            {phaseData.eduList1.map((item, i) => (
                                <View key={i} style={styles.bulletContainer}><Text style={styles.bulletPoint}>•</Text><Text style={styles.bulletText}>{item}</Text></View>
                            ))}
                            <Text style={styles.subHeading}>{phaseData.eduTitle2}</Text>
                            {phaseData.eduList2.map((item, i) => (
                                <View key={i} style={styles.bulletContainer}><Text style={styles.bulletPoint}>•</Text><Text style={styles.bulletText}>{item}</Text></View>
                            ))}
                        </View>

                        {/* Kotak Materi & Karir */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Fokus & Prospek Karir</Text>
                            <Text style={styles.subHeading}>Fokus Materi / Ujian</Text>
                            {phaseData.materi.map((item, i) => (
                                <View key={i} style={styles.bulletContainer}><Text style={styles.bulletPoint}>•</Text><Text style={styles.bulletText}>{item}</Text></View>
                            ))}
                            <Text style={styles.subHeading}>Prospek Karir Sesuai Gaya Belajar</Text>
                            {dominantData.karir.slice(0, 4).map((item, i) => (
                                <View key={i} style={styles.bulletContainer}><Text style={styles.bulletPoint}>•</Text><Text style={styles.bulletText}>{item}</Text></View>
                            ))}
                        </View>

                        {/* Kotak Tindakan */}
                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>Rekomendasi Tindakan</Text>
                            <Text style={styles.subHeading}>Saran untuk Kamu (Siswa):</Text>
                            {phaseData.siswa.map((item, i) => (
                                <View key={i} style={styles.bulletContainer}><Text style={styles.bulletPoint}>-</Text><Text style={styles.bulletText}>{item}</Text></View>
                            ))}
                            <Text style={styles.subHeading}>Saran untuk Guru / Orang Tua:</Text>
                            {phaseData.guruBk.map((item, i) => (
                                <View key={i} style={styles.bulletContainer}><Text style={styles.bulletPoint}>-</Text><Text style={styles.bulletText}>{item}</Text></View>
                            ))}
                        </View>
                    </View>
                );
            }
        } else {
            return NextResponse.json({ error: 'Modul tidak dikenali' }, { status: 400 });
        }

        const MyDocument = (
            <MasterPdfTemplate moduleName={moduleTitle} studentName={studentName} schoolName={schoolName}>
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