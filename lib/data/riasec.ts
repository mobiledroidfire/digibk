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
            // -- SD --
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
            // -- MI --
            MI_Awal: {
                eduTitle1: "Aktivitas Bermain Islami", eduList1: ["Bermain peran tokoh teladan", "Berbagi bekal dengan teman"],
                eduTitle2: "Karakter Dasar", eduList2: ["Mengucapkan salam", "Membiasakan antre tertib"],
                materi: ["Akhlak Terpuji", "Pengenalan Emosi Dasar"], layanan: ["Bimbingan klasikal bermain kelompok"],
                guruBk: ["Latih anak berempati ala kisah Nabi", "Beri apresiasi saat mau berbagi"], siswa: ["Bertegur sapalah dengan teman di kelas"]
            },
            MI_Akhir: {
                eduTitle1: "Ekskul Pilihan", eduList1: ["Pramuka Madrasah/SIT", "Dokter Kecil Madrasah"],
                eduTitle2: "Tanggung Jawab", eduList2: ["Membantu teman menghafal (Tutor sebaya)", "Piket kebersihan kelas/masjid"],
                materi: ["Akidah Akhlak", "Bahasa (Diskusi Kelompok)"], layanan: ["Konseling pengembangan empati"],
                guruBk: ["Berikan penugasan berbasis kerja sama", "Ajarkan adab mendengarkan"], siswa: ["Bantulah temanmu yang kesulitan belajar atau menghafal"]
            },
            MI_Transisi: {
                eduTitle1: "Target Lingkungan MTs/SMP", eduList1: ["MTs/SMP dengan lingkungan sosial yang baik", "MTs berbasis asrama/pesantren"],
                eduTitle2: "Persiapan Ekskul", eduList2: ["PMR/UKS", "Remaja Masjid (Klub Sosial)"],
                materi: ["Persiapan Adaptasi Remaja", "Etika Pergaulan Islami"], layanan: ["Bimbingan transisi remaja (Baligh)"],
                guruBk: ["Siapkan mental siswa menghadapi keragaman di jenjang berikutnya"], siswa: ["Siapkan dirimu untuk berteman dengan banyak orang baru dari berbagai daerah"]
            },
            // -- SMP --
            SMP_Awal: {
                eduTitle1: "Pengembangan Diri", eduList1: ["Aktif di PMR/Pramuka", "Panitia acara kelas"],
                eduTitle2: "Eksplorasi Komunitas", eduList2: ["Relawan kebersihan sekolah", "Klub duta sekolah"],
                materi: ["Sosiologi Remaja", "Kesehatan Reproduksi (Dasar)"], layanan: ["Konseling sebaya (Peer Counseling)"],
                guruBk: ["Jadikan siswa sebagai mediator konflik antar teman", "Dukung ikut OSIS Sekbid Sosial"], siswa: ["Jadilah pendengar yang baik bagi teman"]
            },
            SMP_Transisi: {
                eduTitle1: "Pilihan Jurusan SMA/MA", eduList1: ["IPS (Fokus Sosiologi)", "MIPA (Untuk Kedokteran/Kesehatan)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Keperawatan/Kesehatan Masyarakat", "Pekerjaan Sosial"],
                materi: ["Bimbingan Karier Dasar", "Psikologi Dasar"], layanan: ["Konsultasi penjurusan minat"],
                guruBk: ["Bantu siswa memetakan karir di bidang kesehatan atau sosial"], siswa: ["Cari tahu perbedaan SMA dan SMK di bidang kesehatan/sosial"]
            },
            // -- MTs --
            MTs_Awal: {
                eduTitle1: "Pengembangan Diri", eduList1: ["Aktif di PMR/Pramuka Madrasah", "Pengurus Kelas/Anggota OSIM"],
                eduTitle2: "Eksplorasi Komunitas", eduList2: ["Panitia Zakat/Kurban Sekolah", "Remaja Masjid"],
                materi: ["Fikih Sosial (Muamalah Dasar)", "Adab Pergaulan Remaja"], layanan: ["Latihan konseling teman sebaya Islami"],
                guruBk: ["Fasilitasi siswa menjadi penengah/mediator konflik di kelas"], siswa: ["Jadilah teman curhat yang bisa dipercaya bagi temanmu"]
            },
            MTs_Transisi: {
                eduTitle1: "Pilihan Jurusan MA/SMA", eduList1: ["IPS / Ilmu Sosial", "Keagamaan (Menjadi penyuluh/guru)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Layanan Kesehatan/Keperawatan", "Pekerjaan Sosial"],
                materi: ["Bimbingan Karir & Profesi Pelayanan", "Dasar Ilmu Komunikasi"], layanan: ["Konsultasi peminatan MA/SMK"],
                guruBk: ["Bantu petakan prospek jurusan yang banyak berinteraksi dengan masyarakat"], siswa: ["Mulai cari tahu perbedaan belajar sosiologi di MA dengan praktik kesehatan di SMK"]
            },
            // -- SMA --
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
            // -- MA --
            MA_Awal: {
                eduTitle1: "Fokus Portofolio (Fase E/F)", eduList1: ["Proyek P5 / Baksos Madrasah", "Tutor Ngaji (TPQ) untuk Adik Kelas"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Komunikasi Massa (Berdakwah/MC)", "Manajemen Konflik Resolusi"],
                materi: ["Sosiologi Lanjut", "Antropologi Agama"], layanan: ["Pelatihan kecerdasan emosi dan empati"],
                guruBk: ["Libatkan siswa sebagai mentor/kakak asuh MOS (Matsama)"], siswa: ["Gabunglah dengan relawan kemanusiaan atau kepemudaan di luar jam sekolah"]
            },
            MA_Transisi: {
                eduTitle1: "Fokus Studi PTN/PTKIN", eduList1: ["Psikologi Islam", "Pendidikan Guru/Agama (Tarbiyah)", "Sosiologi Agama", "Keperawatan"],
                eduTitle2: "Alternatif Karier Lulusan", eduList2: ["Staf Yayasan Sosial/Amil Zakat", "Pelayanan Pelanggan (CS)"],
                materi: ["Persiapan Penalaran Skolastik (UTBK)", "Strategi Jalur SPAN-PTKIN/SNBT"], layanan: ["Konsultasi pemilihan kampus UIN/PTN"],
                guruBk: ["Arahkan pemilihan prodi rumpun Ilmu Kependidikan atau Sosial-Humaniora"], siswa: ["Perbanyak latihan soal literasi bahasa dan sosiologi untuk persiapan tes kampus impian!"]
            },
            // -- SMK --
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
            MI_Awal: {
                eduTitle1: "Aktivitas Dasar", eduList1: ["Menyusun puzzle huruf Hijaiyah", "Permainan pengelompokan benda"],
                eduTitle2: "Karakter Dasar", eduList2: ["Merapikan buku Iqro/Juz Amma", "Menulis rapi di garis buku"],
                materi: ["Mengenal Angka Dasar", "Latihan Motorik Menulis"], layanan: ["Bimbingan kedisiplinan ringan"],
                guruBk: ["Bantu anak membuat jadwal kegiatan harian sederhana"], siswa: ["Kembalikan bukumu ke rak setelah selesai dibaca"]
            },
            MI_Akhir: {
                eduTitle1: "Ekskul Pilihan", eduList1: ["Pengenalan TIK/Komputer Dasar", "Pramuka (Fokus Administrasi Regu)"],
                eduTitle2: "Tanggung Jawab", eduList2: ["Bendahara/Pencatat Infaq Kelas", "Petugas Absensi Kelas"],
                materi: ["Aritmatika Dasar", "Latihan Mengetik/Menyalin Teks"], layanan: ["Latihan fokus belajar"],
                guruBk: ["Berikan tugas pendataan ringan agar ketelitiannya terasah"], siswa: ["Catatlah tugas-tugas dari guru agar tidak terlupa"]
            },
            MI_Transisi: {
                eduTitle1: "Target Lingkungan MTs/SMP", eduList1: ["MTs dengan kedisiplinan tinggi", "MTs dengan Lab Komputer/Bahasa yang bagus"],
                eduTitle2: "Persiapan Ekskul", eduList2: ["Klub Jurnalistik/Mading", "Klub Komputer"],
                materi: ["Pengantar Matematika Lanjut", "Manajemen Waktu"], layanan: ["Konseling transisi kedisiplinan belajar"],
                guruBk: ["Ajarkan teknik mengatur jadwal hafalan dan tugas harian mandiri"], siswa: ["Siapkan catatan pelajaran yang terpisah dan rapi untuk tiap mapel di MTs nanti"]
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
            MTs_Awal: {
                eduTitle1: "Pengembangan Diri", eduList1: ["Sekretaris/Bendahara OSIM", "Klub TIK Madrasah"],
                eduTitle2: "Eksplorasi Keterampilan", eduList2: ["Menyusun laporan/proposal kegiatan", "Manajemen kas kelas"],
                materi: ["Matematika Dasar", "TIK Pengolah Angka (Excel)"], layanan: ["Bimbingan administrasi siswa"],
                guruBk: ["Fasilitasi siswa dalam mengurus surat-menyurat OSIM"], siswa: ["Rapikan catatan belajar dan jadwal hafalanmu setiap minggu"]
            },
            MTs_Transisi: {
                eduTitle1: "Pilihan Jurusan MA/SMA", eduList1: ["IPS (Fokus Akuntansi/Ekonomi)", "Keagamaan (Fokus Faraid/Data)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Akuntansi", "Manajemen Perkantoran (OTKP)"],
                materi: ["Pengantar Ilmu Ekonomi Dasar", "Logika Matematika Dasar"], layanan: ["Konsultasi peminatan bidang manajerial"],
                guruBk: ["Kenalkan prospek karir di lembaga keuangan syariah atau administrasi"], siswa: ["Cari tahu perbedaan belajar akuntansi/ekonomi di MA dengan SMK"]
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
            MA_Awal: {
                eduTitle1: "Fokus Portofolio (Fase E/F)", eduList1: ["Tim Kesekretariatan Kegiatan Madrasah", "Pengolah Data/Survei P5"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Penguasaan MS Office Lanjut (Word/Excel)", "Sistem Pembukuan Kas"],
                materi: ["Akuntansi/Ekonomi Fase F", "Statistika Terapan Dasar"], layanan: ["Bimbingan keterampilan manajerial acara"],
                guruBk: ["Berikan tugas pengelolaan dokumen beasiswa/KIP secara teliti"], siswa: ["Pelajari cara mengolah data menggunakan rumus spreadsheet (Excel)"]
            },
            MA_Transisi: {
                eduTitle1: "Fokus Studi PTN/PTKIN", eduList1: ["Akuntansi (Umum/Syariah)", "Perbankan Syariah", "Ilmu Administrasi", "Statistika"],
                eduTitle2: "Alternatif Karier Lulusan", eduList2: ["Staf Admin Entry-Level", "Data Entry BMT/Koperasi"],
                materi: ["Penalaran Matematika (UTBK)", "Literasi Keuangan"], layanan: ["Tryout kuantitatif dan penalaran matematis"],
                guruBk: ["Bantu susun strategi seleksi PTN berbasis analisis data peluang rasional"], siswa: ["Latih kecepatan dan keakuratan berhitungmu untuk menjawab tes seleksi masuk kuliah"]
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
            MI_Awal: {
                eduTitle1: "Eksplorasi Pengetahuan", eduList1: ["Eksperimen warna/alam sederhana", "Membaca kisah sains Islam (Ensiklopedia)"],
                eduTitle2: "Karakter Dasar", eduList2: ["Banyak bertanya 'Mengapa' dan 'Bagaimana'", "Menyelesaikan puzzle logika"],
                materi: ["Pengenalan Sains Dasar", "Matematika Logika Pemula"], layanan: ["Pendampingan rasa ingin tahu (Inkuiri)"],
                guruBk: ["Berikan jawaban logis dan dorong anak untuk mencari tahu lebih dalam"], siswa: ["Perbanyak baca buku tentang hewan, tumbuhan, atau luar angkasa"]
            },
            MI_Akhir: {
                eduTitle1: "Ekskul Pilihan", eduList1: ["Klub Sains/Robotik", "Klub Jurnalistik Dasar"],
                eduTitle2: "Tanggung Jawab/Prestasi", eduList2: ["Persiapan KSM (Kompetisi Sains Madrasah)", "Percobaan IPA mandiri di kelas"],
                materi: ["IPA Dasar", "Matematika Logika"], layanan: ["Fasilitasi Lab mini atau eksperimen kelas"],
                guruBk: ["Berikan tantangan teka-teki logika atau puzzle yang sedikit sulit"], siswa: ["Lakukan percobaan sains yang aman di rumah bersama orang tuamu"]
            },
            MI_Transisi: {
                eduTitle1: "Target Lingkungan MTs/SMP", eduList1: ["MTs dengan program kelas unggulan/Sains", "MTs yang berprestasi di MYRES/KSM"],
                eduTitle2: "Persiapan Ekskul", eduList2: ["KIR (Karya Ilmiah Remaja) Dasar", "Komputer/TIK Dasar"],
                materi: ["Metodologi Penelitian Sederhana", "Matematika Terapan Menengah"], layanan: ["Bimbingan minat bakat Sains"],
                guruBk: ["Kenalkan peluang kompetisi riset atau olimpiade tingkat menengah"], siswa: ["Berlatih soal-soal logika dasar untuk persiapan masuk program unggulan"]
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
            MTs_Awal: {
                eduTitle1: "Pengembangan Diri", eduList1: ["Klub Sains Madrasah (KIR)", "Klub Coding/TIK Dasar"],
                eduTitle2: "Eksplorasi", eduList2: ["Eksperimen Lab Sederhana", "Riset Data Mini"],
                materi: ["Fisika/Biologi Dasar", "Algoritma Dasar"], layanan: ["Bimbingan olimpiade sains madrasah"],
                guruBk: ["Persiapkan dan seleksi siswa untuk ajang KSM (Kompetisi Sains Madrasah)"], siswa: ["Mulailah belajar dasar-dasar coding (pemrograman) lewat internet"]
            },
            MTs_Transisi: {
                eduTitle1: "Pilihan Jurusan MA/SMA", eduList1: ["MIPA (Fokus Sains/Kedokteran)", "Ilmu Falak/Astronomik Islam"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["IT (Rekayasa Perangkat Lunak)", "Farmasi/Kesehatan"],
                materi: ["Sains Terpadu", "Pengantar Teknologi Terkini"], layanan: ["Tes Minat Bakat Sains/IT"],
                guruBk: ["Bantu petakan kemampuan spesifik: apakah kuat di hitungan, hafalan biologi, atau logika coding"], siswa: ["Pikirkan mimpimu: Menjadi dokter, ahli komputer, atau peneliti madrasah?"]
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
            MA_Awal: {
                eduTitle1: "Fokus Portofolio (Fase E/F)", eduList1: ["Penulisan Karya Ilmiah Remaja (MYRES)", "Delegasi Olimpiade (KSM/OSN)"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Dasar Bahasa Pemrograman (Koding)", "Metodologi Riset Kuantitatif"],
                materi: ["Saintek Terpadu (Fase F)", "Matematika/Fisika Lanjutan"], layanan: ["Fasilitasi laboratorium riset madrasah"],
                guruBk: ["Sambungkan siswa dengan guru pembimbing khusus ajang MYRES/KSM tingkat nasional"], siswa: ["Buat proyek inovasi atau riset mini yang bermanfaat bagi masyarakat sekitarmu"]
            },
            MA_Transisi: {
                eduTitle1: "Fokus Studi PTN/PTKIN", eduList1: ["Kedokteran", "Teknik Informatika (IT)", "Statistika/Sains Data", "Ilmu Sains Murni"],
                eduTitle2: "Alternatif Karier Lulusan", eduList2: ["Asisten Laboratorium", "Staf IT Support Entry-Level"],
                materi: ["Penalaran Kognitif & Saintek (UTBK)", "Analisis Jurnal Riset Dasar"], layanan: ["Tryout Intensif Penalaran Saintek/TPS"],
                guruBk: ["Arahkan penelusuran beasiswa BIM (Beasiswa Indonesia Maju) atau program prestasi riset"], siswa: ["Fokuskan belajarmu pada pemecahan soal-soal HOTS (High Order Thinking Skills)"]
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
            MI_Awal: {
                eduTitle1: "Aktivitas Fisik Dasar", eduList1: ["Olahraga ringan / Senam sehat", "Bermain balok kayu/lego"],
                eduTitle2: "Karakter Dasar", eduList2: ["Berkebun di halaman madrasah", "Membersihkan tempat shalat"],
                materi: ["Pendidikan Jasmani & Kesehatan", "Prakarya Dasar"], layanan: ["Fasilitas lapangan bermain yang aman"],
                guruBk: ["Pastikan energi fisik anak tersalurkan dengan baik dan aman di jam istirahat"], siswa: ["Aktiflah bergerak dan bermain di luar kelas bersama teman"]
            },
            MI_Akhir: {
                eduTitle1: "Ekskul Pilihan", eduList1: ["Pramuka Siaga/Penggalang (Prakarya)", "Olahraga (Futsal, Bulutangkis)"],
                eduTitle2: "Tanggung Jawab/Prestasi", eduList2: ["Lomba Olahraga Antar MI (PORSENI)", "Merakit kerajinan tangan tugas kelas"],
                materi: ["Keterampilan Motorik Kasar", "Kerajinan Tangan (Prakarya)"], layanan: ["Pembinaan ekstrakurikuler olahraga"],
                guruBk: ["Pantau asupan gizi anak dan dukung partisipasinya di ajang olahraga PORSENI"], siswa: ["Bantulah orang tua mengerjakan pekerjaan fisik ringan di rumah"]
            },
            MI_Transisi: {
                eduTitle1: "Target Lingkungan MTs/SMP", eduList1: ["MTs dengan fasilitas olahraga baik", "SMP KKO (Kelas Khusus Olahraga)"],
                eduTitle2: "Persiapan Ekskul", eduList2: ["Bela Diri (Pencak Silat/Tapak Suci)", "Pramuka Inti (Tali temali)"],
                materi: ["Kesehatan & Kebugaran Jasmani Dasar", "Pengenalan Alat Perkakas"], layanan: ["Bimbingan pemilihan ekskul lapangan"],
                guruBk: ["Kenalkan ragam kegiatan fisik dan keolahragaan di jenjang pendidikan menengah"], siswa: ["Mulai rutinkan olahraga sore agar staminamu siap masuk ekskul fisik/bela diri nanti"]
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
            MTs_Awal: {
                eduTitle1: "Pengembangan Diri", eduList1: ["Tim Inti Olahraga Madrasah", "Pencak Silat/Pagar Nusa/Tapak Suci"],
                eduTitle2: "Eksplorasi Keterampilan", eduList2: ["Prakarya/Kerajinan Tangan", "Pramuka Penggalang (Teknik Kepramukaan)"],
                materi: ["Pendidikan Jasmani", "Prakarya Rekayasa Dasar"], layanan: ["Pembinaan khusus kontingen atlet PORSENI"],
                guruBk: ["Pantau perkembangan fisik dan akademik para siswa atlet madrasah"], siswa: ["Jaga kebugaran dengan olahraga rutin setiap sore"]
            },
            MTs_Transisi: {
                eduTitle1: "Pilihan Jurusan MA/SMA", eduList1: ["MIPA (Fokus Ilmu Terapan)", "MA Keterampilan (Tata Busana/Elektronika)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Teknik Otomotif/Mesin", "Tata Boga/Kelistrikan"],
                materi: ["Konseling Pemilihan Sekolah Vokasi", "Kesehatan Fisik Calon Atlet"], layanan: ["Tes kecerdasan mekanikal dasar"],
                guruBk: ["Jelaskan perbedaan mendalam antara MA reguler, MA Plus Keterampilan, dan SMK Teknika"], siswa: ["Apakah kamu ingin masuk ke sekolah militer, jadi atlet, atau ahli mekanik mesin? Tentukan dari sekarang!"]
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
            MA_Awal: {
                eduTitle1: "Fokus Portofolio (Fase E/F)", eduList1: ["Sertifikasi Sabuk/Tingkat Bela Diri", "Kejuaraan Olahraga PORSENI/AKSIOMA"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Kecakapan Bertahan Hidup (Survival Alam)", "Pelatihan Pertolongan Pertama (PMR)"],
                materi: ["Fisika Mekanika Lanjut", "Geografi Lapangan"], layanan: ["Pengecekan fisik dasar (TB/BB, mata, gigi) berkala"],
                guruBk: ["Identifikasi sejak dini siswa yang berminat pada sekolah ikatan dinas (Militer/Polisi)"], siswa: ["Pastikan postur, tinggi badan, dan kesehatan matamu terjaga (hindari gadget berlebihan)"]
            },
            MA_Transisi: {
                eduTitle1: "Fokus Studi PTN/Kedinasan", eduList1: ["Akmil/Akpol (TNI/Polri)", "Keolahragaan (FIK)", "Teknik Sipil/Mesin"],
                eduTitle2: "Alternatif Karier Lulusan", eduList2: ["Pelatih/Wasit Olahraga Pemula", "Mekanik/Perakit Pemula"],
                materi: ["Latihan Kesamaptaan Jasmani", "Tes Psikologi TNI/Polri Dasar"], layanan: ["Fasilitasi simulasi tes fisik kesamaptaan"],
                guruBk: ["Pastikan persiapan administrasi dan fisik siswa untuk tes kedinasan dilakukan jauh-jauh hari"], siswa: ["Rutin lari pagi, pull-up, push-up, dan cek kesehatan gigimu secara mandiri!"]
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
            MI_Awal: {
                eduTitle1: "Aktivitas Kreatif", eduList1: ["Mewarnai kaligrafi dasar", "Menyanyikan nasyid/lagu Islami"],
                eduTitle2: "Karakter Dasar", eduList2: ["Menggambar bebas Islami", "Bermain dengan plastisin/tanah liat"],
                materi: ["Seni Budaya dan Prakarya Dasar", "Latihan Menulis Halus/Hijaiyah"], layanan: ["Fasilitasi ruang ekspresi (Mading mini kelas)"],
                guruBk: ["Pajang hasil karya anak di dinding kelas untuk meningkatkan percaya dirinya"], siswa: ["Gunakan imajinasimu untuk membuat gambar atau warna yang indah"]
            },
            MI_Akhir: {
                eduTitle1: "Ekskul Pilihan", eduList1: ["Kesenian Hadrah/Rebana", "Klub Seni Kaligrafi (Khat)"],
                eduTitle2: "Lomba/Prestasi", eduList2: ["Lomba MTQ (Tilawah/Tartil)", "Lomba Puisi Islami/Pildacil"],
                materi: ["Seni Suara/Musik Islami", "Seni Rupa Islami"], layanan: ["Bimbingan khusus lomba kesenian"],
                guruBk: ["Dorong siswa untuk tampil dalam pentas seni perayaan hari besar Islam"], siswa: ["Mulai berlatih membuat cerita pendek (cerpen) pertamamu tentang keseharian di madrasah"]
            },
            MI_Transisi: {
                eduTitle1: "Target Lingkungan MTs/SMP", eduList1: ["MTs dengan program ekstrakurikuler Kesenian kuat", "MTs dengan pembinaan bahasa/jurnalistik aktif"],
                eduTitle2: "Persiapan Ekskul", eduList2: ["Klub Teater/Drama Islam", "Grup Marawis/Paduan Suara"],
                materi: ["Pengumpulan Portofolio Karya Seni", "Pengantar Desain Visual"], layanan: ["Konseling orientasi bakat kreatif"],
                guruBk: ["Dukung siswa untuk menyumbang penampilan seni di acara akhir tahun sekolah"], siswa: ["Simpan dan kumpulkan hasil karya gambar, tulisan, atau pialamu dengan baik sebagai kebanggaan!"]
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
            MTs_Awal: {
                eduTitle1: "Pengembangan Diri", eduList1: ["Tim Hadrah/Qasidah/Marawis", "Klub Fotografi/Desain Grafis (Mading)"],
                eduTitle2: "Eksplorasi Keterampilan", eduList2: ["Berlatih kaligrafi dekorasi", "Membuat video pendek positif (Dakwah)"],
                materi: ["Seni Budaya Terapan", "Sastra dan Jurnalistik Dasar"], layanan: ["Penyediaan sarana ruang pamer karya/Mading luas"],
                guruBk: ["Jadikan Mading sekolah wadah utama apresiasi karya puisi/gambar siswa"], siswa: ["Eksplorasi aplikasi desain digital (seperti Canva) untuk membuat poster tugas kelas"]
            },
            MTs_Transisi: {
                eduTitle1: "Pilihan Jurusan MA/SMA", eduList1: ["Keagamaan (Seni Kaligrafi/Dakwah)", "Bahasa & Budaya"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Desain Komunikasi Visual (DKV)", "Multimedia/Broadcasting"],
                materi: ["Pengantar Seni Visual Digital", "Bimbingan Karir Industri Kreatif"], layanan: ["Konsultasi peminatan SMK Seni/IT"],
                guruBk: ["Kenalkan tren karir modern seperti Konten Kreator atau Video Editor"], siswa: ["Pikirkan! Ingin belajar teori sastra di MA atau praktik membuat animasi di SMK?"]
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
            MA_Awal: {
                eduTitle1: "Fokus Portofolio (Fase E/F)", eduList1: ["Pementasan Teater Islami (Sutradara/Aktor)", "Desainer Utama Poster Acara Madrasah"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Editing Video/Foto Profesional (Adobe/Capcut)", "Teknik Kepenulisan (Karya Fiksi/Non-Fiksi)"],
                materi: ["Seni Budaya Fase F", "Antropologi Lintas Agama/Budaya"], layanan: ["Dukungan pameran karya seni akhir semester"],
                guruBk: ["Dorong siswa mengikuti kompetisi desain poster atau lomba film pendek tingkat nasional"], siswa: ["Mulailah mempublikasikan karya seni atau desainmu di media sosial untuk membangun portofolio digital!"]
            },
            MA_Transisi: {
                eduTitle1: "Fokus Studi PTN/PTKIN", eduList1: ["Desain Komunikasi Visual (DKV)", "Arsitektur/Desain Interior", "Sastra Arab/Inggris/Indonesia", "Seni Rupa/Kriya (ISI)"],
                eduTitle2: "Alternatif Karier Lulusan", eduList2: ["Junior Graphic Designer", "Freelance Video Editor / Penulis"],
                materi: ["Penyiapan Portofolio Gambar/Seni (Jalur Mandiri/SNBT)", "Penalaran Literasi UTBK"], layanan: ["Bimbingan khusus kurasi Portofolio Seni SNMPTN/SNBT"],
                guruBk: ["Kurasi secara ketat karya terbaik siswa untuk diunggah sebagai portofolio seleksi kampus jalur prestasi"], siswa: ["Persiapkan dengan matang konsep dan alat ukur untuk ujian praktik menggambar di seleksi masuk universitas (ISI/IKJ)"]
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
            MI_Awal: {
                eduTitle1: "Aktivitas Dasar", eduList1: ["Memimpin doa atau selawat sebelum belajar", "Bermain simulasi jual-beli (Toko/Pasar Islami)"],
                eduTitle2: "Karakter Dasar", eduList2: ["Berani tampil menceritakan hafalan pendek", "Berani unjuk tangan untuk bertanya"],
                materi: ["Akhlak Pemimpin Dasar", "Latihan Percakapan Bahasa Arab/Indonesia Dasar"], layanan: ["Pembinaan rasa percaya diri tampil ke depan"],
                guruBk: ["Biasakan anak diberi tanggung jawab kecil seperti menyiapkan barisan sebelum masuk kelas"], siswa: ["Jangan malu untuk mengacungkan tangan jika kamu tahu jawaban dari guru!"]
            },
            MI_Akhir: {
                eduTitle1: "Ekskul Pilihan", eduList1: ["Pramuka Siaga (Sebagai Komandan Regu)", "Klub Pidato Cilik (Muhadharah)"],
                eduTitle2: "Tanggung Jawab/Prestasi", eduList2: ["Berjualan kreasi mandiri di acara Market Day Madrasah", "Menjadi ketua kelas"],
                materi: ["Pengenalan Ekonomi Syariah Ringan", "Latihan Retorika Dasar"], layanan: ["Simulasi permainan manajerial dan kepemimpinan"],
                guruBk: ["Percayakan posisi koordinator kelompok kepadanya untuk mengasah insting kepemimpinannya"], siswa: ["Berlatihlah berpidato di depan cermin agar kelak kamu menjadi pembicara yang hebat"]
            },
            MI_Transisi: {
                eduTitle1: "Target Lingkungan MTs/SMP", eduList1: ["MTs dengan program ekstrakurikuler organisasi (OSIM) yang sangat aktif", "Pesantren dengan latihan kemandirian dan bahasa yang baik"],
                eduTitle2: "Persiapan Ekskul", eduList2: ["Klub Debat Bahasa", "Klub Jurnalistik / Penyiaran"],
                materi: ["Teori Dasar Leadership Islami", "Keterampilan Komunikasi Efektif"], layanan: ["Pendampingan pengembangan public speaking"],
                guruBk: ["Ajak anak berlatih intonasi suara dan artikulasi yang jelas saat berbicara"], siswa: ["Siapkan mentalmu untuk bersaing secara sehat menjadi pengurus organisasi di MTs nanti"]
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
            MTs_Awal: {
                eduTitle1: "Pengembangan Diri", eduList1: ["Aktif mendaftar menjadi pengurus inti OSIM", "Menjadi panitia acara besar madrasah (Class Meeting/PHBI)"],
                eduTitle2: "Eksplorasi Keterampilan", eduList2: ["Praktek berjualan di bazar madrasah", "Bermain peran sebagai pengusaha/reseller online kecil-kecilan"],
                materi: ["Ekonomi Dasar / Kewirausahaan", "Seni Debat dan Diskusi Kelompok"], layanan: ["Pelatihan retorika dan pidato (Muhadharah)"],
                guruBk: ["Jadikan siswa ini sebagai juru bicara kelas atau sekolah pada event-event tertentu"], siswa: ["Beranikan dirimu untuk memimpin teman-teman saat diskusi kelompok di kelas!"]
            },
            MTs_Transisi: {
                eduTitle1: "Pilihan Jurusan MA/SMA", eduList1: ["IPS (Fokus Ekonomi & Sosiologi)", "Bahasa (Untuk Modal Public Speaking Internasional)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Bisnis Daring dan Pemasaran (BDP)", "Pariwisata / Perhotelan"],
                materi: ["Pengantar Teori Manajerial Bisnis", "Dasar Hukum Tata Negara Singkat"], layanan: ["Konseling prospek bisnis atau ilmu hukum"],
                guruBk: ["Salurkan bakat mengaturnya menjadi hal positif seperti membuat proyek amal untuk panti asuhan"], siswa: ["Kamu lebih suka berdebat teori hukum (MA IPS) atau langsung jualan online (SMK BDP)? Tentukan!"]
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
            MA_Awal: {
                eduTitle1: "Fokus Portofolio (Fase E/F)", eduList1: ["Ketua Pelaksana Event Madrasah / Ketua OSIM", "Delegasi Lomba Debat Bahasa Arab/Inggris/Indonesia"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Pelatihan Digital Marketing (Media Sosial)", "Networking dan Manajemen Komunitas Dakwah"],
                materi: ["Ekonomi Syariah (Fase F)", "Fikih Siyasah (Dasar-dasar Kepemimpinan Islam)"], layanan: ["Penyediaan ekstrakurikuler inkubasi wirausaha (Student Company)"],
                guruBk: ["Berikan kepercayaan penuh kepada siswa untuk mengelola *budget* dan mengambil keputusan di sebuah kepanitiaan"], siswa: ["Perluas relasimu (*networking*) dengan menjalin komunikasi baik lintas kelas bahkan sekolah/pesantren lain"]
            },
            MA_Transisi: {
                eduTitle1: "Fokus Studi PTN/PTKIN", eduList1: ["Ilmu Hukum / Hukum Keluarga (Ahwal As-Syakhshiyyah)", "Manajemen Bisnis / Ekonomi Syariah", "Ilmu Komunikasi Dasar", "Hubungan Internasional"],
                eduTitle2: "Alternatif Karier Lulusan", eduList2: ["Sales/Marketing BMT atau Perusahaan", "Membangun Bisnis/Start-Up Mandiri"],
                materi: ["Materi Ekonomi Makro (UTBK)", "Latihan Skolastik (Pemahaman Bacaan & Literasi)"], layanan: ["Bimbingan intensif persiapan Hukum Dasar atau Ekonomi Bisnis"],
                guruBk: ["Bimbing siswa untuk rasional memetakan ketatnya persaingan Ilmu Hukum atau Manajemen di Universitas Top"], siswa: ["Banyaklah berlatih kemampuan analisis bacaan/literasi, karena soal-soal jurusan Soshum sangat tebal bacaannya"]
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