# Database Design & Schema Specification: MehnatNama (मेहनतनामा)

---

## 1. Database Overview & Design Principles

The MehnatNama persistence layer is built on **PostgreSQL** using **Prisma ORM**.

### Core Tenets:
1. **Integer Currency Storage (No Floating Points):** All financial figures (wages, payments, advances, dues) are stored as integers representing **Paise** (1 INR = 100 Paise). This eliminates IEEE-754 floating-point rounding inaccuracies.
2. **Immutability of Verified Evidence:** Work logs that have been confirmed or disputed as part of a formal verification snapshot cannot be silently edited or deleted. Audit logs preserve historical snapshots.
3. **Data Isolation (Multi-Tenancy):** Every core table (`jobs`, `work_logs`, `payment_transactions`, `verifications`) is indexed and constrained to a specific `worker_id`.
4. **Token Security:** Unauthenticated contractor verification tokens are never stored in plaintext; only their cryptographic SHA-256 hashes are persisted.

---

## 2. Entity-Relationship (ER) Diagram

```
+------------------+             +------------------+
|     workers      | 1         * |       jobs       |
+------------------+-------------+------------------+
| id (PK)          |             | id (PK)          |
| phone / email    |             | worker_id (FK)   |
| password_hash    |             | title            |
| full_name        |             | contractor_name  |
| trade            |             | contractor_phone |
| state / city     |             | daily_wage_paise |
| created_at       |             | status           |
+------------------+             +--------+---------+
                                          | 1
                  +-----------------------+-----------------------+
                  | *                                             | *
        +---------+--------+                            +---------+--------+
        |    work_logs     |                            | payment_trans-   |
        +------------------+                            |     actions      |
        | id (PK)          |                            +------------------+
        | job_id (FK)      |                            | id (PK)          |
        | worker_id (FK)   |                            | job_id (FK)      |
        | work_date        |                            | worker_id (FK)   |
        | status           |                            | amount_paise     |
        | overtime_hours   |                            | type             |
        | wage_earned_paise|                            | payment_mode     |
        | is_locked        |                            | transaction_date |
        +------------------+                            +------------------+
                  | *                                             | *
                  +-----------------------+-----------------------+
                                          |
                                          | 1
                                 +--------+---------+
                                 |  verifications   |
                                 +------------------+
                                 | id (PK)          |
                                 | job_id (FK)      |
                                 | token_hash (UQ)  |
                                 | date_start       |
                                 | date_end         |
                                 | snapshot_payload |
                                 | status           |
                                 | contractor_note  |
                                 | responded_at     |
                                 | expires_at       |
                                 +--------+---------+
                                          | 1
                                          | *
                                 +--------+---------+
                                 |verification_items|
                                 +------------------+
                                 | id (PK)          |
                                 | verification_id  |
                                 | work_log_id (FK) |
                                 | is_disputed      |
                                 | dispute_reason   |
                                 +------------------+

+-----------------------------+               +-----------------------------+
|    minimum_wage_benchmarks  |               |         audit_logs          |
+-----------------------------+               +-----------------------------+
| id (PK)                     |               | id (PK)                     |
| state_code                  |               | worker_id (FK nullable)     |
| sphere (CENTRAL / STATE)    |               | entity_type                 |
| skill_category              |               | entity_id                   |
| daily_wage_paise            |               | action                      |
| notification_reference      |               | old_values (JSONB)          |
| notification_date           |               | new_values (JSONB)          |
| source_url                  |               | ip_address                  |
| is_active                   |               | created_at                  |
+-----------------------------+               +-----------------------------+
```

---

## 3. Detailed Entity Definitions & Schema Specifications

### 3.1 `workers` Table (User Account)
Stores worker authentication and profile details.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY`, default `gen_random_uuid()` | Unique worker identifier |
| `phone` | `VARCHAR(15)` | `UNIQUE`, `NOT NULL` | Mobile number (used as primary login identifier) |
| `email` | `VARCHAR(255)` | `UNIQUE`, `NULLABLE` | Optional email address |
| `password_hash` | `VARCHAR(255)` | `NOT NULL` | Bcrypt or Argon2 password hash |
| `full_name` | `VARCHAR(100)` | `NOT NULL` | Worker's display name |
| `trade` | `VARCHAR(50)` | `NOT NULL` | e.g., 'MASON', 'CARPENTER', 'HELPER', 'LOADER', 'OTHER' |
| `state_code` | `VARCHAR(10)` | `NOT NULL` | Two-letter state code (e.g., 'MH', 'DL', 'UP', 'KA') |
| `district` | `VARCHAR(100)` | `NULLABLE` | District/City of residence |
| `preferred_lang` | `VARCHAR(5)` | `DEFAULT 'hi'` | UI preference ('hi' for Hindi, 'en' for English) |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Registration timestamp |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Last update timestamp |

---

### 3.2 `jobs` Table (Worksite / Contractor Engagement)
Represents a distinct project, work site, or contractor relationship.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY`, default `gen_random_uuid()` | Unique job identifier |
| `worker_id` | `UUID` | `NOT NULL`, `REFERENCES workers(id) ON DELETE CASCADE` | Owner worker |
| `title` | `VARCHAR(150)` | `NOT NULL` | Project or site name (e.g., 'Sharmaji Kothi 3rd Floor') |
| `contractor_name` | `VARCHAR(100)` | `NOT NULL` | Name of the supervising contractor |
| `contractor_phone` | `VARCHAR(15)` | `NOT NULL` | Contractor's WhatsApp/phone number for link dispatch |
| `site_location` | `VARCHAR(255)` | `NULLABLE` | Physical address or locality description |
| `daily_wage_paise`| `INTEGER` | `NOT NULL`, `CHECK (daily_wage_paise > 0)` | Agreed daily wage in Paise (e.g., 65000 = ₹650.00) |
| `standard_hours` | `SMALLINT` | `DEFAULT 8`, `CHECK (standard_hours > 0)` | Standard workday hours |
| `overtime_rate_paise`| `INTEGER` | `DEFAULT 0` | Hourly rate for overtime hours in Paise |
| `start_date` | `DATE` | `NOT NULL` | Work start date |
| `status` | `VARCHAR(20)` | `DEFAULT 'ACTIVE'` | 'ACTIVE', 'COMPLETED', 'DISPUTED' |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Record creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Last update timestamp |

---

### 3.3 `work_logs` Table (Daily Attendance & Wage Records)
Captures day-to-day work status and contemporaneous wage calculations.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY`, default `gen_random_uuid()` | Unique log identifier |
| `job_id` | `UUID` | `NOT NULL`, `REFERENCES jobs(id) ON DELETE CASCADE` | Associated job |
| `worker_id` | `UUID` | `NOT NULL`, `REFERENCES workers(id) ON DELETE CASCADE` | Denormalized for fast multi-tenant queries |
| `work_date` | `DATE` | `NOT NULL` | Actual day of work |
| `status` | `VARCHAR(20)` | `NOT NULL` | 'FULL_DAY', 'HALF_DAY', 'OVERTIME', 'ABSENT' |
| `overtime_hours` | `DECIMAL(4,2)`| `DEFAULT 0.00`, `CHECK (overtime_hours >= 0)` | Overtime hours worked |
| `wage_earned_paise`| `INTEGER` | `NOT NULL`, `CHECK (wage_earned_paise >= 0)` | Computed earning for this day in Paise |
| `notes` | `TEXT` | `NULLABLE` | Description of tasks performed |
| `is_locked` | `BOOLEAN` | `DEFAULT FALSE` | True if confirmed by contractor; prevents editing |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Exact timestamp when entry was logged |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Last modified timestamp |

*Constraint:* `UNIQUE(job_id, work_date)` ensures a worker cannot record duplicate work entries for the same job on the same date.

---

### 3.4 `payment_transactions` Table (Advances & Wage Settlements)
Records all cash advances ("kharcha") and payments received from the contractor.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY`, default `gen_random_uuid()` | Unique transaction identifier |
| `job_id` | `UUID` | `NOT NULL`, `REFERENCES jobs(id) ON DELETE CASCADE` | Associated job |
| `worker_id` | `UUID` | `NOT NULL`, `REFERENCES workers(id) ON DELETE CASCADE` | Owner worker ID |
| `amount_paise` | `INTEGER` | `NOT NULL`, `CHECK (amount_paise > 0)` | Amount in Paise (e.g., 50000 = ₹500.00) |
| `type` | `VARCHAR(25)` | `NOT NULL` | 'ADVANCE', 'PARTIAL_PAYMENT', 'FINAL_SETTLEMENT' |
| `payment_mode` | `VARCHAR(25)` | `DEFAULT 'CASH'` | 'CASH', 'UPI', 'BANK_TRANSFER', 'OTHER' |
| `transaction_date`| `DATE` | `NOT NULL` | Date when money was handed over |
| `notes` | `TEXT` | `NULLABLE` | Reason (e.g., 'Groceries advance', 'Weekly balance') |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Creation timestamp |
| `updated_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Last update timestamp |

---

### 3.5 `verifications` Table (Contractor Review Snapshots & Links)
Manages secure review links and stores immutable snapshots of the ledger at link-creation time.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY`, default `gen_random_uuid()` | Unique verification request ID |
| `job_id` | `UUID` | `NOT NULL`, `REFERENCES jobs(id) ON DELETE CASCADE` | Associated job |
| `token_hash` | `VARCHAR(64)` | `UNIQUE`, `NOT NULL` | SHA-256 hash of the verification token |
| `date_range_start`| `DATE` | `NOT NULL` | Start date of the review period |
| `date_range_end` | `DATE` | `NOT NULL` | End date of the review period |
| `snapshot_payload`| `JSONB` | `NOT NULL` | Immutable frozen JSON snapshot of work logs and payments |
| `snapshot_hash` | `VARCHAR(64)` | `NOT NULL` | SHA-256 digest of `snapshot_payload` for tamper checking |
| `status` | `VARCHAR(20)` | `DEFAULT 'PENDING'` | 'PENDING', 'VIEWED', 'CONFIRMED', 'DISPUTED', 'EXPIRED' |
| `view_count` | `INTEGER` | `DEFAULT 0` | Times the link was opened |
| `first_viewed_at`| `TIMESTAMPTZ` | `NULLABLE` | Timestamp when contractor first opened link |
| `responded_at` | `TIMESTAMPTZ` | `NULLABLE` | Timestamp of confirmation or dispute submission |
| `contractor_ip` | `VARCHAR(45)` | `NULLABLE` | IP address of reviewer at submission |
| `contractor_agent`| `TEXT` | `NULLABLE` | User-Agent string of reviewer |
| `contractor_note` | `TEXT` | `NULLABLE` | Overall remark or feedback left by contractor |
| `expires_at` | `TIMESTAMPTZ` | `NOT NULL` | Expiration deadline (typically 14 days after creation) |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Creation timestamp |

---

### 3.6 `verification_items` Table (Item-Level Contractor Disputes)
Granular audit table mapping item-by-item disputes when a contractor flags specific dates.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY`, default `gen_random_uuid()` | Unique row ID |
| `verification_id` | `UUID` | `NOT NULL`, `REFERENCES verifications(id) ON DELETE CASCADE` | Parent verification |
| `work_log_id` | `UUID` | `NULLABLE`, `REFERENCES work_logs(id) ON DELETE SET NULL` | Reference to specific work entry |
| `payment_id` | `UUID` | `NULLABLE`, `REFERENCES payment_transactions(id) ON DELETE SET NULL` | Reference to specific payment entry |
| `is_disputed` | `BOOLEAN` | `NOT NULL`, `DEFAULT FALSE` | True if contractor objected |
| `dispute_reason` | `VARCHAR(100)` | `NULLABLE` | 'WAS_ABSENT', 'HALF_DAY_ONLY', 'INCORRECT_ADVANCE', 'OTHER' |
| `contractor_note` | `TEXT` | `NULLABLE` | Detailed objection note |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Record timestamp |

---

### 3.7 `minimum_wage_benchmarks` Table (Statutory Benchmarks)
Reference rates curated from official government gazettes.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY`, default `gen_random_uuid()` | Unique benchmark ID |
| `state_code` | `VARCHAR(10)` | `NOT NULL` | Two-letter state code or 'CENTRAL' |
| `sphere` | `VARCHAR(20)` | `NOT NULL` | 'CENTRAL' or 'STATE' |
| `scheduled_employment`| `VARCHAR(150)` | `NOT NULL` | e.g., 'Building Operations & Construction' |
| `skill_category` | `VARCHAR(30)` | `NOT NULL` | 'UNSKILLED', 'SEMI_SKILLED', 'SKILLED', 'HIGHLY_SKILLED' |
| `daily_wage_paise`| `INTEGER` | `NOT NULL`, `CHECK (daily_wage_paise > 0)` | Statutory daily rate in Paise |
| `effective_date` | `DATE` | `NOT NULL` | Date from which order takes effect |
| `notification_ref`| `VARCHAR(150)` | `NOT NULL` | Official order number (e.g., 'No. 1/16(1)/2024-LS-II') |
| `authority_name` | `VARCHAR(150)` | `NOT NULL` | Publishing department / ministry |
| `source_url` | `TEXT` | `NOT NULL` | Official government portal URL |
| `is_active` | `BOOLEAN` | `DEFAULT TRUE` | Whether benchmark is the currently active rate |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Record timestamp |

---

### 3.8 `audit_logs` Table (Immutable Event Ledger)
Maintains audit trail for compliance and dispute mediation.

| Column | Data Type | Constraints | Description |
|---|---|---|---|
| `id` | `UUID` | `PRIMARY KEY`, default `gen_random_uuid()` | Audit entry ID |
| `worker_id` | `UUID` | `NULLABLE`, `REFERENCES workers(id) ON DELETE SET NULL` | Worker associated with action |
| `actor_type` | `VARCHAR(20)` | `NOT NULL` | 'WORKER', 'CONTRACTOR', 'SYSTEM' |
| `action` | `VARCHAR(50)` | `NOT NULL` | 'WORK_LOG_CREATED', 'LINK_GENERATED', 'VERIFICATION_CONFIRMED', etc. |
| `entity_type` | `VARCHAR(50)` | `NOT NULL` | 'work_logs', 'verifications', 'payments' |
| `entity_id` | `UUID` | `NOT NULL` | Target entity ID |
| `old_state` | `JSONB` | `NULLABLE` | State before mutation |
| `new_state` | `JSONB` | `NULLABLE` | State after mutation |
| `ip_address` | `VARCHAR(45)` | `NULLABLE` | Client IP |
| `created_at` | `TIMESTAMPTZ` | `DEFAULT NOW()` | Event timestamp |

---

## 4. Prisma Schema Representation (`schema.prisma`)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum WorkerTrade {
  MASON
  CARPENTER
  HELPER
  LOADER
  PAINTER
  ELECTRICIAN
  PLUMBER
  AGRICULTURAL_LABOURER
  GENERAL_LABOUR
  OTHER
}

enum JobStatus {
  ACTIVE
  COMPLETED
  DISPUTED
}

enum WorkDayStatus {
  FULL_DAY
  HALF_DAY
  OVERTIME
  ABSENT
}

enum TransactionType {
  ADVANCE
  PARTIAL_PAYMENT
  FINAL_SETTLEMENT
}

enum PaymentMode {
  CASH
  UPI
  BANK_TRANSFER
  OTHER
}

enum VerificationStatus {
  PENDING
  VIEWED
  CONFIRMED
  DISPUTED
  EXPIRED
}

enum SkillCategory {
  UNSKILLED
  SEMI_SKILLED
  SKILLED
  HIGHLY_SKILLED
}

enum EmploymentSphere {
  CENTRAL
  STATE
}

model Worker {
  id             String          @id @default(uuid()) @db.Uuid
  phone          String          @unique @db.VarChar(15)
  email          String?         @unique @db.VarChar(255)
  passwordHash   String          @map("password_hash") @db.VarChar(255)
  fullName       String          @map("full_name") @db.VarChar(100)
  trade          WorkerTrade     @default(GENERAL_LABOUR)
  stateCode      String          @map("state_code") @db.VarChar(10)
  district       String?         @db.VarChar(100)
  preferredLang  String          @default("hi") @map("preferred_lang") @db.VarChar(5)
  createdAt      DateTime        @default(now()) @map("created_at") @db.Timestamptz()
  updatedAt      DateTime        @updatedAt @map("updated_at") @db.Timestamptz()

  jobs           Job[]
  workLogs       WorkLog[]
  payments       PaymentTransaction[]
  auditLogs      AuditLog[]

  @@map("workers")
}

model Job {
  id                String          @id @default(uuid()) @db.Uuid
  workerId          String          @map("worker_id") @db.Uuid
  title             String          @db.VarChar(150)
  contractorName    String          @map("contractor_name") @db.VarChar(100)
  contractorPhone   String          @map("contractor_phone") @db.VarChar(15)
  siteLocation      String?         @map("site_location") @db.VarChar(255)
  dailyWagePaise    Int             @map("daily_wage_paise")
  standardHours     Int             @default(8) @map("standard_hours") @db.SmallInt
  overtimeRatePaise Int             @default(0) @map("overtime_rate_paise")
  startDate         DateTime        @map("start_date") @db.Date
  status            JobStatus       @default(ACTIVE)
  createdAt         DateTime        @default(now()) @map("created_at") @db.Timestamptz()
  updatedAt         DateTime        @updatedAt @map("updated_at") @db.Timestamptz()

  worker            Worker          @relation(fields: [workerId], references: [id], onDelete: Cascade)
  workLogs          WorkLog[]
  payments          PaymentTransaction[]
  verifications     Verification[]

  @@index([workerId])
  @@index([status])
  @@map("jobs")
}

model WorkLog {
  id               String               @id @default(uuid()) @db.Uuid
  jobId            String               @map("job_id") @db.Uuid
  workerId         String               @map("worker_id") @db.Uuid
  workDate         DateTime             @map("work_date") @db.Date
  status           WorkDayStatus        @default(FULL_DAY)
  overtimeHours    Decimal              @default(0.00) @map("overtime_hours") @db.Decimal(4, 2)
  wageEarnedPaise  Int                  @map("wage_earned_paise")
  notes            String?              @db.Text
  isLocked         Boolean              @default(false) @map("is_locked")
  createdAt        DateTime             @default(now()) @map("created_at") @db.Timestamptz()
  updatedAt        DateTime             @updatedAt @map("updated_at") @db.Timestamptz()

  job              Job                  @relation(fields: [jobId], references: [id], onDelete: Cascade)
  worker           Worker               @relation(fields: [workerId], references: [id], onDelete: Cascade)
  verificationItem VerificationItem[]

  @@unique([jobId, workDate])
  @@index([jobId, workDate])
  @@index([workerId])
  @@map("work_logs")
}

model PaymentTransaction {
  id               String               @id @default(uuid()) @db.Uuid
  jobId            String               @map("job_id") @db.Uuid
  workerId         String               @map("worker_id") @db.Uuid
  amountPaise      Int                  @map("amount_paise")
  type             TransactionType      @default(ADVANCE)
  paymentMode      PaymentMode          @default(CASH) @map("payment_mode")
  transactionDate  DateTime             @map("transaction_date") @db.Date
  notes            String?              @db.Text
  createdAt        DateTime             @default(now()) @map("created_at") @db.Timestamptz()
  updatedAt        DateTime             @updatedAt @map("updated_at") @db.Timestamptz()

  job              Job                  @relation(fields: [jobId], references: [id], onDelete: Cascade)
  worker           Worker               @relation(fields: [workerId], references: [id], onDelete: Cascade)
  verificationItem VerificationItem[]

  @@index([jobId, transactionDate])
  @@index([workerId])
  @@map("payment_transactions")
}

model Verification {
  id               String               @id @default(uuid()) @db.Uuid
  jobId            String               @map("job_id") @db.Uuid
  tokenHash        String               @unique @map("token_hash") @db.VarChar(64)
  dateRangeStart   DateTime             @map("date_range_start") @db.Date
  dateRangeEnd     DateTime             @map("date_range_end") @db.Date
  snapshotPayload  Json                 @map("snapshot_payload")
  snapshotHash     String               @map("snapshot_hash") @db.VarChar(64)
  status           VerificationStatus   @default(PENDING)
  viewCount        Int                  @default(0) @map("view_count")
  firstViewedAt    DateTime?            @map("first_viewed_at") @db.Timestamptz()
  respondedAt      DateTime?            @map("responded_at") @db.Timestamptz()
  contractorIp     String?              @map("contractor_ip") @db.VarChar(45)
  contractorAgent  String?              @map("contractor_agent") @db.Text
  contractorNote   String?              @map("contractor_note") @db.Text
  expiresAt        DateTime             @map("expires_at") @db.Timestamptz()
  createdAt        DateTime             @default(now()) @map("created_at") @db.Timestamptz()

  job              Job                  @relation(fields: [jobId], references: [id], onDelete: Cascade)
  items            VerificationItem[]

  @@index([tokenHash])
  @@index([jobId])
  @@map("verifications")
}

model VerificationItem {
  id              String              @id @default(uuid()) @db.Uuid
  verificationId  String              @map("verification_id") @db.Uuid
  workLogId       String?             @map("work_log_id") @db.Uuid
  paymentId       String?             @map("payment_id") @db.Uuid
  isDisputed      Boolean             @default(false) @map("is_disputed")
  disputeReason   String?             @map("dispute_reason") @db.VarChar(100)
  contractorNote  String?             @map("contractor_note") @db.Text
  createdAt       DateTime            @default(now()) @map("created_at") @db.Timestamptz()

  verification    Verification        @relation(fields: [verificationId], references: [id], onDelete: Cascade)
  workLog         WorkLog?            @relation(fields: [workLogId], references: [id], onDelete: SetNull)
  payment         PaymentTransaction? @relation(fields: [paymentId], references: [id], onDelete: SetNull)

  @@index([verificationId])
  @@map("verification_items")
}

model MinimumWageBenchmark {
  id                   String           @id @default(uuid()) @db.Uuid
  stateCode            String           @map("state_code") @db.VarChar(10)
  sphere               EmploymentSphere @default(STATE)
  scheduledEmployment  String           @map("scheduled_employment") @db.VarChar(150)
  skillCategory        SkillCategory    @map("skill_category")
  dailyWagePaise       Int              @map("daily_wage_paise")
  effectiveDate        DateTime         @map("effective_date") @db.Date
  notificationRef      String           @map("notification_ref") @db.VarChar(150)
  authorityName        String           @map("authority_name") @db.VarChar(150)
  sourceUrl            String           @map("source_url") @db.Text
  isActive             Boolean          @default(true) @map("is_active")
  createdAt            DateTime         @default(now()) @map("created_at") @db.Timestamptz()

  @@index([stateCode, skillCategory, isActive])
  @@map("minimum_wage_benchmarks")
}

model AuditLog {
  id         String   @id @default(uuid()) @db.Uuid
  workerId   String?  @map("worker_id") @db.Uuid
  actorType  String   @map("actor_type") @db.VarChar(20)
  action     String   @db.VarChar(50)
  entityType String   @map("entity_type") @db.VarChar(50)
  entityId   String   @map("entity_id") @db.Uuid
  oldState   Json?    @map("old_state")
  newState   Json?    @map("new_state")
  ipAddress  String?  @map("ip_address") @db.VarChar(45)
  createdAt  DateTime @default(now()) @map("created_at") @db.Timestamptz()

  worker     Worker?  @relation(fields: [workerId], references: [id], onDelete: SetNull)

  @@index([entityType, entityId])
  @@index([workerId])
  @@map("audit_logs")
}
```

---

## 5. Indexing & Query Optimization Strategy

1. **Multi-Tenant Scoping:** All indexes on `work_logs`, `jobs`, and `payment_transactions` place foreign keys (`worker_id`, `job_id`) as leading index columns, ensuring partition pruning and sub-millisecond execution.
2. **Date Range Scans:** Composite index `(job_id, work_date)` facilitates quick aggregations for weekly or monthly wage calculations.
3. **Verification Token Lookup:** A unique index on `token_hash` provides $O(1)$ lookup speed when contractors click the review link.
4. **Minimum Wage Lookup:** Composite index on `(state_code, skill_category, is_active)` delivers instant matching when a worker compares their rate on the dashboard.
