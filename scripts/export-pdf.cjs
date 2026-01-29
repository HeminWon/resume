const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const express = require('express');
const puppeteer = require('puppeteer');

const DEFAULT_PORT = 4173;
const DEFAULT_TIMEOUT = 30000;
const LANG_STORAGE_KEY = 'resume_lang';
const DEFAULT_OUT = path.resolve(process.cwd(), 'artifacts', 'resume.pdf');

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    out: DEFAULT_OUT,
    lang: 'zh',
    port: DEFAULT_PORT,
    timeout: DEFAULT_TIMEOUT,
    build: false,
    noSandbox: false,
    url: '',
    dir: path.resolve(process.cwd(), 'build'),
  };

  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    const next = args[i + 1];
    if (arg === '--out' && next) {
      options.out = path.resolve(process.cwd(), next);
      i += 1;
    } else if (arg === '--lang' && next) {
      options.lang = next;
      i += 1;
    } else if (arg === '--port' && next) {
      options.port = Number(next);
      i += 1;
    } else if (arg === '--timeout' && next) {
      options.timeout = Number(next);
      i += 1;
    } else if (arg === '--dir' && next) {
      options.dir = path.resolve(process.cwd(), next);
      i += 1;
    } else if (arg === '--url' && next) {
      options.url = next;
      i += 1;
    } else if (arg === '--build') {
      options.build = true;
    } else if (arg === '--no-sandbox') {
      options.noSandbox = true;
    }
  }

  return options;
};

const runBuild = () =>
  new Promise((resolve, reject) => {
    const child = spawn('npm', ['run', 'build'], { stdio: 'inherit' });
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`build failed with exit code ${code}`));
      }
    });
  });

const ensureDir = (filePath) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const createStaticServer = (dir, port) =>
  new Promise((resolve, reject) => {
    const app = express();
    app.use(express.static(dir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(dir, 'index.html'));
    });

    const server = app.listen(port, () => resolve(server));
    server.on('error', (error) => reject(error));
  });

const waitForFonts = (page) =>
  page.evaluate(() => {
    if (document.fonts && document.fonts.ready) {
      return document.fonts.ready;
    }
    return Promise.resolve();
  });

const main = async () => {
  const options = parseArgs();

  if (options.build) {
    await runBuild();
  }

  const buildIndex = path.join(options.dir, 'index.html');
  if (!options.url && !fs.existsSync(buildIndex)) {
    throw new Error(`build output not found: ${buildIndex}`);
  }

  let server;
  let targetUrl = options.url;
  if (!targetUrl) {
    server = await createStaticServer(options.dir, options.port);
    targetUrl = `http://localhost:${options.port}`;
  }

  if (options.out === DEFAULT_OUT) {
    options.out = path.resolve(process.cwd(), 'artifacts', `resume-${options.lang}.pdf`);
  }

  ensureDir(options.out);

  const launchArgs = [];
  if (options.noSandbox || process.env.CI === 'true') {
    launchArgs.push('--no-sandbox', '--disable-setuid-sandbox');
  }

  const browser = await puppeteer.launch({
    args: launchArgs,
  });

  try {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument((key, value) => {
      localStorage.setItem(key, value);
    }, LANG_STORAGE_KEY, options.lang);

    await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: options.timeout });
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: options.timeout });
    await waitForFonts(page);

    await page.pdf({
      path: options.out,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
    });
  } finally {
    await browser.close();
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  }
};

main().catch((error) => {
  console.error(`[export-pdf] ${error.message}`);
  process.exit(1);
});
