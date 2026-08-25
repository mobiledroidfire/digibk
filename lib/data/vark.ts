// Lokasi file: src/lib/data/vark.ts

/**
 * Merepresentasikan skor mentah dari setiap dimensi VARK.
 */
export type VarkResultItem = {
    code: string;
    raw_score: number;
};

/**
 * Struktur profil VARK untuk setiap pengguna yang tersimpan di database.
 */
export type VarkProfile = {
    code: string;
    dominant_code?: string;   // SSOT Database
    secondary_code?: string;  // SSOT Database
    tertiary_code?: string;   // SSOT Database
    vark_results: VarkResultItem[];
};

/**
 * Tipe data pembungkus untuk hasil asesmen keseluruhan.
 */
export type AssessmentResultVark = {
    id: string;
    vark_profiles: VarkProfile | VarkProfile[] | null;
};

/**
 * Mengelompokkan data rekomendasi pendidikan dan bimbingan untuk satu fase/kelas.
 */
export type PhaseData = {
    eduTitle1: string;
    eduList1: string[];
    eduTitle2: string;
    eduList2: string[];
    materi: string[];
    layanan: string[];
    guruBk: string[];
    siswa: string[];
};

/**
 * Struktur tingkatan pendidikan dari SD hingga SMK.
 */
export type LevelData = {
    SD_Awal: PhaseData; SD_Akhir: PhaseData; SD_Transisi: PhaseData;
    SMP_Awal: PhaseData; SMP_Transisi: PhaseData;
    SMA_Awal: PhaseData; SMA_Transisi: PhaseData;
    SMK_Awal: PhaseData; SMK_Transisi: PhaseData;
    MI_Awal: PhaseData; MI_Akhir: PhaseData; MI_Transisi: PhaseData;
    MTs_Awal: PhaseData; MTs_Transisi: PhaseData;
    MA_Awal: PhaseData; MA_Transisi: PhaseData;
};

/**
 * Detail komprehensif untuk setiap profil gaya belajar VARK.
 */
export type ProfileDetailVark = {
    title: string;
    indonesianTitle: string;
    desc: string;
    karir: string[];
    freelance: string[];
    levels: LevelData;
};

/**
 * Definisi dimensi gaya belajar VARK beserta makna dan perilaku khasnya.
 */
export const dimensionDefsVark: Record<string, { name: string; meaning: string; behavior: string }> = {
    V: { name: "Visual", meaning: "Menyerap informasi paling baik melalui penglihatan (gambar, warna, tulisan/grafik).", behavior: "Suka melihat diagram, mencatat dengan warna-warni, dan mudah mengingat letak visual." },
    A: { name: "Auditori", meaning: "Menyerap informasi paling baik melalui pendengaran (cerita, penjelasan lisan).", behavior: "Suka berdiskusi, mendengarkan podcast/penjelasan guru, dan terkadang membaca dengan bersuara." },
    R: { name: "Read/Write", meaning: "Menyerap informasi paling baik melalui teks (membaca dan menulis).", behavior: "Suka membaca buku tebal, membuat daftar (list), merangkum dengan teks panjang, dan mencatat detail." },
    K: { name: "Kinestetik", meaning: "Menyerap informasi paling baik melalui gerakan dan sentuhan fisik.", behavior: "Sulit duduk diam lama, suka belajar melalui praktik langsung dan eksperimen." }
};

/**
 * Kamus utama (Data Dictionary) yang berisi seluruh rekomendasi intervensi edukasi
 * berdasarkan gaya belajar VARK dan jenjang pendidikan.
 */
export const varkDictionary: Record<string, ProfileDetailVark> = {
    V: {
        title: "Visual", indonesianTitle: "Visual (Penglihatan)",
        desc: "Profil belajar Anda menunjukkan dominasi pada kecerdasan visual-spasial. Mengubah informasi menjadi bentuk gambar, diagram, dan warna adalah strategi paling efektif untuk mengoptimalkan daya ingat dan pemahaman akademik Anda.",
        karir: ["Desainer Grafis", "Arsitek", "Fotografer", "Ilustrator", "Pembuat Peta (Kartografer)"], freelance: ["Editor Video", "Desainer UI/UX"],
        levels: {
            SD_Awal: {
                eduTitle1: "Metode Belajar", eduList1: ["Penggunaan media flashcard bergambar", "Buku literasi visual (Full Color)"],
                eduTitle2: "Karakteristik", eduList2: ["Tertarik pada stimulus warna yang mencolok", "Observan terhadap ekspresi wajah sekitar"],
                materi: ["Literasi Visual Dasar", "Kreativitas Bentuk dan Warna"], layanan: ["Fasilitasi media poster edukasi interaktif"],
                guruBk: ["Gunakan alat peraga visual (alat peraga konkret) untuk mempertahankan atensi anak saat bimbingan."], siswa: ["Warnai atau tandai bagian teks yang penting menggunakan pensil warna agar materi lebih mudah diingat."]
            },
            SD_Akhir: {
                eduTitle1: "Metode Belajar", eduList1: ["Pengenalan Peta Konsep (Mind Mapping)", "Media pembelajaran berbasis video/dokumenter"],
                eduTitle2: "Karakteristik", eduList2: ["Memiliki kecenderungan mencatat dengan rapi", "Mampu menghafal rute spasial dengan cepat"],
                materi: ["Keterampilan Presentasi Visual", "Pemetaan Ide Sederhana"], layanan: ["Bimbingan teknik merangkum berbasis visual"],
                guruBk: ["Ajak siswa memvisualisasikan aspirasi atau cita-citanya melalui media gambar (Art Therapy)."], siswa: ["Tempelkan jadwal pelajaran yang telah dirancang secara visual di area belajarmu sebagai pengingat harian."]
            },
            SD_Transisi: {
                eduTitle1: "Target Lingkungan SMP", eduList1: ["Sekolah dengan fasilitas multimedia (Proyektor) memadai", "Sekolah dengan kultur apresiasi karya visual (Mading aktif)"],
                eduTitle2: "Persiapan Ekskul SMP", eduList2: ["Klub Jurnalistik Visual", "Kesenian Lukis / Fotografi"],
                materi: ["Keterampilan Mencatat Visual Terstruktur", "Manajemen Informasi Visual"], layanan: ["Konseling persiapan adaptasi gaya belajar menengah"],
                guruBk: ["Fasilitasi siswa dengan teknik merangkum buku tebal menggunakan skema visual untuk persiapan SMP."], siswa: ["Mulailah membiasakan diri merangkum catatan pelajaran menggunakan tabel atau peta konsep yang terstruktur."]
            },
            MI_Awal: {
                eduTitle1: "Metode Belajar Islami", eduList1: ["Pendekatan Iqro dengan blok warna penegas", "Media pembelajaran kisah Nabi berbasis animasi"],
                eduTitle2: "Karakteristik Dasar", eduList2: ["Apresiatif terhadap ornamen kaligrafi", "Observan meniru gerakan shalat secara visual"],
                materi: ["Pengenalan Huruf Hijaiyah Berwarna", "Keterampilan Menulis Arab Dasar"], layanan: ["Penyediaan instrumen flashcard Hijaiyah"],
                guruBk: ["Tarik atensi anak menggunakan media gambar bernuansa Islami yang interaktif dan kaya warna."], siswa: ["Berikan sentuhan warna pada buku catatan tugasmu untuk menciptakan suasana belajar yang lebih interaktif."]
            },
            MI_Akhir: {
                eduTitle1: "Metode Belajar Islami", eduList1: ["Asosiasi hafalan doa dengan gambar ilustrasi", "Pembuatan karya poster dakwah mini"],
                eduTitle2: "Tanggung Jawab Akademik", eduList2: ["Merancang tata letak Mading kelas", "Menjaga keindahan dan kerapian ruang kelas"],
                materi: ["Seni Kaligrafi Tingkat Pemula", "Sejarah Kebudayaan Islam via Visual"], layanan: ["Pendampingan teknik hafalan berbasis memori visual"],
                guruBk: ["Arahkan siswa untuk mengubah narasi Sejarah Kebudayaan Islam menjadi bentuk komik atau garis waktu (timeline)."], siswa: ["Manfaatkan stiker penanda berwarna pada Al-Quran atau buku referensi untuk melacak target hafalanmu."]
            },
            MI_Transisi: {
                eduTitle1: "Target Lingkungan MTs", eduList1: ["Madrasah dengan sarana multimedia pendukung", "Madrasah yang memiliki pembinaan ekskul visual/kaligrafi"],
                eduTitle2: "Persiapan Ekskul", eduList2: ["Klub Seni Kaligrafi (Khat)", "Desain Grafis / Jurnalistik Madrasah"],
                materi: ["Manajemen Catatan Madrasah", "Pemetaan Ide Materi Akidah/Akhlak"], layanan: ["Konseling metode belajar visual tingkat menengah"],
                guruBk: ["Latih siswa menerapkan teknik 'Color-Coding' (kode warna) untuk membedakan dalil, definisi, dan contoh kasus."], siswa: ["Siapkan alat tulis dengan warna yang bervariasi untuk merapikan dan mengategorikan catatan di tingkat MTs."]
            },
            SMP_Awal: {
                eduTitle1: "Strategi Belajar", eduList1: ["Implementasi teknik 'Color-Coding' pada catatan", "Transformasi teks panjang menjadi infografis naratif"],
                eduTitle2: "Karakteristik", eduList2: ["Daya tangkap meningkat drastis melalui media slide (PPT)", "Mudah terdistraksi oleh tata letak ruangan yang berantakan"],
                materi: ["Teknik Mind Mapping Lanjutan", "Keterampilan Membaca Pindai (Skimming/Scanning)"], layanan: ["Pelatihan teknik mencatat kreatif (Creative Note-taking)"],
                guruBk: ["Gunakan instrumen pemetaan visual (seperti mind-map) untuk membantu siswa menstrukturkan alur pikirannya saat konseling."], siswa: ["Terapkan metode pengkodean warna (Color-Coding) pada catatan untuk memperkuat daya ingat visualmu secara signifikan."]
            },
            SMP_Transisi: {
                eduTitle1: "Pilihan Jurusan SMA/MA", eduList1: ["Sangat adaptif di semua jurusan (MIPA/IPS) dengan catatan modifikasi metode visual"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Desain Komunikasi Visual (DKV)", "Multimedia / Animasi", "Arsitektur Dasar"],
                materi: ["Eksplorasi Karir Industri Kreatif", "Strategi Ujian Berbasis Kecerdasan Spasial"], layanan: ["Konsultasi arah bakat industri kreatif dan desain"],
                guruBk: ["Gunakan media video profil atau infografis kampus/jurusan untuk mempermudah siswa memvisualisasikan masa depannya."], siswa: ["Eksplorasi jalur vokasi seperti Desain Komunikasi Visual (DKV) jika kamu memiliki minat besar dalam menciptakan karya visual."]
            },
            MTs_Awal: {
                eduTitle1: "Strategi Belajar", eduList1: ["Pemetaan hukum tajwid menggunakan stabilo multi-warna", "Visualisasi silsilah sejarah Islam dalam bentuk bagan (Tree Diagram)"],
                eduTitle2: "Karakteristik", eduList2: ["Memiliki ketelitian tinggi dalam menyalin teks Arab", "Pemahaman materi optimal melalui proyektor slide"],
                materi: ["Teknik Visualisasi Materi Fikih", "Desain Media Dakwah Komunikasi Visual"], layanan: ["Pelatihan pembuatan catatan estetik (Aesthetic Notes)"],
                guruBk: ["Manfaatkan papan tulis atau kertas kosong untuk membuat bagan pemecahan masalah bersama siswa saat sesi konseling individu."], siswa: ["Gunakan variasi warna stabilo untuk mengategorikan informasi, misalnya membedakan hukum tajwid, arti, dan dalil."]
            },
            MTs_Transisi: {
                eduTitle1: "Pilihan Jurusan MA/SMA", eduList1: ["Adaptif di Keagamaan maupun Umum, dengan pendekatan visual"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Multimedia / Broadcasting", "Desain Komunikasi Visual (DKV)", "Tata Busana"],
                materi: ["Pengenalan Profesi Industri Kreatif Digital", "Strategi Visual Mengerjakan Ujian Nasional"], layanan: ["Tes Penelusuran Minat Visual-Spasial"],
                guruBk: ["Sajikan brosur visual bergambar atau video dokumenter untuk membantu siswa merancang *roadmap* pendidikan lanjutannya."], siswa: ["Pertimbangkan jurusan vokasi yang mengutamakan estetika dan karya visual sebagai pilihan cerdas untuk pendidikan lanjutanmu."]
            },
            SMA_Awal: {
                eduTitle1: "Strategi Belajar (Fase E/F)", eduList1: ["Penggunaan instrumen Kanban Board / Sticky Notes untuk pelacakan tugas", "Integrasi video ilustrasi/animasi untuk materi MIPA yang abstrak"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Dasar-dasar Desain Antarmuka (UI/UX Design)", "Kemampuan analisis grafik dan kurva kompleks"],
                materi: ["Interpretasi Data Visual Terapan", "Teknik Presentasi Profesional Berbasis Slide"], layanan: ["Bimbingan teknik presentasi dan *Public Speaking* dengan media visual"],
                guruBk: ["Fasilitasi pembuatan *Vision Board* (Papan Impian) di kelas sebagai media pendorong motivasi intrinsik siswa."], siswa: ["Manfaatkan platform digital seperti Canva atau Notion untuk menyusun rangkuman materi pelajaran yang interaktif."]
            },
            SMA_Transisi: {
                eduTitle1: "Persiapan UTBK/PTN", eduList1: ["Latihan intensif pemecahan Pola Figural (Spasial) pada TPS UTBK", "Visualisasi rumus matematika abstrak ke dalam bentuk bangun ruang nyata"],
                eduTitle2: "Alternatif Karier", eduList2: ["Junior Graphic Designer", "Staf Administrasi Pengolahan Data Visual"],
                materi: ["Taktik Efisiensi Waktu Soal Figural", "Manajemen Waktu Visual (Gantt Chart / Kanban)"], layanan: ["Tryout Khusus Analisis Pola Spasial dan Visual"],
                guruBk: ["Bantu siswa merancang *Timeline Board* raksasa di ruang konseling untuk memvisualisasikan hitung mundur hari-H UTBK."], siswa: ["Latih ketajaman spasialmu secara rutin. Soal penalaran figural pada tes akademik dapat menjadi lumbung poin keunggulanmu."]
            },
            MA_Awal: {
                eduTitle1: "Strategi Belajar (Fase E/F)", eduList1: ["Transformasi perbandingan Mazhab Fikih ke dalam tabel komparasi visual", "Pembuatan infografis *Timeline* (Garis Waktu) untuk Sejarah Islam"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Desain materi presentasi proyek P5 yang estetik", "Pemahaman tata letak (layouting) dan tipografi Arab"],
                materi: ["Interpretasi Kurva dan Data Statistik", "Teknik Desain Presentasi Komunikatif"], layanan: ["Pendampingan pengembangan portofolio desain digital"],
                guruBk: ["Gunakan pendekatan *Visual Tracker* untuk membantu siswa memonitor kedisiplinan hafalan dan tugas akademik mereka."], siswa: ["Transformasikan teks tebal menjadi infografis atau garis waktu (timeline) berwarna agar materi sejarah lebih mudah dikuasai."]
            },
            MA_Transisi: {
                eduTitle1: "Persiapan UTBK/PTKIN", eduList1: ["Penguasaan materi TPS Figural (Penalaran Gambar)", "Modifikasi rumus/konsep kompleks menjadi jembatan keledai visual"],
                eduTitle2: "Alternatif Karier", eduList2: ["Freelance Ilustrator / Video Editor", "Social Media Administrator"],
                materi: ["Strategi Penguasaan Soal Figural (Spasial)", "Sistem Manajemen Waktu Visualisasi"], layanan: ["Tryout Intensif Penalaran Visual-Spasial"],
                guruBk: ["Arahkan siswa untuk menyusun portofolio visual digital yang profesional jika mereka membidik jalur SNBP Fakultas Seni/Desain."], siswa: ["Tingkatkan frekuensi latihan soal deret gambar, karena tes spasial menuntut akurasi mata dan analitik visual yang sangat tinggi."]
            },
            SMK_Awal: {
                eduTitle1: "Fokus Praktik Kejuruan", eduList1: ["Mempelajari Standar Operasional (SOP) melalui *Flowchart* / Diagram Alir", "Observasi tutorial praktik industri berbasis video sebelum masuk bengkel"],
                eduTitle2: "Persiapan Magang/PKL", eduList2: ["Pengamatan presisi terhadap demonstrasi kerja instruktur", "Pembuatan *Checklist* visual untuk inspeksi kelengkapan APD"],
                materi: ["Membaca *Blueprint* / Gambar Kerja Industri", "Prinsip Estetika dan Desain Antarmuka"], layanan: ["Pelatihan literasi instruksi kerja visual standar industri"],
                guruBk: ["Gunakan diagram alur (*Flowchart*) yang jelas saat menyosialisasikan kode etik, tata tertib, dan sanksi PKL industri."], siswa: ["Selalu cermati rambu-rambu peringatan keselamatan kerja (K3) berupa simbol visual saat berada di area praktik industri."]
            },
            SMK_Transisi: {
                eduTitle1: "Persiapan Rekrutmen Kerja", eduList1: ["Perancangan CV/Resume *ATS Friendly* dengan tata letak (*layout*) profesional", "Penyusunan portofolio digital berbasis visual (Desain, Foto, Mockup)"],
                eduTitle2: "Alternatif Studi Lanjut Vokasi", eduList2: ["D4 Program Studi Animasi / DKV", "D3 Arsitektur Bangunan", "Institut Seni Indonesia (ISI)"],
                materi: ["Etika Penampilan Visual Profesional untuk Wawancara", "Latihan Psikotes Spasial (Rotasi 3D, Tes Koran/Pauli)"], layanan: ["Simulasi Psikotes Rekrutmen (Fokus Akurasi Visual)"],
                guruBk: ["Lakukan peninjauan mendalam (*review*) terhadap tipografi dan tata letak CV siswa agar mencerminkan profesionalitas di mata HRD."], siswa: ["Perhatikan aspek visual pembentuk kesan pertama, seperti pakaian yang profesional dan tata letak dokumen lamaran kerjamu."]
            }
        }
    },
    A: {
        title: "Auditori", indonesianTitle: "Auditori (Pendengaran)",
        desc: "Kekuatan utama Anda terletak pada kecerdasan linguistik dan auditori. Anda memproses informasi secara optimal saat berdiskusi, mendengarkan penjelasan secara saksama, atau mengartikulasikan ulang sebuah materi akademik secara verbal.",
        karir: ["Penyiar/Podcaster", "Penerjemah", "Musisi", "Customer Service", "Konselor"], freelance: ["Voice Over Talent", "MC/Host"],
        levels: {
            SD_Awal: {
                eduTitle1: "Metode Belajar", eduList1: ["Penerapan metode *Storytelling* (Bercerita) interaktif", "Teknik mengeja fonetik dengan artikulasi lantang"],
                eduTitle2: "Karakteristik", eduList2: ["Reseptif terhadap nada, irama, dan *jingle* edukatif", "Sangat ekspresif saat menceritakan pengalaman keseharian"],
                materi: ["Keterampilan Menyimak Aktif (Active Listening)", "Belajar Berbasis Rima dan Irama"], layanan: ["Bimbingan klasikal berbasis dongeng/cerita inspiratif"],
                guruBk: ["Gunakan modulasi suara (intonasi, volume, jeda) yang dinamis untuk mempertahankan fokus anak saat memberi instruksi."], siswa: ["Cobalah membaca buku pelajaran dengan bersuara pelan untuk membantu informasi lebih cepat melekat di ingatan."]
            },
            SD_Akhir: {
                eduTitle1: "Metode Belajar", eduList1: ["Simulasi tanya-jawab lisan (Tutor Sebaya)", "Pemanfaatan media *Audiobook* (Buku Suara)"],
                eduTitle2: "Karakteristik", eduList2: ["Memiliki kecenderungan menggumam (sub-vokalisasi) saat membaca", "Aktif berpartisipasi dalam diskusi atau curah pendapat kelas"],
                materi: ["Keterampilan Berbicara di Depan Umum Dasar", "Latihan Konsentrasi Pendengaran"], layanan: ["Konseling kelompok dengan pendekatan diskusi (Group Sharing)"],
                guruBk: ["Fasilitasi siswa untuk mengartikulasikan masalah atau perasaannya secara verbal tanpa diinterupsi."], siswa: ["Lakukan sesi tanya-jawab atau tebak-tebakan materi pelajaran secara lisan bersama teman sebangkumu."]
            },
            SD_Transisi: {
                eduTitle1: "Target Lingkungan SMP", eduList1: ["Sekolah dengan budaya diskusi dan presentasi yang kuat", "Sekolah yang memiliki fasilitas ekstrakurikuler musik/paduan suara aktif"],
                eduTitle2: "Persiapan Ekskul SMP", eduList2: ["Klub Debat Junior", "Klub Penyiaran (Broadcasting/Radio Sekolah)"],
                materi: ["Dasar-Dasar *Public Speaking*", "Etika Berkomunikasi (Communication Courtesy)"], layanan: ["Latihan kepercayaan diri dalam presentasi lisan"],
                guruBk: ["Gunakan metode dialog interaktif dua arah saat membimbing anak memetakan kekhawatirannya menuju jenjang SMP."], siswa: ["Latih fokus pendengaranmu untuk menangkap penjelasan guru secara utuh tanpa terganggu oleh suara di sekitarmu."]
            },
            MI_Awal: {
                eduTitle1: "Metode Belajar Islami", eduList1: ["Pendekatan *Talaqqi* (Mendengar hafalan secara berulang)", "Pemanfaatan media audio *Murattal* Al-Quran anak"],
                eduTitle2: "Karakteristik Dasar", eduList2: ["Sangat responsif terhadap lantunan Nasyid atau selawat", "Senang menceritakan ulang kisah-kisah teladan Nabi"],
                materi: ["Menyimak Kisah Teladan (Audio/Cerita)", "Artikulasi Pelafalan Doa Harian"], layanan: ["Bimbingan dengan metode *Storytelling* Islami"],
                guruBk: ["Bangkitkan imajinasi anak melalui teknik bercerita (storytelling) dengan intonasi suara karakter yang beragam."], siswa: ["Lantunkan hafalan doa dan surah pendek dengan intonasi yang jelas agar ingatanmu semakin kuat."]
            },
            MI_Akhir: {
                eduTitle1: "Metode Belajar Islami", eduList1: ["Penerapan metode *Simaan* (Saling menyimak hafalan) berpasangan", "Mempelajari hukum tajwid melalui irama (Nagham)"],
                eduTitle2: "Tanggung Jawab Akademik", eduList2: ["Berpartisipasi aktif dalam ekstrakurikuler Qasidah/Paduan Suara", "Berlatih pidato (Muhadharah) atau kultum kelas"],
                materi: ["Pengenalan Seni Tilawah Al-Quran", "Dinamika Diskusi Kelompok"], layanan: ["Konseling individu berbasis *Active Listening* (Mendengar Aktif)"],
                guruBk: ["Berikan apresiasi saat siswa mampu mempresentasikan gagasan atau merangkum kajian agama secara lisan di depan kelas."], siswa: ["Bacalah rangkuman materi madrasah dengan suara perlahan untuk memperkuat daya ingat auditifmu secara maksimal."]
            },
            MI_Transisi: {
                eduTitle1: "Target Lingkungan MTs", eduList1: ["Madrasah dengan program unggulan Tahfidz berbasis *Simaan*", "Madrasah yang memiliki kultur percakapan Bahasa (Muhadasah)"],
                eduTitle2: "Persiapan Ekskul", eduList2: ["Tim Nasyid / Rebana / Hadrah", "Klub Pidato Multi-Bahasa"],
                materi: ["Keterampilan Presentasi Percaya Diri", "Teknik Menyimak Kritis (Critical Listening)"], layanan: ["Simulasi wawancara penjurusan madrasah tingkat menengah"],
                guruBk: ["Eksplorasi minat siswa melalui metode tanya-jawab lisan (wawancara ringan) mengenai rencana pendidikan lanjutannya."], siswa: ["Tinjau kembali materi pelajaran melalui metode diskusi ringan dan interaksi verbal bersama rekan-rekanmu."]
            },
            SMP_Awal: {
                eduTitle1: "Strategi Belajar", eduList1: ["Rekam materi penting menggunakan fitur *Voice Note* untuk diputar ulang", "Terapkan teknik *Read-Aloud* (Membaca nyaring) untuk teks hafalan"],
                eduTitle2: "Karakteristik", eduList2: ["Tingkat fokus meningkat saat belajar diiringi musik instrumental", "Sangat sensitif dan mudah terdistraksi oleh polusi suara/bising"],
                materi: ["Dinamika Forum Group Discussion (FGD)", "Manajemen Intonasi dan Artikulasi Komunikasi"], layanan: ["Konseling dialogis interaktif"],
                guruBk: ["Terapkan teknik *Client-Centered Therapy* yang memberikan porsi dominan bagi siswa untuk mencurahkan isi pikirannya secara verbal."], siswa: ["Rekam suaramu saat membaca materi penting, lalu dengarkan kembali sebagai materi ulasan pendengaran sebelum tidur."]
            },
            SMP_Transisi: {
                eduTitle1: "Pilihan Jurusan SMA/MA", eduList1: ["Jurusan Bahasa (Sangat sesuai untuk bakat Linguistik dan Sastra)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Broadcasting / Penyiaran", "Industri Pariwisata (Tour Guide)", "Layanan Perkantoran"],
                materi: ["Eksplorasi Karir Komunikasi Massa", "Strategi Menghadapi Ujian *Listening* Bahasa Asing"], layanan: ["Konseling karir berbasis eksplorasi naratif"],
                guruBk: ["Lakukan penggalian bakat (*probing*) melalui wawancara mendalam untuk memetakan arah karir komunikasi siswa."], siswa: ["Pertimbangkan jalur penyiaran atau pariwisata vokasi jika kamu memiliki kemampuan komunikasi lisan yang unggul."]
            },
            MTs_Awal: {
                eduTitle1: "Strategi Belajar", eduList1: ["Optimalkan hafalan (Tahfidz) dengan mendengarkan *Murattal* secara kontinu", "Perekaman penjelasan ustadz/ustadzah untuk bahan *review* di asrama"],
                eduTitle2: "Karakteristik", eduList2: ["Cepat mengadaptasi nada/irama (Nagham) pada seni Tilawah/Tajwid", "Sangat menikmati metode belajar kelompok (*Simaan*/Halaqah)"],
                materi: ["Teknik Memori Audio (*Audio-Spaced Repetition*)", "Keterampilan *Public Speaking* Islami (Muhadharah)"], layanan: ["Layanan Bimbingan Kelompok (FGD / Diskusi Forum)"],
                guruBk: ["Praktikkan *Empathic Listening* (Mendengarkan Penuh Empati) saat mengurai konflik pergaulan remaja yang dialami siswa."], siswa: ["Terapkan teknik mengajar mandiri; jelaskan kembali materi yang telah dipelajari secara lisan seolah-olah sedang mengajari temanmu."]
            },
            MTs_Transisi: {
                eduTitle1: "Pilihan Jurusan MA/SMA", eduList1: ["Jurusan Bahasa & Budaya (Fokus Sastra)", "Ilmu Agama (Fokus Dakwah, Tafsir, Hadis)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Broadcasting / Televisi & Radio", "Usaha Perjalanan Wisata (Pramuwisata)"],
                materi: ["Pengenalan Karir Jurnalistik dan Penyiaran", "Persiapan Ujian *Listening* (Bahasa Arab/Inggris)"], layanan: ["Wawancara Eksplorasi Minat Karir (Career Interview)"],
                guruBk: ["Validasi kemantapan pilihan siswa melalui diskusi dua arah yang menguji pemahamannya tentang jurusan yang akan dipilih."], siswa: ["Jurusan ilmu keagamaan atau penyiaran vokasi adalah pilihan tepat untuk mengasah potensimu dalam merangkai kata secara verbal."]
            },
            SMA_Awal: {
                eduTitle1: "Strategi Belajar (Fase E/F)", eduList1: ["Pemanfaatan platform *Podcast* edukasi sebagai suplemen belajar utama", "Inisiasi kelompok belajar berbasis debat terbuka dan adu argumentasi"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Kecakapan menjadi Master of Ceremony (MC) atau Moderator", "Teknik memandu jalannya rapat organisasi secara komunikatif"],
                materi: ["Teknik Lobi dan Negosiasi Praktis", "Peningkatan Kompetensi *Listening* Bahasa Asing"], layanan: ["Fasilitasi program Bimbingan Karir melalui Radio/Podcast Sekolah"],
                guruBk: ["Izinkan siswa mengganti instrumen tugas tertulis dengan pengumpulan berbasis rekaman *Voice Note* atau *Podcast* jika memungkinkan."], siswa: ["Bentuklah kelompok diskusi belajar. Menguraikan materi secara lisan terbukti sangat efisien dalam memangkas waktu belajar mandirimu."]
            },
            SMA_Transisi: {
                eduTitle1: "Persiapan UTBK/PTN", eduList1: ["Optimalisasi video pembahasan soal UTBK (Fokus pada narasi tutor)", "Penerapan metode *Tutor Sebaya* (Peer Tutoring) untuk materi Soshum/Saintek"],
                eduTitle2: "Alternatif Karier", eduList2: ["Customer Service / Call Center", "Voice Over Talent / *Podcaster* Pemula"],
                materi: ["Strategi Taktis Ujian Wawancara PTN / Kedinasan", "Manajemen Audio TOEFL/IELTS Lanjutan"], layanan: ["Simulasi *Mock Interview* (Wawancara Masuk Kampus/Beasiswa)"],
                guruBk: ["Selenggarakan simulasi wawancara (*Mock Interview*) intensif untuk mempersiapkan siswa menghadapi seleksi masuk Perguruan Tinggi/Kedinasan."], siswa: ["Gunakan metode tutor sebaya. Mengajarkan materi ujian kepada rekan sejawat adalah cara paling mutakhir untuk menanamkan konsep akademik di otakmu."]
            },
            MA_Awal: {
                eduTitle1: "Strategi Belajar (Fase E/F)", eduList1: ["Menggali materi literasi Sosiologi/Sejarah Islam melalui media *Audiobook*", "Penyelenggaraan kajian diskusi kelompok (Bahtsul Masail tingkat dasar)"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Kecakapan Retorika Dakwah, Orasi, dan Khutbah", "Teknik Resolusi Konflik melalui pendekatan dialogis (Lobi)"],
                materi: ["Retorika Lanjutan dan *Public Speaking*", "Peningkatan Kompetensi *Listening* (TOEFL / TOAFL)"], layanan: ["Bimbingan Konseling melalui saluran Radio/Podcast Madrasah"],
                guruBk: ["Sediakan ruang diskusi yang apresiatif bagi siswa untuk mengelaborasi argumentasi lisannya secara komprehensif saat konseling."], siswa: ["Manfaatkan durasi perjalanan ke madrasah dengan mendengarkan kajian audio atau rangkuman sejarah melalui perangkat audio genggam."]
            },
            MA_Transisi: {
                eduTitle1: "Persiapan UTBK/PTKIN", eduList1: ["Review pembahasan soal UM-PTKIN via YouTube (Fokus pada alur penjelasan lisan)", "Konsolidasi pemahaman melalui pengajaran silang antar teman sebaya"],
                eduTitle2: "Alternatif Karier", eduList2: ["Customer Relation / Staf Layanan BMT", "Penyiar Radio Islami / *Voice Over Talent*"],
                materi: ["Persiapan Wawancara Beasiswa (PBSB/KIP-K)", "Taktik Mengerjakan Soal *Listening* Bahasa Arab (TOAFL)"], layanan: ["Simulasi Wawancara Beasiswa Jalur Prestasi"],
                guruBk: ["Latih artikulasi, proyeksi suara, dan kepercayaan diri siswa melalui simulasi wawancara (*Mock Interview*) yang menantang."], siswa: ["Seringlah mempresentasikan penguasaan materi secara verbal untuk mengunci pemahaman tersebut secara permanen ke dalam memori jangka panjangmu."]
            },
            SMK_Awal: {
                eduTitle1: "Fokus Praktik Kejuruan", eduList1: ["Interpretasi instruksi verbal mandor/instruktur bengkel secara presisi", "Proaktif melakukan konfirmasi (tanya-jawab lisan) terhadap prosedur kerja industri"],
                eduTitle2: "Persiapan Magang/PKL", eduList2: ["Latihan Komunikasi Profesional (*Business Courtesy*) dengan pelanggan", "Simulasi penerimaan keluhan (*Handling Complaint*) secara verbal"],
                materi: ["Komunikasi Terapeutik / Pelayanan Prima (*Service Excellence*)", "Percakapan Bisnis (*Business Conversation*) Tingkat Dasar"], layanan: ["Simulasi *Roleplay* skenario pelayanan pelanggan (Customer Service)"],
                guruBk: ["Fokuskan pembinaan pada intonasi, *manner* (kesopanan), dan *Telephone Courtesy* sebagai modal komunikasi siswa di dunia industri."], siswa: ["Jangan ragu untuk proaktif bertanya secara lisan kepada instruktur apabila terdapat prosedur operasional standar (SOP) yang belum sepenuhnya jelas."]
            },
            SMK_Transisi: {
                eduTitle1: "Persiapan Rekrutmen Kerja", eduList1: ["Penguasaan artikulasi dan intonasi persuasif untuk sesi *Interview* HRD", "Penyiapan naskah (*script*) verbal untuk menjawab pertanyaan wawancara menjebak"],
                eduTitle2: "Alternatif Studi Lanjut Vokasi", eduList2: ["D3 Hubungan Masyarakat (Public Relations)", "D3 Penyiaran (Broadcasting)", "D4 Bahasa Asing Terapan Pariwisata"],
                materi: ["Simulasi *Interview* Panel Rekrutmen Perusahaan", "Keterampilan Komunikasi Asertif di Lingkungan Kerja"], layanan: ["Pelatihan Intensif *Mock Interview* Bersama Praktisi HRD di Bursa Kerja Khusus"],
                guruBk: ["Ciptakan suasana simulasi *Interview* yang penuh tekanan (*stress interview*) agar mental komunikasi siswa terasah tangguh di hadapan HRD industri."], siswa: ["Latih kejernihan intonasi suara, artikulasi, dan ketenangan berbicara sebagai senjata utama saat menghadapi tahapan seleksi wawancara industri."]
            }
        }
    },
    R: {
        title: "Read/Write", indonesianTitle: "Membaca & Menulis",
        desc: "Anda memiliki kecerdasan linguistik berbasis teks yang sangat baik. Kemampuan kognitif Anda bekerja paling efektif dalam menyerap dan menstrukturkan informasi ketika Anda membaca literatur atau mendokumentasikan ulang materi secara tertulis.",
        karir: ["Penulis/Jurnalis", "Editor/Copywriter", "Programmer", "Peneliti/Data Analis", "Akuntan/Administrasi"], freelance: ["Blogger", "Penerjemah Teks", "Pembuat Resume"],
        levels: {
            SD_Awal: {
                eduTitle1: "Metode Belajar", eduList1: ["Banyak membaca buku cerita pendek bergambar", "Menulis ulang kata-kata baru di buku tulis khusus"],
                eduTitle2: "Karakteristik", eduList2: ["Cepat mengenali huruf dan struktur kalimat sederhana", "Suka melihat tulisan di papan tulis, poster, atau buku"],
                materi: ["Literasi Membaca Dasar", "Keterampilan Menulis Rapi"], layanan: ["Fasilitasi perpustakaan mini atau sudut baca di kelas"],
                guruBk: ["Gunakan media teks sederhana seperti kartu kata (*word cards*) untuk membantu anak mengekspresikan perasaannya."], siswa: ["Biasakan mencatat setiap kosakata baru yang kamu pelajari hari ini ke dalam buku catatan khususmu."]
            },
            SD_Akhir: {
                eduTitle1: "Metode Belajar", eduList1: ["Membuat daftar (*to-do list*) untuk tugas sekolah", "Merangkum bacaan menjadi paragraf pendek"],
                eduTitle2: "Karakteristik", eduList2: ["Lebih suka membaca instruksi tertulis daripada disuruh secara lisan", "Mulai gemar menulis buku harian (diary)"],
                materi: ["Teknik Merangkum Buku Cerita", "Pengenalan Jurnal Pribadi"], layanan: ["Bimbingan cara menyusun jadwal kegiatan tertulis"],
                guruBk: ["Arahkan siswa untuk menuliskan masalah atau cita-citanya di selembar kertas agar lebih mudah didiskusikan."], siswa: ["Mulailah mendisiplinkan diri dengan menyusun jadwal pelajaran dan mencatat penugasan harian di buku agendamu."]
            },
            SD_Transisi: {
                eduTitle1: "Target Lingkungan SMP", eduList1: ["Sekolah dengan perpustakaan yang lengkap dan nyaman", "Sekolah yang mewajibkan literasi membaca sebelum masuk kelas"],
                eduTitle2: "Persiapan Ekskul SMP", eduList2: ["Klub Mading / Jurnalistik Sekolah", "Klub Karya Ilmiah Remaja (KIR) Dasar"],
                materi: ["Keterampilan Mencatat Efektif", "Strategi Membaca Buku Teks Tebal"], layanan: ["Konseling persiapan penyesuaian beban tugas membaca di SMP"],
                guruBk: ["Bantu siswa mengenali format buku teks SMP yang lebih padat tulisan dan latih cara menemukan ide pokok paragraf."], siswa: ["Siapkan diri untuk menguasai buku pelajaran yang lebih komprehensif dengan merutinkan kebiasaan membaca sejak dini."]
            },
            MI_Awal: {
                eduTitle1: "Metode Belajar Islami", eduList1: ["Menebalkan huruf hijaiyah dan belajar menulis bahasa Arab dasar", "Membaca kisah Nabi dari buku bergambar dengan teks besar"],
                eduTitle2: "Karakteristik Dasar", eduList2: ["Teliti saat mencocokkan bentuk huruf Arab", "Mudah menghafal dari melihat teks tertulis di Iqro/Al-Quran"],
                materi: ["Khat (Kaligrafi Tulis) Dasar", "Pengenalan Kosakata Arab (Mufradat)"], layanan: ["Penyediaan instrumen lembar kerja (Worksheet) Islami"],
                guruBk: ["Gunakan media cerita tertulis bertema akhlak untuk mendiskusikan nilai-nilai kebaikan dengan anak."], siswa: ["Berlatihlah menulis huruf hijaiyah secara rutin untuk meningkatkan kerapian dan akurasi bentuk tulisan Arab-mu."]
            },
            MI_Akhir: {
                eduTitle1: "Metode Belajar Islami", eduList1: ["Menyalin dalil (Al-Quran/Hadis) ke dalam buku catatan khusus", "Membuat ringkasan materi Akidah Akhlak dan SKI"],
                eduTitle2: "Tanggung Jawab Akademik", eduList2: ["Menjadi tim redaksi Mading madrasah", "Bertanggung jawab mencatat tugas kelompok"],
                materi: ["Tata Cara Penulisan Arab yang Benar", "Pemahaman Bacaan Literasi Islami"], layanan: ["Pendampingan teknik menyalin materi agama dengan rapi"],
                guruBk: ["Fasilitasi siswa dengan metode *Journaling* (menulis jurnal harian) untuk sarana refleksi diri dan ibadah."], siswa: ["Buatlah catatan sistematis berupa daftar hafalan surah untuk memudahkan pelacakan kemajuan belajarmu."]
            },
            MI_Transisi: {
                eduTitle1: "Target Lingkungan MTs", eduList1: ["Madrasah yang memiliki program unggulan literasi/penulisan", "Madrasah dengan perpustakaan berbasis digital/referensi Islam lengkap"],
                eduTitle2: "Persiapan Ekskul", eduList2: ["Klub Jurnalistik / Penulis Cilik Madrasah", "Klub Bahasa dan Sastra Arab/Indonesia"],
                materi: ["Teknik Membuat Resume Materi Keagamaan", "Pengenalan Struktur Buku Teks MTs"], layanan: ["Konseling transisi dan pengenalan literasi tingkat menengah"],
                guruBk: ["Berikan gambaran beban bacaan di MTs (seperti Fikih, SKI) dan latih anak cara membaca cepat (*skimming*)."], siswa: ["Latih kecepatan membaca dan pemahaman teksmu sebagai persiapan menghadapi kitab dan literatur tebal di MTs."]
            },
            SMP_Awal: {
                eduTitle1: "Strategi Belajar", eduList1: ["Menulis ulang catatan kelas menjadi lebih rapi di rumah", "Mengubah bagan/diagram guru menjadi teks poin-poin (Bullet points)"],
                eduTitle2: "Karakteristik", eduList2: ["Mampu berkonsentrasi tinggi saat membaca buku teks dalam keadaan hening", "Sangat bergantung pada silabus atau modul tertulis"],
                materi: ["Teknik Mencatat Cornell (Cornell Note-taking)", "Manajemen Informasi Berbasis Teks"], layanan: ["Pelatihan penulisan resume dan rangkuman efektif"],
                guruBk: ["Gunakan instrumen *Self-Reflection Questionnaire* (kuesioner refleksi diri tertulis) sebelum sesi konseling tatap muka."], siswa: ["Tulis ulang catatan kelasmu di rumah secara mandiri. Proses menyalin teks adalah metode terbaik bagi otakmu untuk menyimpan informasi."]
            },
            SMP_Transisi: {
                eduTitle1: "Pilihan Jurusan SMA/MA", eduList1: ["Jurusan IPS / Bahasa (Sangat cocok dengan literatur tebal)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Manajemen Perkantoran", "Akuntansi dan Keuangan", "Rekayasa Perangkat Lunak (Coding)"],
                materi: ["Eksplorasi Karir Berbasis Data dan Teks", "Strategi Ujian Tertulis Pilihan Ganda/Esai"], layanan: ["Konseling arah minat bidang administrasi, kepenulisan, atau analisis data"],
                guruBk: ["Bantu siswa membedah brosur atau *booklet* profil SMA/SMK karena mereka sangat analitis terhadap informasi tertulis."], siswa: ["Pertimbangkan jurusan yang berpusat pada analisis teks dan data, seperti Administrasi, Akuntansi, atau Ilmu Pengetahuan Sosial."]
            },
            MTs_Awal: {
                eduTitle1: "Strategi Belajar", eduList1: ["Membuat *Glosarium* (kamus kecil) untuk istilah-istilah bahasa Arab/Fikih", "Menulis terjemahan langsung di bawah teks Arab pada kitab/buku"],
                eduTitle2: "Karakteristik", eduList2: ["Sangat teliti dalam mendeteksi kesalahan penulisan (*typo*) pada materi", "Lebih mudah memahami instruksi tugas jika diberikan panduan tertulis (*rubrik*)"],
                materi: ["Teknik Menyusun Glosarium Mandiri", "Keterampilan Membaca Kritis Literatur Islam"], layanan: ["Bimbingan teknik literasi dan pemahaman teks bahasa Arab"],
                guruBk: ["Sediakan formulir atau lembar kerja (worksheet) saat konseling agar siswa bisa mengurai akar masalahnya secara tertulis."], siswa: ["Susunlah glosarium atau buku saku mandiri yang berisi kumpulan kosakata (Mufradat) agar mudah dirujuk setiap saat."]
            },
            MTs_Transisi: {
                eduTitle1: "Pilihan Jurusan MA/SMA", eduList1: ["MA Keagamaan (Ilmu Tafsir/Hadis yang butuh analisis teks mendalam)", "MA Jurusan Bahasa / IPS"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Akuntansi Keuangan Lembaga", "Rekayasa Perangkat Lunak (Programming)", "Otomatisasi Tata Kelola Perkantoran"],
                materi: ["Eksplorasi Profesi Peneliti/Penulis Keagamaan", "Teknik Menjawab Soal Esai Panjang"], layanan: ["Tes Penelusuran Minat Bakat (Fokus Klerikal & Linguistik)"],
                guruBk: ["Gunakan asesmen kepribadian tertulis yang komprehensif sebagai data dukung penentuan jurusan siswa."], siswa: ["Keahlianmu dalam bidang literasi sangat berharga. Jurusan keagamaan yang memerlukan analisis teks mendalam akan sangat ideal untukmu."]
            },
            SMA_Awal: {
                eduTitle1: "Strategi Belajar (Fase E/F)", eduList1: ["Menggunakan modul, diktat, dan buku referensi eksternal sebagai sumber utama", "Membuat ringkasan eksekutif (*executive summary*) setiap kali selesai bab pelajaran"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Teknik *Copywriting* untuk publikasi organisasi/ekskul", "Kemampuan menyusun proposal kegiatan, surat resmi, dan Laporan Pertanggungjawaban (LPJ)"],
                materi: ["Teknik Penulisan Karya Tulis Ilmiah (KTI)", "Manajemen Pengutipan (Sitasi) dan Referensi"], layanan: ["Bimbingan metodologi penelitian dan penulisan karya ilmiah remaja (KIR)"],
                guruBk: ["Anjurkan siswa menyusun *Action Plan* (Rencana Tindakan) tertulis untuk memonitor progres pencapaian akademik dan karir mereka."], siswa: ["Ambil inisiatif sebagai penyusun notulensi, persuratan, atau proposal dalam organisasi sekolah untuk mengasah kompetensi kepenulisanmu."]
            },
            SMA_Transisi: {
                eduTitle1: "Persiapan UTBK/PTN", eduList1: ["Latihan intensif soal Literasi Bahasa Indonesia, Bahasa Inggris, dan Penalaran Umum", "Membaca artikel opini, tajuk rencana koran, dan jurnal untuk memperkaya kosakata ujian"],
                eduTitle2: "Alternatif Karier", eduList2: ["Editor Naskah / Jurnalis / *Content Writer*", "Analis Data / Programmer (Bahasa Kode/Teks)", "Staf Administrasi / Akuntan"],
                materi: ["Strategi Taktis Soal Literasi Panjang di UTBK", "Manajemen Waktu Membaca Teks (Scanning/Skimming Ekstrem)"], layanan: ["Tryout Khusus Kemampuan Membaca dan Menulis (Literasi SNBT)"],
                guruBk: ["Berikan banyak referensi bacaan terkait prospek kerja masa depan agar siswa bisa melakukan riset karir secara mandiri dan komprehensif."], siswa: ["Kuasai teks literasi panjang secara menyeluruh, karena pemahaman bacaan adalah komponen mayoritas penentu skor pada ujian SNBT/UTBK."]
            },
            MA_Awal: {
                eduTitle1: "Strategi Belajar (Fase E/F)", eduList1: ["Menelaah kitab kuning atau buku literatur sejarah Islam dengan mendalam", "Menulis makalah atau *paper* pendek terkait perbandingan mazhab atau kajian tafsir"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Penyusunan naskah pidato, khutbah, atau teks dakwah", "Kecakapan administrasi, surat-menyurat (kesekretariatan) organisasi madrasah"],
                materi: ["Metodologi Kajian Literatur Islam", "Teknik Parafrase dan Menghindari Plagiarisme"], layanan: ["Pendampingan penulisan esai kompetisi/beasiswa"],
                guruBk: ["Manfaatkan layanan Bimbingan Klasikal dengan memberikan modul atau *handout* tertulis yang bisa dibaca berulang oleh siswa di asrama/rumah."], siswa: ["Dokumentasikan intisari dari setiap kajian atau diskusi ke dalam bentuk tulisan terstruktur sebagai referensi akademik masa depan."]
            },
            MA_Transisi: {
                eduTitle1: "Persiapan UTBK/PTKIN", eduList1: ["Menguasai teknik analisis wacana kritis untuk soal-soal bacaan Bahasa Arab/Inggris", "Latihan menulis esai motivasi (Motivation Letter) untuk syarat pendaftaran beasiswa"],
                eduTitle2: "Alternatif Karier", eduList2: ["Peneliti/Dosen Agama", "Staf Kesekretariatan Lembaga Islam", "Penulis Buku / Pegawai Perpustakaan (Pustakawan)"],
                materi: ["Taktik Menaklukkan Soal *Reading Comprehension* (TOAFL/TOEFL)", "Bedah Esai Beasiswa (KIP-Kuliah / PBSB)"], layanan: ["Klinik Penulisan Esai dan *Curriculum Vitae* (CV)"],
                guruBk: ["Bantu me-review dan mengoreksi struktur kalimat pada esai beasiswa siswa agar terlihat lebih profesional dan meyakinkan."], siswa: ["Tingkatkan kemahiran membaca cepat (skimming) untuk mengidentifikasi ide pokok secara akurat dan menghemat waktu pengerjaan ujian."]
            },
            SMK_Awal: {
                eduTitle1: "Fokus Praktik Kejuruan", eduList1: ["Membaca secara detail Buku Manual Operasional (SOP / *Instruction Manual*) sebelum menggunakan mesin/software", "Menulis *Logbook* (buku catatan harian) praktikum/bengkel dengan sangat rinci dan runut"],
                eduTitle2: "Persiapan Magang/PKL", eduList2: ["Menyusun laporan kegiatan magang harian (*Daily Report*) dengan format industri yang baku", "Melakukan korespondensi email bisnis (*Business Email*) dengan pihak industri secara profesional"],
                materi: ["Literasi Dokumen Teknis dan SOP Industri", "Korespondensi Bisnis dan Administrasi Perkantoran Dasar"], layanan: ["Bimbingan penulisan proposal magang dan korespondensi industri"],
                guruBk: ["Berikan *template* baku (dokumen SOP/Buku Panduan Magang) secara tertulis agar siswa memahami aturan PKL dengan jelas tanpa ambiguitas."], siswa: ["Pelajari buku panduan teknis (*Manual Book*) secara komprehensif sebelum mengoperasikan mesin berat untuk meminimalisasi kesalahan prosedural."]
            },
            SMK_Transisi: {
                eduTitle1: "Persiapan Rekrutmen Kerja", eduList1: ["Menyusun Surat Lamaran Kerja (*Cover Letter*) dan *Curriculum Vitae* (CV) yang tajam, terstruktur, dan *ATS-Friendly*", "Mempelajari profil perusahaan, budaya kerja, dan kontrak kerja secara tertulis sebelum *interview*"],
                eduTitle2: "Alternatif Studi Lanjut Vokasi", eduList2: ["D4 Rekayasa Perangkat Lunak / Keamanan Siber", "D3 Akuntansi / Administrasi Bisnis Terapan", "D3 Kearsipan / Perpustakaan"],
                materi: ["Strategi Pembuatan CV dan Surat Lamaran Kerja Profesional", "Psikotes Berbasis Tes Klerikal (Ketelitian Data, Angka, dan Huruf)"], layanan: ["Klinik *Review* CV dan Simulasi Tes Klerikal/Administratif Industri"],
                guruBk: ["Fokuskan bimbingan pada penyempurnaan diksi dan tata bahasa dalam dokumen lamaran kerja (CV/Cover Letter) siswa agar lolos *screening* sistem ATS HRD."], siswa: ["Perhatikan setiap detail klausul pada dokumen kontrak kerja. Tingkat literasi yang tajam akan melindungi hak profesionalmu di dunia industri."]
            }
        }
    },
    K: {
        title: "Kinestetik", indonesianTitle: "Kinestetik (Gerakan)",
        desc: "Anda memiliki profil belajar berbasis tindakan nyata (*Learning by Doing*). Sistem kognitif Anda memproses informasi paling optimal ketika Anda bergerak, melakukan simulasi, atau terlibat langsung secara fisik dengan instrumen pembelajaran.",
        karir: ["Mekanik", "Ahli Bedah", "Atlet", "Koki (Chef)", "Polisi/TNI"], freelance: ["Instruktur Tari/Senam", "Pengrajin/Crafter"],
        levels: {
            SD_Awal: {
                eduTitle1: "Metode Belajar", eduList1: ["Penggunaan media ajar manipulatif (benda konkret seperti balok/kelereng)", "Pembelajaran berbasis gerak dan lagu (Kinesthetic-Musical)"],
                eduTitle2: "Karakteristik", eduList2: ["Memiliki rentang atensi pendek jika diwajibkan duduk statis", "Memiliki dorongan taktil (menyentuh) pada objek yang baru dikenali"],
                materi: ["Prakarya Motorik Halus (Origami, Plastisin)", "Pendidikan Jasmani (Motorik Kasar)"], layanan: ["Fasilitasi *Outdoor Learning* (Belajar di luar ruang)"],
                guruBk: ["Sisipkan *Brain Breaks* (Jeda Gerak Singkat) atau *Ice Breaking* fisik agar anak tidak frustrasi selama sesi bimbingan panjang."], siswa: ["Gunakan bantuan alat peraga fisik atau gerakan jari tangan untuk mempermudah proses memahami mata pelajaran."]
            },
            SD_Akhir: {
                eduTitle1: "Metode Belajar", eduList1: ["Simulasi sains melalui eksperimen langsung (*Hands-on Activity*)", "Penerapan metode *Roleplay* (Bermain peran) untuk pelajaran sejarah"],
                eduTitle2: "Karakteristik", eduList2: ["Sering mengetukkan alat tulis atau menggerakkan kaki saat berpikir", "Memiliki antusiasme tinggi pada tugas berbasis proyek kreatif"],
                materi: ["Keterampilan Motorik Terapan", "Praktikum IPA Lingkungan"], layanan: ["Konseling pendampingan bergerak (*Walking Counseling*)"],
                guruBk: ["Transformasikan sanksi duduk diam di kelas menjadi sanksi motorik ringan yang positif (misal: membersihkan rak buku kelas)."], siswa: ["Salurkan energi gerakmu secara positif, misalnya dengan menawarkan diri untuk mendistribusikan buku tugas kepada teman sekelas."]
            },
            SD_Transisi: {
                eduTitle1: "Target Lingkungan SMP", eduList1: ["Sekolah yang dilengkapi infrastruktur Laboratorium dan Bengkel Prakarya memadai", "Sekolah dengan fasilitas Gelanggang Olahraga terpadu"],
                eduTitle2: "Persiapan Ekskul SMP", eduList2: ["Klub Olahraga / Ekstrakurikuler Fisik", "Seni Teater Olah Tubuh / Tari"],
                materi: ["Pengenalan Budaya Praktikum Menengah", "Manajemen Energi dan Regulasi Diri"], layanan: ["Orientasi peminatan ekstrakurikuler lapangan SMP"],
                guruBk: ["Arahkan surplus energi kinetik siswa menuju seleksi ekstrakurikuler fisik bergengsi (Olahraga/Pramuka) di jenjang SMP."], siswa: ["Jika merasa kesulitan menghafal dalam posisi duduk, cobalah berjalan perlahan di dalam ruangan sembari menyuarakan materi."]
            },
            MI_Awal: {
                eduTitle1: "Metode Belajar Islami", eduList1: ["Praktikum integratif ibadah (Praktik Wudhu dan Shalat langsung)", "Metode hafalan kinetik (Bergerak repetitif ringan)"],
                eduTitle2: "Karakteristik Dasar", eduList2: ["Cenderung gelisah saat menyimak ceramah agama statis berdurasi panjang", "Memiliki reflek taktil seperti memainkan tasbih atau buku saku"],
                materi: ["Bimbingan Ibadah Praktis Dasar", "Penguatan Motorik Halus Islami (Memotong/Menempel)"], layanan: ["Fasilitasi peregangan fisik interaktif di sela bimbingan"],
                guruBk: ["Hindari intervensi yang mewajibkan siswa duduk kaku; libatkan mereka dalam tugas fisik kelas seperti menyiapkan papan tulis."], siswa: ["Gunakan sentuhan jari untuk melacak kalimat dan mengikuti setiap baris huruf saat membaca teks agar fokus tetap terjaga."]
            },
            MI_Akhir: {
                eduTitle1: "Metode Belajar Islami", eduList1: ["Simulasi Sejarah Kebudayaan Islam (SKI) melalui sosiodrama", "Eksplorasi ayat *Kauniyah* (IPA) secara langsung di alam terbuka"],
                eduTitle2: "Tanggung Jawab Akademik", eduList2: ["Berpartisipasi dalam Olahraga Sunnah (Panahan dasar/Bela Diri)", "Keterlibatan aktif dalam regu kepanduan (Bongkar pasang tenda)"],
                materi: ["Keterampilan Prakarya Madrasah", "Pendidikan Kebugaran dan Olahraga"], layanan: ["*Walking Counseling* (Konseling sambil berjalan di lapangan/taman)"],
                guruBk: ["Terapkan *Walking Counseling* di area terbuka madrasah untuk menciptakan suasana curhat yang rileks bagi siswa kinestetik."], siswa: ["Lakukan peregangan otot ringan atau berdirilah sejenak dari kursi apabila kamu mulai merasakan kejenuhan kognitif saat belajar."]
            },
            MI_Transisi: {
                eduTitle1: "Target Lingkungan MTs", eduList1: ["Madrasah dengan pembinaan ekskul Bela Diri/Olahraga terstruktur", "Madrasah yang secara aktif memanfaatkan Lab IPA untuk kegiatan praktik"],
                eduTitle2: "Persiapan Ekskul", eduList2: ["Perguruan Pencak Silat / Tapak Suci", "Paskibraka Madrasah tingkat dasar"],
                materi: ["Orientasi Lapangan Praktikum Menengah", "Teknik Regulasi Fokus dan Energi"], layanan: ["Simulasi kegiatan fisik ekstrakurikuler madrasah"],
                guruBk: ["Salurkan dorongan motorik berlebih siswa pada persiapan fisik seleksi ekstrakurikuler lapangan tingkat menengah."], siswa: ["Gunakan media manipulatif fisik seperti kartu hafalan (*flashcard*) yang dapat digenggam dan diurutkan langsung oleh tanganmu."]
            },
            SMP_Awal: {
                eduTitle1: "Strategi Belajar", eduList1: ["Terapkan metode memori kinetik (Mondar-mandir saat merapalkan hafalan)", "Konversi pemahaman teoritis MIPA ke medium eksperimen skala rumahan"],
                eduTitle2: "Karakteristik", eduList2: ["Sangat impulsif dan antusias saat berada di lingkungan Laboratorium", "Penggunaan bahasa isyarat (Gestur) tubuh secara masif saat berkomunikasi"],
                materi: ["Proyek Kewirausahaan dan Prakarya", "Manajemen Stres Berbasis Relaksasi Otot Kinetik"], layanan: ["Fasilitasi media manipulatif pereda stres (*Stress Ball / Fidget Spinner*)"],
                guruBk: ["Sediakan instrumen pereda stres kinestetik (seperti *squishy* atau *stress ball*) di ruang BK untuk menjaga fokus siswa saat sesi konseling."], siswa: ["Modifikasi teks bacaan menjadi pecahan-pecahan kertas kecil yang bisa dirangkai dan diurutkan secara fisik di atas meja belajar."]
            },
            SMP_Transisi: {
                eduTitle1: "Pilihan Jurusan SMA/MA", eduList1: ["Peminatan MIPA (Optimal pada aktivitas Praktikum Laboratorium intensif)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Teknik Kendaraan Ringan (Otomotif) / Permesinan", "Tata Boga / Tata Busana / Perhotelan", "Agribisnis"],
                materi: ["Eksplorasi Karir Industri Berbasis *Hard-Skill*", "Persiapan Mental Ujian Praktik Sekolah"], layanan: ["Tes Asesmen Kecerdasan Mekanikal dan Motorik Kasar"],
                guruBk: ["Edukasi siswa dan wali murid mengenai keunggulan siswa di ranah Vokasi (SMK), di mana metode *Learning by Doing* adalah kurikulum utamanya."], siswa: ["Lakukan riset mendalam terhadap pendidikan jalur vokasi (SMK) jika kamu memiliki minat belajar dominan pada eksperimen dan praktik riil."]
            },
            MTs_Awal: {
                eduTitle1: "Strategi Belajar", eduList1: ["Realisasi materi Fikih ibadah murni melalui simulasi gerak (Praktik Tayammum/Shalat Jenazah)", "Pemanfaatan instrumen maket/diorama tiga dimensi untuk mata pelajaran Sejarah"],
                eduTitle2: "Karakteristik", eduList2: ["Menunjukkan atensi penuh saat diajak melakukan observasi di luar ruang kelas", "Cenderung responsif dan komunikatif melalui gerakan tubuh dan tangan"],
                materi: ["Praktikum Ibadah Komprehensif", "Manajemen Atensi (Teknik Pomodoro Aktif)"], layanan: ["Pembuatan Proyek Karya Visual-Kinetik Berbasis 3D"],
                guruBk: ["Hargai kebutuhan gerak siswa; jangan paksa mereka melakukan kontak mata statis jika gerakan tangan membantu mereka mengartikulasikan masalah."], siswa: ["Terapkan metode penulisan manual menggunakan alat tulis konvensional. Memori otot (*muscle memory*) sangat ampuh menyimpan informasi abstrak."]
            },
            MTs_Transisi: {
                eduTitle1: "Pilihan Jurusan MA/SMA", eduList1: ["MA Program Plus Keterampilan (Otomotif/Tata Busana/Kelistrikan)", "MIPA (Fokus Eksperimental)"],
                eduTitle2: "Pilihan Jurusan SMK", eduList2: ["Teknik Rekayasa & Otomotif", "Hospitality (Pariwisata/Perhotelan)", "Teknik Komputer & Jaringan (Hardware)"],
                materi: ["Pengenalan Karir Keterampilan Tangan Profesional Vokasi", "Strategi Fisik Menghadapi Ujian Praktik Akhir"], layanan: ["Simulasi Tes Minat Bakat Ranah Teknikal dan Praktikal"],
                guruBk: ["Berikan validasi positif bahwa kecerdasan kinestetik mereka adalah aset krusial untuk sukses di sekolah Vokasi atau MA Keterampilan."], siswa: ["Salurkan kecekatan motorikmu secara terarah. Jurusan keahlian yang mengedepankan praktik keterampilan tangan adalah wadah potensialmu."]
            },
            SMA_Awal: {
                eduTitle1: "Strategi Belajar (Fase E/F)", eduList1: ["Implementasi pembelajaran berbasis proyek (*Project-Based Learning*) seperti perakitan maket MIPA/IPS", "Mengkonsumsi camilan ringan (*Snacking*) untuk menstimulasi saraf motorik rahang saat belajar"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Kecakapan perakitan komponen perangkat keras (*Hardware/Troubleshooting*)", "Daya tahan fisik (*Endurance*) pada aktivitas lapangan ekstrem (Pecinta Alam/SAR)"],
                materi: ["Praktikum Eksperimental Laboratorium Lanjutan", "Manajemen Pendidikan Kebugaran Jasmani"], layanan: ["Fasilitasi program Bakti Sosial / Relawan Lapangan Eksternal"],
                guruBk: ["Sarankan penerapan teknik *Pomodoro* (interval fokus-istirahat aktif) untuk mencegah sindrom kelelahan kognitif (*Burnout*) pada siswa."], siswa: ["Terapkan metode manajemen waktu berjeda (*Pomodoro Interval*). Gunakan waktu istirahat untuk mobilitas fisik agar fokus otak pulih optimal."]
            },
            SMA_Transisi: {
                eduTitle1: "Persiapan UTBK/PTN", eduList1: ["Pengunyahan permen karet bebas gula selama simulasi Tryout untuk merangsang sirkulasi darah ke otak", "Mentransfer formula matematika kompleks ke dalam gerakan atau gestur spesifik"],
                eduTitle2: "Alternatif Karier", eduList2: ["Akademi Militer/Kepolisian (TNI/Polri)", "Instruktur Kebugaran/Pelatih Muda Olahraga", "Teknisi Industri / Mekanik Entry-Level"],
                materi: ["Persiapan Tes Kesamaptaan Jasmani Kedinasan", "Regulasi Stres Ujian Berbasis Relaksasi Fisik"], layanan: ["Pendampingan Medis dan Fisik Syarat Pendaftaran Kedinasan"],
                guruBk: ["Lakukan monitoring indeks kebugaran (Postur, BMI, Buta Warna, THT) secara dini jika siswa menargetkan masuk Akademi Kedinasan."], siswa: ["Goreskan alur penyelesaian rumus secara fisik dan berulang. Daya ingat memori otot tangan akan mendongkrak ketepatan waktu pengerjaan tesmu."]
            },
            MA_Awal: {
                eduTitle1: "Strategi Belajar (Fase E/F)", eduList1: ["Pembuatan karya instalasi fisik/Maket 3D untuk menunjang proyek Profil Pelajar Pancasila (P5)", "Simulasi tata cara manasik haji atau fikih penyembelihan kurban secara aplikatif di lapangan"],
                eduTitle2: "Keterampilan Soft-Skill", eduList2: ["Kecakapan teknis Palang Merah Remaja (PMR/Kesehatan Lapangan Dasar)", "Keterampilan *Survival* pada ekstrakurikuler Pramuka Penegak Madrasah"],
                materi: ["Eksplorasi Praktikum Biologi/Kimia Terpadu (Fase F)", "Anatomi Fisiologi dan Pendidikan Kesehatan Remaja"], layanan: ["Dukungan institusional untuk program pengabdian masyarakat lapangan"],
                guruBk: ["Edukasi siswa dengan metode Relaksasi Otot Progresif (*Progressive Muscle Relaxation*) untuk menetralisir ketegangan fisik akibat beban tugas madrasah yang padat."], siswa: ["Hindari sesi menghafal literatur sejarah dalam keadaan statis berjam-jam. Integrasikan aktivitas gerak fisik ringan untuk menghindari kelelahan mental."]
            },
            MA_Transisi: {
                eduTitle1: "Persiapan UTBK/PTKIN", eduList1: ["Pengulangan penulisan manual (Tulis Tangan) dalil atau rumus untuk membangun *Muscle Memory*", "Mengkondisikan saraf gerak saat mengerjakan Tryout (Mengetukkan ujung jari perlahan)"],
                eduTitle2: "Alternatif Karier", eduList2: ["Taruna Akademi Militer/Kepolisian", "Pengrajin Seni Kriya / Pekerja Kreatif Fisik", "Ahli Gizi Kuliner / Koki Vokasi"],
                materi: ["Latihan Intensif Ujian Fisik Kesamaptaan (TNI/Polri/STIN)", "Metode Manajemen Stres Psikososial Berbasis Kinetik"], layanan: ["Simulasi Periodik Tes Samapta (Lari 12 Menit, Pull-up, *Shuttle Run*)"],
                guruBk: ["Bimbing siswa untuk mempersiapkan administrasi dan fisik sedini mungkin jika memiliki intensi kuat menembus seleksi Akademi Ikatan Dinas."], siswa: ["Manfaatkan kertas perancangan (*draft*) yang diberikan pengawas secara maksimal saat tes akademik. Goresan pena akan membantu otak berpikir sistematis."]
            },
            SMK_Awal: {
                eduTitle1: "Fokus Praktik Kejuruan", eduList1: ["Optimalisasi jam kerja *Teaching Factory* di area Bengkel, Dapur Komersial, atau Laboratorium Terpadu", "Pengenalan taktil (Sentuhan fisik) terhadap bentuk, tekstur, dan letak komponen mesin/bahan praktik industri"],
                eduTitle2: "Persiapan Magang/PKL", eduList2: ["Simulasi ketahanan fisik (*Stamina Building*) untuk beradaptasi dengan ritme kerja berdiri (*Standing Operation*) di industri", "Pelatihan manuver alat berat atau mesin presisi tinggi sesuai standar baku operasional"],
                materi: ["Penerapan Prinsip 5R Industri (Ringkas, Rapi, Resik, Rawat, Rajin)", "Standar Kesehatan, Keselamatan Kerja, dan Lingkungan Hidup (K3LH)"], layanan: ["Inspeksi Kedisiplinan Penggunaan Alat Pelindung Diri (APD/Safety Gear)"],
                guruBk: ["Tanamkan kesadaran penuh (*Mindfulness*) pada siswa kinestetik agar meminimalkan impulsivitas dan manuver ceroboh saat berada di area praktik berisiko tinggi."], siswa: ["Jadikan kecekatan tangan dan observasi fisik secara taktil sebagai senjatamu, sembari patuh sepenuhnya pada regulasi keselamatan kerja."]
            },
            SMK_Transisi: {
                eduTitle1: "Persiapan Rekrutmen Kerja", eduList1: ["Fokus absolut pada pencapaian nilai sempurna di Uji Kompetensi Keahlian (UKK) praktik industri", "Manajemen istirahat fisik (*Recovery*) H-1 sebelum menghadapi tes kemampuan lapangan perusahaan"],
                eduTitle2: "Alternatif Studi Lanjut Vokasi", eduList2: ["Politeknik Negeri Manufaktur (Polman) / Teknik Rekayasa Terapan", "Sekolah Tinggi Pariwisata (NHI / Manajemen Tataboga Internasional)", "Akademi Kedinasan Militer / Navigasi Laut"],
                materi: ["Simulasi Penilaian *Hard-Skill* Industri Berbasis Tekanan Waktu", "Manajemen Kelelahan Otot (*Fatigue Management*) di Shift Kerja Industri"], layanan: ["Penyaluran Tenaga Kerja ke Sektor Manufaktur, Pertambangan, Konstruksi BUMN/Swasta (BKK)"],
                guruBk: ["Petakan profil kinetik siswa untuk disalurkan secara presisi ke mitra industri yang menuntut stamina, kecekatan tangan, dan ketahanan fisik (*Endurance*) tinggi."], siswa: ["Tunjukkan demonstrasi teknis secara profesional dengan tingkat akurasi tinggi pada saat menghadapi uji kompentensi perusahaan industri."]
            }
        }
    }
};