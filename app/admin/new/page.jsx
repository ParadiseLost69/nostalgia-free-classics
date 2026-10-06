import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { ArticleEditor } from '@/components/editor/ArticleEditor';
import { getSession } from '@/lib/auth';

export const metadata = { title: 'New review' };

export default async function NewArticlePage() {
  const session = await getSession();
  return (
    <>
      <AdminPageHeader title="New review" />
      <ArticleEditor article={null} authorName={session?.user?.name ?? 'Admin'} />
    </>
  );
}
