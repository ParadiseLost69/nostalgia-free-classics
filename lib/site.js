/** Absolute site origin, used for metadata, the sitemap and the RSS feed. */
export const siteUrl = (process.env.SITE_URL || 'http://localhost:3000').replace(/\/+$/, '');

/** @param {string} path */
export function absoluteUrl(path) {
  if (!path) return siteUrl;
  if (/^https?:\/\//.test(path)) return path;
  return `${siteUrl}${path.startsWith('/') ? '' : '/'}${path}`;
}
