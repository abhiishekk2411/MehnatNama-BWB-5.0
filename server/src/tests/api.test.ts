async function testEndpoints() {
  console.log('--- Running MehnatNama API Integration Tests ---');

  // 1. Health Check
  const healthRes = await fetch('http://localhost:5001/api/health');
  if (!healthRes.ok) throw new Error('Health check failed');
  const healthData = await healthRes.json();
  console.log('✓ 1. Health Check passed:', healthData.app);

  // 2. Worker Login (Ramesh Kumar)
  const loginRes = await fetch('http://localhost:5001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone: '9876543210', pin: '1234' }),
  });
  if (!loginRes.ok) throw new Error('Login failed');
  const loginData = await loginRes.json();
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
  const dashData = await dashRes.json();
  console.log('✓ 3. Dashboard summary passed. Total Earned: ₹' + dashData.summary.financials.totalEarnedRupees);

  // 4. Jobs List
  const jobsRes = await fetch('http://localhost:5001/api/jobs', {
    headers: authHeaders,
  });
  if (!jobsRes.ok) throw new Error('Jobs list failed');
  const jobsData = await jobsRes.json();
  console.log('✓ 4. Jobs list passed. Count:', jobsData.count);

  // 5. WorkDays Summary
  const workdaysRes = await fetch('http://localhost:5001/api/workdays/summary', {
    headers: authHeaders,
  });
  if (!workdaysRes.ok) throw new Error('Workdays summary failed');
  const workdaysData = await workdaysRes.json();
  console.log('✓ 5. Workdays summary passed. Working days:', workdaysData.summary.totalDaysWorked);

  // 6. Ledger Summary
  const ledgerRes = await fetch('http://localhost:5001/api/ledger/summary', {
    headers: authHeaders,
  });
  if (!ledgerRes.ok) throw new Error('Ledger summary failed');
  const ledgerData = await ledgerRes.json();
  console.log('✓ 6. Ledger summary passed. Balance: ₹' + ledgerData.summary.outstandingBalanceRupees);

  console.log('--- All MehnatNama API Integration Tests Passed! ---');
}

testEndpoints().catch((err) => {
  console.error('Integration test failed:', err);
  process.exit(1);
});
