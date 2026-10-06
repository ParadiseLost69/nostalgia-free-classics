import Link from 'next/link';
import { formatScore, scoreTier } from '@/lib/format';

const SLOTS = 5;
const RANK_LABELS = ['1ST', '2ND', '3RD', '4TH', '5TH', '6TH', '7TH', '8TH', '9TH', '10TH'];
const TIER_TEXT = {
  great: 'text-teal-300',
  good: 'text-teal-100',
  mixed: 'text-yellow-300',
  bad: 'text-rose-300',
};

/**
 * Arcade-style "HI-SCORES" leaderboard of the highest-rated reviews.
 * @param {{ reviews: Array<{ id: string, slug: string, gameTitle: string, score: number }> }} props
 */
export function HighScoreTable({ reviews }) {
  return (
    <div className="surface relative overflow-hidden p-5 sm:p-6">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgb(123_63_228/0.35),transparent_70%)]" />
      <h2 className="relative text-center font-pixel text-sm text-yellow-300 drop-shadow-[2px_2px_0_theme(colors.grape.700)] sm:text-base">
        HI-SCORES
      </h2>
      {reviews.length ? (
        <ol className="relative mt-5 space-y-1 font-terminal text-xl leading-tight sm:text-2xl">
          {reviews.map((r, i) => (
            <li key={r.id} className="grid grid-cols-[3.5rem_1fr_auto] items-baseline gap-3">
              <span className="text-grape-300">{RANK_LABELS[i]}</span>
              <Link
                href={`/reviews/${r.slug}`}
                className="truncate uppercase text-white no-underline hover:text-teal-300"
              >
                {r.gameTitle}
              </Link>
              <span className={`${TIER_TEXT[scoreTier(r.score).tier]} tabular-nums`}>{formatScore(r.score)}</span>
            </li>
          ))}
          {/* Arcade tables always show every slot; empty ones are dashes. */}
          {Array.from({ length: Math.max(0, SLOTS - reviews.length) }, (_, i) => (
            <li key={`empty-${i}`} aria-hidden="true" className="grid grid-cols-[3.5rem_1fr_auto] items-baseline gap-3 text-grape-500">
              <span>{RANK_LABELS[reviews.length + i]}</span>
              <span>---</span>
              <span>-.-</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="relative mt-4 text-center font-terminal text-xl text-grape-300">NO SCORES YET</p>
      )}
    </div>
  );
}
