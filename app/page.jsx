import Link from 'next/link';
import { Panel } from '@/components/ui/Panel';
import { PixelIcon } from '@/components/ui/PixelIcon';
import { ButtonLink } from '@/components/ui/Button';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { ScoreBadge } from '@/components/reviews/ScoreBadge';
import { PublicColumns } from '@/components/layout/PublicColumns';
import { getLatestReviews, getRandomReview } from '@/lib/articles';
import { formatYear } from '@/lib/format';

// The "random classic" is re-rolled whenever the page regenerates.
export const revalidate = 600;

export default async function HomePage() {
  const [latest, random] = await Promise.all([getLatestReviews(6), getRandomReview()]);

  return (
    <PublicColumns>
      <Panel title="Welcome, traveller" icon={<PixelIcon name="heart" className="text-teal-300" />} id="welcome">
        <p>
          Every game here gets judged as if it launched <em>today</em>: same price, same patience,
          same expectations. Some classics still rule. Others were only ever good because you were
          nine.
        </p>
      </Panel>

      {random && (
        <Panel title="Random Classic" icon={<PixelIcon name="dice" className="text-teal-300" />} id="random">
          <div className="flex items-center gap-4">
            <ScoreBadge score={random.score} size="md" />
            <div className="min-w-0 flex-1">
              <p className="font-terminal text-xl leading-none text-grape-700">
                {random.gameTitle} ({formatYear(random.gameReleaseDate)})
              </p>
              <p className="mt-1 font-bold">
                <Link href={`/reviews/${random.slug}`}>{random.title}</Link>
              </p>
            </div>
          </div>
        </Panel>
      )}

      <Panel
        title="Latest Reviews"
        icon={<PixelIcon name="scroll" className="text-teal-300" />}
        id="latest"
        bodyClassName="space-y-3"
      >
        {latest.length ? (
          latest.map((review) => <ReviewCard key={review.id} review={review} />)
        ) : (
          <p>No reviews yet. The cartridges are still being blown into.</p>
        )}
        <div className="text-right">
          <ButtonLink href="/reviews">All reviews »</ButtonLink>
        </div>
      </Panel>
    </PublicColumns>
  );
}
