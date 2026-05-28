import { test, expect, type Page } from '@playwright/test';

const PASSWORD = 'test1234';

// Shared auth state — populated in beforeAll, reused by all tests that need auth
let savedToken = '';
let savedUser = { id: '', username: '', balance: 1000 };

// Injects token + user into localStorage BEFORE the page loads.
// Much faster and more reliable than clicking through the login UI every test.
async function setAuth(page: Page) {
  await page.addInitScript(
    ({ token, user }) => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
    },
    { token: savedToken, user: savedUser }
  );
}

test.describe('Color Bet — full flow', () => {
  // Register once via API before any test runs — no browser needed
  test.beforeAll(async ({ request }) => {
    const username = `player_${Date.now()}`;
    const res = await request.post('http://localhost:3001/api/auth/register', {
      data: { username, password: PASSWORD },
    });
    expect(res.ok()).toBeTruthy();
    const body = await res.json();
    savedToken = body.token;
    savedUser = body.user;
  });

  test('register via UI lands on game page with 1,000 credits', async ({ page }) => {
    const username = `ui_${Date.now()}`;
    await page.goto('/login');
    await page.fill('[data-testid="username"]', username);
    await page.fill('[data-testid="password"]', PASSWORD);
    await page.click('[data-testid="register-btn"]');

    await expect(page).toHaveURL('/', { timeout: 10_000 });
    await expect(page.getByText('1,000')).toBeVisible();
  });

  test('authenticated user sees game page', async ({ page }) => {
    await setAuth(page);
    await page.goto('/');

    await expect(page).toHaveURL('/');
    await expect(page.getByText(savedUser.username)).toBeVisible({ timeout: 5_000 });
  });

  test('place a bet during BETTING phase', async ({ page }) => {
    await setAuth(page);
    await page.goto('/');

    // Wait for socket to connect and deliver the first round:update
    const redBtn = page.getByTestId('bet-red');
    await expect(redBtn).toBeEnabled({ timeout: 30_000 });

    await redBtn.click();
    await page.fill('[data-testid="bet-amount"]', '100');
    await page.click('[data-testid="place-bet"]');

    await expect(page.getByTestId('bet-placed')).toBeVisible({ timeout: 5_000 });
  });

  test('duplicate bet is rejected', async ({ page }) => {
    await setAuth(page);
    await page.goto('/');

    const redBtn = page.getByTestId('bet-red');
    await expect(redBtn).toBeEnabled({ timeout: 30_000 });

    await redBtn.click();
    await page.fill('[data-testid="bet-amount"]', '50');
    await page.click('[data-testid="place-bet"]');

    // After first bet the panel locks — button should be disabled
    await expect(page.getByTestId('place-bet')).toBeDisabled({ timeout: 5_000 });
  });

  test('unauthenticated user is redirected to login', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/login');
  });
});
