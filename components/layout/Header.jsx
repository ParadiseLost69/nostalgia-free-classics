import Link from 'next/link';
import { UserMenu } from './UserMenu';
import { PixelIcon } from '@/components/ui/PixelIcon';
import { SITE_NAME, SITE_TAGLINE } from '@/lib/constants';

export function Header() {
  return (
    <header className="border-2 border-grape-900 bg-gradient-to-b from-grape-500 via-grape-700 to-grape-900 shadow-[3px_3px_0_0_rgb(0_0_0/0.45)]">
      <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/" className="flex items-center gap-3 text-white no-underline hover:text-teal-100">
            <PixelIcon name="joystick" size={32} className="text-teal-300" />
            <span className="pixel-heading text-base drop-shadow-[2px_2px_0_rgb(0_0_0/0.6)] sm:text-xl">
              {SITE_NAME}
            </span>
          </Link>
          <p className="mt-2 font-terminal text-lg leading-none text-teal-100">{SITE_TAGLINE}</p>
        </div>
        <UserMenu />
      </div>
      <div aria-hidden="true" className="stripe-bar h-2 border-t-2 border-grape-900" />
    </header>
  );
}
