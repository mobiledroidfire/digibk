// Lokasi file: src/app/api/pdf/route.tsx
import { NextResponse } from 'next/server';
import { renderToBuffer, Text, View, StyleSheet } from '@react-pdf/renderer';
import MasterPdfTemplate from '@/components/pdf/MasterPdfTemplate';
import { createClient } from '@/lib/supabase/server';
import { riasecDictionary } from '@/lib/data/riasec';
import { vakDictionary } from '@/lib/data/vak';

const styles = StyleSheet.create({
    title: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#0f172a' },
    subtitle: { fontSize: 12, fontWeight: 'bold', marginTop: 12, marginBottom: 4, color: '#1e293b' },
    text: { fontSize: 11, marginBottom: 6, color: '#334155', lineHeight: 1.5 },
    highlight: { fontWeight: 'bold', color: '#2563eb' },
    bulletContainer: { flexDirection: 'row', marginBottom: 4 },
    bulletPoint: { width: 15, fontSize: 11, color: '#334155' },
    bulletText: { flex: 1, fontSize: 11, color: '#334155', lineHeight: 1.5 }
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { moduleType } = body;
        const supabase = await createClient();

        // 1. CARA YANG SAMA DENGAN PAGE.TSX: Ambil user login
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return NextResponse.json({ error: 'Belum login' }, { status: 401 });

        // 2. CARA YANG SAMA DENGAN PAGE.TSX: Ambil data siswa
        const { data: student } = await supabase
            .from('students')
            .select(`id, full_name, schools (name)`)
            .eq('user_id', user.id)
            .single();

        if (!student) return NextResponse.json({ error: 'Data siswa tidak ditemukan' }, { status: 404 });

        const studentName = student.full_name;
        const schoolObj = student.schools;
        // Penanganan aman untuk nama sekolah
        const schoolName = schoolObj && typeof schoolObj === 'object' && 'name' in schoolObj
            ? String(schoolObj.name)
            : 'Sekolah Anda';

        let ModuleContent;
        let moduleTitle = '';

        // ==========================================================
        // CETAK PDF: RIASEC
        // ==========================================================
        if (moduleType === 'RIASEC') {
            moduleTitle = 'Jurus 1: Kenali Potensi (RIASEC)';

            // 3A. CARA YANG SAMA DENGAN PAGE.TSX: Ambil hasil asesmen terakhir
            const { data: latestResult } = await supabase
                .from('assessment_results')
                .select(`id, riasec_profiles ( code, primary_code )`)
                .eq('student_id', student.id)
                .eq('scoring_version', 'RIASEC-SCORING-v1')
                .order('calculated_at', { ascending: false })
                .limit(1)
                .single();

            const profile = latestResult?.riasec_profiles;
            const actualProfile = Array.isArray(profile) ? profile[0] : profile;

            if (!actualProfile) {
                ModuleContent = <View><Text style={styles.text}>Data hasil RIASEC belum tersedia.</Text></View>;
            } else {
                const domCode = actualProfile.primary_code;
                const dict = riasecDictionary[domCode];

                ModuleContent = (
                    <View>
                        <Text style={styles.title}>Hasil Tes Minat Bakat (RIASEC)</Text>
                        <Text style={styles.text}>Kombinasi Profil: <Text style={styles.highlight}>{actualProfile.code}</Text></Text>

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
        // CETAK PDF: VAK
        // ==========================================================
        else if (moduleType === 'VAK') {
            moduleTitle = 'Jurus 2: Gaya Belajar (VAK)';

            // 3B. CARA YANG SAMA DENGAN PAGE.TSX: Ambil hasil asesmen terakhir
            const { data: latestResult } = await supabase
                .from('assessment_results')
                .select(`id, vak_profiles ( code, dominant_code )`)
                .eq('student_id', student.id)
                .eq('scoring_version', 'VAK-SCORING-v1')
                .order('calculated_at', { ascending: false })
                .limit(1)
                .single();

            const profile = latestResult?.vak_profiles;
            const actualProfile = Array.isArray(profile) ? profile[0] : profile;

            if (!actualProfile) {
                ModuleContent = <View><Text style={styles.text}>Data hasil VAK belum tersedia.</Text></View>;
            } else {
                const domCode = actualProfile.dominant_code;
                const dict = vakDictionary[domCode];

                ModuleContent = (
                    <View>
                        <Text style={styles.title}>Hasil Gaya Belajar (VAK)</Text>
                        <Text style={styles.text}>Kombinasi Skor: <Text style={styles.highlight}>{actualProfile.code}</Text></Text>

                        {dict && (
                            <>
                                <Text style={styles.text}>Gaya Dominan: <Text style={styles.highlight}>{dict.title} ({dict.indonesianTitle})</Text></Text>
                                <Text style={styles.subtitle}>Deskripsi Gaya Belajar:</Text>
                                <Text style={styles.text}>{dict.desc}</Text>
                                <Text style={styles.subtitle}>Kekuatan / Prospek Utama:</Text>
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
        } else {
            return NextResponse.json({ error: 'Modul tidak dikenali' }, { status: 400 });
        }

        // 4. Masukkan ke Master Template
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