# Development Roadmap: MehnatNama (मेहनतनामा)
> **Tagline:** Har din ka kaam. Har rupaye ka hisaab.  
> **Product Vision:** A worker-first digital wage diary and wage-rights awareness platform for daily-wage and informal workers in India.

---

## 1. Roadmap Overview & Phasing Architecture

MehnatNama is structured around clear, incremental, and demonstrable milestones. Each phase delivers a complete layer of user and technical capabilities, progressing from foundational architecture through worker core workflows, legal verification, and offline resilience.

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   PHASE 1    │ ──> │   PHASE 2    │ ──> │   PHASE 3    │ ──> │   PHASE 4    │ ──> │   PHASE 5    │
│ Foundations, │     │ Design System│     │ Worker Core  │     │ Wage Rights, │     │ Offline PWA, │
│ Schemas,     │     │ Dashboard &  │     │ Backend APIs │     │ Verification │     │ Quality &    │
│ Scaffolding  │     │ GitHub Repo  │     │ & DB Connect │     │ & Reports    │     │ Deployment   │
│ [COMPLETED]  │     │ [COMPLETED]  │     │  [NEXT UP]   │     │  [PLANNED]   │     │  [PLANNED]   │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

---

## 2. Phase Breakdown

### Phase 1: Project Setup, Schemas & Foundations [COMPLETED]
**Goal:** Establish monorepo workspace, PostgreSQL relational schema via Prisma, Express TypeScript backend foundation, and client scaffolding.

#### Deliverables Completed:
- [x] Initialized client structure: Vite + React 19 + TypeScript + Tailwind CSS + Lucide React.
- [x] Initialized backend structure: Express + TypeScript + Prisma ORM + PostgreSQL client configuration.
- [x] Defined complete relational database schema in `schema.prisma` covering Workers, Jobs, WorkLogs, Payments, Verifications, and WageBenchmarks.
- [x] Implemented authentication services, bcrypt hashing, JWT issuance, and Zod validation schemas.
- [x] Established project specifications (`PRODUCT_SPEC.md`, `ARCHITECTURE.md`, `DATABASE_DESIGN.md`).

---

### Phase 2: Design System, Dashboard & GitHub Integration [COMPLETED]
**Goal:** Construct a modern, minimal, Linear/Stripe-inspired SaaS interface with tokenized green palette, application shell, high-fidelity responsive dashboard, and remote GitHub synchronization.

#### Deliverables Completed:
- [x] **Design Tokens & System (`tokens.ts`, `tailwind.config.js`, `index.css`):**
  - Primary Forest Green (`#176B45`), Dark Green (`#104B32`), Soft Green (`#E8F3EC`).
  - Background (`#F7F8F5`), Cards (`#FFFFFF`), Primary Text (`#202923`), Secondary Text (`#68736B`), Border (`#E5EAE5`).
  - Semantic Status Colors: Success (`#15803D`), Warning (`#D97706`), Danger (`#DC2626`).
  - Dual typography: Inter for numerals/English and Noto Sans Devanagari for Hindi text.
- [x] **Modular Reusable Components (`src/components/common/`):**
  - `BrandLogo`: Wordmark, Devanagari subtitle, notebook ledger icon badge.
  - `SummaryCard`: Financial metric figures, status pills, subtle icons, tabular numbers.
  - `QuickActionCard`: Touch-friendly action triggers with route links and directional arrows.
  - `StatusBadge`: Tokenized status indicators (Confirmed, Disputed, Pending, Active, Paid, Advance, Full Day, Half Day, Absent).
  - `ActivityTable`: Responsive data table with horizontal scrolling, date badges, and status pills.
  - `ActiveJobCard`: Worksite details, contractor names, daily wage in ₹, and logging CTA.
  - `ConfirmationOverview`: Breakdown bar with Confirmed: 10, Disputed: 2, Pending: 3.
  - `SectionHeader`: Standardized bilingual header with title, subtitle, and action buttons.
  - `PageContainer`: Responsive container with max-width limits and vertical rhythm.
  - `ProfileMenu`: Dropdown with worker avatar, phone, worker ID, and accessible outside click listener.
- [x] **Application Shell (`AppLayout.tsx`, `Sidebar.tsx`, `Topbar.tsx`):**
  - Persistent desktop sidebar with collapsible expanded/icon-only toggle.
  - Active route highlighting across all 7 core routes and support sections.
  - Mobile navigation drawer with backdrop blur and touch targets.
  - Topbar with dynamic breadcrumbs, Hindi/English language switcher, notification counter, and worker profile avatar.
- [x] **High-Fidelity Dashboard (`/dashboard`):**
  - "Namaste, Ramesh" welcome header.
  - Financial summary: Total Earned (₹12,000), Payments Received (₹8,000), Outstanding Balance (₹4,000), Working Days (20).
  - Quick action buttons connected to `/jobs`, `/daily-hisaab`, `/payments`, `/wage-check`.
  - Recent activity with 5 sample entries (25 Oct Full Day, 24 Oct ₹2,000 Payment, 23 Oct Half Day, 22 Oct Confirmation, 21 Oct ₹1,000 Advance).
  - Active jobs: Construction Site A (Rajesh Kumar, ₹600/day) and Farm Work B (Suresh, ₹450/day).
  - Minimum Wage Awareness card comparing daily wages with officially notified state gazette rates.
- [x] **GitHub Repository Integration (`MehnatNama-BWB-5.0`):**
  - Remote: `https://github.com/abhiishekk2411/MehnatNama-BWB-5.0.git`.
  - Branches: `main`, `develop`, `feature/phase-2-ui`.
  - Clean `.gitignore` guarding secrets, `.env`, `node_modules`, and build artifacts.
  - Meaningful commits pushed progressively.

---

### Phase 3: Core Worker Management and Backend [NEXT UP]
**Goal:** Connect the frontend to real PostgreSQL database records through Express REST APIs, implement worker authentication, job management, daily attendance logging, and accurate financial calculations.

#### Tasks & Modules:
1. **Worker Registration and Authentication:**
   - Worker phone and password registration with bcrypt hashing.
   - JWT session management with refresh handling and role-based checks.
   - Worker profile settings, emergency contact, trade/skill classification.
2. **Database Integration:**
   - Connect Express backend to PostgreSQL using Prisma ORM.
   - Run and verify migrations against live database.
   - Automated data seeding for initial benchmarks and worker sample data.
3. **Job Management:**
   - Create, list, update, and archive multiple active jobs (`/jobs`).
   - Contractor contact details, site address, agreed wage rate per day (in ₹).
   - Real-time job status toggling (`ACTIVE`, `PAUSED`, `COMPLETED`).
4. **Daily Hisaab and Workday Tracking:**
   - Log daily attendance: Full day (1.0), Half day (0.5), Overtime hours, or Absence.
   - Database unique constraint on `(job_id, work_date)` to guarantee zero duplicate days.
   - Workday calendar view and chronological timesheet history.
   - Overtime tracking with hourly wage calculation and work notes.
5. **Payments and Advances:**
   - Cash advance ("kharcha") logging and weekly/monthly wage settlement records.
   - Payment modes (Cash, UPI, Bank Transfer) with transaction dates and notes.
6. **Earnings and Outstanding-Balance Calculations:**
   - Server-side and client-side deterministic ledger engine.
   - `Gross Earnings = Sum(Days * Daily Wage) + Overtime`.
   - `Net Balance Due = Gross Earnings - Total Payments/Advances`.
   - Live dashboard connected to real backend metrics.

#### Quality & Testing Milestones:
- Worker can register, log in, create 2 jobs, and log 10 attendance records.
- Financial figures reflect mathematical accuracy down to the rupee.
- Duplicate day logging is safely rejected with clear validation messages.

---

### Phase 4: Wage Rights, Verification and Reporting [PLANNED]
**Goal:** Empower workers with cryptographic contractor verification links, dispute management, statutory minimum wage comparison, and print-ready PDF statements.

#### Tasks & Modules:
1. **Secure Contractor Confirmation Links:**
   - Cryptographically secure 256-bit token generator (`crypto.randomBytes(32)`).
   - Immutable snapshot serialization of timesheet and payments.
   - Expiration window (14-day validity) and tamper-proof SHA-256 verification hash.
2. **Contractor Confirm/Dispute Workflow:**
   - Zero-login, mobile-responsive public review portal for contractors.
   - 1-click confirmation ("Sab Sahi Hai") which marks records as verified and locks entries.
   - Line-item dispute workflow ("Kucch Galat Hai") with standardized dispute reasons (Absent, Partial Day, Advance mismatch).
   - Full acknowledgement history and contractor digital audit trail (timestamp, IP).
3. **Minimum-Wage Calculator & Official Notifications:**
   - Sourced minimum wage benchmark engine covering key states and Central Sphere.
   - Effective dates, gazette notification numbers, and authority references.
   - Real-time wage comparison displaying daily wage difference and cumulative wage loss.
   - Transparent legal awareness disclaimers preventing misrepresentation.
4. **PDF Reports & WhatsApp Sharing:**
   - Print-ready and downloadable PDF "MehnatNama" statement generator.
   - Worker profile, contractor info, attendance ledger, payment register, and verification stamps.
   - 1-click WhatsApp share button with pre-formatted bilingual message and link.
5. **Know Your Rights & Escalation Directory:**
   - Simplified explainers on Payment of Wages Act, Minimum Wages Act, and Code on Wages.
   - Verified official escalation directory: District Labour Officers (DLO), national toll-free helpline (14434), and Shram Suvidha portal.
   - Optional helper/volunteer access for assisted literacy.

#### Quality & Testing Milestones:
- Contractor review link opens smoothly on mobile without login requirements.
- Confirmed records display green verified checkmarks across worker dashboard.
- Disputed entries clearly display contractor feedback.
- PDF generation creates crisp, formatted bilingual statement with matching figures.

---

### Phase 5: Offline Support, Quality and Deployment [PLANNED]
**Goal:** Add offline Progressive Web App capabilities, multilingual support, accessibility, end-to-end security audits, and production cloud deployment.

#### Tasks & Modules:
1. **Progressive Web App (PWA) & Offline Logging:**
   - Service Worker caching for offline app shell and critical resources.
   - IndexedDB local storage queue for logging workdays without active internet.
   - Background synchronization when internet connection returns.
2. **Hindi and English Language Switching:**
   - Complete bilingual UI with instant toggle between Hindi (हिंदी) and English.
   - Voice-friendly UX and experimental voice input for task notes in regional vernacular.
3. **Notifications and Reminders:**
   - Daily attendance reminder notifications.
   - Contractor verification alerts and payment settlement reminders.
4. **Mobile-First Optimisation & Touch Polish:**
   - Ultra-responsive touch targets (minimum 44px).
   - Low-data mode and lightweight asset loading for 2G/3G connectivity.
5. **Security Review & Audit History:**
   - Cross-tenant data isolation testing.
   - SQL injection prevention (Prisma parameterized queries) and XSS sanitization.
   - Immutable audit logging for financial and confirmation events.
6. **Application Testing & Bug Fixing:**
   - Unit tests for financial calculations and verification hashing.
   - End-to-end user flow tests across mobile and desktop.
7. **Production Deployment & Hackathon Demo:**
   - Production containerization / cloud deployment (e.g. Vercel for frontend, Render/Railway for backend, Neon/Supabase for PostgreSQL).
   - Hackathon presentation demo script, sample worker profiles, and live verification showcase.

---

## 3. Technology Stack Reference

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 19, TypeScript, Vite |
| **Styling & Design System** | Tailwind CSS (Curated Forest Green tokens), Custom CSS Utilities |
| **Icons & Typography** | Lucide React, Google Fonts (Inter + Noto Sans Devanagari) |
| **Routing & Navigation** | React Router v7 |
| **Backend Framework** | Node.js, Express, TypeScript |
| **Database & ORM** | PostgreSQL, Prisma ORM |
| **Authentication & Crypto** | JWT, bcrypt, Node crypto (SHA-256 tokens) |
| **Validation** | Zod schemas |
| **Repository & Workflow** | Git, GitHub (`MehnatNama-BWB-5.0`) with `main`, `develop`, `feature/phase-2-ui` |
