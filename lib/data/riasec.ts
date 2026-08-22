// Lokasi file: src/lib/data/riasec.ts

export type RiasecResultItem = { code: string; raw_score: number; };
export type RiasecProfile = { code: string; riasec_results: RiasecResultItem[]; };
export type AssessmentResult = { id: string; riasec_profiles: RiasecProfile | RiasecProfile[] | null; };

export type LevelData = {
    // KELAS AWAL & MENENGAH (Kelas 1-5 SD, 7-8 SMP, 10-11 SMA)
    eduTitle1: string; eduList1: string[];
    eduTitle2: string; eduList2: string[];

    // KELAS TRANSISI / KELULUSAN (Kelas 6 SD, 9 SMP, 12 SMA)
    transisiTitle1: string; transisiList1: string[];
    transisiTitle2: string; transisiList2: string[];

    materi: string[]; layanan: string[];
    guruBk: string[]; siswa: string[];
};

export type ProfileDetail = {
    title: string; indonesianTitle: string; desc: string;
    karir: string[]; freelance: string[];
    levels: { SD: LevelData; SMP: LevelData; SMA: LevelData; };
};

export const dimensionDefs: Record<string, { name: string; meaning: string; behavior: string }> = {
    R: { name: "Realistic (Realistis)", meaning: "Menyukai aktivitas fisik, mesin, alat, dan lingkungan luar.", behavior: "bertindak praktis dan mengutamakan aksi nyata" },
    I: { name: "Investigative (Investigatif)", meaning: "Memiliki rasa ingin tahu, suka analisis, sains, dan observasi.", behavior: "berpikir kritis dan mencari tahu akar masalah" },
    A: { name: "Artistic (Artistik)", meaning: "Menyukai kreativitas, seni, kebebasan, dan inovasi.", behavior: "berekspresi secara kreatif dan out-of-the-box" },
    S: { name: "Social (Sosial)", meaning: "Suka interaksi, menolong, membimbing, dan peduli pada orang lain.", behavior: "mengutamakan empati dan kerja sama" },
    E: { name: "Enterprising (Wirausaha)", meaning: "Suka memimpin, memengaruhi orang lain, dan mengambil risiko.", behavior: "memimpin, bernegosiasi, dan mencari peluang" },
    C: { name: "Conventional (Konvensional)", meaning: "Suka keteraturan, bekerja dengan data, dan aktivitas terstruktur.", behavior: "bekerja secara terorganisir, teliti, dan rapi" }
};

export const riasecDictionary: Record<string, ProfileDetail> = {
    S: {
        title: "Social", indonesianTitle: "Sosial",
        desc: "Kamu senang berinteraksi, menolong, dan membimbing orang lain. Kamu peka pada perasaan orang di sekitarmu.",
        karir: ["Guru", "Konselor", "Dokter", "Perawat", "Psikolog", "Pekerja sosial", "Ustadz/Ustadzah"],
        freelance: ["Tutor privat", "Trainer soft-skill", "Relawan komunitas"],
        levels: {
            SD: {
                eduTitle1: "Rekomendasi Ekstrakurikuler", eduList1: ["Pramuka", "Dokter Kecil (UKS)", "Klub Bercerita"],
                eduTitle2: "Pengembangan Diri", eduList2: ["Kerja Bakti Sekolah", "Lomba Pidato Cilik"],
                transisiTitle1: "Target Karakteristik SMP", transisiList1: ["SMP Berwawasan Sosial/Pesantren", "SMP Inklusif", "SMP dengan OSIS/Pramuka Kuat"],
                transisiTitle2: "Ekskul Persiapan SMP", transisiList2: ["PMR / Palang Merah Remaja", "Klub Sosial Cilik", "Bimbingan Sebaya"],
                materi: ["Pendidikan Pancasila", "Bahasa Indonesia", "Ilmu Pengetahuan Sosial Dasar"],
                layanan: ["Pendampingan bermain kelompok", "Bimbingan empati anak"],
                guruBk: ["Ajak anak berbagi bekal dengan teman", "Latih mendengarkan saat orang lain berbicara"],
                siswa: ["Bermain dengan teman-teman di luar rumah", "Bantu ayah/ibu di rumah"]
            },
            SMP: {
                eduTitle1: "Persiapan Peminatan SMA Awal", eduList1: ["Aktif Organisasi Sekolah (OSIS)", "Eksplorasi Minat Ilmu Sosial"],
                eduTitle2: "Eksplorasi Bidang Vokasi Dasar", eduList2: ["Penyuluhan Kesehatan Remaja", "Pengenalan Pelayanan Publik"],
                transisiTitle1: "Pilihan Jurusan SMA Utama", transisiList1: ["IPS (Ilmu Pengetahuan Sosial)", "Bahasa & Budaya", "MIPA (Untuk Kedokteran/Kesehatan)"],
                transisiTitle2: "Pilihan Jurusan SMK Alternatif", transisiList2: ["Keperawatan / Kesehatan", "Pekerjaan Sosial", "Layanan Keagamaan"],
                materi: ["Sosiologi Dasar", "Biologi (Kesehatan Manusia)", "Bahasa Indonesia", "PPKn"],
                layanan: ["Layanan konseling sebaya", "Pendampingan kegiatan sosial"],
                guruBk: ["Libatkan dalam kegiatan PMR/Pramuka", "Arahkan untuk menjadi tutor sebaya"],
                siswa: ["Bantu teman kelas yang kesulitan belajar", "Mulai belajar berorganisasi"]
            },
            SMA: {
                eduTitle1: "Fokus Peminatan & Portofolio", eduList1: ["Aktif di Komunitas Sosial / Panti Asuhan", "Latihan Public Speaking / Debat"],
                eduTitle2: "Eksplorasi Keahlian Tambahan", eduList2: ["Sertifikasi Relawan / PMR", "Pengembangan Empati & Konseling"],
                transisiTitle1: "Rekomendasi Prodi Kuliah", transisiList1: ["Ilmu Komunikasi", "Pendidikan Guru", "Psikologi", "Kedokteran", "Sosiologi"],
                transisiTitle2: "Alternatif Karir Lulusan Langsung", transisiList2: ["Asisten Pengajar", "Staf Pelayanan Masyarakat", "Admin Customer Service"],
                materi: ["Sosiologi Lanjutan", "Psikologi Dasar", "Public Speaking"],
                layanan: ["Konseling psikologi lanjutan", "Manajemen komunitas"],
                guruBk: ["Latih empati untuk pemecahan masalah (mediator)", "Fasilitasi minat di bidang kesehatan masyarakat"],
                siswa: ["Jadilah pendengar yang baik bagi teman", "Jelajahi minat pada ilmu kesehatan atau psikologi"]
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
                transisiTitle1: "Target Karakteristik SMP", transisiList1: ["SMP dengan Ekstrakurikuler TIK", "SMP Berbasis Disiplin Ketat"],
                transisiTitle2: "Ekskul Persiapan SMP", transisiList2: ["Klub Komputer/Coding Dasar", "Pembukuan Kas Kelas"],
                materi: ["Matematika (Aritmatika)", "Teknologi Informasi (Dasar)", "Keterampilan Mencatat"],
                layanan: ["Bimbingan kedisiplinan waktu", "Latihan fokus dan ketelitian"],
                guruBk: ["Beri tugas sederhana seperti membagikan kertas ulangan", "Ajarkan kebiasaan menabung"],
                siswa: ["Rapikan meja belajar setelah belajar", "Mulai belajar menabung uang saku"]
            },
            SMP: {
                eduTitle1: "Persiapan Peminatan SMA Awal", eduList1: ["Pengenalan Logika Matematika", "Mencatat Laporan Kegiatan OSIS"],
                eduTitle2: "Eksplorasi Bidang Vokasi Dasar", eduList2: ["Pengenalan Aplikasi Excel Dasar", "Pengarsipan Dokumen"],
                transisiTitle1: "Pilihan Jurusan SMA Utama", transisiList1: ["IPS (Fokus Ekonomi/Akuntansi)", "MIPA (Fokus Logika Matematika)"],
                transisiTitle2: "Pilihan Jurusan SMK Alternatif", transisiList2: ["Akuntansi & Keuangan Lembaga", "Manajemen Perkantoran (OTKP)", "Perbankan"],
                materi: ["Ekonomi/Akuntansi Dasar", "Aplikasi Excel/Spreadsheet", "TIK"],
                layanan: ["Pelatihan komputer dasar (Word/Excel)", "Bimbingan dasar akuntansi"],
                guruBk: ["Berikan tugas administratif kelas (bendahara)", "Latih penggunaan aplikasi Microsoft Office"],
                siswa: ["Mencatat pengeluaran uang saku", "Belajar rumus dasar Excel"]
            },
            SMA: {
                eduTitle1: "Fokus Peminatan & Portofolio", eduList1: ["Pelatihan Administrasi & Arsip", "Simulasi Analisis Data Kecil"],
                eduTitle2: "Eksplorasi Keahlian Tambahan", eduList2: ["Sertifikasi Microsoft Office", "Kursus Pembukuan / Akuntansi"],
                transisiTitle1: "Rekomendasi Prodi Kuliah", transisiList1: ["Akuntansi", "Administrasi Bisnis", "Statistika", "Manajemen Keuangan"],
                transisiTitle2: "Alternatif Karir Lulusan Langsung", transisiList2: ["Staf Administrasi", "Kasir / Teller", "Data Entry Clerk"],
                materi: ["Akuntansi Keuangan", "Statistika Terapan", "Aplikasi Perkantoran Lanjutan"],
                layanan: ["Pendampingan manajemen waktu kompleks", "Pelatihan administrasi bisnis"],
                guruBk: ["Arahkan pada sertifikasi komputer", "Kenalkan pada konsep analisis data"],
                siswa: ["Asah keterampilan mengetik cepat presisi", "Belajar software akuntansi"]
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
                eduTitle2: "Pengembangan Diri", eduList2: ["Eksperimen Alam", "Kunjungan Museum Sains"],
                transisiTitle1: "Target Karakteristik SMP", transisiList1: ["SMP Kelas Unggulan / Akselerasi", "SMP dengan Lab Sains Lengkap", "SMP Tradisi Medali OSN"],
                transisiTitle2: "Ekskul Persiapan SMP", transisiList2: ["Olimpiade Sains (OSN-SD)", "Karya Ilmiah Cilik", "Klub Coding Anak"],
                materi: ["Matematika Dasar", "Ilmu Pengetahuan Alam (IPA)"],
                layanan: ["Bimbingan logika dasar", "Eksperimen sains menyenangkan"],
                guruBk: ["Beri kesempatan anak bereksperimen sederhana", "Dukung kebiasaan membaca buku ensiklopedia"],
                siswa: ["Banyak membaca buku alam semesta/teknologi", "Sering bertanya cara kerja suatu benda"]
            },
            SMP: {
                eduTitle1: "Persiapan Peminatan SMA Awal", eduList1: ["Fokus Nilai Eksakta (Matematika/IPA)", "Eksplorasi Teknologi Informasi"],
                eduTitle2: "Eksplorasi Bidang Vokasi Dasar", eduList2: ["Logika Algoritma & Coding Dasar", "Pengenalan Alat Laboratorium"],
                transisiTitle1: "Pilihan Jurusan SMA Utama", transisiList1: ["MIPA (Matematika, Fisika, Kimia, Biologi)", "SMA Taruna Nusantara / Unggulan"],
                transisiTitle2: "Pilihan Jurusan SMK Alternatif", transisiList2: ["Rekayasa Perangkat Lunak (RPL)", "Analis Kimia", "Farmasi Klinis"],
                materi: ["Sains Eksperimen", "Matematika Aljabar", "Metode Ilmiah"],
                layanan: ["Konsultasi bimbingan olimpiade", "Akses laboratorium sekolah"],
                guruBk: ["Dorong ikut ekstrakurikuler KIR (Karya Ilmiah)", "Kenalkan dasar pemrograman"],
                siswa: ["Mulai pelajari logika dasar *coding*", "Latih pemecahan soal-soal logika HOTS"]
            },
            SMA: {
                eduTitle1: "Fokus Peminatan & Portofolio", eduList1: ["Penyusunan Karya Tulis Ilmiah", "Proyek Riset Sekolah Independen"],
                eduTitle2: "Eksplorasi Keahlian Tambahan", eduList2: ["Pelatihan Bahasa Pemrograman (Python/Web)", "Partisipasi Olimpiade Sains Nasional"],
                transisiTitle1: "Rekomendasi Prodi Kuliah", transisiList1: ["Teknik Informatika", "Fisika/Kimia Murni", "Kedokteran", "Data Science"],
                transisiTitle2: "Alternatif Karir Lulusan Langsung", transisiList2: ["Asisten Laboratorium Sekolah", "Junior Programmer / Quality Assurance", "Staf IT Support"],
                materi: ["Matematika Lanjutan (Kalkulus)", "Fisika & Kimia Lanjutan", "Algoritma"],
                layanan: ["Konsultasi riset akademik", "Bimbingan metode penelitian"],
                guruBk: ["Bimbing portofolio kompetisi nasional", "Diskusikan isu teknologi terkini (AI)"],
                siswa: ["Fokus ilmu fisika, kimia, atau matematika terapan", "Ikut proyek penelitian kampus/sekolah"]
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
                eduTitle1: "Rekomendasi Ekstrakurikuler", eduList1: ["Olahraga (Sepakbola/Bela Diri)", "Pramuka Lapangan"],
                eduTitle2: "Pengembangan Diri", eduList2: ["Lomba Merakit (Lego/Puzzle)", "Kamping / Outbound"],
                transisiTitle1: "Target Karakteristik SMP", transisiList1: ["SMP Berfokus Olahraga / Kelas KKO", "SMP dengan Sarana Prakarya Lengkap"],
                transisiTitle2: "Ekskul Persiapan SMP", transisiList2: ["Klub Mekanik Cilik", "Lomba Memasak Cilik", "Atletik Anak"],
                materi: ["Pendidikan Jasmani", "Keterampilan/Prakarya"],
                layanan: ["Kegiatan *outbound* anak", "Pelatihan motorik kasar"],
                guruBk: ["Berikan mainan yang perlu dirakit", "Dukung aktivitas fisik di luar ruangan"],
                siswa: ["Bermain di taman / olahraga", "Belajar membuat kerajinan dari barang bekas"]
            },
            SMP: {
                eduTitle1: "Persiapan Peminatan SMA Awal", eduList1: ["Persiapan Kebugaran Jasmani", "Eksplorasi Ilmu Geografi & Alam"],
                eduTitle2: "Eksplorasi Bidang Vokasi Dasar", eduList2: ["Prakarya Kelistrikan/Kayu", "Pengenalan Mesin & Otomotif Dasar"],
                transisiTitle1: "Pilihan Jurusan SMA Utama", transisiList1: ["MIPA (Fokus Fisika Terapan)", "IPS (Fokus Geografi & Lapangan)"],
                transisiTitle2: "Pilihan Jurusan SMK Alternatif", transisiList2: ["Teknik Kendaraan Ringan (Otomotif)", "Teknik Mesin / Konstruksi", "Agribisnis / Tata Boga"],
                materi: ["Fisika Dasar", "Pendidikan Jasmani", "Keterampilan Teknik Dasar"],
                layanan: ["Pelatihan keterampilan praktik", "Orientasi lapangan"],
                guruBk: ["Arahkan ke ekskul olahraga/pecinta alam", "Dukung kegiatan praktik kerja nyata"],
                siswa: ["Rutin berolahraga untuk menjaga kebugaran", "Cobalah membongkar/merakit barang di rumah"]
            },
            SMA: {
                eduTitle1: "Fokus Peminatan & Portofolio", eduList1: ["Persiapan Seleksi Fisik (TNI/Polri/Kedinasan)", "Proyek Rancang Bangun (Maket)"],
                eduTitle2: "Eksplorasi Keahlian Tambahan", eduList2: ["Sertifikasi Vokasi (Las/Otomotif)", "Kursus Kuliner / Memasak"],
                transisiTitle1: "Rekomendasi Prodi Kuliah", transisiList1: ["Teknik Sipil / Arsitektur", "Teknik Mesin", "Pendidikan Olahraga", "Akademi Militer/Kepolisian"],
                transisiTitle2: "Alternatif Karir Lulusan Langsung", transisiList2: ["Mekanik Bengkel Pemula", "Staf Lapangan / Teknisi", "Koki Pemula", "Atlet Muda"],
                materi: ["Fisika Terapan", "Geografi Fisik", "Kesehatan Olahraga"],
                layanan: ["Servis teknis tingkat lanjut", "Sertifikasi keahlian vokasi"],
                guruBk: ["Arahkan pada sertifikasi keahlian SMK", "Diskusikan prospek karier militer"],
                siswa: ["Pelajari penggunaan alat/mesin profesional", "Jaga stamina fisik untuk karier lapangan"]
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
                eduTitle1: "Rekomendasi Ekstrakurikuler", eduList1: ["Menggambar/Melukis", "Tari/Musik"],
                eduTitle2: "Pengembangan Diri", eduList2: ["Lomba Mewarnai", "Membaca Puisi"],
                transisiTitle1: "Target Karakteristik SMP", transisiList1: ["SMP dengan Fokus Seni Budaya/Teater", "SMP Inovatif & Kreatif"],
                transisiTitle2: "Ekskul Persiapan SMP", transisiList2: ["Klub Teater Cilik", "Jurnalistik / Majalah Dinding Sekolah", "Paduan Suara"],
                materi: ["Seni Budaya", "Bahasa Indonesia (Bercerita)"],
                layanan: ["Bimbingan menggambar/mewarnai", "Kelas musik usia dini"],
                guruBk: ["Bebaskan anak bereksperimen dengan cat air/krayon", "Putarkan lagu dan ajak bernyanyi"],
                siswa: ["Mulai menulis buku harian/cerpen", "Ikuti lomba puisi atau menyanyi"]
            },
            SMP: {
                eduTitle1: "Persiapan Peminatan SMA Awal", eduList1: ["Eksplorasi Sastra & Menulis", "Praktik Kesenian Tradisional/Modern"],
                eduTitle2: "Eksplorasi Bidang Vokasi Dasar", eduList2: ["Pengenalan Desain Grafis Canva/Photoshop", "Dasar Fotografi & Edit Video"],
                transisiTitle1: "Pilihan Jurusan SMA Utama", transisiList1: ["Bahasa & Sastra", "IPS (Fokus Sosiologi Seni & Budaya)"],
                transisiTitle2: "Pilihan Jurusan SMK Alternatif", transisiList2: ["Desain Komunikasi Visual (DKV)", "Multimedia / Animasi", "Tata Busana / Broadcasting"],
                materi: ["Seni Rupa/Musik", "Bahasa & Sastra", "Desain Digital Pemula"],
                layanan: ["Pelatihan desain grafis", "Bimbingan teater/drama"],
                guruBk: ["Fasilitasi karya siswa di mading sekolah", "Dukung kebebasan berekspresi visual"],
                siswa: ["Dokumentasikan karya senimu (portofolio)", "Belajar aplikasi edit video/desain"]
            },
            SMA: {
                eduTitle1: "Fokus Peminatan & Portofolio", eduList1: ["Kompilasi Portofolio Karya Seni/Desain", "Pementasan Teater / Pameran Sekolah"],
                eduTitle2: "Eksplorasi Keahlian Tambahan", eduList2: ["Sertifikasi Adobe / UI/UX Design", "Penguasaan Alat Musik Tingkat Lanjut"],
                transisiTitle1: "Rekomendasi Prodi Kuliah", transisiList1: ["Desain Interior / DKV", "Seni Rupa/Pertunjukan", "Sastra & Jurnalistik", "Broadcasting & Perfilman"],
                transisiTitle2: "Alternatif Karir Lulusan Langsung", transisiList2: ["Desainer Grafis Junior", "Content Creator / Youtuber", "Fotografer / Videografer Pemula", "Asisten Studio"],
                materi: ["Sejarah Seni", "Aplikasi Desain (Adobe)", "Sastra Lanjutan"],
                layanan: ["Konsultasi pameran karya", "Pelatihan pembuatan konten"],
                guruBk: ["Bimbing portofolio masuk PTN jalur seni", "Arahkan lomba film pendek/band"],
                siswa: ["Kembangkan orisinalitas karya", "Tawarkan jasa desain/konten kreator"]
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
                eduTitle1: "Rekomendasi Ekstrakurikuler", eduList1: ["Pramuka (Sebagai Pemimpin Regu)", "Dokter Kecil"],
                eduTitle2: "Pengembangan Diri", eduList2: ["Market Day Sekolah", "Pemilihan Ketua Kelas"],
                transisiTitle1: "Target Karakteristik SMP", transisiList1: ["SMP dengan Budaya Kepemimpinan (OSIS Aktif)", "SMP yang Mendukung Proyek Kewirausahaan"],
                transisiTitle2: "Ekskul Persiapan SMP", transisiList2: ["Klub Jurnalistik / Public Speaking Anak", "Lomba Debat / Pidato Cilik", "Bazar Cilik"],
                materi: ["Matematika Dasar (Uang)", "Pendidikan Kewarganegaraan"],
                layanan: ["Simulasi jual-beli", "Bimbingan kepemimpinan cilik"],
                guruBk: ["Tunjuk anak sebagai ketua kelompok", "Latih keberanian menyampaikan pendapat"],
                siswa: ["Beranikan diri mencalonkan jadi ketua kelas", "Berlatih berbicara dengan suara lantang"]
            },
            SMP: {
                eduTitle1: "Persiapan Peminatan SMA Awal", eduList1: ["Mencalonkan Diri Menjadi Pengurus OSIS", "Pengenalan Ilmu Ekonomi Mikro"],
                eduTitle2: "Eksplorasi Bidang Vokasi Dasar", eduList2: ["Latihan Public Speaking & Debat", "Mencoba Berjualan Online Skala Kecil"],
                transisiTitle1: "Pilihan Jurusan SMA Utama", transisiList1: ["IPS (Fokus Ekonomi & Sosiologi)", "Bahasa (Untuk Komunikasi Global)"],
                transisiTitle2: "Pilihan Jurusan SMK Alternatif", transisiList2: ["Bisnis Daring & Pemasaran", "Manajemen Logistik / Perkantoran", "Perhotelan / Pariwisata"],
                materi: ["IPS Ekonomi Dasar", "Kewirausahaan Dasar", "Public Speaking"],
                layanan: ["Konsultasi ide bisnis remaja", "Pelatihan kepemimpinan"],
                guruBk: ["Dorong masuk jajaran pengurus OSIS", "Latih kemampuan negosiasi dan presentasi"],
                siswa: ["Jadilah inisiator saat ada tugas kelompok", "Asah kemampuan *public speaking*"]
            },
            SMA: {
                eduTitle1: "Fokus Peminatan & Portofolio", eduList1: ["Ketua Panitia Event Sekolah (Pensi, dll)", "Membangun Jaringan (Networking) Siswa"],
                eduTitle2: "Eksplorasi Keahlian Tambahan", eduList2: ["Pelatihan Digital Marketing", "Manajemen Event (EO) Remaja"],
                transisiTitle1: "Rekomendasi Prodi Kuliah", transisiList1: ["Ilmu Hukum", "Manajemen Bisnis", "Ilmu Komunikasi", "Hubungan Internasional", "Pariwisata"],
                transisiTitle2: "Alternatif Karir Lulusan Langsung", transisiList2: ["Sales Marketing / Pramuniaga", "Staf Event Organizer", "Customer Service", "Wirausaha Pemula (Start-up)"],
                materi: ["Ekonomi Bisnis", "Dasar Kepemimpinan", "Hukum Dasar"],
                layanan: ["Inkubasi bisnis pemula", "Konsultasi negosiasi proyek"],
                guruBk: ["Libatkan sebagai ketua pelaksana acara besar", "Arahkan pada prospek hukum/HI"],
                siswa: ["Pelajari pemasaran digital (*Digital Marketing*)", "Ambil risiko memulai bisnis kecil-kecilan"]
            }
        }
    }
};