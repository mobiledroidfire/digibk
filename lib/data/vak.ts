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

export type PhaseData = {
    eduTitle1: string; eduList1: string[];
    eduTitle2: string; eduList2: string[];
    materi: string[]; layanan: string[];
    guruBk: string[]; siswa: string[];
};

export type LevelData = {
    SD_Awal: PhaseData; SD_Akhir: PhaseData; SD_Transisi: PhaseData;
    SMP_Awal: PhaseData; SMP_Transisi: PhaseData;
    SMA_Awal: PhaseData; SMA_Transisi: PhaseData;
    SMK_Awal: PhaseData; SMK_Transisi: PhaseData;
    MI_Awal: PhaseData; MI_Akhir: PhaseData; MI_Transisi: PhaseData;
    MTs_Awal: PhaseData; MTs_Transisi: PhaseData;
    MA_Awal: PhaseData; MA_Transisi: PhaseData;
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
        desc: "Kamu memiliki keunggulan kecerdasan visual-spasial. Mengubah informasi menjadi bentuk gambar, diagram, dan warna adalah cara paling efektif untuk mengoptimalkan daya ingatmu.",
        karir: ["Desainer Grafis", "Arsitek", "Fotografer", "Ilustrator", "Pembuat Peta (Kartografer)"], freelance: ["Editor Video", "Desainer UI/UX"],
        levels: {
            SD_Awal: {
                eduTitle1: "Metode Belajar", eduList1: ["Penggunaan media flashcard bergambar", "Buku literasi visual (Full Color)"],
                eduTitle2: "Karakteristik", eduList2: ["Tertarik pada stimulus warna yang mencolok", "Observan terhadap ekspresi wajah sekitar"],
                materi: ["Literasi Visual Dasar", "Kreativitas Bentuk dan Warna"], layanan: ["Fasilitasi media poster edukasi interaktif"],
                guruBk: ["Gunakan alat peraga visual (alat peraga konkret) untuk mempertahankan atensi anak saat bimbingan."], siswa: ["Gunakan pensil warna favoritmu untuk mewarnai bagian buku yang penting, ya!"]
            },
            SD_Akhir: {
                eduTitle1: "Metode Belajar", eduList1: ["Pengenalan Peta Konsep (Mind Mapping)", "Media pembelajaran berbasis video/dokumenter"],
                eduTitle2: "Karakteristik", eduList2: ["Memiliki kecenderungan mencatat dengan rapi", "Mampu menghafal rute spasial dengan cepat"],
                materi: ["Keterampilan Presentasi Visual", "Pemetaan Ide Sederhana"], layanan: ["Bimbingan teknik merangkum berbasis visual"],
                guruBk: ["Ajak siswa memvisualisasikan aspirasi atau cita-citanya melalui media gambar (Art Therapy)."], siswa: ["Tempelkan jadwal pelajaran yang sudah kamu hias di dinding kamar agar mudah diingat."]
            },
            SD_Transisi: {
                eduTitle1: "Target Lingkungan SMP", eduList1: ["Sekolah dengan fasilitas multimedia (Proyektor) memadai", "Sekolah dengan kultur apresiasi karya visual (Mading aktif)"],
                eduTitle2: "Persiapan Ekskul SMP", eduList2: ["Klub Jurnalistik Visual", "Kesenian Lukis / Fotografi"],
                materi: ["Keterampilan Mencatat Visual Terstruktur", "Manajemen Informasi Visual"], layanan: ["Konseling persiapan adaptasi gaya belajar menengah"],
                guruBk: ["Fasilitasi siswa dengan teknik merangkum buku tebal menggunakan skema visual untuk persiapan SMP."], siswa: ["Mulai biasakan merangkum catatan pelajaran menggunakan tabel atau mind-map yang menarik."]
            },
            MI_Awal: {
                eduTitle1: "Metode Belajar Islami", eduList1: ["Pendekatan Iqro dengan blok warna penegas", "Media pembelajaran kisah Nabi berbasis animasi"],
                eduTitle2: "Karakteristik Dasar", eduList2: ["Apresiatif terhadap ornamen kaligrafi", "Observan meniru gerakan shalat secara visual"],
                materi: ["Pengenalan Huruf Hijaiyah Berwarna", "Keterampilan Menulis Arab Dasar"], layanan: ["Penyediaan instrumen flashcard Hijaiyah"],
                guruBk: ["Tarik atensi anak menggunakan media gambar bernuansa Islami yang interaktif dan kaya warna."], siswa: ["Warnai buku catatan tugasmu agar suasana belajar terasa lebih menyenangkan!"]
            },
            MI_Akhir: {
                eduTitle1: "Metode Belajar Islami", eduList1: ["Asosiasi hafalan doa dengan gambar ilustrasi", "Pembuatan karya poster dakwah mini"],
                eduTitle2: "Tanggung Jawab Akademik", eduList2: ["Merancang tata letak Mading kelas", "Menjaga keindahan dan kerapian ruang kelas"],
                materi: ["Seni Kaligrafi Tingkat Pemula", "Sejarah Kebudayaan Islam via Visual"], layanan: ["Pendampingan teknik hafalan berbasis memori visual"],
                guruBk: ["Arahkan siswa untuk mengubah narasi Sejarah Kebudayaan Islam menjadi bentuk komik atau garis waktu (timeline)."], siswa: ["Gunakan stiker penanda warna-warni pada Al-Quran untuk mempermudah target hafalanmu."]
            },
            MI_Transisi: {
                eduTitle1: "Target Lingkungan MTs", eduList1: ["Madrasah dengan sarana multimedia pendukung", "Madrasah yang memiliki pembinaan ekskul visual/kaligrafi"],
                eduTitle2: "Persiapan Ekskul", eduList2: ["Klub Seni Kaligrafi (Khat)", "Desain Grafis / Jurnalistik Madrasah"],
                materi: ["Manajemen Catatan Madrasah", "Pemetaan Ide Materi Akidah/Akhlak"], layanan: ["Konseling metode belajar visual tingkat menengah"],
                guruBk: ["Latih siswa menerapkan teknik 'Color-Coding' (kode warna) untuk membedakan dalil, definisi, dan contoh kasus."], siswa: ["Siapkan spidol atau stabilo berbeda warna untuk merapikan catatanmu di MTs nanti."]
            },
            SMP_Awal: {
                eduTitle1: "Strategi Belajar", eduList1: ["Implementasi teknik 'Color-Coding' pada catatan", "Transformasi teks panjang menjadi infografis naratif"],
                eduTitle2: "Karakteristik", eduList2: ["Daya tangkap meningkat drastis melalui media slide (PPT)", "Mudah terdistraksi oleh tata letak ruangan yang berantakan"],
                materi: ["Teknik Mind Mapping Lanjutan", "Keterampilan Membaca Pindai (Skimming/Scanning)"], layanan: ["Pelatihan teknik mencatat kreatif (Creative Note-taking)"],
                guruBk: ["Gunakan instrumen pemetaan visual (seperti mind-map) untuk membantu siswa menstrukturkan alur pikirannya saat konseling."], siswa: ["Terapkan teknik 'Color-Coding' pada catatan belajarmu untuk memperkuat daya ingat visualmu secara signifikan."]
            },
            SMP_Transisi: {
                eduTitle1: "Pilihan Jurusan SMA/MA", eduList1: ["Sangat adaptif di semua jurusan (MIPA/IPS) dengan catatan modifikasi metode visual"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Desain Komunikasi Visual (DKV)", "Multimedia / Animasi", "Arsitektur Dasar"],
                materi: ["Eksplorasi Karir Industri Kreatif", "Strategi Ujian Berbasis Kecerdasan Spasial"], layanan: ["Konsultasi arah bakat industri kreatif dan desain"],
                guruBk: ["Gunakan media video profil atau infografis kampus/jurusan untuk mempermudah siswa memvisualisasikan masa depannya."], siswa: ["Pertimbangkan jalur SMK DKV atau Multimedia jika kamu memiliki *passion* kuat dalam mengekspresikan ide melalui karya visual."]
            },
            MTs_Awal: {
                eduTitle1: "Strategi Belajar", eduList1: ["Pemetaan hukum tajwid menggunakan stabilo multi-warna", "Visualisasi silsilah sejarah Islam dalam bentuk bagan (Tree Diagram)"],
                eduTitle2: "Karakteristik", eduList2: ["Memiliki ketelitian tinggi dalam menyalin teks Arab", "Pemahaman materi optimal melalui proyektor slide"],
                materi: ["Teknik Visualisasi Materi Fikih", "Desain Media Dakwah Komunikasi Visual"], layanan: ["Pelatihan pembuatan catatan estetik (Aesthetic Notes)"],
                guruBk: ["Manfaatkan papan tulis atau kertas kosong untuk membuat bagan pemecahan masalah bersama siswa saat sesi konseling individu."], siswa: ["Gunakan tiga warna stabilo yang berbeda (misal: kuning untuk hukum tajwid, hijau untuk arti, merah untuk dalil) di buku catatan agamamu."]
            },
            MTs_Transisi: {
                eduTitle1: "Pilihan Jurusan MA/SMA", eduList1: ["Adaptif di Keagamaan maupun Umum, dengan pendekatan visual"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Multimedia / Broadcasting", "Desain Komunikasi Visual (DKV)", "Tata Busana"],
                materi: ["Pengenalan Profesi Industri Kreatif Digital", "Strategi Visual Mengerjakan Ujian Nasional"], layanan: ["Tes Penelusuran Minat Visual-Spasial"],
                guruBk: ["Sajikan brosur visual bergambar atau video dokumenter untuk membantu siswa merancang *roadmap* pendidikan lanjutannya."], siswa: ["Jika kamu memiliki apresiasi tinggi terhadap estetika dan karya visual, jurusan DKV atau Multimedia di jenjang vokasi bisa menjadi pilihan cerdas!"]
            },
            SMA_Awal: {
                eduTitle1: "Strategi Belajar (Fase E/F)", eduList1: ["Penggunaan instrumen Kanban Board / Sticky Notes untuk pelacakan tugas", "Integrasi video ilustrasi/animasi untuk materi MIPA yang abstrak"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Dasar-dasar Desain Antarmuka (UI/UX Design)", "Kemampuan analisis grafik dan kurva kompleks"],
                materi: ["Interpretasi Data Visual Terapan", "Teknik Presentasi Profesional Berbasis Slide"], layanan: ["Bimbingan teknik presentasi dan *Public Speaking* dengan media visual"],
                guruBk: ["Fasilitasi pembuatan *Vision Board* (Papan Impian) di kelas sebagai media pendorong motivasi intrinsik siswa."], siswa: ["Gunakan platform digital (seperti Miro, Notion, atau Canva) untuk merancang rangkuman pelajaran yang interaktif dan mudah diakses."]
            },
            SMA_Transisi: {
                eduTitle1: "Persiapan UTBK/PTN", eduList1: ["Latihan intensif pemecahan Pola Figural (Spasial) pada TPS UTBK", "Visualisasi rumus matematika abstrak ke dalam bentuk bangun ruang nyata"],
                eduTitle2: "Alternatif Karier", eduList2: ["Junior Graphic Designer", "Staf Administrasi Pengolahan Data Visual"],
                materi: ["Taktik Efisiensi Waktu Soal Figural", "Manajemen Waktu Visual (Gantt Chart / Kanban)"], layanan: ["Tryout Khusus Analisis Pola Spasial dan Visual"],
                guruBk: ["Bantu siswa merancang *Timeline Board* raksasa di ruang konseling untuk memvisualisasikan hitung mundur hari-H UTBK."], siswa: ["Latih ketajaman spasialmu. Soal-soal penalaran gambar (Figural) di UTBK bisa menjadi lumbung poin tertinggimu jika dilatih rutin."]
            },
            MA_Awal: {
                eduTitle1: "Strategi Belajar (Fase E/F)", eduList1: ["Transformasi perbandingan Mazhab Fikih ke dalam tabel komparasi visual", "Pembuatan infografis *Timeline* (Garis Waktu) untuk Sejarah Islam"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Desain materi presentasi proyek P5 yang estetik", "Pemahaman tata letak (layouting) dan tipografi Arab"],
                materi: ["Interpretasi Kurva dan Data Statistik", "Teknik Desain Presentasi Komunikatif"], layanan: ["Pendampingan pengembangan portofolio desain digital"],
                guruBk: ["Gunakan pendekatan *Visual Tracker* untuk membantu siswa memonitor kedisiplinan hafalan dan tugas akademik mereka."], siswa: ["Rangkumlah materi Sejarah Kebudayaan Islam yang tebal menjadi infografis garis waktu (*timeline*) berwarna agar jauh lebih mudah dihafal."]
            },
            MA_Transisi: {
                eduTitle1: "Persiapan UTBK/PTKIN", eduList1: ["Penguasaan materi TPS Figural (Penalaran Gambar)", "Modifikasi rumus/konsep kompleks menjadi jembatan keledai visual"],
                eduTitle2: "Alternatif Karier", eduList2: ["Freelance Ilustrator / Video Editor", "Social Media Administrator"],
                materi: ["Strategi Penguasaan Soal Figural (Spasial)", "Sistem Manajemen Waktu Visualisasi"], layanan: ["Tryout Intensif Penalaran Visual-Spasial"],
                guruBk: ["Arahkan siswa untuk menyusun portofolio visual digital yang profesional jika mereka membidik jalur SNBP Fakultas Seni/Desain."], siswa: ["Asah insting visualmu! Perbanyak latihan soal deret gambar dan spasial, karena tipe soal tersebut menuntut ketelitian mata yang sangat tinggi."]
            },
            SMK_Awal: {
                eduTitle1: "Fokus Praktik Kejuruan", eduList1: ["Mempelajari Standar Operasional (SOP) melalui *Flowchart* / Diagram Alir", "Observasi tutorial praktik industri berbasis video sebelum masuk bengkel"],
                eduTitle2: "Persiapan Magang/PKL", eduList2: ["Pengamatan presisi terhadap demonstrasi kerja instruktur", "Pembuatan *Checklist* visual untuk inspeksi kelengkapan APD"],
                materi: ["Membaca *Blueprint* / Gambar Kerja Industri", "Prinsip Estetika dan Desain Antarmuka"], layanan: ["Pelatihan literasi instruksi kerja visual standar industri"],
                guruBk: ["Gunakan diagram alur (*Flowchart*) yang jelas saat menyosialisasikan kode etik, tata tertib, dan sanksi PKL industri."], siswa: ["Selalu waspada dan perhatikan rambu-rambu peringatan K3 (Kesehatan & Keselamatan Kerja) berbentuk simbol visual di area bengkel!"]
            },
            SMK_Transisi: {
                eduTitle1: "Persiapan Rekrutmen Kerja", eduList1: ["Perancangan CV/Resume *ATS Friendly* dengan tata letak (*layout*) profesional", "Penyusunan portofolio digital berbasis visual (Desain, Foto, Mockup)"],
                eduTitle2: "Alternatif Studi Lanjut Vokasi", eduList2: ["D4 Program Studi Animasi / DKV", "D3 Arsitektur Bangunan", "Institut Seni Indonesia (ISI)"],
                materi: ["Etika Penampilan Visual Profesional untuk Wawancara", "Latihan Psikotes Spasial (Rotasi 3D, Tes Koran/Pauli)"], layanan: ["Simulasi Psikotes Rekrutmen (Fokus Akurasi Visual)"],
                guruBk: ["Lakukan peninjauan mendalam (*review*) terhadap tipografi dan tata letak CV siswa agar mencerminkan profesionalitas di mata HRD."], siswa: ["Beri perhatian penuh pada 'Kesan Pertama' (First Impression). Pakaian yang rapi dan bahasa tubuh yang baik adalah elemen visual utama saat wawancara kerja."]
            }
        }
    },
    A: {
        title: "Auditori", indonesianTitle: "Auditori (Pendengaran)",
        desc: "Kekuatan utamamu terletak pada kecerdasan linguistik dan pendengaran. Kamu akan memproses informasi secara optimal saat berdiskusi, mendengarkan, atau menjelaskan kembali sebuah materi.",
        karir: ["Penyiar/Podcaster", "Penerjemah", "Musisi", "Customer Service", "Konselor"], freelance: ["Voice Over Talent", "MC/Host"],
        levels: {
            SD_Awal: {
                eduTitle1: "Metode Belajar", eduList1: ["Penerapan metode *Storytelling* (Bercerita) interaktif", "Teknik mengeja fonetik dengan artikulasi lantang"],
                eduTitle2: "Karakteristik", eduList2: ["Reseptif terhadap nada, irama, dan *jingle* edukatif", "Sangat ekspresif saat menceritakan pengalaman keseharian"],
                materi: ["Keterampilan Menyimak Aktif (Active Listening)", "Belajar Berbasis Rima dan Irama"], layanan: ["Bimbingan klasikal berbasis dongeng/cerita inspiratif"],
                guruBk: ["Gunakan modulasi suara (intonasi, volume, jeda) yang dinamis untuk mempertahankan fokus anak saat memberi instruksi."], siswa: ["Cobalah membaca buku pelajaranmu sambil bersuara pelan agar materinya lebih mudah menempel di ingatan."]
            },
            SD_Akhir: {
                eduTitle1: "Metode Belajar", eduList1: ["Simulasi tanya-jawab lisan (Tutor Sebaya)", "Pemanfaatan media *Audiobook* (Buku Suara)"],
                eduTitle2: "Karakteristik", eduList2: ["Memiliki kecenderungan menggumam (sub-vokalisasi) saat membaca", "Aktif berpartisipasi dalam diskusi atau curah pendapat kelas"],
                materi: ["Keterampilan Berbicara di Depan Umum Dasar", "Latihan Konsentrasi Pendengaran"], layanan: ["Konseling kelompok dengan pendekatan diskusi (Group Sharing)"],
                guruBk: ["Fasilitasi siswa untuk mengartikulasikan masalah atau perasaannya secara verbal tanpa diinterupsi."], siswa: ["Ajak teman sebangkumu untuk saling memberi tebak-tebakan pelajaran secara lisan."]
            },
            SD_Transisi: {
                eduTitle1: "Target Lingkungan SMP", eduList1: ["Sekolah dengan budaya diskusi dan presentasi yang kuat", "Sekolah yang memiliki fasilitas ekstrakurikuler musik/paduan suara aktif"],
                eduTitle2: "Persiapan Ekskul SMP", eduList2: ["Klub Debat Junior", "Klub Penyiaran (Broadcasting/Radio Sekolah)"],
                materi: ["Dasar-Dasar *Public Speaking*", "Etika Berkomunikasi (Communication Courtesy)"], layanan: ["Latihan kepercayaan diri dalam presentasi lisan"],
                guruBk: ["Gunakan metode dialog interaktif dua arah saat membimbing anak memetakan kekhawatirannya menuju jenjang SMP."], siswa: ["Latihlah fokus pendengaranmu untuk menyimak penjelasan guru tanpa mudah terdistraksi obrolan teman di kelas."]
            },
            MI_Awal: {
                eduTitle1: "Metode Belajar Islami", eduList1: ["Pendekatan *Talaqqi* (Mendengar hafalan secara berulang)", "Pemanfaatan media audio *Murattal* Al-Quran anak"],
                eduTitle2: "Karakteristik Dasar", eduList2: ["Sangat responsif terhadap lantunan Nasyid atau selawat", "Senang menceritakan ulang kisah-kisah teladan Nabi"],
                materi: ["Menyimak Kisah Teladan (Audio/Cerita)", "Artikulasi Pelafalan Doa Harian"], layanan: ["Bimbingan dengan metode *Storytelling* Islami"],
                guruBk: ["Bangkitkan imajinasi anak melalui teknik bercerita (storytelling) dengan intonasi suara karakter yang beragam."], siswa: ["Lantunkan hafalan doa dan surah pendekmu dengan suara lantang agar kamu cepat hafal!"]
            },
            MI_Akhir: {
                eduTitle1: "Metode Belajar Islami", eduList1: ["Penerapan metode *Simaan* (Saling menyimak hafalan) berpasangan", "Mempelajari hukum tajwid melalui irama (Nagham)"],
                eduTitle2: "Tanggung Jawab Akademik", eduList2: ["Berpartisipasi aktif dalam ekstrakurikuler Qasidah/Paduan Suara", "Berlatih pidato (Muhadharah) atau kultum kelas"],
                materi: ["Pengenalan Seni Tilawah Al-Quran", "Dinamika Diskusi Kelompok"], layanan: ["Konseling individu berbasis *Active Listening* (Mendengar Aktif)"],
                guruBk: ["Berikan apresiasi saat siswa mampu mempresentasikan gagasan atau merangkum kajian agama secara lisan di depan kelas."], siswa: ["Bacalah rangkuman materi dari madrasah dengan cara disuarakan perlahan agar ingatanmu makin kuat."]
            },
            MI_Transisi: {
                eduTitle1: "Target Lingkungan MTs", eduList1: ["Madrasah dengan program unggulan Tahfidz berbasis *Simaan*", "Madrasah yang memiliki kultur percakapan Bahasa (Muhadasah)"],
                eduTitle2: "Persiapan Ekskul", eduList2: ["Tim Nasyid / Rebana / Hadrah", "Klub Pidato Multi-Bahasa"],
                materi: ["Keterampilan Presentasi Percaya Diri", "Teknik Menyimak Kritis (Critical Listening)"], layanan: ["Simulasi wawancara penjurusan madrasah tingkat menengah"],
                guruBk: ["Eksplorasi minat siswa melalui metode tanya-jawab lisan (wawancara ringan) mengenai rencana pendidikan lanjutannya."], siswa: ["Ajak teman sebangkumu untuk me-*review* materi pelajaran melalui diskusi ringan dan tebak-tebakan lisan."]
            },
            SMP_Awal: {
                eduTitle1: "Strategi Belajar", eduList1: ["Rekam materi penting menggunakan fitur *Voice Note* untuk diputar ulang", "Terapkan teknik *Read-Aloud* (Membaca nyaring) untuk teks hafalan"],
                eduTitle2: "Karakteristik", eduList2: ["Tingkat fokus meningkat saat belajar diiringi musik instrumental", "Sangat sensitif dan mudah terdistraksi oleh polusi suara/bising"],
                materi: ["Dinamika Forum Group Discussion (FGD)", "Manajemen Intonasi dan Artikulasi Komunikasi"], layanan: ["Konseling dialogis interaktif"],
                guruBk: ["Terapkan teknik *Client-Centered Therapy* yang memberikan porsi dominan bagi siswa untuk mencurahkan isi pikirannya secara verbal."], siswa: ["Cobalah merekam suaramu sendiri saat merangkum materi penting, lalu dengarkan rekamannya sebagai *podcast* belajarmu sebelum tidur."]
            },
            SMP_Transisi: {
                eduTitle1: "Pilihan Jurusan SMA/MA", eduList1: ["Jurusan Bahasa (Sangat sesuai untuk bakat Linguistik dan Sastra)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Broadcasting / Penyiaran", "Industri Pariwisata (Tour Guide)", "Layanan Perkantoran"],
                materi: ["Eksplorasi Karir Komunikasi Massa", "Strategi Menghadapi Ujian *Listening* Bahasa Asing"], layanan: ["Konseling karir berbasis eksplorasi naratif"],
                guruBk: ["Lakukan penggalian bakat (*probing*) melalui wawancara mendalam untuk memetakan arah karir komunikasi siswa."], siswa: ["Jika kamu mahir berkomunikasi dan suka berbicara, pertimbangkan jalur SMK Broadcasting atau Pariwisata sebagai sarana unjuk bakatmu."]
            },
            MTs_Awal: {
                eduTitle1: "Strategi Belajar", eduList1: ["Optimalkan hafalan (Tahfidz) dengan mendengarkan *Murattal* secara kontinu", "Perekaman penjelasan ustadz/ustadzah untuk bahan *review* di asrama"],
                eduTitle2: "Karakteristik", eduList2: ["Cepat mengadaptasi nada/irama (Nagham) pada seni Tilawah/Tajwid", "Sangat menikmati metode belajar kelompok (*Simaan*/Halaqah)"],
                materi: ["Teknik Memori Audio (*Audio-Spaced Repetition*)", "Keterampilan *Public Speaking* Islami (Muhadharah)"], layanan: ["Layanan Bimbingan Kelompok (FGD / Diskusi Forum)"],
                guruBk: ["Praktikkan *Empathic Listening* (Mendengarkan Penuh Empati) saat mengurai konflik pergaulan remaja yang dialami siswa."], siswa: ["Terapkan teknik *Feynman*: Jelaskan kembali materi Fikih atau Sejarah secara lisan seolah-olah kamu sedang mengajar temanmu."]
            },
            MTs_Transisi: {
                eduTitle1: "Pilihan Jurusan MA/SMA", eduList1: ["Jurusan Bahasa & Budaya (Fokus Sastra)", "Ilmu Agama (Fokus Dakwah, Tafsir, Hadis)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Broadcasting / Televisi & Radio", "Usaha Perjalanan Wisata (Pramuwisata)"],
                materi: ["Pengenalan Karir Jurnalistik dan Penyiaran", "Persiapan Ujian *Listening* (Bahasa Arab/Inggris)"], layanan: ["Wawancara Eksplorasi Minat Karir (Career Interview)"],
                guruBk: ["Validasi kemantapan pilihan siswa melalui diskusi dua arah yang menguji pemahamannya tentang jurusan yang akan dipilih."], siswa: ["Jika kamu piawai merangkai kata secara lisan, jurusan Ilmu Keagamaan (MA) atau Penyiaran (SMK) akan sangat cocok mengembangkan potensimu."]
            },
            SMA_Awal: {
                eduTitle1: "Strategi Belajar (Fase E/F)", eduList1: ["Pemanfaatan platform *Podcast* edukasi sebagai suplemen belajar utama", "Inisiasi kelompok belajar berbasis debat terbuka dan adu argumentasi"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Kecakapan menjadi Master of Ceremony (MC) atau Moderator", "Teknik memandu jalannya rapat organisasi secara komunikatif"],
                materi: ["Teknik Lobi dan Negosiasi Praktis", "Peningkatan Kompetensi *Listening* Bahasa Asing"], layanan: ["Fasilitasi program Bimbingan Karir melalui Radio/Podcast Sekolah"],
                guruBk: ["Izinkan siswa mengganti instrumen tugas tertulis dengan pengumpulan berbasis rekaman *Voice Note* atau *Podcast* jika memungkinkan."], siswa: ["Bentuklah forum belajar kelompok mingguan (*Study Group*). Berdiskusi secara lisan akan memangkas separuh waktu belajarmu secara mandiri."]
            },
            SMA_Transisi: {
                eduTitle1: "Persiapan UTBK/PTN", eduList1: ["Optimalisasi video pembahasan soal UTBK (Fokus pada narasi tutor)", "Penerapan metode *Tutor Sebaya* (Peer Tutoring) untuk materi Soshum/Saintek"],
                eduTitle2: "Alternatif Karier", eduList2: ["Customer Service / Call Center", "Voice Over Talent / *Podcaster* Pemula"],
                materi: ["Strategi Taktis Ujian Wawancara PTN / Kedinasan", "Manajemen Audio TOEFL/IELTS Lanjutan"], layanan: ["Simulasi *Mock Interview* (Wawancara Masuk Kampus/Beasiswa)"],
                guruBk: ["Selenggarakan simulasi wawancara (*Mock Interview*) intensif untuk mempersiapkan siswa menghadapi seleksi masuk Perguruan Tinggi/Kedinasan."], siswa: ["Terapkan metode belajar 'Tutor Sebaya'. Mengajarkan materi UTBK secara lisan kepada teman adalah cara paling ampuh menanamkan konsep di otakmu."]
            },
            MA_Awal: {
                eduTitle1: "Strategi Belajar (Fase E/F)", eduList1: ["Menggali materi literasi Sosiologi/Sejarah Islam melalui media *Audiobook*", "Penyelenggaraan kajian diskusi kelompok (Bahtsul Masail tingkat dasar)"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Kecakapan Retorika Dakwah, Orasi, dan Khutbah", "Teknik Resolusi Konflik melalui pendekatan dialogis (Lobi)"],
                materi: ["Retorika Lanjutan dan *Public Speaking*", "Peningkatan Kompetensi *Listening* (TOEFL / TOAFL)"], layanan: ["Bimbingan Konseling melalui saluran Radio/Podcast Madrasah"],
                guruBk: ["Sediakan ruang diskusi yang apresiatif bagi siswa untuk mengelaborasi argumentasi lisannya secara komprehensif saat konseling."], siswa: ["Manfaatkan durasi perjalanan ke madrasah dengan mendengarkan kajian audio atau rangkuman sejarah melalui *headset*."]
            },
            MA_Transisi: {
                eduTitle1: "Persiapan UTBK/PTKIN", eduList1: ["Review pembahasan soal UM-PTKIN via YouTube (Fokus pada alur penjelasan lisan)", "Konsolidasi pemahaman melalui pengajaran silang antar teman sebaya"],
                eduTitle2: "Alternatif Karier", eduList2: ["Customer Relation / Staf Layanan BMT", "Penyiar Radio Islami / *Voice Over Talent*"],
                materi: ["Persiapan Wawancara Beasiswa (PBSB/KIP-K)", "Taktik Mengerjakan Soal *Listening* Bahasa Arab (TOAFL)"], layanan: ["Simulasi Wawancara Beasiswa Jalur Prestasi"],
                guruBk: ["Latih artikulasi, proyeksi suara, dan kepercayaan diri siswa melalui simulasi wawancara (*Mock Interview*) yang menantang."], siswa: ["Buka kelas bimbingan kecil dengan teman-temanmu. Semakin sering kamu menjelaskan materi secara verbal, semakin kuat materi itu tersimpan di memori jangka panjangmu."]
            },
            SMK_Awal: {
                eduTitle1: "Fokus Praktik Kejuruan", eduList1: ["Interpretasi instruksi verbal mandor/instruktur bengkel secara presisi", "Proaktif melakukan konfirmasi (tanya-jawab lisan) terhadap prosedur kerja industri"],
                eduTitle2: "Persiapan Magang/PKL", eduList2: ["Latihan Komunikasi Profesional (*Business Courtesy*) dengan pelanggan", "Simulasi penerimaan keluhan (*Handling Complaint*) secara verbal"],
                materi: ["Komunikasi Terapeutik / Pelayanan Prima (*Service Excellence*)", "Percakapan Bisnis (*Business Conversation*) Tingkat Dasar"], layanan: ["Simulasi *Roleplay* skenario pelayanan pelanggan (Customer Service)"],
                guruBk: ["Fokuskan pembinaan pada intonasi, *manner* (kesopanan), dan *Telephone Courtesy* sebagai modal komunikasi siswa di dunia industri."], siswa: ["Kekuatanmu adalah komunikasimu. Jangan ragu bertanya secara lisan kepada teknisi/senior di tempat magang jika ada instruksi yang belum jelas."]
            },
            SMK_Transisi: {
                eduTitle1: "Persiapan Rekrutmen Kerja", eduList1: ["Penguasaan artikulasi dan intonasi persuasif untuk sesi *Interview* HRD", "Penyiapan naskah (*script*) verbal untuk menjawab pertanyaan wawancara menjebak"],
                eduTitle2: "Alternatif Studi Lanjut Vokasi", eduList2: ["D3 Hubungan Masyarakat (Public Relations)", "D3 Penyiaran (Broadcasting)", "D4 Bahasa Asing Terapan Pariwisata"],
                materi: ["Simulasi *Interview* Panel Rekrutmen Perusahaan", "Keterampilan Komunikasi Asertif di Lingkungan Kerja"], layanan: ["Pelatihan Intensif *Mock Interview* Bersama Praktisi HRD di Bursa Kerja Khusus"],
                guruBk: ["Ciptakan suasana simulasi *Interview* yang penuh tekanan (*stress interview*) agar mental komunikasi siswa terasah tangguh di hadapan HRD industri."], siswa: ["Senjata terhebatmu dalam melamar kerja adalah 'Cara Bicaramu'. Latih ketenangan, kejernihan suara, dan kontak matamu secara profesional!"]
            }
        }
    },
    K: {
        title: "Kinestetik", indonesianTitle: "Kinestetik (Gerakan)",
        desc: "Kamu adalah pembelajar tipe *Learning by Doing*. Otakmu memproses informasi paling optimal ketika tubuhmu bergerak, menyentuh, atau mempraktikkan langsung objek pelajaran tersebut.",
        karir: ["Mekanik", "Ahli Bedah", "Atlet", "Koki (Chef)", "Polisi/TNI"], freelance: ["Instruktur Tari/Senam", "Pengrajin/Crafter"],
        levels: {
            SD_Awal: {
                eduTitle1: "Metode Belajar", eduList1: ["Penggunaan media ajar manipulatif (benda konkret seperti balok/kelereng)", "Pembelajaran berbasis gerak dan lagu (Kinesthetic-Musical)"],
                eduTitle2: "Karakteristik", eduList2: ["Memiliki rentang atensi pendek jika diwajibkan duduk statis", "Memiliki dorongan taktil (menyentuh) pada objek yang baru dikenali"],
                materi: ["Prakarya Motorik Halus (Origami, Plastisin)", "Pendidikan Jasmani (Motorik Kasar)"], layanan: ["Fasilitasi *Outdoor Learning* (Belajar di luar ruang)"],
                guruBk: ["Sisipkan *Brain Breaks* (Jeda Gerak Singkat) atau *Ice Breaking* fisik agar anak tidak frustrasi selama sesi bimbingan panjang."], siswa: ["Gunakan jari-jari tanganmu untuk membantu mengingat atau mempraktikkan pelajaran, ya!"]
            },
            SD_Akhir: {
                eduTitle1: "Metode Belajar", eduList1: ["Simulasi sains melalui eksperimen langsung (*Hands-on Activity*)", "Penerapan metode *Roleplay* (Bermain peran) untuk pelajaran sejarah"],
                eduTitle2: "Karakteristik", eduList2: ["Sering mengetukkan alat tulis atau menggerakkan kaki saat berpikir", "Memiliki antusiasme tinggi pada tugas berbasis proyek kreatif"],
                materi: ["Keterampilan Motorik Terapan", "Praktikum IPA Lingkungan"], layanan: ["Konseling pendampingan bergerak (*Walking Counseling*)"],
                guruBk: ["Transformasikan sanksi duduk diam di kelas menjadi sanksi motorik ringan yang positif (misal: membersihkan rak buku kelas)."], siswa: ["Tawarkan bantuan kepada guru untuk membagikan buku di kelas agar energi tubuhmu tersalurkan dengan baik."]
            },
            SD_Transisi: {
                eduTitle1: "Target Lingkungan SMP", eduList1: ["Sekolah yang dilengkapi infrastruktur Laboratorium dan Bengkel Prakarya memadai", "Sekolah dengan fasilitas Gelanggang Olahraga terpadu"],
                eduTitle2: "Persiapan Ekskul SMP", eduList2: ["Klub Olahraga / Ekstrakurikuler Fisik", "Seni Teater Olah Tubuh / Tari"],
                materi: ["Pengenalan Budaya Praktikum Menengah", "Manajemen Energi dan Regulasi Diri"], layanan: ["Orientasi peminatan ekstrakurikuler lapangan SMP"],
                guruBk: ["Arahkan surplus energi kinetik siswa menuju seleksi ekstrakurikuler fisik bergengsi (Olahraga/Pramuka) di jenjang SMP."], siswa: ["Jika kesulitan menghafal sambil duduk, cobalah berjalan mondar-mandir pelan di dalam kamarmu."]
            },
            MI_Awal: {
                eduTitle1: "Metode Belajar Islami", eduList1: ["Praktikum integratif ibadah (Praktik Wudhu dan Shalat langsung)", "Metode hafalan kinetik (Bergerak repetitif ringan)"],
                eduTitle2: "Karakteristik Dasar", eduList2: ["Cenderung gelisah saat menyimak ceramah agama statis berdurasi panjang", "Memiliki reflek taktil seperti memainkan tasbih atau buku saku"],
                materi: ["Bimbingan Ibadah Praktis Dasar", "Penguatan Motorik Halus Islami (Memotong/Menempel)"], layanan: ["Fasilitasi peregangan fisik interaktif di sela bimbingan"],
                guruBk: ["Hindari intervensi yang mewajibkan siswa duduk kaku; libatkan mereka dalam tugas fisik kelas seperti menyiapkan papan tulis."], siswa: ["Gunakan jarimu untuk menunjuk dan mengikuti setiap baris huruf saat kamu membaca Iqro atau Al-Quran."]
            },
            MI_Akhir: {
                eduTitle1: "Metode Belajar Islami", eduList1: ["Simulasi Sejarah Kebudayaan Islam (SKI) melalui sosiodrama", "Eksplorasi ayat *Kauniyah* (IPA) secara langsung di alam terbuka"],
                eduTitle2: "Tanggung Jawab Akademik", eduList2: ["Berpartisipasi dalam Olahraga Sunnah (Panahan dasar/Bela Diri)", "Keterlibatan aktif dalam regu kepanduan (Bongkar pasang tenda)"],
                materi: ["Keterampilan Prakarya Madrasah", "Pendidikan Kebugaran dan Olahraga"], layanan: ["*Walking Counseling* (Konseling sambil berjalan di lapangan/taman)"],
                guruBk: ["Terapkan *Walking Counseling* di area terbuka madrasah untuk menciptakan suasana curhat yang rileks bagi siswa kinestetik."], siswa: ["Jika merasa pikiranmu jenuh saat belajar, regangkan otot-otot tubuhmu sebentar atau berjalanlah keluar untuk mencari udara segar."]
            },
            MI_Transisi: {
                eduTitle1: "Target Lingkungan MTs", eduList1: ["Madrasah dengan pembinaan ekskul Bela Diri/Olahraga terstruktur", "Madrasah yang secara aktif memanfaatkan Lab IPA untuk kegiatan praktik"],
                eduTitle2: "Persiapan Ekskul", eduList2: ["Perguruan Pencak Silat / Tapak Suci", "Paskibraka Madrasah tingkat dasar"],
                materi: ["Orientasi Lapangan Praktikum Menengah", "Teknik Regulasi Fokus dan Energi"], layanan: ["Simulasi kegiatan fisik ekstrakurikuler madrasah"],
                guruBk: ["Salurkan dorongan motorik berlebih siswa pada persiapan fisik seleksi ekstrakurikuler lapangan tingkat menengah."], siswa: ["Gunakan *Flashcard* atau kartu hafalan yang bisa kamu genggam dan urutkan menggunakan tangan agar belajar lebih interaktif!"]
            },
            SMP_Awal: {
                eduTitle1: "Strategi Belajar", eduList1: ["Terapkan metode memori kinetik (Mondar-mandir saat merapalkan hafalan)", "Konversi pemahaman teoritis MIPA ke medium eksperimen skala rumahan"],
                eduTitle2: "Karakteristik", eduList2: ["Sangat impulsif dan antusias saat berada di lingkungan Laboratorium", "Penggunaan bahasa isyarat (Gestur) tubuh secara masif saat berkomunikasi"],
                materi: ["Proyek Kewirausahaan dan Prakarya", "Manajemen Stres Berbasis Relaksasi Otot Kinetik"], layanan: ["Fasilitasi media manipulatif pereda stres (*Stress Ball / Fidget Spinner*)"],
                guruBk: ["Sediakan instrumen pereda stres kinestetik (seperti *squishy* atau *stress ball*) di ruang BK untuk menjaga fokus siswa saat sesi konseling."], siswa: ["Pecah materi catatanmu menjadi bagian kecil (seperti *Flashcard*) agar tanganmu aktif menyusun dan mengurutkannya secara fisik."]
            },
            SMP_Transisi: {
                eduTitle1: "Pilihan Jurusan SMA/MA", eduList1: ["Peminatan MIPA (Optimal pada aktivitas Praktikum Laboratorium intensif)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Teknik Kendaraan Ringan (Otomotif) / Permesinan", "Tata Boga / Tata Busana / Perhotelan", "Agribisnis"],
                materi: ["Eksplorasi Karir Industri Berbasis *Hard-Skill*", "Persiapan Mental Ujian Praktik Sekolah"], layanan: ["Tes Asesmen Kecerdasan Mekanikal dan Motorik Kasar"],
                guruBk: ["Edukasi siswa dan wali murid mengenai keunggulan siswa di ranah Vokasi (SMK), di mana metode *Learning by Doing* adalah kurikulum utamanya."], siswa: ["Jika metode belajar berbasis teori membuatmu cepat bosan, pertimbangkan matang-matang untuk memilih jalur Vokasi (SMK) yang mengutamakan praktik industri riil."]
            },
            MTs_Awal: {
                eduTitle1: "Strategi Belajar", eduList1: ["Realisasi materi Fikih ibadah murni melalui simulasi gerak (Praktik Tayammum/Shalat Jenazah)", "Pemanfaatan instrumen maket/diorama tiga dimensi untuk mata pelajaran Sejarah"],
                eduTitle2: "Karakteristik", eduList2: ["Menunjukkan atensi penuh saat diajak melakukan observasi di luar ruang kelas", "Cenderung responsif dan komunikatif melalui gerakan tubuh dan tangan"],
                materi: ["Praktikum Ibadah Komprehensif", "Manajemen Atensi (Teknik Pomodoro Aktif)"], layanan: ["Pembuatan Proyek Karya Visual-Kinetik Berbasis 3D"],
                guruBk: ["Hargai kebutuhan gerak siswa; jangan paksa mereka melakukan kontak mata statis jika gerakan tangan membantu mereka mengartikulasikan masalah."], siswa: ["Menulislah dengan tangan! Gerakan fisik menulis manual menciptakan 'Memori Otot' (*Muscle Memory*) yang sangat ampuh mengunci ingatanmu."]
            },
            MTs_Transisi: {
                eduTitle1: "Pilihan Jurusan MA/SMA", eduList1: ["MA Program Plus Keterampilan (Otomotif/Tata Busana/Kelistrikan)", "MIPA (Fokus Eksperimental)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Teknik Rekayasa & Otomotif", "Hospitality (Pariwisata/Perhotelan)", "Teknik Komputer & Jaringan (Hardware)"],
                materi: ["Pengenalan Karir Keterampilan Tangan Profesional Vokasi", "Strategi Fisik Menghadapi Ujian Praktik Akhir"], layanan: ["Simulasi Tes Minat Bakat Ranah Teknikal dan Praktikal"],
                guruBk: ["Berikan validasi positif bahwa kecerdasan kinestetik mereka adalah aset krusial untuk sukses di sekolah Vokasi atau MA Keterampilan."], siswa: ["Kamu adalah aset berharga bagi dunia industri. Masuklah ke SMK atau MA Keterampilan agar kehebatan tanganmu bisa langsung dipraktikkan!"]
            },
            SMA_Awal: {
                eduTitle1: "Strategi Belajar (Fase E/F)", eduList1: ["Implementasi pembelajaran berbasis proyek (*Project-Based Learning*) seperti perakitan maket MIPA/IPS", "Mengkonsumsi camilan ringan (*Snacking*) untuk menstimulasi saraf motorik rahang saat belajar"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Kecakapan perakitan komponen perangkat keras (*Hardware/Troubleshooting*)", "Daya tahan fisik (*Endurance*) pada aktivitas lapangan ekstrem (Pecinta Alam/SAR)"],
                materi: ["Praktikum Eksperimental Laboratorium Lanjutan", "Manajemen Pendidikan Kebugaran Jasmani"], layanan: ["Fasilitasi program Bakti Sosial / Relawan Lapangan Eksternal"],
                guruBk: ["Sarankan penerapan teknik *Pomodoro* (interval fokus-istirahat aktif) untuk mencegah sindrom kelelahan kognitif (*Burnout*) pada siswa."], siswa: ["Gunakan interval *Pomodoro*. Belajarlah fokus selama 25 menit, lalu gunakan 5 menit jeda untuk berdiri, melakukan peregangan, atau berjalan mengambil minum."]
            },
            SMA_Transisi: {
                eduTitle1: "Persiapan UTBK/PTN", eduList1: ["Pengunyahan permen karet bebas gula selama simulasi Tryout untuk merangsang sirkulasi darah ke otak", "Mentransfer formula matematika kompleks ke dalam gerakan atau gestur spesifik"],
                eduTitle2: "Alternatif Karier", eduList2: ["Akademi Militer/Kepolisian (TNI/Polri)", "Instruktur Kebugaran/Pelatih Muda Olahraga", "Teknisi Industri / Mekanik Entry-Level"],
                materi: ["Persiapan Tes Kesamaptaan Jasmani Kedinasan", "Regulasi Stres Ujian Berbasis Relaksasi Fisik"], layanan: ["Pendampingan Medis dan Fisik Syarat Pendaftaran Kedinasan"],
                guruBk: ["Lakukan monitoring indeks kebugaran (Postur, BMI, Buta Warna, THT) secara dini jika siswa menargetkan masuk Akademi Kedinasan."], siswa: ["Tulis ulang rumus-rumus abstrak UTBK secara berulang-ulang di atas kertas buram. Otot tanganmu (*Muscle Memory*) akan membantumu mengingatnya saat tes!"]
            },
            MA_Awal: {
                eduTitle1: "Strategi Belajar (Fase E/F)", eduList1: ["Pembuatan karya instalasi fisik/Maket 3D untuk menunjang proyek Profil Pelajar Pancasila (P5)", "Simulasi tata cara manasik haji atau fikih penyembelihan kurban secara aplikatif di lapangan"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Kecakapan teknis Palang Merah Remaja (PMR/Kesehatan Lapangan Dasar)", "Keterampilan *Survival* pada ekstrakurikuler Pramuka Penegak Madrasah"],
                materi: ["Eksplorasi Praktikum Biologi/Kimia Terpadu (Fase F)", "Anatomi Fisiologi dan Pendidikan Kesehatan Remaja"], layanan: ["Dukungan institusional untuk program pengabdian masyarakat lapangan"],
                guruBk: ["Edukasi siswa dengan metode Relaksasi Otot Progresif (*Progressive Muscle Relaxation*) untuk menetralisir ketegangan fisik akibat beban tugas madrasah yang padat."], siswa: ["Jangan memaksakan diri duduk berjam-jam saat menghafal kitab. Berdirilah sesekali, regangkan ototmu, dan aplikasikan gerakan fisik agar pikiranmu kembali jernih."]
            },
            MA_Transisi: {
                eduTitle1: "Persiapan UTBK/PTKIN", eduList1: ["Pengulangan penulisan manual (Tulis Tangan) dalil atau rumus untuk membangun *Muscle Memory*", "Mengkondisikan saraf gerak saat mengerjakan Tryout (Mengetukkan ujung jari perlahan)"],
                eduTitle2: "Alternatif Karier", eduList2: ["Taruna Akademi Militer/Kepolisian", "Pengrajin Seni Kriya / Pekerja Kreatif Fisik", "Ahli Gizi Kuliner / Koki Vokasi"],
                materi: ["Latihan Intensif Ujian Fisik Kesamaptaan (TNI/Polri/STIN)", "Metode Manajemen Stres Psikososial Berbasis Kinetik"], layanan: ["Simulasi Periodik Tes Samapta (Lari 12 Menit, Pull-up, *Shuttle Run*)"],
                guruBk: ["Bimbing siswa untuk mempersiapkan administrasi dan fisik sedini mungkin jika memiliki intensi kuat menembus seleksi Akademi Ikatan Dinas."], siswa: ["Gunakan kertas buram atau papan tulis kecil untuk menggoreskan alur penyelesaian soal UTBK secara berulang. Sentuhan fisik dengan pena adalah kunci kecepatan kerjamu."]
            },
            SMK_Awal: {
                eduTitle1: "Fokus Praktik Kejuruan", eduList1: ["Optimalisasi jam kerja *Teaching Factory* di area Bengkel, Dapur Komersial, atau Laboratorium Terpadu", "Pengenalan taktil (Sentuhan fisik) terhadap bentuk, tekstur, dan letak komponen mesin/bahan praktik industri"],
                eduTitle2: "Persiapan Magang/PKL", eduList2: ["Simulasi ketahanan fisik (*Stamina Building*) untuk beradaptasi dengan ritme kerja berdiri (*Standing Operation*) di industri", "Pelatihan manuver alat berat atau mesin presisi tinggi sesuai standar baku operasional"],
                materi: ["Penerapan Prinsip 5R Industri (Ringkas, Rapi, Resik, Rawat, Rajin)", "Standar Kesehatan, Keselamatan Kerja, dan Lingkungan Hidup (K3LH)"], layanan: ["Inspeksi Kedisiplinan Penggunaan Alat Pelindung Diri (APD/Safety Gear)"],
                guruBk: ["Tanamkan kesadaran penuh (*Mindfulness*) pada siswa kinestetik agar meminimalkan impulsivitas dan manuver ceroboh saat berada di area praktik berisiko tinggi."], siswa: ["Fisik dan kecekatan tanganmu adalah modal utamamu! Pahami cara kerja alat melalui sentuhan langsung, namun pastikan selalu mematuhi instruksi manual Keselamatan Kerja (K3)."]
            },
            SMK_Transisi: {
                eduTitle1: "Persiapan Rekrutmen Kerja", eduList1: ["Fokus absolut pada pencapaian nilai sempurna di Uji Kompetensi Keahlian (UKK) praktik industri", "Manajemen istirahat fisik (*Recovery*) H-1 sebelum menghadapi tes kemampuan lapangan perusahaan"],
                eduTitle2: "Alternatif Studi Lanjut Vokasi", eduList2: ["Politeknik Negeri Manufaktur (Polman) / Teknik Rekayasa Terapan", "Sekolah Tinggi Pariwisata (NHI / Manajemen Tataboga Internasional)", "Akademi Kedinasan Militer / Navigasi Laut"],
                materi: ["Simulasi Penilaian *Hard-Skill* Industri Berbasis Tekanan Waktu", "Manajemen Kelelahan Otot (*Fatigue Management*) di Shift Kerja Industri"], layanan: ["Penyaluran Tenaga Kerja ke Sektor Manufaktur, Pertambangan, Konstruksi BUMN/Swasta (BKK)"],
                guruBk: ["Petakan profil kinetik siswa untuk disalurkan secara presisi ke mitra industri yang menuntut stamina, kecekatan tangan, dan ketahanan fisik (*Endurance*) tinggi."], siswa: ["Saat tes seleksi HRD pabrik atau hotel, kamu akan diuji langsung di lapangan (seperti mengelas atau merakit). Jaga ketenangan, dan buktikan kehebatan tanganmu dengan tindakan nyata!"]
            }
        }
    }
};