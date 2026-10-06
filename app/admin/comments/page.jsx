import Link from 'next/link';
import { Panel } from '@/components/ui/Panel';
import { Badge } from '@/components/ui/Badge';
import { CommentModerationActions } from '@/components/admin/CommentModerationActions';
import { prisma } from '@/lib/prisma';
import { formatDateShort } from '@/lib/format';

export const metadata = { title: 'Comments' };

export default async function AdminCommentsPage() {
  const comments = await prisma.comment.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      author: { select: { name: true, email: true } },
      article: { select: { title: true, slug: true } },
    },
  });

  return (
    <Panel title="Recent comments (latest 100)" id="moderation">
      {comments.length === 0 ? (
        <p>No comments yet.</p>
      ) : (
        <ul className="space-y-2">
          {comments.map((c) => (
            <li key={c.id} className={`border-2 p-2 ${c.hidden ? 'border-dashed border-grape-300 bg-grape-50' : 'border-grape-300 bg-white'}`}>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <span>
                  <strong>{c.author.name ?? c.author.email}</strong> on{' '}
                  <Link href={`/reviews/${c.article.slug}#comment-${c.id}`}>{c.article.title}</Link>
                  {' · '}
                  {formatDateShort(c.createdAt)}{' '}
                  {c.hidden && <Badge tone="warn">hidden</Badge>}
                </span>
                <CommentModerationActions id={c.id} hidden={c.hidden} />
              </div>
              <p className="mt-1 whitespace-pre-line break-words text-sm">{c.body}</p>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}
