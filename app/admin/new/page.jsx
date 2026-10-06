import { ArticleEditor } from '@/components/editor/ArticleEditor';
import { getSession } from '@/lib/auth';

export const metadata = { title: 'New review' };

export default async function NewArticlePage() {
  const session = await getSession();
  return (
    <>
      <h1 className="pixel-heading text-base text-white">New review</h1>
      <ArticleEditor article={null} authorName={session?.user?.name ?? 'Admin'} />
    </>
  );
}
