import { Panel } from '@/components/ui/Panel';
import { PixelIcon } from '@/components/ui/PixelIcon';
import { ReviewListItem } from '@/components/reviews/ReviewCard';
import { getLatestReviews, getTopScoredReviews } from '@/lib/articles';

function SidebarList({ reviews }) {
  if (!reviews.length) return <p className="text-sm">Nothing yet.</p>;
  return (
    <ul className="divide-y divide-dotted divide-grape-300">
      {reviews.map((r) => (
        <ReviewListItem key={r.id} review={r} />
      ))}
    </ul>
  );
}

export async function RightSidebar() {
  const [latest, top] = await Promise.all([getLatestReviews(5), getTopScoredReviews(5)]);
  return (
    <aside aria-label="Review highlights" className="space-y-4">
      <Panel title="Latest Reviews" icon={<PixelIcon name="scroll" className="text-teal-300" />} id="side-latest">
        <SidebarList reviews={latest} />
      </Panel>
      <Panel title="Highest Scored" icon={<PixelIcon name="star" className="text-teal-300" />} id="side-top">
        <SidebarList reviews={top} />
      </Panel>
    </aside>
  );
}
