// Lokasi file: src/lib/data/riasec.ts

export type RiasecResultItem = { code: string; raw_score: number; };
export type RiasecProfile = { code: string; riasec_results: RiasecResultItem[]; };
export type AssessmentResult = { id: string; riasec_profiles: RiasecProfile | RiasecProfile[] | null; };

// Struktur baru yang menampung SEMUA atribut secara dinamis per fase
export type PhaseData = {
    eduTitle1: string; eduList1: string[];
    eduTitle2: string; eduList2: string[];
    materi: string[]; layanan: string[];
    guruBk: string[]; siswa: string[];
};

export type LevelData = {
    SD_Awal: PhaseData;     // Kelas 1-3 (Fase Bermain & Dasar)
    SD_Akhir: PhaseData;    // Kelas 4-5 (Fase Eksplorasi)
    SD_Transisi: PhaseData; // Kelas 6 (Fase Persiapan SMP)
    SMP_Awal: PhaseData;    // Kelas 7-8 (Fase Organisasi & Jati Diri)
    SMP_Transisi: PhaseData;// Kelas 9 (Fase Penjurusan Menengah Atas)
    SMA_Awal: PhaseData;    // Kelas 10-11 SMA (Eksplorasi Mapel/Fase E-F)
    SMA_Transisi: PhaseData;// Kelas 12 SMA (Fokus UTBK/Kuliah)
    SMK_Awal: PhaseData;    // Kelas 10-11 SMK (Praktek Vokasi & PKL)
    SMK_Transisi: PhaseData;// Kelas 12 SMK (Fokus Rekrutmen Kerja)
};

export type ProfileDetail = {
    title: string; indonesianTitle: string; desc: string;
    karir: string[]; freelance: string[];
    levels: LevelData;
};

export const dimensionDefs: Record<string, { name: string; meaning: string; behavior: string }> = {
    R: { name: "Realistic", meaning: "Suka aktivitas fisik, mesin, alat, lingkungan luar.", behavior: "bertindak praktis dan mengutamakan aksi" },
    I: { name: "Investigative", meaning: "Rasa ingin tahu tinggi, suka analisis, sains.", behavior: "berpikir kritis mencari akar masalah" },
    A: { name: "Artistic", meaning: "Suka kreativitas, seni, kebebasan, inovasi.", behavior: "berekspresi kreatif dan out-of-the-box" },
    S: { name: "Social", meaning: "Suka interaksi, menolong, membimbing orang lain.", behavior: "mengutamakan empati dan kerja sama" },
    E: { name: "Enterprising", meaning: "Suka memimpin, memengaruhi, mengambil risiko.", behavior: "memimpin, bernegosiasi, mencari peluang" },
    C: { name: "Conventional", meaning: "Suka keteraturan, data, aktivitas terstruktur.", behavior: "bekerja terorganisir, teliti, dan rapi" }
};

export const riasecDictionary: Record<string, ProfileDetail> = {
    S: {
        title: "Social", indonesianTitle: "Sosial",
        desc: "Kamu senang berinteraksi, menolong, dan membimbing orang lain. Kamu sangat peka pada perasaan orang di sekitarmu.",
        karir: ["Guru", "Psikolog", "Perawat", "Pekerja Sosial", "HRD"], freelance: ["Tutor", "Relawan"],
        levels: {
            SD_Awal: {
                eduTitle1: "Aktivitas Bermain", eduList1: ["Bermain peran (Roleplay)", "Berbagi mainan"],
                eduTitle2: "Karakter Dasar", eduList2: ["Menyapa teman", "Mengantri dengan sabar"],
                materi: ["Pendidikan Karakter", "Pengenalan Emosi"], layanan: ["Bimbingan bermain kelompok"],
                guruBk: ["Latih anak mengenali emosi teman", "Beri pujian saat mau berbagi"], siswa: ["Bermainlah dengan teman baru"]
            },
            SD_Akhir: {
                eduTitle1: "Ekskul Pilihan", eduList1: ["Pramuka Dasar", "Dokter Kecil (UKS)"],
                eduTitle2: "Tanggung Jawab", eduList2: ["Menjadi tutor teman sebaya", "Kerja bakti kelas"],
                materi: ["PPKn", "Bahasa Indonesia (Diskusi)"], layanan: ["Konseling empati dasar"],
                guruBk: ["Beri tugas kelompok koperatif", "Latih mendengar aktif"], siswa: ["Bantu teman yang kesulitan belajar"]
            },
            SD_Transisi: {
                eduTitle1: "Target Lingkungan SMP", eduList1: ["SMP dengan budaya toleransi tinggi", "SMP berbasis komunitas/sosial"],
                eduTitle2: "Persiapan Ekskul SMP", eduList2: ["PMR/Palang Merah Remaja", "Klub Sosial"],
                materi: ["Persiapan Adaptasi Lingkungan Baru", "Etika Pergaulan"], layanan: ["Bimbingan transisi remaja awal"],
                guruBk: ["Siapkan mental anak menghadapi ragam karakter di SMP"], siswa: ["Belajar beradaptasi dengan teman dari beda sekolah"]
            },
            SMP_Awal: {
                eduTitle1: "Pengembangan Diri", eduList1: ["Aktif di PMR/Pramuka", "Panitia acara kelas"],
                eduTitle2: "Eksplorasi Komunitas", eduList2: ["Relawan kebersihan sekolah", "Klub duta sekolah"],
                materi: ["Sosiologi Remaja", "Kesehatan Reproduksi (Dasar)"], layanan: ["Konseling sebaya (Peer Counseling)"],
                guruBk: ["Jadikan siswa sebagai mediator konflik antar teman", "Dukung ikut OSIS Sekbid Sosial"], siswa: ["Jadilah pendengar yang baik bagi teman"]
            },
            SMP_Transisi: {
                eduTitle1: "Pilihan Jurusan SMA", eduList1: ["IPS (Fokus Sosiologi)", "MIPA (Untuk Kedokteran/Kesehatan)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Keperawatan/Kesehatan Masyarakat", "Pekerjaan Sosial"],
                materi: ["Bimbingan Karier Dasar", "Psikologi Dasar"], layanan: ["Konsultasi penjurusan minat"],
                guruBk: ["Bantu siswa memetakan karir di bidang kesehatan atau sosial"], siswa: ["Cari tahu perbedaan SMA dan SMK di bidang kesehatan/sosial"]
            },
            SMA_Awal: {
                eduTitle1: "Fokus Portofolio (Fase E/F)", eduList1: ["Proyek Penguatan Profil Pelajar Pancasila (Sosial)", "Relawan Panti Asuhan"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Latihan Public Speaking", "Manajemen Konflik"],
                materi: ["Sosiologi (Fase F)", "Antropologi"], layanan: ["Pelatihan kecerdasan emosional"],
                guruBk: ["Libatkan dalam program kakak asuh di sekolah"], siswa: ["Ikuti komunitas relawan di luar sekolah"]
            },
            SMA_Transisi: {
                eduTitle1: "Fokus Studi PTN (UTBK)", eduList1: ["Psikologi", "Ilmu Keperawatan/Kedokteran", "Pendidikan/Keguruan", "Sosiologi"],
                eduTitle2: "Alternatif Karier Lulusan SMA", eduList2: ["Staf Pelayanan Masyarakat", "Admin Layanan Pelanggan (CS)"],
                materi: ["Persiapan Tes Skolastik (UTBK)", "Psikologi Lanjutan"], layanan: ["Konsultasi pemilihan prodi PTN"],
                guruBk: ["Arahkan strategi SNBP/SNBT untuk prodi Pendidikan/Kesehatan"], siswa: ["Perbanyak latihan soal UTBK bidang Soshum/Saintek sesuai target"]
            },
            SMK_Awal: {
                eduTitle1: "Fokus Praktik Kejuruan", eduList1: ["Praktik Pelayanan Pasien (Kesehatan)", "Simulasi Layanan Sosial"],
                eduTitle2: "Persiapan Magang/PKL", eduList2: ["Pelatihan Komunikasi Terapeutik", "Etika Profesi Pelayanan"],
                materi: ["Komunikasi Keperawatan", "Ilmu Kesehatan Masyarakat"], layanan: ["Bimbingan kesiapan PKL"],
                guruBk: ["Siapkan mental siswa untuk melayani pasien/klien saat PKL"], siswa: ["Asah kesabaran dan senyum saat melakukan pelayanan"]
            },
            SMK_Transisi: {
                eduTitle1: "Persiapan Rekrutmen Kerja", eduList1: ["Pembuatan CV Bidang Pelayanan", "Simulasi Interview HRD/Klinik"],
                eduTitle2: "Alternatif Studi Lanjut Vokasi", eduList2: ["D3 Keperawatan", "D4 Pekerjaan Sosial", "D3 Manajemen Pelayanan"],
                materi: ["K3 (Kesehatan Keselamatan Kerja)", "Latihan Psikotes Kerja"], layanan: ["Bursa Kerja Khusus (BKK) Sekolah"],
                guruBk: ["Hubungkan siswa dengan klinik/instansi sosial mitra sekolah"], siswa: ["Siapkan portofolio atau sertifikat kompetensi (UKK) pelayananmu"]
            }
        }
    },
    C: {
        title: "Conventional", indonesianTitle: "Konvensional",
        desc: "Kamu menyukai keteraturan, bekerja dengan data, aturan yang jelas, dan aktivitas yang terstruktur.",
        karir: ["Akuntan", "Admin", "Analis Data", "Auditor"], freelance: ["Data Entry", "Pembukuan UMKM"],
        levels: {
            SD_Awal: {
                eduTitle1: "Aktivitas Dasar", eduList1: ["Menyusun balok sesuai warna", "Permainan mencocokkan bentuk"],
                eduTitle2: "Karakter Dasar", eduList2: ["Merapikan alat tulis", "Menulis di garis buku dengan rapi"],
                materi: ["Mengenal Angka", "Latihan Menulis Rapi"], layanan: ["Bimbingan ketelitian motorik halus"],
                guruBk: ["Biasakan anak membuat rutinitas jadwal harian sederhana"], siswa: ["Simpan mainan di tempatnya setelah bermain"]
            },
            SD_Akhir: {
                eduTitle1: "Ekskul Pilihan", eduList1: ["Klub Komputer Dasar", "Pramuka (Bagian Catatan)"],
                eduTitle2: "Tanggung Jawab", eduList2: ["Menjadi Bendahara Kelas", "Klub Jurnalistik Cilik"],
                materi: ["Matematika (Aritmatika)", "Pengenalan Komputer (Word)"], layanan: ["Latihan fokus dan konsentrasi"],
                guruBk: ["Beri tugas mencatat kehadiran atau uang kas kelas"], siswa: ["Mulai catat pengeluaran uang sakumu"]
            },
            SD_Transisi: {
                eduTitle1: "Target Lingkungan SMP", eduList1: ["SMP dengan fasilitas Lab Komputer memadai", "SMP berbudaya disiplin tinggi"],
                eduTitle2: "Persiapan Ekskul SMP", eduList2: ["Klub Koding Pemula", "Klub Mading Sekolah"],
                materi: ["Matematika Terapan Dasar", "Manajemen Waktu Awal"], layanan: ["Bimbingan transisi kedisiplinan"],
                guruBk: ["Ajarkan anak sistem pengarsipan tugas mandiri untuk SMP"], siswa: ["Beli buku catatan terpisah untuk setiap mata pelajaran SMP nanti"]
            },
            SMP_Awal: {
                eduTitle1: "Pengembangan Diri", eduList1: ["Sekretaris/Bendahara OSIS", "Klub TIK (Teknologi Informasi)"],
                eduTitle2: "Eksplorasi Keterampilan", eduList2: ["Latihan Menggunakan Excel/Spreadsheet", "Pengorganisasian Data Kelas"],
                materi: ["Matematika Aljabar Dasar", "TIK (Pengolah Angka)"], layanan: ["Pelatihan administrasi dasar remaja"],
                guruBk: ["Latih siswa membuat proposal atau laporan kegiatan kecil"], siswa: ["Rapikan catatan belajarmu dengan stabilo dan indeks"]
            },
            SMP_Transisi: {
                eduTitle1: "Pilihan Jurusan SMA", eduList1: ["IPS (Fokus Ekonomi/Akuntansi)", "MIPA (Fokus Logika Matematika)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Akuntansi & Keuangan Lembaga", "Manajemen Perkantoran (OTKP)", "Perbankan"],
                materi: ["Ekonomi Dasar", "Pengantar Akuntansi"], layanan: ["Konsultasi karir bidang data/keuangan"],
                guruBk: ["Arahkan siswa melihat potensi karir di dunia perbankan/perkantoran"], siswa: ["Eksplorasi minatmu, apakah lebih suka mengelola uang (Akuntansi) atau data (Admin)"]
            },
            SMA_Awal: {
                eduTitle1: "Fokus Portofolio (Fase E/F)", eduList1: ["Kepanitiaan Seksi Kesekretariatan", "Proyek Analisis Data (Survei Sekolah)"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Sertifikasi Microsoft Office Specialist", "Kursus Pembukuan"],
                materi: ["Ekonomi (Akuntansi Fase F)", "Statistika Dasar"], layanan: ["Pendampingan manajemen proyek sekolah"],
                guruBk: ["Bimbing siswa agar teliti mengurus dokumen pendaftaran/beasiswa"], siswa: ["Perdalam rumus Excel tingkat lanjut (VLOOKUP, Pivot)"]
            },
            SMA_Transisi: {
                eduTitle1: "Fokus Studi PTN (UTBK)", eduList1: ["Akuntansi / Ilmu Ekonomi", "Administrasi Bisnis/Negara", "Statistika", "Aktuaria"],
                eduTitle2: "Alternatif Karier Lulusan SMA", eduList2: ["Staf Administrasi Entry-Level", "Data Entry Clerk"],
                materi: ["Persiapan Penalaran Matematika (UTBK)", "Matematika Keuangan"], layanan: ["Tryout intensif penalaran kuantitatif"],
                guruBk: ["Bantu susun strategi rasional memilih prodi berdasarkan keketatan data"], siswa: ["Latih kecepatan dan ketelitian menjawab soal matematika dasar UTBK"]
            },
            SMK_Awal: {
                eduTitle1: "Fokus Praktik Kejuruan", eduList1: ["Praktik Jurnal Akuntansi", "Simulasi Manajemen Arsip Kantor"],
                eduTitle2: "Persiapan Magang/PKL", eduList2: ["Penguasaan Software MYOB/Accurate", "Keterampilan Mengetik Cepat (10 Jari)"],
                materi: ["Praktikum Akuntansi Perusahaan", "Administrasi Pajak"], layanan: ["Sertifikasi kompetensi TIK/Akuntansi"],
                guruBk: ["Persiapkan kedisiplinan dan kerapian penampilan standar kantor untuk PKL"], siswa: ["Pastikan pencatatan praktik kejuruanmu seimbang (balance) tanpa error"]
            },
            SMK_Transisi: {
                eduTitle1: "Persiapan Rekrutmen Kerja", eduList1: ["Simulasi Uji Kompetensi Keahlian (UKK) Akuntansi", "Pembuatan CV Rapih & Terstruktur"],
                eduTitle2: "Alternatif Studi Lanjut Vokasi", eduList2: ["D3 Akuntansi", "D4 Administrasi Pemerintahan", "D3 Perpajakan"],
                materi: ["Etika Kerja Perkantoran", "Persiapan Tes Potensi Akademik Kerja"], layanan: ["Latihan tes koran/Pauli Kraepelin (Ketelitian)"],
                guruBk: ["Simulasikan tes ketelitian dan kecepatan kerja administratif untuk rekrutmen perusahaan"], siswa: ["Siapkan sertifikat UKK dan hasil ketikan/pembukuanmu sebagai bukti di wawancara kerja"]
            }
        }
    },
    I: {
        title: "Investigative", indonesianTitle: "Investigatif",
        desc: "Kamu memiliki rasa ingin tahu tinggi, suka menganalisis, observasi, dan berfokus pada sains.",
        karir: ["Ilmuwan", "Programmer", "Dokter", "Peneliti"], freelance: ["Tutor Sains", "Analis Lepas"],
        levels: {
            SD_Awal: {
                eduTitle1: "Eksplorasi Alam", eduList1: ["Bermain puzzle", "Membaca ensiklopedia anak"],
                eduTitle2: "Karakter", eduList2: ["Bertanya tentang cara kerja benda", "Eksperimen warna sederhana"],
                materi: ["Sains Dasar", "Matematika Logika"], layanan: ["Bimbingan rasa ingin tahu"],
                guruBk: ["Fasilitasi pertanyaan anak dengan jawaban logis"], siswa: ["Rajin membaca buku pengetahuan"]
            },
            SD_Akhir: {
                eduTitle1: "Ekskul", eduList1: ["Klub Sains", "Klub Robotik Dasar"],
                eduTitle2: "Lomba", eduList2: ["Olimpiade Matematika/Sains SD", "Catur"],
                materi: ["Ilmu Pengetahuan Alam (IPA)", "Logika Dasar"], layanan: ["Fasilitas lab mini sekolah"],
                guruBk: ["Berikan tantangan berupa teka-teki logika"], siswa: ["Lakukan eksperimen sains sederhana di rumah"]
            },
            SD_Transisi: {
                eduTitle1: "Target SMP", eduList1: ["SMP Kelas Unggulan / Akselerasi", "SMP Fokus Olimpiade"],
                eduTitle2: "Persiapan", eduList2: ["Karya Ilmiah Remaja (KIR) Dasar", "Pengenalan Komputer"],
                materi: ["Metode Ilmiah Pemula", "Matematika Terapan"], layanan: ["Bimbingan transisi peminatan sains"],
                guruBk: ["Kenalkan informasi ajang kompetisi sains SMP"], siswa: ["Mulai berlatih memecahkan soal logika yang lebih rumit"]
            },
            SMP_Awal: {
                eduTitle1: "Pengembangan Diri", eduList1: ["Ikut Karya Ilmiah Remaja (KIR)", "Klub Coding Pemula"],
                eduTitle2: "Eksplorasi", eduList2: ["Eksperimen Biologi/Fisika", "Analisis Data Lingkungan Sekolah"],
                materi: ["Fisika Terapan Dasar", "Algoritma Pemrograman Dasar"], layanan: ["Konsultasi bimbingan olimpiade"],
                guruBk: ["Arahkan anak berpotensi ke ajang OSN tingkat SMP"], siswa: ["Pelajari dasar-dasar pemrograman atau coding"]
            },
            SMP_Transisi: {
                eduTitle1: "Pilihan Jurusan SMA", eduList1: ["MIPA (Fokus Sains dan Matematika Terpadu)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Rekayasa Perangkat Lunak (RPL)", "Farmasi", "Analis Kimia"],
                materi: ["Sains Terpadu Lanjutan", "Pengantar Teknologi Informasi"], layanan: ["Tes penjurusan eksakta"],
                guruBk: ["Diskusikan perbedaan antara bekerja di lab (Sains murni) dan IT"], siswa: ["Pikirkan apakah kamu lebih suka meneliti alam/obat atau membuat program komputer"]
            },
            SMA_Awal: {
                eduTitle1: "Fokus Portofolio (Fase E/F)", eduList1: ["Proyek Riset Independen", "Olimpiade Sains (OSN/KSN)"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Pelatihan Bahasa Pemrograman (Python/Java)", "Penulisan Jurnal Ilmiah"],
                materi: ["Matematika Lanjut (Fase F)", "Fisika/Kimia Lanjut"], layanan: ["Bimbingan penyusunan Karya Tulis Ilmiah"],
                guruBk: ["Bantu siswa mencari mentor untuk riset tingkat nasional"], siswa: ["Ikuti perlombaan inovasi teknologi antarsekolah"]
            },
            SMA_Transisi: {
                eduTitle1: "Fokus Studi PTN (UTBK)", eduList1: ["Ilmu Komputer/Informatika", "Kedokteran", "Sains Data", "Matematika/Fisika Murni"],
                eduTitle2: "Alternatif Karier Lulusan SMA", eduList2: ["Asisten Laboratorium Sekolah", "Staf IT Support Junior"],
                materi: ["Persiapan TPS Penalaran Umum", "Soal Saintek Lanjutan"], layanan: ["Tryout Saintek/Logika Terpusat"],
                guruBk: ["Arahkan siswa mencari beasiswa khusus program sains dan teknologi"], siswa: ["Fokus berlatih pada soal-soal HOTS bidang Saintek dan Penalaran Umum"]
            },
            SMK_Awal: {
                eduTitle1: "Fokus Praktik Kejuruan", eduList1: ["Praktikum Kimia Analisis", "Coding Website/Aplikasi"],
                eduTitle2: "Persiapan Magang/PKL", eduList2: ["Pengolahan Data Medis/Pasien", "Maintenance Software & Jaringan"],
                materi: ["Pemrograman Berorientasi Objek", "Kimia Terapan"], layanan: ["Fasilitas Lab/Komputer Khusus dengan spesifikasi tinggi"],
                guruBk: ["Bantu carikan tempat magang (PKL) di industri teknologi atau laboratorium kesehatan"], siswa: ["Mulai bangun portofolio *source code* milikmu di platform GitHub"]
            },
            SMK_Transisi: {
                eduTitle1: "Persiapan Rekrutmen Kerja", eduList1: ["Pembuatan CV untuk Junior Programmer", "Posisi Teknisi Laboratorium Pemula"],
                eduTitle2: "Alternatif Studi Lanjut Vokasi", eduList2: ["D3/D4 Teknik Informatika", "D3 Farmasi Analis"],
                materi: ["Persiapan UKK Programming/Lab", "Logika Tes Kerja (Psikotes)"], layanan: ["Bursa Kerja Perusahaan IT/Kesehatan"],
                guruBk: ["Siapkan mental siswa untuk mengikuti ujian sertifikasi keahlian dari vendor (contoh: Cisco, Mikrotik)"], siswa: ["Tunjukkan aplikasi buatanmu atau hasil risetmu saat menjalani wawancara kerja"]
            }
        }
    },
    R: {
        title: "Realistic", indonesianTitle: "Realistis",
        desc: "Kamu menyukai kerja fisik, peralatan, mesin, atau bekerja di luar ruangan.",
        karir: ["Insinyur", "Mekanik", "TNI/Polisi", "Koki", "Atlet"], freelance: ["Jasa perbaikan", "Instruktur Olahraga"],
        levels: {
            SD_Awal: {
                eduTitle1: "Aktivitas Dasar", eduList1: ["Bermain menyusun balok kayu", "Olahraga ringan / Senam"],
                eduTitle2: "Karakter", eduList2: ["Eksplorasi taman bermain", "Berkebun sederhana"],
                materi: ["Pendidikan Jasmani", "Prakarya Melipat (Origami)"], layanan: ["Fasilitas arena outbound mini"],
                guruBk: ["Berikan ruang gerak yang luas dan aman untuk anak"], siswa: ["Mainlah di luar ruangan untuk melatih fisikmu"]
            },
            SD_Akhir: {
                eduTitle1: "Ekskul Pilihan", eduList1: ["Sepakbola/Bulu tangkis", "Pramuka (Fokus Tali Temali/Sandi)"],
                eduTitle2: "Lomba", eduList2: ["Lomba Lari Remaja", "Lomba Keterampilan Tangan"],
                materi: ["Prakarya Dasar", "Pendidikan Olahraga Terpadu"], layanan: ["Bimbingan fisik motorik kasar"],
                guruBk: ["Arahkan energi fisik anak yang besar ke bidang olahraga berprestasi"], siswa: ["Cobalah bantu orang tua untuk memperbaiki barang ringan di rumah"]
            },
            SD_Transisi: {
                eduTitle1: "Target Lingkungan SMP", eduList1: ["SMP Fokus Olahraga (Kelas KKO)", "SMP dengan Sarana Prakarya/Keterampilan Lengkap"],
                eduTitle2: "Persiapan Ekskul SMP", eduList2: ["Klub Mekanik Cilik", "Bela Diri (Pencak Silat/Karate)"],
                materi: ["Pengenalan Alat & Mesin Dasar", "Kesehatan Fisik dan Gizi"], layanan: ["Orientasi ekstrakurikuler lapangan SMP"],
                guruBk: ["Kenalkan macam-macam ekskul fisik yang ada di tingkat SMP"], siswa: ["Jaga kebugaran tubuhmu untuk mengikuti seleksi ekskul olahraga di SMP"]
            },
            SMP_Awal: {
                eduTitle1: "Pengembangan Diri", eduList1: ["Bergabung dengan Pecinta Alam", "Tim Inti Olahraga Sekolah"],
                eduTitle2: "Eksplorasi Keterampilan", eduList2: ["Prakarya Kelistrikan Dasar", "Kerajinan dari Kayu/Bambu"],
                materi: ["Prakarya Budi Daya", "Fisika Mekanika Dasar"], layanan: ["Pembinaan khusus untuk atlet sekolah"],
                guruBk: ["Pantau asupan gizi dan jadwal latihan fisik siswa yang berprestasi"], siswa: ["Rutin berolahraga setiap sore untuk menjaga stamina tubuh"]
            },
            SMP_Transisi: {
                eduTitle1: "Pilihan Jurusan SMA", eduList1: ["MIPA (Fokus Ilmu Fisika Terapan)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Teknik Kendaraan Ringan (Otomotif)", "Teknik Pemesinan", "Tata Boga"],
                materi: ["Bimbingan Penjurusan Teknik/Fisik", "Kesehatan Jasmani Menengah"], layanan: ["Tes minat bakat teknikal/mekanikal"],
                guruBk: ["Diskusikan dengan orang tua terkait prospek sekolah kedinasan (militer) atau SMK Teknik"], siswa: ["Mantapkan pilihanmu: Apakah ingin belajar teori sains di SMA atau langsung praktik menggunakan alat berat di SMK?"]
            },
            SMA_Awal: {
                eduTitle1: "Fokus Portofolio (Fase E/F)", eduList1: ["Kejuaraan Olahraga Tingkat Pelajar (O2SN)", "Proyek Rancang Bangun Fisika (Membuat Maket)"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Pelatihan P3K Lanjutan", "Sertifikasi Bela Diri Tingkat Lanjut"],
                materi: ["Geografi Lingkungan/Lapangan", "Biologi (Pemahaman Anatomi Otot)"], layanan: ["Pemantauan kebugaran fisik berkala"],
                guruBk: ["Mulai siapkan informasi dan syarat tes masuk Akademi Kepolisian/Militer (TNI/Polri)"], siswa: ["Jaga proporsi tinggi dan berat badan ideal (BMT) dari sekarang"]
            },
            SMA_Transisi: {
                eduTitle1: "Fokus Studi PTN / Kedinasan", eduList1: ["Akmil / Akpol / Sekolah Kedinasan", "Teknik Sipil / Teknik Mesin", "Ilmu Keolahragaan"],
                eduTitle2: "Alternatif Karier Lulusan SMA", eduList2: ["Atlet/Pelatih Olahraga Muda", "Mekanik Bengkel Magang"],
                materi: ["Persiapan Tes Kesamaptaan Jasmani", "Fisika Kinematika (UTBK)"], layanan: ["Tryout Gabungan Kesamaptaan & Psikologi Kedinasan"],
                guruBk: ["Fasilitasi siswa dalam persiapan kesehatan (Cek buta warna, kesehatan gigi, postur tulang)"], siswa: ["Perkuat latihan fisik seperti lari, pull-up, sit-up, dan renang secara konsisten"]
            },
            SMK_Awal: {
                eduTitle1: "Fokus Praktik Kejuruan", eduList1: ["Praktek Bengkel Mesin / Otomotif / Las", "Praktek Memasak di Dapur Restoran (Kitchen)"],
                eduTitle2: "Persiapan Magang/PKL", eduList2: ["Pemahaman K3 (Kesehatan Keselamatan Kerja) di Lingkungan Industri", "Simulasi Penggunaan Alat Berat/Mesin Perkakas"],
                materi: ["Gambar Teknik Dasar", "Pekerjaan Dasar Teknik Mesin"], layanan: ["Pelatihan Keselamatan dan Kesehatan Kerja (K3) tersertifikasi"],
                guruBk: ["Tanamkan budaya kerja industri (5R: Ringkas, Rapi, Resik, Rawat, Rajin) pada siswa"], siswa: ["Patuhi selalu standar keselamatan (seperti memakai helm dan sepatu safety) saat praktik di bengkel"]
            },
            SMK_Transisi: {
                eduTitle1: "Persiapan Rekrutmen Kerja", eduList1: ["Pembuatan CV untuk Posisi Mekanik Pemula", "Posisi Koki/Chef Pemula", "Operator Mesin Pabrik"],
                eduTitle2: "Alternatif Studi Lanjut Vokasi", eduList2: ["Politeknik Manufaktur / Teknik Mesin", "Sekolah Tinggi Pariwisata (Fokus Tata Boga)"],
                materi: ["Simulasi Uji Kompetensi Keahlian (UKK) Pengoperasian Alat", "Teknik Wawancara HRD Perusahaan Manufaktur"], layanan: ["Kerjasama pameran rekrutmen dengan industri manufaktur (BKK)"],
                guruBk: ["Bantu siswa mendaftar ke bursa kerja di kawasan industri pabrik atau jaringan perhotelan besar"], siswa: ["Pastikan skill dan ketelitian kerjamu (misal: teknik pengelasan) benar-benar siap untuk diuji saat tes kerja!"]
            }
        }
    },
    A: {
        title: "Artistic", indonesianTitle: "Artistik",
        desc: "Kamu menghargai seni, kreativitas, kebebasan berekspresi, dan pemikiran out-of-the-box.",
        karir: ["Desainer", "Seniman", "Musisi", "Penulis", "Content Creator"], freelance: ["Video Editor", "Ilustrator"],
        levels: {
            SD_Awal: {
                eduTitle1: "Aktivitas Dasar", eduList1: ["Menggambar dengan bebas", "Menyanyi lagu anak-anak"],
                eduTitle2: "Karakter", eduList2: ["Mewarnai buku bergambar", "Membentuk karya dari lilin/plastisin"],
                materi: ["Seni Rupa Tingkat Dasar", "Mengenal Ketukan Musik"], layanan: ["Ruang ekspresi bebas untuk anak"],
                guruBk: ["Sediakan tempat untuk memajang karya lukis/gambar anak di kelas"], siswa: ["Warnai gambarmu sesuka hati menggunakan imajinasimu"]
            },
            SD_Akhir: {
                eduTitle1: "Ekskul Pilihan", eduList1: ["Tari Tradisional / Modern", "Grup Paduan Suara Sekolah"],
                eduTitle2: "Lomba", eduList2: ["Lomba Menggambar / Bercerita", "Lomba Membaca Puisi Anak"],
                materi: ["Seni Budaya Terpadu", "Bahasa Indonesia (Pengantar Sastra)"], layanan: ["Bimbingan minat bakat di bidang seni"],
                guruBk: ["Ajak anak berdiskusi dan memintanya menceritakan makna di balik gambar buatannya"], siswa: ["Cobalah berlatih merangkai kata untuk menulis cerita pendek pertamamu"]
            },
            SD_Transisi: {
                eduTitle1: "Target Lingkungan SMP", eduList1: ["SMP yang Fokus pada Seni Budaya", "SMP dengan Ekskul Teater/Musik yang Kuat"],
                eduTitle2: "Persiapan Ekskul SMP", eduList2: ["Bergabung di Klub Teater Cilik", "Berlatih Mengisi Jurnalistik Dinding (Mading)"],
                materi: ["Persiapan Kumpulan Portofolio Seni Awal", "Sejarah Seni Sederhana"], layanan: ["Orientasi ragam kesenian di tingkat SMP"],
                guruBk: ["Berikan dukungan pada anak untuk tampil atau berpartisipasi dalam pementasan perpisahan SD"], siswa: ["Kumpulkan hasil gambar atau tulisan terbaikmu dalam satu map portofolio khusus"]
            },
            SMP_Awal: {
                eduTitle1: "Pengembangan Diri", eduList1: ["Membentuk Grup Band Akustik Sekolah", "Bergabung dengan Ekskul Fotografi atau Jurnalistik"],
                eduTitle2: "Eksplorasi Keterampilan", eduList2: ["Bereksperimen dengan Desain Grafis Dasar (Misal: Canva)", "Edit Video Pendek Kreatif yang Positif (Misal: Reels/TikTok Edukasi)"],
                materi: ["Seni Rupa Lanjutan Remaja", "Sastra Indonesia Lanjutan"], layanan: ["Penyediaan studio seni atau ruang musik mini sekolah"],
                guruBk: ["Fasilitasi mading sekolah secara khusus sebagai sarana publikasi karya puisi/gambar siswa"], siswa: ["Mulai eksplorasi penggunaan software atau aplikasi desain digital di komputer/HP"]
            },
            SMP_Transisi: {
                eduTitle1: "Pilihan Jurusan SMA", eduList1: ["Jurusan Bahasa & Sastra", "Jurusan IPS (Dengan fokus pada Sosiologi Seni dan Budaya)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Desain Komunikasi Visual (DKV)", "Multimedia / Animasi", "Tata Busana", "Seni Karawitan/Tari"],
                materi: ["Pengantar Seni Sinematografi Dasar", "Pemahaman Seni Terapan"], layanan: ["Konsultasi arah bakat industri kreatif"],
                guruBk: ["Diskusikan tentang peluang karir modern di era digital (seperti Content Creator, Desainer UI/UX) dengan siswa"], siswa: ["Tentukan pilihanmu: Ingin fokus memperdalam teori sastra/seni di SMA, atau langsung praktik mendesain digital/membuat busana di SMK?"]
            },
            SMA_Awal: {
                eduTitle1: "Fokus Portofolio (Fase E/F)", eduList1: ["Menjadi Sutradara atau Aktor dalam Pementasan Teater Sekolah", "Menjadi Desainer Poster Utama untuk Acara Sekolah"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Penguasaan Tool Desain Profesional (Adobe Illustrator/Photoshop)", "Teknik Penulisan Naskah Cerita (Scriptwriting)"],
                materi: ["Seni Rupa (Fase F - Tingkat Lanjut)", "Antropologi dan Budaya"], layanan: ["Fasilitasi penyelenggaraan pameran karya siswa secara rutin"],
                guruBk: ["Arahkan dan bantu siswa mendaftar kompetisi film pendek nasional atau festival musik pelajar"], siswa: ["Mulai bangun branding dan tunjukkan karyamu ke publik di platform seperti Instagram atau Behance"]
            },
            SMA_Transisi: {
                eduTitle1: "Fokus Studi PTN (SNBP/UTBK)", eduList1: ["Desain Interior / DKV", "Seni Rupa Murni / Seni Kriya", "Sastra (Sastra Inggris/Indonesia)", "Broadcasting dan Perfilman"],
                eduTitle2: "Alternatif Karier Lulusan SMA", eduList2: ["Asisten Desainer Grafis Junior", "Content Creator / Penulis Pemula"],
                materi: ["Persiapan Ujian Praktik Keterampilan Seni (Jalur Mandiri/SNBT)", "Latihan Soal Penalaran Literasi Bahasa (UTBK)"], layanan: ["Bimbingan intensif persiapan dan kurasi Portofolio Seni untuk syarat pendaftaran PTN"],
                guruBk: ["Bantu kurasi dan seleksi karya terbaik siswa agar memenuhi kriteria yang diminta oleh sistem portofolio SNPMB"], siswa: ["Persiapkan ujian praktik menggambar atau tes bakat secara fisik dengan matang (siapkan alat dan konsep)"]
            },
            SMK_Awal: {
                eduTitle1: "Fokus Praktik Kejuruan", eduList1: ["Produksi Film Animasi atau Video Pendek Bersama Tim", "Pembuatan Desain Kemasan Produk UMKM (Packaging)"],
                eduTitle2: "Persiapan Magang/PKL", eduList2: ["Latihan Operasional Kamera dan Tata Cahaya Profesional", "Eksplorasi Penggunaan Software Animasi 2D/3D (After Effects, Blender)"],
                materi: ["Dasar-Dasar Desain Komunikasi Visual (DKV)", "Tipografi dan Tata Letak (Layouting)"], layanan: ["Penyediaan fasilitas Laboratorium Mac/PC spesifikasi Multimedia yang komprehensif"],
                guruBk: ["Gunakan relasi sekolah untuk menghubungkan siswa magang dengan agensi periklanan, percetakan besar, atau stasiun TV lokal"], siswa: ["Kumpulkan semua file desain tugas sekolahmu secara rapi, karena itu akan menjadi modal utama portofolio untuk melamar magangmu"]
            },
            SMK_Transisi: {
                eduTitle1: "Persiapan Rekrutmen Kerja", eduList1: ["Pembuatan CV untuk Posisi Graphic Designer", "Posisi Video Editor", "Posisi Fotografer Produk", "Animator Junior"],
                eduTitle2: "Alternatif Studi Lanjut Vokasi", eduList2: ["Institut Seni Indonesia (ISI/IKJ)", "D4 Program Studi Animasi", "D3 Televisi dan Film"],
                materi: ["Simulasi Pitching (Cara mempresentasikan ide/karya desain kepada klien)", "Persiapan Uji Kompetensi Keahlian (UKK) DKV/Multimedia"], layanan: ["Fasilitasi penyelenggaraan Pameran Tugas Akhir Vokasi (Showcase karya di Bursa Kerja Khusus)"],
                guruBk: ["Bimbing public speaking siswa agar ia tampil profesional dan percaya diri saat mempresentasikan konsep karya seninya di hadapan HRD industri kreatif"], siswa: ["Gunakan waktu wawancara kerja sebaik-baiknya, tunjukkan hasil karyamu (video/desain) dan biarkan kualitas karyamu yang 'berbicara' membuktikan kemampuanmu!"]
            }
        }
    },
    E: {
        title: "Enterprising", indonesianTitle: "Wirausaha",
        desc: "Kamu suka memimpin, memengaruhi orang lain, negosiasi, dan berani mengambil risiko.",
        karir: ["Pengusaha", "Manajer", "Marketing", "Pengacara", "Humas (PR)"], freelance: ["Reseller", "Event Organizer"],
        levels: {
            SD_Awal: {
                eduTitle1: "Aktivitas Dasar", eduList1: ["Berani memimpin barisan di kelas", "Permainan simulasi berjualan (Toko-tokoan)"],
                eduTitle2: "Karakter", eduList2: ["Menunjukkan keberanian tampil di depan kelas", "Berani mengacungkan tangan untuk menjawab"],
                materi: ["PPKn (Pendidikan Pancasila) Tingkat Dasar", "Latihan Bercerita (Sebagai pengantar Public Speaking)"], layanan: ["Pendampingan dan latihan untuk meningkatkan rasa percaya diri anak"],
                guruBk: ["Seringlah memanggil anak ini untuk maju ke depan kelas memimpin doa atau membaca cerita"], siswa: ["Beranikan dirimu untuk bertanya dan berpendapat di dalam kelas"]
            },
            SD_Akhir: {
                eduTitle1: "Ekskul Pilihan", eduList1: ["Pramuka (Fokus menjadi Pemimpin Regu/Pinru)", "Bergabung di Klub Debat Cilik"],
                eduTitle2: "Lomba", eduList2: ["Mengambil peran aktif di acara Market Day Sekolah", "Mencalonkan diri dalam Pemilihan Ketua Kelas"],
                materi: ["Matematika (Fokus Pengenalan Nilai Uang dan Transaksi)", "IPS (Pengenalan Ekonomi Dasar)"], layanan: ["Fasilitasi simulasi permainan kepemimpinan dan manajerial dasar"],
                guruBk: ["Berikan tanggung jawab lebih, seperti menugaskannya menjadi ketua atau koordinator dalam tugas kelompok"], siswa: ["Asah keberanianmu dengan mencoba mencalonkan diri menjadi ketua kelas semester depan"]
            },
            SD_Transisi: {
                eduTitle1: "Target Lingkungan SMP", eduList1: ["SMP dengan reputasi organisasi (OSIS) yang aktif dan kuat", "SMP yang mendukung kegiatan atau proyek kewirausahaan siswa"],
                eduTitle2: "Persiapan Ekskul SMP", eduList2: ["Mengikuti Klub Jurnalistik atau Reporter Cilik", "Lomba Pidato tingkat anak-anak (Pildacil)"],
                materi: ["Pengenalan Dasar Kepemimpinan (Leadership)", "Cara Berkomunikasi Efektif (Effective Communication)"], layanan: ["Bimbingan khusus teknik retorika, intonasi, dan dasar komunikasi massa"],
                guruBk: ["Latih anak untuk berbicara dengan artikulasi yang jelas, tempo yang tepat, dan volume suara lantang"], siswa: ["Mulai biasakan berlatih berbicara atau berpidato di depan cermin agar kamu makin percaya diri"]
            },
            SMP_Awal: {
                eduTitle1: "Pengembangan Diri", eduList1: ["Berusaha menjadi Pengurus Inti di OSIS", "Aktif dalam Kepanitiaan Acara Sekolah (Misal: Pentas Seni)"],
                eduTitle2: "Eksplorasi Keterampilan", eduList2: ["Mencoba berjualan makanan ringan / stiker di kelas", "Mengeksplorasi cara jualan online (Menjadi dropshipper/reseller skala kecil)"],
                materi: ["Ilmu Ekonomi Koperasi dan UMKM Dasar", "Bahasa Indonesia (Fokus Teknik Debat dan Diskusi Argumentatif)"], layanan: ["Latihan rutin simulasi Debat dan teknik Negosiasi bagi remaja"],
                guruBk: ["Berikan kesempatan pada siswa ini untuk menjadi perwakilan atau juru bicara saat presentasi antarkelas"], siswa: ["Gunakan momen kerja kelompok untuk terus mengasah kemampuan lobi dan negosiasimu dengan teman"]
            },
            SMP_Transisi: {
                eduTitle1: "Pilihan Jurusan SMA", eduList1: ["Jurusan IPS (Fokus pada ilmu Ekonomi Bisnis & Sosiologi)", "Jurusan Bahasa (Sebagai modal komunikasi internasional/global)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Jurusan Bisnis Daring & Pemasaran (BDP)", "Manajemen Tata Kelola Perkantoran", "Industri Pariwisata / Perhotelan"],
                materi: ["Pengantar Teori Bisnis dan Manajemen", "Penguatan Keterampilan Public Speaking"], layanan: ["Layanan konsultasi untuk memetakan bakat kepemimpinan dan prospek bisnis remaja"],
                guruBk: ["Arahkan energi siswa yang suka 'mengatur' ke hal-hal positif, seperti mengelola kas kelas atau membuat proyek wirausaha kecil"], siswa: ["Pertimbangkan masa depanmu: Ingin memperdalam teori ilmu ekonomi dan hukum (SMA) atau langsung praktik jualan dan manajemen bisnis (SMK)?"]
            },
            SMA_Awal: {
                eduTitle1: "Fokus Portofolio (Fase E/F)", eduList1: ["Menjabat sebagai Ketua Pelaksana Acara Besar Sekolah (Event Organizer Pensi)", "Mengikuti dan memenangi Lomba Debat Bahasa Indonesia/Inggris tingkat regional"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Pelatihan Dasar-dasar Digital Marketing (SEO, Social Media Ads)", "Aktif Membangun Jaringan Pertemanan Luas (Networking)"],
                materi: ["Ekonomi Bisnis (Fase F - Lanjutan)", "Sosiologi (Fokus Dinamika Kelompok dan Kepemimpinan)"], layanan: ["Penyediaan program Inkubasi Bisnis Siswa atau ekstrakurikuler Student Company di sekolah"],
                guruBk: ["Berikan dukungan, arahan, dan motivasi moril saat siswa berani mengambil risiko dalam menjalankan program kerja inovatif di OSIS"], siswa: ["Manfaatkan masa SMA untuk membangun koneksi (networking) yang baik dengan guru, teman dari beda sekolah, atau alumni yang sudah sukses"]
            },
            SMA_Transisi: {
                eduTitle1: "Fokus Studi PTN (UTBK/SNBP)", eduList1: ["Ilmu Komunikasi", "Manajemen Bisnis / Ilmu Ekonomi", "Ilmu Hukum", "Hubungan Internasional", "Pemasaran / Marketing"],
                eduTitle2: "Alternatif Karier Lulusan SMA", eduList2: ["Sales/Marketing Entry-Level", "Staf Junior Event Organizer (EO)", "Merintis Usaha Sendiri (Wirausaha Muda)"],
                materi: ["Pematangan Materi Ekonomi Makro (Untuk Persiapan UTBK)", "Latihan Intensif Tes Potensi Skolastik (Fokus Pemahaman Literasi)"], layanan: ["Pelaksanaan Tryout Gabungan Soshum dan Penalaran Literasi"],
                guruBk: ["Apabila siswa memiliki bakat debat dan analisis sosial yang sangat menonjol, arahkan minatnya pada program studi Hukum atau Hubungan Internasional"], siswa: ["Untuk menghadapi tes seleksi, perkuat dan perdalam pemahamanmu tentang logika hukum dasar serta konsep teori ekonomi makro"]
            },
            SMK_Awal: {
                eduTitle1: "Fokus Praktik Kejuruan", eduList1: ["Melakukan Simulasi Penjualan Retail maupun Online Market", "Aktif dalam Pengelolaan Unit Usaha Sekolah (Model Teaching Factory)"],
                eduTitle2: "Persiapan Magang/PKL", eduList2: ["Penyusunan Strategi Promosi Produk via Sosial Media (Instagram/TikTok)", "Pelatihan Teknik Penanganan Komplain Pelanggan (Handling Objection/Complaint)"],
                materi: ["Ilmu Marketing dan Strategi Promosi Bisnis", "Penerapan Konsep Pelayanan Prima (Service Excellence)"], layanan: ["Fasilitasi simulasi menggunakan Laboratorium Retail/Pemasaran atau Minimarket Sekolah"],
                guruBk: ["Bantu carikan atau hubungkan siswa untuk mendapatkan tempat PKL di agensi pemasaran, divisi marketing perusahaan ternama, atau bisnis retail berskala besar"], siswa: ["Pelajari teknik menulis kalimat promosi (copywriting) yang memikat agar kamu bisa membuat caption jualan atau penawaran produk yang menarik perhatian calon pembeli"]
            },
            SMK_Transisi: {
                eduTitle1: "Persiapan Rekrutmen Kerja", eduList1: ["Melamar Posisi Sales Executive / Account Executive", "Pramuniaga / SPG / SPB Counter", "Agen Telemarketing", "Admin Pengelola Sosial Media Bisnis"],
                eduTitle2: "Alternatif Studi Lanjut Vokasi", eduList2: ["D4 Program Studi Manajemen Pemasaran", "D3 Administrasi Bisnis Terapan", "D4 Manajemen Industri Konvensi dan Perhelatan (MICE / Event Organizer)"],
                materi: ["Persiapan Uji Kompetensi Keahlian (UKK) untuk Operasional Kasir/Display Barang", "Teknik Menghadapi Wawancara Khusus Posisi Sales/Penjualan"], layanan: ["Penyelenggaraan Bursa Kerja Khusus (BKK) yang difokuskan pada Mitra Industri Bidang Sales, Marketing, dan Retail"],
                guruBk: ["Berikan sesi latihan intensif (roleplay) agar siswa mampu melakukan presentasi penjualan (sales pitching) yang meyakinkan, lugas, dan menarik di hadapan HRD/Klien"], siswa: ["Tunjukkan rasa percaya diri, gestur yang positif, dan antusiasme yang tinggi (jangan terlihat gugup) saat kamu melakukan demonstrasi penjualan dalam tes wawancara kerja!"]
            }
        }
    }
};