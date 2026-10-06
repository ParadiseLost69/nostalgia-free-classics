'use client';

import { useState, useTransition } from 'react';
import { deleteComment, setCommentHidden } from '@/lib/actions/comments';

/** @param {{ id: string, hidden: boolean }} props */
export function CommentModerationActions({ id, hidden }) {
  const [pending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');

  const run = (action) =>
    startTransition(async () => {
      setError('');
      const result = await action();
      if (!result?.ok) setError(result?.error ?? 'Something went wrong.');
      setConfirming(false);
    });

  return (
    <span className="flex flex-wrap items-center gap-1">
      <button
        type="button"
        className="btn-bevel btn-plain px-1.5 py-0 text-xs"
        disabled={pending}
        onClick={() => run(() => setCommentHidden(id, !hidden))}
      >
        {hidden ? 'Unhide' : 'Hide'}
      </button>
      {confirming ? (
        <>
          <button
            type="button"
            className="btn-bevel btn-grape px-1.5 py-0 text-xs"
            disabled={pending}
            onClick={() => run(() => deleteComment(id))}
          >
            Confirm delete
          </button>
          <button type="button" className="btn-bevel btn-plain px-1.5 py-0 text-xs" onClick={() => setConfirming(false)}>
            Cancel
          </button>
        </>
      ) : (
        <button type="button" className="btn-bevel btn-plain px-1.5 py-0 text-xs" onClick={() => setConfirming(true)}>
          Delete
        </button>
      )}
      {error && (
        <span role="alert" className="text-xs font-bold text-red-700">
          {error}
        </span>
      )}
    </span>
  );
}
