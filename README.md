# MehnatNama (मेहनतनामा)
> **Har din ka kaam. Har rupaye ka hisaab.**  
> *(हर दिन का काम. हर रुपये का हिसाब.)*

MehnatNama is a worker-first digital wage diary and wage-rights awareness platform engineered specifically for India's 450M+ informal and daily-wage workforce (construction workers, agricultural laborers, domestic helpers, artisans, and gig laborers).

---

## 1. Problem Statement & Mission

In India's informal labor economy:
- Over 90% of wage agreements are verbal without written contracts.
- Workers log daily attendance on flimsy paper notebooks or calendar markings prone to water damage or loss.
- Contractors routinely dispute attendance or wage advances during weekly/monthly settlement cycles.
- Workers lack transparent awareness of statutory Minimum Wage benchmarks and grievance conciliation avenues.

**MehnatNama solves this** with an intuitive, offline-first PWA that captures tamper-evident daily work records, enables zero-login cryptographic contractor verification via WhatsApp, computes statutory wage shortfalls, and outputs print-ready bilingual wage statements.

---

## 2. Key Features

### 📅 Daily Hisaab (दैनिक हाजिरी)
- **15-Second Attendance Logger:** One-click Full Day, Half Day, or Absent logging with automatic daily wage calculation in ₹.
- **Offline Logging via IndexedDB:** Log workdays anywhere with zero internet connectivity. Records queue locally and automatically synchronize when internet returns.
- **Conflict Resolution Engine:** Transparent detection of duplicate or conflicting entries without silently overwriting server records.
- **🎙️ Experimental Hindi Voice Input:** Hands-free speech recognition (Web Speech API) allowing workers to speak task notes in Hindi.

### 💼 Job & Worksite Management (मेरे काम)
- Maintain multiple concurrent jobs (e.g. Construction Site A, Farm Work B).
- Store contractor contact info, agreed daily rates (in integer paise), skill levels, and active status.
- Soft-delete safeguards protecting historical attendance and financial data.

### 💰 Payments & Advances Ledger (खर्चा व भुगतान)
- Complete transaction register for cash advances, UPI payments, and bank transfers.
- Deterministic calculation of Gross Earnings, Total Payments Received, and Net Balance Due from contractor.

### ⚖️ Minimum Wage Benchmark Calculator (न्यूनतम वेतन जांच)
- Sourced from official state gazette notifications (Maharashtra & Central Sphere).
- Real-time comparison between agreed rates and statutory base wages + Variable Dearness Allowance (VDA).
- Transparent gap analysis highlighting cumulative wage shortfall/surplus.

### 🔗 Zero-Login Contractor Verification Portal
- Workers generate tamper-proof 256-bit cryptographic verification links (`/contractor/confirm/:token`).
- Contractors review workdays on mobile with zero login required.
- 1-click confirmation ("सब सही है") or line-item dispute ("कुछ गलत है") with categorized dispute reasons and remarks.
- Tamper-evident audit trail recording IP address and timestamps.

### 📄 Print-Ready "MehnatNama" Evidentiary Statement
- Downloadable/printable PDF reports with worker profile, contractor details, chronological attendance timesheet, payment history, and physical signature endorsement lines.
- One-click safe WhatsApp sharing pre-formatted for contractors.

### 📜 Worker Rights & Grievance Directory
- Simplified educational explainers for the *Payment of Wages Act (1936)*, *Minimum Wages Act (1948)*, and *Code on Wages (2019)*.
- 5-step conciliation procedure with direct dialing to the **National Toll-Free Labour Helpline (`14434`)**.

### 📱 Mobile-First PWA & Bilingual Localization
- Installable Progressive Web App with standalone display mode, web manifest, and custom app icons.
- High-touch mobile bottom navigation bar with 48px+ touch targets.
- Seamless instant language switching between **Hindi (हिंदी)** and **English**.
- Configurable notification and reminder preferences (`/settings`).

---

## 3. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite, React Router v7, Tailwind CSS |
| **PWA & Offline** | Web App Manifest, Service Worker (Cache-First + Fallback), IndexedDB |
| **Backend** | Node.js, Express, TypeScript |
| **Database & ORM** | PostgreSQL, Prisma ORM |
| **Security & Crypto** | JWT (HttpOnly cookies + Bearer), bcryptjs (PIN hashing), Node.js crypto (SHA-256 tokens), Helmet, express-rate-limit |
| **Design System** | Forest Green (`#176B45`), Noto Sans Devanagari, Inter typography |

---

## 4. Architecture Overview

```
[ Worker Mobile PWA / Browser ]
           │
           ├─ (Offline) ──> IndexedDB Queue (localId, syncStatus)
           │                      │
           │ (Reconnected) ───────┘ (Background SyncManager)
           ▼
[ Express API Gateway ] (CORS, Rate Limiter, Helmet)
           │
           ├── /api/auth          (Phone + 4-digit PIN, JWT)
           ├── /api/jobs          (Tenant-isolated worker jobs)
           ├── /api/workdays      (Attendance timesheet with integer paise)
           ├── /api/ledger        (Payments & advance transactions)
           ├── /api/confirmations (Worker verification link generator)
           ├── /api/public/*      (Zero-login contractor verification portal)
           ├── /api/wage          (Statutory Gazette Minimum Wage benchmarks)
           ├── /api/reports       (Printable PDF wage statements)
           ├── /api/rights        (Labour law guides & escalation resources)
           └── /health            (Uptime, memory & operational monitoring)
           │
           ▼
[ Prisma ORM ] ──> [ PostgreSQL Database ]
```

---

## 5. Local Setup Instructions

### Prerequisites
- Node.js (v18.0.0 or higher)
- PostgreSQL (v14 or higher) or cloud PostgreSQL (Neon, Render, Supabase)
- npm or pnpm

### 1. Clone the Repository
```bash
git clone https://github.com/abhiishekk2411/MehnatNama-BWB-5.0.git
cd MehnatNama
```

### 2. Backend Setup
```bash
cd server
npm install

# Create environment configuration
cp .env.example .env
# Edit .env with your PostgreSQL DATABASE_URL and JWT_SECRET

# Push schema and generate Prisma client
npx prisma db push
npx prisma generate

# Seed sample worker (Ramesh Kumar: 9876543210 / 1234), jobs, and statutory wage rules
npx prisma db seed

# Start backend dev server (Runs on port 5001)
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install

# Create environment configuration
cp .env.example .env
# Ensure VITE_API_URL=http://localhost:5001/api

# Start client dev server (Runs on port 5173)
npm run dev
```

### 4. Open in Browser
Visit `http://localhost:5173` and log in with demo credentials:
- **Phone:** `9876543210`
- **PIN:** `1234`

---

## 6. Testing Commands

```bash
# Run complete end-to-end backend integration tests (13/13 passing)
cd server
npm test

# Run backend production TypeScript build
npm run build

# Run frontend production build and bundle verification
cd ../client
npm run build
```

---

## 7. Production Deployment Instructions

### Frontend (Vercel)
1. Push project to GitHub.
2. In Vercel, import repository and set **Root Directory** to `client`.
3. Set Framework Preset to **Vite**.
4. Configure Environment Variable:
   - `VITE_API_URL` = `https://your-backend.onrender.com/api`
5. Deploy.

### Backend (Render / Railway)
1. In Render, create a new **Web Service** connected to the repository.
2. Set **Root Directory** to `server`.
3. Environment: `Node`.
4. Build Command: `npm install && npx prisma generate && npm run build`
5. Start Command: `npm run start`
6. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `PORT` = `5001`
   - `DATABASE_URL` = `<your_production_postgres_url>`
   - `JWT_SECRET` = `<cryptographic_random_32_bytes_key>`
   - `CORS_ORIGIN` = `https://your-frontend.vercel.app`
7. Health check path: `/health`

---

## 8. Application Screenshots

*(Screenshots will be populated here for presentation and hackathon showcase)*

- **Dashboard:** Live financial metrics, attendance breakdown, and quick action cards.
- **Daily Hisaab:** Attendance logger with voice input and offline status bar.
- **Contractor Portal:** Zero-login line-item confirmation and dispute workflow.
- **Minimum Wage Check:** Gazette benchmark comparison calculator.
- **Reports:** Print-ready bilingual evidentiary statement.
- **Settings:** Language switcher and notification preferences.

---

## 9. License & Attribution

Developed with ❤️ for India's hardworking informal labor workforce.  
Distributed under the ISC License.
