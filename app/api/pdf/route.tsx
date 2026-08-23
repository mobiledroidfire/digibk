// Lokasi file: src/app/api/pdf/route.tsx
import { NextResponse } from 'next/server';
import { renderToStream } from '@react-pdf/renderer';
import { Text, View, StyleSheet } from '@react-pdf/renderer';
import MasterPdfTemplate from '@/components/pdf/MasterPdfTemplate';

// 1. Style untuk konten di dalam PDF
const styles = StyleSheet.create({
    title: { fontSize: 16, fontWeight: 'bold', marginBottom: 15, color: '#0f172a' },
    text: { fontSize: 12, marginBottom: 8, color: '#334155', lineHeight: 1.5 },
    placeholder: { fontSize: 12, color: '#94a3b8', fontStyle: 'italic', marginTop: 10 }
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { moduleType, studentData } = body;

        let ModuleContent;
        let moduleTitle = '';

        // 2. Routing Konten untuk Seluruh 7 Jurus
        if (moduleType === 'RIASEC') {
            moduleTitle = 'Jurus 1: Kenali Potensi (RIASEC)';
            ModuleContent = (
                <View>
                    <Text style={styles.title}>Hasil Tes Minat Bakat (RIASEC)</Text>
                    <Text style={styles.text}>Tipe Kepribadian Dominan: Realistic (Contoh)</Text>
                    {/* Komponen grafik atau tabel RIASEC bisa ditambahkan di sini nantinya */}
                </View>
            );
        } else if (moduleType === 'VAK') {
            moduleTitle = 'Jurus 1: Gaya Belajar (VAK)';
            ModuleContent = (
                <View>
                    <Text style={styles.title}>Hasil Gaya Belajar (VAK)</Text>
                    <Text style={styles.text}>Gaya Belajar Dominan: Visual (Contoh)</Text>
                </View>
            );
        } else if (moduleType === 'EMOSI') {
            moduleTitle = 'Jurus 2: Kelola Emosi';
            ModuleContent = (
                <View><Text style={styles.placeholder}>Detail laporan Kelola Emosi akan ditampilkan di sini.</Text></View>
            );
        } else if (moduleType === 'RESILIENSI') {
            moduleTitle = 'Jurus 3: Tumbuhkan Resiliensi';
            ModuleContent = (
                <View><Text style={styles.placeholder}>Detail laporan Tumbuhkan Resiliensi akan ditampilkan di sini.</Text></View>
            );
        } else if (moduleType === 'KONSISTENSI') {
            moduleTitle = 'Jurus 4: Jaga Konsistensi';
            ModuleContent = (
                <View><Text style={styles.placeholder}>Detail laporan Jaga Konsistensi akan ditampilkan di sini.</Text></View>
            );
        } else if (moduleType === 'KONEKSI') {
            moduleTitle = 'Jurus 5: Jalin Koneksi';
            ModuleContent = (
                <View><Text style={styles.placeholder}>Detail laporan Jalin Koneksi akan ditampilkan di sini.</Text></View>
            );
        } else if (moduleType === 'KOLABORASI') {
            moduleTitle = 'Jurus 6: Bangun Kolaborasi';
            ModuleContent = (
                <View><Text style={styles.placeholder}>Detail laporan Bangun Kolaborasi akan ditampilkan di sini.</Text></View>
            );
        } else if (moduleType === 'SITUASI') {
            moduleTitle = 'Jurus 7: Menata Situasi';
            ModuleContent = (
                <View><Text style={styles.placeholder}>Detail laporan Menata Situasi akan ditampilkan di sini.</Text></View>
            );
        } else {
            return NextResponse.json({ error: 'Modul tidak dikenali' }, { status: 400 });
        }

        // 3. Memasukkan Konten Modul ke dalam Master Template
        const MyDocument = (
            <MasterPdfTemplate
                moduleName={moduleTitle}
                studentName={studentData.name}
                schoolName={studentData.school}
            >
                {ModuleContent}
            </MasterPdfTemplate>
        );

        // 4. Proses konversi ke PDF menggunakan Stream
        const pdfStream = await renderToStream(MyDocument);
        const chunks: Uint8Array[] = [];

        // PERBAIKAN: Mengganti tipe 'any' dengan tipe data AsyncIterable yang tepat dan ketat
        for await (const chunk of pdfStream as unknown as AsyncIterable<Uint8Array>) {
            chunks.push(chunk);
        }
        const pdfBuffer = Buffer.concat(chunks);

        // 5. Kembalikan Response PDF
        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="Hasil_Asesmen_DIGIBK.pdf"',
            },
        });

    } catch (error) {
        console.error('Gagal membuat PDF:', error);
        return NextResponse.json({ error: 'Gagal membuat file PDF' }, { status: 500 });
    }
}