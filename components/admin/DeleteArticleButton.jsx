'use client';

import { useState, useTransition } from 'react';
import { deleteArticle } from '@/lib/actions/articles';

/** @param {{ id: string, title: string }} props */
export function DeleteArticleButton({ id, title }) {
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');
  const [pending, startTransition] = useTransition();

  if (!confirming) {
    return (
      <button
        type="button"
        className="btn-bevel btn-plain px-1.5 py-0 text-xs"
        onClick={() => setConfirming(true)}
        aria-label={`Delete “${title}”`}
      >
        Delete
      </button>
    );
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-1">
      <button
        type="button"
        className="btn-bevel btn-grape px-1.5 py-0 text-xs"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const result = await deleteArticle(id);
            if (!result.ok) setError(result.error);
          })
        }
      >
        {pending ? 'Deleting…' : 'Confirm delete'}
      </button>
      <button type="button" className="btn-bevel btn-plain px-1.5 py-0 text-xs" onClick={() => setConfirming(false)}>
        Cancel
      </button>
      {error && (
        <span role="alert" className="text-xs font-bold text-red-700">
          {error}
        </span>
      )}
    </span>
  );
}
