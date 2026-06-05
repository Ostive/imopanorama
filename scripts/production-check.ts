import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

type CheckStatus = 'pass' | 'warn' | 'fail';

type CheckResult = {
  status: CheckStatus;
  label: string;
  detail?: string;
};

const root = join(__dirname, '..');

function loadLocalEnv() {
  const envPath = join(root, '.env');
  if (!existsSync(envPath)) return;

  const lines = readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = rawValue.replace(/^["']|["']$/g, '');

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadLocalEnv();

const requiredEnv = [
  'DATABASE_URL',
  'BETTER_AUTH_SECRET',
  'BETTER_AUTH_URL',
  'NEXT_PUBLIC_APP_URL',
  'BUNNYCDN_STORAGE_ZONE_NAME',
  'BUNNYCDN_API_KEY',
  'BUNNYCDN_PULL_ZONE_URL',
  'NEXT_PUBLIC_BUNNYCDN_PULL_ZONE_URL',
];

const recommendedEnv = [
  'REDIS_URL',
  'OPENAI_API_KEY',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASS',
  'NEXT_PUBLIC_RECAPTCHA_SITE_KEY',
  'RECAPTCHA_SECRET_KEY',
  'NEXT_PUBLIC_UMAMI_URL',
  'NEXT_PUBLIC_UMAMI_WEBSITE_ID',
];

const placeholderImages = [
  'public/images/properties/property-placeholder.jpg',
  'public/images/properties/featured/property-1.jpg',
  'public/images/properties/featured/property-2.jpg',
  'public/images/properties/featured/property-3.jpg',
  'public/images/properties/featured/property-4.jpg',
  'public/images/properties/featured/property-5.jpg',
  'public/images/properties/featured/property-6.jpg',
  'public/images/seo/cities/antananarivo.jpg',
  'public/images/seo/cities/tamatave.jpg',
  'public/images/seo/cities/majunga.jpg',
  'public/images/seo/cities/fianarantsoa.jpg',
  'public/images/seo/cities/nosy-be.jpg',
  'public/images/seo/cities/diego-suarez.jpg',
  'public/images/batipanorama/project-placeholder.jpg',
  'public/images/news/news-1.jpg',
  'public/images/news/news-2.jpg',
  'public/images/news/news-3.jpg',
];

function isPlaceholderSized(path: string): boolean {
  const fullPath = join(root, path);
  if (!existsSync(fullPath)) return false;
  const size = statSync(fullPath).size;
  return size > 0 && size < 50_000;
}

function checkEnv(names: string[], strict: boolean): CheckResult {
  const missing = names.filter((name) => !process.env[name]);
  if (missing.length === 0) {
    return { status: 'pass', label: strict ? 'Variables critiques' : 'Variables recommandees' };
  }

  return {
    status: strict ? 'fail' : 'warn',
    label: strict ? 'Variables critiques' : 'Variables recommandees',
    detail: missing.join(', '),
  };
}

function checkFile(path: string, label: string): CheckResult {
  return existsSync(join(root, path))
    ? { status: 'pass', label }
    : { status: 'fail', label, detail: path };
}

function checkDirectory(path: string, label: string): CheckResult {
  const fullPath = join(root, path);
  if (!existsSync(fullPath)) return { status: 'fail', label, detail: `${path} introuvable` };

  const hasFiles = readdirSync(fullPath).some((entry) => {
    const entryPath = join(fullPath, entry);
    return statSync(entryPath).isFile();
  });

  return hasFiles
    ? { status: 'pass', label }
    : { status: 'warn', label, detail: `${path} ne contient pas encore de fichier` };
}

function checkImages(): CheckResult {
  const likelyPlaceholders = placeholderImages.filter(isPlaceholderSized);

  if (likelyPlaceholders.length === 0) {
    return { status: 'pass', label: 'Images publiques remplacees' };
  }

  return {
    status: 'warn',
    label: 'Images publiques encore placeholders',
    detail: likelyPlaceholders.slice(0, 8).join(', ') + (likelyPlaceholders.length > 8 ? '...' : ''),
  };
}

const results: CheckResult[] = [
  checkEnv(requiredEnv, true),
  checkEnv(recommendedEnv, false),
  checkFile('public/robots.txt', 'robots.txt'),
  checkFile('app/sitemap.ts', 'sitemap dynamique'),
  checkFile('app/api/health/route.ts', 'endpoint /api/health'),
  checkFile('docs/PRODUCTION_READINESS.md', 'checklist production'),
  checkDirectory('public/images/properties/featured', 'dossier photos de biens'),
  checkDirectory('public/images/seo/cities', 'dossier photos SEO villes'),
  checkImages(),
];

const symbolByStatus: Record<CheckStatus, string> = {
  pass: '[OK]',
  warn: '[WARN]',
  fail: '[FAIL]',
};

for (const result of results) {
  const detail = result.detail ? ` - ${result.detail}` : '';
  console.log(`${symbolByStatus[result.status]} ${result.label}${detail}`);
}

const failed = results.filter((result) => result.status === 'fail');
const warned = results.filter((result) => result.status === 'warn');

console.log('');
console.log(`Production check: ${failed.length} fail, ${warned.length} warn, ${results.length - failed.length - warned.length} pass`);

if (failed.length > 0) {
  process.exitCode = 1;
}
