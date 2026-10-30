# Product Specification: MehnatNama (मेहनतनामा)
**Tagline:** *Har din ka kaam. Har rupaye ka hisaab.*

---

## 1. Executive Summary & Vision

In India's informal economy, over 400 million daily-wage workers—including construction labourers, masonry helpers, agricultural workers, loaders, daily painters, and domestic help—operate without formal written contracts, pay slips, or transparent timesheets. Wage agreements are routinely verbal. Payments are disbursed irregularly in fragmented cash advances ("kharcha") and delayed weekly or monthly balance settlements.

This informal status quo creates acute vulnerabilities:
- **Wage Theft & Arbitrary Deductions:** Contractors often dispute the number of days worked or claim undocumented advances when settling accounts at the end of a project.
- **Lost or Contested Paper Diaries:** Many workers record their days in small paper notebooks (*khatas*) or rely on memory, which can be lost, damaged, or dismissed by contractors.
- **Power Asymmetry & Lack of Corroboration:** When a dispute arises, the worker has no verifiable evidence that the contractor acknowledged their attendance.
- **Minimum Wage Blindness:** Workers are unaware of officially notified statutory minimum wages for their state, skill grade, and zone.

**MehnatNama** is a worker-first digital wage diary, contemporaneous record-keeping system, and wage-rights awareness platform. It empowers informal workers to independently log their daily work, track agreed wages, record cash advances and payments received, and generate tamper-evident, link-based verification snapshots that contractors can review and acknowledge without needing to install an app or register an account.

---

## 2. Target User Personas

### Persona 1: Ramesh Kumar — Construction Mason / Labourer (Primary User: Worker)
- **Profile:** 34 years old, works across residential construction sites in suburban Pune. Owns an entry-to-mid-range Android smartphone with basic mobile data.
- **Behaviors:** Daily wage verbally agreed at ₹650/day. Takes weekly advances of ₹500–₹1,000 for groceries; balance expected upon casting the slab or month-end.
- **Pain Points:** At settlement time, contractor argues that Ramesh was absent on 3 days and claims an extra ₹2,000 advance was given that Ramesh cannot disprove.
- **Needs:** Fast, friction-free daily entry (under 15 seconds) to mark full-day, half-day, or overtime; clear running balance showing "Total Kamai" (Earned), "Mila Hua Paisa" (Received/Advances), and "Baki Paisa" (Outstanding Balance); one-click shareable proof for his *thekedar* (contractor).

### Persona 2: Vikram Singh — Sub-Contractor / Thekedar (Secondary User: Contractor / Reviewer)
- **Profile:** 42 years old, manages 15–25 workers across 2 ongoing building sites. Pragmatic, fast-paced, relies heavily on WhatsApp and voice notes.
- **Behaviors:** Reluctant to download complex enterprise contractor apps or fill out elaborate forms.
- **Pain Points:** Forgets exact dates when individual helpers worked half-days or left early; disputes slow down project handovers.
- **Needs:** A zero-friction web link received via WhatsApp/SMS where he can view the worker's itemised attendance and payment ledger in under 60 seconds, tap "Confirm", or pinpoint a specific disputed day with a reason (e.g., "Half-day only on Tuesday").

### Persona 3: Suman Devi — Community Volunteer / Labour Union Facilitator (Tertiary User: Helper / Advisor)
- **Profile:** 28 years old, community paralegal working with informal worker collectives.
- **Behaviors:** Helps illiterate or semi-literate workers organize their wage claims and file grievances with the Labour Commissioner’s office.
- **Needs:** Clean, printable, and legally organized PDF summaries (*MehnatNama Statement / पर्चा*) listing daily logs, contractor responses, calculation breakdowns, and statutory minimum wage reference comparisons for conciliation proceedings.

---

## 3. Core Problem Statement & Product Tenets

### Problem Statement
Informal wage labor in India suffers from a severe **information and evidentiary deficit**. Because agreements are verbal and records are unilateral, settlements degenerate into "worker's word vs. contractor's word," in which the socio-economic power imbalance almost always forces the worker to accept underpayment.

### Product Tenets
1. **Worker-First Simplicity:** Core workflows (logging work, recording cash advances) must require minimal taps, clear visual affordances, and zero jargon.
2. **Zero-Barrier Contractor Verification:** Contractors will not create accounts or install apps. Verification must happen via fast, secure, standalone web links optimized for mobile browsers.
3. **Immutability of Acknowledged Evidence:** Once a record or statement period is confirmed or disputed by a contractor, it is locked into an audit-logged state to prevent retrospective tampering by either party.
4. **Sourced, Informational Benchmarks (Not Legal Determinations):** Minimum wage comparisons are strictly educational and sourced from published government notifications, presented as reference points without asserting legal adjudications.
5. **Privacy & Dignity by Design:** No Aadhaar numbers, no credit bureau scraping, no payment gateway fees, and no monetization of worker data.

---

## 4. End-to-End User Journeys

```
Journey 1: Worker Daily Lifecycle
[Register/Login] ➔ [Select / Create Job] ➔ [Log Daily Work (Full/Half/Overtime)] 
       ➔ [Log Advances / Payments] ➔ [Live Dashboard Updates Dues]

Journey 2: Contractor Acknowledgment & Dispute
[Worker taps "Share Hisaab with Contractor"] 
       ➔ [Selects Date Range (e.g., Current Week)] 
       ➔ [System creates Immutable Snapshot & Cryptographic Verification Link]
       ➔ [Contractor opens link via WhatsApp/Browser (No Login)]
       ➔ [Contractor inspects daily breakdown] 
       ➔ [Action: Confirm All OR Dispute Specific Entries + Add Note]
       ➔ [Worker Dashboard reflects CONFIRMED / DISPUTED status with timestamp]

Journey 3: Evidence Export & Minimum Wage Check
[Worker / Helper views Job Summary] 
       ➔ [Compares agreed wage against State Scheduled Minimum Wage benchmark]
       ➔ [Generates Official PDF 'MehnatNama' Statement]
       ➔ [Downloads / Prints / Shares PDF for settlement or grievance conciliation]
```

---

## 5. Comprehensive Feature Breakdown

### 5.1 Worker Authentication & Profile
- **Registration & Login:** Secure email/phone identifier with hashed password authentication; designed with an abstraction layer for easy OTP migration in future phases.
- **Worker Profile:** Full Name, Trade/Occupation (Mason, Carpenter, Helper, Painter, Loader, Farmhand, General Labour), Primary City/State, Preferred Language indicator.
- **Privacy Protections:** Zero collection of Aadhaar, PAN, or bank account numbers.

### 5.2 Job & Employer Management
- **Job Entities:** Workers can maintain multiple concurrent or past jobs (e.g., "Sharmaji Kothi Site", "Metro Pillar 42", "Ravi Thekedar Brickwork").
- **Contractor Metadata:** Contractor/Supervisor name, mobile phone number (for link sharing and logging), site location/nickname.
- **Agreed Wage Terms:** Standard Daily Wage Rate (₹/day), standard workday duration (default 8 hours), agreed overtime rate multiplier or flat hourly rate.
- **Job Status:** Active, Completed, or Disputed/Stalled.

### 5.3 Workday Attendance & Wage Logging
- **Attendance Statuses:**
  - `FULL_DAY`: 1.0 unit of agreed daily wage.
  - `HALF_DAY`: 0.5 unit of agreed daily wage (or custom hourly rate).
  - `OVERTIME`: Full day + specified extra hours (calculated using agreed overtime terms).
  - `ABSENT`: 0.0 wage recorded for calendar completeness.
  - `PAID_LEAVE` / `INCLEMENT_WEATHER`: Optional status if verbally agreed by the contractor (e.g., rain stoppage where partial wage is promised).
- **Date & Work Description:** Date picker (defaulted to today), optional brief task notes (e.g., "Third floor roof casting", "Material unloading").
- **Contemporaneous Timestamps:** System records exact creation timestamp (`created_at`) alongside the recorded work date (`work_date`) to demonstrate contemporaneous logging.

### 5.4 Financial Ledger: Payments & Advances ("Kharcha")
- **Transaction Types:**
  - `ADVANCE`: Mid-cycle cash given for daily food/travel ("Kharcha").
  - `PARTIAL_PAYMENT`: Partial wage settlement payment.
  - `FINAL_SETTLEMENT`: Full balance clearance.
- **Payment Attributes:** Amount (₹ in integer paise to avoid rounding errors), Date received, Payment Mode (Cash, UPI, Direct Bank Transfer), Payer Note.
- **Automatic Financial Balancing Engine:**
  - $\text{Total Earned} = \sum (\text{Days Worked} \times \text{Applicable Daily Wage}) + \text{Overtime Earnings}$
  - $\text{Total Received} = \sum (\text{Advances}) + \sum (\text{Payments})$
  - $\text{Outstanding Balance (Baki)} = \text{Total Earned} - \text{Total Received}$

### 5.5 Contractor Verification & Dispute System
- **Verification Link Generation:**
  - Worker selects a date range (e.g., "Past 7 Days", "Current Month", or custom).
  - The system creates a frozen, immutable `VerificationSnapshot` and generates a single-use or time-bound secure HMAC-signed URL.
- **Contractor Public Portal (Zero-Login):**
  - Mobile-optimized responsive interface with clean card layout.
  - Displays: Worker name, job title, date range, total days, list of individual dates with status (Full/Half/Overtime), list of payments/advances recorded, and net balance calculated.
  - Contractor Actions:
    1. **"Sab Sahi Hai" (Confirm All):** Contractor acknowledges the breakdown as accurate. Records contractor's confirmation with timestamp, IP, and browser metadata.
    2. **"Kucch Galat Hai" (Dispute Entries):** Contractor flags specific dates/payments and provides dispute reasons (e.g., "Worked half day on 14th Oct", "Advance on 12th was ₹2,000, not ₹1,000").
    3. **General Comments:** Optional free-form remark.
- **Status Reflection on Worker Dashboard:**
  - Work entries are color-tagged:
    - 🟡 **Pending Verification:** Link issued, not yet responded to.
    - 🟢 **Confirmed by Contractor:** Acknowledged; entry locked from casual edits.
    - 🔴 **Disputed by Contractor:** Highlights contractor's objection for amicable settlement.
    - ⚪ **Unshared / Draft:** Kept solely in worker's private diary.

### 5.6 Minimum Wage Benchmark Calculator
- **Statutory Benchmark Explorer:**
  - Sourced database of notified minimum wages for Central Sphere and key industrial states (e.g., Maharashtra, Delhi, Uttar Pradesh, Karnataka, Bihar).
  - Categorized by skill grade: Unskilled, Semi-Skilled, Skilled, Highly Skilled.
- **Fair Wage Gap Analysis:**
  - Real-time comparison: "Your agreed wage is ₹500/day. The official notified benchmark for Semi-Skilled Construction in your state is ₹620/day."
  - Shows potential shortfall over the duration of the job.
  - **Disclaimer:** Explicit, prominent legal disclaimer: *"This rate is sourced from Official Notification [Ref No. / Date]. This calculation is for informational awareness and conciliation support, not a judicial order."*

### 5.7 Downloadable "MehnatNama" PDF Report
- **Structured Evidentiary Statement:**
  - Clean header: Worker details, Contractor details, Job duration, Unique Statement Reference ID.
  - Executive Financial Summary: Total days worked, Total earnings, Total advances deducted, Net balance due.
  - Detailed Chronological Timesheet Table: Date, Status, Wage Earned, Contractor Verification Status (with timestamp of digital confirmation if confirmed).
  - Payment Ledger Table: Date, Amount, Mode, Type.
  - Statutory Minimum Wage Reference Appendix.
  - Signature block for physical endorsement if required during mediation.

### 5.8 Labour Rights & Grievance Conciliation Guide
- **Empowerment Knowledge Base:**
  - Step-by-step guidance on resolving informal wage disputes amicably.
  - Information on the **Payment of Wages Act, 1936**, **Minimum Wages Act, 1948**, and the **Code on Wages, 2019**.
  - Directory of official dispute resolution pathways: District Labour Officer (DLO), Labour Commissioner helplines, Shram Suvidha portal, and National Toll-Free Labour Helpline (14434).

---

## 6. Non-Functional Requirements & Design Principles

| Dimension | Specification |
|---|---|
| **Performance** | Core pages load within < 1.5 seconds on 3G/4G networks; API responses < 150ms. |
| **Responsiveness** | Mobile-first viewport (360px width upwards) with frictionless touch targets (min 48x48px). |
| **Accessibility** | High-contrast text ratios (WCAG AA), clear iconography via Lucide icons, high font legibility. |
| **Data Integrity** | Financial amounts stored as integer paise to prevent IEEE-754 floating-point inaccuracies. |
| **Security** | Secure cookies / bearer JWTs, rate-limiting on verification links, tamper-evident snapshot hashing. |
| **Scalability** | Stateless REST backend with Prisma connection pooling on PostgreSQL. |

---

## 7. Out of Scope (Explicit Boundaries)
- ❌ No payment gateway integrations or processing of digital cash transfers.
- ❌ No Aadhaar verification, biometric verification, or KYC scraping.
- ❌ No AI automated chatbots or hallucinated advice engines.
- ❌ No IoT hardware, GPS geofencing, or facial recognition punch-in.
- ❌ No fabricated legal orders or fictitious minimum wage data.
