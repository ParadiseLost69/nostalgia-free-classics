import Link from 'next/link';
import { Pagination } from '@/components/ui/Pagination';
import { ReviewGrid } from '@/components/reviews/ReviewCard';
import { getPlatforms, getReviewsPage } from '@/lib/articles';

export const metadata = {
  title: 'All Reviews',
  description: 'Every classic we have re-reviewed, filterable by score and platform.',
};

const SORTS = [
  { value: 'newest', label: 'Newest' },
  { value: 'score', label: 'Top rated' },
  { value: 'oldest-game', label: 'Oldest games' },
];

const MIN_SCORES = [9, 8, 7, 5];

/** @param {string | string[] | undefined} v */
const first = (v) => (Array.isArray(v) ? v[0] : v);

/**
 * Filter group rendered as links, so filtering works without JavaScript.
 * @param {{ label: string, options: Array<{ key: string, label: string, href: string, active: boolean }> }} props
 */
function ChipGroup({ label, options }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <span className="eyebrow w-24 shrink-0 text-base text-grape-300">{label}</span>
      <ul className="flex flex-wrap gap-2">
        {options.map((o) => (
          <li key={o.key}>
            <Link href={o.href} className="chip" aria-current={o.active ? 'true' : undefined} scroll={false}>
              {o.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function ReviewsPage({ searchParams }) {
  const params = await searchParams;
  const platforms = await getPlatforms();

  const platform = platforms.includes(first(params.platform)) ? first(params.platform) : null;
  const minRaw = Number(first(params.min));
  const minScore = MIN_SCORES.includes(minRaw) ? minRaw : null;
  const sort = SORTS.some((s) => s.value === first(params.sort)) ? first(params.sort) : 'newest';
  const page = Math.max(1, Number.parseInt(first(params.page) ?? '1', 10) || 1);

  const { items, total, pageCount } = await getReviewsPage({ page, platform, minScore, sort });

  /** Build a URL from the current filters with overrides; filter changes reset to page 1. */
  const hrefWith = (overrides) => {
    const next = { platform, min: minScore, sort, page: 1, ...overrides };
    const q = new URLSearchParams();
    if (next.platform) q.set('platform', next.platform);
    if (next.min != null) q.set('min', String(next.min));
    if (next.sort && next.sort !== 'newest') q.set('sort', next.sort);
    if (next.page > 1) q.set('page', String(next.page));
    const s = q.toString();
    return s ? `/reviews?${s}` : '/reviews';
  };

  const filtered = platform || minScore != null;
  const heading = sort === 'score' ? 'Top rated' : 'All reviews';

  return (
    <div className="space-y-10">
      <header className="reveal">
        <p className="eyebrow">The archive</p>
        <h1 className="pixel-heading mt-3 text-xl text-white sm:text-2xl">{heading}</h1>
        <p className="mt-3 text-grape-100">
          {total} {total === 1 ? 'review' : 'reviews'}
          {filtered && ' match your filters'}.{' '}
          {filtered && (
            <Link href={hrefWith({ platform: null, min: null })} className="font-bold">
              Clear filters
            </Link>
          )}
        </p>
      </header>

      <section aria-label="Filter and sort" className="surface space-y-3 p-4 sm:p-5">
        <ChipGroup
          label="Sort"
          options={SORTS.map((s) => ({ key: s.value, label: s.label, href: hrefWith({ sort: s.value }), active: sort === s.value }))}
        />
        <ChipGroup
          label="Platform"
          options={[
            { key: 'all', label: 'All', href: hrefWith({ platform: null }), active: !platform },
            ...platforms.map((p) => ({ key: p, label: p, href: hrefWith({ platform: p }), active: platform === p })),
          ]}
        />
        <ChipGroup
          label="Score"
          options={[
            { key: 'any', label: 'Any', href: hrefWith({ min: null }), active: minScore == null },
            ...MIN_SCORES.map((m) => ({ key: String(m), label: `${m}+`, href: hrefWith({ min: m }), active: minScore === m })),
          ]}
        />
      </section>

      {items.length ? (
        <ReviewGrid reviews={items} headingLevel={2} />
      ) : (
        <div className="surface p-10 text-center">
          <p className="font-terminal text-3xl uppercase text-white">No matches</p>
          <p className="mt-2 text-grape-100">Lower your standards (slightly) and try again.</p>
        </div>
      )}

      <Pagination page={Math.min(page, pageCount)} pageCount={pageCount} hrefFor={(p) => hrefWith({ page: p })} />
    </div>
  );
}
