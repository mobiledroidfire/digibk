// Lokasi file: src/components/pdf/MasterPdfTemplate.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Svg, Path } from '@react-pdf/renderer';

// 1. Membuat gaya (styling) khusus untuk PDF
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
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
        marginLeft: 8
    },
    headerSub: {
        fontSize: 10,
        color: '#64748b',
        marginTop: 5
    },
    contentWrapper: {
        flex: 1
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

type MasterPdfProps = {
    moduleName: string;
    studentName: string;
    schoolName: string;
    children: React.ReactNode;
};

export default function MasterPdfTemplate({ moduleName, studentName, schoolName, children }: MasterPdfProps) {
    const today = new Date().toLocaleDateString('id-ID', {
        day: 'numeric', month: 'long', year: 'numeric'
    });

    return (
        <Document>
            <Page size="A4" style={styles.page}>

                {/* BAGIAN KOP SURAT DENGAN LOGO TOPI WISUDA */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        {/* Logo Topi Wisuda (Graduation Cap) */}
                        <Svg viewBox="0 0 24 24" width={28} height={28} color="#2563eb">
                            <Path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            <Path d="M6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </Svg>
                        <Text style={styles.headerTitle}>DIGIBK</Text>
                    </View>

                    <Text style={styles.headerSub}>Platform Konseling Modern | Laporan Asesmen Siswa</Text>
                    <Text style={styles.headerSub}>
                        Nama: {studentName} | Sekolah: {schoolName}
                    </Text>
                    <Text style={styles.headerSub}>
                        Modul: {moduleName} | Tanggal Cetak: {today}
                    </Text>
                </View>

                {/* BAGIAN KONTEN DINAMIS */}
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