import { formatYear } from '@/lib/format';

/** Background pairs (tailwind classes) picked deterministically per game. */
const PALETTES = [
  'from-grape-700 via-grape-900 to-ink',
  'from-teal-900 via-grape-900 to-ink',
  'from-grape-500 via-grape-900 to-ink',
  'from-teal-700 via-teal-900 to-ink',
];

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/**
 * Generated "title screen" used when a review has no cover image: the game's
 * name in pixel type over a starfield, like a cartridge booting up.
 * Decorative: the card/heading already names the game.
 * @param {{ gameTitle: string, platform?: string | null, gameReleaseDate?: Date | string, size?: 'md' | 'lg', className?: string }} props
 */
export function TitleScreen({ gameTitle, platform, gameReleaseDate, size = 'md', className = '' }) {
  const palette = PALETTES[hash(gameTitle) % PALETTES.length];
  const large = size === 'lg';
  return (
    <div
      aria-hidden="true"
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-gradient-to-b ${palette} p-4 text-center ${className}`}
    >
      {/* starfield */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            'radial-gradient(1px 1px at 12% 22%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 78% 14%, #c2fff4 50%, transparent 51%), radial-gradient(1px 1px at 33% 72%, #e6d9ff 50%, transparent 51%), radial-gradient(1px 1px at 88% 66%, #fff 50%, transparent 51%), radial-gradient(1px 1px at 55% 38%, #4fe3cf 50%, transparent 51%), radial-gradient(1px 1px at 6% 88%, #fff 50%, transparent 51%)',
        }}
      />
      {/* horizon grid */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3 opacity-40 [transform:perspective(200px)_rotateX(55deg)] [transform-origin:bottom]"
        style={{
          backgroundImage:
            'linear-gradient(rgb(79 227 207 / 0.7) 1px, transparent 1px), linear-gradient(90deg, rgb(79 227 207 / 0.7) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <span
        className={`relative font-pixel uppercase leading-snug text-white drop-shadow-[3px_3px_0_theme(colors.grape.700)] ${
          large ? 'text-lg sm:text-2xl' : 'text-xs sm:text-sm'
        }`}
      >
        {gameTitle}
      </span>
      <span className={`relative mt-3 font-terminal uppercase tracking-[0.25em] text-teal-300 ${large ? 'text-xl' : 'text-base'}`}>
        Press start
      </span>
      {(platform || gameReleaseDate) && (
        <span className="absolute bottom-2 left-0 right-0 font-terminal text-sm uppercase tracking-widest text-grape-100/80">
          © {formatYear(gameReleaseDate)} {platform}
        </span>
      )}
    </div>
  );
}
