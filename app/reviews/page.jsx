import { Panel } from '@/components/ui/Panel';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { PublicColumns } from '@/components/layout/PublicColumns';
import { getPlatforms, getReviewsPage } from '@/lib/articles';

export const metadata = {
  title: 'All Reviews',
  description: 'Every classic we have re-reviewed, filterable by score and platform.',
};

const SORTS = [
  { value: 'newest', label: 'Newest reviews' },
  { value: 'score', label: 'Highest score' },
  { value: 'oldest-game', label: 'Oldest games' },
];

const MIN_SCORES = [9, 8, 7, 5];

/** @param {string | string[] | undefined} v */
const first = (v) => (Array.isArray(v) ? v[0] : v);

export default async function ReviewsPage({ searchParams }) {
  const params = await searchParams;
  const platforms = await getPlatforms();

  const platform = platforms.includes(first(params.platform)) ? first(params.platform) : null;
  const minRaw = Number(first(params.min));
  const minScore = MIN_SCORES.includes(minRaw) ? minRaw : null;
  const sort = SORTS.some((s) => s.value === first(params.sort)) ? first(params.sort) : 'newest';
  const page = Math.max(1, Number.parseInt(first(params.page) ?? '1', 10) || 1);

  const { items, total, pageCount } = await getReviewsPage({ page, platform, minScore, sort });

  const hrefFor = (p) => {
    const q = new URLSearchParams();
    if (platform) q.set('platform', platform);
    if (minScore != null) q.set('min', String(minScore));
    if (sort !== 'newest') q.set('sort', sort);
    if (p > 1) q.set('page', String(p));
    const s = q.toString();
    return s ? `/reviews?${s}` : '/reviews';
  };

  return (
    <PublicColumns>
      <Panel title="Filter Reviews" id="filters">
        {/* Plain GET form: works without JavaScript. */}
        <form method="get" action="/reviews" className="grid gap-3 sm:grid-cols-3 sm:items-end">
          <div>
            <label htmlFor="platform" className="field-label">Platform</label>
            <select id="platform" name="platform" defaultValue={platform ?? ''} className="field-input">
              <option value="">All platforms</option>
              {platforms.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="min" className="field-label">Minimum score</label>
            <select id="min" name="min" defaultValue={minScore ?? ''} className="field-input">
              <option value="">Any score</option>
              {MIN_SCORES.map((m) => (
                <option key={m} value={m}>{m}+</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sort" className="field-label">Sort by</label>
            <select id="sort" name="sort" defaultValue={sort} className="field-input">
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2 sm:col-span-3 sm:justify-end">
            <Button type="submit">Go!</Button>
            <ButtonLink href="/reviews" variant="plain">Reset</ButtonLink>
          </div>
        </form>
      </Panel>

      <Panel title={`All Reviews (${total})`} id="all-reviews" bodyClassName="space-y-3">
        {items.length ? (
          items.map((review) => <ReviewCard key={review.id} review={review} headingLevel={3} />)
        ) : (
          <p>No reviews match those filters. Lower your standards (slightly).</p>
        )}
        <Pagination page={Math.min(page, pageCount)} pageCount={pageCount} hrefFor={hrefFor} />
      </Panel>
    </PublicColumns>
  );
}
