import { ScoreBadge } from './ScoreBadge';
import { ReviewMeta } from './ReviewMeta';
import { CoverImage } from '@/components/ui/CoverImage';
import { Panel } from '@/components/ui/Panel';

/**
 * Presentational review body. Used by the public page and by the admin
 * preview so both render identically. `html` must already be sanitized.
 * @param {{ article: any, authorName?: string | null, html: string }} props
 */
export function ReviewArticle({ article, authorName, html }) {
  return (
    <Panel as="article" title="Review" bodyClassName="space-y-4">
      <header className="flex flex-col-reverse gap-4 sm:flex-row sm:items-start">
        <div className="min-w-0 flex-1 space-y-3">
          <h1 className="pixel-heading text-lg text-grape-900 sm:text-xl">{article.title}</h1>
          <ReviewMeta article={article} authorName={authorName} />
        </div>
        <ScoreBadge score={article.score} size="lg" />
      </header>

      {article.coverImage && (
        <CoverImage src={article.coverImage} alt={`Cover art for ${article.gameTitle}`} priority />
      )}

      {article.excerpt && (
        <p className="border-l-4 border-grape-500 bg-grape-50 px-3 py-2 font-bold">{article.excerpt}</p>
      )}

      <hr className="dotted-divider" />

      <div className="article-content" dangerouslySetInnerHTML={{ __html: html }} />
    </Panel>
  );
}
