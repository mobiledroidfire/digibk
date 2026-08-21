# DIGIBK — MASTER DEVELOPMENT PLAN

Version: 1.0
Last Updated: 22 August 2026
Project Status: MVP DEVELOPMENT
Implementation Target: 28 August 2026
Reporting Target: 8 September 2026

---

# 1. PROJECT IDENTITY

Project Name:
DIGIBK

Description:
Platform digital Bimbingan dan Konseling untuk peserta didik SD, SMP/MTs,
SMA/MA, dan SMK.

Target Domain:
https://digitech.id

Application:
https://bk.digitech.id

Primary Purpose:

DIGIBK bukan aplikasi psikotes.

DIGIBK adalah platform digital untuk:

- asesmen
- eksplorasi diri
- refleksi
- pengembangan diri
- goal setting
- monitoring
- pendampingan BK
- pelaporan

Framework utama:

7 JURUS BK

1. Kenali Potensi
2. Kelola Emosi
3. Tumbuhkan Resiliensi
4. Jaga Konsistensi
5. Jalin Koneksi
6. Bangun Kolaborasi
7. Menata Situasi

---

# 2. CURRENT MVP SCOPE

Karena target implementasi adalah 28 August 2026,
MVP tahap pertama hanya berfokus pada:

1. Authentication
2. School
3. Class
4. Student
5. Assessment Engine
6. Kenali Potensi
7. RIASEC
8. Kelola Emosi
9. Student Dashboard
10. BK Dashboard
11. Rule Engine dasar
12. Result
13. Basic Report

Jangan mengembangkan seluruh 7 Jurus sebelum MVP stabil.

Jurus 3–7 ditunda ke fase berikutnya.

---

# 3. CORE PRINCIPLE

DIGIBK tidak menggunakan alur:

TEST
↓
RESULT
↓
FINISH

Tetapi:

KENALI
↓
PAHAMI
↓
REFLEKSI
↓
KEMBANGKAN
↓
DAMPINGI
↓
MONITOR
↓
EVALUASI

Guru BK tetap menjadi pihak profesional dalam proses pendampingan.

AI hanya sebagai assistive tool.

---

# 4. PSYCHOMETRIC PRINCIPLE

Jangan mengklaim:

- 100% akurat
- diagnosis psikologis
- valid dan reliabel jika belum diuji
- hasil menentukan masa depan siswa
- hasil menentukan jurusan secara mutlak

Gunakan istilah:

- hasil asesmen
- kecenderungan
- profil
- indikator
- eksplorasi
- area pengembangan

Setiap assessment idealnya memiliki:

- construct
- dimension
- indicator
- item
- response scale
- scoring
- reverse scoring
- interpretation
- age suitability
- grade suitability
- assessment version

---

# 5. RIASEC

RIASEC digunakan sebagai komponen utama pada:

KENALI POTENSI

Codes:

R = Realistic
I = Investigative
A = Artistic
S = Social
E = Enterprising
C = Conventional

Output:

- raw score
- normalized score
- ranking
- top 3 code
- profile
- recommendation

Contoh:

S = 92
C = 83
I = 69

Top code:

S-C-I

RIASEC tidak boleh menjadi satu-satunya dasar keputusan pendidikan atau karier.

Rekomendasi harus menggunakan istilah:

"bidang yang dapat dieksplorasi"

bukan:

"Anda harus menjadi..."

---

# 6. LEARNING PREFERENCE

Jika digunakan pendekatan VAK atau sejenisnya,
jangan memberi label:

"anak ini Visual"

Gunakan:

"preferensi aktivitas belajar"

dan berikan variasi aktivitas.

---

# 7. EMOTION

Jurus 2 tidak boleh hanya berupa tes.

Gunakan:

EMOTIONAL CHECK-IN

Pilihan contoh:

- senang
- tenang
- sedih
- kecewa
- marah
- takut
- cemas
- bingung
- netral
- lainnya

Kemudian:

- apa yang dirasakan?
- apa penyebabnya?
- apa yang dilakukan?
- apa yang membantu?
- apakah ingin berbicara dengan seseorang?

Tidak boleh melakukan diagnosis.

Jika perlu perhatian:

"Terdapat hal yang sebaiknya dibicarakan lebih lanjut dengan guru BK/konselor."

---

# 8. AI PRINCIPLE

AI adalah:

ASSISTIVE TOOL

AI boleh:

- menjelaskan hasil
- menyederhanakan bahasa
- membuat pertanyaan refleksi
- membuat aktivitas
- membuat rekomendasi pengembangan
- membantu guru membuat tindak lanjut
- membantu membuat laporan

AI tidak boleh:

- mendiagnosis
- menentukan gangguan mental
- memberi label negatif
- menentukan masa depan siswa
- menentukan jurusan secara mutlak
- menggantikan guru BK
- mengubah skor psikometri

AI tidak menghitung skor psikometri.

Scoring harus deterministic.

---

# 9. TECHNOLOGY STACK

Frontend:

Next.js
TypeScript
App Router
Tailwind CSS
shadcn/ui
Lucide React

Backend:

Next.js Server
Server Components
Server Actions / Route Handlers
Zod

Database:

Supabase PostgreSQL

Authentication:

Supabase Auth

Security:

Supabase RLS
RBAC
Zod
server-side validation
secure cookies
secure headers
rate limiting
audit logs

Storage:

Supabase Storage

Deployment:

GitHub
Vercel

---

# 10. AI PROVIDER ARCHITECTURE

Business logic tidak boleh bergantung langsung pada vendor AI.

Gunakan abstraction:

AIProvider

Possible providers:

OpenAIProvider
GeminiProvider
AnthropicProvider
OpenRouterProvider

AI provider dapat diganti tanpa mengubah business logic.

---

# 11. PROJECT ARCHITECTURE

Use Feature-Based Architecture.

Target structure:

src/
│
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── forgot-password/
│   │
│   ├── student/
│   │   ├── dashboard/
│   │   ├── potential/
│   │   ├── emotion/
│   │   └── results/
│   │
│   ├── bk/
│   │   ├── dashboard/
│   │   ├── students/
│   │   ├── assessments/
│   │   └── reports/
│   │
│   ├── api/
│   └── layout.tsx
│
├── features/
│   ├── auth/
│   ├── students/
│   ├── assessments/
│   ├── psychometrics/
│   ├── riasec/
│   ├── emotion/
│   ├── recommendations/
│   └── reports/
│
├── components/
│   ├── ui/
│   ├── layout/
│   └── shared/
│
├── lib/
│   ├── supabase/
│   ├── auth/
│   ├── validation/
│   └── utils/
│
├── types/
│
└── config/

---

# 12. DATABASE

Database platform:

Supabase PostgreSQL

Initial database version:

V1

Main tables:

schools
users
user_roles
academic_years
classes
students
class_memberships
school_staff

assessment_domains
assessments
assessment_versions
assessment_dimensions
questions
question_options
scoring_rules

assessment_sessions
assessment_responses
assessment_results
assessment_result_dimensions

riasec_profiles
riasec_results

recommendations
assessment_recommendations

emotional_checkins
reflection_entries

report_templates
reports

consents
audit_logs

---

# 13. DATABASE RULE

Database schema must NOT be changed casually.

Any schema modification must use a migration.

Example:

supabase/migrations/

YYYYMMDDXXXX_description.sql

Never modify production database schema without documenting the migration.

Before migration:

1. inspect existing schema
2. determine impact
3. create migration
4. run migration
5. test
6. commit
7. deploy

---

# 14. DATABASE VERSIONING

Current:

DATABASE V1

Assessment versioning is mandatory.

Example:

RIASEC-MVP-v1

Future:

RIASEC-SD-v1
RIASEC-SMP-v1
RIASEC-SMA-v1
RIASEC-SMK-v1

If an instrument changes:

v1 → v2

Old results MUST remain unchanged.

---

# 15. CURRENT DATABASE STATUS

Database has already been created in Supabase.

Initial seed:

Assessment domains:

POTENTIAL
EMOTION

RIASEC assessment:

RIASEC

RIASEC version:

RIASEC-MVP-v1

RIASEC dimensions:

R
I
A
S
E
C

Recommendations have initial seed data.

Do NOT recreate the database from scratch.

---

# 16. SUPABASE CLIENT

Browser client:

src/lib/supabase/client.ts

Server client:

src/lib/supabase/server.ts

Session refresh:

src/lib/supabase/proxy.ts

Next.js proxy:

src/proxy.ts

Use @supabase/ssr.

Do not use outdated Supabase authentication patterns unless explicitly justified.

---

# 17. ENVIRONMENT VARIABLES

Expected:

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

Never expose:

Supabase service role key
AI secret keys
private credentials

Do not commit .env.local.

---

# 18. CURRENT DEVELOPMENT STATUS

COMPLETED:

[x] Next.js project
[x] TypeScript
[x] Tailwind
[x] Supabase project
[x] PostgreSQL database
[x] Initial database schema
[x] RLS foundation
[x] Supabase browser client
[x] Supabase server client
[x] Supabase session proxy
[x] Git repository
[x] GitHub repository
[x] Database connection test

TESTED:

/test-db

Expected data:

POTENTIAL
EMOTION

---

# 19. CURRENT GIT STATUS

Branch:

main

Remote:

GitHub

Working tree:

clean

Current repository is synchronized with origin/main.

---

# 20. VERCEL STATUS

Vercel deployment:

PENDING / NEXT

Custom domain:

bk.digitech.id

Vercel plugin:

NOT REQUIRED FOR CORE DEVELOPMENT

Do not waste development time trying to install
vercel/vercel-plugin unless a specific supported AI agent
requires it.

---

# 21. DEVELOPMENT PHASES

PHASE 0 — FOUNDATION

Status: COMPLETED

Tasks:

- Next.js
- TypeScript
- Tailwind
- Supabase
- PostgreSQL
- RLS foundation
- GitHub

---

PHASE 1 — AUTHENTICATION

Status: NEXT

Tasks:

- Supabase Auth
- Login
- Logout
- Session
- Role detection
- Protected routes
- Student redirect
- BK redirect
- Admin redirect

Roles:

STUDENT
TEACHER
BK_COUNSELOR
SCHOOL_ADMIN
PARENT
SUPER_ADMIN

---

PHASE 2 — STUDENT MANAGEMENT

Tasks:

- school
- academic year
- class
- student
- class membership
- student profile
- student search
- student filtering

---

PHASE 3 — ASSESSMENT ENGINE

This is the core engine.

Flow:

Assessment
↓
Version
↓
Dimension
↓
Question
↓
Option
↓
Session
↓
Response
↓
Scoring
↓
Result

Assessment engine must be reusable.

Do not hard-code RIASEC logic directly into React components.

---

PHASE 4 — RIASEC

Flow:

Student
↓
Instructions
↓
Questions
↓
Responses
↓
Deterministic scoring
↓
R
I
A
S
E
C
↓
Ranking
↓
Top 3
↓
Profile
↓
Recommendations

---

PHASE 5 — EMOTION

Features:

- emotional check-in
- emotion selection
- intensity
- context
- coping
- help seeking
- wants to talk
- reflection

---

PHASE 6 — RESULT

Display:

- raw score
- normalized score
- ranking
- profile
- interpretation
- recommendations

Never modify stored historical result because of a later scoring change.

---

PHASE 7 — RULE ENGINE

Rule Engine must be separated from UI.

Inputs may include:

- assessment results
- student profile
- grade
- education level
- interests
- aspirations
- activities

Outputs:

- profile
- development area
- activity recommendation
- education exploration
- career exploration
- follow-up recommendation

Rules should be database-driven where practical.

Do not hard-code all business rules into frontend components.

---

PHASE 8 — STUDENT DASHBOARD

Route:

/student/dashboard

Menus:

- Beranda
- Kenali Potensiku
- Kelola Emosiku
- Tujuanku
- Perkembanganku

MVP priority:

- Kenali Potensiku
- Kelola Emosiku
- hasil
- progress

---

PHASE 9 — BK DASHBOARD

Route:

/bk/dashboard

Features:

- total students
- completed assessments
- incomplete assessments
- student search
- class filter
- education level filter
- period filter
- potential overview
- emotion overview

---

PHASE 10 — STUDENT PROFILE

Route:

/bk/students/[id]

Sections:

- profile
- potential
- RIASEC
- emotion
- activities
- observations
- interventions
- progress
- assessment history

---

PHASE 11 — REPORT

Reports:

- individual
- class
- program
- development

MVP report:

Individual student report.

Minimum content:

1. Identity
2. Purpose
3. Instrument
4. Result
5. Interpretation
6. Potential
7. Emotion
8. Recommendation
9. Follow-up

Disclaimer:

"Hasil asesmen merupakan bahan pemetaan dan eksplorasi awal,
bukan diagnosis psikologis dan bukan penentu tunggal pilihan
pendidikan atau karier."

---

# 22. MVP ACCEPTANCE CRITERIA

MVP is considered usable when:

STUDENT:

1. can login
2. can access dashboard
3. can access Kenali Potensi
4. can complete RIASEC
5. responses are saved
6. scoring is deterministic
7. result is displayed
8. recommendation is displayed
9. can perform emotional check-in
10. check-in is saved

BK:

1. can login
2. can access dashboard
3. can view authorized students
4. can search students
5. can view RIASEC results
6. can view emotional check-ins
7. can view student profile
8. can generate basic report

SECURITY:

1. student cannot view another student
2. BK can only view authorized school data
3. API secrets are server-only
4. RLS is active
5. authentication is enforced
6. unauthorized routes are blocked

---

# 23. TESTING REQUIREMENTS

Every major phase must pass:

- lint
- typecheck
- unit test
- integration test
- build

Important tests:

- authentication
- role redirect
- RLS
- assessment session
- scoring
- RIASEC ranking
- reverse scoring
- result persistence
- emotional check-in
- recommendation rules

Scoring must be deterministic.

Same answers:

=> same score.

---

# 24. DEVELOPMENT WORKFLOW

Every feature:

PLAN
↓
IMPLEMENT
↓
LINT
↓
TYPECHECK
↓
TEST
↓
BUILD
↓
REVIEW
↓
COMMIT
↓
PUSH
↓
DEPLOY
↓
VERIFY

Do not combine unrelated features into one large change.

---

# 25. GIT COMMIT CONVENTION

Use:

feat:
fix:
refactor:
test:
docs:
chore:

Examples:

feat(auth): implement login
feat(auth): implement role redirect
feat(assessment): implement assessment session
feat(riasec): implement deterministic scoring
feat(emotion): add emotional check-in
fix(auth): resolve session refresh
docs: update master plan

---

# 26. AI DEVELOPMENT RULES

Any AI contributing to this project MUST:

1. inspect existing code first
2. inspect relevant database structure
3. follow this master plan
4. avoid unnecessary architecture changes
5. avoid unnecessary dependencies
6. reuse existing code
7. preserve working functionality
8. use TypeScript
9. use Zod for validation
10. respect RLS
11. keep scoring deterministic
12. create migration for schema changes
13. run lint
14. run typecheck
15. run tests
16. run build
17. report changed files
18. identify potential breaking changes

AI MUST NOT:

1. redesign architecture without approval
2. replace Next.js
3. replace Supabase
4. replace PostgreSQL
5. replace Feature-Based Architecture
6. modify database schema casually
7. expose secret keys
8. put API keys in frontend
9. refactor unrelated files
10. rewrite working modules unnecessarily
11. diagnose psychological disorders
12. label students negatively
13. allow AI to calculate psychometric scores
14. allow AI to make absolute career decisions
15. replace professional BK judgment

---

# 27. MULTI-AI WORKFLOW

ChatGPT:

Primary architecture and integration reviewer.

Claude:

Large code implementation and code review.

Gemini:

Second opinion, analysis and documentation.

Cursor/Copilot:

Local coding assistance.

No AI is allowed to independently redefine the architecture.

All AI agents must follow:

docs/00-MASTER-PLAN.md

Before coding, AI must state:

1. What phase?
2. What task?
3. What files will change?
4. What database changes are required?
5. What tests will be performed?

---

# 28. AI TASK PROMPT

Use this prompt when assigning a task to another AI:

"You are contributing to the DIGIBK project.

Read docs/00-MASTER-PLAN.md first.

Do not redesign the architecture.

Current phase:
[INSERT PHASE]

Task:
[INSERT TASK]

Before coding:

1. inspect existing implementation
2. identify relevant files
3. identify dependencies
4. determine whether database changes are required

Constraints:

- preserve existing architecture
- preserve existing database
- use TypeScript
- use existing Supabase clients
- respect RLS
- do not expose secrets
- do not modify unrelated files
- do not refactor unrelated modules

After implementation:

1. list changed files
2. explain implementation
3. run lint
4. run typecheck
5. run tests
6. run build
7. report errors
8. report any migration created

Do not continue to another phase unless requested."

---

# 29. CURRENT NEXT TASK

The ONLY next task is:

PHASE 1 — AUTHENTICATION

Do not start:

- RIASEC UI
- Emotion UI
- AI
- dashboard
- reports

until authentication is stable.

---

# 30. PHASE 1 AUTHENTICATION TARGET

Implement:

/login

Flow:

User
↓
Login
↓
Supabase Auth
↓
Session
↓
users
↓
user_roles
↓
Role
↓
Redirect

Student:

/student/dashboard

BK:

/bk/dashboard

School Admin:

/admin/dashboard

Unauthorized:

/login

---

# 31. AUTH SECURITY

Requirements:

- Supabase Auth
- SSR-compatible session
- protected routes
- role-based authorization
- server-side authorization
- RLS
- no role trust from frontend
- no service-role key in browser

Frontend role information is for UI only.

Authorization must be enforced server-side/database-side.

---

# 32. DEADLINE PLAN

22 August:

Authentication

23 August:

Student Management
Assessment Engine foundation

24 August:

RIASEC

25 August:

Emotion
Result

26 August:

Student Dashboard
BK Dashboard

27 August:

Testing
Bug fixing
Deployment
Pilot

28 August:

Student implementation

29 August – 1 September:

Data collection
Bug fixing
User feedback

2 – 4 September:

Analysis
Evaluation
Documentation

5 – 7 September:

Final report

8 September:

Report deadline

---

# 33. NON-MVP FEATURES

Do NOT prioritize before MVP:

- Jurus 3 Resilience
- Jurus 4 Consistency
- Jurus 5 Connection
- Jurus 6 Collaboration
- Jurus 7 Situation
- Parent dashboard
- advanced analytics
- AI chatbot
- AI counselor
- mobile application
- push notifications
- advanced gamification

These are Phase 2+.

---

# 34. PROJECT PHILOSOPHY

DIGIBK is not:

"test then label"

DIGIBK is:

KENALI
↓
PAHAMI
↓
REFLEKSI
↓
KEMBANGKAN
↓
DAMPINGI
↓
MONITOR
↓
EVALUASI

Assessment results are:

- not diagnosis
- not labels
- not absolute decisions
- not destiny

Assessment results are one source of information
to help students and BK professionals understand
student development.

---

# 35. CURRENT STATUS — 22 AUGUST 2026

FOUNDATION:

[x] Next.js
[x] TypeScript
[x] Tailwind
[x] Supabase
[x] PostgreSQL
[x] Database V1
[x] RLS foundation
[x] Supabase clients
[x] Git
[x] GitHub
[x] Database test

NEXT:

[ ] Authentication
[ ] Role-based access
[ ] Protected routes
[ ] Student management
[ ] Assessment Engine
[ ] RIASEC
[ ] Emotion
[ ] Result
[ ] Rule Engine
[ ] Student Dashboard
[ ] BK Dashboard
[ ] Report
[ ] Vercel production
[ ] bk.digitech.id

CURRENT PHASE:

PHASE 1 — AUTHENTICATION

CURRENT TASK:

Implement secure Supabase authentication
with role-based routing.

---

# END OF MASTER PLAN