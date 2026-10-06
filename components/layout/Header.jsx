import { Suspense } from 'react';
import Link from 'next/link';
import { SiteNav } from './SiteNav';
import { PixelIcon } from '@/components/ui/PixelIcon';

/** Sticky top bar: logo, primary nav, account. */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-grape-700/80 bg-ink/80 backdrop-blur-md" style={{ top: 'env(safe-area-inset-top, 0px)' }}>
      <div className="container-page relative flex h-16 items-center gap-4">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5 text-white no-underline hover:text-white">
          <span className="flex h-9 w-9 items-center justify-center border-2 border-b-grape-900 border-l-grape-300 border-r-grape-900 border-t-grape-300 bg-grape-500 transition-transform group-hover:-rotate-6">
            <PixelIcon name="joystick" size={20} className="text-teal-300" />
          </span>
          <span className="flex flex-col">
            <span className="font-pixel text-[0.7rem] leading-tight sm:text-xs">Nostalgia-Free</span>
            <span className="font-terminal text-base leading-none tracking-[0.3em] text-teal-300">CLASSICS</span>
          </span>
        </Link>
        <Suspense fallback={<div className="flex-1" />}>
          <SiteNav />
        </Suspense>
      </div>
      <div aria-hidden="true" className="stripe-bar h-[3px] opacity-80" />
    </header>
  );
}
