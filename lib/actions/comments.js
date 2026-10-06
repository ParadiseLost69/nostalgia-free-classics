'use server';

import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getSession, isAdmin, requireAdmin } from '@/lib/auth';
import { commentSchema, fieldErrors } from '@/lib/validation';
import { sanitizeCommentText } from '@/lib/sanitize';
import { COMMENT_COOLDOWN_SECONDS } from '@/lib/constants';

/**
 * Post a plain-text comment. Signed-in users only, rate limited per user.
 * @param {{ articleId: string, body: string }} input
 * @returns {Promise<{ ok: true } | { ok: false, error: string }>}
 */
export async function postComment(input) {
  const session = await getSession();
  if (!session?.user?.id) return { ok: false, error: 'Sign in to comment.' };

  const parsed = commentSchema.safeParse({
    articleId: input?.articleId,
    body: sanitizeCommentText(input?.body),
  });
  if (!parsed.success) return { ok: false, error: Object.values(fieldErrors(parsed.error))[0] };

  const article = await prisma.article.findFirst({
    where: { id: parsed.data.articleId, status: 'PUBLISHED' },
    select: { id: true, slug: true },
  });
  if (!article) return { ok: false, error: 'That review is not accepting comments.' };

  const since = new Date(Date.now() - COMMENT_COOLDOWN_SECONDS * 1000);
  const recent = await prisma.comment.findFirst({
    where: { authorId: session.user.id, createdAt: { gt: since } },
    select: { createdAt: true },
  });
  if (recent) {
    const wait = Math.ceil(
      (recent.createdAt.getTime() + COMMENT_COOLDOWN_SECONDS * 1000 - Date.now()) / 1000,
    );
    return { ok: false, error: `Slow down! You can comment again in ${Math.max(wait, 1)}s.` };
  }

  await prisma.comment.create({
    data: { body: parsed.data.body, articleId: article.id, authorId: session.user.id },
  });
  revalidatePath(`/reviews/${article.slug}`);
  return { ok: true };
}

/**
 * Delete a comment. Authors may delete their own; admins may delete any.
 * @param {string} commentId
 */
export async function deleteComment(commentId) {
  const session = await getSession();
  if (!session?.user?.id) return { ok: false, error: 'Sign in first.' };

  const comment = await prisma.comment.findUnique({
    where: { id: String(commentId) },
    select: { id: true, authorId: true, article: { select: { slug: true } } },
  });
  if (!comment) return { ok: false, error: 'Comment not found.' };
  if (comment.authorId !== session.user.id && !isAdmin(session)) {
    return { ok: false, error: 'You can only delete your own comments.' };
  }

  await prisma.comment.delete({ where: { id: comment.id } });
  revalidatePath(`/reviews/${comment.article.slug}`);
  revalidatePath('/admin/comments');
  return { ok: true };
}

/**
 * Hide or unhide any comment. Admin only.
 * @param {string} commentId
 * @param {boolean} hidden
 */
export async function setCommentHidden(commentId, hidden) {
  await requireAdmin();
  const comment = await prisma.comment
    .update({
      where: { id: String(commentId) },
      data: { hidden: Boolean(hidden) },
      select: { article: { select: { slug: true } } },
    })
    .catch(() => null);
  if (!comment) return { ok: false, error: 'Comment not found.' };
  revalidatePath(`/reviews/${comment.article.slug}`);
  revalidatePath('/admin/comments');
  return { ok: true };
}
