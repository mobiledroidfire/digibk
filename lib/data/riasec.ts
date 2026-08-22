// Lokasi file: src/lib/data/riasec.ts

export type RiasecResultItem = { code: string; raw_score: number; };
export type RiasecProfile = { code: string; riasec_results: RiasecResultItem[]; };
export type AssessmentResult = { id: string; riasec_profiles: RiasecProfile | RiasecProfile[] | null; };

export type LevelData = {
    eduTitle1: string; eduList1: string[];
    eduTitle2: string; eduList2: string[];
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