const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const express = require('express');
const puppeteer = require('puppeteer');

const DEFAULT_PORT = 4173;
const DEFAULT_TIMEOUT = 30000;
const LANG_STORAGE_KEY = 'resume_lang';
const THEME_STORAGE_KEY = 'resume_theme';
const DEFAULT_OUT = path.resolve(process.cwd(), 'artifacts', 'resume.pdf');
const LOCALES_DIR = path.resolve(__dirname, '..', 'src', 'locales');
const THEME_IDS_FILE = path.resolve(__dirname, '..', 'src', 'themes', 'theme-ids.json');
const RUN_PACKAGE_SCRIPT = path.resolve(__dirname, 'core', 'run-package-script.sh');
const SUPPORTED_LANGS = new Set(['zh', 'en']);

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const loadTranslations = () => {
  const files = [
    { lang: 'zh', file: path.join(LOCALES_DIR, 'zh', 'translation.json') },
    { lang: 'en', file: path.join(LOCALES_DIR, 'en', 'translation.json') },
  ];

  const result = {};
  files.forEach(({ lang, file }) => {
    try {
      if (!fs.existsSync(file)) {
        throw new Error(`missing translation file: ${file}`);
      }
      result[lang] = readJson(file);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`[export-pdf] failed to load ${lang} translations: ${message}`);
    }
  });
  return result;
};

const loadThemeIds = () => {
  if (!fs.existsSync(THEME_IDS_FILE)) {
    throw new Error(`theme ids file not found: ${THEME_IDS_FILE}`);
  }
  const source = fs.readFileSync(THEME_IDS_FILE, 'utf-8');
  const parsed = JSON.parse(source);
  if (!Array.isArray(parsed)) {
    throw new Error('theme ids file must be a JSON array');
  }
  const themes = Array.from(
    new Set(parsed.filter((item) => typeof item === 'string' && item.trim().length > 0))
  );
  if (themes.length === 0) {
    throw new Error('failed to resolve theme ids from src/themes/theme-ids.json');
  }
  return themes;
};

const isPositiveInteger = (value) => Number.isInteger(value) && value > 0;

const parseArgs = () => {
  const args = process.argv.slice(2);
  const options = {
    out: DEFAULT_OUT,
    lang: 'zh',
    theme: 'classic',
    port: DEFAULT_PORT,
    timeout: DEFAULT_TIMEOUT,
    build: false,
    noSandbox: false,
    footer: true,
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
    } else if (arg === '--theme' && next) {
      options.theme = next;
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
    } else if (arg === '--no-footer') {
      options.footer = false;
    }
  }

  return options;
};

const runBuild = () =>
  new Promise((resolve, reject) => {
    const child = spawn(RUN_PACKAGE_SCRIPT, ['build'], { stdio: 'inherit' });
    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`build failed with exit code ${code}`));
      }
    });
  });

const validateOptions = (options, themeIds) => {
  if (!SUPPORTED_LANGS.has(options.lang)) {
    throw new Error(`unsupported --lang "${options.lang}", expected: ${Array.from(SUPPORTED_LANGS).join(', ')}`);
  }
  if (!themeIds.includes(options.theme)) {
    throw new Error(`unsupported --theme "${options.theme}", expected: ${themeIds.join(', ')}`);
  }
  if (!isPositiveInteger(options.port)) {
    throw new Error(`invalid --port "${options.port}", expected a positive integer`);
  }
  if (!isPositiveInteger(options.timeout)) {
    throw new Error(`invalid --timeout "${options.timeout}", expected a positive integer`);
  }
  if (options.url && !/^https?:\/\//.test(options.url)) {
    throw new Error(`invalid --url "${options.url}", expected http(s) URL`);
  }
};

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

const checkFontsAvailability = (page) =>
  page.evaluate(() => {
    const normalizeFamily = (value) =>
      value
        .split(',')
        .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean);

    const bodyFontFamily = getComputedStyle(document.body).fontFamily || '';
    const rootStyles = getComputedStyle(document.documentElement);
    const footerFontFamily = rootStyles.getPropertyValue('--pdf-footer-font-family') || '';

    const families = [
      ...normalizeFamily(bodyFontFamily).slice(0, 1),
      ...normalizeFamily(footerFontFamily).slice(0, 1),
    ].filter(Boolean);

    const missing = families.filter(
      (family) => document.fonts && !document.fonts.check(`12px "${family}"`)
    );

    return {
      bodyFontFamily,
      footerFontFamily,
      missing,
    };
  });

const escapeHtml = (value) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const getFooterPageTemplate = (translations, lang) =>
  translations[lang]?.pdf?.footer?.page ||
  translations.zh?.pdf?.footer?.page ||
  'Page {{page}} (of {{total}})';

const buildPageLabelHtml = (translations, lang) => {
  const template = getFooterPageTemplate(translations, lang);
  return template
    .replace('{{page}}', '<span class="pageNumber"></span>')
    .replace('{{total}}', '<span class="totalPages"></span>');
};

const getFooterPrefix = async (page) =>
  page.evaluate(() => {
    const nameEl = document.querySelector("[data-ui='resume-header'] [data-slot='name']");
    const labelEl = document.querySelector("[data-ui='resume-header'] [data-slot='label']");
    const name = nameEl?.textContent?.trim() ?? '';
    const label = labelEl?.textContent?.trim() ?? '';
    return { name, label };
  });

const getFooterStyle = async (page) =>
  page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const body = document.body ? getComputedStyle(document.body) : null;
    const resolveVar = (value) => {
      const trimmed = value.trim();
      const match = trimmed.match(/^var\((--[^,\s)]+)\s*(?:,\s*([^)]+))?\)$/);
      if (!match) {
        return trimmed;
      }
      const resolved = root.getPropertyValue(match[1]).trim();
      if (resolved) {
        return resolved;
      }
      return match[2]?.trim() ?? '';
    };
    const read = (name, fallback) => {
      const raw = root.getPropertyValue(name).trim();
      const value = raw ? resolveVar(raw) : '';
      return value || fallback;
    };
    return {
      fontFamily: read('--pdf-footer-font-family', body?.fontFamily ?? ''),
      fontSize: read('--pdf-footer-font-size', '9px'),
      color: read('--pdf-footer-color', '#c0c4cc'),
      align: read('--pdf-footer-align', 'right'),
      paddingX: read('--pdf-footer-padding-x', '18mm'),
      letterSpacing: read('--pdf-footer-letter-spacing', '0'),
      fontStyle: body?.fontStyle ?? 'normal',
      fontWeight: body?.fontWeight ?? 'normal',
    };
  });

const getPdfPageLayout = async (page) =>
  page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const resolveVar = (value) => {
      const trimmed = value.trim();
      const match = trimmed.match(/^var\((--[^,\s)]+)\s*(?:,\s*([^)]+))?\)$/);
      if (!match) {
        return trimmed;
      }
      const resolved = root.getPropertyValue(match[1]).trim();
      if (resolved) {
        return resolved;
      }
      return match[2]?.trim() ?? '';
    };
    const read = (name, fallback) => {
      const raw = root.getPropertyValue(name).trim();
      const value = raw ? resolveVar(raw) : '';
      return value || fallback;
    };
    return {
      top: read('--pdf-page-margin-top', '12mm'),
      right: read('--pdf-page-margin-right', '12mm'),
      bottom: read('--pdf-page-margin-bottom', '12mm'),
      bottomWithFooter: read('--pdf-page-margin-bottom-with-footer', '14mm'),
      left: read('--pdf-page-margin-left', '12mm'),
    };
  });

const buildFooterStyle = (style) => {
  const safe = (value) => (value ? String(value).trim() : '');
  const normalizeFontFamily = (value) =>
    value.replace(/\s+/g, ' ').replace(/\s*,\s*/g, ', ').trim();
  const fontFamily = normalizeFontFamily(safe(style.fontFamily));
  const fontSize = safe(style.fontSize) || '9px';
  const color = safe(style.color) || '#9aa0a6';
  const align = safe(style.align) || 'right';
  const paddingX = safe(style.paddingX) || '18mm';
  const letterSpacing = safe(style.letterSpacing) || '0';
  const fontStyle = safe(style.fontStyle) || 'normal';
  const fontWeight = safe(style.fontWeight) || 'normal';
  return [
    'width: 100%',
    `font-size: ${fontSize}`,
    `color: ${color}`,
    `padding: 0 ${paddingX}`,
    `text-align: ${align}`,
    fontFamily ? `font-family: ${fontFamily}` : '',
    `font-style: ${fontStyle}`,
    `font-weight: ${fontWeight}`,
    `letter-spacing: ${letterSpacing}`,
  ]
    .filter(Boolean)
    .join('; ');
};

const main = async () => {
  const options = parseArgs();
  const themeIds = loadThemeIds();
  validateOptions(options, themeIds);
  const translations = loadTranslations();

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
    options.out = path.resolve(
      process.cwd(),
      'artifacts',
      `resume-${options.lang}-${options.theme}.pdf`
    );
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
    await page.evaluateOnNewDocument(
      (langKey, langValue, themeKey, themeValue) => {
        localStorage.setItem(langKey, langValue);
        localStorage.setItem(themeKey, themeValue);
      },
      LANG_STORAGE_KEY,
      options.lang,
      THEME_STORAGE_KEY,
      options.theme
    );

    await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: options.timeout });
    await page.waitForSelector('[data-testid="resume-content"]', { timeout: options.timeout });
    await waitForFonts(page);
    const fontCheck = await checkFontsAvailability(page);
    if (fontCheck.missing.length > 0) {
      const missingList = fontCheck.missing.join(', ');
      throw new Error(
        `[export-pdf] missing fonts: ${missingList}. ` +
          `body="${fontCheck.bodyFontFamily}", footer="${fontCheck.footerFontFamily}"`
      );
    }

    const pageLayout = await getPdfPageLayout(page);
    let displayHeaderFooter = false;
    let headerTemplate = '<div></div>';
    let footerTemplate = '<div></div>';
    let marginBottom = pageLayout.bottom;

    if (options.footer) {
      const footerMeta = await getFooterPrefix(page);
      const footerStyle = await getFooterStyle(page);
      const footerInlineStyle = buildFooterStyle(footerStyle);
      const footerPrefix = [footerMeta.name, footerMeta.label].filter(Boolean).join(' · ');
      const footerPrefixHtml = footerPrefix
        ? `${escapeHtml(footerPrefix)}&nbsp;&nbsp;&nbsp;&nbsp;`
        : '';
      const footerPageHtml = buildPageLabelHtml(translations, options.lang);

      displayHeaderFooter = true;
      footerTemplate =
        `<div style="${footerInlineStyle}">` +
        footerPrefixHtml +
        footerPageHtml +
        '</div>';
      marginBottom = pageLayout.bottomWithFooter;
    }

    await page.pdf({
      path: options.out,
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: false,
      displayHeaderFooter,
      headerTemplate,
      footerTemplate,
      margin: {
        top: pageLayout.top,
        bottom: marginBottom,
        left: pageLayout.left,
        right: pageLayout.right,
      },
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
