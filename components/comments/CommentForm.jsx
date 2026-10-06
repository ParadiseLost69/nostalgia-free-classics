'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { postComment } from '@/lib/actions/comments';
import { COMMENT_MAX_LENGTH } from '@/lib/constants';

/** @param {{ articleId: string }} props */
export function CommentForm({ articleId }) {
  const { status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [body, setBody] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [pending, startTransition] = useTransition();

  if (status === 'loading') return <p className="text-sm">Loading…</p>;

  if (status !== 'authenticated') {
    return (
      <p className="text-sm">
        <Link href={`/login?callbackUrl=${encodeURIComponent(`${pathname}#comments`)}`}>Sign in</Link> to
        leave a comment.
      </p>
    );
  }

  const remaining = COMMENT_MAX_LENGTH - body.length;

  function onSubmit(event) {
    event.preventDefault();
    const text = body.trim();
    if (!text) {
      setMessage({ type: 'error', text: 'Write something first.' });
      return;
    }
    startTransition(async () => {
      const result = await postComment({ articleId, body: text });
      if (result.ok) {
        setBody('');
        setMessage({ type: 'ok', text: 'Comment posted!' });
        router.refresh();
      } else {
        setMessage({ type: 'error', text: result.error });
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2" noValidate>
      <label htmlFor="comment-body" className="field-label">
        Your comment (plain text)
      </label>
      <textarea
        id="comment-body"
        name="body"
        rows={4}
        maxLength={COMMENT_MAX_LENGTH}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        className="field-input"
        aria-describedby="comment-help comment-status"
        required
      />
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p id="comment-help" className="field-hint">
          {remaining} characters left. Be honest, not cruel.
        </p>
        <button type="submit" className="btn-bevel" disabled={pending}>
          {pending ? 'Posting…' : 'Post comment'}
        </button>
      </div>
      <p
        id="comment-status"
        role="status"
        aria-live="polite"
        className={message.type === 'error' ? 'field-error' : 'text-xs font-bold text-teal-700'}
      >
        {message.text}
      </p>
    </form>
  );
}
