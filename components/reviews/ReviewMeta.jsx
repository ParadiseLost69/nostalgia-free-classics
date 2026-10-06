import { formatDate, toDateInputValue, wasMeaningfullyUpdated } from '@/lib/format';

/**
 * Definition-list of review facts (author, dates, game info).
 * @param {{ article: { gameTitle: string, platform?: string | null, gameReleaseDate: Date | string, datePosted?: Date | string | null, dateUpdated?: Date | string | null }, authorName?: string | null }} props
 */
export function ReviewMeta({ article, authorName }) {
  const rows = [
    ['Game', article.gameTitle],
    article.platform && ['Platform', article.platform],
    [
      'Released',
      <time key="r" dateTime={toDateInputValue(article.gameReleaseDate)}>
        {formatDate(article.gameReleaseDate)}
      </time>,
    ],
    authorName && ['Reviewed by', authorName],
    article.datePosted && [
      'Posted',
      <time key="p" dateTime={new Date(article.datePosted).toISOString()}>
        {formatDate(article.datePosted)}
      </time>,
    ],
    wasMeaningfullyUpdated(article.datePosted, article.dateUpdated) && [
      'Updated on',
      <time key="u" dateTime={new Date(article.dateUpdated).toISOString()}>
        {formatDate(article.dateUpdated)}
      </time>,
    ],
  ].filter(Boolean);

  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-sm">
      {rows.map(([term, value]) => (
        <div key={term} className="contents">
          <dt className="font-bold text-grape-700">{term}:</dt>
          <dd>{value}</dd>
        </div>
      ))}
    </dl>
  );
}
