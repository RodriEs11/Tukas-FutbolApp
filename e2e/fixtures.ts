import { test as base, Page, BrowserContext } from '@playwright/test';
import path from 'path';

type MyFixtures = {
  adminPage: Page;
  playerPage: Page;
};

export const test = base.extend<MyFixtures>({
  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: path.join(__dirname, '.auth/admin.json') });
    const adminPage = await context.newPage();
    await use(adminPage);
    await context.close();
  },
  playerPage: async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: path.join(__dirname, '.auth/player.json') });
    const playerPage = await context.newPage();
    await use(playerPage);
    await context.close();
  },
});

export { expect } from '@playwright/test';
