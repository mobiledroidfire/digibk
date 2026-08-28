// Lokasi file: src/lib/utils/date.utils.ts

/**
 * Memformat string tanggal ISO menjadi format tanggal Indonesia lengkap dengan waktu (WIB).
 * Contoh: "26 Agustus 2026, 04:30 WIB"
 */
export function formatIndonesianDate(dateString: string): string {
    if (!dateString) return '-';
    try {
        const formatted = new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dateString));

        return `${formatted} WIB`;
    } catch {
        return dateString;
    }
}
