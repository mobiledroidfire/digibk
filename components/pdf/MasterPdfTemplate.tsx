// Lokasi file: src/components/pdf/MasterPdfTemplate.tsx
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Svg, Path } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        paddingTop: 40,
        paddingBottom: 65, // Jarak yang cukup agar konten tidak menabrak footer
        paddingHorizontal: 40,
        backgroundColor: '#ffffff',
        fontFamily: 'Helvetica'
    },
    header: {
        flexDirection: 'column',
        borderBottomWidth: 2,
        borderBottomColor: '#1e293b',
        paddingBottom: 15,
        marginBottom: 20
    },
    headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#0f172a', marginLeft: 8 },
    headerSub: { fontSize: 10, color: '#64748b', marginTop: 5 },
    contentWrapper: { flex: 1 },

    // Konfigurasi Footer dengan fixed position agar selalu di bawah
    footerContainer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingTop: 10,
    },
    footerText: { fontSize: 9, color: '#94a3b8' },
    pageNumber: { fontSize: 9, color: '#64748b', fontWeight: 'bold' }
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
                {/* Atribut 'fixed' memastikan Header berulang jika lebih dari 1 halaman */}
                <View style={styles.header} fixed>
                    <View style={styles.headerTop}>
                        <Svg viewBox="0 0 24 24" width={28} height={28} color="#2563eb">
                            <Path d="M22 10v6M2 10l10-5 10 5-10 5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                            <Path d="M6 12v5c3 3 9 3 12 0v-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </Svg>
                        <Text style={styles.headerTitle}>DIGIBK</Text>
                    </View>
                    <Text style={styles.headerSub}>Platform Konseling Modern | Laporan Asesmen Siswa</Text>
                    <Text style={styles.headerSub}>Nama: {studentName} | Sekolah: {schoolName}</Text>
                    <Text style={styles.headerSub}>Modul: {moduleName} | Tanggal Cetak: {today}</Text>
                </View>

                {/* Konten Utama PDF */}
                <View style={styles.contentWrapper}>
                    {children}
                </View>

                {/* Atribut 'fixed' pada Footer wajib agar function render membaca total halaman */}
                <View style={styles.footerContainer} fixed>
                    <Text style={styles.footerText}>
                        Dokumen ini di-generate otomatis oleh sistem DIGIBK dan sah secara digital.
                    </Text>
                    <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                        `Hal ${pageNumber} / ${totalPages}`
                    )} />
                </View>
            </Page>
        </Document>
    );
}