// Lokasi file: src/components/pdf/MasterPdfTemplate.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

// 1. Membuat gaya (styling) khusus untuk PDF (mirip dengan CSS)
const styles = StyleSheet.create({
    page: {
        padding: 40,
        backgroundColor: '#ffffff',
        fontFamily: 'Helvetica'
    },
    header: {
        flexDirection: 'column',
        borderBottomWidth: 2,
        borderBottomColor: '#1e293b',
        paddingBottom: 15,
        marginBottom: 25
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a'
    },
    headerSub: {
        fontSize: 10,
        color: '#64748b',
        marginTop: 5
    },
    contentWrapper: {
        flex: 1 // Agar konten utama memenuhi sisa ruang yang ada
    },
    footer: {
        fontSize: 9,
        textAlign: 'center',
        color: '#94a3b8',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingTop: 10,
        marginTop: 20
    }
});

// 2. Mendefinisikan tipe data yang akan diterima oleh template ini
type MasterPdfProps = {
    moduleName: string;
    studentName: string;
    schoolName: string;
    children: React.ReactNode; // Ini adalah tempat di mana konten RIASEC/VAK akan disisipkan
};

export default function MasterPdfTemplate({ moduleName, studentName, schoolName, children }: MasterPdfProps) {
    const today = new Date().toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* BAGIAN KOP SURAT (Akan selalu muncul di setiap modul) */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>DIGIBK</Text>
                    <Text style={styles.headerSub}>Platform Konseling Modern | Laporan Asesmen Siswa</Text>
                    <Text style={styles.headerSub}>
                        Nama: {studentName} | Sekolah: {schoolName}
                    </Text>
                    <Text style={styles.headerSub}>
                        Modul: {moduleName} | Tanggal Cetak: {today}
                    </Text>
                </View>

                {/* BAGIAN KONTEN DINAMIS (RIASEC/VAK akan masuk ke sini) */}
                <View style={styles.contentWrapper}>
                    {children}
                </View>

                {/* BAGIAN FOOTER */}
                <Text style={styles.footer}>
                    Dokumen ini di-generate otomatis oleh sistem DIGIBK dan sah secara digital.
                </Text>

            </Page>
        </Document>
    );
}