'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { UserMenu } from './UserMenu';
import { PixelIcon } from '@/components/ui/PixelIcon';

const PUBLIC_LINKS = [
  { href: '/reviews', label: 'Reviews', match: (p, q) => p.startsWith('/reviews') && q.get('sort') !== 'score' },
  { href: '/reviews?sort=score', label: 'Top Rated', match: (p, q) => p === '/reviews' && q.get('sort') === 'score' },
];

const ADMIN_LINKS = [
  { href: '/admin', label: 'Dashboard', match: (p) => p === '/admin' || /^\/admin\/[^/]+\/edit/.test(p) },
  { href: '/admin/new', label: 'Write', match: (p) => p === '/admin/new' },
  { href: '/admin/comments', label: 'Comments', match: (p) => p === '/admin/comments' },
];

function NavItem({ link, active, onNavigate, block = false }) {
  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      className={`relative font-bold no-underline transition-colors ${
        block ? 'block px-3 py-2.5' : 'px-3 py-2'
      } ${active ? 'text-teal-300' : 'text-grape-100 hover:text-white'}`}
    >
      {link.label}
      {active && !block && (
        <span aria-hidden="true" className="absolute inset-x-3 -bottom-px h-0.5 bg-teal-300 shadow-[0_0_8px_theme(colors.teal.300)]" />
      )}
    </Link>
  );
}

/** Primary navigation: inline on desktop, disclosure menu on mobile. */
export function SiteNav() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';
  // The mobile menu stays open only for the route it was opened on, so any
  // navigation closes it without an effect.
  const routeKey = `${pathname}?${searchParams.toString()}`;
  const [openOn, setOpenOn] = useState(/** @type {string | null} */ (null));
  const open = openOn === routeKey;
  const setOpen = (value) => setOpenOn(value ? routeKey : null);

  const links = (block) => (
    <>
      {PUBLIC_LINKS.map((l) => (
        <NavItem key={l.href} link={l} active={l.match(pathname, searchParams)} block={block} onNavigate={() => setOpen(false)} />
      ))}
      {isAdmin && (
        <>
          <span aria-hidden="true" className={block ? 'mx-3 my-1 block h-px bg-grape-700' : 'mx-2 h-5 w-px bg-grape-700'} />
          {ADMIN_LINKS.map((l) => (
            <NavItem key={l.href} link={l} active={l.match(pathname)} block={block} onNavigate={() => setOpen(false)} />
          ))}
        </>
      )}
    </>
  );

  return (
    <>
      <nav aria-label="Main" className="hidden flex-1 items-center text-sm md:flex">
        {links(false)}
        <a href="/feed.xml" className="ml-1 flex items-center gap-1 px-3 py-2 text-grape-300 no-underline hover:text-teal-300" aria-label="RSS feed">
          <PixelIcon name="rss" size={14} />
          <span className="sr-only lg:not-sr-only">RSS</span>
        </a>
      </nav>

      <div className="hidden md:block">
        <UserMenu />
      </div>

      <button
        type="button"
        className="btn-ghost ml-auto px-2.5 md:hidden"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(!open)}
      >
        <span className="font-terminal text-lg leading-none">{open ? '✕' : '☰'}</span>
        <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
      </button>

      {open && (
        <div id="mobile-menu" className="absolute inset-x-0 top-full border-b-2 border-grape-700 bg-ink/95 backdrop-blur md:hidden">
          <nav aria-label="Main" className="container-page flex flex-col py-2">
            {links(true)}
            <a href="/feed.xml" className="block px-3 py-2.5 font-bold text-grape-300 no-underline">
              RSS feed
            </a>
            <div className="border-t border-grape-700 px-3 py-3">
              <UserMenu />
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
