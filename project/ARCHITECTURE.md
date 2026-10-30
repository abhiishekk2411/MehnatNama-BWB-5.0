# System Architecture: MehnatNama (मेहनतनामा)

---

## 1. High-Level Architectural Overview

MehnatNama employs a decoupled client-server architecture built on modern web standards. It is architected for strict data integrity, mobile responsiveness, fast performance over cellular networks, and rock-solid security for both registered workers and non-registered contractors reviewing records.

```
+-----------------------------------------------------------------------------------------+
|                                    CLIENT TIER                                          |
|                                                                                         |
|  +----------------------------------+          +-------------------------------------+  |
|  |     Worker Web Application       |          |      Contractor Public Portal       |  |
|  |   (Authenticated Mobile/Desktop) |          |  (Unauthenticated, Token-Secured)  |  |
|  |   React + TypeScript + Vite      |          |     Lightweight Responsive Web      |  |
|  |   Tailwind CSS + Lucide Icons    |          |     Single-action Review & Dispute  |  |
|  +-----------------+----------------+          +------------------+------------------+  |
+--------------------|----------------------------------------------|---------------------+
                     | HTTPS / JSON REST API                        | HTTPS / Token Access
                     v                                              v
+-----------------------------------------------------------------------------------------+
|                                APPLICATION SERVER TIER                                  |
|                                                                                         |
|  +-----------------------------------------------------------------------------------+  |
|  |                         Express.js REST API Server                                |  |
|  |                                                                                   |  |
|  |  [Rate Limiter] ──> [CORS / Helmet] ──> [Auth Middleware] ──> [Zod Validation]     |  |
|  |                                                                                   |  |
|  |  Controllers:                                                                     |  |
|  |  • AuthController        • JobController          • WorkLogController             |  |
|  |  • PaymentController     • VerificationController • BenchmarkController           |  |
|  |  • ReportPdfController   • GrievanceController                                    |  |
|  |                                                                                   |  |
|  |  Domain Service Layer:                                                            |  |
|  |  • LedgerEngine (Paise Math & Balance Calculations)                               |  |
|  |  • VerificationEngine (Cryptographic Token & Snapshot Generator)                   |  |
|  |  • BenchmarkMatcher (Minimum Wage Comparison)                                     |  |
|  |  • PdfGeneratorService (Clean Saboot Document Synthesizer)                         |  |
|  +--------------------------------------------+--------------------------------------+  |
+-----------------------------------------------|-----------------------------------------+
                                                | Prisma ORM (Type-Safe Data Access)
                                                v
+-----------------------------------------------------------------------------------------+
|                                    PERSISTENCE TIER                                     |
|                                                                                         |
|  +-----------------------------------------------------------------------------------+  |
|  |                            PostgreSQL Relational DB                               |  |
|  |                                                                                   |  |
|  |  Tables:                                                                          |  |
|  |  • workers         • jobs              • work_logs        • payment_transactions  |  |
|  |  • verifications   • verification_items • minimum_wages   • audit_logs            |  |
|  +-----------------------------------------------------------------------------------+  |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Frontend Architecture

### 2.1 Technology Stack & Decisions
- **Framework:** React 18+ with TypeScript. Strong typing ensures financial and date structures are strictly maintained without runtime surprises.
- **Build Tool:** Vite. Delivers near-instant HMR during development and optimized, code-split production bundles.
- **Styling:** Tailwind CSS. Enables a utility-first, modern design system without runtime CSS-in-JS overhead. Clean, consistent emerald/forest green primary accents (`emerald-600`, `emerald-700`), slate neutrals, and high-contrast accessible states.
- **Routing:** React Router v6.
- **Icons:** Lucide React for consistent, lightweight, clean iconography.
- **Client-Side State Management:**
  - Lightweight reactive state using React Context API + Custom Hooks (`useAuth`, `useJob`, `useLedger`).
  - Server state caching and revalidation via standard fetch hooks with optimistic UI updates for work logging.

### 2.2 Application Layout & Component Tree
```
App Root
├── AuthProvider (Worker Session Management)
├── ToastNotificationProvider (Feedback alerts)
└── Router
    ├── Public Routes
    │   ├── /login                     -> Worker Login Page
    │   ├── /register                  -> Worker Signup Page
    │   ├── /verify/:token             -> Contractor Verification & Dispute Portal
    │   └── /minimum-wages             -> Public Wage Benchmark Directory
    │
    └── Protected Worker Routes (Requires Auth)
        └── DashboardLayout (Persistent Sidebar, Header, User Menu)
            ├── /dashboard             -> Executive Overview (Net Dues, Recent Activity, Quick Actions)
            ├── /jobs                  -> Active & Past Jobs List
            ├── /jobs/:id              -> Job Details, Calendar Timesheet, Financial Ledger
            ├── /jobs/:id/log-work     -> Quick Daily Work Logger
            ├── /jobs/:id/add-payment  -> Record Advance or Payment
            ├── /jobs/:id/share        -> Generate Contractor Verification Link
            ├── /jobs/:id/report       -> View & Download Saboot PDF Report
            ├── /benchmarks            -> State-wise Minimum Wage Gap Calculator
            └── /rights-guide          -> Labour Laws & Dispute Escalation Guide
```

### 2.3 UI Design Tokens & System
- **Color Palette:**
  - Primary Accent: `Emerald-600` (`#059669`) / `Emerald-700` (`#047857`) for positive trust, financial growth, and active statuses.
  - Backgrounds: Neutral canvas `slate-50` (`#f8fafc`) with crisp white `bg-white` cards.
  - Text: High contrast `slate-900` for headings, `slate-600` for secondary descriptions.
  - Verification Badges:
    - 🟢 Confirmed: `bg-emerald-50 text-emerald-700 border-emerald-200`
    - 🟡 Pending: `bg-amber-50 text-amber-700 border-amber-200`
    - 🔴 Disputed: `bg-rose-50 text-rose-700 border-rose-200`
    - ⚪ Draft/Unshared: `bg-slate-100 text-slate-600 border-slate-200`
- **Typography:** Modern, clean sans-serif (Inter / System UI) optimized for legibility of numbers and currency symbols (₹).
- **Localization Readiness (i18n):** Data model and UI copy isolated into keyed translation dictionaries (`en.json`, `hi.json`) for seamless English/Hindi switching.

---

## 3. Backend Architecture

### 3.1 Layered Architectural Pattern
The backend is structured in a strict **Controller-Service-Repository** pattern using Express.js and TypeScript:

1. **Routing Layer (`src/routes/`):** Defines clean REST endpoints and connects route-specific middleware.
2. **Middleware Layer (`src/middleware/`):**
   - `authMiddleware`: Validates JWT session tokens for worker routes.
   - `validateRequest`: Intercepts and validates request body/query using **Zod** schemas.
   - `rateLimiter`: Applies IP and token-specific velocity limits.
   - `errorHandler`: Global catch-all transforming domain errors into RFC-7807 compliant error responses.
3. **Controller Layer (`src/controllers/`):** Extracts request parameters, delegates business logic to services, and formats HTTP responses.
4. **Service Layer (`src/services/`):**
   - Enforces business rules (e.g., verifying that a payment amount does not exceed practical bounds, calculating accurate ledger balances).
   - Manages database transactions for atomic multi-table mutations.
5. **Data Access Layer (`src/repositories/` / Prisma):** Type-safe queries using Prisma Client.

---

## 4. Database Architecture & Transaction Boundaries

### 4.1 Connection & Schema Strategy
- **Engine:** PostgreSQL 15+.
- **ORM:** Prisma. Enforces schema migrations, type-safe query generation, and declarative relationships.
- **Connection Pooling:** Built-in connection pooler configured for low latency under concurrent worker updates.

### 4.2 Financial Integrity (Integer Paise Principle)
To eliminate rounding and truncation errors inherent in floating-point math:
- All financial monetary values (`agreed_daily_wage`, `amount`, `calculated_earning`, `balance`) are stored in database columns as **Integer Paise** (1 Rupee = 100 Paise).
- Example: An agreed wage of ₹650.00 is stored as `65000`.
- The frontend formats `amount_in_paise / 100` with the Indian numbering format (`en-IN` -> `₹1,25,000`).

### 4.3 Atomic Operations & Isolation
- Work logging and financial ledger updates run inside **Prisma interactive transactions** (`$transaction`) with `Serializable` or `Read Committed` isolation to guarantee that balance calculations cannot suffer race conditions.

---

## 5. Contractor Acknowledgement Workflow (Detailed State Machine)

The contractor review workflow is one of the most critical mechanisms in MehnatNama. Because contractors will not create an account, the mechanism relies on a cryptographically secured, immutable snapshot system.

```
+---------------------------------------------------------------------------------------------+
|                               CONTRACTOR VERIFICATION LIFECYCLE                             |
+---------------------------------------------------------------------------------------------+

[Worker initiates Share Link]
         │
         ▼
[System creates Verification Snapshot]
  • Freezes exact WorkLogs & Payments in the requested date range
  • Computes SHA-256 integrity hash of the snapshot payload
  • Generates cryptographically secure random token (256-bit entropy)
  • Stores token hash in DB with 14-day expiry and rate limits
         │
         ▼
[Shareable Link: /verify/{rawToken}]
  • Worker sends link to Contractor via WhatsApp / SMS
         │
         ▼
[Contractor Opens Link in Browser]
  • System verifies token validity, checks expiry, and increments view count
  • Status transitions: PENDING ──> VIEWED (Contractor has opened the link)
  • Public portal renders frozen snapshot data (independent of subsequent edits)
         │
         ├─────────────────────────────────────────────┐
         ▼                                             ▼
   [Action: "CONFIRM ALL"]                      [Action: "DISPUTE"]
         │                                             │
         • Contractor marks all items valid            • Contractor marks specific date/item
         • Captures optional remark                     • Selects dispute reason:
         • Captures: IP, User-Agent, Timestamp         • (e.g., "Absent", "Half-day", "Paid extra")
         │                                             • Enters dispute note
         ▼                                             │
   Status: CONFIRMED                                   ▼
         │                                       Status: DISPUTED
         ▼                                             │
   [Worker Dashboard]                                  ▼
   • Tagged 🟢 CONFIRMED                         [Worker Dashboard]
   • Logs locked against modification            • Tagged 🔴 DISPUTED with contractor notes
   • Ready for official PDF Saboot               • Worker can adjust or initiate dialogue
```

### State Machine Transition Rules:
1. **PENDING:** Link created, awaiting contractor access.
2. **VIEWED:** Contractor opened the link; records timestamp of first view.
3. **CONFIRMED:** Contractor clicked "Confirm All"; snapshot and associated entries are marked confirmed. Associated work entries are locked from in-place edits.
4. **DISPUTED:** Contractor disputed one or more entries; individual dispute reasons stored in `verification_item_audits`.
5. **EXPIRED:** If no response is received within the expiration window (e.g., 14 days), the token expires. The worker can issue a fresh link.
6. **SUPERSEDED:** If a worker amends a draft entry before contractor response, existing pending links are marked superseded.

---

## 6. Wage Calculation Engine

### 6.1 Formulae & Attendance Multipliers
For any given workday record $i$:
$$\text{Day Multiplier } M_i = \begin{cases} 
1.0 & \text{if } \text{status} = \text{FULL\_DAY} \\
0.5 & \text{if } \text{status} = \text{HALF\_DAY} \\
0.0 & \text{if } \text{status} = \text{ABSENT} \\
1.0 + \left(\frac{\text{overtime\_hours}}{8} \times \text{ot\_multiplier}\right) & \text{if } \text{status} = \text{OVERTIME}
\end{cases}$$

$$\text{Earning for Day } E_i = \lfloor M_i \times \text{agreed\_daily\_wage\_in\_paise} \rfloor$$

### 6.2 Ledger Balance Aggregation
For any job:
$$\text{Total Gross Earnings} = \sum_{i=1}^{N} E_i$$
$$\text{Total Advances Deducted} = \sum_{j=1}^{A} \text{advance\_amount}_j$$
$$\text{Total Payments Received} = \sum_{k=1}^{P} \text{payment\_amount}_k$$
$$\text{Net Outstanding Dues (Baki)} = \text{Total Gross Earnings} - (\text{Total Advances Deducted} + \text{Total Payments Received})$$

---

## 7. Security Architecture & Threat Modeling

A common failure in informal-sector apps is treating public links as "inherently secure" simply because they contain a token. MehnatNama implements a multi-layer defense-in-depth model:

### 7.1 Threat Model & Countermeasures

| Threat Vector | Potential Impact | Architecture Countermeasure |
|---|---|---|
| **Token Brute-Forcing** | Attacker guesses token URL and views worker's wage and attendance data. | Tokens generated via `crypto.randomBytes(32)` (256-bit entropy, impossible to guess). Only the **SHA-256 hash** of the token is stored in the database. Rate limiting by IP (max 10 requests / min on verify endpoints). |
| **Worker Retrospective Tampering** | Worker shares link, then stealthily edits past days to claim higher pay after contractor reviews. | **Snapshot Immutability:** When a verification link is created, a serialized JSON snapshot of the entries is cryptographically hashed and stored in the `verifications` table. The contractor evaluates the *frozen snapshot*, not live mutable records. Once confirmed, underlying records are locked. |
| **Contractor Link Replay / Forgery** | An unauthorized third party clicks the WhatsApp link if forwarded. | The contractor portal prompts the contractor to confirm their identity (e.g. "I am Vikram Singh (Contractor)") and logs client metadata (IP address, user agent, timestamp) upon confirmation or dispute. Nonce-based single-decision submission prevents duplicate or conflicting responses. |
| **Cross-Tenant Data Leakage** | A worker modifies job ID or work log ID in the API to access another worker's ledger. | Strict multi-tenancy enforcement: all database queries on worker-owned entities include `WHERE worker_id = current_authenticated_user_id`. |
| **Denial of Service (DoS)** | Script floods verification generation or public endpoints. | Global rate limiting (`express-rate-limit`) and helmet security headers (`Strict-Transport-Security`, `X-Content-Type-Options`, `Content-Security-Policy`). |

---

## 8. Sourced Minimum-Wage Benchmark Architecture

To fulfill the product principle that minimum wages must be **source-backed informational benchmarks** and not legal determinations:

1. **Structured Reference Data Model:**
   - Benchmarks are indexed by `state_code`, `employment_sphere` (Central vs. State), `skill_category` (Unskilled, Semi-Skilled, Skilled, Highly Skilled), and `effective_date`.
   - Every benchmark record contains a mandatory `official_gazette_notification_no`, `gazette_date`, and `authority_name` (e.g., *Office of the Chief Labour Commissioner (Central), Order No. 1/16(1)/2024-LS-II*).
2. **Informational Disclaimer Layer:**
   - Every API response and UI view rendering minimum wage comparisons includes an immutable legal notice:
   > *"Notice: These wage rates are compiled from published official government notifications for reference and awareness purposes only. Actual statutory entitlement may vary based on municipal zone, scheduled employment classifications, and specific state amendments. This tool provides conciliation support and does not constitute a legal decree."*

---

## 9. PDF Generation Architecture ("MehnatNama Statement / पर्चा")

- **Approach:** Server-side deterministic PDF synthesis (using PDFKit or React-PDF for high performance and consistent styling across devices).
- **Structure of Generated Document:**
  1. **Header Block:** Worker Name, Trade, Job Name, Contractor Name, Report Generation Timestamp, Unique Document Verification Code.
  2. **Executive Financial Summary Card:** Total Days Worked, Total Earned (₹), Total Received (₹), Outstanding Balance Due (₹).
  3. **Attestation & Verification Status Table:** Detailed calendar entries showing date, day type, wage earned, and contractor digital acknowledgment status with timestamp.
  4. **Payment & Advance Receipts Table:** Chronological log of advances and payments.
  5. **Statutory Reference Benchmark Appendix:** Applicable minimum wage comparison note.
  6. **Physical Endorsement Block:** Formatted area for physical signatures/thumb impressions if submitted to a District Labour Officer or community panchayat.

---

## 10. Future Offline Synchronization Architecture (Phase Ready)

While Phase 1 targets a responsive web application, the architecture is purposefully pre-configured for offline capability:
- **Client Storage:** IndexedDB managed via Dexie.js or local-forage for offline caching of jobs and daily logs.
- **Service Worker:** Cache-first strategy for static UI assets, Network-first for transactional API calls.
- **Sync Queue:** Outbox queue storing mutations (`CREATE_WORK_LOG`, `LOG_ADVANCE`) with client-generated UUIDs (v4). Upon reconnection, mutations are dispatched sequentially with idempotent server processing.
