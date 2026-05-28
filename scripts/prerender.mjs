import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const PORT = 4173;
const DIST = 'dist';
const ROUTES = [
  '/',
  '/nattbord',
  '/skrivebord',
  '/skuffeskap',
  '/skjenk',
  '/kommode',
  '/custom',
  '/interior',
  '/om-oss',
];

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function prerender() {
  // Start vite preview to serve the built dist/
  const server = spawn('npx', ['vite', 'preview', '--port', String(PORT)], {
    stdio: 'pipe',
    shell: process.platform === 'win32',
  });

  server.stderr.on('data', (d) => process.stderr.write(d));

  // Wait until the server signals it's ready
  await new Promise((resolve) => {
    server.stdout.on('data', (data) => {
      if (data.toString().includes('localhost')) resolve();
    });
    setTimeout(resolve, 4000); // fallback
  });

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  let failed = 0;

  for (const route of ROUTES) {
    const url = `http://localhost:${PORT}${route}`;
    const page = await browser.newPage();

    // Suppress non-critical browser errors (e.g. WebGL unavailable in headless)
    page.on('pageerror', () => {});

    try {
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 20000 });
      // Give React effects (meta tag updates) a moment to flush
      await wait(600);

      let html = await page.content();
      // Replace any localhost references left in canonical / og:url tags
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
