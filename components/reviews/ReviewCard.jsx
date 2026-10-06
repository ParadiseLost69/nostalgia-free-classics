import Link from 'next/link';
import { ScoreBadge } from './ScoreBadge';
import { NewBadge, Badge } from '@/components/ui/Badge';
import { formatDateShort, formatYear, isNew } from '@/lib/format';

/**
 * Summary card used on home and list pages.
 * @param {{ review: { title: string, slug: string, excerpt?: string | null, gameTitle: string, platform?: string | null, gameReleaseDate: Date, score: number, datePosted?: Date | null }, headingLevel?: 2 | 3 }} props
 */
export function ReviewCard({ review, headingLevel = 3 }) {
  const Heading = `h${headingLevel}`;
  return (
    <article className="flex gap-3 border-2 border-dotted border-grape-300 bg-white/60 p-3">
      <ScoreBadge score={review.score} size="md" />
      <div className="min-w-0 flex-1">
        <Heading className="text-base font-bold leading-snug">
          <Link href={`/reviews/${review.slug}`}>{review.title}</Link>{' '}
          {isNew(review.datePosted) && <NewBadge />}
        </Heading>
        <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-grape-700">
          <span className="font-bold">{review.gameTitle}</span>
          <span aria-hidden="true">·</span>
          <span>{formatYear(review.gameReleaseDate)}</span>
          {review.platform && <Badge tone="teal">{review.platform}</Badge>}
          {review.datePosted && (
            <>
              <span aria-hidden="true">·</span>
              <span>Reviewed {formatDateShort(review.datePosted)}</span>
            </>
          )}
        </p>
        {review.excerpt && <p className="mt-1.5 text-sm">{review.excerpt}</p>}
      </div>
    </article>
  );
}

/**
 * Compact sidebar entry.
 * @param {{ review: { title: string, slug: string, score: number, gameTitle: string } }} props
 */
export function ReviewListItem({ review }) {
  return (
    <li className="flex items-center gap-2 py-1.5">
      <ScoreBadge score={review.score} size="sm" />
      <Link href={`/reviews/${review.slug}`} className="text-sm leading-tight">
        {review.gameTitle}
      </Link>
    </li>
  );
}
