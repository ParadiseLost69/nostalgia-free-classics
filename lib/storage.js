import 'server-only';
import { randomUUID } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

/*
 * Image storage abstraction. Development writes to public/uploads and returns
 * a site-relative URL. To move to S3 / Vercel Blob / Cloudinary, replace the
 * body of `saveImage` and keep the same signature.
 *
 * Note: `next start` only serves files that existed in public/ at build time,
 * so local storage is for development only.
 */

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

/** Allowed MIME types mapped to the extension we store. SVG is excluded (can carry scripts). */
export const IMAGE_TYPES = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
  'image/avif': 'avif',
};

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

/** Check magic bytes so a renamed file can't masquerade as an image. */
function sniffType(bytes) {
  const b = bytes;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png';
  if (b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46) return 'image/gif';
  const ascii = (start, end) => String.fromCharCode(...b.subarray(start, end));
  if (ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') return 'image/webp';
  if (ascii(4, 8) === 'ftyp' && ascii(8, 12).startsWith('avi')) return 'image/avif';
  return null;
}

/**
 * Validate and store an uploaded image.
 * @param {File} file
 * @returns {Promise<{ url: string }>}
 */
export async function saveImage(file) {
  if (!file || typeof file.arrayBuffer !== 'function') throw new Error('No file provided.');
  if (file.size === 0) throw new Error('The file is empty.');
  if (file.size > MAX_IMAGE_BYTES) throw new Error('Images must be 4 MB or smaller.');

  const bytes = new Uint8Array(await file.arrayBuffer());
  const type = sniffType(bytes);
  if (!type || !IMAGE_TYPES[type]) {
    throw new Error('Unsupported image type. Use JPEG, PNG, GIF, WebP or AVIF.');
  }

  const name = `${new Date().toISOString().slice(0, 10)}-${randomUUID()}.${IMAGE_TYPES[type]}`;
  await mkdir(UPLOAD_DIR, { recursive: true });
  await writeFile(path.join(UPLOAD_DIR, name), bytes);
  return { url: `/uploads/${name}` };
}
