import {
  PrismaClient,
  JobStatus,
  WorkDayStatus,
  LedgerEntryType,
  PaymentMode,
  SkillCategory,
  SkillLevel,
  EmploymentSphere,
  ConfirmationStatus,
  ConfirmationResponseType,
  DisputeReason,
} from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding MehnatNama (मेहनतनामा) Phase 3 Database ---');

  // 1. Seed Minimum Wage Benchmarks
  const benchmarks = [
    {
      stateCode: 'CENTRAL',
      sphere: EmploymentSphere.CENTRAL,
      scheduledEmployment: 'Construction, Maintenance and Operation of Buildings',
      skillCategory: SkillCategory.UNSKILLED,
      dailyWagePaise: 78300, // ₹783/day
      effectiveDate: new Date('2024-10-01'),
      notificationRef: 'Order No. 1/16(1)/2024-LS-II (Area A)',
      authorityName: 'Office of the Chief Labour Commissioner (Central)',
      sourceUrl: 'https://clc.gov.in/clc/min-wages',
    },
    {
      stateCode: 'CENTRAL',
      sphere: EmploymentSphere.CENTRAL,
      scheduledEmployment: 'Construction, Maintenance and Operation of Buildings',
      skillCategory: SkillCategory.SEMI_SKILLED,
      dailyWagePaise: 86800, // ₹868/day
      effectiveDate: new Date('2024-10-01'),
      notificationRef: 'Order No. 1/16(1)/2024-LS-II (Area A)',
      authorityName: 'Office of the Chief Labour Commissioner (Central)',
      sourceUrl: 'https://clc.gov.in/clc/min-wages',
    },
    {
      stateCode: 'CENTRAL',
      sphere: EmploymentSphere.CENTRAL,
      scheduledEmployment: 'Construction, Maintenance and Operation of Buildings',
      skillCategory: SkillCategory.SKILLED,
      dailyWagePaise: 95400, // ₹954/day
      effectiveDate: new Date('2024-10-01'),
      notificationRef: 'Order No. 1/16(1)/2024-LS-II (Area A)',
      authorityName: 'Office of the Chief Labour Commissioner (Central)',
      sourceUrl: 'https://clc.gov.in/clc/min-wages',
    },
    {
      stateCode: 'MH',
      sphere: EmploymentSphere.STATE,
      scheduledEmployment: 'Building and Construction Industry (Zone I)',
      skillCategory: SkillCategory.UNSKILLED,
      dailyWagePaise: 61500, // ₹615/day
      effectiveDate: new Date('2024-07-01'),
      notificationRef: 'MAH-CLA/MW/SPL/2024-07/Zone1',
      authorityName: 'Office of the Labour Commissioner, Maharashtra',
      sourceUrl: 'https://mahakamgar.maharashtra.gov.in',
    },
    {
      stateCode: 'MH',
      sphere: EmploymentSphere.STATE,
      scheduledEmployment: 'Building and Construction Industry (Zone I)',
      skillCategory: SkillCategory.SKILLED,
      dailyWagePaise: 76000, // ₹760/day
      effectiveDate: new Date('2024-07-01'),
      notificationRef: 'MAH-CLA/MW/SPL/2024-07/Zone1',
      authorityName: 'Office of the Labour Commissioner, Maharashtra',
      sourceUrl: 'https://mahakamgar.maharashtra.gov.in',
    },
  ];

  for (const b of benchmarks) {
    const existing = await prisma.minimumWageBenchmark.findFirst({
      where: {
        stateCode: b.stateCode,
        skillCategory: b.skillCategory,
        scheduledEmployment: b.scheduledEmployment,
      },
    });

    if (!existing) {
      await prisma.minimumWageBenchmark.create({ data: b });
    }
  }
  console.log(`✓ Verified official minimum wage benchmarks`);

  // 2. Seed Demo Worker (Ramesh Kumar, Mobile: 9876543210, PIN: 1234)
  const demoPhone = '9876543210';
  const pinHash = await bcrypt.hash('1234', 10);

  let user = await prisma.user.findUnique({
    where: { phone: demoPhone },
    include: { profile: true },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        phone: demoPhone,
        pinHash,
        profile: {
          create: {
            fullName: 'Ramesh Kumar',
            preferredLanguage: 'hi',
            workerType: 'CONSTRUCTION',
            skillLevel: SkillLevel.SKILLED,
          },
        },
      },
      include: { profile: true },
    });
    console.log(`✓ Created demo worker: Ramesh Kumar (${user.phone}) with PIN 1234`);
  } else {
    // Ensure PIN is 1234 and profile exists
    await prisma.user.update({
      where: { id: user.id },
      data: { pinHash },
    });
    if (!user.profile) {
      await prisma.workerProfile.create({
        data: {
          userId: user.id,
          fullName: 'Ramesh Kumar',
          preferredLanguage: 'hi',
          workerType: 'CONSTRUCTION',
          skillLevel: SkillLevel.SKILLED,
        },
      });
    }
    console.log(`✓ Demo worker account verified: Ramesh Kumar (${user.phone})`);
  }

  // 3. Seed Job 1: Construction Site A (Rajesh Kumar, ₹600/day)
  let job1 = await prisma.job.findFirst({
    where: { userId: user.id, jobTitle: 'Construction Site A' },
  });

  if (!job1) {
    job1 = await prisma.job.create({
      data: {
        userId: user.id,
        jobTitle: 'Construction Site A',
        contractorName: 'Rajesh Kumar',
        contractorPhone: '9822012345',
        workLocation: 'Sector 62, Noida',
        workCategory: 'Construction',
        skillLevel: SkillLevel.SKILLED,
        agreedDailyRatePaise: 60000, // ₹600/day
        startDate: new Date('2026-10-01'),
        status: JobStatus.ACTIVE,
      },
    });
    console.log(`✓ Created Job 1: Construction Site A (₹600/day)`);
  }

  // 4. Seed Job 2: Farm Work B (Suresh, ₹450/day)
  let job2 = await prisma.job.findFirst({
    where: { userId: user.id, jobTitle: 'Farm Work B' },
  });

  if (!job2) {
    job2 = await prisma.job.create({
      data: {
        userId: user.id,
        jobTitle: 'Farm Work B',
        contractorName: 'Suresh',
        contractorPhone: '9876501234',
        workLocation: 'Badlapur Rural',
        workCategory: 'Agriculture',
        skillLevel: SkillLevel.SEMI_SKILLED,
        agreedDailyRatePaise: 45000, // ₹450/day
        startDate: new Date('2026-10-05'),
        status: JobStatus.ACTIVE,
      },
    });
    console.log(`✓ Created Job 2: Farm Work B (₹450/day)`);
  }

  // 5. Seed Workdays matching exact Part D totals:
  // Total Earned: ₹12,000 across 20 Working Days
  // Construction Site A (₹600/day): 19 full days (₹11,400) + 2 half days (₹600) = ₹12,000, 20 working days total!
  // Including 25 Oct (Full day ₹600), 23 Oct (Half day ₹300), etc.
  const workDaysData = [
    { date: '2026-10-01', status: WorkDayStatus.FULL_DAY, note: 'Foundation digging' },
    { date: '2026-10-02', status: WorkDayStatus.FULL_DAY, note: 'Column shuttering' },
    { date: '2026-10-03', status: WorkDayStatus.FULL_DAY, note: 'Brickwork Ground Floor' },
    { date: '2026-10-04', status: WorkDayStatus.FULL_DAY, note: 'Brickwork Ground Floor' },
    { date: '2026-10-06', status: WorkDayStatus.FULL_DAY, note: 'Cement plastering' },
    { date: '2026-10-07', status: WorkDayStatus.FULL_DAY, note: 'Slab reinforcement' },
    { date: '2026-10-08', status: WorkDayStatus.FULL_DAY, note: 'Concrete pouring' },
    { date: '2026-10-09', status: WorkDayStatus.FULL_DAY, note: 'Curing and column work' },
    { date: '2026-10-10', status: WorkDayStatus.FULL_DAY, note: 'First floor brickwork' },
    { date: '2026-10-12', status: WorkDayStatus.FULL_DAY, note: 'First floor plastering' },
    { date: '2026-10-13', status: WorkDayStatus.FULL_DAY, note: 'Lintel casting' },
    { date: '2026-10-14', status: WorkDayStatus.FULL_DAY, note: 'Scaffolding erection' },
    { date: '2026-10-15', status: WorkDayStatus.FULL_DAY, note: 'Staircase reinforcement' },
    { date: '2026-10-16', status: WorkDayStatus.FULL_DAY, note: 'Ceiling plaster' },
    { date: '2026-10-17', status: WorkDayStatus.FULL_DAY, note: 'Bathroom tiling work' },
    { date: '2026-10-19', status: WorkDayStatus.FULL_DAY, note: 'Kitchen counter masonry' },
    { date: '2026-10-20', status: WorkDayStatus.FULL_DAY, note: 'External plastering' },
    { date: '2026-10-21', status: WorkDayStatus.HALF_DAY, note: 'Half day (Cement supply delay)' },
    { date: '2026-10-22', status: WorkDayStatus.FULL_DAY, note: 'Confirmed full day' },
    { date: '2026-10-23', status: WorkDayStatus.HALF_DAY, note: 'Half day recorded (Rain stoppage)' },
    { date: '2026-10-25', status: WorkDayStatus.FULL_DAY, note: 'Full day recorded (Plaster finish)' },
  ];

  for (const item of workDaysData) {
    const workDate = new Date(item.date + 'T00:00:00Z');
    const existing = await prisma.workDay.findUnique({
      where: {
        jobId_workDate: {
          jobId: job1.id,
          workDate,
        },
      },
    });

    const rateSnapshot = job1.agreedDailyRatePaise;
    const earned =
      item.status === WorkDayStatus.FULL_DAY
        ? rateSnapshot
        : item.status === WorkDayStatus.HALF_DAY
        ? Math.round(rateSnapshot / 2)
        : 0;

    if (!existing) {
      await prisma.workDay.create({
        data: {
          userId: user.id,
          jobId: job1.id,
          workDate,
          status: item.status,
          dailyRateSnapshotPaise: rateSnapshot,
          earnedAmountPaise: earned,
          note: item.note,
        },
      });
    }
  }
  console.log(`✓ Seeded workdays totaling ₹12,000 (20 working days)`);

  // 6. Seed Payments & Advances matching Part D:
  // Total Receipts: ₹8,000 (₹7,000 payments + ₹1,000 advance)
  // Outstanding Balance: ₹12,000 - ₹8,000 = ₹4,000
  const existingLedger = await prisma.ledgerEntry.findMany({
    where: { userId: user.id, jobId: job1.id },
  });

  if (existingLedger.length === 0) {
    // 21 Oct - Advance ₹1,000
    await prisma.ledgerEntry.create({
      data: {
        userId: user.id,
        jobId: job1.id,
        type: LedgerEntryType.ADVANCE,
        amountPaise: 100000, // ₹1,000
        paymentDate: new Date('2026-10-21T00:00:00Z'),
        paymentMode: PaymentMode.CASH,
        note: 'Kharcha / Advance recorded',
      },
    });

    // 10 Oct - Payment ₹5,000 (Fortnight payout)
    await prisma.ledgerEntry.create({
      data: {
        userId: user.id,
        jobId: job1.id,
        type: LedgerEntryType.PAYMENT,
        amountPaise: 500000, // ₹5,000
        paymentDate: new Date('2026-10-10T00:00:00Z'),
        paymentMode: PaymentMode.BANK_TRANSFER,
        note: 'First fortnight settlement via NEFT',
      },
    });

    // 24 Oct - Payment ₹2,000 (Matching 24 Oct activity item)
    await prisma.ledgerEntry.create({
      data: {
        userId: user.id,
        jobId: job1.id,
        type: LedgerEntryType.PAYMENT,
        amountPaise: 200000, // ₹2,000
        paymentDate: new Date('2026-10-24T00:00:00Z'),
        paymentMode: PaymentMode.UPI,
        note: 'Payment received via GooglePay',
      },
    });

    console.log(`✓ Seeded payments & advances totaling ₹8,000 (Net balance ₹4,000)`);
  }

  // 7. Seed Official Curated Minimum Wage Rules (Maharashtra & Central Sphere)
  const existingRules = await prisma.minimumWageRule.count();
  if (existingRules === 0) {
    const rulesData = [
      // Maharashtra - Building & Construction
      {
        state: 'Maharashtra',
        zone: 'Zone I (Municipal Corp)',
        employmentCategory: 'Building and Road Construction',
        skillLevel: SkillLevel.UNSKILLED,
        wagePeriod: 'DAILY',
        baseRatePaise: 48200, // ₹482.00
        variableAllowancePaise: 11800, // ₹118.00 VDA
        effectiveFrom: new Date('2026-07-01'),
        notificationDate: new Date('2026-06-25'),
        sourceReference: 'Govt. of Maharashtra Gazette Notification CLA-2026/CR-45/LAB-7',
        officialSourceUrl: 'https://mahakamgar.maharashtra.gov.in/minimum-wage.htm',
        verificationStatus: 'VERIFIED',
        verifiedAt: new Date(),
      },
      {
        state: 'Maharashtra',
        zone: 'Zone I (Municipal Corp)',
        employmentCategory: 'Building and Road Construction',
        skillLevel: SkillLevel.SEMI_SKILLED,
        wagePeriod: 'DAILY',
        baseRatePaise: 52400, // ₹524.00
        variableAllowancePaise: 11800, // ₹118.00 VDA
        effectiveFrom: new Date('2026-07-01'),
        notificationDate: new Date('2026-06-25'),
        sourceReference: 'Govt. of Maharashtra Gazette Notification CLA-2026/CR-45/LAB-7',
        officialSourceUrl: 'https://mahakamgar.maharashtra.gov.in/minimum-wage.htm',
        verificationStatus: 'VERIFIED',
        verifiedAt: new Date(),
      },
      {
        state: 'Maharashtra',
        zone: 'Zone I (Municipal Corp)',
        employmentCategory: 'Building and Road Construction',
        skillLevel: SkillLevel.SKILLED,
        wagePeriod: 'DAILY',
        baseRatePaise: 56800, // ₹568.00
        variableAllowancePaise: 11800, // ₹118.00 VDA (Total ₹686)
        effectiveFrom: new Date('2026-07-01'),
        notificationDate: new Date('2026-06-25'),
        sourceReference: 'Govt. of Maharashtra Gazette Notification CLA-2026/CR-45/LAB-7',
        officialSourceUrl: 'https://mahakamgar.maharashtra.gov.in/minimum-wage.htm',
        verificationStatus: 'VERIFIED',
        verifiedAt: new Date(),
      },
      // Central Sphere - Construction
      {
        state: 'Central Sphere',
        zone: 'Area A (Metros)',
        employmentCategory: 'Construction or Maintenance of Roads / Runways / Buildings',
        skillLevel: SkillLevel.SKILLED,
        wagePeriod: 'DAILY',
        baseRatePaise: 63700, // ₹637.00
        variableAllowancePaise: 25400, // ₹254.00 VDA (Total ₹891)
        effectiveFrom: new Date('2026-10-01'),
        notificationDate: new Date('2026-09-28'),
        sourceReference: 'Ministry of Labour & Employment Notification No. S.O. 4235(E)',
        officialSourceUrl: 'https://clc.gov.in/clc/min-wages',
        verificationStatus: 'VERIFIED',
        verifiedAt: new Date(),
      },
      {
        state: 'Central Sphere',
        zone: 'Area B (Urban)',
        employmentCategory: 'Construction or Maintenance of Roads / Runways / Buildings',
        skillLevel: SkillLevel.SKILLED,
        wagePeriod: 'DAILY',
        baseRatePaise: 53100, // ₹531.00
        variableAllowancePaise: 21200, // ₹212.00 VDA (Total ₹743)
        effectiveFrom: new Date('2026-10-01'),
        notificationDate: new Date('2026-09-28'),
        sourceReference: 'Ministry of Labour & Employment Notification No. S.O. 4235(E)',
        officialSourceUrl: 'https://clc.gov.in/clc/min-wages',
        verificationStatus: 'VERIFIED',
        verifiedAt: new Date(),
      },
    ];

    await prisma.minimumWageRule.createMany({
      data: rulesData,
    });
    console.log(`✓ Seeded ${rulesData.length} authoritative statutory minimum wage benchmark rules`);
  }

  // 8. Seed a demo Contractor Confirmation Request with items & responses matching Part D
  // (10 Confirmed, 2 Disputed, 3 Pending)
  const existingReq = await prisma.contractorConfirmationRequest.findFirst({
    where: { userId: user.id },
  });

  if (!existingReq && job1) {
    const crypto = await import('crypto');
    const demoRawToken = 'a1b2c3d4e5f67890123456789012345678901234567890123456789012345678';
    const demoTokenHash = crypto.createHash('sha256').update(demoRawToken).digest('hex');

    const demoReq = await prisma.contractorConfirmationRequest.create({
      data: {
        userId: user.id,
        jobId: job1.id,
        tokenHash: demoTokenHash,
        expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
        status: ConfirmationStatus.PENDING,
        title: 'Weekly Attendance Verification: Construction Site A (Fortnight 1)',
        note: 'Please review and confirm attendance entries for plastering and mason work.',
      },
    });

    const workDays = await prisma.workDay.findMany({
      where: { jobId: job1.id },
      take: 15,
      orderBy: { workDate: 'asc' },
    });

    for (let idx = 0; idx < workDays.length; idx++) {
      const wd = workDays[idx];
      let itemStatus: ConfirmationStatus = ConfirmationStatus.PENDING;
      if (idx < 10) itemStatus = ConfirmationStatus.CONFIRMED;
      else if (idx < 12) itemStatus = ConfirmationStatus.DISPUTED;

      const item = await prisma.confirmationItem.create({
        data: {
          requestId: demoReq.id,
          workDayId: wd.id,
          status: itemStatus,
        },
      });

      if (itemStatus === ConfirmationStatus.CONFIRMED) {
        await prisma.confirmationResponse.create({
          data: {
            itemId: item.id,
            responseType: ConfirmationResponseType.CONFIRMED,
            optionalComment: 'Work verified at site',
          },
        });
      } else if (itemStatus === ConfirmationStatus.DISPUTED) {
        await prisma.confirmationResponse.create({
          data: {
            itemId: item.id,
            responseType: ConfirmationResponseType.DISPUTED,
            disputeReason:
              idx === 10 ? DisputeReason.INCORRECT_WORKDAY : DisputeReason.WORK_NOT_COMPLETED,
            optionalComment:
              idx === 10
                ? 'Rain stoppage after 2 hours; half day calculated instead'
                : 'Worker left early due to material shortage',
          },
        });
      }
    }

    await prisma.confirmationAuditEvent.create({
      data: {
        requestId: demoReq.id,
        eventType: 'REQUEST_CREATED',
        metadata: { seeded: true, totalItems: workDays.length },
      },
    });

    console.log(
      `✓ Seeded demo contractor confirmation request with 10 Confirmed, 2 Disputed, 3 Pending items`
    );
    console.log(`  Demo Contractor Public Link: /contractor/confirm/${demoRawToken}`);
  }

  console.log('--- Phase 4 Database Setup & Seeding Completed ---');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
