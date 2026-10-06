import Link from 'next/link';
import { SITE_NAME, SITE_TAGLINE } from '@/lib/constants';

/** Fake 88×31 web badges, drawn with CSS. Decorative. */
const BADGES = [
  { top: 'BEST VIEWED', bottom: 'ANY BROWSER', tone: 'from-grape-500 to-grape-900' },
  { top: 'NO', bottom: 'NOSTALGIA', tone: 'from-teal-700 to-teal-900' },
  { top: 'HTML', bottom: 'VALID-ISH', tone: 'from-grape-500 to-grape-700' },
  { top: 'POWERED BY', bottom: 'HONESTY', tone: 'from-teal-700 to-ink' },
];

export function Footer() {
  const year = new Date().getUTCFullYear();
  return (
    <footer className="mt-20 border-t border-grape-700/80 bg-ink/70">
      <div aria-hidden="true" className="stripe-bar h-[3px] opacity-60" />
      <div className="container-page grid gap-8 py-10 text-sm sm:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-pixel text-xs text-white">{SITE_NAME}</p>
          <p className="mt-2 max-w-xs text-grape-300">{SITE_TAGLINE}</p>
        </div>
        <nav aria-label="Footer">
          <p className="eyebrow mb-2">Browse</p>
          <ul className="space-y-1">
            <li><Link href="/reviews" className="text-grape-100 no-underline hover:text-teal-300">All reviews</Link></li>
            <li><Link href="/reviews?sort=score" className="text-grape-100 no-underline hover:text-teal-300">Top rated</Link></li>
            <li><a href="/feed.xml" className="text-grape-100 no-underline hover:text-teal-300">RSS feed</a></li>
          </ul>
        </nav>
        <div aria-hidden="true">
          <p className="eyebrow mb-2">Visitors</p>
          <span className="inline-flex border-2 border-grape-700 bg-black px-2 py-0.5 font-terminal text-2xl leading-none tracking-[0.25em] text-teal-300 shadow-[0_0_12px_rgb(79_227_207/0.25)]">
            0013370
          </span>
        </div>
      </div>
      <div className="container-page flex flex-col items-center justify-between gap-4 border-t border-grape-700/60 py-5 sm:flex-row">
        <ul className="flex flex-wrap justify-center gap-2" aria-hidden="true">
          {BADGES.map((b) => (
            <li
              key={b.bottom}
              className={`flex h-[31px] w-[88px] flex-col items-center justify-center border border-black bg-gradient-to-b ${b.tone} font-pixel text-[0.45rem] leading-[0.7rem] text-white shadow-bevel`}
            >
              <span>{b.top}</span>
              <span className="text-teal-100">{b.bottom}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-grape-300">© {year} {SITE_NAME}. All scores final until we change our minds.</p>
      </div>
    </footer>
  );
}
