// Lokasi file: src/app/api/pdf/route.tsx
import { NextResponse } from 'next/server';
import { renderToBuffer, Text, View, StyleSheet } from '@react-pdf/renderer';
import MasterPdfTemplate from '@/components/pdf/MasterPdfTemplate';
import { createClient } from '@/lib/supabase/server';

import { riasecDictionary, dimensionDefs, PhaseData as RiasecPhaseData } from '@/lib/data/riasec';
import { vakDictionary, PhaseData as VakPhaseData } from '@/lib/data/vak';

function blendArrays(arr1: string[] = [], arr2: string[] = [], arr3: string[] = [], maxItems: number): string[] {
    const combined = [...arr1, ...arr2.slice(0, Math.max(1, Math.floor(arr2.length / 2))), ...arr3.slice(0, 1)];
    return [...new Set(combined)].slice(0, maxItems);
}

function cleanCode(code?: string): string {
    return code ? code.trim().toUpperCase() : '';
}

// STYLESHEET PRESISI MIRIP WEBPAGE
const styles = StyleSheet.create({
    container: { padding: 5 },

    // Banner Fase (Ungu)
    phaseBanner: { backgroundColor: '#7e22ce', padding: 12, borderRadius: 8, marginBottom: 12 },
    phaseTitle: { color: '#ffffff', fontSize: 13, fontWeight: 'bold', marginBottom: 2 },
    phaseSub: { color: '#f3e8ff', fontSize: 10 },

    // Section Ringkasan Kesimpulan
    sectionCard: { backgroundColor: '#ffffff', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 12 },
    sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
    badgeProfil: { backgroundColor: '#eff6ff', padding: '6 12', borderRadius: 6, width: 80, textAlign: 'center', marginBottom: 8 },
    badgeText: { fontSize: 14, fontWeight: 'bold', color: '#1d4ed8' },

    // Alert Boxes
    alertBlue: { backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', padding: 8, borderRadius: 6, marginTop: 8 },
    alertBlueText: { color: '#0369a1', fontSize: 9.5, lineHeight: 1.4 },
    alertAmber: { backgroundColor: '#fffbeb', border: '1px solid #fde68a', padding: 8, borderRadius: 6, marginTop: 6 },
    alertAmberText: { color: '#b45309', fontSize: 9.5, lineHeight: 1.4 },

    // Bar Skor Dimensi
    scoreRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    scoreLabel: { fontSize: 10, fontWeight: 'bold', color: '#1e293b' },
    scoreSub: { fontSize: 8.5, color: '#64748b' },
    scoreVal: { fontSize: 10, fontWeight: 'bold', color: '#4338ca' },
    barBg: { height: 6, backgroundColor: '#f1f5f9', borderRadius: 3, marginBottom: 8, overflow: 'hidden' },
    barFill: { height: '100%', backgroundColor: '#6366f1', borderRadius: 3 },

    // Grid Box 3 Kolom
    gridRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
    gridCol: { flex: 1, backgroundColor: '#ffffff', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' },
    colHeader: { fontSize: 11, fontWeight: 'bold', color: '#0f172a', marginBottom: 6, borderBottom: '1px solid #f1f5f9', paddingBottom: 4 },
    colSubHeader: { fontSize: 8.5, fontWeight: 'bold', color: '#94a3b8', marginTop: 4, marginBottom: 2, textTransform: 'uppercase' },

    bulletItem: { fontSize: 9, color: '#334155', lineHeight: 1.4, marginBottom: 2 },

    // Box Bottom 2 Kolom (Saran)
    boxDark: { flex: 1, backgroundColor: '#1e293b', padding: 10, borderRadius: 8 },
    boxDarkTitle: { fontSize: 11, fontWeight: 'bold', color: '#ffffff', marginBottom: 6 },
    boxDarkText: { fontSize: 9, color: '#cbd5e1', lineHeight: 1.4, marginBottom: 3 },

    boxLight: { flex: 1, backgroundColor: '#eff6ff', padding: 10, borderRadius: 8, border: '1px solid #bfdbfe' },
    boxLightTitle: { fontSize: 11, fontWeight: 'bold', color: '#1e40af', marginBottom: 6 },
    boxLightText: { fontSize: 9, color: '#1e3a8a', lineHeight: 1.4, marginBottom: 3 }
});

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
        const schoolName = schoolObj && typeof schoolObj === 'object' && 'name' in schoolObj ? String(schoolObj.name) : 'Sekolah Anda';
        const eduLvl = student.education_level || 'SD';
        const grade = student.grade_level || 7;

        // Fase & Banner Message
        let phaseKey = 'SD_Transisi';
        let bannerTitle = 'Fase Penjelajahan Minat';
        let bannerMessage = 'Eksplorasi minat dan bakat siswa.';

        if (eduLvl === 'SD') {
            if (grade <= 3) { phaseKey = 'SD_Awal'; bannerMessage = "Fase Bermain & Karakter Dasar: Dukung anak bereksplorasi dengan menyenangkan!"; }
            else if (grade <= 5) { phaseKey = 'SD_Akhir'; bannerMessage = "Fase Eksplorasi Minat: Kenalkan anak pada berbagai ekstrakurikuler dasar."; }
            else { phaseKey = 'SD_Transisi'; bannerTitle = "Fase Transisi Pendidikan"; bannerMessage = "Persiapan Lulus SD: Fokus persiapkan mental dan pemilihan SMP yang mendukung minatnya."; }
        } else if (eduLvl === 'SMP') {
            if (grade <= 8) { phaseKey = 'SMP_Awal'; bannerMessage = "Fase Pencarian Jati Diri: Eksplorasi ekstrakurikuler dan organisasi."; }
            else { phaseKey = 'SMP_Transisi'; bannerTitle = "Fase Transisi Pendidikan"; bannerMessage = "Penentuan Jalur Menengah Atas: Gunakan data ini untuk mantap memilih SMA atau SMK!"; }
        }

        let ModuleContent;
        let moduleTitle = '';

        if (moduleType === 'RIASEC') {
            moduleTitle = `Kenali Potensi (${schoolName} - Kelas ${grade})`;

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
                ModuleContent = <View><Text style={{ fontSize: 10 }}>Data hasil RIASEC belum tersedia.</Text></View>;
            } else {
                const rawResults = actualProfile.riasec_results || [];
                const sortedScores = [...rawResults].sort((a, b) => Number(b.raw_score) - Number(a.raw_score));

                const topThree = sortedScores.slice(0, 3);
                const code1 = cleanCode(topThree[0]?.code) || 'C';
                const code2 = cleanCode(topThree[1]?.code) || 'S';
                const code3 = cleanCode(topThree[2]?.code) || 'I';
                const hyphenatedCodes = `${code1}-${code2}-${code3}`;

                const data1 = riasecDictionary[code1] || riasecDictionary['C'];
                const data2 = riasecDictionary[code2] || riasecDictionary['S'];
                const data3 = riasecDictionary[code3] || riasecDictionary['I'];

                const phase1: RiasecPhaseData = (data1.levels as any)[phaseKey] || data1.levels['SD_Transisi'];
                const phase2: RiasecPhaseData = (data2.levels as any)[phaseKey] || data2.levels['SD_Transisi'];
                const phase3: RiasecPhaseData = (data3.levels as any)[phaseKey] || data3.levels['SD_Transisi'];

                const mixedEdu1 = blendArrays(phase1.eduList1, phase2.eduList1, phase3.eduList1, 4);
                const mixedEdu2 = blendArrays(phase1.eduList2, phase2.eduList2, phase3.eduList2, 4);
                const mixedKarir = blendArrays(data1.karir, data2.karir, data3.karir, 4);
                const mixedFreelance = blendArrays(data1.freelance, data2.freelance, data3.freelance, 4);
                const mixedMateri = blendArrays(phase1.materi, phase2.materi, phase3.materi, 4);
                const mixedLayanan = blendArrays(phase1.layanan, phase2.layanan, phase3.layanan, 3);
                const mixedGuruBk = blendArrays(phase1.guruBk, phase2.guruBk, phase3.guruBk, 3);
                const mixedSiswa = blendArrays(phase1.siswa, phase2.siswa, phase3.siswa, 3);

                ModuleContent = (
                    <View style={styles.container}>
                        {/* 1. Banner Ungu Transisi */}
                        <View style={styles.phaseBanner}>
                            <Text style={styles.phaseTitle}>{bannerTitle}</Text>
                            <Text style={styles.phaseSub}>{bannerMessage}</Text>
                        </View>

                        {/* 2. Ringkasan Kesimpulan */}
                        <View style={styles.sectionCard}>
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                <View style={styles.badgeProfil}>
                                    <Text style={{ fontSize: 7, color: '#3b82f6', textAlign: 'center' }}>PROFIL</Text>
                                    <Text style={styles.badgeText}>{hyphenatedCodes.replace(/-/g, '')}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.sectionTitle}>Ringkasan Kesimpulan</Text>
                                    <Text style={{ fontSize: 9.5, color: '#334155', lineHeight: 1.4 }}>
                                        Kamu memiliki tipe dominan <Text style={{ fontWeight: 'bold' }}>{data1.title}</Text> dan <Text style={{ fontWeight: 'bold' }}>{data2.title}</Text> dengan pola gabungan {hyphenatedCodes}.
                                    </Text>
                                    <Text style={{ fontSize: 9, color: '#475569', marginTop: 4 }}>
                                        • {data1.title}: {data1.desc}
                                    </Text>
                                    <Text style={{ fontSize: 9, color: '#475569', marginTop: 2 }}>
                                        • {data2.title}: {data2.desc}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.alertBlue}>
                                <Text style={styles.alertBlueText}>
                                    ☆ Hebat! Kamu memiliki kecerdasan minat yang seimbang pada beberapa bidang sekaligus. Perpaduan ini membuatmu lebih mudah beradaptasi di berbagai lingkungan!
                                </Text>
                            </View>

                            <View style={styles.alertAmber}>
                                <Text style={styles.alertAmberText}>
                                    ~ Selain pola di atas, kamu juga memiliki potensi kuat di bidang Realistic (Skor 23). Jadikan opsi keterampilan unik!
                                </Text>
                            </View>
                        </View>

                        {/* 3. Detail Skor 6 Dimensi (Grafik Bar) */}
                        <View style={styles.sectionCard}>
                            <Text style={styles.sectionTitle}>Detail Skor 6 Dimensi</Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                                {sortedScores.map((sc) => {
                                    const code = cleanCode(sc.code);
                                    const def = dimensionDefs[code] || { name: code, meaning: '' };
                                    const scoreNum = Number(sc.raw_score);
                                    const pct = Math.min((scoreNum / 35) * 100, 100);

                                    return (
                                        <View key={code} style={{ width: '48%' }}>
                                            <View style={styles.scoreRow}>
                                                <View>
                                                    <Text style={styles.scoreLabel}>{def.name}</Text>
                                                    <Text style={styles.scoreSub}>{def.meaning}</Text>
                                                </View>
                                                <Text style={styles.scoreVal}>{scoreNum}</Text>
                                            </View>
                                            <View style={styles.barBg}>
                                                <View style={[styles.barFill, { width: `${pct}%` }]} />
                                            </View>
                                        </View>
                                    );
                                })}
                            </View>
                        </View>

                        {/* 4. Grid 3 Kolom */}
                        <View style={styles.gridRow}>
                            <View style={styles.gridCol}>
                                <Text style={styles.colHeader}>Aktivitas & Ekstrakurikuler</Text>
                                <Text style={styles.colSubHeader}>TARGET LINGKUNGAN SMP</Text>
                                {mixedEdu1.map((item, i) => <Text key={i} style={styles.bulletItem}>• {item}</Text>)}
                                <Text style={styles.colSubHeader}>PERSIAPAN EKSKUL SMP</Text>
                                {mixedEdu2.map((item, i) => <Text key={i} style={styles.bulletItem}>• {item}</Text>)}
                            </View>

                            <View style={styles.gridCol}>
                                <Text style={styles.colHeader}>Karier & Usaha</Text>
                                <Text style={styles.colSubHeader}>PEKERJAAN MASA DEPAN</Text>
                                {mixedKarir.map((item, i) => <Text key={i} style={styles.bulletItem}>• {item}</Text>)}
                                <Text style={styles.colSubHeader}>PELUANG PENGEMBANGAN KHUSUS</Text>
                                {mixedFreelance.map((item, i) => <Text key={i} style={styles.bulletItem}>• {item}</Text>)}
                            </View>

                            <View style={styles.gridCol}>
                                <Text style={styles.colHeader}>Pembelajaran</Text>
                                <Text style={styles.colSubHeader}>FOKUS MATERI ({eduLvl})</Text>
                                {mixedMateri.map((item, i) => <Text key={i} style={styles.bulletItem}>• {item}</Text>)}
                                <Text style={styles.colSubHeader}>LAYANAN PENDUKUNG</Text>
                                {mixedLayanan.map((item, i) => <Text key={i} style={styles.bulletItem}>• {item}</Text>)}
                            </View>
                        </View>

                        {/* 5. Kotak Saran Bawah */}
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            <View style={styles.boxDark}>
                                <Text style={styles.boxDarkTitle}>Saran untuk Guru / Orang Tua</Text>
                                {mixedGuruBk.map((item, i) => <Text key={i} style={styles.boxDarkText}>→ {item}</Text>)}
                            </View>

                            <View style={styles.boxLight}>
                                <Text style={styles.boxLightTitle}>Saran untuk Kamu (Siswa)</Text>
                                {mixedSiswa.map((item, i) => <Text key={i} style={styles.boxLightText}>✦ {item}</Text>)}
                            </View>
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