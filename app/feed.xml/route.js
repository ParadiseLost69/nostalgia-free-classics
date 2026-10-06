import { prisma } from '@/lib/prisma';
import { absoluteUrl } from '@/lib/site';
import { formatScore } from '@/lib/format';
import { SITE_NAME, SITE_TAGLINE } from '@/lib/constants';

export const revalidate = 3600;

/** @param {string} s */
function escapeXml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** RSS 2.0 feed of the 20 most recent published reviews. */
export async function GET() {
  const reviews = await prisma.article.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { datePosted: 'desc' },
    take: 20,
    select: { title: true, slug: true, excerpt: true, gameTitle: true, score: true, datePosted: true, author: { select: { name: true } } },
  });

  const items = reviews
    .map((r) => {
      const url = absoluteUrl(`/reviews/${r.slug}`);
      const description = `${r.gameTitle}: ${formatScore(r.score)}/10. ${r.excerpt ?? ''}`.trim();
      return `    <item>
      <title>${escapeXml(r.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(r.datePosted).toUTCString()}</pubDate>
      <description>${escapeXml(description)}</description>${r.author.name ? `\n      <dc:creator>${escapeXml(r.author.name)}</dc:creator>` : ''}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${absoluteUrl('/')}</link>
    <description>${escapeXml(SITE_TAGLINE)}</description>
    <language>en</language>
    <atom:link href="${absoluteUrl('/feed.xml')}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
