// Lokasi file: src/lib/data/riasec.ts

export type RiasecResultItem = { code: string; raw_score: number; };
export type RiasecProfile = {
    code: string;
    primary_code?: string;    // SSOT Database
    secondary_code?: string;  // SSOT Database
    tertiary_code?: string;   // SSOT Database
    riasec_results: RiasecResultItem[];
};
export type AssessmentResult = { id: string; riasec_profiles: RiasecProfile | RiasecProfile[] | null; };

// Struktur baru yang menampung SEMUA atribut secara dinamis per fase
export type PhaseData = {
    eduTitle1: string; eduList1: string[];
    eduTitle2: string; eduList2: string[];
    materi: string[]; layanan: string[];
    guruBk: string[]; siswa: string[];
};

export type LevelData = {
    // Jenjang Umum
    SD_Awal: PhaseData;     // Kelas 1-3
    SD_Akhir: PhaseData;    // Kelas 4-5
    SD_Transisi: PhaseData; // Kelas 6
    SMP_Awal: PhaseData;    // Kelas 7-8
    SMP_Transisi: PhaseData;// Kelas 9
    SMA_Awal: PhaseData;    // Kelas 10-11
    SMA_Transisi: PhaseData;// Kelas 12
    SMK_Awal: PhaseData;    // Kelas 10-11
    SMK_Transisi: PhaseData;// Kelas 12

    // Tambahan Jenjang Madrasah (MI, MTs, MA)
    MI_Awal: PhaseData;     // Kelas 1-3 MI
    MI_Akhir: PhaseData;    // Kelas 4-5 MI
    MI_Transisi: PhaseData; // Kelas 6 MI
    MTs_Awal: PhaseData;    // Kelas 7-8 MTs
    MTs_Transisi: PhaseData;// Kelas 9 MTs
    MA_Awal: PhaseData;     // Kelas 10-11 MA
    MA_Transisi: PhaseData; // Kelas 12 MA
};

export type ProfileDetail = {
    title: string; indonesianTitle: string; desc: string;
    karir: string[]; freelance: string[];
    levels: LevelData;
};

export const dimensionDefs: Record<string, { name: string; meaning: string; behavior: string }> = {
    R: { name: "Realistic", meaning: "Menyukai aktivitas fisik, mesin, alat, dan lingkungan luar ruangan.", behavior: "Bertindak praktis dan mengutamakan aksi langsung." },
    I: { name: "Investigative", meaning: "Memiliki rasa ingin tahu yang tinggi, menyukai analisis, dan sains.", behavior: "Berpikir kritis untuk mencari akar masalah." },
    A: { name: "Artistic", meaning: "Menyukai kreativitas, seni, kebebasan berekspresi, dan inovasi.", behavior: "Berekspresi secara kreatif dan berpikir di luar kebiasaan (out-of-the-box)." },
    S: { name: "Social", meaning: "Menyukai interaksi, gemar menolong, dan membimbing orang lain.", behavior: "Mengutamakan empati dan kerja sama tim." },
    E: { name: "Enterprising", meaning: "Menyukai kepemimpinan, mampu memengaruhi orang lain, dan berani mengambil risiko.", behavior: "Memimpin, bernegosiasi, dan jeli melihat peluang." },
    C: { name: "Conventional", meaning: "Menyukai keteraturan, mengolah data, dan aktivitas yang terstruktur.", behavior: "Bekerja secara terorganisasi, teliti, dan rapi." }
};

export const riasecDictionary: Record<string, ProfileDetail> = {
    S: {
        title: "Social", indonesianTitle: "Sosial",
        desc: "Kamu gemar berinteraksi, menolong, dan membimbing orang lain. Kamu juga memiliki kepekaan yang tinggi terhadap perasaan orang di sekitarmu.",
        karir: ["Guru", "Psikolog", "Perawat", "Pekerja Sosial", "Staf HRD"], freelance: ["Tutor", "Relawan"],
        levels: {
            // -- SD --
            SD_Awal: {
                eduTitle1: "Aktivitas Bermain", eduList1: ["Bermain peran (Roleplay)", "Berbagi mainan"],
                eduTitle2: "Karakter Dasar", eduList2: ["Menyapa teman", "Mengantre dengan sabar"],
                materi: ["Pendidikan Karakter", "Pengenalan Emosi"], layanan: ["Bimbingan bermain kelompok"],
                guruBk: ["Melatih anak mengenali emosi teman", "Memberikan pujian saat anak mau berbagi"], siswa: ["Bermain dengan teman baru"]
            },
            SD_Akhir: {
                eduTitle1: "Ekskul Pilihan", eduList1: ["Pramuka Dasar", "Dokter Kecil (UKS)"],
                eduTitle2: "Tanggung Jawab", eduList2: ["Menjadi tutor teman sebaya", "Kerja bakti kelas"],
                materi: ["Pendidikan Pancasila dan Kewarganegaraan (PPKn)", "Bahasa Indonesia (Diskusi)"], layanan: ["Konseling empati dasar"],
                guruBk: ["Memberikan tugas kelompok kooperatif", "Melatih kemampuan mendengar aktif"], siswa: ["Membantu teman yang kesulitan belajar"]
            },
            SD_Transisi: {
                eduTitle1: "Target Lingkungan SMP", eduList1: ["SMP dengan budaya toleransi tinggi", "SMP berbasis komunitas/sosial"],
                eduTitle2: "Persiapan Ekskul SMP", eduList2: ["Palang Merah Remaja (PMR)", "Klub Sosial"],
                materi: ["Persiapan Adaptasi Lingkungan Baru", "Etika Pergaulan"], layanan: ["Bimbingan transisi remaja awal"],
                guruBk: ["Menyiapkan mental anak menghadapi ragam karakter di SMP"], siswa: ["Belajar beradaptasi dengan teman dari sekolah yang berbeda"]
            },
            // -- MI --
            MI_Awal: {
                eduTitle1: "Aktivitas Bermain Islami", eduList1: ["Bermain peran tokoh teladan", "Berbagi bekal dengan teman"],
                eduTitle2: "Karakter Dasar", eduList2: ["Mengucapkan salam", "Membiasakan antre dengan tertib"],
                materi: ["Akhlak Terpuji", "Pengenalan Emosi Dasar"], layanan: ["Bimbingan klasikal bermain kelompok"],
                guruBk: ["Melatih anak berempati melalui kisah Nabi", "Memberikan apresiasi saat anak mau berbagi"], siswa: ["Saling bertegur sapa dengan teman di kelas"]
            },
            MI_Akhir: {
                eduTitle1: "Ekskul Pilihan", eduList1: ["Pramuka Madrasah/SIT", "Dokter Kecil Madrasah"],
                eduTitle2: "Tanggung Jawab", eduList2: ["Membantu teman menghafal (Tutor sebaya)", "Piket kebersihan kelas/masjid"],
                materi: ["Akidah Akhlak", "Bahasa Indonesia (Diskusi Kelompok)"], layanan: ["Konseling pengembangan empati"],
                guruBk: ["Memberikan penugasan berbasis kerja sama", "Mengajarkan adab mendengarkan"], siswa: ["Membantu teman yang kesulitan belajar atau menghafal"]
            },
            MI_Transisi: {
                eduTitle1: "Target Lingkungan MTs/SMP", eduList1: ["MTs/SMP dengan lingkungan sosial yang baik", "MTs berbasis asrama/pesantren"],
                eduTitle2: "Persiapan Ekskul", eduList2: ["PMR/UKS", "Remaja Masjid (Klub Sosial)"],
                materi: ["Persiapan Adaptasi Remaja", "Etika Pergaulan Islami"], layanan: ["Bimbingan transisi remaja (Balig)"],
                guruBk: ["Menyiapkan mental siswa menghadapi keragaman karakter di jenjang berikutnya"], siswa: ["Mempersiapkan diri untuk berteman dengan orang baru dari berbagai daerah"]
            },
            // -- SMP --
            SMP_Awal: {
                eduTitle1: "Pengembangan Diri", eduList1: ["Aktif di PMR/Pramuka", "Panitia acara kelas"],
                eduTitle2: "Eksplorasi Komunitas", eduList2: ["Relawan kebersihan sekolah", "Klub duta sekolah"],
                materi: ["Sosiologi Remaja", "Kesehatan Reproduksi (Dasar)"], layanan: ["Konseling teman sebaya (Peer Counseling)"],
                guruBk: ["Menjadikan siswa sebagai mediator konflik antarteman", "Mendukung siswa bergabung di OSIS Sekbid Sosial"], siswa: ["Menjadi pendengar yang baik bagi teman"]
            },
            SMP_Transisi: {
                eduTitle1: "Pilihan Jurusan SMA/MA", eduList1: ["IPS (Fokus Sosiologi)", "MIPA (Untuk Kedokteran/Kesehatan)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Keperawatan/Kesehatan Masyarakat", "Pekerjaan Sosial"],
                materi: ["Bimbingan Karier Dasar", "Psikologi Dasar"], layanan: ["Konsultasi penjurusan peminatan"],
                guruBk: ["Membantu siswa memetakan karier di bidang kesehatan atau sosial"], siswa: ["Mencari tahu perbedaan SMA dan SMK di bidang kesehatan/sosial"]
            },
            // -- MTs --
            MTs_Awal: {
                eduTitle1: "Pengembangan Diri", eduList1: ["Aktif di PMR/Pramuka Madrasah", "Pengurus Kelas/Anggota OSIM"],
                eduTitle2: "Eksplorasi Komunitas", eduList2: ["Panitia Zakat/Kurban Madrasah", "Remaja Masjid"],
                materi: ["Fikih Sosial (Muamalah Dasar)", "Adab Pergaulan Remaja"], layanan: ["Latihan konseling teman sebaya Islami"],
                guruBk: ["Memfasilitasi siswa menjadi penengah/mediator konflik di kelas"], siswa: ["Menjadi teman cerita yang dapat dipercaya"]
            },
            MTs_Transisi: {
                eduTitle1: "Pilihan Jurusan MA/SMA", eduList1: ["IPS/Ilmu Sosial", "Keagamaan (Fokus menjadi penyuluh/guru)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Layanan Kesehatan/Keperawatan", "Pekerjaan Sosial"],
                materi: ["Bimbingan Karier & Profesi Pelayanan", "Dasar Ilmu Komunikasi"], layanan: ["Konsultasi peminatan MA/SMK"],
                guruBk: ["Membantu memetakan prospek jurusan yang banyak berinteraksi dengan masyarakat"], siswa: ["Mulai mencari tahu perbedaan belajar sosiologi di MA dengan praktik kesehatan di SMK"]
            },
            // -- SMA --
            SMA_Awal: {
                eduTitle1: "Fokus Portofolio (Fase E/F)", eduList1: ["Proyek Penguatan Profil Pelajar Pancasila (Tema Sosial)", "Relawan Panti Asuhan"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Latihan Public Speaking", "Manajemen Konflik"],
                materi: ["Sosiologi (Fase F)", "Antropologi"], layanan: ["Pelatihan kecerdasan emosional"],
                guruBk: ["Melibatkan siswa dalam program kakak asuh di sekolah"], siswa: ["Mengikuti komunitas relawan di luar sekolah"]
            },
            SMA_Transisi: {
                eduTitle1: "Fokus Studi PTN (UTBK)", eduList1: ["Psikologi", "Ilmu Keperawatan/Kedokteran", "Pendidikan/Keguruan", "Sosiologi"],
                eduTitle2: "Alternatif Karier Lulusan SMA", eduList2: ["Staf Pelayanan Masyarakat", "Admin Layanan Pelanggan (CS)"],
                materi: ["Persiapan Tes Skolastik (UTBK)", "Psikologi Lanjutan"], layanan: ["Konsultasi pemilihan program studi PTN"],
                guruBk: ["Mengarahkan strategi SNBP/SNBT untuk program studi Pendidikan/Kesehatan"], siswa: ["Memperbanyak latihan soal UTBK bidang Soshum/Saintek sesuai target"]
            },
            // -- MA --
            MA_Awal: {
                eduTitle1: "Fokus Portofolio (Fase E/F)", eduList1: ["Proyek P5 / Bakti Sosial Madrasah", "Tutor Ngaji (TPQ) untuk Adik Kelas"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Komunikasi Massa (Berdakwah/MC)", "Manajemen Resolusi Konflik"],
                materi: ["Sosiologi Lanjut", "Antropologi Agama"], layanan: ["Pelatihan kecerdasan emosi dan empati"],
                guruBk: ["Melibatkan siswa sebagai mentor/kakak asuh saat Masa Ta'aruf Siswa Madrasah (Matsama)"], siswa: ["Bergabung dengan relawan kemanusiaan atau kepemudaan di luar jam sekolah"]
            },
            MA_Transisi: {
                eduTitle1: "Fokus Studi PTN/PTKIN", eduList1: ["Psikologi Islam", "Pendidikan Guru/Agama (Tarbiyah)", "Sosiologi Agama", "Keperawatan"],
                eduTitle2: "Alternatif Karier Lulusan", eduList2: ["Staf Yayasan Sosial/Amil Zakat", "Pelayanan Pelanggan (CS)"],
                materi: ["Persiapan Penalaran Skolastik (UTBK)", "Strategi Jalur SPAN-PTKIN/SNBT"], layanan: ["Konsultasi pemilihan kampus UIN/PTN"],
                guruBk: ["Mengarahkan pemilihan program studi rumpun Ilmu Kependidikan atau Sosial-Humaniora"], siswa: ["Memperbanyak latihan soal literasi bahasa dan sosiologi untuk persiapan tes seleksi kampus"]
            },
            // -- SMK --
            SMK_Awal: {
                eduTitle1: "Fokus Praktik Kejuruan", eduList1: ["Praktik Pelayanan Pasien (Kesehatan)", "Simulasi Layanan Sosial"],
                eduTitle2: "Persiapan Magang/PKL", eduList2: ["Pelatihan Komunikasi Terapeutik", "Etika Profesi Pelayanan"],
                materi: ["Komunikasi Keperawatan", "Ilmu Kesehatan Masyarakat"], layanan: ["Bimbingan kesiapan Praktik Kerja Lapangan (PKL)"],
                guruBk: ["Menyiapkan mental siswa untuk melayani pasien/klien saat PKL"], siswa: ["Mengasah kesabaran dan keramahan saat memberikan pelayanan"]
            },
            SMK_Transisi: {
                eduTitle1: "Persiapan Rekrutmen Kerja", eduList1: ["Pembuatan CV Bidang Pelayanan", "Simulasi Wawancara HRD/Klinik"],
                eduTitle2: "Alternatif Studi Lanjut Vokasi", eduList2: ["D3 Keperawatan", "D4 Pekerjaan Sosial", "D3 Manajemen Pelayanan"],
                materi: ["Kesehatan dan Keselamatan Kerja (K3)", "Latihan Psikotes Kerja"], layanan: ["Layanan Bursa Kerja Khusus (BKK) Sekolah"],
                guruBk: ["Menghubungkan siswa dengan klinik/instansi sosial mitra sekolah"], siswa: ["Menyiapkan portofolio atau sertifikat uji kompetensi keahlian (UKK) pelayanan"]
            }
        }
    },
    C: {
        title: "Conventional", indonesianTitle: "Konvensional",
        desc: "Kamu menyukai keteraturan, bekerja dengan data, mematuhi aturan yang jelas, dan melakukan aktivitas yang terstruktur.",
        karir: ["Akuntan", "Staf Admin", "Analis Data", "Auditor"], freelance: ["Data Entry", "Pembukuan UMKM"],
        levels: {
            SD_Awal: {
                eduTitle1: "Aktivitas Dasar", eduList1: ["Menyusun balok sesuai warna", "Permainan mencocokkan bentuk"],
                eduTitle2: "Karakter Dasar", eduList2: ["Merapikan alat tulis", "Menulis di garis buku dengan rapi"],
                materi: ["Mengenal Angka", "Latihan Menulis Rapi"], layanan: ["Bimbingan ketelitian motorik halus"],
                guruBk: ["Membiasakan anak membuat rutinitas jadwal harian sederhana"], siswa: ["Menyimpan mainan di tempatnya setelah selesai bermain"]
            },
            SD_Akhir: {
                eduTitle1: "Ekskul Pilihan", eduList1: ["Klub Komputer Dasar", "Pramuka (Bagian Administrasi)"],
                eduTitle2: "Tanggung Jawab", eduList2: ["Menjadi Bendahara Kelas", "Klub Jurnalistik Cilik"],
                materi: ["Matematika (Aritmatika)", "Pengenalan Komputer (Word)"], layanan: ["Latihan fokus dan konsentrasi"],
                guruBk: ["Memberikan tugas mencatat kehadiran atau mengelola uang kas kelas"], siswa: ["Mulai mencatat pengeluaran uang saku pribadi"]
            },
            SD_Transisi: {
                eduTitle1: "Target Lingkungan SMP", eduList1: ["SMP dengan fasilitas Laboratorium Komputer memadai", "SMP berbudaya disiplin tinggi"],
                eduTitle2: "Persiapan Ekskul SMP", eduList2: ["Klub Koding Pemula", "Klub Mading Sekolah"],
                materi: ["Matematika Terapan Dasar", "Manajemen Waktu Awal"], layanan: ["Bimbingan transisi kedisiplinan"],
                guruBk: ["Mengajarkan sistem pengarsipan tugas mandiri untuk persiapan SMP"], siswa: ["Menyiapkan buku catatan terpisah untuk setiap mata pelajaran di SMP"]
            },
            MI_Awal: {
                eduTitle1: "Aktivitas Dasar", eduList1: ["Menyusun puzzle huruf Hijaiyah", "Permainan pengelompokan benda"],
                eduTitle2: "Karakter Dasar", eduList2: ["Merapikan buku Iqro/Juz Amma", "Menulis rapi pada garis buku"],
                materi: ["Mengenal Angka Dasar", "Latihan Motorik Halus (Menulis)"], layanan: ["Bimbingan kedisiplinan ringan"],
                guruBk: ["Membantu anak membuat jadwal kegiatan harian sederhana"], siswa: ["Mengembalikan buku ke rak setelah selesai dibaca"]
            },
            MI_Akhir: {
                eduTitle1: "Ekskul Pilihan", eduList1: ["Pengenalan TIK/Komputer Dasar", "Pramuka (Fokus Administrasi Regu)"],
                eduTitle2: "Tanggung Jawab", eduList2: ["Bendahara/Pencatat Infak Kelas", "Petugas Absensi Kelas"],
                materi: ["Aritmatika Dasar", "Latihan Mengetik/Menyalin Teks"], layanan: ["Latihan fokus belajar"],
                guruBk: ["Memberikan tugas pendataan ringan agar ketelitian siswa terasah"], siswa: ["Mencatat tugas-tugas dari guru agar tidak terlewat"]
            },
            MI_Transisi: {
                eduTitle1: "Target Lingkungan MTs/SMP", eduList1: ["MTs dengan kedisiplinan tinggi", "MTs dengan Laboratorium Komputer/Bahasa yang memadai"],
                eduTitle2: "Persiapan Ekskul", eduList2: ["Klub Jurnalistik/Mading", "Klub Komputer"],
                materi: ["Pengantar Matematika Lanjut", "Manajemen Waktu"], layanan: ["Konseling transisi kedisiplinan belajar"],
                guruBk: ["Mengajarkan teknik mengatur jadwal hafalan dan tugas harian secara mandiri"], siswa: ["Menyiapkan catatan pelajaran yang terpisah dan rapi untuk setiap mata pelajaran di MTs"]
            },
            SMP_Awal: {
                eduTitle1: "Pengembangan Diri", eduList1: ["Sekretaris/Bendahara OSIS", "Klub TIK (Teknologi Informasi)"],
                eduTitle2: "Eksplorasi Keterampilan", eduList2: ["Latihan Menggunakan Excel/Spreadsheet", "Pengorganisasian Data Kelas"],
                materi: ["Matematika Aljabar Dasar", "TIK (Pengolah Angka)"], layanan: ["Pelatihan administrasi dasar remaja"],
                guruBk: ["Melatih siswa membuat proposal atau laporan kegiatan berskala kecil"], siswa: ["Merapikan catatan belajar menggunakan penanda (stabilo) dan indeks"]
            },
            SMP_Transisi: {
                eduTitle1: "Pilihan Jurusan SMA", eduList1: ["IPS (Fokus Ekonomi/Akuntansi)", "MIPA (Fokus Logika Matematika)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Akuntansi & Keuangan Lembaga", "Manajemen Perkantoran (OTKP)", "Perbankan"],
                materi: ["Ekonomi Dasar", "Pengantar Akuntansi"], layanan: ["Konsultasi karier bidang data/keuangan"],
                guruBk: ["Mengarahkan siswa untuk melihat potensi karier di dunia perbankan/perkantoran"], siswa: ["Mengeksplorasi minat antara mengelola keuangan (Akuntansi) atau data (Administrasi)"]
            },
            MTs_Awal: {
                eduTitle1: "Pengembangan Diri", eduList1: ["Sekretaris/Bendahara OSIM", "Klub TIK Madrasah"],
                eduTitle2: "Eksplorasi Keterampilan", eduList2: ["Menyusun laporan/proposal kegiatan", "Manajemen kas kelas"],
                materi: ["Matematika Dasar", "TIK Pengolah Angka (Excel)"], layanan: ["Bimbingan administrasi siswa"],
                guruBk: ["Memfasilitasi siswa dalam mengurus surat-menyurat OSIM"], siswa: ["Merapikan catatan belajar dan jadwal hafalan setiap minggu"]
            },
            MTs_Transisi: {
                eduTitle1: "Pilihan Jurusan MA/SMA", eduList1: ["IPS (Fokus Akuntansi/Ekonomi)", "Keagamaan (Fokus Ilmu Faraid/Data)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Akuntansi", "Manajemen Perkantoran (OTKP)"],
                materi: ["Pengantar Ilmu Ekonomi Dasar", "Logika Matematika Dasar"], layanan: ["Konsultasi peminatan bidang manajerial"],
                guruBk: ["Mengenalkan prospek karier di lembaga keuangan syariah atau administrasi"], siswa: ["Mencari tahu perbedaan belajar akuntansi/ekonomi di MA dengan SMK"]
            },
            SMA_Awal: {
                eduTitle1: "Fokus Portofolio (Fase E/F)", eduList1: ["Kepanitiaan Seksi Kesekretariatan", "Proyek Analisis Data (Survei Sekolah)"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Sertifikasi Microsoft Office Specialist", "Kursus Pembukuan"],
                materi: ["Ekonomi (Akuntansi Fase F)", "Statistika Dasar"], layanan: ["Pendampingan manajemen proyek sekolah"],
                guruBk: ["Membimbing siswa agar teliti dalam mengurus dokumen pendaftaran/beasiswa"], siswa: ["Memperdalam rumus Excel tingkat lanjut (seperti VLOOKUP dan PivotTable)"]
            },
            SMA_Transisi: {
                eduTitle1: "Fokus Studi PTN (UTBK)", eduList1: ["Akuntansi / Ilmu Ekonomi", "Administrasi Bisnis/Negara", "Statistika", "Aktuaria"],
                eduTitle2: "Alternatif Karier Lulusan SMA", eduList2: ["Staf Administrasi Entry-Level", "Data Entry Clerk"],
                materi: ["Persiapan Penalaran Matematika (UTBK)", "Matematika Keuangan"], layanan: ["Uji coba (Tryout) intensif penalaran kuantitatif"],
                guruBk: ["Membantu menyusun strategi rasional memilih program studi berdasarkan analisis keketatan persaingan"], siswa: ["Melatih kecepatan dan ketelitian menjawab soal matematika dasar UTBK"]
            },
            MA_Awal: {
                eduTitle1: "Fokus Portofolio (Fase E/F)", eduList1: ["Tim Kesekretariatan Kegiatan Madrasah", "Pengolah Data/Survei P5"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Penguasaan MS Office Lanjut (Word/Excel)", "Sistem Pembukuan Kas"],
                materi: ["Akuntansi/Ekonomi Fase F", "Statistika Terapan Dasar"], layanan: ["Bimbingan keterampilan manajerial acara"],
                guruBk: ["Memberikan tugas pengelolaan dokumen beasiswa/KIP untuk melatih ketelitian"], siswa: ["Mempelajari cara mengolah data menggunakan rumus spreadsheet (Excel)"]
            },
            MA_Transisi: {
                eduTitle1: "Fokus Studi PTN/PTKIN", eduList1: ["Akuntansi (Umum/Syariah)", "Perbankan Syariah", "Ilmu Administrasi", "Statistika"],
                eduTitle2: "Alternatif Karier Lulusan", eduList2: ["Staf Admin Entry-Level", "Data Entry BMT/Koperasi"],
                materi: ["Penalaran Matematika (UTBK)", "Literasi Keuangan"], layanan: ["Uji coba (Tryout) kuantitatif dan penalaran matematis"],
                guruBk: ["Membantu menyusun strategi seleksi PTN berbasis analisis data peluang rasional"], siswa: ["Melatih kecepatan dan keakuratan berhitung untuk menjawab tes seleksi masuk perguruan tinggi"]
            },
            SMK_Awal: {
                eduTitle1: "Fokus Praktik Kejuruan", eduList1: ["Praktik Jurnal Akuntansi", "Simulasi Manajemen Arsip Kantor"],
                eduTitle2: "Persiapan Magang/PKL", eduList2: ["Penguasaan Perangkat Lunak MYOB/Accurate", "Keterampilan Mengetik Cepat (10 Jari)"],
                materi: ["Praktikum Akuntansi Perusahaan", "Administrasi Pajak"], layanan: ["Fasilitasi sertifikasi kompetensi TIK/Akuntansi"],
                guruBk: ["Mempersiapkan kedisiplinan dan kerapian penampilan berstandar kantor untuk PKL"], siswa: ["Memastikan pencatatan praktik kejuruan seimbang (balance) dan minim kesalahan"]
            },
            SMK_Transisi: {
                eduTitle1: "Persiapan Rekrutmen Kerja", eduList1: ["Simulasi Uji Kompetensi Keahlian (UKK) Akuntansi", "Pembuatan CV Rapih & Terstruktur"],
                eduTitle2: "Alternatif Studi Lanjut Vokasi", eduList2: ["D3 Akuntansi", "D4 Administrasi Pemerintahan", "D3 Perpajakan"],
                materi: ["Etika Kerja Perkantoran", "Persiapan Tes Potensi Akademik Dunia Kerja"], layanan: ["Latihan tes ketelitian (Koran/Pauli Kraepelin)"],
                guruBk: ["Menyimulasikan tes ketelitian dan kecepatan kerja administratif untuk rekrutmen perusahaan"], siswa: ["Menyiapkan sertifikat UKK dan hasil ketikan/pembukuan sebagai bukti kompetensi saat wawancara kerja"]
            }
        }
    },
    I: {
        title: "Investigative", indonesianTitle: "Investigatif",
        desc: "Kamu memiliki rasa ingin tahu yang tinggi, gemar melakukan observasi dan analisis, serta berfokus pada ilmu pengetahuan (sains).",
        karir: ["Ilmuwan", "Programmer", "Dokter", "Peneliti"], freelance: ["Tutor Sains", "Analis Lepas"],
        levels: {
            SD_Awal: {
                eduTitle1: "Eksplorasi Alam", eduList1: ["Bermain puzzle", "Membaca ensiklopedia anak"],
                eduTitle2: "Karakter Dasar", eduList2: ["Bertanya tentang cara kerja benda", "Melakukan eksperimen warna sederhana"],
                materi: ["Sains Dasar", "Matematika Logika"], layanan: ["Bimbingan penjelajahan rasa ingin tahu"],
                guruBk: ["Memfasilitasi pertanyaan anak dengan memberikan jawaban yang logis"], siswa: ["Rajin membaca buku pengetahuan"]
            },
            SD_Akhir: {
                eduTitle1: "Ekskul Pilihan", eduList1: ["Klub Sains", "Klub Robotik Dasar"],
                eduTitle2: "Lomba/Prestasi", eduList2: ["Olimpiade Matematika/Sains SD", "Turnamen Catur"],
                materi: ["Ilmu Pengetahuan Alam (IPA)", "Logika Dasar"], layanan: ["Penyediaan fasilitas laboratorium mini sekolah"],
                guruBk: ["Memberikan tantangan berupa teka-teki logika"], siswa: ["Melakukan eksperimen sains sederhana di rumah"]
            },
            SD_Transisi: {
                eduTitle1: "Target Lingkungan SMP", eduList1: ["SMP Kelas Unggulan / Akselerasi", "SMP Fokus Olimpiade"],
                eduTitle2: "Persiapan Ekskul SMP", eduList2: ["Karya Ilmiah Remaja (KIR) Dasar", "Pengenalan Komputer"],
                materi: ["Metode Ilmiah Pemula", "Matematika Terapan"], layanan: ["Bimbingan transisi peminatan sains"],
                guruBk: ["Mengenalkan informasi ajang kompetisi sains tingkat SMP"], siswa: ["Mulai berlatih memecahkan soal logika yang lebih kompleks"]
            },
            MI_Awal: {
                eduTitle1: "Eksplorasi Pengetahuan", eduList1: ["Melakukan eksperimen alam sederhana", "Membaca ensiklopedia kisah sains Islam"],
                eduTitle2: "Karakter Dasar", eduList2: ["Aktif bertanya 'Mengapa' dan 'Bagaimana'", "Menyelesaikan puzzle logika"],
                materi: ["Pengenalan Sains Dasar", "Matematika Logika Pemula"], layanan: ["Pendampingan pengembangan rasa ingin tahu (Inkuiri)"],
                guruBk: ["Memberikan jawaban logis dan mendorong anak untuk mencari tahu lebih dalam"], siswa: ["Memperbanyak membaca buku tentang sains alam atau luar angkasa"]
            },
            MI_Akhir: {
                eduTitle1: "Ekskul Pilihan", eduList1: ["Klub Sains/Robotik", "Klub Jurnalistik Dasar"],
                eduTitle2: "Tanggung Jawab/Prestasi", eduList2: ["Persiapan KSM (Kompetisi Sains Madrasah)", "Melakukan percobaan IPA mandiri di kelas"],
                materi: ["Ilmu Pengetahuan Alam (IPA) Dasar", "Matematika Logika"], layanan: ["Fasilitasi laboratorium mini atau eksperimen kelas"],
                guruBk: ["Memberikan tantangan teka-teki logika atau puzzle yang menantang"], siswa: ["Melakukan percobaan sains yang aman di rumah bersama orang tua"]
            },
            MI_Transisi: {
                eduTitle1: "Target Lingkungan MTs/SMP", eduList1: ["MTs dengan program kelas unggulan/Sains", "MTs yang berprestasi di MYRES/KSM"],
                eduTitle2: "Persiapan Ekskul", eduList2: ["KIR (Karya Ilmiah Remaja) Dasar", "Komputer/TIK Dasar"],
                materi: ["Metodologi Penelitian Sederhana", "Matematika Terapan Menengah"], layanan: ["Bimbingan minat dan bakat Sains"],
                guruBk: ["Mengenalkan peluang kompetisi riset atau olimpiade tingkat menengah"], siswa: ["Berlatih mengerjakan soal-soal logika dasar untuk persiapan masuk program unggulan"]
            },
            SMP_Awal: {
                eduTitle1: "Pengembangan Diri", eduList1: ["Mengikuti Karya Ilmiah Remaja (KIR)", "Klub Koding Pemula"],
                eduTitle2: "Eksplorasi Keterampilan", eduList2: ["Melakukan eksperimen Biologi/Fisika", "Menganalisis data lingkungan sekolah"],
                materi: ["Fisika Terapan Dasar", "Algoritma Pemrograman Dasar"], layanan: ["Konsultasi bimbingan olimpiade sains"],
                guruBk: ["Mengarahkan anak yang berpotensi ke ajang OSN tingkat SMP"], siswa: ["Mempelajari dasar-dasar pemrograman atau koding"]
            },
            SMP_Transisi: {
                eduTitle1: "Pilihan Jurusan SMA", eduList1: ["MIPA (Fokus Sains dan Matematika Terpadu)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Rekayasa Perangkat Lunak (RPL)", "Farmasi", "Analis Kimia"],
                materi: ["Sains Terpadu Lanjutan", "Pengantar Teknologi Informasi"], layanan: ["Tes penjurusan peminatan eksakta"],
                guruBk: ["Mendiskusikan perbedaan antara berkarier di laboratorium (Sains murni) dan bidang IT"], siswa: ["Mempertimbangkan minat antara meneliti alam/obat-obatan atau membuat program komputer"]
            },
            MTs_Awal: {
                eduTitle1: "Pengembangan Diri", eduList1: ["Klub Sains Madrasah (KIR)", "Klub Koding/TIK Dasar"],
                eduTitle2: "Eksplorasi Keterampilan", eduList2: ["Melakukan eksperimen laboratorium sederhana", "Menyusun riset data mini"],
                materi: ["Fisika/Biologi Dasar", "Algoritma Dasar"], layanan: ["Bimbingan olimpiade sains madrasah"],
                guruBk: ["Mempersiapkan dan menyeleksi siswa untuk ajang Kompetisi Sains Madrasah (KSM)"], siswa: ["Memulai belajar dasar-dasar koding (pemrograman) melalui internet"]
            },
            MTs_Transisi: {
                eduTitle1: "Pilihan Jurusan MA/SMA", eduList1: ["MIPA (Fokus Sains/Kedokteran)", "Ilmu Falak/Astronomi Islam"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["IT (Rekayasa Perangkat Lunak)", "Farmasi/Kesehatan"],
                materi: ["Sains Terpadu", "Pengantar Teknologi Terkini"], layanan: ["Tes Minat dan Bakat bidang Sains/IT"],
                guruBk: ["Membantu memetakan kemampuan spesifik: hitungan matematis, hafalan biologi, atau logika koding"], siswa: ["Merancang cita-cita masa depan: Menjadi dokter, ahli komputer, atau peneliti madrasah"]
            },
            SMA_Awal: {
                eduTitle1: "Fokus Portofolio (Fase E/F)", eduList1: ["Proyek Riset Independen", "Olimpiade Sains (OSN/KSN)"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Pelatihan Bahasa Pemrograman (Python/Java)", "Penulisan Jurnal Ilmiah"],
                materi: ["Matematika Lanjut (Fase F)", "Fisika/Kimia Lanjut"], layanan: ["Bimbingan penyusunan Karya Tulis Ilmiah"],
                guruBk: ["Membantu siswa mencari mentor untuk bimbingan riset tingkat nasional"], siswa: ["Mengikuti perlombaan inovasi teknologi antarsekolah"]
            },
            SMA_Transisi: {
                eduTitle1: "Fokus Studi PTN (UTBK)", eduList1: ["Ilmu Komputer/Informatika", "Kedokteran", "Sains Data", "Matematika/Fisika Murni"],
                eduTitle2: "Alternatif Karier Lulusan SMA", eduList2: ["Asisten Laboratorium Sekolah", "Staf IT Support Junior"],
                materi: ["Persiapan TPS Penalaran Umum", "Soal Saintek Lanjutan"], layanan: ["Uji coba (Tryout) Saintek dan Logika terpusat"],
                guruBk: ["Mengarahkan siswa untuk mencari beasiswa khusus program sains dan teknologi"], siswa: ["Berfokus berlatih mengerjakan soal-soal HOTS bidang Saintek dan Penalaran Umum"]
            },
            MA_Awal: {
                eduTitle1: "Fokus Portofolio (Fase E/F)", eduList1: ["Penulisan Karya Ilmiah Remaja (MYRES)", "Delegasi Olimpiade (KSM/OSN)"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Dasar Bahasa Pemrograman (Koding)", "Metodologi Riset Kuantitatif"],
                materi: ["Saintek Terpadu (Fase F)", "Matematika/Fisika Lanjutan"], layanan: ["Fasilitasi penggunaan laboratorium riset madrasah"],
                guruBk: ["Menyambungkan siswa dengan guru pembimbing khusus ajang MYRES/KSM tingkat nasional"], siswa: ["Membuat proyek inovasi atau riset mini yang memberikan manfaat bagi masyarakat sekitar"]
            },
            MA_Transisi: {
                eduTitle1: "Fokus Studi PTN/PTKIN", eduList1: ["Kedokteran", "Teknik Informatika (IT)", "Statistika/Sains Data", "Ilmu Sains Murni"],
                eduTitle2: "Alternatif Karier Lulusan", eduList2: ["Asisten Laboratorium", "Staf IT Support Entry-Level"],
                materi: ["Penalaran Kognitif & Saintek (UTBK)", "Analisis Jurnal Riset Dasar"], layanan: ["Uji coba (Tryout) Intensif Penalaran Saintek/TPS"],
                guruBk: ["Mengarahkan penelusuran Beasiswa Indonesia Maju (BIM) atau program prestasi riset"], siswa: ["Berfokus pada pemecahan soal-soal HOTS (High Order Thinking Skills)"]
            },
            SMK_Awal: {
                eduTitle1: "Fokus Praktik Kejuruan", eduList1: ["Praktikum Kimia Analisis", "Koding Website/Aplikasi"],
                eduTitle2: "Persiapan Magang/PKL", eduList2: ["Pengolahan Data Medis/Pasien", "Pemeliharaan Perangkat Lunak & Jaringan"],
                materi: ["Pemrograman Berorientasi Objek", "Kimia Terapan"], layanan: ["Fasilitasi Laboratorium/Komputer dengan spesifikasi tinggi"],
                guruBk: ["Membantu mencarikan tempat magang (PKL) di industri teknologi atau laboratorium kesehatan"], siswa: ["Mulai membangun portofolio kode sumber (source code) di platform seperti GitHub"]
            },
            SMK_Transisi: {
                eduTitle1: "Persiapan Rekrutmen Kerja", eduList1: ["Pembuatan CV untuk Junior Programmer", "Persiapan wawancara posisi Teknisi Laboratorium Pemula"],
                eduTitle2: "Alternatif Studi Lanjut Vokasi", eduList2: ["D3/D4 Teknik Informatika", "D3 Farmasi Analis"],
                materi: ["Persiapan UKK Programming/Laboratorium", "Logika Tes Kerja (Psikotes)"], layanan: ["Penyediaan informasi Bursa Kerja Perusahaan IT/Kesehatan"],
                guruBk: ["Menyiapkan mental siswa untuk mengikuti ujian sertifikasi keahlian dari vendor (seperti Cisco atau Mikrotik)"], siswa: ["Menunjukkan aplikasi buatan sendiri atau hasil riset saat menjalani sesi wawancara kerja"]
            }
        }
    },
    R: {
        title: "Realistic", indonesianTitle: "Realistis",
        desc: "Kamu menyukai kerja fisik, terampil menggunakan peralatan atau mesin, dan lebih suka bekerja di luar ruangan (lapangan).",
        karir: ["Insinyur", "Mekanik", "TNI/Polisi", "Koki", "Atlet"], freelance: ["Jasa perbaikan", "Instruktur Olahraga"],
        levels: {
            SD_Awal: {
                eduTitle1: "Aktivitas Dasar", eduList1: ["Bermain menyusun balok kayu", "Berolahraga ringan / senam"],
                eduTitle2: "Karakter Dasar", eduList2: ["Mengeksplorasi taman bermain", "Berkebun secara sederhana"],
                materi: ["Pendidikan Jasmani", "Prakarya Melipat (Origami)"], layanan: ["Penyediaan fasilitas arena outbound mini"],
                guruBk: ["Memberikan ruang gerak yang luas dan aman untuk anak beraktivitas"], siswa: ["Bermain di luar ruangan untuk melatih fisik dan motorik"]
            },
            SD_Akhir: {
                eduTitle1: "Ekskul Pilihan", eduList1: ["Sepakbola/Bulu tangkis", "Pramuka (Fokus Tali-temali dan Sandi)"],
                eduTitle2: "Lomba/Prestasi", eduList2: ["Lomba Lari Remaja", "Lomba Keterampilan Tangan"],
                materi: ["Prakarya Dasar", "Pendidikan Olahraga Terpadu"], layanan: ["Bimbingan pengembangan fisik dan motorik kasar"],
                guruBk: ["Mengarahkan energi fisik anak yang besar ke bidang keolahragaan untuk meraih prestasi"], siswa: ["Mencoba membantu orang tua memperbaiki barang-barang ringan di rumah"]
            },
            SD_Transisi: {
                eduTitle1: "Target Lingkungan SMP", eduList1: ["SMP Fokus Olahraga (Kelas Khusus Olahraga/KKO)", "SMP dengan Sarana Prakarya/Keterampilan Lengkap"],
                eduTitle2: "Persiapan Ekskul SMP", eduList2: ["Klub Mekanik Cilik", "Bela Diri (Pencak Silat/Karate)"],
                materi: ["Pengenalan Alat & Mesin Dasar", "Kesehatan Fisik dan Gizi"], layanan: ["Orientasi ragam ekstrakurikuler lapangan di SMP"],
                guruBk: ["Mengenalkan macam-macam kegiatan ekskul fisik yang tersedia di tingkat SMP"], siswa: ["Menjaga kebugaran tubuh untuk mengikuti seleksi ekskul olahraga di SMP"]
            },
            MI_Awal: {
                eduTitle1: "Aktivitas Fisik Dasar", eduList1: ["Berolahraga ringan / senam sehat", "Bermain balok kayu/lego"],
                eduTitle2: "Karakter Dasar", eduList2: ["Berkebun di halaman madrasah", "Membantu membersihkan tempat salat"],
                materi: ["Pendidikan Jasmani & Kesehatan", "Prakarya Dasar"], layanan: ["Penyediaan fasilitas lapangan bermain yang aman"],
                guruBk: ["Memastikan energi fisik anak tersalurkan dengan baik dan aman pada jam istirahat"], siswa: ["Aktif bergerak dan bermain di luar kelas bersama teman-teman"]
            },
            MI_Akhir: {
                eduTitle1: "Ekskul Pilihan", eduList1: ["Pramuka Siaga/Penggalang (Prakarya)", "Olahraga (Futsal, Bulu tangkis)"],
                eduTitle2: "Tanggung Jawab/Prestasi", eduList2: ["Mengikuti Lomba Olahraga Antar-MI (PORSENI)", "Merakit kerajinan tangan untuk tugas kelas"],
                materi: ["Keterampilan Motorik Kasar", "Kerajinan Tangan (Prakarya)"], layanan: ["Pembinaan ekstrakurikuler keolahragaan"],
                guruBk: ["Memantau asupan gizi anak dan mendukung partisipasinya dalam ajang olahraga PORSENI"], siswa: ["Membantu orang tua mengerjakan tugas-tugas fisik ringan di rumah"]
            },
            MI_Transisi: {
                eduTitle1: "Target Lingkungan MTs/SMP", eduList1: ["MTs dengan fasilitas olahraga yang memadai", "SMP Kelas Khusus Olahraga (KKO)"],
                eduTitle2: "Persiapan Ekskul", eduList2: ["Bela Diri (Pencak Silat/Tapak Suci)", "Pramuka Inti (Tali-temali)"],
                materi: ["Kesehatan & Kebugaran Jasmani Dasar", "Pengenalan Alat Perkakas"], layanan: ["Bimbingan pemilihan ekstrakurikuler lapangan"],
                guruBk: ["Mengenalkan ragam kegiatan fisik dan keolahragaan di jenjang pendidikan menengah"], siswa: ["Mulai merutinkan olahraga sore untuk mempersiapkan stamina masuk ekskul bela diri"]
            },
            SMP_Awal: {
                eduTitle1: "Pengembangan Diri", eduList1: ["Bergabung dengan kelompok Pencinta Alam", "Masuk dalam Tim Inti Olahraga Sekolah"],
                eduTitle2: "Eksplorasi Keterampilan", eduList2: ["Prakarya Kelistrikan Dasar", "Membuat kerajinan dari kayu atau bambu"],
                materi: ["Prakarya Budi Daya", "Fisika Mekanika Dasar"], layanan: ["Pembinaan khusus untuk atlet sekolah"],
                guruBk: ["Memantau asupan gizi dan jadwal latihan fisik bagi siswa yang berprestasi di bidang olahraga"], siswa: ["Rutin berolahraga setiap sore untuk menjaga stamina tubuh"]
            },
            SMP_Transisi: {
                eduTitle1: "Pilihan Jurusan SMA", eduList1: ["MIPA (Fokus Ilmu Fisika Terapan)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Teknik Kendaraan Ringan (Otomotif)", "Teknik Pemesinan", "Tata Boga"],
                materi: ["Bimbingan Penjurusan Teknik/Fisik", "Kesehatan Jasmani Menengah"], layanan: ["Tes minat dan bakat bidang teknikal/mekanikal"],
                guruBk: ["Mendiskusikan prospek sekolah kedinasan (militer) atau SMK Teknik bersama siswa dan orang tua"], siswa: ["Memantapkan pilihan antara mempelajari teori sains di SMA atau praktik menggunakan alat di SMK"]
            },
            MTs_Awal: {
                eduTitle1: "Pengembangan Diri", eduList1: ["Bergabung di Tim Inti Olahraga Madrasah", "Mengikuti Pencak Silat/Pagar Nusa/Tapak Suci"],
                eduTitle2: "Eksplorasi Keterampilan", eduList2: ["Prakarya/Kerajinan Tangan", "Pramuka Penggalang (Teknik Kepramukaan)"],
                materi: ["Pendidikan Jasmani", "Prakarya Rekayasa Dasar"], layanan: ["Pembinaan khusus kontingen atlet PORSENI"],
                guruBk: ["Memantau keseimbangan antara perkembangan fisik dan prestasi akademik para siswa atlet"], siswa: ["Menjaga kebugaran dengan melakukan olahraga rutin setiap sore"]
            },
            MTs_Transisi: {
                eduTitle1: "Pilihan Jurusan MA/SMA", eduList1: ["MIPA (Fokus Ilmu Terapan)", "MA Keterampilan (Tata Busana/Elektronika)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Teknik Otomotif/Mesin", "Tata Boga/Kelistrikan"],
                materi: ["Konseling Pemilihan Sekolah Vokasi", "Kesehatan Fisik Calon Atlet"], layanan: ["Tes kecerdasan mekanikal dasar"],
                guruBk: ["Menjelaskan secara mendalam perbedaan antara MA reguler, MA Plus Keterampilan, dan SMK Teknik"], siswa: ["Memutuskan target karier masa depan: sekolah militer, menjadi atlet, atau ahli mekanik"]
            },
            SMA_Awal: {
                eduTitle1: "Fokus Portofolio (Fase E/F)", eduList1: ["Mengikuti Kejuaraan Olahraga Tingkat Pelajar (O2SN)", "Mengerjakan Proyek Rancang Bangun Fisika (Membuat Maket)"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Pelatihan Pertolongan Pertama (P3K) Lanjutan", "Sertifikasi Bela Diri Tingkat Lanjut"],
                materi: ["Geografi Lingkungan/Lapangan", "Biologi (Pemahaman Anatomi Otot)"], layanan: ["Pemantauan kebugaran fisik secara berkala"],
                guruBk: ["Mulai menyiapkan informasi dan persyaratan tes masuk Akademi Kepolisian/Militer (TNI/Polri)"], siswa: ["Menjaga proporsi tinggi dan berat badan ideal mulai dari sekarang"]
            },
            SMA_Transisi: {
                eduTitle1: "Fokus Studi PTN / Kedinasan", eduList1: ["Akmil / Akpol / Sekolah Kedinasan", "Teknik Sipil / Teknik Mesin", "Ilmu Keolahragaan"],
                eduTitle2: "Alternatif Karier Lulusan SMA", eduList2: ["Atlet/Pelatih Olahraga Muda", "Mekanik Bengkel Magang"],
                materi: ["Persiapan Tes Kesamaptaan Jasmani", "Fisika Kinematika (UTBK)"], layanan: ["Uji coba (Tryout) Gabungan Kesamaptaan & Psikologi Kedinasan"],
                guruBk: ["Memfasilitasi siswa dalam persiapan tes kesehatan (cek buta warna, kesehatan gigi, dan postur tulang)"], siswa: ["Memperkuat latihan fisik seperti lari, pull-up, sit-up, dan renang secara konsisten"]
            },
            MA_Awal: {
                eduTitle1: "Fokus Portofolio (Fase E/F)", eduList1: ["Meraih Sertifikasi Sabuk/Tingkat Bela Diri", "Mengikuti Kejuaraan Olahraga PORSENI/AKSIOMA"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Kecakapan Bertahan Hidup (Survival Alam)", "Pelatihan Pertolongan Pertama Palang Merah Remaja (PMR)"],
                materi: ["Fisika Mekanika Lanjut", "Geografi Lapangan"], layanan: ["Pengecekan fisik dasar (TB/BB, mata, gigi) secara berkala"],
                guruBk: ["Mengidentifikasi sejak dini siswa yang memiliki minat kuat pada sekolah ikatan dinas (Militer/Polisi)"], siswa: ["Memastikan postur, tinggi badan, dan kesehatan mata terjaga dengan baik"]
            },
            MA_Transisi: {
                eduTitle1: "Fokus Studi PTN/Kedinasan", eduList1: ["Akmil/Akpol (TNI/Polri)", "Ilmu Keolahragaan (FIK)", "Teknik Sipil/Mesin"],
                eduTitle2: "Alternatif Karier Lulusan", eduList2: ["Pelatih/Wasit Olahraga Pemula", "Mekanik/Perakit Pemula"],
                materi: ["Latihan Kesamaptaan Jasmani", "Tes Psikologi TNI/Polri Dasar"], layanan: ["Fasilitasi simulasi tes fisik kesamaptaan"],
                guruBk: ["Memastikan persiapan administrasi dan fisik siswa untuk tes kedinasan dilakukan jauh-jauh hari"], siswa: ["Rutin berlatih lari pagi, pull-up, push-up, dan mengecek kesehatan gigi secara mandiri"]
            },
            SMK_Awal: {
                eduTitle1: "Fokus Praktik Kejuruan", eduList1: ["Praktik Bengkel Mesin, Otomotif, atau Las", "Praktik Memasak di Dapur Restoran (Kitchen)"],
                eduTitle2: "Persiapan Magang/PKL", eduList2: ["Pemahaman K3 (Kesehatan dan Keselamatan Kerja) Industri", "Simulasi Penggunaan Alat Berat/Mesin Perkakas"],
                materi: ["Gambar Teknik Dasar", "Pekerjaan Dasar Teknik Mesin"], layanan: ["Pelatihan Keselamatan dan Kesehatan Kerja (K3) tersertifikasi"],
                guruBk: ["Menanamkan budaya kerja industri (5R: Ringkas, Rapi, Resik, Rawat, Rajin) kepada para siswa"], siswa: ["Mematuhi standar keselamatan, seperti selalu memakai helm dan sepatu keamanan (safety shoes) saat praktik"]
            },
            SMK_Transisi: {
                eduTitle1: "Persiapan Rekrutmen Kerja", eduList1: ["Pembuatan CV untuk Posisi Mekanik Pemula", "Persiapan lamaran Posisi Koki/Chef Pemula", "Operator Mesin Pabrik"],
                eduTitle2: "Alternatif Studi Lanjut Vokasi", eduList2: ["Politeknik Manufaktur / Teknik Mesin", "Sekolah Tinggi Pariwisata (Fokus Tata Boga)"],
                materi: ["Simulasi Uji Kompetensi Keahlian (UKK) Pengoperasian Alat", "Teknik Wawancara HRD Perusahaan Manufaktur"], layanan: ["Kerja sama pameran rekrutmen dengan industri manufaktur (BKK)"],
                guruBk: ["Membantu siswa mendaftar ke bursa kerja di kawasan industri pabrik atau jaringan perhotelan besar"], siswa: ["Memastikan keterampilan dan ketelitian kerja (seperti teknik pengelasan) benar-benar siap untuk diuji"]
            }
        }
    },
    A: {
        title: "Artistic", indonesianTitle: "Artistik",
        desc: "Kamu sangat menghargai keindahan seni, mengutamakan kreativitas, menyukai kebebasan berekspresi, dan memiliki pemikiran yang out-of-the-box.",
        karir: ["Desainer", "Seniman", "Musisi", "Penulis", "Content Creator"], freelance: ["Video Editor", "Ilustrator"],
        levels: {
            SD_Awal: {
                eduTitle1: "Aktivitas Dasar", eduList1: ["Menggambar secara bebas", "Menyanyikan lagu anak-anak"],
                eduTitle2: "Karakter Dasar", eduList2: ["Mewarnai buku bergambar", "Membentuk karya dari lilin/plastisin"],
                materi: ["Seni Rupa Tingkat Dasar", "Mengenal Ketukan Musik Dasar"], layanan: ["Penyediaan ruang ekspresi bebas untuk anak"],
                guruBk: ["Menyediakan tempat khusus untuk memajang karya lukis atau gambar anak di kelas"], siswa: ["Mewarnai gambar dengan bebas menggunakan imajinasi"]
            },
            SD_Akhir: {
                eduTitle1: "Ekskul Pilihan", eduList1: ["Tari Tradisional / Modern", "Grup Paduan Suara Sekolah"],
                eduTitle2: "Lomba/Prestasi", eduList2: ["Lomba Menggambar / Bercerita", "Lomba Membaca Puisi Anak"],
                materi: ["Seni Budaya Terpadu", "Bahasa Indonesia (Pengantar Sastra)"], layanan: ["Bimbingan minat dan bakat di bidang seni"],
                guruBk: ["Mengajak anak berdiskusi untuk menceritakan makna di balik gambar buatannya"], siswa: ["Mulai berlatih merangkai kata untuk menulis cerita pendek"]
            },
            SD_Transisi: {
                eduTitle1: "Target Lingkungan SMP", eduList1: ["SMP yang berfokus pada Seni Budaya", "SMP dengan Ekskul Teater/Musik yang berprestasi"],
                eduTitle2: "Persiapan Ekskul SMP", eduList2: ["Bergabung di Klub Teater Cilik", "Berlatih Mengisi Jurnalistik Mading"],
                materi: ["Persiapan Kumpulan Portofolio Seni Awal", "Sejarah Seni Sederhana"], layanan: ["Orientasi ragam kesenian di tingkat SMP"],
                guruBk: ["Memberikan dukungan agar anak berani tampil dalam pementasan perpisahan sekolah"], siswa: ["Mengumpulkan hasil gambar atau tulisan terbaik di dalam satu map portofolio khusus"]
            },
            MI_Awal: {
                eduTitle1: "Aktivitas Kreatif", eduList1: ["Mewarnai kaligrafi dasar", "Menyanyikan nasyid/lagu Islami"],
                eduTitle2: "Karakter Dasar", eduList2: ["Menggambar bebas dengan tema Islami", "Bermain dengan plastisin atau tanah liat"],
                materi: ["Seni Budaya dan Prakarya Dasar", "Latihan Menulis Halus huruf Hijaiyah"], layanan: ["Fasilitasi ruang ekspresi (Mading mini kelas)"],
                guruBk: ["Memajang hasil karya anak di dinding kelas untuk meningkatkan rasa percaya dirinya"], siswa: ["Menggunakan imajinasi untuk membuat gambar dan perpaduan warna yang indah"]
            },
            MI_Akhir: {
                eduTitle1: "Ekskul Pilihan", eduList1: ["Kesenian Hadrah/Rebana", "Klub Seni Kaligrafi (Khat)"],
                eduTitle2: "Lomba/Prestasi", eduList2: ["Mengikuti Lomba MTQ (Tilawah/Tartil)", "Mengikuti Lomba Puisi Islami/Pildacil"],
                materi: ["Seni Suara/Musik Islami", "Seni Rupa Islami"], layanan: ["Bimbingan khusus untuk persiapan lomba kesenian"],
                guruBk: ["Mendorong siswa untuk tampil dalam pentas seni perayaan hari besar Islam"], siswa: ["Mulai berlatih membuat cerita pendek tentang keseharian di madrasah"]
            },
            MI_Transisi: {
                eduTitle1: "Target Lingkungan MTs/SMP", eduList1: ["MTs dengan program ekstrakurikuler Kesenian yang kuat", "MTs dengan pembinaan bahasa dan jurnalistik yang aktif"],
                eduTitle2: "Persiapan Ekskul", eduList2: ["Klub Teater/Drama Islam", "Grup Marawis/Paduan Suara"],
                materi: ["Pengumpulan Portofolio Karya Seni", "Pengantar Desain Visual"], layanan: ["Konseling orientasi bakat kreatif"],
                guruBk: ["Mendukung siswa untuk menyumbang penampilan seni pada acara akhir tahun sekolah"], siswa: ["Menyimpan dan merawat hasil karya gambar, tulisan, maupun piala sebagai bentuk kebanggaan"]
            },
            SMP_Awal: {
                eduTitle1: "Pengembangan Diri", eduList1: ["Membentuk Grup Band Akustik Sekolah", "Bergabung dengan Ekskul Fotografi atau Jurnalistik"],
                eduTitle2: "Eksplorasi Keterampilan", eduList2: ["Bereksperimen dengan Desain Grafis Dasar (Canva)", "Mengedit Video Pendek Kreatif yang Edukatif"],
                materi: ["Seni Rupa Lanjutan Remaja", "Sastra Indonesia Lanjutan"], layanan: ["Penyediaan studio seni atau ruang musik mini di sekolah"],
                guruBk: ["Memfasilitasi mading sekolah secara khusus sebagai sarana publikasi karya puisi dan gambar siswa"], siswa: ["Mengeksplorasi penggunaan perangkat lunak atau aplikasi desain digital di komputer maupun HP"]
            },
            SMP_Transisi: {
                eduTitle1: "Pilihan Jurusan SMA", eduList1: ["Jurusan Bahasa & Sastra", "Jurusan IPS (Fokus pada Sosiologi Seni dan Budaya)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Desain Komunikasi Visual (DKV)", "Multimedia / Animasi", "Tata Busana", "Seni Karawitan/Tari"],
                materi: ["Pengantar Seni Sinematografi Dasar", "Pemahaman Seni Terapan"], layanan: ["Konsultasi arah bakat menuju industri kreatif"],
                guruBk: ["Mendiskusikan peluang karier modern di era digital, seperti Content Creator atau Desainer UI/UX"], siswa: ["Menentukan pilihan antara memperdalam teori sastra/seni di SMA, atau praktik desain digital/busana di SMK"]
            },
            MTs_Awal: {
                eduTitle1: "Pengembangan Diri", eduList1: ["Bergabung dengan Tim Hadrah/Qasidah/Marawis", "Mengikuti Klub Fotografi/Desain Grafis (Mading)"],
                eduTitle2: "Eksplorasi Keterampilan", eduList2: ["Berlatih membuat kaligrafi dekorasi", "Membuat video pendek bermuatan dakwah yang positif"],
                materi: ["Seni Budaya Terapan", "Sastra dan Jurnalistik Dasar"], layanan: ["Penyediaan sarana ruang pamer karya atau Mading yang luas"],
                guruBk: ["Menjadikan Mading sekolah sebagai wadah utama apresiasi karya puisi dan gambar siswa"], siswa: ["Mengeksplorasi aplikasi desain digital untuk membuat poster penugasan kelas"]
            },
            MTs_Transisi: {
                eduTitle1: "Pilihan Jurusan MA/SMA", eduList1: ["Keagamaan (Fokus Seni Kaligrafi/Dakwah)", "Bahasa & Budaya"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Desain Komunikasi Visual (DKV)", "Multimedia/Broadcasting"],
                materi: ["Pengantar Seni Visual Digital", "Bimbingan Karier Industri Kreatif"], layanan: ["Konsultasi peminatan SMK bidang Seni atau IT"],
                guruBk: ["Mengenalkan tren karier modern seperti Konten Kreator atau Editor Video kepada siswa"], siswa: ["Mempertimbangkan untuk belajar teori sastra di MA atau praktik membuat animasi di SMK"]
            },
            SMA_Awal: {
                eduTitle1: "Fokus Portofolio (Fase E/F)", eduList1: ["Menjadi Sutradara atau Aktor dalam Pementasan Teater Sekolah", "Menjadi Desainer Poster Utama untuk Acara Sekolah"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Penguasaan Tool Desain Profesional (Adobe Illustrator/Photoshop)", "Teknik Penulisan Naskah Cerita (Scriptwriting)"],
                materi: ["Seni Rupa (Fase F - Tingkat Lanjut)", "Antropologi dan Budaya"], layanan: ["Fasilitasi penyelenggaraan pameran karya siswa secara rutin"],
                guruBk: ["Mengarahkan dan membantu siswa mendaftar kompetisi film pendek nasional atau festival musik pelajar"], siswa: ["Mulai membangun personal branding dan menunjukkan karya ke publik melalui platform digital"]
            },
            SMA_Transisi: {
                eduTitle1: "Fokus Studi PTN (SNBP/UTBK)", eduList1: ["Desain Interior / DKV", "Seni Rupa Murni / Seni Kriya", "Sastra (Sastra Inggris/Indonesia)", "Broadcasting dan Perfilman"],
                eduTitle2: "Alternatif Karier Lulusan SMA", eduList2: ["Asisten Desainer Grafis Junior", "Content Creator / Penulis Pemula"],
                materi: ["Persiapan Ujian Praktik Keterampilan Seni (Jalur Mandiri/SNBT)", "Latihan Soal Penalaran Literasi Bahasa (UTBK)"], layanan: ["Bimbingan intensif persiapan dan kurasi Portofolio Seni untuk syarat pendaftaran PTN"],
                guruBk: ["Membantu mengkurasi dan menyeleksi karya terbaik siswa agar memenuhi kriteria sistem portofolio SNPMB"], siswa: ["Mempersiapkan ujian praktik menggambar atau tes bakat secara fisik dengan matang"]
            },
            MA_Awal: {
                eduTitle1: "Fokus Portofolio (Fase E/F)", eduList1: ["Pementasan Teater Islami (Sutradara/Aktor)", "Desainer Utama Poster Acara Madrasah"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Penyuntingan Video/Foto Profesional", "Teknik Kepenulisan (Karya Fiksi/Nonfiksi)"],
                materi: ["Seni Budaya Fase F", "Antropologi Lintas Agama/Budaya"], layanan: ["Dukungan penyelenggaraan pameran karya seni akhir semester"],
                guruBk: ["Mendorong siswa mengikuti kompetisi desain poster atau lomba film pendek tingkat nasional"], siswa: ["Mulai mempublikasikan karya seni atau desain di media sosial untuk membangun portofolio digital"]
            },
            MA_Transisi: {
                eduTitle1: "Fokus Studi PTN/PTKIN", eduList1: ["Desain Komunikasi Visual (DKV)", "Arsitektur/Desain Interior", "Sastra Arab/Inggris/Indonesia", "Seni Rupa/Kriya"],
                eduTitle2: "Alternatif Karier Lulusan", eduList2: ["Junior Graphic Designer", "Freelance Video Editor / Penulis"],
                materi: ["Penyiapan Portofolio Gambar/Seni (Jalur Mandiri/SNBT)", "Penalaran Literasi UTBK"], layanan: ["Bimbingan khusus untuk kurasi Portofolio Seni SNMPTN/SNBT"],
                guruBk: ["Melakukan kurasi ketat terhadap karya terbaik siswa untuk diunggah sebagai portofolio seleksi kampus jalur prestasi"], siswa: ["Mempersiapkan dengan matang konsep dan alat ukur untuk ujian praktik menggambar di seleksi masuk universitas seni"]
            },
            SMK_Awal: {
                eduTitle1: "Fokus Praktik Kejuruan", eduList1: ["Memproduksi Film Animasi atau Video Pendek Bersama Tim", "Membuat Desain Kemasan Produk UMKM (Packaging)"],
                eduTitle2: "Persiapan Magang/PKL", eduList2: ["Latihan Operasional Kamera dan Tata Cahaya Profesional", "Eksplorasi Penggunaan Perangkat Lunak Animasi 2D/3D"],
                materi: ["Dasar-Dasar Desain Komunikasi Visual (DKV)", "Tipografi dan Tata Letak (Layouting)"], layanan: ["Penyediaan fasilitas Laboratorium Komputer spesifikasi Multimedia yang komprehensif"],
                guruBk: ["Menggunakan relasi sekolah untuk menghubungkan siswa magang dengan agensi periklanan, percetakan besar, atau stasiun TV lokal"], siswa: ["Mengumpulkan dan merapikan semua file desain tugas sekolah sebagai modal utama portofolio untuk melamar magang"]
            },
            SMK_Transisi: {
                eduTitle1: "Persiapan Rekrutmen Kerja", eduList1: ["Pembuatan CV untuk Posisi Desainer Grafis", "Persiapan lamaran Posisi Video Editor", "Persiapan Posisi Fotografer Produk", "Animator Junior"],
                eduTitle2: "Alternatif Studi Lanjut Vokasi", eduList2: ["Institut Seni Indonesia (ISI/IKJ)", "D4 Program Studi Animasi", "D3 Televisi dan Film"],
                materi: ["Simulasi Pitching (Cara mempresentasikan ide karya desain kepada klien)", "Persiapan Uji Kompetensi Keahlian (UKK) DKV/Multimedia"], layanan: ["Fasilitasi penyelenggaraan Pameran Tugas Akhir Vokasi (Showcase karya di Bursa Kerja Khusus)"],
                guruBk: ["Membimbing kemampuan public speaking siswa agar tampil profesional dan percaya diri saat mempresentasikan konsep seninya di hadapan HRD industri kreatif"], siswa: ["Menunjukkan hasil karya video/desain yang berkualitas sebagai pembuktian kemampuan saat sesi wawancara kerja"]
            }
        }
    },
    E: {
        title: "Enterprising", indonesianTitle: "Wirausaha",
        desc: "Kamu memiliki jiwa kepemimpinan, jago memengaruhi orang lain, andal bernegosiasi, dan berani mengambil risiko untuk meraih kesuksesan.",
        karir: ["Pengusaha", "Manajer", "Staf Marketing", "Pengacara", "Humas (Public Relations)"], freelance: ["Reseller", "Event Organizer"],
        levels: {
            SD_Awal: {
                eduTitle1: "Aktivitas Dasar", eduList1: ["Berani memimpin barisan di kelas", "Permainan simulasi berjualan (Toko-tokoan)"],
                eduTitle2: "Karakter Dasar", eduList2: ["Menunjukkan keberanian tampil di depan kelas", "Berani mengacungkan tangan untuk menjawab pertanyaan"],
                materi: ["Pendidikan Pancasila Tingkat Dasar", "Latihan Bercerita (Sebagai pengantar Public Speaking)"], layanan: ["Pendampingan dan latihan untuk meningkatkan rasa percaya diri anak"],
                guruBk: ["Memberikan kesempatan kepada anak untuk maju ke depan kelas memimpin doa atau membaca cerita"], siswa: ["Memberanikan diri untuk bertanya dan menyampaikan pendapat di dalam kelas"]
            },
            SD_Akhir: {
                eduTitle1: "Ekskul Pilihan", eduList1: ["Pramuka (Fokus menjadi Pemimpin Regu)", "Bergabung di Klub Debat Cilik"],
                eduTitle2: "Lomba/Prestasi", eduList2: ["Mengambil peran aktif di acara Market Day Sekolah", "Mencalonkan diri dalam Pemilihan Ketua Kelas"],
                materi: ["Matematika (Fokus Pengenalan Nilai Uang dan Transaksi)", "IPS (Pengenalan Ekonomi Dasar)"], layanan: ["Fasilitasi simulasi permainan kepemimpinan dan manajerial dasar"],
                guruBk: ["Memberikan tanggung jawab lebih, seperti menugaskannya menjadi ketua atau koordinator dalam tugas kelompok"], siswa: ["Mengasah keberanian dengan mencoba mencalonkan diri menjadi ketua kelas"]
            },
            SD_Transisi: {
                eduTitle1: "Target Lingkungan SMP", eduList1: ["SMP dengan reputasi organisasi OSIS yang aktif dan kuat", "SMP yang mendukung kegiatan atau proyek kewirausahaan siswa"],
                eduTitle2: "Persiapan Ekskul SMP", eduList2: ["Mengikuti Klub Jurnalistik atau Reporter Cilik", "Berpartisipasi dalam Lomba Pidato (Pildacil)"],
                materi: ["Pengenalan Dasar Kepemimpinan (Leadership)", "Cara Berkomunikasi yang Efektif"], layanan: ["Bimbingan khusus teknik retorika, intonasi, dan dasar komunikasi massa"],
                guruBk: ["Melatih anak untuk berbicara dengan artikulasi yang jelas, tempo yang tepat, dan volume suara yang lantang"], siswa: ["Mulai membiasakan berlatih berbicara atau berpidato di depan cermin untuk meningkatkan kepercayaan diri"]
            },
            MI_Awal: {
                eduTitle1: "Aktivitas Dasar", eduList1: ["Memimpin doa atau selawat sebelum belajar", "Bermain simulasi jual-beli di pasar Islami"],
                eduTitle2: "Karakter Dasar", eduList2: ["Berani tampil menceritakan hafalan pendek", "Berani unjuk tangan untuk bertanya atau menjawab"],
                materi: ["Akhlak Kepemimpinan Dasar", "Latihan Percakapan Bahasa Arab/Indonesia Dasar"], layanan: ["Pembinaan rasa percaya diri untuk tampil ke depan umum"],
                guruBk: ["Membiasakan anak diberi tanggung jawab kecil seperti menyiapkan barisan sebelum masuk kelas"], siswa: ["Tidak ragu untuk mengacungkan tangan jika mengetahui jawaban dari pertanyaan guru"]
            },
            MI_Akhir: {
                eduTitle1: "Ekskul Pilihan", eduList1: ["Pramuka Siaga (Berperan Sebagai Komandan Regu)", "Klub Pidato Cilik (Muhadharah)"],
                eduTitle2: "Tanggung Jawab/Prestasi", eduList2: ["Berjualan kreasi mandiri pada acara Market Day Madrasah", "Menjabat sebagai ketua kelas"],
                materi: ["Pengenalan Ekonomi Syariah Ringan", "Latihan Retorika Dasar"], layanan: ["Simulasi permainan manajerial dan kepemimpinan"],
                guruBk: ["Memercayakan posisi koordinator kelompok kepadanya untuk mengasah insting kepemimpinannya"], siswa: ["Berlatih berpidato di depan cermin agar kelak menjadi pembicara yang hebat"]
            },
            MI_Transisi: {
                eduTitle1: "Target Lingkungan MTs/SMP", eduList1: ["MTs dengan program ekstrakurikuler organisasi OSIM yang sangat aktif", "Pesantren dengan latihan kemandirian dan pembinaan bahasa yang baik"],
                eduTitle2: "Persiapan Ekskul", eduList2: ["Klub Debat Bahasa", "Klub Jurnalistik / Penyiaran"],
                materi: ["Teori Dasar Kepemimpinan Islami", "Keterampilan Komunikasi Efektif"], layanan: ["Pendampingan pengembangan kemampuan public speaking"],
                guruBk: ["Mengajak anak berlatih intonasi suara dan artikulasi yang jelas saat berbicara di depan publik"], siswa: ["Menyiapkan mental untuk bersaing secara sehat menjadi pengurus organisasi di tingkat MTs"]
            },
            SMP_Awal: {
                eduTitle1: "Pengembangan Diri", eduList1: ["Berusaha menjadi Pengurus Inti di OSIS", "Aktif dalam Kepanitiaan Acara Sekolah (Pentas Seni)"],
                eduTitle2: "Eksplorasi Keterampilan", eduList2: ["Mencoba berjualan makanan ringan atau stiker di kelas", "Mengeksplorasi cara berjualan online (Menjadi dropshipper/reseller)"],
                materi: ["Ilmu Ekonomi Koperasi dan UMKM Dasar", "Bahasa Indonesia (Fokus Teknik Debat dan Diskusi Argumentatif)"], layanan: ["Latihan rutin simulasi Debat dan teknik Negosiasi bagi remaja"],
                guruBk: ["Memberikan kesempatan kepada siswa ini untuk menjadi perwakilan atau juru bicara saat presentasi antarkelas"], siswa: ["Menggunakan momen kerja kelompok untuk terus mengasah kemampuan melobi dan bernegosiasi dengan teman"]
            },
            SMP_Transisi: {
                eduTitle1: "Pilihan Jurusan SMA", eduList1: ["Jurusan IPS (Fokus pada Ilmu Ekonomi Bisnis & Sosiologi)", "Jurusan Bahasa (Sebagai modal komunikasi internasional)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Jurusan Bisnis Daring & Pemasaran (BDP)", "Manajemen Tata Kelola Perkantoran", "Industri Pariwisata / Perhotelan"],
                materi: ["Pengantar Teori Bisnis dan Manajemen", "Penguatan Keterampilan Public Speaking"], layanan: ["Layanan konsultasi untuk memetakan bakat kepemimpinan dan prospek bisnis remaja"],
                guruBk: ["Mengarahkan energi siswa yang suka 'memimpin' ke hal-hal positif, seperti mengelola kas kelas atau membuat proyek wirausaha"], siswa: ["Mempertimbangkan untuk memperdalam teori ilmu ekonomi dan hukum (SMA) atau langsung praktik manajemen bisnis (SMK)"]
            },
            MTs_Awal: {
                eduTitle1: "Pengembangan Diri", eduList1: ["Aktif mendaftar menjadi pengurus inti OSIM", "Menjadi panitia acara besar madrasah (Class Meeting/PHBI)"],
                eduTitle2: "Eksplorasi Keterampilan", eduList2: ["Praktik berjualan di acara bazar madrasah", "Bermain peran sebagai pengusaha atau reseller online skala kecil"],
                materi: ["Ekonomi Dasar / Kewirausahaan", "Seni Debat dan Diskusi Kelompok"], layanan: ["Pelatihan retorika dan pidato (Muhadharah)"],
                guruBk: ["Menjadikan siswa ini sebagai juru bicara kelas atau sekolah pada acara-acara tertentu"], siswa: ["Memberanikan diri untuk memimpin teman-teman saat melakukan diskusi kelompok di kelas"]
            },
            MTs_Transisi: {
                eduTitle1: "Pilihan Jurusan MA/SMA", eduList1: ["IPS (Fokus Ilmu Ekonomi & Sosiologi)", "Bahasa (Untuk Modal Public Speaking Internasional)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Bisnis Daring dan Pemasaran (BDP)", "Pariwisata / Perhotelan"],
                materi: ["Pengantar Teori Manajerial Bisnis", "Dasar Hukum Tata Negara Singkat"], layanan: ["Konseling prospek bisnis atau pengenalan ilmu hukum"],
                guruBk: ["Menyalurkan bakat manajerial siswa menjadi kegiatan positif seperti merancang proyek amal untuk panti asuhan"], siswa: ["Menentukan minat antara berdebat teori hukum di MA atau langsung belajar berjualan online di SMK"]
            },
            SMA_Awal: {
                eduTitle1: "Fokus Portofolio (Fase E/F)", eduList1: ["Menjabat sebagai Ketua Pelaksana Acara Besar Sekolah (Event Organizer Pensi)", "Mengikuti dan memenangi Lomba Debat tingkat regional"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Pelatihan Dasar-dasar Digital Marketing (SEO, Social Media Ads)", "Aktif Membangun Jaringan Pertemanan Luas (Networking)"],
                materi: ["Ekonomi Bisnis (Fase F - Lanjutan)", "Sosiologi (Fokus Dinamika Kelompok dan Kepemimpinan)"], layanan: ["Penyediaan program Inkubasi Bisnis Siswa atau ekstrakurikuler Student Company di sekolah"],
                guruBk: ["Memberikan dukungan, arahan, dan motivasi moril saat siswa berani mengambil risiko dalam menjalankan program kerja inovatif di OSIS"], siswa: ["Memanfaatkan masa SMA untuk membangun koneksi (networking) yang baik dengan guru, teman dari sekolah lain, maupun alumni sukses"]
            },
            SMA_Transisi: {
                eduTitle1: "Fokus Studi PTN (UTBK/SNBP)", eduList1: ["Ilmu Komunikasi", "Manajemen Bisnis / Ilmu Ekonomi", "Ilmu Hukum", "Hubungan Internasional", "Pemasaran / Marketing"],
                eduTitle2: "Alternatif Karier Lulusan SMA", eduList2: ["Sales/Marketing Entry-Level", "Staf Junior Event Organizer (EO)", "Merintis Usaha Sendiri (Wirausaha Muda)"],
                materi: ["Pematangan Materi Ekonomi Makro (Untuk Persiapan UTBK)", "Latihan Intensif Tes Potensi Skolastik (Fokus Pemahaman Literasi)"], layanan: ["Pelaksanaan Uji coba (Tryout) Gabungan Soshum dan Penalaran Literasi"],
                guruBk: ["Mengarahkan siswa yang memiliki bakat debat dan analisis sosial yang sangat menonjol menuju program studi Hukum atau Hubungan Internasional"], siswa: ["Memperkuat dan memperdalam pemahaman tentang logika hukum dasar serta konsep teori ekonomi makro untuk menghadapi tes seleksi"]
            },
            MA_Awal: {
                eduTitle1: "Fokus Portofolio (Fase E/F)", eduList1: ["Menjadi Ketua Pelaksana Event Madrasah / Ketua OSIM", "Menjadi Delegasi Lomba Debat Bahasa Arab/Inggris/Indonesia"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Pelatihan Digital Marketing (Media Sosial)", "Networking dan Manajemen Komunitas Dakwah"],
                materi: ["Ekonomi Syariah (Fase F)", "Fikih Siyasah (Dasar-dasar Kepemimpinan Islam)"], layanan: ["Penyediaan ekstrakurikuler inkubasi wirausaha (Student Company)"],
                guruBk: ["Memberikan kepercayaan penuh kepada siswa untuk mengelola anggaran (budget) dan mengambil keputusan strategis di sebuah kepanitiaan"], siswa: ["Memperluas relasi (networking) dengan menjalin komunikasi yang baik lintas kelas bahkan dengan sekolah atau pesantren lain"]
            },
            MA_Transisi: {
                eduTitle1: "Fokus Studi PTN/PTKIN", eduList1: ["Ilmu Hukum / Hukum Keluarga", "Manajemen Bisnis / Ekonomi Syariah", "Ilmu Komunikasi Dasar", "Hubungan Internasional"],
                eduTitle2: "Alternatif Karier Lulusan", eduList2: ["Sales/Marketing BMT atau Perusahaan", "Membangun Bisnis/Start-Up Mandiri"],
                materi: ["Materi Ekonomi Makro (UTBK)", "Latihan Skolastik (Pemahaman Bacaan & Literasi)"], layanan: ["Bimbingan intensif persiapan Hukum Dasar atau Ekonomi Bisnis"],
                guruBk: ["Membimbing siswa agar rasional dalam memetakan ketatnya persaingan program studi Ilmu Hukum atau Manajemen di Universitas unggulan"], siswa: ["Memperbanyak berlatih kemampuan analisis bacaan/literasi untuk mempersiapkan diri menghadapi soal-soal jurusan Soshum yang panjang"]
            },
            SMK_Awal: {
                eduTitle1: "Fokus Praktik Kejuruan", eduList1: ["Melakukan Simulasi Penjualan Retail maupun Online Market", "Aktif dalam Pengelolaan Unit Usaha Sekolah (Model Teaching Factory)"],
                eduTitle2: "Persiapan Magang/PKL", eduList2: ["Menyusun Strategi Promosi Produk melalui Media Sosial", "Berlatih Teknik Penanganan Komplain Pelanggan (Handling Objection/Complaint)"],
                materi: ["Ilmu Marketing dan Strategi Promosi Bisnis", "Penerapan Konsep Pelayanan Prima (Service Excellence)"], layanan: ["Fasilitasi simulasi menggunakan Laboratorium Retail/Pemasaran atau Minimarket Sekolah"],
                guruBk: ["Membantu menghubungkan siswa untuk mendapatkan tempat PKL di agensi pemasaran, divisi marketing perusahaan, atau bisnis retail berskala besar"], siswa: ["Mempelajari teknik menulis kalimat promosi (copywriting) yang memikat agar mampu membuat penawaran produk yang menarik perhatian calon pembeli"]
            },
            SMK_Transisi: {
                eduTitle1: "Persiapan Rekrutmen Kerja", eduList1: ["Melamar Posisi Sales Executive / Account Executive", "Pramuniaga / SPG / SPB Counter", "Agen Telemarketing", "Admin Pengelola Sosial Media Bisnis"],
                eduTitle2: "Alternatif Studi Lanjut Vokasi", eduList2: ["D4 Program Studi Manajemen Pemasaran", "D3 Administrasi Bisnis Terapan", "D4 Manajemen Industri Konvensi dan Perhelatan (Event Organizer)"],
                materi: ["Persiapan Uji Kompetensi Keahlian (UKK) untuk Operasional Kasir/Display Barang", "Teknik Menghadapi Wawancara Khusus Posisi Sales/Penjualan"], layanan: ["Penyelenggaraan Bursa Kerja Khusus (BKK) yang difokuskan pada Mitra Industri Bidang Sales, Marketing, dan Retail"],
                guruBk: ["Memberikan sesi latihan intensif (roleplay) agar siswa mampu melakukan presentasi penjualan (sales pitching) yang meyakinkan, lugas, dan menarik di hadapan HRD/Klien"], siswa: ["Menunjukkan rasa percaya diri, gestur yang positif, dan antusiasme yang tinggi saat melakukan demonstrasi penjualan dalam tes wawancara kerja"]
            }
        }
    }
};