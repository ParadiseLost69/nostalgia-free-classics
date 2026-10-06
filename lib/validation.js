import { z } from 'zod';
import { findImages } from './content';
import { COMMENT_MAX_LENGTH } from './constants';

const optionalText = (max) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : null));

const imageUrl = z
  .string()
  .trim()
  .refine((v) => v === '' || /^\/uploads\/[\w.-]+$/.test(v) || /^https:\/\/\S+$/.test(v), {
    message: 'Use an uploaded image or an https:// URL.',
  })
  .optional()
  .transform((v) => (v ? v : null));

const MAX_CONTENT_CHARS = 500_000;

/** A Tiptap document object. */
export const tiptapDocSchema = z
  .object({ type: z.literal('doc'), content: z.array(z.any()).optional() })
  .passthrough();

/*
 * Editor content arrives as a JSON string. ProseMirror builds node attrs with
 * a null prototype, and server actions can't serialize such objects (they
 * reach the server as unreadable references), so the client stringifies.
 */
const tiptapDocJson = z
  .string()
  .max(MAX_CONTENT_CHARS, 'The article is too long.')
  .transform((value, ctx) => {
    try {
      return JSON.parse(value);
    } catch {
      ctx.addIssue({ code: 'custom', message: 'The article content is malformed.' });
      return z.NEVER;
    }
  })
  .pipe(tiptapDocSchema)
  .superRefine((doc, ctx) => {
    const missingAlt = findImages(doc).filter((img) => !img.alt || !String(img.alt).trim());
    if (missingAlt.length) {
      ctx.addIssue({ code: 'custom', message: 'Every image in the article needs alt text.' });
    }
  });

export const articleSchema = z.object({
  id: z.string().optional(),
  intent: z.enum(['draft', 'publish']),
  title: z.string().trim().min(1, 'Title is required.').max(200),
  slug: z
    .string()
    .trim()
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$|^$/, 'Lowercase letters, numbers and dashes only.')
    .optional(),
  gameTitle: z.string().trim().min(1, 'Game title is required.').max(200),
  platform: optionalText(80),
  gameReleaseDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter the original release date.')
    .transform((v) => new Date(`${v}T00:00:00.000Z`))
    .refine((d) => !Number.isNaN(d.getTime()), 'Invalid date.'),
  score: z.coerce
    .number({ error: 'Score must be a number.' })
    .min(0, 'Score must be between 0 and 10.')
    .max(10, 'Score must be between 0 and 10.')
    .refine((n) => Math.abs(n * 10 - Math.round(n * 10)) < 1e-9, 'One decimal place at most.'),
  excerpt: optionalText(400),
  coverImage: imageUrl,
  content: tiptapDocJson,
});

export const commentSchema = z.object({
  articleId: z.string().min(1),
  body: z
    .string()
    .trim()
    .min(1, 'Write something first.')
    .max(COMMENT_MAX_LENGTH, `Comments are limited to ${COMMENT_MAX_LENGTH} characters.`),
});

/**
 * Flatten zod errors to `{ field: message }`.
 * @param {import('zod').ZodError} error
 */
export function fieldErrors(error) {
  /** @type {Record<string, string>} */
  const out = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    out[key] ??= issue.message;
  }
  return out;
}
