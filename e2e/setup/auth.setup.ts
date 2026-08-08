import { test as setup, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

setup.describe.configure({ mode: 'serial' });

const authFileAdmin = path.join(__dirname, '../../e2e/.auth/admin.json');
const authFilePlayer = path.join(__dirname, '../../e2e/.auth/player.json');
const rootDir = path.join(__dirname, '../../');
const seedPath = path.join(rootDir, 'supabase', 'seed.sql');
const testSeedPath = path.join(rootDir, 'supabase', 'seed.test.sql');
const backupSeedPath = path.join(rootDir, 'supabase', 'seed.backup.sql');


setup('authenticate as admin', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'admin@tukas-test.com');
  await page.fill('input[name="password"]', 'TestAdmin123!');
  await page.click('button[type="submit"]');
  
  await page.waitForURL('/dashboard');
  await expect(page.getByRole('heading', { name: 'Las Tukas' })).toBeVisible();
  
  await page.context().storageState({ path: authFileAdmin });
});

setup('authenticate as player', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'player@tukas-test.com');
  await page.fill('input[name="password"]', 'TestPlayer123!');
  await page.click('button[type="submit"]');
  
  await page.waitForURL('/dashboard');
  await expect(page.getByRole('heading', { name: 'Las Tukas' })).toBeVisible();
  
  await page.context().storageState({ path: authFilePlayer });
});
