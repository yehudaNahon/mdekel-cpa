import { readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = new URL("../", import.meta.url);
const messagesDirectory = new URL("messages/", projectRoot);
const sourceDirectory = fileURLToPath(new URL("src/", projectRoot));
const settingsPath = new URL("project.inlang/settings.json", projectRoot);
const sourceExtensions = new Set([
  ".astro",
  ".cjs",
  ".js",
  ".jsx",
  ".mdx",
  ".mjs",
  ".svelte",
  ".ts",
  ".tsx",
  ".vue",
]);

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function collectMessageKeys(value, prefix = "") {
  const keys = [];

  for (const [key, child] of Object.entries(value)) {
    if (key.startsWith("$")) continue;

    const messageKey = prefix ? `${prefix}.${key}` : key;
    if (child !== null && typeof child === "object" && !Array.isArray(child)) {
      keys.push(...collectMessageKeys(child, messageKey));
    } else {
      keys.push(messageKey);
    }
  }

  return keys;
}

function collectSourceFiles(directory) {
  const files = [];

  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === "paraglide") continue;

    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectSourceFiles(path));
    } else if (sourceExtensions.has(extname(entry.name))) {
      files.push(path);
    }
  }

  return files;
}

function printKeys(label, keys) {
  console.error(`${label}:`);
  for (const key of keys) console.error(`  - ${key}`);
}

const settings = readJson(settingsPath);
const locales = settings.locales;
const baseLocale = settings.baseLocale;

if (!Array.isArray(locales) || !locales.includes(baseLocale)) {
  throw new Error(
    "project.inlang/settings.json must define locales containing baseLocale.",
  );
}

const catalogKeys = new Map(
  locales.map((locale) => {
    const catalog = readJson(new URL(`${locale}.json`, messagesDirectory));
    return [locale, new Set(collectMessageKeys(catalog))];
  }),
);
const baseKeys = catalogKeys.get(baseLocale);
let failed = false;

for (const [locale, keys] of catalogKeys) {
  const missing = [...baseKeys].filter((key) => !keys.has(key)).sort();
  const extra = [...keys].filter((key) => !baseKeys.has(key)).sort();

  if (missing.length > 0) {
    printKeys(`${locale}.json is missing keys`, missing);
    failed = true;
  }
  if (extra.length > 0) {
    printKeys(`${locale}.json has keys missing from ${baseLocale}.json`, extra);
    failed = true;
  }
}

const usedKeys = new Set();
const messageImportPattern =
  /import\s*\{\s*m\s*\}\s*from\s*["'][^"']*paraglide\/messages\.js["']/;
const dotReferencePattern = /\bm((?:\.[A-Za-z_$][\w$]*)+)(?![\w.[\]])/g;
const bracketReferencePattern = /\bm\s*\[\s*["']([^"']+)["']\s*\]/g;

for (const path of collectSourceFiles(sourceDirectory)) {
  const source = readFileSync(path, "utf8");
  if (!messageImportPattern.test(source)) continue;

  for (const match of source.matchAll(dotReferencePattern)) {
    usedKeys.add(match[1].slice(1));
  }
  for (const match of source.matchAll(bracketReferencePattern)) {
    usedKeys.add(match[1]);
  }
}

const unused = [...baseKeys].filter((key) => !usedKeys.has(key)).sort();
const unknown = [...usedKeys].filter((key) => !baseKeys.has(key)).sort();

if (unused.length > 0) {
  printKeys("Unused translation keys", unused);
  failed = true;
}
if (unknown.length > 0) {
  printKeys(`References missing from ${baseLocale}.json`, unknown);
  failed = true;
}

if (failed) process.exit(1);

console.log(
  `Translations OK: ${baseKeys.size} keys across ${locales.length} locales.`,
);
