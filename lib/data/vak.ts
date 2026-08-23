// Lokasi file: src/lib/data/vak.ts

export type VakResultItem = { code: string; raw_score: number; };
export type VakProfile = {
    code: string;
    dominant_code?: string;   // SSOT Database
    secondary_code?: string;  // SSOT Database
    tertiary_code?: string;   // SSOT Database
    vak_results: VakResultItem[];
};
export type AssessmentResultVak = { id: string; vak_profiles: VakProfile | VakProfile[] | null; };

// Struktur ini disamakan persis dengan RIASEC agar UI Frontend bisa seragam (Re-usable)
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

export type ProfileDetailVak = {
    title: string; indonesianTitle: string; desc: string;
    karir: string[]; freelance: string[];
    levels: LevelData;
};

export const dimensionDefsVak: Record<string, { name: string; meaning: string; behavior: string }> = {
    V: { name: "Visual", meaning: "Menyerap informasi paling baik melalui penglihatan (gambar, warna, tulisan).", behavior: "Suka membaca, mencatat rapi, dan mudah mengingat apa yang dilihat." },
    A: { name: "Auditori", meaning: "Menyerap informasi paling baik melalui pendengaran (cerita, penjelasan lisan).", behavior: "Suka berdiskusi, mendengarkan, dan terkadang membaca dengan bersuara." },
    K: { name: "Kinestetik", meaning: "Menyerap informasi paling baik melalui gerakan dan sentuhan fisik.", behavior: "Sulit duduk diam lama, suka belajar melalui praktik langsung." }
};

export const vakDictionary: Record<string, ProfileDetailVak> = {
    V: {
        title: "Visual", indonesianTitle: "Visual (Penglihatan)",
        desc: "Kamu adalah tipe pembelajar yang lebih mudah mengingat informasi dengan cara melihat. Gambar, diagram, warna, dan catatan yang rapi sangat membantumu dalam belajar.",
        karir: ["Desainer Grafis", "Arsitek", "Fotografer", "Ilustrator", "Pembuat Peta (Kartografer)"], freelance: ["Editor Video", "Desainer UI/UX"],
        levels: {
            // -- SD --
            SD_Awal: {
                eduTitle1: "Metode Belajar", eduList1: ["Gunakan flashcard bergambar", "Belajar dengan buku cerita full color"],
                eduTitle2: "Karakteristik", eduList2: ["Tertarik pada benda berwarna mencolok", "Suka memperhatikan raut wajah guru"],
                materi: ["Membaca Permulaan Bergambar", "Mewarnai Bentuk Dasar"], layanan: ["Fasilitas poster edukasi di kelas"],
                guruBk: ["Gunakan alat peraga visual yang menarik saat memberikan bimbingan"], siswa: ["Gunakan pensil warna untuk menandai catatanmu"]
            },
            SD_Akhir: {
                eduTitle1: "Metode Belajar", eduList1: ["Membuat peta pikiran (Mind Map) sederhana", "Menonton video dokumenter anak"],
                eduTitle2: "Karakteristik", eduList2: ["Catatan sekolahnya cenderung rapi", "Cepat hafal rute jalan atau letak barang"],
                materi: ["Pembuatan Poster Mini", "Latihan Menggambar Peta"], layanan: ["Bimbingan cara merangkum materi secara visual"],
                guruBk: ["Ajak anak memvisualisasikan cita-citanya melalui gambar"], siswa: ["Tempelkan jadwal pelajaranmu yang warna-warni di dinding kamar"]
            },
            SD_Transisi: {
                eduTitle1: "Target Lingkungan SMP", eduList1: ["SMP dengan fasilitas proyektor di tiap kelas", "SMP yang mendukung kreativitas visual mading"],
                eduTitle2: "Persiapan Ekskul SMP", eduList2: ["Klub Menggambar/Komik", "Klub Fotografi Cilik"],
                materi: ["Keterampilan Mencatat Visual", "Manajemen Buku Catatan"], layanan: ["Konseling persiapan metode belajar SMP"],
                guruBk: ["Ajarkan anak cara membuat ringkasan bab pelajaran dengan tabel/diagram"], siswa: ["Siapkan stabilo dan spidol warna-warni untuk SMP nanti"]
            },
            // -- MI --
            MI_Awal: {
                eduTitle1: "Metode Belajar Islami", eduList1: ["Menggunakan Iqro/Juz Amma berwarna", "Menonton video kisah Nabi kartun"],
                eduTitle2: "Karakteristik Dasar", eduList2: ["Senang melihat hiasan kaligrafi", "Suka memperhatikan gerakan shalat dengan saksama"],
                materi: ["Pengenalan Huruf Hijaiyah Berwarna", "Menulis Arab Dasar"], layanan: ["Penyediaan flashcard huruf Arab"],
                guruBk: ["Gunakan gambar-gambar bernuansa Islami untuk menarik perhatian anak"], siswa: ["Warnai buku tugasmu agar kamu lebih semangat belajar!"]
            },
            MI_Akhir: {
                eduTitle1: "Metode Belajar Islami", eduList1: ["Menghafal doa dengan bantuan gambar komik", "Membuat poster dakwah mini"],
                eduTitle2: "Karakteristik/Tanggung Jawab", eduList2: ["Suka menghias Mading kelas", "Menjaga kerapian meja belajar"],
                materi: ["Seni Kaligrafi Pemula", "Sejarah Islam melalui Video"], layanan: ["Bimbingan metode menghafal berbasis visual"],
                guruBk: ["Arahkan siswa membuat rangkuman kisah sahabat Nabi dalam bentuk peta konsep bergambar"], siswa: ["Tandai ayat-ayat hafalanmu di Al-Quran dengan stiker penanda khusus"]
            },
            MI_Transisi: {
                eduTitle1: "Target Lingkungan MTs/SMP", eduList1: ["MTs dengan fasilitas multimedia yang baik", "MTs yang memiliki ekskul kaligrafi/desain visual"],
                eduTitle2: "Persiapan Ekskul", eduList2: ["Klub Kaligrafi (Khat)", "Jurnalistik Madrasah"],
                materi: ["Manajemen Catatan Madrasah", "Pembuatan Mind Map Materi Akidah"], layanan: ["Konseling metode belajar visual tingkat menengah"],
                guruBk: ["Ajarkan siswa membedakan warna stabilo untuk definisi, dalil, dan contoh"], siswa: ["Siapkan buku catatan dengan banyak warna agar kamu tidak bosan saat menghafal di MTs"]
            },
            // -- SMP --
            SMP_Awal: {
                eduTitle1: "Strategi Belajar", eduList1: ["Gunakan highlighter (stabilo) berbagai warna", "Ubah teks panjang menjadi infografis"],
                eduTitle2: "Karakteristik", eduList2: ["Lebih paham jika melihat presentasi slide (PPT)", "Kadang terganggu oleh visual yang berantakan"],
                materi: ["Teknik Membuat Mind Mapping", "Membaca Cepat (Skimming visual)"], layanan: ["Pelatihan teknik mencatat kreatif"],
                guruBk: ["Gunakan media infografis saat memberikan materi klasikal BK di kelas"], siswa: ["Biasakan merangkum catatan pelajaran menjadi diagram pohon yang menarik"]
            },
            SMP_Transisi: {
                eduTitle1: "Pilihan Jurusan SMA/MA", eduList1: ["Semua jurusan cocok, asalkan metode belajarnya disesuaikan (Visual)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Desain Komunikasi Visual (DKV)", "Multimedia", "Animasi"],
                materi: ["Eksplorasi Karir Berbasis Desain", "Strategi Ujian Nasional/Sekolah berbasis Visual"], layanan: ["Konsultasi arah bakat industri kreatif/visual"],
                guruBk: ["Tunjukkan video profil jurusan SMK/SMA agar siswa mendapat gambaran visual yang jelas"], siswa: ["Pertimbangkan masuk SMK DKV jika kamu sangat suka belajar melalui desain dan gambar"]
            },
            // -- MTs --
            MTs_Awal: {
                eduTitle1: "Strategi Belajar", eduList1: ["Gunakan highlighter warna-warni untuk membedakan hukum tajwid/dalil", "Membuat bagan silsilah nabi/sejarah Islam"],
                eduTitle2: "Karakteristik", eduList2: ["Rapi dalam menyalin tulisan Arab di papan tulis", "Lebih paham saat guru menggunakan slide proyektor"],
                materi: ["Teknik Mind Mapping Materi Fikih", "Desain Poster Dakwah"], layanan: ["Pelatihan pembuatan catatan estetik (Aesthetic Notes)"],
                guruBk: ["Saat konseling, gunakan kertas atau papan tulis kecil untuk menggambar alur penyelesaian masalah siswa"], siswa: ["Beli stabilo dengan 3 warna berbeda untuk menandai arti, lafal, dan hukum bacaan pada buku agamamu"]
            },
            MTs_Transisi: {
                eduTitle1: "Pilihan Jurusan MA/SMA", eduList1: ["Sangat adaptif di semua jurusan, perkuat pemetaan visual"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Multimedia", "DKV", "Tata Busana (Fashion Design)"],
                materi: ["Pengenalan Profesi Desain & Kreatif", "Strategi Belajar Visual untuk Ujian Akhir"], layanan: ["Tes Minat Bakat Visual-Spasial"],
                guruBk: ["Gunakan video dokumenter atau brosur bergambar untuk menjelaskan pilihan sekolah lanjutan"], siswa: ["Jika kamu sangat suka menggambar dan melihat keindahan, SMK jurusan desain/multimedia bisa jadi pilihan tepat!"]
            },
            // -- SMA --
            SMA_Awal: {
                eduTitle1: "Strategi Belajar (Fase E/F)", eduList1: ["Gunakan sticky notes warna-warni untuk target belajar", "Cari video ilustrasi (YouTube) untuk konsep sains yang rumit"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Desain UI/UX tingkat pemula", "Mampu membaca diagram/grafik data kompleks"],
                materi: ["Pemahaman Tabel & Kurva Ekonomi/Sains", "Presentasi Visual Profesional"], layanan: ["Bimbingan cara presentasi menggunakan slide interaktif"],
                guruBk: ["Fasilitasi mading kelas sebagai area mind map raksasa untuk persiapan ujian"], siswa: ["Gunakan aplikasi pembuat mind map digital (seperti Miro/Canva) untuk merangkum pelajaran"]
            },
            SMA_Transisi: {
                eduTitle1: "Persiapan UTBK/PTN", eduList1: ["Pelajari tipe soal Figural/Gambar (TPS UTBK)", "Visualisasikan rumus matematika menjadi bentuk geometri nyata"],
                eduTitle2: "Alternatif Karier", eduList2: ["Asisten Desainer", "Staf Administrasi Dokumen Visual"],
                materi: ["Trik Cepat Soal Figural UTBK", "Manajemen Waktu Visual (Kalender/Kanban Board)"], layanan: ["Tryout khusus soal pola visual/gambar"],
                guruBk: ["Bantu siswa merancang kalender visual raksasa (Timeline) menuju hari-H UTBK"], siswa: ["Perkuat insting matamu dalam mengerjakan soal penalaran gambar/figural di TPS SNBT"]
            },
            // -- MA --
            MA_Awal: {
                eduTitle1: "Strategi Belajar (Fase E/F)", eduList1: ["Membuat bagan/tabel perbedaan mazhab fikih (perbandingan)", "Mengubah materi hafalan sejarah Islam menjadi infografis timeline"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Mendesain materi presentasi dakwah/P5", "Penguasaan dasar tipografi Arab/Khat"],
                materi: ["Pemahaman Grafik dan Kurva Sains/Ekonomi", "Teknik Presentasi Visual Menarik"], layanan: ["Pendampingan pembuatan media belajar visual"],
                guruBk: ["Gunakan media papan kanban visual untuk melacak progres tugas akhir/hafalan siswa"], siswa: ["Rangkum materi yang tebal (seperti Sejarah Kebudayaan Islam) menjadi infografis garis waktu (timeline) yang berwarna"]
            },
            MA_Transisi: {
                eduTitle1: "Persiapan UTBK/PTKIN", eduList1: ["Fokus pada materi soal Figural (Pola Gambar) di UTBK", "Ubah rumus/konsep menjadi singkatan jembatan keledai visual"],
                eduTitle2: "Alternatif Karier", eduList2: ["Freelance Ilustrator/Desainer Grafis", "Admin Sosmed Pemula"],
                materi: ["Trik Mengerjakan Soal Figural (Penalaran Gambar)", "Time Management Berbasis Kalender Visual"], layanan: ["Tryout intensif penalaran spasial dan visual"],
                guruBk: ["Bantu siswa merancang *Countdown Board* (Papan Hitung Mundur) hari-H ujian di dinding kamarnya"], siswa: ["Latih ketelitian matamu, banyak-banyak kerjakan latihan soal UTBK tipe figural dan deret ruang!"]
            },
            // -- SMK --
            SMK_Awal: {
                eduTitle1: "Fokus Praktik Kejuruan", eduList1: ["Pahami SOP (Standar Operasional) melalui flowchart/diagram alir", "Banyak melihat tutorial video praktik industri di YouTube"],
                eduTitle2: "Persiapan Magang/PKL", eduList2: ["Perhatikan langkah kerja instruktur/mandor dengan saksama", "Buat catatan checklist visual untuk persiapan alat kerja"],
                materi: ["Membaca Gambar Kerja/Blueprint (Teknik)", "Desain Mockup (IT/Bisnis)"], layanan: ["Pelatihan membaca instruksi kerja visual standar industri"],
                guruBk: ["Gunakan bagan alur (flowchart) saat menjelaskan aturan tata tertib dan sanksi PKL"], siswa: ["Selalu perhatikan gambar atau simbol peringatan K3 (Keselamatan Kerja) di bengkel/laboratorium!"]
            },
            SMK_Transisi: {
                eduTitle1: "Persiapan Rekrutmen Kerja", eduList1: ["Buat CV/Resume ATS Friendly yang rapi secara tata letak visual", "Siapkan portofolio visual (Desain/Foto/Video produk hasil praktik)"],
                eduTitle2: "Alternatif Studi Lanjut Vokasi", eduList2: ["D4 Animasi", "D3 Desain Komunikasi Visual (DKV)", "D3 Arsitektur"],
                materi: ["Tips Penampilan Visual Profesional saat Wawancara", "Psikotes Spasial/Gambar (Kertas Koran, Rotasi 3D)"], layanan: ["Simulasi Psikotes Kerja (Fokus tes Ketelitian dan Spasial Visual)"],
                guruBk: ["Cek dan koreksi tata letak (layout) CV siswa agar terlihat profesional dan mudah dibaca (eye-catching) oleh HRD"], siswa: ["Penampilan visualmu (pakaian, kerapian rambut) adalah hal pertama yang dinilai saat wawancara. Berpakaianlah dengan sangat rapi!"]
            }
        }
    },
    A: {
        title: "Auditori", indonesianTitle: "Auditori (Pendengaran)",
        desc: "Kamu lebih mudah mengingat informasi melalui suara dan pendengaran. Berdiskusi, mendengarkan penjelasan langsung, atau membaca dengan bersuara adalah cara belajar terbaikmu.",
        karir: ["Penyiar/Podcaster", "Penerjemah", "Musisi", "Customer Service", "Konselor"], freelance: ["Voice Over Talent", "MC/Host"],
        levels: {
            SD_Awal: {
                eduTitle1: "Metode Belajar", eduList1: ["Mendengarkan cerita/dongeng dari guru", "Mengeja kata dengan suara lantang"],
                eduTitle2: "Karakteristik", eduList2: ["Mudah hafal lagu atau jingle iklan", "Suka berbicara dan bercerita kepada teman"],
                materi: ["Latihan Mendengarkan (Menyimak)", "Bernyanyi Sambil Belajar"], layanan: ["Bimbingan melalui cerita/storytelling"],
                guruBk: ["Gunakan intonasi suara yang menarik saat memberikan nasihat pada anak"], siswa: ["Baca buku pelajaranmu sambil bersuara pelan agar lebih ingat"]
            },
            SD_Akhir: {
                eduTitle1: "Metode Belajar", eduList1: ["Belajar kelompok dan saling melempar pertanyaan lisan", "Mendengarkan instruksi lisan dari guru"],
                eduTitle2: "Karakteristik", eduList2: ["Terkadang menggerakkan bibir atau bergumam saat membaca", "Suka ikut diskusi kelas"],
                materi: ["Latihan Berbicara di Depan Kelas", "Mendengarkan Cerpen (Audiobook)"], layanan: ["Konseling kelompok berbasis diskusi"],
                guruBk: ["Biarkan anak menjelaskan permasalahannya secara verbal tanpa dipotong"], siswa: ["Ajak temanmu untuk tebak-tebakan materi pelajaran secara lisan"]
            },
            SD_Transisi: {
                eduTitle1: "Target Lingkungan SMP", eduList1: ["SMP yang sering menerapkan diskusi kelompok aktif", "SMP dengan ekskul paduan suara/musik yang bagus"],
                eduTitle2: "Persiapan Ekskul SMP", eduList2: ["Klub Debat Junior", "Klub Broadcasting/Radio Sekolah"],
                materi: ["Keterampilan Presentasi Dasar", "Teknik Mendengarkan Aktif (Active Listening)"], layanan: ["Latihan public speaking dasar"],
                guruBk: ["Ajak anak berdiskusi tanya-jawab mengenai kekhawatirannya masuk SMP"], siswa: ["Mulai biasakan mendengarkan penjelasan guru tanpa banyak mengobrol di kelas"]
            },
            MI_Awal: {
                eduTitle1: "Metode Belajar Islami", eduList1: ["Menghafal surah pendek dengan metode talqin/talaqqi (mendengar berulang)", "Mendengarkan murattal Al-Quran"],
                eduTitle2: "Karakteristik Dasar", eduList2: ["Mudah menghafal lirik lagu Islami/Nasyid", "Suka berbicara dan menceritakan kembali kisah Nabi"],
                materi: ["Menyimak Kisah Teladan (Audio/Cerita)", "Latihan Melafalkan Doa Harian dengan Suara"], layanan: ["Bimbingan dengan metode *Storytelling* (Bercerita)"],
                guruBk: ["Gunakan intonasi dan variasi suara yang menarik saat menceritakan kisah tauladan"], siswa: ["Ucapkan hafalan doa-doamu dengan suara agar cepat hafal!"]
            },
            MI_Akhir: {
                eduTitle1: "Metode Belajar Islami", eduList1: ["Saling setoran hafalan berpasangan dengan teman", "Belajar tajwid melalui nyanyian atau irama"],
                eduTitle2: "Tanggung Jawab/Prestasi", eduList2: ["Klub Paduan Suara/Qasidah", "Klub Muhadharah/Pidato Cilik"],
                materi: ["Latihan Tilawah/Seni Baca Al-Quran", "Diskusi Kelompok (Menyimak)"], layanan: ["Konseling berbasis dialog interaktif"],
                guruBk: ["Biarkan siswa menceritakan atau mempresentasikan ide-idenya secara verbal (lisan)"], siswa: ["Bacalah materi pelajaran sekolahmu sambil bersuara pelan di rumah"]
            },
            MI_Transisi: {
                eduTitle1: "Target Lingkungan MTs/SMP", eduList1: ["MTs yang unggul di bidang tahfidz berbasis *Simaan* (Audio)", "MTs dengan program bahasa Arab/Inggris percakapan (Muhadasah)"],
                eduTitle2: "Persiapan Ekskul", eduList2: ["Grup Nasyid/Rebana/Hadrah", "Klub Pidato Tiga Bahasa"],
                materi: ["Latihan Presentasi Dasar", "Teknik Menyimak Efektif (Active Listening)"], layanan: ["Simulasi wawancara dan diskusi SMP"],
                guruBk: ["Diskusikan dan tanya jawab (Tanya-Jawab lisan) mengenai minat dan kebingungannya memilih MTs"], siswa: ["Ajak teman sebangkumu untuk bermain tebak-tebakan pelajaran secara lisan!"]
            },
            SMP_Awal: {
                eduTitle1: "Strategi Belajar", eduList1: ["Merekam penjelasan guru (Voice Note) dan memutarnya ulang", "Membaca nyaring materi hafalan"],
                eduTitle2: "Karakteristik", eduList2: ["Suka belajar sambil mendengarkan musik (instrumental)", "Mudah terganggu oleh suara bising atau obrolan lain"],
                materi: ["Manajemen Diskusi Kelompok", "Latihan Intonasi Berbicara"], layanan: ["Konseling dialog interaktif"],
                guruBk: ["Fokus pada intonasi dan komunikasi verbal (konseling tatap muka langsung)"], siswa: ["Rekam suaramu sendiri saat merangkum pelajaran, lalu dengarkan saat akan tidur"]
            },
            SMP_Transisi: {
                eduTitle1: "Pilihan Jurusan SMA/MA", eduList1: ["Jurusan Bahasa (Cocok untuk Linguistik/Sastra)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Broadcasting/Penyiaran", "Pariwisata (Tour Guide)", "Administrasi Perkantoran"],
                materi: ["Pengenalan Karir Komunikasi & Bahasa", "Persiapan Ujian Listening (Bahasa Inggris)"], layanan: ["Konseling karir berbasis dialog lisan"],
                guruBk: ["Lakukan wawancara lisan mendalam untuk mengeksplorasi minat karirnya"], siswa: ["Jika kamu suka bicara, pertimbangkan masuk jurusan yang memperbanyak praktik bahasa atau komunikasi (Misal SMK Broadcasting/Pariwisata)"]
            },
            MTs_Awal: {
                eduTitle1: "Strategi Belajar", eduList1: ["Menghafal (Tahfidz) dengan metode mendengarkan Murattal Syaikh Misyari Rasyid (atau lainnya)", "Rekam penjelasan ustadz/ustadzah lalu putar ulang"],
                eduTitle2: "Karakteristik", eduList2: ["Cepat menangkap nada/irama saat belajar seni Tilawah/Tajwid", "Suka belajar kelompok sambil diskusi (Simaan)"],
                materi: ["Teknik Menghafal dengan Audio (Talaqqi)", "Latihan Public Speaking (Muhadharah)"], layanan: ["Layanan Bimbingan Kelompok (Diskusi Forum)"],
                guruBk: ["Gunakan teknik konseling lisan yang interaktif dan banyak mendengarkan curhatan siswa (*Active Listening*)"], siswa: ["Rekam suaramu sendiri saat membaca rangkuman pelajaran, lalu dengarkan kembali sebagai podcast belajarmu!"]
            },
            MTs_Transisi: {
                eduTitle1: "Pilihan Jurusan MA/SMA", eduList1: ["Jurusan Bahasa & Budaya (Fokus Sastra/Linguistik)", "Ilmu Agama (Fokus Tafsir, Hadis, Ceramah)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Broadcasting & Perfilman", "Pariwisata (Tour Guide)"],
                materi: ["Pengenalan Karir Bidang Komunikasi/Media", "Persiapan Listening Test Bahasa Inggris/Arab"], layanan: ["Wawancara Eksplorasi Karir"],
                guruBk: ["Lakukan wawancara dua arah (tanya jawab) untuk memetakan cita-cita dan minat siswa"], siswa: ["Jika kamu sangat suka bicara dan mendengarkan, pertimbangkan jurusan Bahasa di MA atau Broadcasting di SMK!"]
            },
            SMA_Awal: {
                eduTitle1: "Strategi Belajar (Fase E/F)", eduList1: ["Mencari materi dari Podcast edukasi (seperti Spotify/YouTube Edu)", "Belajar kelompok (Diskusi dan Debat ringan)"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Keterampilan Presentasi dan MC (Master of Ceremony)", "Mampu memimpin rapat secara verbal"],
                materi: ["Teknik Negosiasi dan Lobi", "Peningkatan Skill Listening Bahasa Asing"], layanan: ["Bimbingan karir melalui podcast/audio sekolah"],
                guruBk: ["Berikan tugas berupa *Voice Note* atau rekaman wawancara sebagai pengganti tugas tertulis"], siswa: ["Buatlah kelompok diskusi rutin seminggu sekali untuk membahas pelajaran yang sulit"]
            },
            SMA_Transisi: {
                eduTitle1: "Persiapan UTBK/PTN", eduList1: ["Manfaatkan video pembahasan UTBK secara lisan di YouTube", "Jelaskan ulang materi UTBK ke teman (Tutor Sebaya)"],
                eduTitle2: "Alternatif Karier", eduList2: ["Customer Service / Call Center", "Voice Over Talent / Podcaster Pemula"],
                materi: ["Strategi Lulus Ujian Wawancara (PTN Kedinasan)", "Trik Listening TOEFL/IELTS Lanjutan"], layanan: ["Simulasi wawancara masuk kampus kedinasan/internasional"],
                guruBk: ["Bantu siswa menyimulasikan wawancara beasiswa dengan format tanya-jawab langsung"], siswa: ["Cara terbaikmu belajar adalah dengan 'mengajar' (tutor sebaya). Jelaskan materi UTBK ke temanmu secara lisan!"]
            },
            MA_Awal: {
                eduTitle1: "Strategi Belajar (Fase E/F)", eduList1: ["Belajar materi Sosiologi/Sejarah lewat Podcast/Audiobook", "Belajar kelompok (Diskusi atau Debat terbuka materi Fikih Kontemporer)"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Mahir menjadi MC/Moderator atau Orator dakwah", "Kemampuan negosiasi dan lobi secara lisan"],
                materi: ["Public Speaking dan Retorika Dakwah", "Peningkatan Skill Listening (TOEFL/TOAFL)"], layanan: ["Radio/Podcast Madrasah (sebagai sarana bimbingan)"],
                guruBk: ["Beri siswa ruang untuk mengemukakan argumentasi/pendapat lisan secara panjang lebar saat konseling"], siswa: ["Gunakan aplikasi podcast (seperti Spotify) untuk mencari materi sejarah Islam atau motivasi belajar sambil berangkat sekolah"]
            },
            MA_Transisi: {
                eduTitle1: "Persiapan UTBK/PTKIN", eduList1: ["Simak video pembahasan UTBK/UM-PTKIN di YouTube (perhatikan penjelasan lisan tutor)", "Bentuk grup belajar dan jadilah 'Guru' (Tutor Sebaya) bagi temanmu"],
                eduTitle2: "Alternatif Karier", eduList2: ["Call Center / Customer Service", "Penyiar Radio/Voice Over (VO) Talent"],
                materi: ["Persiapan Wawancara (Interview) Beasiswa/Kedinasan", "Trik Listening Bahasa Arab (TOAFL) dan Inggris"], layanan: ["Simulasi Wawancara Masuk Kampus (Jalur Prestasi/Beasiswa)"],
                guruBk: ["Lakukan latihan simulasi wawancara (*Mock Interview*) bersama siswa agar ia makin luwes saat tes wawancara beasiswa"], siswa: ["Kamu akan cepat hafal materi jika kamu mengajarkannya kembali kepada orang lain. Buka kelompok belajarmu sendiri!"]
            },
            SMK_Awal: {
                eduTitle1: "Fokus Praktik Kejuruan", eduList1: ["Dengarkan penjelasan dan instruksi verbal dari guru bengkel/pembimbing dengan saksama", "Tanya jawab langsung saat menemukan mesin/alur kerja yang tidak dimengerti"],
                eduTitle2: "Persiapan Magang/PKL", eduList2: ["Latihan Komunikasi Efektif dengan pelanggan (Misal: Melayani tamu hotel/restoran)", "Simulasi bertelepon bisnis secara profesional (Telephone Courtesy)"],
                materi: ["Teknik Komunikasi Terapeutik/Profesional", "Bahasa Inggris Percakapan (Conversation for Business)"], layanan: ["Simulasi *Roleplay* layanan pelanggan (*Customer Service*)"],
                guruBk: ["Fokus pada intonasi dan tutur kata siswa. Ajarkan cara meminta maaf, meminta tolong, dan menyapa secara profesional untuk persiapan magang"], siswa: ["Banyaklah bertanya! Karena kamu tipe auditori, penjelasan lisan dari teknisi/senior di tempat magang adalah sumber ilmu utamamu."]
            },
            SMK_Transisi: {
                eduTitle1: "Persiapan Rekrutmen Kerja", eduList1: ["Latih artikulasi suara dan kepercayaan diri untuk sesi Interview HRD", "Siapkan jawaban-jawaban lisan untuk pertanyaan umum saat wawancara kerja"],
                eduTitle2: "Alternatif Studi Lanjut Vokasi", eduList2: ["D3 Hubungan Masyarakat (Public Relations)", "D3 Penyiaran (Broadcasting) / Radio", "D3 Bahasa Inggris/Asing untuk Pariwisata"],
                materi: ["Simulasi Interview Kerja (Wawancara Panel & Individu)", "Keterampilan Komunikasi Asertif (Tegas tapi Sopan)"], layanan: ["Sesi Latihan Intensif Wawancara Kerja HRD (Mock Interview) di Bursa Kerja Khusus"],
                guruBk: ["Jadilah 'HRD Galak' dalam simulasi wawancara agar mental siswa terasah saat menghadapi wawancara kerja sungguhan di industri"], siswa: ["Senjata terkuatmu ada di 'Cara Bicaramu'. Berlatihlah mengatur tempo, intonasi, dan kejernihan suara saat tes wawancara kerja nanti."]
            }
        }
    },
    K: {
        title: "Kinestetik", indonesianTitle: "Kinestetik (Gerakan)",
        desc: "Kamu tipe yang 'Learning by Doing'. Kamu paling cepat paham jika langsung mempraktikkan, bergerak, atau menyentuh objek pelajaran. Duduk diam terlalu lama mungkin membuatmu bosan.",
        karir: ["Mekanik", "Ahli Bedah", "Atlet", "Koki (Chef)", "Polisi/TNI"], freelance: ["Instruktur Tari/Senam", "Pengrajin/Crafter"],
        levels: {
            SD_Awal: {
                eduTitle1: "Metode Belajar", eduList1: ["Belajar menghitung menggunakan benda nyata (kelereng/lidi)", "Bermain tebak gaya (Charades)"],
                eduTitle2: "Karakteristik", eduList2: ["Sulit disuruh duduk diam di kelas", "Suka menyentuh atau memegang benda yang baru dilihat"],
                materi: ["Prakarya dan Kesenian (Meremas plastisin, melipat)", "Pendidikan Olahraga"], layanan: ["Fasilitas belajar di luar kelas (Outdoor learning)"],
                guruBk: ["Beri jeda istirahat (Ice Breaking) yang melibatkan gerakan tangan/badan saat bimbingan"], siswa: ["Gunakan jari tanganmu untuk membantu berhitung atau menghafal"]
            },
            SD_Akhir: {
                eduTitle1: "Metode Belajar", eduList1: ["Melakukan eksperimen sains (percobaan langsung)", "Bermain peran (Drama/Roleplay) sejarah"],
                eduTitle2: "Karakteristik", eduList2: ["Suka mengetuk-ngetuk meja atau menggerakkan kaki saat berpikir", "Suka tugas yang bersifat proyek/membuat barang"],
                materi: ["Kerajinan Tangan Dasar", "Praktik IPA Lingkungan"], layanan: ["Konseling sambil berjalan santai (Walking Counseling)"],
                guruBk: ["Ubah hukuman duduk diam menjadi hukuman gerak ringan (misal: membuang sampah, merapikan kursi)"], siswa: ["Bantulah guru menghapus papan tulis untuk melepaskan energi tubuhmu"]
            },
            SD_Transisi: {
                eduTitle1: "Target Lingkungan SMP", eduList1: ["SMP dengan fasilitas Laboratorium/Bengkel Prakarya yang bagus", "SMP dengan lapangan olahraga yang luas"],
                eduTitle2: "Persiapan Ekskul SMP", eduList2: ["Klub Olahraga", "Klub Tari/Teater Fisik"],
                materi: ["Pengenalan Kegiatan Praktikum Lanjutan", "Manajemen Energi dan Konsentrasi"], layanan: ["Orientasi ekstrakurikuler lapangan di SMP"],
                guruBk: ["Bantu anak menyalurkan kelebihan energinya ke ekskul fisik di SMP"], siswa: ["Berjalan-jalanlah kecil di dalam kamar saat kamu harus menghafal banyak materi"]
            },
            MI_Awal: {
                eduTitle1: "Metode Belajar Islami", eduList1: ["Praktik langsung gerakan wudhu dan shalat (tidak cuma teori)", "Menghafal sambil berjalan ringan (Metode kinetik)"],
                eduTitle2: "Karakteristik Dasar", eduList2: ["Cepat bosan jika harus duduk tegak menyimak ceramah lama", "Suka menyentuh tasbih, buku, atau alat tulis saat belajar"],
                materi: ["Praktik Ibadah Dasar", "Prakarya Lipat/Gunting (Motorik halus)"], layanan: ["Fasilitasi *Ice Breaking* / Senam ringan di sela bimbingan"],
                guruBk: ["Jangan paksa siswa ini duduk diam terlalu lama, berikan tugas fisik ringan (seperti membagikan lembar kerja)"], siswa: ["Gunakan jari tanganmu untuk menghitung atau menandai baris saat membaca Iqro"]
            },
            MI_Akhir: {
                eduTitle1: "Metode Belajar Islami", eduList1: ["Belajar sejarah (SKI) dengan metode bermain peran/drama (Roleplay)", "Eksperimen langsung sains/IPA di alam madrasah"],
                eduTitle2: "Tanggung Jawab/Prestasi", eduList2: ["Olahraga Tradisional Islami (Memanah ringan/Beladiri)", "Pramuka Regu Inti (Bongkar pasang tenda)"],
                materi: ["Kerajinan Tangan Dasar", "Pendidikan Olahraga dan Kebugaran"], layanan: ["Konseling Aktif (Berjalan atau di luar ruangan)"],
                guruBk: ["Lakukan sesi konseling individu di taman atau lapangan madrasah sambil berjalan santai (*Walking Counseling*)"], siswa: ["Bila mulai bosan belajar, regangkan badanmu atau berjalanlah sebentar untuk minum air putih"]
            },
            MI_Transisi: {
                eduTitle1: "Target Lingkungan MTs/SMP", eduList1: ["MTs dengan program ekstrakurikuler Bela Diri/Olahraga yang hebat", "MTs dengan Laboratorium IPA/Komputer yang sering dipakai praktik"],
                eduTitle2: "Persiapan Ekskul", eduList2: ["Pencak Silat (Pagar Nusa/Tapak Suci)", "Paskibra Madrasah"],
                materi: ["Pengenalan Lingkungan Praktikum Lapangan", "Manajemen Fokus dan Energi"], layanan: ["Simulasi kegiatan fisik ekstrakurikuler"],
                guruBk: ["Salurkan energi siswa yang 'tidak bisa diam' ini ke orientasi ekstrakurikuler fisik bergengsi di MTs nanti"], siswa: ["Cobalah hafalkan pelajaranmu sambil mondar-mandir pelan di dalam kamar, itu sangat membantumu!"]
            },
            SMP_Awal: {
                eduTitle1: "Strategi Belajar", eduList1: ["Berjalan mondar-mandir pelan sambil menghafal materi", "Ubah teori menjadi praktik langsung (misal: belajar fisika pakai karet gelang)"],
                eduTitle2: "Karakteristik", eduList2: ["Selalu ingin segera menggunakan alat lab (tidak sabar dengar teori)", "Banyak menggunakan gerakan tangan (gestur) saat bicara"],
                materi: ["Prakarya dan Kewirausahaan Dasar", "Manajemen Stres Berbasis Gerak (Relaksasi Otot)"], layanan: ["Pembuatan *Stress Ball* atau alat peraga sederhana"],
                guruBk: ["Sediakan benda kecil seperti squishy atau stress ball di ruang BK agar siswa kinestetik bisa memegangnya saat konseling"], siswa: ["Buat rangkuman materi menjadi potongan kecil (flashcard) agar tanganmu sibuk mengurutkannya"]
            },
            SMP_Transisi: {
                eduTitle1: "Pilihan Jurusan SMA/MA", eduList1: ["MIPA (Fokus banyak Praktikum Lab)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Teknik Otomotif / Mesin", "Tata Boga / Tata Busana", "Pariwisata / Perhotelan"],
                materi: ["Eksplorasi Karir Berbasis Fisik/Keterampilan", "Persiapan Ujian Praktik Sekolah"], layanan: ["Tes kecerdasan mekanikal / motorik kasar"],
                guruBk: ["Dorong siswa untuk mempertimbangkan masuk SMK karena mereka lebih unggul dalam 'Learning by Doing' (Praktik langsung)"], siswa: ["Apakah kamu gampang bosan dengan teori di buku? Pikirkan serius untuk masuk SMK tempat kamu bisa langsung kerja praktik di bengkel/dapur!"]
            },
            MTs_Awal: {
                eduTitle1: "Strategi Belajar", eduList1: ["Ubah teori Fikih menjadi praktik nyata (Praktik Tayammum, Shalat Jenazah, dll)", "Gunakan benda nyata/maket saat belajar sejarah"],
                eduTitle2: "Karakteristik", eduList2: ["Selalu antusias jika diajak masuk Laboratorium Komputer/IPA", "Banyak memakai gestur (gerakan tangan) saat bercerita"],
                materi: ["Praktik Ibadah Lanjutan", "Manajemen Fokus Belajar (Metode Pomodoro Aktif)"], layanan: ["Pembuatan alat peraga visual/fisik 3D untuk materi madrasah"],
                guruBk: ["Sediakan alat mainan pereda stres (stress-ball/squishy) di ruang BK agar siswa kinestetik nyaman saat sesi curhat"], siswa: ["Salin catatanmu menggunakan tangan (menulis manual). Gerakan menulis itu sangat membantu otot tanganmu mengingat materi!"]
            },
            MTs_Transisi: {
                eduTitle1: "Pilihan Jurusan MA/SMA", eduList1: ["MA Keterampilan (Ada kelas menjahit/elektronika/otomotif)", "MIPA (Fokus Praktikum Lab Kimia/Fisika)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Teknik Mesin / Otomotif", "Tata Boga / Perhotelan", "Agribisnis/Pertanian"],
                materi: ["Pengenalan Karir Keterampilan Tangan (Vokasi)", "Persiapan Ujian Praktik Akhir Madrasah"], layanan: ["Tes Minat Bakat Teknikal dan Mekanikal"],
                guruBk: ["Kuatkan dorongan bagi siswa ini untuk masuk ke SMK atau MA Program Keterampilan, karena ia bersinar saat 'Learning by Doing' (Praktek Langsung)"], siswa: ["Jika duduk mendengarkan teori membuatmu mengantuk, kamu WAJIB masuk sekolah Vokasi/SMK agar kamu bisa langsung praktek memegang alat berat!"]
            },
            SMA_Awal: {
                eduTitle1: "Strategi Belajar (Fase E/F)", eduList1: ["Belajar kelompok sambil makan ringan atau melakukan aktivitas fisik ringan", "Buat maket, model 3D, atau diorama untuk tugas akhir pelajaran"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Kemampuan bongkar-pasang barang (Hardware/Perkakas)", "Aktivitas Outdoor (Kepanduan/Pecinta Alam)"],
                materi: ["Praktikum Laboratorium Kimia/Fisika Lanjutan", "Pendidikan Kebugaran Jasmani"], layanan: ["Fasilitasi program relawan lapangan/Bakti Sosial"],
                guruBk: ["Jangan paksakan gaya belajar konvensional (duduk diam membaca), sarankan ia belajar dengan interval istirahat rutin (Pomodoro)"], siswa: ["Gunakan metode Pomodoro (25 menit fokus, 5 menit berdiri/jalan ambil air) agar tidak cepat jenuh di kamar"]
            },
            SMA_Transisi: {
                eduTitle1: "Persiapan UTBK/PTN", eduList1: ["Kerjakan tryout sambil mengunyah permen karet untuk merangsang saraf gerak", "Pindahkan materi ke flashcard dan hafalkan sambil berjalan"],
                eduTitle2: "Alternatif Karier", eduList2: ["TNI/Polri/Sekolah Kedinasan", "Instruktur Olahraga/Pelatih Muda", "Mekanik/Teknisi Pemula"],
                materi: ["Persiapan Tes Fisik/Kesamaptaan Kedinasan", "Manajemen Stres Ujian (Latihan Pernapasan & Gerak)"], layanan: ["Bimbingan fisik dan tes jasmani kedinasan"],
                guruBk: ["Cek kesiapan fisik (kesehatan mata, gigi, postur) jika siswa menargetkan sekolah kedinasan (Akpol/Akmil)"], siswa: ["Tulis ulang rumus UTBK menggunakan tanganmu sendiri berulang-ulang, ototmu (muscle memory) akan mengingatnya!"]
            },
            MA_Awal: {
                eduTitle1: "Strategi Belajar (Fase E/F)", eduList1: ["Buatlah maket (model fisik 3D) untuk proyek P5 atau tugas kelas", "Praktikum langsung (Misal: Praktik manasik haji, penyembelihan kurban)"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["PMR/Kesehatan Lapangan", "Aktivitas Pecinta Alam/Pramuka Penegak Madrasah"],
                materi: ["Praktikum Laboratorium Terpadu (Fase F)", "Pendidikan Jasmani & Kesehatan Reproduksi"], layanan: ["Fasilitasi dan dukung program bakti sosial lapangan"],
                guruBk: ["Ajarkan teknik relaksasi otot (Progressive Muscle Relaxation) jika ia terlihat gelisah atau stres menghadapi tumpukan tugas"], siswa: ["Gunakan teknik belajar Pomodoro! Belajar fokus 25 menit, lalu berdiri dan renggangkan badanmu selama 5 menit. Ulangi terus."]
            },
            MA_Transisi: {
                eduTitle1: "Persiapan UTBK/PTKIN", eduList1: ["Tulis ulang rumus/dalil berulang kali (Muscle Memory / Memori Otot)", "Kerjakan soal tryout sambil sesekali mengetuk jari atau mengunyah permen karet"],
                eduTitle2: "Alternatif Karier", eduList2: ["TNI/Polri/Sekolah Kedinasan", "Teknisi / Mekanik Pemula", "Pengrajin / Crafter / Koki Muda"],
                materi: ["Persiapan Kesamaptaan Jasmani (Tes Fisik Masuk Kedinasan)", "Manajemen Stres Ujian Berbasis Gerak Fisik"], layanan: ["Simulasi Ujian Fisik/Samapta (Lari, Pull-up, Push-up)"],
                guruBk: ["Pantau asupan gizi dan kebugaran fisik (BMI, mata, tinggi badan) jika siswa mengincar Akademi Militer, Polisi, atau ikatan dinas lainnya"], siswa: ["Otot tanganmu akan lebih mudah mengingat rumus dan kosakata baru jika kamu menulisnya sendiri berulang-ulang di atas kertas buram!"]
            },
            SMK_Awal: {
                eduTitle1: "Fokus Praktik Kejuruan", eduList1: ["Gunakan waktu di Bengkel/Laboratorium/Dapur Sekolah (Kitchen) semaksimal mungkin", "Sentuh, rasakan, dan hafalkan letak/bentuk setiap komponen mesin, bumbu, atau peralatan praktik"],
                eduTitle2: "Persiapan Magang/PKL", eduList2: ["Simulasi fisik menggunakan alat berat/mesin sesuai dengan standar industri K3", "Biasakan tubuh berdiri/bekerja dalam durasi lama (Stamina Kerja Industri)"],
                materi: ["Penerapan 5R (Ringkas, Rapi, Resik, Rawat, Rajin) di Area Praktik", "Standar Keselamatan dan Kesehatan Kerja (K3) Lapangan"], layanan: ["Pemantauan Kedisiplinan Pemakaian APD (Alat Pelindung Diri: Helm safety, Sepatu booth, dll)"],
                guruBk: ["Tanamkan *Awareness* (kesadaran) pada siswa kinestetik agar tidak bertindak ceroboh, terburu-buru, atau terlalu banyak bercanda saat mengoperasikan mesin berbahaya di bengkel"], siswa: ["Kelebihanmu adalah di tangan dan fisikmu! Pahami fungsi alat praktik dengan memegangnya langsung, tapi ingat, selalu ikuti buku panduan manual K3!"]
            },
            SMK_Transisi: {
                eduTitle1: "Persiapan Rekrutmen Kerja", eduList1: ["Fokus 100% pada pematangan Uji Kompetensi Keahlian (UKK) secara fisik/praktik langsung", "Persiapkan fisik, istirahat cukup sebelum mengikuti tes kemampuan kerja atau psikotes lapangan"],
                eduTitle2: "Alternatif Studi Lanjut Vokasi", eduList2: ["Politeknik Manufaktur / Teknik Mesin", "Sekolah Tinggi Pariwisata (Tata Boga/Kru Kapal Pesiar)", "Akademi Militer / Kepolisian"],
                materi: ["Simulasi Uji Praktik Kerja Lapangan (Hard-Skill Assessment)", "Manajemen Kelelahan Fisik di Lingkungan Industri (Fatigue Management)"], layanan: ["Penyaluran Kerja ke Sektor Industri Manufaktur, Pertambangan, Konstruksi, atau Hospitality (BKK)"],
                guruBk: ["Hubungkan bakat praktik siswa dengan industri yang memang membutuhkan tenaga kerja fisik tinggi (seperti pabrik Astra, industri kuliner, atau perkapalan)"], siswa: ["Saat tes melamar kerja, HRD/Penguji akan menyuruhmu mempraktikkan langsung (misal: mengelas, memasak, atau mengetik cepat). Tunjukkan kecekatan tanganmu dengan tenang dan profesional!"]
            }
        }
    }
};