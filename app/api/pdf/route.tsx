// Lokasi file: /app/api/pdf/route.tsx
import { NextResponse } from 'next/server';
import { renderToStream, Text, View, StyleSheet } from '@react-pdf/renderer';
import MasterPdfTemplate from '@/components/pdf/MasterPdfTemplate';
import { dimensionDefs } from '@/lib/data/riasec';

import { getRiasecDisplayLogic, riasecTranslations, cleanCode } from '@/features/student/services/riasec-result.service';
import { getVarkDisplayLogic } from '@/features/student/services/vark-result.service';
import type { ScoreItem } from '@/features/student/types/result.types';

const styles = StyleSheet.create({
    container: { padding: 5 },
    phaseBanner: { backgroundColor: '#3b82f6', padding: 12, borderRadius: 8, marginBottom: 15 },
    phaseTitle: { color: '#ffffff', fontSize: 13, fontWeight: 'bold', marginBottom: 2 },
    phaseSub: { color: '#eff6ff', fontSize: 10 },
    sectionCard: { backgroundColor: '#ffffff', padding: 12, borderRadius: 8, border: '1px solid #e2e8f0', marginBottom: 15 },
    sectionTitle: { fontSize: 13, fontWeight: 'bold', color: '#0f172a', marginBottom: 8, textTransform: 'uppercase' },
    // Ganti dua baris ini di dalam file /app/api/pdf/route.tsx
    badgeProfil: {
        backgroundColor: '#eff6ff',
        padding: 12,
        borderRadius: 8,
        border: '1px solid #bfdbfe', // Tambahan garis pinggir tipis
        width: 110, // Diperlebar agar tidak sesak
        textAlign: 'center',
        marginBottom: 8,
        justifyContent: 'center'
    },
    badgeText: {
        fontSize: 24, // Huruf diperbesar drastis dari sebelumnya 16
        fontWeight: 'bold',
        color: '#1e40af', // Warna biru yang lebih gelap dan profesional
        letterSpacing: 3 // Jarak antar huruf agar terlihat elegan
    },
    alertBlue: { backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: 10, borderRadius: 6, marginTop: 8 },
    alertBlueText: { color: '#1e40af', fontSize: 9.5, lineHeight: 1.4 },
    scoreRowContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    scoreItem: { width: '48%' },
    scoreItemFull: { width: '100%', marginBottom: 16 },
    scoreTextRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
    scoreLabel: { fontSize: 10, fontWeight: 'bold', color: '#1e293b' },
    scoreSub: { fontSize: 8.5, color: '#64748b', marginTop: 2 },
    scoreVal: { fontSize: 10, fontWeight: 'bold', color: '#1d4ed8' },
    barBg: { height: 6, backgroundColor: '#e2e8f0', borderRadius: 3, width: '100%', marginTop: 2 },
    barFill: { height: 6, borderRadius: 3 },
    gridRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginBottom: 15 },
    gridCol: { flex: 1, backgroundColor: '#ffffff', padding: 10, borderRadius: 8, border: '1px solid #e2e8f0' },
    colHeader: { fontSize: 11, fontWeight: 'bold', color: '#0f172a', marginBottom: 6, borderBottom: '1px solid #f1f5f9', paddingBottom: 4 },
    colSubHeader: { fontSize: 9, fontWeight: 'bold', color: '#64748b', marginTop: 6, marginBottom: 3, textTransform: 'uppercase' },
    bulletContainer: { flexDirection: 'row', marginBottom: 4, alignItems: 'flex-start' },
    bulletPoint: { width: 12, fontSize: 10, color: '#64748b' },
    bulletItem: { flex: 1, fontSize: 9.5, color: '#334155', lineHeight: 1.4 },
    boxDark: { flex: 1, backgroundColor: '#1e293b', padding: 12, borderRadius: 8 },
    boxDarkTitle: { fontSize: 11, fontWeight: 'bold', color: '#ffffff', marginBottom: 8 },
    boxDarkText: { flex: 1, fontSize: 9.5, color: '#cbd5e1', lineHeight: 1.4 },
    boxLight: { flex: 1, backgroundColor: '#eff6ff', padding: 12, borderRadius: 8, border: '1px solid #bfdbfe' },
    boxLightTitle: { fontSize: 11, fontWeight: 'bold', color: '#1e40af', marginBottom: 8 },
    boxLightText: { flex: 1, fontSize: 9.5, color: '#1e3a8a', lineHeight: 1.4 },
    varkProfileRow: { flexDirection: 'row', gap: 15, alignItems: 'center' },
    varkBadgeGroup: { flexDirection: 'row', gap: 6 },
    varkBadge: { width: 45, height: 45, borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
    varkBadgeText: { fontSize: 24, fontWeight: 'bold' },
    varkBadgeLabel: { fontSize: 8, color: '#64748b', fontWeight: 'bold', marginBottom: 4, textTransform: 'uppercase' },
});

const riasecColors: Record<string, string> = { 'R': '#ef4444', 'I': '#f59e0b', 'A': '#10b981', 'S': '#3b82f6', 'E': '#8b5cf6', 'C': '#64748b' };

const varkLabels: Record<string, string> = {
    'V': 'Visual (Penglihatan)',
    'A': 'Auditori (Pendengaran)',
    'R': 'Read/Write (Membaca/Menulis)',
    'K': 'Kinestetik (Praktik Fisik)'
};
const varkColors: Record<string, string> = { 'V': '#3b82f6', 'A': '#10b981', 'R': '#8b5cf6', 'K': '#f59e0b' };

const varkDescriptions: Record<string, string> = {
    'V': 'Kamu sangat peka terhadap informasi visual. Menggunakan gambar, diagram, grafik, peta konsep, atau video akan membuat materi pelajaran jauh lebih mudah menempel di ingatanmu.',
    'A': 'Kamu memiliki kekuatan menyerap informasi dengan cara mendengarkan. Penjelasan lisan dari guru, berdiskusi dengan teman, atau merekam dan mendengarkan ulang materi adalah metode belajar paling jitu untukmu.',
    'R': 'Kamu sangat kuat dalam memahami instruksi berbasis teks. Belajar dengan cara membaca buku teks, merangkum materi dengan bahasamu sendiri, atau menulis ulang catatan adalah cara yang paling efektif.',
    'K': 'Kamu adalah tipe pembelajar yang harus "bergerak" atau melakukan tindakan. Melakukan eksperimen, simulasi, bermain peran, atau menyentuh objek secara langsung akan membuatmu sangat cepat paham.'
};

const getVarkPdfStyle = (code: string) => {
    switch (code.toUpperCase()) {
        case 'V': return { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' };
        case 'A': return { color: '#059669', bg: '#ecfdf5', border: '#a7f3d0' };
        case 'R': return { color: '#d97706', bg: '#fffbeb', border: '#fde68a' };
        case 'K': return { color: '#e11d48', bg: '#fff1f2', border: '#fecdd3' };
        default: return { color: '#475569', bg: '#f8fafc', border: '#e2e8f0' };
    }
};

export async function POST(request: Request) {
    try {
        const { moduleType, resultId } = await request.json();
        let ModuleContent;
        let moduleTitle = '';
        let studentName = '';
        let schoolNameWithGrade = '';

        if (moduleType === 'RIASEC') {
            moduleTitle = `Laporan Potensi Bakat Minat`;
            const data = await getRiasecDisplayLogic(resultId, true);

            if (!data) return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 });

            studentName = data.student.full_name;
            schoolNameWithGrade = `${data.student.schoolName} - Kelas ${data.student.grade_level}`;

            const scoreRows = [];
            for (let i = 0; i < data.profileData.sortedScores.length; i += 2) {
                scoreRows.push(data.profileData.sortedScores.slice(i, i + 2));
            }

            ModuleContent = (
                <View style={styles.container}>
                    <View style={styles.phaseBanner} wrap={false}>
                        <Text style={styles.phaseTitle}>{data.phaseInfo.bannerTitle}</Text>
                        <Text style={styles.phaseSub}>{data.phaseInfo.bannerMessage}</Text>
                    </View>
                    <View style={styles.sectionCard} wrap={false}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={styles.badgeProfil}>
                                <Text style={{ fontSize: 8, color: '#3b82f6', textAlign: 'center', marginBottom: 2 }}>KODE PROFIL</Text>
                                <Text style={styles.badgeText}>{data.profileData.hyphenatedCodes.replace(/-/g, '')}</Text>
                            </View>
                            <View style={{ flex: 1, paddingLeft: 12 }}>
                                <Text style={styles.sectionTitle}>Ringkasan Kesimpulan</Text>

                                {/* PERBAIKAN: Menambahkan data3 agar PDF menampilkan 3 profil lengkap */}
                                <Text style={{ fontSize: 9.5, color: '#334155', lineHeight: 1.4 }}>
                                    Tipe dominan kamu membentuk pola gabungan <Text style={{ fontWeight: 'bold' }}>{data.profileData.hyphenatedCodes}</Text>, yang mewakili {data.profileData.data1.title} ({data.profileData.data1.indonesianTitle}), {data.profileData.data2.title} ({data.profileData.data2.indonesianTitle}), dan {data.profileData.data3.title} ({data.profileData.data3.indonesianTitle}).
                                </Text>
                                <Text style={{ fontSize: 9, color: '#475569', marginTop: 4 }}>• {data.profileData.data1.title}: {data.profileData.data1.desc}</Text>
                                <Text style={{ fontSize: 9, color: '#475569', marginTop: 2 }}>• {data.profileData.data2.title}: {data.profileData.data2.desc}</Text>
                                <Text style={{ fontSize: 9, color: '#475569', marginTop: 2 }}>• {data.profileData.data3.title}: {data.profileData.data3.desc}</Text>

                            </View>
                        </View>
                        <View style={styles.alertBlue}>
                            {/* PERBAIKAN: Menggunakan pesan dinamis dari service */}
                            <Text style={styles.alertBlueText}>* {data.profileData.dominantTieMessage}</Text>
                        </View>
                    </View>

                    <View style={styles.sectionCard} wrap={false}>
                        <Text style={styles.sectionTitle}>Ringkasan Skor 6 Dimensi (RIASEC)</Text>
                        {scoreRows.map((row, idx) => (
                            <View key={idx} style={styles.scoreRowContainer}>
                                {row.map((sc: ScoreItem) => {
                                    const code = cleanCode(sc.code);
                                    const def = dimensionDefs[code] || { name: code, meaning: '' };
                                    const translatedName = riasecTranslations[def.name] || def.name;
                                    const scoreNum = Number(sc.raw_score);
                                    const pct = Math.min(Math.round((scoreNum / 35) * 100), 100);
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
                            {data.mixedData.mixedEdu1.slice(0, 10).map((item: string, i: number) => <View key={`edu1-${i}`} style={styles.bulletContainer}><Text style={styles.bulletPoint}>•</Text><Text style={styles.bulletItem}>{item}</Text></View>)}
                            <Text style={styles.colSubHeader}>PILIHAN ALTERNATIF (VOKASI)</Text>
                            {data.mixedData.mixedEdu2.slice(0, 10).map((item: string, i: number) => <View key={`edu2-${i}`} style={styles.bulletContainer}><Text style={styles.bulletPoint}>•</Text><Text style={styles.bulletItem}>{item}</Text></View>)}
                            <Text style={styles.colSubHeader}>PEKERJAAN MASA DEPAN</Text>
                            {data.mixedData.mixedKarir.slice(0, 10).map((item: string, i: number) => <View key={`karir-${i}`} style={styles.bulletContainer}><Text style={styles.bulletPoint}>•</Text><Text style={styles.bulletItem}>{item}</Text></View>)}
                        </View>
                        <View style={styles.gridCol}>
                            <Text style={styles.colHeader}>Pengembangan Diri</Text>
                            <Text style={styles.colSubHeader}>MATERI YANG PERLU DIPERKUAT</Text>
                            {data.mixedData.mixedMateri.slice(0, 10).map((item: string, i: number) => <View key={`mat-${i}`} style={styles.bulletContainer}><Text style={styles.bulletPoint}>•</Text><Text style={styles.bulletItem}>{item}</Text></View>)}
                            <Text style={styles.colSubHeader}>PELUANG FREELANCE / MANDIRI</Text>
                            {data.mixedData.mixedFreelance.slice(0, 10).map((item: string, i: number) => <View key={`free-${i}`} style={styles.bulletContainer}><Text style={styles.bulletPoint}>•</Text><Text style={styles.bulletItem}>{item}</Text></View>)}
                            <Text style={styles.colSubHeader}>LAYANAN PENDUKUNG IDEAL</Text>
                            {data.mixedData.mixedLayanan.slice(0, 10).map((item: string, i: number) => <View key={`lay-${i}`} style={styles.bulletContainer}><Text style={styles.bulletPoint}>•</Text><Text style={styles.bulletItem}>{item}</Text></View>)}
                        </View>
                    </View>

                    <View style={styles.gridRow} wrap={false}>
                        <View style={styles.boxDark}>
                            <Text style={styles.boxDarkTitle}>Yang Perlu Dilakukan Guru / Orang Tua</Text>
                            {data.mixedData.mixedGuruBk.slice(0, 10).map((item: string, i: number) => <View key={`gbk-${i}`} style={styles.bulletContainer}><Text style={styles.bulletPoint}>-</Text><Text style={styles.boxDarkText}>{item}</Text></View>)}
                        </View>
                        <View style={styles.boxLight}>
                            <Text style={styles.boxLightTitle}>Yang Perlu Kamu Lakukan (Siswa)</Text>
                            {data.mixedData.mixedSiswa.slice(0, 10).map((item: string, i: number) => <View key={`sis-${i}`} style={styles.bulletContainer}><Text style={styles.bulletPoint}>-</Text><Text style={styles.boxLightText}>{item}</Text></View>)}
                        </View>
                    </View>
                </View>
            );
        } else if (moduleType === 'VARK') {
            moduleTitle = `Laporan Gaya Belajar`;
            const data = await getVarkDisplayLogic(resultId);

            if (!data) return NextResponse.json({ error: 'Data tidak ditemukan' }, { status: 404 });

            studentName = data.student.full_name;
            schoolNameWithGrade = `${data.student.schoolName} - Kelas ${data.student.grade_level}`;

            const mainStyleCode = data.uiData.primaryCode;
            const varkLabel = varkLabels[mainStyleCode] || 'Gaya Belajar';
            const mainColor = varkColors[mainStyleCode] || '#3b82f6';

            ModuleContent = (
                <View style={styles.container}>
                    <View style={[styles.phaseBanner, { backgroundColor: mainColor }]} wrap={false}>
                        <Text style={styles.phaseTitle}>{data.phaseInfo.bannerTitle}</Text>
                        <Text style={styles.phaseSub}>{data.phaseInfo.bannerMessage}</Text>
                    </View>

                    <View style={styles.sectionCard} wrap={false}>
                        <Text style={styles.sectionTitle}>Profil Preferensi Belajar</Text>

                        <View style={styles.varkProfileRow}>
                            <View style={{ alignItems: 'center' }}>
                                <Text style={styles.varkBadgeLabel}>
                                    Tipe {data.uiData.isMultimodal ? 'Multimodal' : 'Dominan'}
                                </Text>
                                <View style={styles.varkBadgeGroup}>
                                    {data.uiData.domCodesArray.map((code: string) => {
                                        const badgeStyle = getVarkPdfStyle(code);
                                        return (
                                            <View key={code} style={[styles.varkBadge, { backgroundColor: badgeStyle.bg, borderColor: badgeStyle.border }]}>
                                                <Text style={[styles.varkBadgeText, { color: badgeStyle.color }]}>{code}</Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>

                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 11, color: '#0f172a', fontWeight: 'bold', marginBottom: 4 }}>
                                    {data.uiData.isMultimodal ? 'Gaya Belajar Fleksibel (Campuran)' : varkLabel}
                                </Text>
                                <Text style={{ fontSize: 9.5, color: '#475569', lineHeight: 1.4 }}>
                                    {data.uiData.isMultimodal
                                        ? "Luar biasa! Kamu adalah pembelajar yang fleksibel. Kamu dapat menyerap informasi dengan sangat baik melalui kombinasi berbagai metode."
                                        : data.uiData.dominantData.desc}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.alertBlue}>
                            <Text style={styles.alertBlueText}>
                                {data.uiData.isMultimodal
                                    ? "* Keuntungan Multimodal: Kamu bisa dengan mudah beradaptasi dengan berbagai cara mengajar guru yang berbeda-beda!"
                                    : `* Fokus pada kekuatanmu! Memahami bahwa kamu seorang ${varkLabel} akan membantumu belajar lebih cepat dan tidak mudah bosan.`}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.sectionCard} wrap={false}>
                        <Text style={styles.sectionTitle}>Detail Profil V-A-R-K Kamu</Text>
                        {data.uiData.sortedScores.map((score: ScoreItem) => {
                            const code = (score.code || '').trim().toUpperCase();
                            const scoreVal = Number(score.raw_score);
                            const isDominant = scoreVal === data.uiData.maxScore;
                            const pct = Math.min(Math.round((scoreVal / data.uiData.maxScore) * 100), 100);
                            const barColor = varkColors[code] || '#94a3b8';

                            return (
                                <View key={code} style={styles.scoreItemFull}>
                                    <View style={styles.scoreTextRow}>
                                        <Text style={styles.scoreLabel}>{code} - {varkLabels[code]}</Text>
                                        <Text style={[styles.scoreVal, { color: isDominant ? '#0f172a' : '#64748b' }]}>
                                            {scoreVal} Poin ({pct}%) - {isDominant ? 'Dominan' : 'Pendukung'}
                                        </Text>
                                    </View>
                                    <View style={styles.barBg}>
                                        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: barColor }]} />
                                    </View>
                                    <Text style={{ fontSize: 9, color: isDominant ? '#334155' : '#64748b', marginTop: 5, lineHeight: 1.3 }}>
                                        {varkDescriptions[code]}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>

                    <View style={styles.gridRow} break>
                        <View style={styles.gridCol}>
                            <Text style={styles.colHeader}>Strategi Belajar</Text>
                            <Text style={styles.colSubHeader}>{data.uiData.phaseData.eduTitle1}</Text>
                            {data.uiData.phaseData.eduList1.slice(0, 10).map((item: string, i: number) => <View key={`e1-${i}`} style={styles.bulletContainer}><Text style={styles.bulletPoint}>•</Text><Text style={styles.bulletItem}>{item}</Text></View>)}
                            <Text style={styles.colSubHeader}>{data.uiData.phaseData.eduTitle2}</Text>
                            {data.uiData.phaseData.eduList2.slice(0, 10).map((item: string, i: number) => <View key={`e2-${i}`} style={styles.bulletContainer}><Text style={styles.bulletPoint}>•</Text><Text style={styles.bulletItem}>{item}</Text></View>)}
                        </View>
                        <View style={styles.gridCol}>
                            <Text style={styles.colHeader}>Pengayaan & Materi</Text>
                            <Text style={styles.colSubHeader}>FOKUS / TRIK UJIAN</Text>
                            {data.uiData.phaseData.materi.slice(0, 10).map((item: string, i: number) => <View key={`m-${i}`} style={styles.bulletContainer}><Text style={styles.bulletPoint}>•</Text><Text style={styles.bulletItem}>{item}</Text></View>)}
                            <Text style={styles.colSubHeader}>PROSPEK KARIR UTAMA</Text>
                            {data.uiData.dominantData.karir.slice(0, 10).map((item: string, i: number) => <View key={`k-${i}`} style={styles.bulletContainer}><Text style={styles.bulletPoint}>•</Text><Text style={styles.bulletItem}>{item}</Text></View>)}
                        </View>
                    </View>

                    <View style={styles.gridRow} wrap={false}>
                        <View style={styles.boxDark}>
                            <Text style={styles.boxDarkTitle}>Saran untuk Guru / Orang Tua</Text>
                            {data.uiData.phaseData.guruBk.slice(0, 10).map((item: string, i: number) => <View key={`g-${i}`} style={styles.bulletContainer}><Text style={styles.bulletPoint}>-</Text><Text style={styles.boxDarkText}>{item}</Text></View>)}
                        </View>
                        <View style={styles.boxLight}>
                            <Text style={styles.boxLightTitle}>Apa yang Harus Kamu Lakukan?</Text>
                            {data.uiData.phaseData.siswa.slice(0, 10).map((item: string, i: number) => <View key={`s-${i}`} style={styles.bulletContainer}><Text style={styles.bulletPoint}>-</Text><Text style={styles.boxLightText}>{item}</Text></View>)}
                        </View>
                    </View>
                </View>
            );
        }

        const MyDocument = (
            <MasterPdfTemplate moduleName={moduleTitle} studentName={studentName} schoolName={schoolNameWithGrade}>
                {ModuleContent}
            </MasterPdfTemplate>
        );

        const stream = await renderToStream(MyDocument);

        return new NextResponse(stream as unknown as ReadableStream, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="Hasil_${moduleType}_${studentName.replace(/\s+/g, '_')}.pdf"`,
            },
        });
    } catch (error) {
        return NextResponse.json({ error: 'Gagal membuat file PDF' }, { status: 500 });
    }
}