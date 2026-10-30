# Development Roadmap: MehnatNama (मेहनतनामा)

---

## 1. Roadmap Overview & Phasing Strategy

MehnatNama will be built incrementally in structured phases. Each phase culminates in a demonstrable, end-to-end verifiable milestone before the subsequent phase commences.

```
[Phase 1] ──> [Phase 2] ──> [Phase 3] ──> [Phase 4] ──> [Phase 5] ──> [Phase 6]
Foundations   Worker Core   Contractor    Minimum Wage  PDF Saboot    Polish &
& Auth        & Ledger      Verification  Benchmarks    Generator     Audit
```

---

## 2. Phase-by-Phase Implementation Plan

### Phase 1: Project Setup, Design System & Authentication
**Goal:** Establish the monorepo/workspace structure, configure database and ORM migrations, construct the UI design system, and implement worker onboarding/session security.

#### Tasks:
- [ ] Initialize frontend: Vite + React + TypeScript + Tailwind CSS + Lucide React.
- [ ] Initialize backend: Node.js + Express + TypeScript + Prisma ORM + PostgreSQL connection.
- [ ] Configure shared environment variables, linting, and TypeScript paths.
- [ ] Implement Tailwind theme tokens: custom emerald/forest palette, crisp neutral slates, card shadows, responsive breakpoints.
- [ ] Define database schema in `schema.prisma` and execute initial migrations.
- [ ] Seed database with initial minimum wage benchmark data and demo seed data.
- [ ] Implement backend Auth: worker registration, login with bcrypt password hashing, JWT generation, secure cookie/bearer middleware, and Zod input validation.
- [ ] Build frontend Auth UI: Worker Register & Login views with clear feedback, input masking, and form validation.
- [ ] Build global UI layout: App header, responsive collapsible sidebar, user avatar, and logout action.

#### Dependencies: None (Root setup).
#### Testing & Quality Milestones:
- Worker can register a new account with phone/password.
- Invalid phone numbers or duplicate registrations trigger clean, descriptive validation errors.
- Login returns a secure token; protected routes bounce unauthenticated requests.
- UI renders cleanly on mobile screen widths (360px) and desktop (1280px).

---

### Phase 2: Worker Core — Jobs, Workday Logging & Financial Ledger
**Goal:** Deliver the primary worker utility: managing worksites/contractors, logging daily work (full-day, half-day, overtime), recording cash advances ("kharcha"), and viewing a live financial balance ledger.

#### Tasks:
- [ ] Backend Job APIs: `POST /api/jobs`, `GET /api/jobs`, `GET /api/jobs/:id`, `PATCH /api/jobs/:id`.
- [ ] Backend WorkLog APIs: `POST /api/jobs/:id/work-logs`, `GET /api/jobs/:id/work-logs`, `PATCH /api/jobs/:id/work-logs/:logId`.
- [ ] Implement database-level unique constraint handling for `(job_id, work_date)` to avoid duplicate day entries.
- [ ] Backend Payment/Advance APIs: `POST /api/jobs/:id/payments`, `GET /api/jobs/:id/payments`.
- [ ] Implement backend **Ledger Engine**: Computes gross earnings from attendance records, sums advances/payments in integer paise, and calculates net outstanding dues with 100% precision.
- [ ] Build Frontend Jobs UI: Job creation modal (title, contractor name, phone, daily wage in ₹, start date), active jobs grid.
- [ ] Build Daily Work Logger: 1-click status selection (`FULL_DAY`, `HALF_DAY`, `OVERTIME`, `ABSENT`), date selector, task notes, instant preview of wage calculated.
- [ ] Build Advance & Payment Logger: Form for entering cash advance or settlement, payment mode, and date.
- [ ] Build Job Ledger View: Interactive calendar and tabular timesheet with status pills, running balance cards ("Total Kamai", "Advances/Mila Paisa", "Baki Paisa").

#### Dependencies: Phase 1 (Auth & Layout).
#### Testing & Quality Milestones:
- Creating a job with ₹650/day and logging 4 full days, 1 half day, and 1 overtime day (+2 hrs) produces exact calculated earnings down to the rupee.
- Recording a ₹1,000 advance updates the "Baki Paisa" (Outstanding Dues) card immediately.
- Attempting to log the same date twice provides a helpful "Already logged, tap to edit" prompt instead of a crash.

---

### Phase 3: Contractor Verification & Dispute System
**Goal:** Enable workers to generate secure, shareable verification links and provide contractors with a zero-login, mobile-friendly review portal to confirm or dispute entries.

#### Tasks:
- [ ] Backend Verification Service:
  - Generates 256-bit cryptographically secure random token (`crypto.randomBytes(32)`).
  - Serializes work logs and payments for the selected date window into an immutable JSON snapshot.
  - Computes SHA-256 integrity hash of the snapshot.
  - Stores SHA-256 hash of the token in the `verifications` table with a 14-day expiry.
- [ ] Backend Public Verification APIs:
  - `GET /api/verify/:token`: Validates token hash, checks expiry, tracks view count/timestamp, and returns snapshot data.
  - `POST /api/verify/:token/respond`: Captures contractor action (`CONFIRMED` or `DISPUTED`), contractor IP, user-agent, overall notes, and line-item dispute reasons.
- [ ] Build Frontend Share Flow (Worker App):
  - Modal to select date range (e.g., "Last 7 Days", "This Month", "All Unverified").
  - Generates shareable link with 1-click "Share on WhatsApp" and "Copy Link" buttons.
- [ ] Build Contractor Review Portal (Public View):
  - Accessible without login; clean mobile-first layout with trust header.
  - Displays worker name, job title, date range, daily breakdown, payments, and net balance.
  - One-click primary action: "Sab Sahi Hai" (Confirm All).
  - Secondary action: "Kucch Galat Hai" (Dispute) enabling the contractor to tap a specific day, select a reason (e.g., "Worker was absent", "Only half-day worked"), and append a note.
- [ ] Lock & Update Mechanism:
  - When verified, update database flags so confirmed work logs are marked `is_locked = true`.
  - Reflect real-time confirmation/dispute badges (🟢 Confirmed, 🔴 Disputed, 🟡 Pending) on the worker's dashboard.

#### Dependencies: Phase 2 (Jobs & Work Logs).
#### Testing & Quality Milestones:
- An expired or tampered token returns a graceful "Link expired or invalid" state.
- Contractor submitting "Confirm All" locks the corresponding work logs in the database.
- Worker dashboard shows green confirmed checkmarks with contractor timestamp.
- Disputed entries clearly display the contractor's specific reason on the worker's timesheet.

---

### Phase 4: Sourced Minimum-Wage Benchmark Engine & Labour Rights Guide
**Goal:** Integrate statutory minimum-wage data with source citations and provide workers with legal awareness and dispute escalation resources.

#### Tasks:
- [ ] Curate and seed real-world minimum wage benchmark data for key states (e.g., Maharashtra, Delhi, Uttar Pradesh, Karnataka, Central Sphere) across skill grades (Unskilled, Semi-skilled, Skilled) with official gazette notification numbers and government authority references.
- [ ] Backend Benchmark API: `GET /api/benchmarks?state_code=MH&skill=SEMI_SKILLED`.
- [ ] Build Benchmark Comparison Widget on Worker Dashboard:
  - Compares the worker's agreed daily wage with the state statutory benchmark.
  - Displays difference: e.g., "Your rate is ₹500/day. The official notified benchmark is ₹620/day (Difference: -₹120/day)."
  - Calculates cumulative gap across all days worked on the job.
  - Displays prominent legal awareness disclaimer.
- [ ] Build Labour Rights & Official Escalation Directory:
  - Explanations of worker rights under the Payment of Wages Act, Minimum Wages Act, and Code on Wages.
  - Step-by-step guidance on informal dispute resolution.
  - Verified directory of District Labour Officers (DLO), national toll-free helpline (14434), and Shram Suvidha portal.

#### Dependencies: Phase 2 (Worker Jobs data).
#### Testing & Quality Milestones:
- Selecting trade "Mason" and state "Maharashtra" pulls the correct official minimum wage benchmark with order number.
- Disclaimers are clearly visible, ensuring no misleading impression of a judicial decree.

---

### Phase 5: PDF "MehnatNama" Statement Generator
**Goal:** Synthesize a downloadable, structured, print-ready PDF statement summarizing work, payments, contractor verification stamps, and wage benchmarks.

#### Tasks:
- [ ] Implement PDF generator service (client-side or server-side deterministic PDF generator).
- [ ] Design professional document template:
  - Clean bilingual header with document reference number.
  - Worker and contractor profile block.
  - Financial summary box (Total Days, Gross Wage, Total Advances, Net Outstanding).
  - Chronological Work Log Table with verification stamps (including digital confirmation timestamps).
  - Advance/Payment Transaction Ledger.
  - Statutory Minimum Wage Comparison note.
  - Physical endorsement/signature section for offline mediation.
- [ ] Build frontend "Download Saboot PDF" button with instant preview and download action.

#### Dependencies: Phase 3 (Verification Stamps) & Phase 4 (Benchmarks).
#### Testing & Quality Milestones:
- Generated PDF renders correctly on mobile devices and desktop PDF viewers.
- Numbers in the PDF match the dashboard ledger with zero discrepancies.
- Verification status and timestamps are clearly formatted in the timesheet table.

---

### Phase 6: End-to-End Testing, Security Hardening & Polish
**Goal:** Comprehensive validation, responsive polish, and security auditing across all user flows.

#### Tasks:
- [ ] Security testing: verify token rate-limiting, cross-tenant isolation, SQL injection prevention via Prisma, and XSS sanitization.
- [ ] Edge-case validation: zero-day months, leap years, multi-year jobs, partial payments exceeding earnings, rapid successive clicks.
- [ ] Responsive design audit across mobile (360px, 390px, 412px), tablet (768px), and desktop (1280px+).
- [ ] Performance optimization: bundle size reduction, code splitting, memoized calculations.
- [ ] Documentation and deployment preparation.

#### Dependencies: Phases 1–5.
#### Testing & Quality Milestones:
- 100% test pass rate for financial calculation unit tests.
- Zero console errors or layout shifts during navigation.

---

### Future Phase: Offline PWA & Hindi Voice Input (Post-MVP)
- Service Worker caching for offline viewing.
- IndexedDB outbox queue for logging work without active internet.
- Multi-language switching (Hindi / English).
- Speech-to-text input for task notes in regional vernacular.
