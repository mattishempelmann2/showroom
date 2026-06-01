import chromium from '@sparticuz/chromium';
import puppeteer from 'puppeteer-core';
import { spawn } from 'child_process';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const PORT = 4173;
const DIST = 'dist';
const ROUTES = [
  '/',
  '/nattbord',
  '/pult-benk',
  '/skuffeskap',
  '/skjenk',
  '/kommode',
  '/custom',
  '/interior',
  '/om-oss',
];

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// @sparticuz/chromium is built for Linux (Vercel/CI).
// Locally, fall back to the system Chrome installation.
const LOCAL_CHROME = {
  darwin: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  win32: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  linux: '/usr/bin/google-chrome',
};

const getExecutablePath = async () => {
  if (process.env.CI || process.env.VERCEL) {
    return chromium.executablePath();
  }
  return LOCAL_CHROME[process.platform] ?? LOCAL_CHROME.linux;
};

async function prerender() {
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT)], {
    stdio: 'pipe',
    shell: process.platform === 'win32',
  });

  server.stderr.on('data', (d) => process.stderr.write(d));

  await new Promise((resolve) => {
    server.stdout.on('data', (data) => {
      if (data.toString().includes('localhost')) resolve();
    });
    setTimeout(resolve, 4000);
  });

  const isCI = !!(process.env.CI || process.env.VERCEL);
  const executablePath = await getExecutablePath();
  const browser = await puppeteer.launch({
    args: isCI
      ? [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox']
      : ['--no-sandbox', '--disable-setuid-sandbox'],
    executablePath,
    headless: true,
  });

  let failed = 0;

  for (const route of ROUTES) {
    const url = `http://localhost:${PORT}${route}`;
    const page = await browser.newPage();
    page.on('pageerror', () => {});

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
      await wait(600);

      let html = await page.content();
      html = html.replaceAll(`http://localhost:${PORT}`, process.env.VITE_SITE_URL ?? '');

      const dir = route === '/' ? DIST : join(DIST, route);
      mkdirSync(dir, { recursive: true });
      writeFileSync(join(dir, 'index.html'), html);
      console.log(`  ✓  ${route}`);
    } catch (err) {
      console.error(`  ✗  ${route}: ${err.message}`);
      failed++;
    }

    await page.close();
  }

  await browser.close();
  server.kill();

  if (failed > 0) {
    console.error(`\n${failed} route(s) failed to pre-render.`);
    process.exit(1);
  }
  console.log('\nPre-rendering complete.');
}

prerender().catch((err) => {
  console.error(err);
  process.exit(1);
});
