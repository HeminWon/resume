#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yaml = require('yaml');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'data');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

const sources = [
  { lang: 'zh', input: path.join(DATA_DIR, 'resume-zh.yaml'), output: path.join(PUBLIC_DIR, 'resume-zh.json') },
  { lang: 'en', input: path.join(DATA_DIR, 'resume-en.yaml'), output: path.join(PUBLIC_DIR, 'resume-en.json') },
];

const readYaml = (filePath) => {
  const raw = fs.readFileSync(filePath, 'utf8');
  return yaml.parse(raw);
};

const ensureValid = (lang, data) => {
  if (!data || typeof data !== 'object') {
    throw new Error(`[prepare] ${lang} resume data is empty or invalid`);
  }
};

for (const item of sources) {
  if (!fs.existsSync(item.input)) {
    throw new Error(`[prepare] missing source file: ${item.input}`);
  }
  const data = readYaml(item.input);
  ensureValid(item.lang, data);
  const json = JSON.stringify(data, null, 2);
  fs.writeFileSync(item.output, json, 'utf8');
  console.log(`[prepare] ${item.lang} -> ${path.relative(ROOT_DIR, item.output)}`);
}

console.log('[prepare] resume data prepared');
