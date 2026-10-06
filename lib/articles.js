import 'server-only';
import { prisma } from './prisma';

export const PAGE_SIZE = 10;

/** Fields needed to render a review card / sidebar entry. */
export const cardSelect = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverImage: true,
  gameTitle: true,
  platform: true,
  gameReleaseDate: true,
  score: true,
  datePosted: true,
};

const published = { status: 'PUBLISHED' };

export function getLatestReviews(take = 5) {
  return prisma.article.findMany({
    where: published,
    orderBy: { datePosted: 'desc' },
    take,
    select: cardSelect,
  });
}

export function getTopScoredReviews(take = 5) {
  return prisma.article.findMany({
    where: published,
    orderBy: [{ score: 'desc' }, { datePosted: 'desc' }],
    take,
    select: cardSelect,
  });
}

export async function getRandomReview() {
  const count = await prisma.article.count({ where: published });
  if (!count) return null;
  const [review] = await prisma.article.findMany({
    where: published,
    orderBy: { id: 'asc' },
    skip: Math.floor(Math.random() * count),
    take: 1,
    select: cardSelect,
  });
  return review ?? null;
}

export async function getPlatforms() {
  const rows = await prisma.article.findMany({
    where: { ...published, platform: { not: null } },
    distinct: ['platform'],
    select: { platform: true },
    orderBy: { platform: 'asc' },
  });
  return rows.map((r) => r.platform).filter(Boolean);
}

/**
 * @param {{ page?: number, platform?: string | null, minScore?: number | null, sort?: string }} opts
 */
export async function getReviewsPage({ page = 1, platform = null, minScore = null, sort = 'newest' }) {
  const where = {
    ...published,
    ...(platform ? { platform } : {}),
    ...(minScore != null ? { score: { gte: minScore } } : {}),
  };
  const orderBy =
    sort === 'score' ? [{ score: 'desc' }, { datePosted: 'desc' }]
    : sort === 'oldest-game' ? [{ gameReleaseDate: 'asc' }]
    : [{ datePosted: 'desc' }];

  const [items, total] = await prisma.$transaction([
    prisma.article.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: cardSelect,
    }),
    prisma.article.count({ where }),
  ]);
  return { items, total, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

/** Published review with author and visible comments. */
export function getPublishedReview(slug) {
  return prisma.article.findFirst({
    where: { slug, ...published },
    include: {
      author: { select: { name: true } },
      comments: {
        where: { hidden: false },
        orderBy: { createdAt: 'asc' },
        include: { author: { select: { id: true, name: true, image: true } } },
      },
    },
  });
}

export function getPublishedSlugs() {
  return prisma.article.findMany({
    where: published,
    select: { slug: true, dateUpdated: true },
    orderBy: { datePosted: 'desc' },
  });
}

export function getAllArticlesForAdmin() {
  return prisma.article.findMany({
    orderBy: [{ status: 'asc' }, { dateUpdated: 'desc' }],
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      score: true,
      datePosted: true,
      dateUpdated: true,
      _count: { select: { comments: true } },
    },
  });
}

export function getArticleForEdit(id) {
  return prisma.article.findUnique({ where: { id }, include: { author: { select: { name: true } } } });
}
