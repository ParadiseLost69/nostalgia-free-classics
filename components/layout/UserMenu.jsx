'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

/** Sign-in / sign-out widget in the header. */
export function UserMenu() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === 'loading') {
    return <span className="text-xs text-grape-100">Loading…</span>;
  }

  if (!session?.user) {
    return (
      <Link
        href={`/login?callbackUrl=${encodeURIComponent(pathname)}`}
        className="btn-bevel btn-plain self-start sm:self-auto"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-grape-50 sm:justify-end">
      <span>
        Logged in as <strong className="text-teal-300">{session.user.name ?? session.user.email}</strong>
        {session.user.role === 'ADMIN' && <span className="ml-1 text-yellow-300">[admin]</span>}
      </span>
      <button type="button" className="btn-bevel btn-plain" onClick={() => signOut({ redirectTo: '/' })}>
        Sign out
      </button>
    </div>
  );
}
