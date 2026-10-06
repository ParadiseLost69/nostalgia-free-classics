'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAdmin, AuthorizationError } from '@/lib/auth';
import { articleSchema, fieldErrors } from '@/lib/validation';
import { renderArticleHtml } from '@/lib/content';
import { slugify } from '@/lib/format';

/**
 * @typedef {{ ok: true, id: string, slug: string, status: string } | { ok: false, errors: Record<string, string> }} SaveResult
 */

async function uniqueSlug(base, excludeId) {
  const root = base || 'review';
  for (let n = 1; n < 100; n++) {
    const candidate = n === 1 ? root : `${root}-${n}`;
    const clash = await prisma.article.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!clash || clash.id === excludeId) return candidate;
  }
  return `${root}-${Date.now()}`;
}

function revalidatePublicPages() {
  // Home, lists, sidebars, review pages, sitemap and feed all show published data.
  revalidatePath('/', 'layout');
}

/**
 * Create or update an article. Admin only; everything is re-validated here.
 * @param {Record<string, unknown>} input
 * @returns {Promise<SaveResult>}
 */
export async function saveArticle(input) {
  let session;
  try {
    session = await requireAdmin();
  } catch (err) {
    if (err instanceof AuthorizationError) return { ok: false, errors: { form: err.message } };
    throw err;
  }

  const parsed = articleSchema.safeParse(input);
  if (!parsed.success) return { ok: false, errors: fieldErrors(parsed.error) };
  const { id, intent, slug: requestedSlug, ...fields } = parsed.data;

  const existing = id ? await prisma.article.findUnique({ where: { id } }) : null;
  if (id && !existing) return { ok: false, errors: { form: 'Article not found.' } };

  // Slug is editable until the article is first published.
  let slug = existing?.slug;
  if (!existing?.datePosted) {
    if (requestedSlug) {
      const clash = await prisma.article.findUnique({ where: { slug: requestedSlug }, select: { id: true } });
      if (clash && clash.id !== id) return { ok: false, errors: { slug: 'That slug is already taken.' } };
      slug = requestedSlug;
    } else {
      slug = await uniqueSlug(slugify(fields.title), id);
    }
  }

  const publishing = intent === 'publish';
  const data = {
    ...fields,
    slug,
    status: publishing ? 'PUBLISHED' : 'DRAFT',
    // datePosted is set once, the first time the article is published.
    datePosted: existing?.datePosted ?? (publishing ? new Date() : null),
  };

  const saved = existing
    ? await prisma.article.update({ where: { id: existing.id }, data })
    : await prisma.article.create({ data: { ...data, authorId: session.user.id } });

  if (publishing || existing?.status === 'PUBLISHED') {
    revalidatePublicPages();
    if (existing && existing.slug !== saved.slug) revalidatePath(`/reviews/${existing.slug}`);
  }
  revalidatePath('/admin');

  return { ok: true, id: saved.id, slug: saved.slug, status: saved.status };
}

/**
 * Delete an article and its comments. Admin only.
 * @param {string} id
 */
export async function deleteArticle(id) {
  await requireAdmin();
  const article = await prisma.article.delete({ where: { id: String(id) } }).catch(() => null);
  if (!article) return { ok: false, error: 'Article not found.' };
  if (article.status === 'PUBLISHED') revalidatePublicPages();
  revalidatePath('/admin');
  return { ok: true };
}

/**
 * Render editor content exactly as the public page will. Admin only.
 * @param {unknown} content Tiptap JSON
 */
export async function renderPreview(content) {
  await requireAdmin();
  return renderArticleHtml(content);
}
