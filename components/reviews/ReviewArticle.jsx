import Link from 'next/link';
import { ScoreBadge } from './ScoreBadge';
import { ReviewMeta } from './ReviewMeta';
import { ReviewCover } from './ReviewCard';
import { formatDate, formatYear, scoreTier, wasMeaningfullyUpdated } from '@/lib/format';

/**
 * Full review layout: hero header, reading panel, and an "at a glance"
 * sidebar. Used by the public page and the admin preview so both render
 * identically. `html` must already be sanitized.
 * @param {{ article: any, authorName?: string | null, html: string, aside?: React.ReactNode, children?: React.ReactNode }} props
 */
export function ReviewArticle({ article, authorName, html, aside, children }) {
  const { label } = scoreTier(article.score);
  const updated = wasMeaningfullyUpdated(article.datePosted, article.dateUpdated);

  return (
    <article>
      <nav aria-label="Breadcrumb" className="mb-6 text-sm">
        <ol className="flex flex-wrap items-center gap-2 text-grape-300">
          <li>
            <Link href="/reviews" className="text-grape-300 no-underline hover:text-teal-300">
              Reviews
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-grape-100">
            {article.gameTitle}
          </li>
        </ol>
      </nav>

      <header className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="reveal">
          <p className="eyebrow">
            {[article.platform, formatYear(article.gameReleaseDate)].filter(Boolean).join(' · ')}
          </p>
          <h1 className="pixel-heading mt-3 text-xl leading-relaxed text-white sm:text-2xl lg:text-[1.7rem]">
            {article.title}
          </h1>
          {article.excerpt && <p className="mt-5 max-w-xl text-lg leading-relaxed text-grape-100">{article.excerpt}</p>}
          <p className="mt-5 text-sm text-grape-300">
            {authorName && (
              <>
                By <span className="font-bold text-white">{authorName}</span>
              </>
            )}
            {article.datePosted && <> · {formatDate(article.datePosted)}</>}
            {updated && <> · Updated {formatDate(article.dateUpdated)}</>}
          </p>
        </div>

        <div className="reveal relative pb-8 pl-8 [animation-delay:120ms]">
          <div className="aspect-[16/9] overflow-hidden border-2 border-grape-500 shadow-[8px_8px_0_0_theme(colors.grape.700)]">
            <ReviewCover review={article} size="lg" priority alt={article.coverImage ? `Cover art for ${article.gameTitle}` : ''} />
          </div>
          <div className="absolute bottom-0 left-0 flex origin-bottom-left items-end gap-3 max-sm:scale-75">
            <ScoreBadge score={article.score} size="xl" />
            <span className="mb-1 bg-ink/80 px-2 py-1 font-terminal text-xl uppercase leading-none tracking-widest text-teal-100">
              {label}
            </span>
          </div>
        </div>
      </header>

      <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="min-w-0 space-y-8">
          <section className="panel" aria-label="Review">
            <div className="title-bar">
              <span className="flex-1 truncate font-normal">{article.slug || 'review'}.txt</span>
              <span aria-hidden="true" className="flex gap-1">
                <span className="block h-3 w-3 border border-grape-900 bg-grape-100 shadow-bevel" />
                <span className="block h-3 w-3 border border-grape-900 bg-grape-100 shadow-bevel" />
              </span>
            </div>
            <div className="px-5 py-8 sm:px-10 sm:py-10">
              <div className="article-content mx-auto max-w-[68ch]" dangerouslySetInnerHTML={{ __html: html }} />
            </div>
          </section>
          {children}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start" aria-label="Review details">
          <div className="surface p-5">
            <p className="eyebrow">At a glance</p>
            <div className="mt-4 flex items-center gap-4">
              <ScoreBadge score={article.score} size="lg" />
              <div>
                <p className="font-terminal text-2xl uppercase leading-none text-white">{label}</p>
                <p className="mt-1 text-xs text-grape-300">Scored as if it launched today</p>
              </div>
            </div>
            <div className="mt-4">
              <ReviewMeta article={article} authorName={authorName} />
            </div>
          </div>
          {aside}
        </aside>
      </div>
    </article>
  );
}
