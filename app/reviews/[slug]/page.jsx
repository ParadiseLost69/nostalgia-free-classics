import { cache } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PixelIcon } from '@/components/ui/PixelIcon';
import { ReviewArticle } from '@/components/reviews/ReviewArticle';
import { ScoreBadge } from '@/components/reviews/ScoreBadge';
import { CommentList } from '@/components/comments/CommentList';
import { CommentForm } from '@/components/comments/CommentForm';
import { getLatestReviews, getPublishedReview, getPublishedSlugs } from '@/lib/articles';
import { renderArticleHtml, plainTextExcerpt } from '@/lib/content';

const getReview = cache((slug) => getPublishedReview(slug));

export async function generateStaticParams() {
  const slugs = await getPublishedSlugs();
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const review = await getReview(slug);
  if (!review) return { title: 'Review not found' };

  const description = review.excerpt || plainTextExcerpt(review.content, 160);
  return {
    title: review.title,
    description,
    alternates: { canonical: `/reviews/${review.slug}` },
    openGraph: {
      type: 'article',
      title: review.title,
      description,
      url: `/reviews/${review.slug}`,
      publishedTime: review.datePosted?.toISOString(),
      modifiedTime: review.dateUpdated.toISOString(),
      images: review.coverImage ? [{ url: review.coverImage, alt: `Cover art for ${review.gameTitle}` }] : undefined,
    },
    twitter: { card: review.coverImage ? 'summary_large_image' : 'summary' },
  };
}

function MoreReviews({ reviews }) {
  if (!reviews.length) return null;
  return (
    <nav aria-label="More reviews" className="surface p-5">
      <p className="eyebrow">Keep reading</p>
      <ul className="mt-3 divide-y divide-dotted divide-grape-700">
        {reviews.map((r) => (
          <li key={r.id} className="flex items-center gap-3 py-2.5">
            <ScoreBadge score={r.score} size="sm" />
            <Link href={`/reviews/${r.slug}`} className="text-sm font-bold leading-snug text-grape-50 no-underline hover:text-teal-300">
              {r.gameTitle}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default async function ReviewPage({ params }) {
  const { slug } = await params;
  const review = await getReview(slug);
  if (!review) notFound();

  const [html, latest] = [renderArticleHtml(review.content), await getLatestReviews(4)];
  const more = latest.filter((r) => r.slug !== review.slug).slice(0, 3);

  return (
    <ReviewArticle article={review} authorName={review.author.name} html={html} aside={<MoreReviews reviews={more} />}>
      <section id="comments" aria-labelledby="comments-title" className="panel">
        <div className="title-bar">
          <PixelIcon name="comment" className="text-teal-300" />
          <h2 id="comments-title" className="flex-1">
            Comments ({review.comments.length})
          </h2>
        </div>
        <div className="panel-body space-y-5">
          <CommentList comments={review.comments} />
          <hr className="dotted-divider" />
          <CommentForm articleId={review.id} />
        </div>
      </section>
    </ReviewArticle>
  );
}
