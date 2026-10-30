async function testEndpoints() {
  console.log('--- Running MehnatNama Complete API Integration Tests (Phases 1-5) ---');

  // 1. Root Info & Health Check
  const rootRes = await fetch('http://localhost:5001/');
  if (!rootRes.ok) throw new Error('Root check failed');
  const rootData: any = await rootRes.json();
  console.log('✓ 1. Root operational info passed:', rootData.name);

  // 1b. Phase 5: Dedicated /health endpoint
  const healthRes = await fetch('http://localhost:5001/health');
  if (!healthRes.ok) throw new Error('Health check failed');
  const healthData: any = await healthRes.json();
  console.log('✓ 1b. Phase 5 Health check passed. Uptime:', healthData.uptimeSeconds, 's | Status:', healthData.status);

  // 2. Worker Login (Ramesh Kumar)
  const loginRes = await fetch('http://localhost:5001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: '9876543210', pin: '1234' }),
  });
  if (!loginRes.ok) throw new Error('Login failed');
  const loginData: any = await loginRes.json();
  console.log('✓ 2. Worker login passed for:', loginData.user?.profile?.fullName);
  const token = loginData.token;

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // 3. Dashboard Summary
  const dashRes = await fetch('http://localhost:5001/api/dashboard/summary', {
    headers: authHeaders,
  });
  if (!dashRes.ok) throw new Error('Dashboard summary failed');
  const dashData: any = await dashRes.json();
  console.log('✓ 3. Dashboard summary passed. Total Earned: ₹' + dashData.summary.financials.totalEarnedRupees);

  // 4. Jobs List
  const jobsRes = await fetch('http://localhost:5001/api/jobs', {
    headers: authHeaders,
  });
  if (!jobsRes.ok) throw new Error('Jobs list failed');
  const jobsData: any = await jobsRes.json();
  console.log('✓ 4. Jobs list passed. Count:', jobsData.count);

  // 5. WorkDays Summary
  const workdaysRes = await fetch('http://localhost:5001/api/workdays/summary', {
    headers: authHeaders,
  });
  if (!workdaysRes.ok) throw new Error('Workdays summary failed');
  const workdaysData: any = await workdaysRes.json();
  console.log('✓ 5. Workdays summary passed. Working days:', workdaysData.summary.totalDaysWorked);

  // 6. Ledger Summary
  const ledgerRes = await fetch('http://localhost:5001/api/ledger/summary', {
    headers: authHeaders,
  });
  if (!ledgerRes.ok) throw new Error('Ledger summary failed');
  const ledgerData: any = await ledgerRes.json();
  console.log('✓ 6. Ledger summary passed. Balance: ₹' + ledgerData.summary.outstandingBalanceRupees);

  // 7. Phase 4: Confirmation Requests
  const confRes = await fetch('http://localhost:5001/api/confirmations', {
    headers: authHeaders,
  });
  if (!confRes.ok) throw new Error('Confirmations retrieval failed');
  const confData: any = await confRes.json();
  console.log('✓ 7. Confirmation requests passed. Count:', confData.requests.length);

  // 8. Phase 4: Public Contractor Zero-Login Access (Using seeded token)
  const demoToken = 'a1b2c3d4e5f67890123456789012345678901234567890123456789012345678';
  const publicConfRes = await fetch(`http://localhost:5001/api/public/confirmations/${demoToken}`);
  if (!publicConfRes.ok) throw new Error('Public contractor portal access failed');
  const publicConfData: any = await publicConfRes.json();
  console.log('✓ 8. Public contractor portal passed. Worker:', publicConfData.data.worker.displayName, '| Items:', publicConfData.data.items.length);

  // 9. Phase 4: Minimum Wage Benchmark Comparison Calculation
  const wageCheckRes = await fetch('http://localhost:5001/api/wage/check/calculate', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      state: 'Maharashtra',
      employmentCategory: 'Building and Road Construction',
      skillLevel: 'SKILLED',
      agreedDailyRatePaise: 60000, // ₹600
      daysWorkedCount: 20,
    }),
  });
  if (!wageCheckRes.ok) throw new Error('Wage comparison check failed');
  const wageCheckData: any = await wageCheckRes.json();
  console.log('✓ 9. Minimum wage calculator passed. Benchmark: ₹' + wageCheckData.rule.totalBenchmarkDailyRateRupees + '/day | Diff: ₹' + wageCheckData.comparison.differencePerDayRupees + '/day');

  // 10. Phase 4: Report Data Generation
  const reportRes = await fetch('http://localhost:5001/api/reports/data', {
    headers: authHeaders,
  });
  if (!reportRes.ok) throw new Error('Report data generation failed');
  const reportData: any = await reportRes.json();
  console.log('✓ 10. Report data generation passed. Total Earned: ₹' + reportData.report.summary.totalEarnedRupees + ' | Net Balance: ₹' + reportData.report.summary.netRecordedBalanceRupees);

  // 11. Phase 4: Rights & Escalation Resources
  const rightsRes = await fetch('http://localhost:5001/api/rights/guides');
  if (!rightsRes.ok) throw new Error('Rights guides failed');
  const rightsData: any = await rightsRes.json();
  console.log('✓ 11. Rights guides passed. Guides count:', rightsData.guides.length);

  const escRes = await fetch('http://localhost:5001/api/rights/escalation-resources');
  if (!escRes.ok) throw new Error('Escalation resources failed');
  const escData: any = await escRes.json();
  console.log('✓ 12. Escalation resources passed. Steps count:', escData.resources.length);

  console.log('--- All 13 MehnatNama API Integration Tests Passed (100%)! ---');
}

testEndpoints().catch((err) => {
  console.error('Integration test failed:', err);
  process.exit(1);
});
