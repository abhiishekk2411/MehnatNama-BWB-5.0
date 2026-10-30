import { PrismaClient, WorkerTrade, JobStatus, WorkDayStatus, TransactionType, PaymentMode, SkillCategory, EmploymentSphere } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Seeding Hisaab-Saboot Database ---');

  // 1. Seed Minimum Wage Benchmarks (Official notified rates)
  const benchmarks = [
    // Central Sphere - Construction & Maintenance
    {
      stateCode: 'CENTRAL',
      sphere: EmploymentSphere.CENTRAL,
      scheduledEmployment: 'Construction, Maintenance and Operation of Buildings',
      skillCategory: SkillCategory.UNSKILLED,
      dailyWagePaise: 78300, // ₹783.00/day
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
      dailyWagePaise: 86800, // ₹868.00/day
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
      dailyWagePaise: 95400, // ₹954.00/day
      effectiveDate: new Date('2024-10-01'),
      notificationRef: 'Order No. 1/16(1)/2024-LS-II (Area A)',
      authorityName: 'Office of the Chief Labour Commissioner (Central)',
      sourceUrl: 'https://clc.gov.in/clc/min-wages',
    },
    // Maharashtra - Construction Employment (Zone I)
    {
      stateCode: 'MH',
      sphere: EmploymentSphere.STATE,
      scheduledEmployment: 'Building and Construction Industry (Zone I)',
      skillCategory: SkillCategory.UNSKILLED,
      dailyWagePaise: 61500, // ₹615.00/day
      effectiveDate: new Date('2024-07-01'),
      notificationRef: 'MAH-CLA/MW/SPL/2024-07/Zone1',
      authorityName: 'Office of the Labour Commissioner, Maharashtra',
      sourceUrl: 'https://mahakamgar.maharashtra.gov.in',
    },
    {
      stateCode: 'MH',
      sphere: EmploymentSphere.STATE,
      scheduledEmployment: 'Building and Construction Industry (Zone I)',
      skillCategory: SkillCategory.SEMI_SKILLED,
      dailyWagePaise: 68500, // ₹685.00/day
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
      dailyWagePaise: 76000, // ₹760.00/day
      effectiveDate: new Date('2024-07-01'),
      notificationRef: 'MAH-CLA/MW/SPL/2024-07/Zone1',
      authorityName: 'Office of the Labour Commissioner, Maharashtra',
      sourceUrl: 'https://mahakamgar.maharashtra.gov.in',
    },
    // Delhi - All Scheduled Employments
    {
      stateCode: 'DL',
      sphere: EmploymentSphere.STATE,
      scheduledEmployment: 'All Scheduled Employments (Construction, Shops & Est.)',
      skillCategory: SkillCategory.UNSKILLED,
      dailyWagePaise: 67300, // ₹673.00/day (approx ₹17,494/mo)
      effectiveDate: new Date('2024-10-01'),
      notificationRef: 'Order F.No. (12)/MW/170/Lab/2024/761',
      authorityName: 'Labour Department, Govt of NCT of Delhi',
      sourceUrl: 'https://labour.delhi.gov.in',
    },
    {
      stateCode: 'DL',
      sphere: EmploymentSphere.STATE,
      scheduledEmployment: 'All Scheduled Employments (Construction, Shops & Est.)',
      skillCategory: SkillCategory.SEMI_SKILLED,
      dailyWagePaise: 74200, // ₹742.00/day (approx ₹19,279/mo)
      effectiveDate: new Date('2024-10-01'),
      notificationRef: 'Order F.No. (12)/MW/170/Lab/2024/761',
      authorityName: 'Labour Department, Govt of NCT of Delhi',
      sourceUrl: 'https://labour.delhi.gov.in',
    },
    {
      stateCode: 'DL',
      sphere: EmploymentSphere.STATE,
      scheduledEmployment: 'All Scheduled Employments (Construction, Shops & Est.)',
      skillCategory: SkillCategory.SKILLED,
      dailyWagePaise: 81600, // ₹816.00/day (approx ₹21,215/mo)
      effectiveDate: new Date('2024-10-01'),
      notificationRef: 'Order F.No. (12)/MW/170/Lab/2024/761',
      authorityName: 'Labour Department, Govt of NCT of Delhi',
      sourceUrl: 'https://labour.delhi.gov.in',
    },
    // Uttar Pradesh - Construction & Engineering
    {
      stateCode: 'UP',
      sphere: EmploymentSphere.STATE,
      scheduledEmployment: 'Construction and Building Operations',
      skillCategory: SkillCategory.UNSKILLED,
      dailyWagePaise: 44000, // ₹440.00/day
      effectiveDate: new Date('2024-10-01'),
      notificationRef: 'UP-DLC/MW-Notif/2024-B',
      authorityName: 'Labour Commissioner Office, Uttar Pradesh',
      sourceUrl: 'https://uplabour.gov.in',
    },
    {
      stateCode: 'UP',
      sphere: EmploymentSphere.STATE,
      scheduledEmployment: 'Construction and Building Operations',
      skillCategory: SkillCategory.SKILLED,
      dailyWagePaise: 55000, // ₹550.00/day
      effectiveDate: new Date('2024-10-01'),
      notificationRef: 'UP-DLC/MW-Notif/2024-B',
      authorityName: 'Labour Commissioner Office, Uttar Pradesh',
      sourceUrl: 'https://uplabour.gov.in',
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
  console.log(`✓ Seeded ${benchmarks.length} official minimum wage benchmarks`);

  // 2. Seed Demo Worker (Ramesh Kumar - Mason)
  const demoPhone = '9876543210';
  const existingWorker = await prisma.worker.findUnique({ where: { phone: demoPhone } });

  if (!existingWorker) {
    const passwordHash = await bcrypt.hash('worker123', 10);
    const worker = await prisma.worker.create({
      data: {
        phone: demoPhone,
        email: 'ramesh.mason@example.com',
        passwordHash,
        fullName: 'Ramesh Kumar',
        trade: WorkerTrade.MASON,
        stateCode: 'MH',
        district: 'Pune',
        preferredLang: 'hi',
      },
    });
    console.log(`✓ Created demo worker: ${worker.fullName} (${worker.phone})`);

    // Create a demo job
    const job = await prisma.job.create({
      data: {
        workerId: worker.id,
        title: 'Sharmaji Kothi 3rd Floor Construction',
        contractorName: 'Vikram Singh Thekedar',
        contractorPhone: '9822012345',
        siteLocation: 'Baner Hills, Pune',
        dailyWagePaise: 65000, // ₹650.00 / day
        standardHours: 8,
        overtimeRatePaise: 12000, // ₹120.00 / hour OT
        startDate: new Date('2026-10-01'),
        status: JobStatus.ACTIVE,
      },
    });
    console.log(`✓ Created demo job: ${job.title} at ₹${job.dailyWagePaise / 100}/day`);

    // Create sample work logs (7 days of work)
    const logs = [
      { date: '2026-10-20', status: WorkDayStatus.FULL_DAY, ot: 0, wage: 65000, notes: 'Ground level brickwork' },
      { date: '2026-10-21', status: WorkDayStatus.FULL_DAY, ot: 0, wage: 65000, notes: 'First floor column casting' },
      { date: '2026-10-22', status: WorkDayStatus.HALF_DAY, ot: 0, wage: 32500, notes: 'Half day, afternoon heavy rain stoppage' },
      { date: '2026-10-23', status: WorkDayStatus.FULL_DAY, ot: 0, wage: 65000, notes: 'Wall plastering living room' },
      { date: '2026-10-24', status: WorkDayStatus.OVERTIME, ot: 2, wage: 89000, notes: 'Roof shuttering + 2 hrs extra night shift' },
      { date: '2026-10-25', status: WorkDayStatus.FULL_DAY, ot: 0, wage: 65000, notes: 'Staircase masonry' },
      { date: '2026-10-26', status: WorkDayStatus.ABSENT, ot: 0, wage: 0, notes: 'Personal work / Sunday' },
    ];

    for (const l of logs) {
      await prisma.workLog.create({
        data: {
          jobId: job.id,
          workerId: worker.id,
          workDate: new Date(l.date),
          status: l.status,
          overtimeHours: l.ot,
          wageEarnedPaise: l.wage,
          notes: l.notes,
        },
      });
    }
    console.log(`✓ Created ${logs.length} sample work logs`);

    // Create sample payments/advances
    await prisma.paymentTransaction.create({
      data: {
        jobId: job.id,
        workerId: worker.id,
        amountPaise: 100000, // ₹1,000 advance
        type: TransactionType.ADVANCE,
        paymentMode: PaymentMode.CASH,
        transactionDate: new Date('2026-10-22'),
        notes: 'Kharcha for groceries',
      },
    });

    await prisma.paymentTransaction.create({
      data: {
        jobId: job.id,
        workerId: worker.id,
        amountPaise: 50000, // ₹500 advance
        type: TransactionType.ADVANCE,
        paymentMode: PaymentMode.UPI,
        transactionDate: new Date('2026-10-24'),
        notes: 'Medicine advance via PhonePe',
      },
    });
    console.log(`✓ Created 2 sample advance records`);
  }

  console.log('--- Seeding Completed Successfully ---');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
