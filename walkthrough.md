# Walkthrough Refaktorisasi Arsitektur: SSOT & Rule Engine

Refaktorisasi menyeluruh telah berhasil dilakukan pada seluruh codebase aplikasi DIGIBK untuk menerapkan:
1. **Single Source of Truth (SSOT)**: Menyatukan kamus data, konstanta, dan konfigurasi asesmen yang sebelumnya terduplikasi.
2. **Separation of Concerns**: Memisahkan logika bisnis (assembly data & evaluasi) dari UI dan Server Actions ke Service Layer.
3. **Penerapan Mesin Aturan (Rule Engine)**: Pure functions untuk evaluasi status emosi & risiko siswa.

---

## Ringkasan Perubahan

### 1. Layer Constants (SSOT)
- **[riasec.constants.ts](file:///d:/APLIKASI/digibk/lib/constants/riasec.constants.ts)**:
  - Menyimpan `RIASEC_CODES`, `RIASEC_VERSION_MAP`, `RIASEC_SCORING_VERSION`, `RIASEC_DIMENSION_PRIORITY`, dan `RIASEC_DESC`.
- **[vark.constants.ts](file:///d:/APLIKASI/digibk/lib/constants/vark.constants.ts)**:
  - Menyimpan `VARK_CODES`, `VARK_VERSION_MAP`, `VARK_SCORING_VERSION`, `VARK_DIMENSION_PRIORITY`, `VARK_DESC`, `VARK_MULTIMODAL_DESC`, dan `VARK_COLORS`.
- **[emotion.constants.ts](file:///d:/APLIKASI/digibk/lib/constants/emotion.constants.ts)**:
  - Menyimpan `EMOTION_LABEL_MAP`, `AT_RISK_EMOTIONS`, dan `AT_RISK_INTENSITY_THRESHOLD`.

### 2. Layer Rules (Rule Engine)
- **[emotion.rules.ts](file:///d:/APLIKASI/digibk/lib/rules/emotion.rules.ts)**:
  - `isAtRisk(emotion, intensity)`: Logika tunggal penentu status kritis/berisiko.
  - `assessRisk(emotion, intensity)`: Mengembalikan `'CRITICAL' | 'STABLE' | 'UNCHECKED'`.
  - `getEmotionLabel(emotion)`: Format label bahasa Indonesia.

### 3. Layer Utilities
- **[assessment.utils.ts](file:///d:/APLIKASI/digibk/lib/utils/assessment.utils.ts)**:
  - `resolveEducationPhase(eduLvl, grade)`: Menghilangkan duplikasi penentuan fase pendidikan antara RIASEC dan VARK (mendukung SD, MI, SMP, MTs, SMA, MA, SMK).
  - `cleanCode(code)`: Normalisasi kode string.
  - `blendArrays(...)`: Utility penggabungan array rekomendasi.
- **[date.utils.ts](file:///d:/APLIKASI/digibk/lib/utils/date.utils.ts)**:
  - `formatIndonesianDate(dateString)`: Format tanggal baku Indonesia WIB.

### 4. Layer Services & Actions
- **[student-profile.service.ts](file:///d:/APLIKASI/digibk/features/bk/services/student-profile.service.ts)** (NEW):
  - Memisahkan fungsi perakitan data (`assembleRiasecProfile`, `assembleVarkProfile`) dari Server Actions.
- **[student-detail.actions.ts](file:///d:/APLIKASI/digibk/features/bk/actions/student-detail.actions.ts)**:
  - Disederhanakan menjadi tipis (hanya auth & database fetch).
- **[dashboard.actions.ts](file:///d:/APLIKASI/digibk/features/bk/actions/dashboard.actions.ts)**:
  - Menggunakan `isAtRisk()` dari Rule Engine.
- **[riasec.actions.ts](file:///d:/APLIKASI/digibk/features/assessments/actions/riasec.actions.ts)** & **[vark.actions.ts](file:///d:/APLIKASI/digibk/features/assessments/actions/vark.actions.ts)**:
  - Menggunakan konstanta SSOT dan menghilangkan duplikasi kamus lokal.
- **[riasec-result.service.ts](file:///d:/APLIKASI/digibk/features/student/services/riasec-result.service.ts)** & **[vark-result.service.ts](file:///d:/APLIKASI/digibk/features/student/services/vark-result.service.ts)**:
  - Menggunakan `resolveEducationPhase()` shared utility.

### 5. Layer UI
- **[app/bk/students/[id]/page.tsx](file:///d:/APLIKASI/digibk/app/bk/students/[id]/page.tsx)**:
  - Menggunakan `isAtRisk` dan `getEmotionLabel` dari Rule Engine.
  - Menggunakan `formatIndonesianDate` dari date utils.
  - Type-safe penuh tanpa `as any`.
