# Project Structure Specification: MehnatNama (मेहनतनामा)

---

## 1. Directory Tree Overview

MehnatNama is structured as a clean, decoupled full-stack workspace with a modern React + TypeScript frontend (`client/`) and an Express + TypeScript + Prisma backend (`server/`). Shared data types and contracts ensure complete end-to-end type safety.

```
MehnatNama/
├── project/                           # Architectural, design, and roadmap specifications
│   ├── PRODUCT_SPEC.md                # Product requirements & user personas
│   ├── ARCHITECTURE.md                # System design, state machines, security model
│   ├── DATABASE_DESIGN.md             # Schema, constraints, ER diagram, Prisma definition
│   ├── DEVELOPMENT_ROADMAP.md         # Phased execution plan & testing milestones
│   └── PROJECT_STRUCTURE.md           # This structural layout documentation
│
├── client/                            # Frontend Web Application (React + Vite + TS + Tailwind)
│   ├── public/                        # Static assets (favicons, manifest, icons)
│   ├── src/
│   │   ├── assets/                    # Illustrations, logos, and branding graphics
│   │   ├── components/                # Reusable UI component library
│   │   │   ├── common/                # Primitives: Button, Card, Badge, Modal, Input, Spinner
│   │   │   ├── layout/                # AppLayout, Header, Sidebar, Navigation, Footer
│   │   │   ├── dashboard/             # StatsCards, QuickActions, RecentLogs, BalanceSummary
│   │   │   ├── jobs/                  # JobCard, JobFormModal, JobStatusBadge
│   │   │   ├── worklog/               # WorkDayLoggerModal, AttendanceCalendar, WorkLogTable
│   │   │   ├── payments/              # PaymentLoggerModal, AdvanceHistoryTable, LedgerView
│   │   │   ├── verification/          # ShareLinkModal, ContractorReviewPortal, DisputeModal
│   │   │   ├── benchmarks/            # MinimumWageCompareCard, StateWageSelector
│   │   │   └── pdf/                   # SabootReportViewer, PrintPreview
│   │   ├── context/                   # Global React Contexts (AuthContext, JobContext)
│   │   ├── hooks/                     # Custom React hooks (useAuth, useLedger, useDebounce)
│   │   ├── pages/                     # Top-level view routes
│   │   │   ├── auth/                  # LoginPage, RegisterPage
│   │   │   ├── dashboard/             # WorkerDashboardPage
│   │   │   ├── jobs/                  # JobsListPage, JobDetailsPage
│   │   │   ├── verification/          # PublicContractorPortalPage (Zero-login review)
│   │   │   ├── benchmarks/            # WageBenchmarksPage
│   │   │   ├── rights/                # LabourRightsGuidePage
│   │   │   └── notfound/              # NotFoundPage
│   │   ├── services/                  # HTTP API client services (axios/fetch abstractions)
│   │   │   ├── api.ts                 # Base Axios instance with auth interceptors
│   │   │   ├── authService.ts         # Login, register, profile queries
│   │   │   ├── jobService.ts          # Job creation, updates, listing
│   │   │   ├── workLogService.ts      # Daily work logging, calendar queries
│   │   │   ├── paymentService.ts      # Advance & payment record mutations
│   │   │   ├── verificationService.ts # Token link creation, contractor public review
│   │   │   └── benchmarkService.ts    # Minimum wage lookup queries
│   │   ├── utils/                     # Formatting utilities
│   │   │   ├── currency.ts            # Paise-to-Rupee formatters (e.g. formatINR)
│   │   │   ├── date.ts                # Date parsing, relative time, calendar helpers
│   │   │   └── pdfGenerator.ts        # Client-side PDF formatting & export engine
│   │   ├── types/                     # Frontend TypeScript interfaces and DTOs
│   │   │   ├── auth.ts
│   │   │   ├── job.ts
│   │   │   ├── worklog.ts
│   │   │   ├── payment.ts
│   │   │   └── verification.ts
│   │   ├── App.tsx                    # Root routing and context provider assembly
│   │   ├── main.tsx                   # React DOM entry point
│   │   └── index.css                  # Tailwind directives and custom utility classes
│   ├── index.html                     # HTML5 shell with SEO metadata & responsive viewport
│   ├── package.json                   # Client dependencies & scripts
│   ├── tailwind.config.js             # Tailwind design system configuration
│   ├── tsconfig.json                  # Client TypeScript configuration
│   └── vite.config.ts                 # Vite bundler configuration & dev server proxy
│
├── server/                            # Backend REST API Server (Node.js + Express + TypeScript)
│   ├── prisma/
│   │   ├── schema.prisma              # Complete database schema definition
│   │   ├── migrations/                # Version-controlled SQL migration scripts
│   │   └── seed.ts                    # Benchmark wage & sample demo data seeder
│   ├── src/
│   │   ├── config/                    # Environment variables, database connection, constants
│   │   │   ├── env.ts                 # Validated environment config (via Zod/dotenv)
│   │   │   └── database.ts            # Singleton PrismaClient instance
│   │   ├── controllers/               # HTTP Request/Response orchestrators
│   │   │   ├── auth.controller.ts
│   │   │   ├── job.controller.ts
│   │   │   ├── workLog.controller.ts
│   │   │   ├── payment.controller.ts
│   │   │   ├── verification.controller.ts
│   │   │   ├── benchmark.controller.ts
│   │   │   └── report.controller.ts
│   │   ├── services/                  # Pure domain business logic & transactions
│   │   │   ├── auth.service.ts
│   │   │   ├── job.service.ts
│   │   │   ├── workLog.service.ts
│   │   │   ├── payment.service.ts
│   │   │   ├── ledger.service.ts       # Accurate Paise calculations & balance balancing
│   │   │   ├── verification.service.ts # Cryptographic tokens, snapshots, state machine
│   │   │   └── benchmark.service.ts   # State minimum wage queries
│   │   ├── middleware/                # Express middleware pipeline
│   │   │   ├── auth.middleware.ts     # JWT session verification & worker context injection
│   │   │   ├── validate.middleware.ts # Zod schema validation interceptor
│   │   │   ├── rateLimit.middleware.ts# IP and token rate-limiters
│   │   │   └── error.middleware.ts    # Centralized RFC-7807 error handler
│   │   ├── routes/                    # Express route definitions
│   │   │   ├── api.router.ts          # Master API router mounting sub-routes
│   │   │   ├── auth.routes.ts
│   │   │   ├── job.routes.ts
│   │   │   ├── workLog.routes.ts
│   │   │   ├── payment.routes.ts
│   │   │   ├── verification.routes.ts # Public & authenticated verification endpoints
│   │   │   └── benchmark.routes.ts
│   │   ├── validation/                # Zod request payload schemas
│   │   │   ├── auth.schema.ts
│   │   │   ├── job.schema.ts
│   │   │   ├── workLog.schema.ts
│   │   │   ├── payment.schema.ts
│   │   │   └── verification.schema.ts
│   │   ├── utils/                     # Backend utilities (crypto, logger, helpers)
│   │   │   ├── crypto.ts              # Secure token generation & SHA-256 hashing
│   │   │   ├── logger.ts              # Structured console/file logging
│   │   │   └── errors.ts              # Custom AppError subclasses
│   │   ├── app.ts                     # Express application configuration & middleware stack
│   │   └── server.ts                  # HTTP server listener entry point
│   ├── .env.example                   # Template for backend environment variables
│   ├── package.json                   # Server dependencies & scripts
│   └── tsconfig.json                  # Server TypeScript configuration
│
├── .gitignore                         # Git exclusion rules (node_modules, .env, dist, etc.)
└── README.md                          # High-level repository orientation & developer setup
```

---

## 2. Explanation of Key Directories & Architectural Boundaries

### 2.1 Frontend (`client/`)
- **`components/common/`**: Houses low-level, reusable design system components (buttons, input fields, modals, badges, cards). All styled consistently with Tailwind CSS to maintain the emerald/forest green visual identity.
- **`components/verification/`**: Houses both the worker-facing modal for generating secure links and the public contractor portal view where contractors interact without signing in.
- **`services/`**: Encapsulates all network communication. No component makes raw `fetch` calls directly; all communication routes through typed service functions with centralized error handling.
- **`utils/currency.ts`**: Pure functions ensuring that all monetary numbers are properly converted between integer Paise (backend representation) and Rupee formatted strings (`₹650.00`).

### 2.2 Backend (`server/`)
- **`prisma/`**: Contains the single source of truth for the database schema (`schema.prisma`) and seed scripts for populating officially notified minimum wage benchmarks.
- **`controllers/` vs. `services/`**: Controllers strictly handle HTTP concerns (status codes, headers, cookie parsing). All business logic, transaction wrapping, and calculations live inside the `services/` layer, making domain logic easy to unit test.
- **`services/ledger.service.ts`**: The dedicated financial calculation engine. Isolates all wage aggregation, overtime math, and advance deductions to guarantee arithmetic consistency across reports, summaries, and verification snapshots.
- **`services/verification.service.ts`**: Implements the cryptographic snapshotting and HMAC token hashing mechanism for contractor links.
- **`validation/`**: Contains Zod schemas that validate incoming HTTP payloads before any controller executes. Ensures invalid or malicious inputs are rejected at the application perimeter.
