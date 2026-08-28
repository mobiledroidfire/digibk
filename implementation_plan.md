# Refactoring Arsitektur: Separation of Concerns, SSOT & Rule Engine

## Latar Belakang

Setelah analisis menyeluruh terhadap seluruh codebase, ditemukan beberapa masalah arsitektur utama yang perlu diselesaikan agar aplikasi lebih maintainable, scalable, dan bebas dari duplikasi logika.

---

## Temuan Masalah (Hasil Analisis)

### 1. Duplikasi Kamus/Konstanta — Bukan SSOT

Terdapat **3 definisi RIASEC_DESC** yang berbeda dan **2 definisi VARK_DESC** tersebar di codebase:

| File | Konstanta | Masalah |
|---|---|---|
| `features/bk/actions/student-detail.actions.ts` | `RIASEC_DESC`, `VARK_DESC` | Definisi lokal inline di Server Action |
| `features/student/services/riasec-result.service.ts` | `riasecTranslations` | Hanya sebagian data, berbeda format |
| `lib/data/riasec.ts` | `riasecDictionary` | Sumber data utama, tapi tidak dipakai BK |
| `lib/data/vark.ts` | `varkDictionary` | Sumber data utama, tapi tidak dipakai BK |

**Akibat**: Perubahan teks keterangan harus dilakukan di 3+ tempat → rawan inkonsistensi.

---

### 2. Logika Bisnis di dalam Server Action — Melanggar Separation of Concerns

Di `student-detail.actions.ts`, terdapat logika assembly hasil asesmen yang **seharusnya ada di layer Service**, bukan di Action layer.

---

### 3. Tidak Ada Rule Engine — Logika Risiko Tersebar di UI

Logika "kapan siswa dianggap berisiko" didefinisikan di **3 tempat berbeda**:

```typescript
// app/bk/students/[id]/page.tsx (UI Layer!) ← SALAH TEMPAT
const isAtRisk = latestEmotion && ['SAD','DISAPPOINTED','ANGRY','AFRAID','ANXIOUS']
  .includes(latestEmotion.emotion) && latestEmotion.intensity >= 7;

// features/bk/actions/dashboard.actions.ts (Action Layer) ← DUPLIKAT
const isCritical = studentEmotion
  ? ['SAD','DISAPPOINTED','ANGRY','AFRAID','ANXIOUS']
    .includes(studentEmotion.emotion) && studentEmotion.intensity >= 7
  : false;
```

Jika threshold risiko berubah dari `>= 7` menjadi `>= 6`, harus dicari manual di seluruh codebase.

---

### 4. ScoreItem Terduplikasi dengan Struktur Berbeda

`ScoreItem` didefinisikan di `student-detail.actions.ts` (`{name, score}`) dan `result.types.ts` (`{code, raw_score}`) — dua format berbeda, menyebabkan `as any` cast di UI.

---

### 5. Logika Fase Pendidikan Terduplikasi di Dua Service

Blok if-else ~30 baris untuk menentukan fase berdasarkan jenjang & kelas **identik persis** di `riasec-result.service.ts` dan `vark-result.service.ts`.

---

## Arsitektur Target

```
lib/
  constants/
    emotion.constants.ts   [BARU] SSOT: Label & array emosi berisiko
    riasec.constants.ts    [BARU] SSOT: Kamus ringkas RIASEC
    vark.constants.ts      [BARU] SSOT: Kamus ringkas VARK + warna grafik
  rules/
    emotion.rules.ts       [BARU] Rule Engine: Pure functions penilaian risiko
  utils/
    date.utils.ts          [BARU] formatIndonesianDate (hapus duplikasi dari UI)
    assessment.utils.ts    [BARU] cleanCode, blendArrays, resolveEducationPhase

features/
  student/
    types/
      result.types.ts      [MODIFY] Konsolidasi ScoreItem, tambah RiskLevel
    services/
      riasec-result.service.ts  [MODIFY] Pakai resolveEducationPhase()
      vark-result.service.ts    [MODIFY] Pakai resolveEducationPhase()
  bk/
    services/                   [BARU] Layer service untuk BK
      student-profile.service.ts [BARU] assembleRiasecResult, assembleVarkResult
    actions/
      student-detail.actions.ts [MODIFY] Hanya auth + query + panggil service
      dashboard.actions.ts      [MODIFY] Gunakan isAtRisk() dari Rule Engine
    
app/
  bk/students/[id]/page.tsx   [MODIFY] Bersihkan logika & konstanta inline
```

---

## Proposed Changes

### Layer 1 — SSOT Constants & Utilities

---

#### [NEW] `lib/constants/riasec.constants.ts`

Kamus pendek RIASEC sebagai SSOT. Import ke `student-detail.actions.ts`, `riasec-result.service.ts`, dan komponen manapun.

#### [NEW] `lib/constants/vark.constants.ts`

Kamus pendek VARK + warna grafik sebagai SSOT. Menghilangkan `varkColors` hardcoded inline di action.

#### [NEW] `lib/constants/emotion.constants.ts`

- `EMOTION_LABEL_MAP: Record<EmotionType, string>` — label Bahasa Indonesia
- `AT_RISK_EMOTIONS: EmotionType[]` — daftar emosi berisiko  
- `AT_RISK_INTENSITY_THRESHOLD = 7` — ambang batas intensitas

#### [NEW] `lib/rules/emotion.rules.ts` ← **Rule Engine Utama**

```typescript
export type RiskLevel = 'CRITICAL' | 'STABLE' | 'UNCHECKED';

// Satu fungsi wasit untuk seluruh aplikasi
export function assessRisk(emotion: EmotionType, intensity: number): RiskLevel

// Helper sederhana
export function isAtRisk(emotion: EmotionType, intensity: number): boolean

export function getEmotionLabel(emotion: EmotionType): string
```

#### [NEW] `lib/utils/assessment.utils.ts`

- `cleanCode(code: string): string`
- `blendArrays(...arrays, maxItems): string[]`
- `resolveEducationPhase(eduLvl, grade): PhaseResolution` — **menghapus duplikasi ~60 baris**

#### [NEW] `lib/utils/date.utils.ts`

- `formatIndonesianDate(dateString: string): string`

---

### Layer 2 — Konsolidasi Types

---

#### [MODIFY] `features/student/types/result.types.ts`

- Pisahkan `ScoreItem` menjadi `RawScoreItem` (database) dan `ChartScoreItem` (UI)
- Tambah `export type RiskLevel`

---

### Layer 3 — Refactor Existing Services

---

#### [MODIFY] `features/student/services/riasec-result.service.ts`

Hapus blok if-else logika fase (~30 baris), ganti dengan satu baris:
```typescript
const { phaseKey, bannerTitle, bannerMessage, isTransisi } = resolveEducationPhase(eduLvl, grade);
```

#### [MODIFY] `features/student/services/vark-result.service.ts`

Sama seperti di atas, hapus duplikasi logika fase (~25 baris).

---

### Layer 4 — Buat BK Service, Refactor Actions

---

#### [NEW] `features/bk/services/student-profile.service.ts`

```typescript
// Dipindahkan dari student-detail.actions.ts
export function assembleRiasecResult(rawData: RiasecProfileRaw): RiasecResult | null
export function assembleVarkResult(rawData: VarkProfileRaw): VarkResult | null
```

#### [MODIFY] `features/bk/actions/student-detail.actions.ts`

Setelah refactor, action ini hanya berisi:
1. Auth & otorisasi
2. Query database (raw data)
3. `assembleRiasecResult()` dan `assembleVarkResult()` dari service
4. Return hasil

Hapus: `RIASEC_DESC`, `VARK_DESC`, `VARK_MULTIMODAL`, semua logika assembly.

#### [MODIFY] `features/bk/actions/dashboard.actions.ts`

```diff
- const isCritical = studentEmotion
-   ? ['SAD', 'DISAPPOINTED', 'ANGRY', 'AFRAID', 'ANXIOUS']
-     .includes(studentEmotion.emotion) && studentEmotion.intensity >= 7
-   : false;
+ const isCritical = studentEmotion
+   ? isAtRisk(studentEmotion.emotion, studentEmotion.intensity)
+   : false;
```

---

### Layer 5 — Bersihkan UI

---

#### [MODIFY] `app/bk/students/[id]/page.tsx`

```diff
- const EMOTION_MAP = { 'HAPPY': 'Senang', ... }  // 10 baris
+ import { getEmotionLabel } from '@/lib/rules/emotion.rules';

- const formatIndonesianDate = (dateString) => { ... }  // 5 baris
+ import { formatIndonesianDate } from '@/lib/utils/date.utils';

- const isAtRisk = latestEmotion && ['SAD',...].includes(...) && ...intensity >= 7;
+ const isAtRisk = latestEmotion && isStudentAtRisk(latestEmotion.emotion, latestEmotion.intensity);

- <StudentRiasecRadar scores={(profile.riasec_result as any).scores} />
+ <StudentRiasecRadar scores={profile.riasec_result.scores} />  // Typed dengan benar
```

---

## Verification Plan

### Automated Tests
```bash
npx tsc --noEmit
```

### Manual Verification
- `/bk/students/[id]` — profil siswa, grafik RIASEC & VARK masih tampil
- `/bk/dashboard` — badge "Kritis" dan daftar siswa tetap benar
- `/student/dashboard` — status jurus & lock/unlock masih benar
- `/student/potential/result` — hasil RIASEC siswa masih tampil

---

## Open Questions

> [!IMPORTANT]
> **Scope:** Apakah termasuk juga refactor `features/assessments/actions/riasec.actions.ts` dan `vark.actions.ts` (masing-masing ~14KB)? Atau hanya file-file di atas?

> [!NOTE]
> **Konsistensi Fase VARK vs RIASEC:** `vark-result.service.ts` tidak membedakan MI/MTs (hanya `SD_Awal`, `SMP_Awal`). Apakah ini disengaja atau ikut diperbaiki konsisten dengan `riasec-result.service.ts`?
