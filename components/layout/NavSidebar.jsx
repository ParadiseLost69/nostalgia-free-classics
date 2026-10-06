'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Panel } from '@/components/ui/Panel';
import { PixelIcon } from '@/components/ui/PixelIcon';

const PUBLIC_LINKS = [
  { href: '/', label: 'Home', icon: 'home' },
  { href: '/reviews', label: 'All Reviews', icon: 'scroll' },
  { href: '/reviews?sort=score', label: 'Highest Scored', icon: 'star' },
  { href: '/feed.xml', label: 'RSS Feed', icon: 'rss', external: true },
];

const ADMIN_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: 'key' },
  { href: '/admin/new', label: 'Write Review', icon: 'scroll' },
  { href: '/admin/comments', label: 'Comments', icon: 'comment' },
];

function NavList({ links, pathname }) {
  return (
    <ul className="space-y-1">
      {links.map((link) => {
        const active = link.href === pathname;
        const className = `flex items-center gap-2 border px-2 py-1 text-sm font-bold no-underline ${
          active
            ? 'border-grape-900 bg-grape-700 text-white hover:text-white'
            : 'border-transparent text-grape-900 hover:border-teal-700 hover:bg-teal-50 hover:text-teal-900'
        }`;
        const content = (
          <>
            <PixelIcon name={link.icon} size={14} className={active ? 'text-teal-300' : 'text-teal-700'} />
            {link.label}
          </>
        );
        return (
          <li key={link.href}>
            {link.external ? (
              <a href={link.href} className={className}>
                {content}
              </a>
            ) : (
              <Link href={link.href} className={className} aria-current={active ? 'page' : undefined}>
                {content}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function NavSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === 'ADMIN';

  return (
    <nav aria-label="Main" className="space-y-4">
      <Panel title="Navigation" as="div">
        <NavList links={PUBLIC_LINKS} pathname={pathname} />
      </Panel>
      {isAdmin && (
        <Panel title="Admin" as="div">
          <NavList links={ADMIN_LINKS} pathname={pathname} />
        </Panel>
      )}
      <Panel title="About" as="div" className="hidden md:block">
        <p className="text-xs">
          We replay the &ldquo;classics&rdquo; and score them as if they came out today. Your fond
          memories are valid. They are not, however, a gameplay mechanic.
        </p>
      </Panel>
    </nav>
  );
}
