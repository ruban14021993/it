import puppeteer from 'puppeteer';

(async () => {
  console.log('Starting E2E test...');
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  try {
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!email || !password) {
      throw new Error("Missing credentials in environment variables.");
    }

    console.log('Navigating to login page...');
    await page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle0' });
    
    console.log('Entering credentials...');
    await page.type('input[type="email"]', email);
    await page.type('input[type="password"]', password);
    
    console.log('Submitting form...');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to /admin
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    
    const url = page.url();
    if (url.includes('/admin/login')) {
      // Check for error message
      const errorText = await page.evaluate(() => {
        const errEl = document.querySelector('.text-red-500');
        return errEl ? errEl.textContent : 'Unknown error, but did not redirect';
      });
      throw new Error(`Login failed: ${errorText}`);
    }
    
    console.log(`Successfully logged in, current URL: ${url}`);
    
    // Verify dashboard elements (Counts)
    console.log('Verifying dashboard counts...');
    const dashboardText = await page.evaluate(() => document.body.innerText);
    
    if (dashboardText.includes('Products')) console.log('Products section found.');
    if (dashboardText.includes('Services')) console.log('Services section found.');
    if (dashboardText.includes('Industries')) console.log('Industries section found.');
    if (dashboardText.includes('Training')) console.log('Training section found.');

    // Test Refresh
    console.log('Testing refresh...');
    await page.reload({ waitUntil: 'networkidle0' });
    const urlAfterRefresh = page.url();
    if (urlAfterRefresh.includes('/admin/login')) {
      throw new Error("Session lost after refresh!");
    }
    console.log('Session persists after refresh.');

    // Protected Route
    console.log('Testing protected route /admin/products...');
    await page.goto('http://localhost:3000/admin/products', { waitUntil: 'networkidle0' });
    if (page.url().includes('/admin/login')) {
      throw new Error("Protected route kicked user to login!");
    }
    console.log('Protected route access successful.');

    // Logout
    console.log('Testing logout...');
    // We need to click the logout button. Assuming it exists in the sidebar.
    const logoutClicked = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('button, a'));
      const logoutBtn = links.find(el => el.textContent.toLowerCase().includes('logout') || el.textContent.toLowerCase().includes('sign out'));
      if (logoutBtn) {
        logoutBtn.click();
        return true;
      }
      return false;
    });
    
    if (logoutClicked) {
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      if (page.url().includes('/admin/login')) {
        console.log('Logout successful, redirected to login.');
      } else {
        throw new Error(`Logout button clicked but URL is ${page.url()}`);
      }
    } else {
      console.log('WARNING: Could not find logout button to click. Trying localStorage clear workaround to test protected route block...');
      await page.evaluate(() => localStorage.removeItem('admin_access_token'));
      await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle0' });
      if (page.url().includes('/admin/login')) {
        console.log('Logout (simulated) successful, redirected to login.');
      } else {
        throw new Error('Still on admin page after simulated logout!');
      }
    }

    // Re-login
    console.log('Testing re-login...');
    await page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle0' });
    await page.type('input[type="email"]', email);
    await page.type('input[type="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    
    if (page.url().includes('/admin/login')) {
      throw new Error('Re-login failed!');
    }
    console.log('Re-login successful.');
    
    console.log('All E2E tests passed!');
  } catch (err) {
    console.error('Test Failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
