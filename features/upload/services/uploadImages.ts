/**
 * Upload multiple files to BunnyCDN via the server API.
 * Returns an array of CDN URLs in the same order as the input files.
 * Throws if any upload fails.
 */
export async function uploadImages(
  files: File[],
  directory: string = '/images/properties/'
): Promise<string[]> {
  if (files.length === 0) return [];

  const urls: string[] = [];

  for (const file of files) {
    const form = new FormData();
    form.append('file', file);
    form.append('folder', directory);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: form,
    });

    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json?.error || `Upload échoué pour "${file.name}"`);
    }

    urls.push(json.data.url as string);
  }

  return urls;
}
