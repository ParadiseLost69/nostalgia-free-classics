import { formatDate, toDateInputValue, wasMeaningfullyUpdated } from '@/lib/format';

/**
 * Game facts as a definition list (dark surface styling).
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
    <dl className="divide-y divide-dotted divide-grape-700 text-sm">
      {rows.map(([term, value]) => (
        <div key={term} className="flex justify-between gap-4 py-2">
          <dt className="text-grape-300">{term}</dt>
          <dd className="text-right font-bold text-white">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
