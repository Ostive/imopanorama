const ALLOWED_STORAGE_ROOTS = ['/images/', '/uploads/', '/news/', '/properties/', '/documents/'] as const;

function normalizeSlashes(path: string): string {
  return path.replace(/\\/g, '/').replace(/\/+/g, '/');
}

export function sanitizeStoragePath(input: string, options: { directory?: boolean } = {}): string {
  const raw = normalizeSlashes(input.trim());
  if (!raw || raw.includes('\0') || raw.includes('..')) {
    throw new Error('Chemin de stockage invalide');
  }

  let path = raw.startsWith('/') ? raw : `/${raw}`;
  if (options.directory && !path.endsWith('/')) path += '/';

  const isAllowed = ALLOWED_STORAGE_ROOTS.some(root => path === root || path.startsWith(root));
  if (!isAllowed) {
    throw new Error('Chemin de stockage non autorise');
  }

  return path;
}

export function sanitizeStorageDirectory(input: string): string {
  return sanitizeStoragePath(input, { directory: true });
}

export function stripStorageBaseUrl(input: string, pullZoneUrl?: string): string {
  if (!pullZoneUrl) return input;
  return input.startsWith(pullZoneUrl) ? input.replace(pullZoneUrl, '') : input;
}
