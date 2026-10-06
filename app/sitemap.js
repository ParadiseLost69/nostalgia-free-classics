import { getPublishedSlugs } from '@/lib/articles';
import { absoluteUrl } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap() {
  const reviews = await getPublishedSlugs();
  const lastModified = reviews[0]?.dateUpdated ?? new Date();
  return [
    { url: absoluteUrl('/'), lastModified, changeFrequency: 'daily', priority: 1 },
    { url: absoluteUrl('/reviews'), lastModified, changeFrequency: 'daily', priority: 0.8 },
    ...reviews.map((r) => ({
      url: absoluteUrl(`/reviews/${r.slug}`),
      lastModified: r.dateUpdated,
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
  ];
}
