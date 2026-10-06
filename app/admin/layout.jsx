import { redirect } from 'next/navigation';
import { Panel } from '@/components/ui/Panel';
import { getSession, isAdmin } from '@/lib/auth';

export const metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
};

/**
 * Server-side guard for every /admin page. Server actions and route
 * handlers check again with requireAdmin(); this only protects rendering.
 */
export default async function AdminLayout({ children }) {
  const session = await getSession();
  if (!session?.user) redirect('/login?callbackUrl=/admin');

  if (!isAdmin(session)) {
    return (
      <Panel title="403: Forbidden" id="forbidden">
        <p>This area is for the site admin only. Nice try, though.</p>
      </Panel>
    );
  }

  return <div className="space-y-4">{children}</div>;
}
