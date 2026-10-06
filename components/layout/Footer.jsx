import { SITE_NAME } from '@/lib/constants';

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
    <footer className="panel mt-6 px-4 py-4 text-center text-xs">
      <ul className="flex flex-wrap justify-center gap-2" aria-hidden="true">
        {BADGES.map((b) => (
          <li
            key={b.bottom}
            className={`flex h-[31px] w-[88px] flex-col items-center justify-center border border-ink bg-gradient-to-b ${b.tone} font-pixel text-[0.45rem] leading-[0.7rem] text-white shadow-bevel`}
          >
            <span>{b.top}</span>
            <span className="text-teal-100">{b.bottom}</span>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex items-center justify-center gap-2" aria-hidden="true">
        <span className="text-grape-700">Visitors:</span>
        <span className="inline-flex border-2 border-grape-900 bg-ink px-1 font-terminal text-lg leading-none tracking-[0.2em] text-teal-300">
          0013370
        </span>
      </div>

      <hr className="dotted-divider" />
      <p>
        © {year} {SITE_NAME}. All scores are final until we change our minds.
      </p>
    </footer>
  );
}
