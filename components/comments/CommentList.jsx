import { CommentActions } from './CommentActions';
import { formatDate } from '@/lib/format';

/**
 * Visible comments for a review. Server component; only the per-comment
 * controls are client-side (they depend on who is signed in).
 * @param {{ comments: Array<{ id: string, body: string, createdAt: Date, author: { id: string, name: string | null } }> }} props
 */
export function CommentList({ comments }) {
  if (!comments.length) {
    return <p className="text-sm">No comments yet. Be the first to disagree.</p>;
  }
  return (
    <ol className="space-y-3">
      {comments.map((comment, i) => (
        <li key={comment.id} id={`comment-${comment.id}`} className="border-2 border-grape-300 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dotted border-grape-300 bg-grape-50 px-2 py-1 text-xs">
            <span>
              <span className="font-terminal text-base text-grape-500">#{i + 1}</span>{' '}
              <strong className="text-grape-900">{comment.author.name ?? 'Anonymous player'}</strong>{' '}
              <span className="text-grape-700">
                on <time dateTime={comment.createdAt.toISOString()}>{formatDate(comment.createdAt)}</time>
              </span>
            </span>
            <CommentActions commentId={comment.id} authorId={comment.author.id} />
          </div>
          <p className="whitespace-pre-line break-words px-3 py-2 text-sm">{comment.body}</p>
        </li>
      ))}
    </ol>
  );
}
