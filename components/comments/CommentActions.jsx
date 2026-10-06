'use client';

import { useState, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { deleteComment, setCommentHidden } from '@/lib/actions/comments';

/**
 * Delete (own comment or admin) and hide (admin) controls. The server
 * re-checks permissions; this only decides which buttons to show.
 * @param {{ commentId: string, authorId: string }} props
 */
export function CommentActions({ commentId, authorId }) {
  const { data: session } = useSession();
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');

  const userId = session?.user?.id;
  const isAdmin = session?.user?.role === 'ADMIN';
  if (!userId || (userId !== authorId && !isAdmin)) return null;

  const run = (action) =>
    startTransition(async () => {
      setError('');
      const result = await action();
      if (!result?.ok) setError(result?.error ?? 'Something went wrong.');
      setConfirming(false);
    });

  return (
    <span className="flex items-center gap-1">
      {error && (
        <span role="alert" className="font-bold text-red-700">
          {error}
        </span>
      )}
      {isAdmin && (
        <button
          type="button"
          className="btn-bevel btn-plain px-1.5 py-0 text-xs"
          disabled={pending}
          onClick={() => run(() => setCommentHidden(commentId, true))}
        >
          Hide
        </button>
      )}
      {confirming ? (
        <>
          <button
            type="button"
            className="btn-bevel btn-grape px-1.5 py-0 text-xs"
            disabled={pending}
            onClick={() => run(() => deleteComment(commentId))}
          >
            {pending ? 'Deleting…' : 'Really delete'}
          </button>
          <button type="button" className="btn-bevel btn-plain px-1.5 py-0 text-xs" onClick={() => setConfirming(false)}>
            Cancel
          </button>
        </>
      ) : (
        <button
          type="button"
          className="btn-bevel btn-plain px-1.5 py-0 text-xs"
          disabled={pending}
          onClick={() => setConfirming(true)}
        >
          Delete
        </button>
      )}
    </span>
  );
}
