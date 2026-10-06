import { notFound } from 'next/navigation';
import { ArticleEditor } from '@/components/editor/ArticleEditor';
import { getArticleForEdit } from '@/lib/articles';
import { toDateInputValue } from '@/lib/format';

export const metadata = { title: 'Edit review' };

export default async function EditArticlePage({ params }) {
  const { id } = await params;
  const article = await getArticleForEdit(id);
  if (!article) notFound();

  /** Plain, serializable props for the client editor. */
  const editable = {
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    coverImage: article.coverImage,
    gameTitle: article.gameTitle,
    platform: article.platform,
    gameReleaseDate: toDateInputValue(article.gameReleaseDate),
    score: article.score,
    status: article.status,
    datePosted: article.datePosted?.toISOString() ?? null,
  };

  return (
    <>
      <h1 className="pixel-heading text-base text-white">Edit: {article.title}</h1>
      <ArticleEditor article={editable} authorName={article.author.name ?? 'Admin'} />
    </>
  );
}
