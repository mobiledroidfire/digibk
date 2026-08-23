// Lokasi file: src/app/api/pdf/route.tsx
import { NextResponse } from 'next/server';
import { renderToBuffer, Text, View, StyleSheet } from '@react-pdf/renderer';
import MasterPdfTemplate from '@/components/pdf/MasterPdfTemplate';
import { createClient } from '@/lib/supabase/server';

// 1. IMPORT DICTIONARY AGAR PDF BISA MEMBACA SARAN/DESKRIPSI
import { riasecDictionary } from '@/lib/data/riasec';
import { vakDictionary } from '@/lib/data/vak';

const styles = StyleSheet.create({
    title: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#0f172a' },
    subtitle: { fontSize: 12, fontWeight: 'bold', marginTop: 12, marginBottom: 4, color: '#1e293b' },
    text: { fontSize: 11, marginBottom: 6, color: '#334155', lineHeight: 1.5 },
    highlight: { fontWeight: 'bold', color: '#2563eb' },
    placeholder: { fontSize: 11, color: '#94a3b8', fontStyle: 'italic', marginTop: 10 },
    bulletContainer: { flexDirection: 'row', marginBottom: 4 },
    bulletPoint: { width: 15, fontSize: 11, color: '#334155' },
    bulletText: { flex: 1, fontSize: 11, color: '#334155', lineHeight: 1.5 }
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { moduleType, studentData } = body;
        const supabase = await createClient();

        let ModuleContent;
        let moduleTitle = '';

        // ==========================================================
        // LOGIKA CETAK PDF: RIASEC
        // ==========================================================
        if (moduleType === 'RIASEC') {
            moduleTitle = 'Jurus 1: Kenali Potensi (RIASEC)';

            const { data: riasecData, error } = await supabase
                .from('riasec_profiles')
                .select(`code, primary_code, assessment_results!inner(assessment_sessions!inner(student_id))`)
                .eq('assessment_results.assessment_sessions.student_id', studentData.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error || !riasecData) {
                ModuleContent = <View><Text style={styles.text}>Data hasil RIASEC belum tersedia.</Text></View>;
            } else {
                // Mengambil deskripsi dari Dictionary menggunakan kode dominan siswa
                const primaryCode = riasecData.primary_code;
                const dict = riasecDictionary[primaryCode];

                ModuleContent = (
                    <View>
                        <Text style={styles.title}>Hasil Tes Minat Bakat (RIASEC)</Text>
                        <Text style={styles.text}>Kombinasi Profil: <Text style={styles.highlight}>{riasecData.code}</Text></Text>

                        {dict && (
                            <>
                                <Text style={styles.text}>Tipe Dominan: <Text style={styles.highlight}>{dict.title} ({dict.indonesianTitle})</Text></Text>

                                <Text style={styles.subtitle}>Deskripsi Kepribadian:</Text>
                                <Text style={styles.text}>{dict.desc}</Text>

                                <Text style={styles.subtitle}>Rekomendasi Pilihan Karir:</Text>
                                {dict.karir.map((karirItem, index) => (
                                    <View key={index} style={styles.bulletContainer}>
                                        <Text style={styles.bulletPoint}>•</Text>
                                        <Text style={styles.bulletText}>{karirItem}</Text>
                                    </View>
                                ))}
                            </>
                        )}
                    </View>
                );
            }
        }
        // ==========================================================
        // LOGIKA CETAK PDF: VAK
        // ==========================================================
        else if (moduleType === 'VAK') {
            moduleTitle = 'Jurus 2: Gaya Belajar (VAK)';

            const { data: vakData, error } = await supabase
                .from('vak_profiles')
                .select(`code, dominant_code, assessment_results!inner(assessment_sessions!inner(student_id))`)
                .eq('assessment_results.assessment_sessions.student_id', studentData.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error || !vakData) {
                ModuleContent = <View><Text style={styles.text}>Data hasil VAK belum tersedia.</Text></View>;
            } else {
                // Mengambil deskripsi dari Dictionary menggunakan kode dominan siswa
                const domCode = vakData.dominant_code;
                const dict = vakDictionary[domCode];

                ModuleContent = (
                    <View>
                        <Text style={styles.title}>Hasil Gaya Belajar (VAK)</Text>
                        <Text style={styles.text}>Kombinasi Skor: <Text style={styles.highlight}>{vakData.code}</Text></Text>

                        {dict && (
                            <>
                                <Text style={styles.text}>Gaya Dominan: <Text style={styles.highlight}>{dict.title} ({dict.indonesianTitle})</Text></Text>

                                <Text style={styles.subtitle}>Deskripsi Gaya Belajar:</Text>
                                <Text style={styles.text}>{dict.desc}</Text>

                                <Text style={styles.subtitle}>Kekuatan / Prospek Utama:</Text>
                                {dict.karir.slice(0, 4).map((karirItem, index) => (
                                    <View key={index} style={styles.bulletContainer}>
                                        <Text style={styles.bulletPoint}>•</Text>
                                        <Text style={styles.bulletText}>{karirItem}</Text>
                                    </View>
                                ))}
                            </>
                        )}
                    </View>
                );
            }
        } else {
            return NextResponse.json({ error: 'Modul tidak dikenali' }, { status: 400 });
        }

        const MyDocument = (
            <MasterPdfTemplate moduleName={moduleTitle} studentName={studentData.name} schoolName={studentData.school}>
                {ModuleContent}
            </MasterPdfTemplate>
        );

        const pdfBuffer = await renderToBuffer(MyDocument);
        const webBuffer = new Uint8Array(pdfBuffer);
        const safeStudentName = studentData.name.replace(/\s+/g, '_');

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