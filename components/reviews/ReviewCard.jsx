import Link from 'next/link';
import { ScoreBadge } from './ScoreBadge';
import { TitleScreen } from './TitleScreen';
import { NewBadge } from '@/components/ui/Badge';
import { formatDateShort, formatYear, isNew } from '@/lib/format';

/**
 * @typedef {{ id: string, title: string, slug: string, excerpt?: string | null, coverImage?: string | null,
 *   gameTitle: string, platform?: string | null, gameReleaseDate: Date, score: number, datePosted?: Date | null }} ReviewSummary
 */

/**
 * Cover art, or a generated title screen when there isn't any.
 * Cards pass no alt (the title link names the game); the review hero does.
 */
export function ReviewCover({ review, size = 'md', priority = false, alt = '' }) {
  if (review.coverImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={review.coverImage}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
    );
  }
  return (
    <TitleScreen
      gameTitle={review.gameTitle}
      platform={review.platform}
      gameReleaseDate={review.gameReleaseDate}
      size={size}
      className="transition-transform duration-500 group-hover:scale-[1.03]"
    />
  );
}

/**
 * Grid card with cover art. The whole card is clickable via the title link.
 * @param {{ review: ReviewSummary, headingLevel?: 2 | 3, index?: number }} props
 */
export function ReviewCard({ review, headingLevel = 3, index = 0 }) {
  const Heading = `h${headingLevel}`;
  return (
    <article
      className="surface card-interactive reveal group relative flex w-full flex-col"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <div className="relative">
        <div className="aspect-[16/9] overflow-hidden border-b border-grape-700/70">
          <ReviewCover review={review} />
        </div>
        {isNew(review.datePosted) && (
          <span className="absolute left-3 top-3">
            <NewBadge />
          </span>
        )}
        <ScoreBadge score={review.score} size="md" className="absolute bottom-0 right-3 translate-y-1/2" />
      </div>

      <div className="flex flex-1 flex-col p-4 pt-3">
        <p className="eyebrow pr-16 text-base">
          {review.gameTitle} · {formatYear(review.gameReleaseDate)}
        </p>
        <Heading className="mt-1.5 text-base font-bold leading-snug text-white">
          <Link href={`/reviews/${review.slug}`} className="text-white no-underline after:absolute after:inset-0 hover:text-teal-100">
            {review.title}
          </Link>
        </Heading>
        {review.excerpt && <p className="mt-2 line-clamp-3 text-sm text-grape-100/90">{review.excerpt}</p>}
        <div className="mt-auto flex flex-wrap items-center gap-2 pt-4 text-xs text-grape-300">
          {review.platform && (
            <span className="border border-grape-500/60 px-1.5 py-0.5 font-bold uppercase tracking-wide text-grape-100">
              {review.platform}
            </span>
          )}
          {review.datePosted && <span>Reviewed {formatDateShort(review.datePosted)}</span>}
        </div>
      </div>
    </article>
  );
}

/**
 * Responsive card grid.
 * @param {{ reviews: ReviewSummary[], headingLevel?: 2 | 3 }} props
 */
export function ReviewGrid({ reviews, headingLevel = 3 }) {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {reviews.map((review, i) => (
        <li key={review.id} className="flex">
          <ReviewCard review={review} headingLevel={headingLevel} index={i} />
        </li>
      ))}
    </ul>
  );
}
