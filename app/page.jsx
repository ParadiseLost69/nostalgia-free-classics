import Link from 'next/link';
import { ButtonLink } from '@/components/ui/Button';
import { PixelIcon } from '@/components/ui/PixelIcon';
import { NewBadge } from '@/components/ui/Badge';
import { ReviewCover, ReviewGrid } from '@/components/reviews/ReviewCard';
import { ScoreBadge } from '@/components/reviews/ScoreBadge';
import { HighScoreTable } from '@/components/reviews/HighScoreTable';
import { getLatestReviews, getRandomReview, getTopScoredReviews } from '@/lib/articles';
import { formatYear, isNew, scoreTier } from '@/lib/format';

// The "random classic" is re-rolled whenever the page regenerates.
export const revalidate = 600;

function FeaturedReview({ review }) {
  return (
    <section aria-labelledby="featured-title" className="group relative grid items-center gap-8 lg:grid-cols-[1fr_1.15fr]">
      <div className="reveal order-2 lg:order-1">
        <p className="eyebrow flex items-center gap-2">
          Latest review {isNew(review.datePosted) && <NewBadge />}
        </p>
        <h1 id="featured-title" className="pixel-heading mt-4 text-xl leading-relaxed text-white sm:text-2xl lg:text-[1.75rem]">
          <Link href={`/reviews/${review.slug}`} className="text-white no-underline hover:text-teal-100">
            {review.title}
          </Link>
        </h1>
        {review.excerpt && <p className="mt-5 max-w-xl text-lg leading-relaxed text-grape-100">{review.excerpt}</p>}
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <ButtonLink href={`/reviews/${review.slug}`}>Read the review ▸</ButtonLink>
          <ButtonLink href="/reviews" variant="plain">
            Browse all
          </ButtonLink>
        </div>
      </div>
      <div className="reveal relative order-1 pb-6 pl-6 [animation-delay:120ms] lg:order-2">
        <Link
          href={`/reviews/${review.slug}`}
          tabIndex={-1}
          aria-hidden="true"
          className="block aspect-[16/9] overflow-hidden no-underline border-2 border-grape-500 shadow-[10px_10px_0_0_theme(colors.grape.700)] transition-shadow group-hover:shadow-[10px_10px_0_0_theme(colors.teal.700)]"
        >
          <ReviewCover review={review} size="lg" priority />
        </Link>
        <div className="absolute bottom-0 left-0 flex origin-bottom-left items-end gap-3 max-sm:scale-75">
          <ScoreBadge score={review.score} size="xl" />
          <span className="mb-1 bg-ink/80 px-2 py-1 font-terminal text-xl uppercase leading-none tracking-widest text-teal-100">
            {scoreTier(review.score).label}
          </span>
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const [latest, top, random] = await Promise.all([getLatestReviews(7), getTopScoredReviews(5), getRandomReview()]);
  const [featured, ...rest] = latest;

  if (!featured) {
    return (
      <div className="surface p-10 text-center">
        <p className="pixel-heading text-lg text-white">No reviews yet</p>
        <p className="mt-3 text-grape-100">The cartridges are still being blown into. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="space-y-20">
      <FeaturedReview review={featured} />

      {rest.length > 0 && (
        <section aria-labelledby="latest-title" className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <h2 id="latest-title" className="section-title flex-1">
              More reviews
            </h2>
            <Link href="/reviews" className="shrink-0 text-sm font-bold no-underline">
              View all ▸
            </Link>
          </div>
          <ReviewGrid reviews={rest} />
        </section>
      )}

      <section aria-label="Leaderboard and random pick" className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <HighScoreTable reviews={top} />

        {random && (
          <div className="surface relative flex flex-col justify-between gap-6 overflow-hidden p-6">
            <div>
              <p className="eyebrow flex items-center gap-2">
                <PixelIcon name="dice" size={14} /> Random classic
              </p>
              <p className="mt-4 font-terminal text-3xl uppercase leading-none text-white">
                {random.gameTitle}
                <span className="text-grape-300"> ({formatYear(random.gameReleaseDate)})</span>
              </p>
              <p className="mt-3 text-sm text-grape-100">
                <Link href={`/reviews/${random.slug}`}>{random.title}</Link>
              </p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <ScoreBadge score={random.score} size="lg" />
              <p className="text-right font-terminal text-lg uppercase leading-tight tracking-widest text-grape-300">
                Insert coin
                <br />
                <span className="text-teal-300">to continue</span>
              </p>
            </div>
          </div>
        )}
      </section>

      <section className="surface relative overflow-hidden p-8 text-center sm:p-12">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgb(20_184_166/0.18),transparent_65%)]" />
        <p className="eyebrow relative">The rules</p>
        <p className="relative mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-grape-50">
          Every game is judged as if it launched <em className="text-teal-300 not-italic">today</em>: same price, same
          patience, same expectations. Some classics still rule. Others were only ever good because you were nine.
        </p>
      </section>
    </div>
  );
}
