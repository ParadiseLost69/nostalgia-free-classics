import Link from 'next/link';
import { Panel } from '@/components/ui/Panel';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DeleteArticleButton } from '@/components/admin/DeleteArticleButton';
import { getAllArticlesForAdmin } from '@/lib/articles';
import { formatDateShort, formatScore } from '@/lib/format';

export const metadata = { title: 'Dashboard' };

export default async function AdminDashboard() {
  const articles = await getAllArticlesForAdmin();
  const drafts = articles.filter((a) => a.status === 'DRAFT').length;

  return (
    <>
      <AdminPageHeader title="Dashboard" actions={<ButtonLink href="/admin/new">+ New review</ButtonLink>} />
      <Panel
        title={`Articles (${articles.length} total, ${drafts} draft${drafts === 1 ? '' : 's'})`}
        id="articles"
      >
        {articles.length === 0 ? (
          <p>
            No articles yet. <Link href="/admin/new">Write the first one.</Link>
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <caption className="sr-only">All articles, drafts first</caption>
              <thead>
                <tr className="bg-grape-100 text-left text-xs uppercase text-grape-700">
                  <th scope="col" className="border border-grape-300 px-2 py-1">Title</th>
                  <th scope="col" className="border border-grape-300 px-2 py-1">Status</th>
                  <th scope="col" className="border border-grape-300 px-2 py-1">Score</th>
                  <th scope="col" className="border border-grape-300 px-2 py-1">Posted</th>
                  <th scope="col" className="border border-grape-300 px-2 py-1">Updated</th>
                  <th scope="col" className="border border-grape-300 px-2 py-1">💬</th>
                  <th scope="col" className="border border-grape-300 px-2 py-1">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((a) => (
                  <tr key={a.id} className="odd:bg-white even:bg-paper">
                    <th scope="row" className="border border-grape-300 px-2 py-1 text-left font-bold">
                      <Link href={`/admin/${a.id}/edit`}>{a.title}</Link>
                    </th>
                    <td className="border border-grape-300 px-2 py-1">
                      <Badge tone={a.status === 'PUBLISHED' ? 'teal' : 'warn'}>{a.status.toLowerCase()}</Badge>
                    </td>
                    <td className="border border-grape-300 px-2 py-1 font-terminal text-lg">{formatScore(a.score)}</td>
                    <td className="border border-grape-300 px-2 py-1 whitespace-nowrap">{formatDateShort(a.datePosted) || '—'}</td>
                    <td className="border border-grape-300 px-2 py-1 whitespace-nowrap">{formatDateShort(a.dateUpdated)}</td>
                    <td className="border border-grape-300 px-2 py-1 text-center">{a._count.comments}</td>
                    <td className="border border-grape-300 px-2 py-1">
                      <span className="flex flex-wrap gap-1">
                        <Link href={`/admin/${a.id}/edit`} className="btn-bevel px-1.5 py-0 text-xs">
                          Edit
                        </Link>
                        {a.status === 'PUBLISHED' && (
                          <Link href={`/reviews/${a.slug}`} className="btn-bevel btn-plain px-1.5 py-0 text-xs">
                            View
                          </Link>
                        )}
                        <DeleteArticleButton id={a.id} title={a.title} />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}
