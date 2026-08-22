// Lokasi file: src/app/student/potential/result/page.tsx

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
    BrainCircuit, Trophy, ArrowRight, Activity,
    GraduationCap, School, Briefcase, BookOpen,
    UserCheck, HeartHandshake, Sparkles, Star
} from 'lucide-react';

// ============================================================================
// 1. TIPE DATA
// ============================================================================
type RiasecResultItem = { code: string; raw_score: number; };
type RiasecProfile = { code: string; riasec_results: RiasecResultItem[]; };
type AssessmentResult = { id: string; riasec_profiles: RiasecProfile | RiasecProfile[] | null; };

// Memindahkan layanan, guruBk, dan siswa ke LevelData agar akurat per jenjang
type LevelData = {
    eduTitle1: string;
    eduList1: string[];
    eduTitle2: string;
    eduList2: string[];
    materi: string[];
    layanan: string[];
    guruBk: string[];
    siswa: string[];
};

type ProfileDetail = {
    title: string;
    indonesianTitle: string;
    desc: string;
    karir: string[];
    freelance: string[];
    levels: {
        SD: LevelData;
        SMP: LevelData;
        SMA: LevelData;
    };
};

// ============================================================================
// 2. KAMUS DATA KOMPREHENSIF (Berdasarkan Jenjang Pendidikan)
// ============================================================================
const dimensionDefs: Record<string, { name: string; meaning: string; behavior: string }> = {
    R: { name: "Realistic (Realistis)", meaning: "Menyukai aktivitas fisik, mesin, alat, dan lingkungan luar.", behavior: "bertindak praktis dan mengutamakan aksi nyata" },
    I: { name: "Investigative (Investigatif)", meaning: "Memiliki rasa ingin tahu, suka analisis, sains, dan observasi.", behavior: "berpikir kritis dan mencari tahu akar masalah" },
    A: { name: "Artistic (Artistik)", meaning: "Menyukai kreativitas, seni, kebebasan, dan inovasi.", behavior: "berekspresi secara kreatif dan out-of-the-box" },
    S: { name: "Social (Sosial)", meaning: "Suka interaksi, menolong, membimbing, dan peduli pada orang lain.", behavior: "mengutamakan empati dan kerja sama" },
    E: { name: "Enterprising (Wirausaha)", meaning: "Suka memimpin, memengaruhi orang lain, dan mengambil risiko.", behavior: "memimpin, bernegosiasi, dan mencari peluang" },
    C: { name: "Conventional (Konvensional)", meaning: "Suka keteraturan, bekerja dengan data, dan aktivitas terstruktur.", behavior: "bekerja secara terorganisir, teliti, dan rapi" }
};

const riasecDictionary: Record<string, ProfileDetail> = {
    S: {
        title: "Social", indonesianTitle: "Sosial",
        desc: "Kamu senang berinteraksi, menolong, dan membimbing orang lain. Kamu peka pada perasaan orang di sekitarmu.",
        karir: ["Guru", "Konselor", "Dokter", "Perawat", "Psikolog", "Pekerja sosial", "Ustadz/Ustadzah"],
        freelance: ["Tutor privat", "Trainer soft-skill", "Relawan komunitas"],
        levels: {
            SD: {
                eduTitle1: "Rekomendasi Ekstrakurikuler", eduList1: ["Pramuka", "Dokter Kecil (UKS)", "Klub Bercerita"],
                eduTitle2: "Pengembangan Diri", eduList2: ["Kerja Bakti Sekolah", "Lomba Pidato Cilik"],
                materi: ["Pendidikan Pancasila", "Bahasa Indonesia", "Ilmu Pengetahuan Sosial Dasar"],
                layanan: ["Pendampingan bermain kelompok", "Bimbingan empati anak", "Layanan cerita anak"],
                guruBk: ["Ajak anak berbagi mainan atau bekal dengan teman", "Berikan pujian saat ia menolong orang lain", "Latih mendengarkan saat orang lain berbicara"],
                siswa: ["Sering bermain dengan teman-teman di luar rumah", "Belajar berbagi makanan atau mainan", "Bantu ayah/ibu mengerjakan pekerjaan rumah ringan"]
            },
            SMP: {
                eduTitle1: "Rekomendasi SMA (Jurusan)", eduList1: ["IPS", "Bahasa", "MIPA (Untuk Kedokteran)"],
                eduTitle2: "Rekomendasi SMK (Jurusan)", eduList2: ["Keperawatan", "Pekerjaan Sosial", "Pendidikan Anak Usia Dini"],
                materi: ["Sosiologi Dasar", "Biologi (Kesehatan Manusia)", "Bahasa Indonesia", "PPKn"],
                layanan: ["Bimbingan belajar kelompok", "Layanan konseling sebaya", "Pendampingan kegiatan sosial"],
                guruBk: ["Libatkan dalam kegiatan PMR/Pramuka", "Latih keterampilan mendengar aktif", "Arahkan untuk menjadi tutor sebaya"],
                siswa: ["Aktif di ekstrakurikuler sosial (PMR/Pramuka)", "Bantu teman kelas yang kesulitan belajar", "Mulai belajar berorganisasi"]
            },
            SMA: {
                eduTitle1: "Rekomendasi Prodi Kuliah", eduList1: ["Ilmu Komunikasi", "Pendidikan Guru", "Psikologi", "Kedokteran", "Sosiologi"],
                eduTitle2: "Alternatif Karir Lulusan Langsung", eduList2: ["Asisten Pengajar", "Staf Pelayanan Masyarakat"],
                materi: ["Sosiologi Lanjutan", "Psikologi Dasar", "Biologi Lanjutan", "Public Speaking"],
                layanan: ["Konseling psikologi lanjutan", "Pelatihan Public Speaking", "Manajemen komunitas"],
                guruBk: ["Arahkan ke panti asuhan/bakti sosial", "Latih empati untuk pemecahan masalah (mediator)", "Fasilitasi minat di bidang kesehatan masyarakat"],
                siswa: ["Jadilah pendengar yang baik bagi teman yang butuh curhat", "Ikut komunitas relawan di luar sekolah", "Jelajahi minat pada ilmu kesehatan atau psikologi"]
            }
        }
    },
    C: {
        title: "Conventional", indonesianTitle: "Konvensional",
        desc: "Kamu menyukai keteraturan, bekerja dengan data, dan aktivitas yang terstruktur dengan jelas.",
        karir: ["Akuntan", "Admin perkantoran", "Auditor", "Sekretaris", "Analis Data", "Kasir Bank"],
        freelance: ["Jasa pembukuan UMKM", "Data entry", "Admin sosial media"],
        levels: {
            SD: {
                eduTitle1: "Rekomendasi Ekstrakurikuler", eduList1: ["Klub Komputer Dasar", "Pramuka (Bagian Administrasi)"],
                eduTitle2: "Pengembangan Diri", eduList2: ["Lomba Menulis Rapi", "Menjadi Bendahara Kelas"],
                materi: ["Matematika (Aritmatika)", "Teknologi Informasi (Dasar)", "Keterampilan Mencatat"],
                layanan: ["Pendampingan merapikan barang", "Bimbingan kedisiplinan waktu", "Latihan fokus dan ketelitian"],
                guruBk: ["Latih anak merapikan mainan/bukunya sendiri", "Beri tugas sederhana seperti membagikan kertas ulangan", "Ajarkan kebiasaan menabung"],
                siswa: ["Rapikan meja belajar dan buku setelah belajar", "Mulai belajar menabung uang saku", "Beri nama/label pada barang-barang pribadimu"]
            },
            SMP: {
                eduTitle1: "Rekomendasi SMA (Jurusan)", eduList1: ["IPS (Fokus Ekonomi/Akuntansi)", "MIPA (Fokus Logika)"],
                eduTitle2: "Rekomendasi SMK (Jurusan)", eduList2: ["Akuntansi & Keuangan Lembaga", "Otomatisasi Tata Kelola Perkantoran", "Perbankan"],
                materi: ["Ekonomi/Akuntansi Dasar", "Aplikasi Excel/Spreadsheet", "Matematika", "TIK"],
                layanan: ["Pendampingan manajemen waktu belajar", "Pelatihan komputer dasar (Word/Excel)", "Bimbingan dasar akuntansi"],
                guruBk: ["Berikan tugas administratif kelas (seperti bendahara/sekretaris)", "Latih penggunaan aplikasi Microsoft Office", "Arahkan pada kedisiplinan jadwal"],
                siswa: ["Mulai mencatat pengeluaran uang saku bulanan", "Rapikan catatan pelajaran dengan rapi dan terstruktur", "Belajar rumus dasar Excel"]
            },
            SMA: {
                eduTitle1: "Rekomendasi Prodi Kuliah", eduList1: ["Akuntansi", "Administrasi Bisnis", "Statistika", "Manajemen Keuangan"],
                eduTitle2: "Alternatif Karir Lulusan Langsung", eduList2: ["Staf Administrasi", "Kasir", "Data Entry Clerk"],
                materi: ["Akuntansi Keuangan", "Statistika Terapan", "Aplikasi Perkantoran Lanjutan"],
                layanan: ["Jasa pengetikan/entry data", "Pendampingan manajemen waktu kompleks", "Pelatihan administrasi bisnis"],
                guruBk: ["Arahkan pada sertifikasi komputer (Microsoft Office Specialist)", "Libatkan dalam audit laporan keuangan kegiatan OSIS", "Kenalkan pada konsep analisis data"],
                siswa: ["Asah keterampilan mengetik cepat dan presisi", "Belajar software akuntansi atau database sederhana", "Terapkan manajemen waktu untuk target belajarmu"]
            }
        }
    },
    I: {
        title: "Investigative", indonesianTitle: "Investigatif",
        desc: "Kamu memiliki rasa ingin tahu yang tinggi, suka menganalisis, memecahkan masalah, dan berfokus pada sains.",
        karir: ["Ilmuwan", "Peneliti", "Programmer", "Apoteker", "Analis Data", "Dokter"],
        freelance: ["Tutor sains/matematika", "Analisis data", "Penulis artikel ilmiah"],
        levels: {
            SD: {
                eduTitle1: "Rekomendasi Ekstrakurikuler", eduList1: ["Klub Sains Cilik", "Robotik Dasar", "Catur"],
                eduTitle2: "Pengembangan Diri", eduList2: ["Olimpiade Sains (OSN-SD)", "Eksperimen Alam"],
                materi: ["Matematika Dasar", "Ilmu Pengetahuan Alam (IPA)", "Buku Ensiklopedia"],
                layanan: ["Bimbingan logika dasar", "Eksperimen sains menyenangkan", "Penyediaan buku ensiklopedia anak"],
                guruBk: ["Fasilitasi permainan teka-teki, puzzle, atau catur", "Beri kesempatan anak bereksperimen sederhana (misal: tanam biji kacang)", "Dukung kebiasaan membaca buku pengetahuan"],
                siswa: ["Cobalah eksperimen sains sederhana di rumah bersama orang tua", "Banyak membaca buku tentang alam semesta, hewan, atau teknologi", "Seringlah bertanya tentang bagaimana suatu benda bekerja"]
            },
            SMP: {
                eduTitle1: "Rekomendasi SMA (Jurusan)", eduList1: ["MIPA (Matematika, Fisika, Kimia, Biologi)"],
                eduTitle2: "Rekomendasi SMK (Jurusan)", eduList2: ["Analis Kimia", "Farmasi", "Rekayasa Perangkat Lunak (RPL)"],
                materi: ["Sains Eksperimen", "Matematika Aljabar", "Logika & Pemrograman Dasar", "Metode Ilmiah"],
                layanan: ["Konsultasi bimbingan olimpiade", "Pelatihan logika pemrograman", "Akses laboratorium sekolah"],
                guruBk: ["Dorong siswa untuk mengikuti ekstrakurikuler KIR (Karya Ilmiah Remaja)", "Berikan akses lebih ke laboratorium atau perpustakaan", "Kenalkan dasar-dasar coding/pemrograman komputer"],
                siswa: ["Bergabunglah dengan klub sains atau kelompok belajar ilmiah", "Mulai pelajari logika dasar *coding* atau komputer", "Latih pemecahan masalah melalui soal-soal logika"]
            },
            SMA: {
                eduTitle1: "Rekomendasi Prodi Kuliah", eduList1: ["Teknik Informatika", "Fisika/Kimia Murni", "Kedokteran", "Ilmu Komputer"],
                eduTitle2: "Alternatif Karir Lulusan Langsung", eduList2: ["Asisten Laboratorium", "Junior Programmer"],
                materi: ["Matematika Lanjutan (Kalkulus)", "Fisika & Kimia Lanjutan", "Algoritma Pemrograman"],
                layanan: ["Konsultasi riset akademik", "Bimbingan metode penelitian", "Pelatihan Data Science tingkat dasar"],
                guruBk: ["Bimbing penyusunan karya tulis ilmiah untuk kompetisi nasional", "Arahkan pada riset dan beasiswa sains", "Diskusikan isu-isu teknologi terkini seperti AI"],
                siswa: ["Fokus perdalam ilmu fisika, kimia, atau matematika terapan", "Ikut serta dalam proyek penelitian sekolah atau kampus", "Kembangkan portofolio di bidang sains/teknologi"]
            }
        }
    },
    R: {
        title: "Realistic", indonesianTitle: "Realistis",
        desc: "Kamu menyukai aktivitas yang melibatkan kerja fisik, peralatan, mesin, atau bekerja di luar ruangan.",
        karir: ["Insinyur", "Mekanik", "Arsitek", "Polisi/TNI", "Atlet", "Koki/Chef"],
        freelance: ["Jasa perbaikan", "Instruktur olahraga", "Fotografer alam"],
        levels: {
            SD: {
                eduTitle1: "Rekomendasi Ekstrakurikuler", eduList1: ["Olahraga (Sepak Bola/Bulu Tangkis)", "Pramuka"],
                eduTitle2: "Pengembangan Diri", eduList2: ["Lomba Merakit (Lego/Kerajinan)", "Kamping"],
                materi: ["Pendidikan Jasmani", "Keterampilan/Prakarya"],
                layanan: ["Kegiatan *outbound* anak", "Kelas membuat kerajinan (DIY)", "Pelatihan motorik kasar"],
                guruBk: ["Berikan mainan yang perlu dirakit (seperti Lego atau *blocks*)", "Dukung anak beraktivitas fisik di luar ruangan", "Libatkan dalam pelajaran prakarya dasar"],
                siswa: ["Bermain di taman atau berolahraga bersama teman", "Belajar membuat kerajinan dari barang bekas", "Bantu siram tanaman atau pelihara hewan kesayangan"]
            },
            SMP: {
                eduTitle1: "Rekomendasi SMA (Jurusan)", eduList1: ["MIPA (Fisika Terapan)", "IPS (Geografi)"],
                eduTitle2: "Rekomendasi SMK (Jurusan)", eduList2: ["Teknik Kendaraan Ringan", "Teknik Mesin", "Agribisnis", "Tata Boga"],
                materi: ["Fisika Dasar", "Pendidikan Jasmani", "Keterampilan Teknik Dasar"],
                layanan: ["Pelatihan keterampilan praktik (Prakarya)", "Bimbingan aktivitas fisik/olahraga", "Orientasi lapangan"],
                guruBk: ["Arahkan ke ekstrakurikuler olahraga atau pecinta alam", "Fasilitasi minat pada perbaikan atau perakitan barang", "Dukung kegiatan praktik kerja nyata/lapangan"],
                siswa: ["Rutin berolahraga untuk menjaga kebugaran", "Cobalah membongkar/memperbaiki barang-barang sederhana di rumah", "Ikuti kegiatan pecinta alam atau penjelajahan"]
            },
            SMA: {
                eduTitle1: "Rekomendasi Prodi Kuliah", eduList1: ["Teknik Mesin", "Teknik Sipil", "Pendidikan Olahraga", "Arsitektur"],
                eduTitle2: "Alternatif Karir Lulusan Langsung", eduList2: ["Mekanik Bengkel", "Staf Lapangan", "Koki Pemula"],
                materi: ["Fisika Terapan", "Geografi Fisik", "Kesehatan Olahraga"],
                layanan: ["Servis teknis tingkat lanjut", "Sertifikasi keahlian vokasi", "Manajemen aktivitas alam liar"],
                guruBk: ["Arahkan pada sertifikasi keahlian SMK (jika SMK)", "Diskusikan prospek karier di militer/kepolisian jika berminat", "Bimbing dalam proyek inovasi teknik"],
                siswa: ["Pelajari cara menggunakan alat atau mesin secara profesional", "Pertimbangkan pelatihan vokasi untuk memperkuat *skill* tangan", "Jaga stamina fisik jika ingin berkarier di bidang aparat/lapangan"]
            }
        }
    },
    A: {
        title: "Artistic", indonesianTitle: "Artistik",
        desc: "Kamu sangat menghargai kebebasan berekspresi, seni, kreativitas, dan inovasi.",
        karir: ["Desainer Grafis", "Penulis", "Musisi", "Content Creator", "Seniman"],
        freelance: ["Desain logo/poster", "Penulis artikel lepas", "Video editor"],
        levels: {
            SD: {
                eduTitle1: "Rekomendasi Ekstrakurikuler", eduList1: ["Menggambar/Melukis", "Tari/Musik", "Teater Cilik"],
                eduTitle2: "Pengembangan Diri", eduList2: ["Lomba Mewarnai", "Membaca Puisi"],
                materi: ["Seni Budaya", "Bahasa Indonesia (Bercerita)"],
                layanan: ["Bimbingan menggambar/mewarnai", "Kelas musik usia dini", "Taman bermain kreatif"],
                guruBk: ["Bebaskan anak bereksperimen dengan krayon, cat air, atau plastisin", "Putarkan lagu dan ajak bernyanyi atau menari bersama", "Bacakan dongeng dan dorong ia menceritakannya kembali"],
                siswa: ["Warnai dan gambarlah apa saja yang kamu sukai", "Mulai menulis buku harian (jurnal) atau cerita pendek", "Coba ikuti lomba puisi atau menyanyi di sekolah"]
            },
            SMP: {
                eduTitle1: "Rekomendasi SMA (Jurusan)", eduList1: ["Bahasa & Sastra", "IPS (Sosiologi Seni)"],
                eduTitle2: "Rekomendasi SMK (Jurusan)", eduList2: ["Desain Komunikasi Visual (DKV)", "Multimedia", "Tata Busana"],
                materi: ["Seni Rupa/Musik", "Bahasa & Sastra", "Desain Digital Pemula"],
                layanan: ["Pelatihan desain grafis pemula", "Bimbingan teater/drama sekolah", "Manajemen pembuatan mading"],
                guruBk: ["Fasilitasi karya siswa untuk dipajang di mading sekolah", "Berikan panggung untuk tampil di acara sekolah", "Dukung kebebasan gaya berekspresi secara visual"],
                siswa: ["Mulailah mendokumentasikan karya senimu (portofolio)", "Belajar menggunakan aplikasi *edit video* atau desain dasar", "Tontonlah pertunjukan seni, pameran, atau teater"]
            },
            SMA: {
                eduTitle1: "Rekomendasi Prodi Kuliah", eduList1: ["Desain Interior", "Seni Rupa/Seni Pertunjukan", "Sastra", "Broadcasting"],
                eduTitle2: "Alternatif Karir Lulusan Langsung", eduList2: ["Desainer Grafis Junior", "Content Creator"],
                materi: ["Sejarah Seni", "Aplikasi Desain (Adobe)", "Sastra Lanjutan"],
                layanan: ["Konsultasi pameran karya", "Pelatihan pembuatan konten (Sosmed)", "Konseling kebebasan berekspresi"],
                guruBk: ["Bimbing pembuatan portofolio untuk seleksi masuk PTN jalur seni", "Arahkan pada kompetisi film pendek, band, atau desain nasional", "Dukung inisiatif proyek seni kreatif OSIS"],
                siswa: ["Terus kembangkan orisinalitas dalam setiap karya", "Coba tawarkan jasamu sebagai kreator konten atau desain", "Gabung dengan komunitas seni lokal di kotamu"]
            }
        }
    },
    E: {
        title: "Enterprising", indonesianTitle: "Wirausaha",
        desc: "Kamu memiliki jiwa kepemimpinan yang kuat, suka memengaruhi orang lain, dan berani mengambil risiko.",
        karir: ["Pengusaha", "Manajer", "Pengacara", "Sales/Marketing", "Public Relations"],
        freelance: ["Reseller/Dropshipper online", "Event Organizer kecil", "MC/Pembawa Acara"],
        levels: {
            SD: {
                eduTitle1: "Rekomendasi Ekstrakurikuler", eduList1: ["Pramuka (Pemimpin Regu)", "Dokter Kecil"],
                eduTitle2: "Pengembangan Diri", eduList2: ["Market Day Sekolah", "Pemilihan Ketua Kelas"],
                materi: ["Matematika Dasar (Uang)", "Pendidikan Kewarganegaraan"],
                layanan: ["Pelatihan keberanian tampil di depan", "Simulasi jual-beli (Bermain peran)", "Bimbingan kepemimpinan cilik"],
                guruBk: ["Tunjuk anak sebagai ketua kelompok atau pemimpin barisan", "Libatkan dalam acara *Market Day* atau simulasi berjualan", "Latih keberanian anak untuk menyampaikan pendapat"],
                siswa: ["Beranikan diri mencalonkan jadi ketua kelas atau pemimpin regu", "Ikut acara bazar sekolah untuk belajar jualan", "Berlatih berbicara dengan suara lantang dan jelas"]
            },
            SMP: {
                eduTitle1: "Rekomendasi SMA (Jurusan)", eduList1: ["IPS (Fokus Ekonomi & Sosiologi)"],
                eduTitle2: "Rekomendasi SMK (Jurusan)", eduList2: ["Bisnis Daring & Pemasaran", "Manajemen Logistik", "Perhotelan"],
                materi: ["IPS Ekonomi Dasar", "Kewirausahaan Dasar", "Public Speaking"],
                layanan: ["Konsultasi ide bisnis remaja", "Pelatihan kepemimpinan tingkat dasar", "Bimbingan retorika/debat"],
                guruBk: ["Dorong siswa bergabung di jajaran pengurus OSIS", "Latih kemampuan negosiasi dan presentasi di depan kelas", "Dukung proyek kewirausahaan siswa kecil-kecilan"],
                siswa: ["Cobalah berjualan makanan atau barang kecil-kecilan ke teman", "Jadilah penggerak (inisiator) saat ada tugas kelompok", "Asah kemampuan *public speaking* dan debat"]
            },
            SMA: {
                eduTitle1: "Rekomendasi Prodi Kuliah", eduList1: ["Ilmu Komunikasi", "Manajemen Bisnis", "Ilmu Hukum", "Hubungan Internasional"],
                eduTitle2: "Alternatif Karir Lulusan Langsung", eduList2: ["Sales Marketing", "Pramuniaga", "Staf Event Organizer"],
                materi: ["Ekonomi Bisnis", "Dasar Kepemimpinan", "Hukum Dasar"],
                layanan: ["Inkubasi bisnis pemula (Start-up)", "Pelatihan Event Organizer", "Konsultasi negosiasi dan manajemen proyek"],
                guruBk: ["Libatkan sebagai ketua pelaksana acara besar sekolah (Pensi)", "Berikan referensi seminar bisnis atau perlombaan kewirausahaan", "Arahkan pada prospek hukum atau ilmu diplomasi (HI)"],
                siswa: ["Mulailah berjejaring (networking) dengan pengusaha/senior", "Pelajari pemasaran digital (*Digital Marketing*)", "Ambil risiko untuk memulai bisnis atau proyek inovatifmu sendiri"]
            }
        }
    }
};

// ============================================================================
// 3. FUNGSI PENGGABUNGAN DINAMIS (Rumus Holland)
// ============================================================================
function blendArrays(arr1: string[] = [], arr2: string[] = [], arr3: string[] = [], maxItems: number): string[] {
    const combined = [...arr1, ...arr2.slice(0, Math.max(1, Math.floor(arr2.length / 2))), ...arr3.slice(0, 1)];
    return [...new Set(combined)].slice(0, maxItems);
}

export default async function ResultPage({ searchParams }: { searchParams: Promise<{ id?: string }>; }) {
    const resolvedParams = await searchParams;
    let resultId = resolvedParams.id;
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: student } = await supabase
        .from('students')
        .select(`id, full_name, education_level, schools (name)`)
        .eq('user_id', user.id)
        .single();

    if (!student) redirect('/student/dashboard?error=Akses_Ditolak');

    const schoolName = student.schools && typeof student.schools === 'object' && 'name' in student.schools
        ? String(student.schools.name) : 'Sekolah Anda';

    // Fallback level pendidikan
    const eduLvl: 'SD' | 'SMP' | 'SMA' = (student.education_level === 'SD' || student.education_level === 'SMA')
        ? student.education_level
        : 'SMP';

    if (!resultId) {
        const { data: latestResult } = await supabase.from('assessment_results')
            .select('id').eq('student_id', student.id).order('calculated_at', { ascending: false }).limit(1).single();
        if (latestResult) resultId = latestResult.id;
        else redirect('/student/dashboard?error=Hasil_Tidak_Ditemukan');
    }

    const { data: resultData, error } = await supabase.from('assessment_results')
        .select(`id, riasec_profiles ( code, riasec_results ( code, raw_score ) )`)
        .eq('id', resultId).eq('student_id', student.id).single();

    if (error || !resultData) redirect('/student/dashboard?error=Data_Gagal_Dimuat');

    const typedResult = resultData as unknown as AssessmentResult;
    const profile: RiasecProfile | null = Array.isArray(typedResult.riasec_profiles) ? typedResult.riasec_profiles[0] : typedResult.riasec_profiles;

    if (!profile) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 font-sans">
            <div className="bg-white p-8 rounded-xl shadow-sm text-center">Profil Belum Ditemukan.</div>
        </div>
    );

    // ============================================================================
    // 4. KALKULASI HASIL & PENANGANAN TIE (SKOR SAMA)
    // ============================================================================
    const rawResults = profile.riasec_results || [];

    // Urutkan berdasarkan skor tertinggi. Fallback alfabetis.
    const sortedScores = [...rawResults].sort((a, b) => {
        if (b.raw_score !== a.raw_score) {
            return b.raw_score - a.raw_score;
        }
        return a.code.localeCompare(b.code);
    });

    const topThree = sortedScores.slice(0, 3);
    const code1 = topThree[0]?.code || 'S';
    const code2 = topThree[1]?.code || 'C';
    const code3 = topThree[2]?.code || 'I';
    const hyphenatedCodes = `${code1}-${code2}-${code3}`;

    // A. Deteksi Tipe Dominan Sama (Rank 1 Tie)
    const highestScore = sortedScores[0]?.raw_score || 0;
    const dominantTies = sortedScores.filter((item) => item.raw_score === highestScore);
    const isDominantTie = dominantTies.length > 1;

    // B. Deteksi Skor Sama pada Batas Top 3 (Rank 3 Tie)
    const cutoffScore = topThree[2]?.raw_score ?? 0;
    const tiedAtCutoff = sortedScores.filter((item) => item.raw_score === cutoffScore);

    const additionalTiedCodes = tiedAtCutoff
        .filter((item) => !topThree.some((topItem) => topItem.code === item.code))
        .map((item) => dimensionDefs[item.code].name);

    // Pesan Motivasi untuk Skor Tambahan
    const cutoffMotivationMessage = additionalTiedCodes.length > 0
        ? `Selain pola di atas, kamu juga memiliki potensi kuat di bidang ${additionalTiedCodes.join(' dan ')} (Skor ${cutoffScore}). Jadikan ini sebagai opsi cadangan atau keterampilan tambahan yang bisa membuat keahlianmu semakin unik!`
        : null;

    // Persiapan Data Kamus
    const data1 = riasecDictionary[code1];
    const data2 = riasecDictionary[code2];
    const data3 = riasecDictionary[code3];

    const level1 = data1.levels[eduLvl];
    const level2 = data2.levels[eduLvl];
    const level3 = data3.levels[eduLvl];

    // Proses Penggabungan Array Berdasarkan Jenjang (LevelData)
    const mixedEdu1 = blendArrays(level1.eduList1, level2.eduList1, level3.eduList1, 5);
    const mixedEdu2 = blendArrays(level1.eduList2, level2.eduList2, level3.eduList2, 5);
    const mixedMateri = blendArrays(level1.materi, level2.materi, level3.materi, 6);

    const mixedKarir = blendArrays(data1.karir, data2.karir, data3.karir, 7);
    const mixedFreelance = blendArrays(data1.freelance, data2.freelance, data3.freelance, 5);

    // Perbaikan utama: Mengambil data Layanan, GuruBk, dan Siswa sesuai Jenjang (LevelData)
    const mixedLayanan = blendArrays(level1.layanan, level2.layanan, level3.layanan, 5);
    const mixedGuruBk = blendArrays(level1.guruBk, level2.guruBk, level3.guruBk, 4);
    const mixedSiswa = blendArrays(level1.siswa, level2.siswa, level3.siswa, 4);

    // ============================================================================
    // 5. PENYUSUNAN TEKS KESIMPULAN DINAMIS & MENDETAIL
    // ============================================================================
    const dynamicConclusion = `Tipe dominan kamu adalah ${data1.title} (${data1.indonesianTitle}) dengan pola gabungan ${hyphenatedCodes}. ${data1.desc} Secara khusus, kamu memadukan dorongan utama dari ${dimensionDefs[code1].name}, gaya pendekatan ${dimensionDefs[code2].behavior}, serta didukung oleh insting ${dimensionDefs[code3].behavior}. Arah studi dan karier terbaikmu memadukan ketiga aspek unik ini.`;

    // Teks motivasi khusus jika Rank 1 memiliki skor seimbang
    let dominantTieMessage = null;
    if (isDominantTie) {
        const tieNames = dominantTies.map(t => riasecDictionary[t.code].indonesianTitle).join(" dan ");
        dominantTieMessage = `Luar biasa! Kamu memiliki skor tertinggi yang seimbang pada tipe ${tieNames}. Ini menunjukkan bahwa kamu adalah pribadi yang fleksibel dengan bakat multidimensi. Jangan ragu untuk mengeksplorasi semua bidang tersebut, karena perpaduan kekuatan ini akan menjadi keunggulan terbesarmu!`;
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col pb-12 font-sans">
            <header className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-10">
                <h1 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                    <Trophy className="text-blue-600" size={16} /> Laporan Hasil Asesmen ({schoolName})
                </h1>
                <Link href="/student/dashboard" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Tutup</Link>
            </header>

            <main className="max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6 space-y-6">

                {/* BAGIAN 1: KESIMPULAN & PENJELASAN TIPE DOMINAN */}
                <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                        <div className="h-20 w-20 bg-blue-50 border border-blue-100 rounded-2xl flex flex-col items-center justify-center shrink-0">
                            <span className="text-xs font-bold text-blue-400 mb-1">PROFIL</span>
                            <span className="text-2xl font-black text-blue-700 tracking-widest">{hyphenatedCodes.replace(/-/g, '')}</span>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-lg font-bold text-slate-900 mb-3">Ringkasan Kesimpulan</h2>

                            {/* Teks Kesimpulan Utama yang Mendetail */}
                            <p className="text-slate-700 text-sm leading-relaxed mb-4">
                                {dynamicConclusion}
                            </p>

                            {/* Motivasi Rank 1 (Jika Skor Seri di Puncak) */}
                            {dominantTieMessage && (
                                <div className="mb-4 rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3">
                                    <div className="flex items-start gap-2">
                                        <Star className="h-4 w-4 text-indigo-600 mt-0.5 shrink-0" />
                                        <p className="text-sm text-indigo-900 leading-relaxed font-medium">
                                            {dominantTieMessage}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Motivasi Rank 3 (Pesan Potensi Tambahan) */}
                            {cutoffMotivationMessage && (
                                <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
                                    <div className="flex items-start gap-2">
                                        <Activity className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                                        <p className="text-sm text-amber-900 leading-relaxed">
                                            {cutoffMotivationMessage}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* BLOK PENJABARAN SEMUA TIPE DOMINAN (RANK 1) */}
                            {dominantTies.map((tie, index) => {
                                const tieData = riasecDictionary[tie.code];
                                return (
                                    <div key={tie.code} className={`pt-4 ${index > 0 ? "mt-4" : "mt-5 border-t border-slate-100"}`}>
                                        <h3 className="text-base font-bold text-slate-900 mb-1">
                                            Tipe Dominan: {tieData.title} ({tieData.indonesianTitle})
                                        </h3>
                                        <p className="text-slate-700 text-sm leading-relaxed">{tieData.desc}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* BAGIAN 2: DETAIL SKOR 6 DIMENSI */}
                <section className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200">
                    <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
                        <Activity className="h-5 w-5 text-indigo-500" /> Detail Skor 6 Dimensi
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {sortedScores.map((score) => {
                            const percentage = Math.min((score.raw_score / 35) * 100, 100);
                            const dimInfo = dimensionDefs[score.code];

                            // Cek jika ada dimensi lain yang skornya persis sama
                            const sameScoreCodes = sortedScores
                                .filter((item) => item.raw_score === score.raw_score && item.code !== score.code)
                                .map((item) => item.code);

                            return (
                                <div key={score.code} className="flex flex-col gap-2">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <span className="font-bold text-slate-800 text-sm">{dimInfo.name}</span>
                                            <p className="text-xs text-slate-500 mt-0.5">{dimInfo.meaning}</p>

                                            {sameScoreCodes.length > 0 && (
                                                <p className="text-[11px] font-medium text-amber-600 mt-1">
                                                    Skor sama dengan: {sameScoreCodes.join(', ')}
                                                </p>
                                            )}
                                        </div>
                                        <span className="text-sm font-bold text-indigo-600">{score.raw_score}</span>
                                    </div>
                                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full rounded-full bg-indigo-500 transition-all duration-1000" style={{ width: `${percentage}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* BAGIAN 3: GRID REKOMENDASI SESUAI UMUR */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2">
                            <School className="h-4 w-4 text-blue-500" /> {eduLvl === 'SD' ? "Minat & Bakat" : "Studi Lanjut"}
                        </h4>
                        <div className="mb-4">
                            <span className="text-xs font-semibold text-slate-400 uppercase">{level1.eduTitle1}</span>
                            <ul className="mt-2 space-y-1">{mixedEdu1.map((item, i) => <li key={i} className="text-sm text-slate-700">• {item}</li>)}</ul>
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase">{level1.eduTitle2}</span>
                            <ul className="mt-2 space-y-1">{mixedEdu2.map((item, i) => <li key={i} className="text-sm text-slate-700">• {item}</li>)}</ul>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2"><Briefcase className="h-4 w-4 text-emerald-500" /> Karier & Usaha</h4>
                        <div className="mb-4">
                            <span className="text-xs font-semibold text-slate-400 uppercase">Pekerjaan Masa Depan</span>
                            <ul className="mt-2 space-y-1">{mixedKarir.map((item, i) => <li key={i} className="text-sm text-slate-700">• {item}</li>)}</ul>
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase">Peluang Pengembangan / Freelance</span>
                            <ul className="mt-2 space-y-1">{mixedFreelance.map((item, i) => <li key={i} className="text-sm text-slate-700">• {item}</li>)}</ul>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                        <h4 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2 border-b pb-2"><BookOpen className="h-4 w-4 text-amber-500" /> Pembelajaran</h4>
                        <div className="mb-4">
                            <span className="text-xs font-semibold text-slate-400 uppercase">Materi Pelajaran ({eduLvl})</span>
                            <ul className="mt-2 space-y-1">{mixedMateri.map((item, i) => <li key={i} className="text-sm text-slate-700">• {item}</li>)}</ul>
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-slate-400 uppercase">Jenis Layanan Pendukung</span>
                            <ul className="mt-2 space-y-1">{mixedLayanan.map((item, i) => <li key={i} className="text-sm text-slate-700">• {item}</li>)}</ul>
                        </div>
                    </div>
                </div>

                {/* BAGIAN 4: ACTION PLAN */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-700">
                        <h4 className="text-sm font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-600 pb-2">
                            <HeartHandshake className="h-4 w-4 text-slate-300" /> Yang Perlu Dilakukan Guru / Orang Tua
                        </h4>
                        <ul className="space-y-2">
                            {mixedGuruBk.map((item, i) => <li key={i} className="text-sm text-slate-300 flex items-start gap-2"><ArrowRight className="h-4 w-4 shrink-0 mt-0.5 opacity-50" /> {item}</li>)}
                        </ul>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-6 shadow-sm border border-blue-100">
                        <h4 className="text-sm font-bold text-blue-900 mb-4 flex items-center gap-2 border-b border-blue-200 pb-2">
                            <UserCheck className="h-4 w-4 text-blue-600" /> Yang Perlu Dilakukan Siswa
                        </h4>
                        <ul className="space-y-2">
                            {mixedSiswa.map((item, i) => <li key={i} className="text-sm text-blue-800 flex items-start gap-2"><Sparkles className="h-4 w-4 shrink-0 mt-0.5 opacity-50 text-blue-500" /> {item}</li>)}
                        </ul>
                    </div>
                </div>

                <div className="pt-6 pb-12 flex justify-end">
                    <Link href="/student/dashboard" className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
                        Selesai <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </main>
        </div>
    );
}