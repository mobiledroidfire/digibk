// Lokasi file: src/app/api/pdf/route.tsx
import { NextResponse } from 'next/server';
import { renderToBuffer, Text, View, StyleSheet } from '@react-pdf/renderer';
import MasterPdfTemplate from '@/components/pdf/MasterPdfTemplate';
import { createClient } from '@/lib/supabase/server'; // PERBAIKAN 1: Import Supabase

// Style untuk konten di dalam PDF
const styles = StyleSheet.create({
    title: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#0f172a' },
    text: { fontSize: 12, marginBottom: 8, color: '#334155', lineHeight: 1.5 },
    highlight: { fontWeight: 'bold', color: '#2563eb' },
    placeholder: { fontSize: 12, color: '#94a3b8', fontStyle: 'italic', marginTop: 10 }
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { moduleType, studentData } = body;

        // Inisialisasi Supabase
        const supabase = await createClient();

        let ModuleContent;
        let moduleTitle = '';

        // ==========================================================
        // 1. LOGIKA UNTUK MENGAMBIL DAN MENCETAK DATA RIASEC
        // ==========================================================
        if (moduleType === 'RIASEC') {
            moduleTitle = 'Jurus 1: Kenali Potensi (RIASEC)';

            // Mengambil hasil RIASEC terakhir milik siswa ini
            const { data: riasecData, error } = await supabase
                .from('riasec_profiles')
                .select(`
                    code, primary_code, interpretation,
                    assessment_results!inner(
                        assessment_sessions!inner( student_id )
                    )
                `)
                .eq('assessment_results.assessment_sessions.student_id', studentData.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error || !riasecData) {
                ModuleContent = <View><Text style={styles.text}>Data hasil RIASEC belum tersedia atau belum lengkap.</Text></View>;
            } else {
                ModuleContent = (
                    <View>
                        <Text style={styles.title}>Hasil Tes Minat Bakat (RIASEC)</Text>
                        <Text style={styles.text}>Kode Profil Kamu: <Text style={styles.highlight}>{riasecData.code}</Text></Text>
                        <Text style={styles.text}>Tipe Dominan: <Text style={styles.highlight}>{riasecData.primary_code}</Text></Text>
                        <Text style={styles.text}>Interpretasi/Saran Karir:</Text>
                        <Text style={styles.text}>{riasecData.interpretation || 'Belum ada interpretasi.'}</Text>
                    </View>
                );
            }
        }
        // ==========================================================
        // 2. LOGIKA UNTUK MENGAMBIL DAN MENCETAK DATA VAK
        // ==========================================================
        else if (moduleType === 'VAK') {
            moduleTitle = 'Jurus 2: Gaya Belajar (VAK)';

            // Mengambil hasil VAK terakhir milik siswa ini
            const { data: vakData, error } = await supabase
                .from('vak_profiles')
                .select(`
                    code, dominant_code, interpretation,
                    assessment_results!inner(
                        assessment_sessions!inner( student_id )
                    )
                `)
                .eq('assessment_results.assessment_sessions.student_id', studentData.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (error || !vakData) {
                ModuleContent = <View><Text style={styles.text}>Data hasil VAK belum tersedia atau belum lengkap.</Text></View>;
            } else {
                // Mengubah kode huruf menjadi kata agar mudah dibaca di PDF
                const dominantLabel =
                    vakData.dominant_code === 'V' ? 'Visual (Melihat)' :
                        vakData.dominant_code === 'A' ? 'Auditori (Mendengar)' :
                            vakData.dominant_code === 'K' ? 'Kinestetik (Bergerak/Praktik)' : vakData.dominant_code;

                ModuleContent = (
                    <View>
                        <Text style={styles.title}>Hasil Gaya Belajar (VAK)</Text>
                        <Text style={styles.text}>Kombinasi Gaya Belajar: <Text style={styles.highlight}>{vakData.code}</Text></Text>
                        <Text style={styles.text}>Gaya Belajar Dominan: <Text style={styles.highlight}>{dominantLabel}</Text></Text>
                        <Text style={styles.text}>Saran Belajar:</Text>
                        <Text style={styles.text}>{vakData.interpretation || 'Belum ada saran khusus.'}</Text>
                    </View>
                );
            }
        }
        // ==========================================================
        // JURUS LAINNYA (Segera Hadir)
        // ==========================================================
        else if (['EMOSI', 'RESILIENSI', 'KONSISTENSI', 'KONEKSI', 'KOLABORASI', 'SITUASI'].includes(moduleType)) {
            moduleTitle = `Jurus: ${moduleType}`;
            ModuleContent = <View><Text style={styles.placeholder}>Laporan untuk modul {moduleType} akan ditampilkan di sini setelah dikerjakan.</Text></View>;
        } else {
            return NextResponse.json({ error: 'Modul tidak dikenali' }, { status: 400 });
        }

        // Memasukkan Konten Modul ke dalam Master Template
        const MyDocument = (
            <MasterPdfTemplate
                moduleName={moduleTitle}
                studentName={studentData.name}
                schoolName={studentData.school}
            >
                {ModuleContent}
            </MasterPdfTemplate>
        );

        // Merender React Component menjadi Buffer
        const pdfBuffer = await renderToBuffer(MyDocument);
        const webBuffer = new Uint8Array(pdfBuffer);

        const safeStudentName = studentData.name.replace(/\s+/g, '_');
        const fileName = `Hasil_${moduleType}_${safeStudentName}.pdf`;

        // Kembalikan Response PDF
        return new NextResponse(webBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${fileName}"`,
            },
        });

    } catch (error) {
        console.error('Gagal membuat PDF:', error);
        return NextResponse.json({ error: 'Gagal membuat file PDF' }, { status: 500 });
    }
}