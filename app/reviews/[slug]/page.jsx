import { cache } from 'react';
import { notFound } from 'next/navigation';
import { Panel } from '@/components/ui/Panel';
import { PixelIcon } from '@/components/ui/PixelIcon';
import { ReviewArticle } from '@/components/reviews/ReviewArticle';
import { CommentList } from '@/components/comments/CommentList';
import { CommentForm } from '@/components/comments/CommentForm';
import { PublicColumns } from '@/components/layout/PublicColumns';
import { getPublishedReview, getPublishedSlugs } from '@/lib/articles';
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

export default async function ReviewPage({ params }) {
  const { slug } = await params;
  const review = await getReview(slug);
  if (!review) notFound();

  const html = renderArticleHtml(review.content);

  return (
    <PublicColumns>
      <ReviewArticle article={review} authorName={review.author.name} html={html} />

      <Panel
        title={`Comments (${review.comments.length})`}
        icon={<PixelIcon name="comment" className="text-teal-300" />}
        id="comments"
        bodyClassName="space-y-4"
      >
        <CommentList comments={review.comments} />
        <hr className="dotted-divider" />
        <CommentForm articleId={review.id} />
      </Panel>
    </PublicColumns>
  );
}
