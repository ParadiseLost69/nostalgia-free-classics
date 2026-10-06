'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

/** Sign-in / account widget in the header. */
export function UserMenu() {
  const { data: session, status } = useSession();
  const pathname = usePathname();

  if (status === 'loading') {
    return <span className="inline-block h-8 w-20 animate-pulse bg-grape-900" aria-hidden="true" />;
  }

  if (!session?.user) {
    return (
      <Link href={`/login?callbackUrl=${encodeURIComponent(pathname)}`} className="btn-bevel">
        Sign in
      </Link>
    );
  }

  const name = session.user.name ?? session.user.email;
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="flex items-center gap-2">
        <span
          aria-hidden="true"
          className="flex h-8 w-8 items-center justify-center border border-teal-300/60 bg-grape-900 font-pixel text-[0.6rem] text-teal-300"
        >
          {name.slice(0, 1).toUpperCase()}
        </span>
        <span className="max-w-[10rem] truncate font-bold text-grape-50">{name}</span>
        {session.user.role === 'ADMIN' && (
          <span className="border border-yellow-300/70 px-1 font-terminal text-sm leading-tight text-yellow-300">ADMIN</span>
        )}
      </span>
      <button type="button" className="btn-ghost py-1" onClick={() => signOut({ redirectTo: '/' })}>
        Sign out
      </button>
    </div>
  );
}
