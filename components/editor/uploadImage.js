/**
 * Upload an image through the admin-only API route.
 * @param {File} file
 * @returns {Promise<string>} public URL
 */
export async function uploadImage(file) {
  const body = new FormData();
  body.append('file', file);
  const res = await fetch('/api/upload', { method: 'POST', body });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? 'Upload failed.');
  return data.url;
}
