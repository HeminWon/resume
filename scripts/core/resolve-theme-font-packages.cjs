const fs = require('fs');
const path = require('path');

const THEMES_DIR = path.resolve(__dirname, '..', '..', 'src', 'themes');

const readFontsConfig = (filePath) => {
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
};

const main = () => {
  if (!fs.existsSync(THEMES_DIR)) {
    process.stdout.write('');
    return;
  }

  const packages = new Set();
  const entries = fs.readdirSync(THEMES_DIR, { withFileTypes: true });

  entries.forEach((entry) => {
    if (!entry.isDirectory()) {
      return;
    }
    const configPath = path.join(THEMES_DIR, entry.name, 'fonts.json');
    if (!fs.existsSync(configPath)) {
      return;
    }
    const config = readFontsConfig(configPath);
    const list = Array.isArray(config.aptPackages) ? config.aptPackages : [];
    list.forEach((pkg) => {
      if (typeof pkg === 'string' && pkg.trim()) {
        packages.add(pkg.trim());
      }
    });
  });

  process.stdout.write(Array.from(packages).join(' '));
};

try {
  main();
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[fonts] failed to resolve theme packages: ${message}`);
  process.exit(1);
}
