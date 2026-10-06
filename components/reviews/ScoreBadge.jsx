import { formatScore, scoreTier } from '@/lib/format';

const TIER_STYLES = {
  great: 'bg-teal-300 text-ink border-teal-100 shadow-glow',
  good: 'bg-teal-700 text-white border-teal-300 shadow-glow',
  mixed: 'bg-yellow-300 text-ink border-yellow-100 shadow-[0_0_12px_2px_rgb(253_224_71/0.5)]',
  bad: 'bg-rose-700 text-white border-rose-300 shadow-[0_0_12px_2px_rgb(244_63_94/0.45)]',
};

const SIZES = {
  sm: { box: 'h-11 w-11 text-2xl', label: false },
  md: { box: 'h-16 w-16 text-4xl', label: false },
  lg: { box: 'h-24 w-24 text-6xl', label: true },
};

/**
 * Large retro numeral in a glowing box. Colour shifts by score range.
 * @param {{ score: number, size?: keyof SIZES }} props
 */
export function ScoreBadge({ score, size = 'md' }) {
  const { tier, label } = scoreTier(score);
  const s = SIZES[size];
  const value = formatScore(score);
  return (
    <div className="inline-flex shrink-0 flex-col items-center gap-1">
      <div
        className={`flex items-center justify-center border-2 font-terminal leading-none ${s.box} ${TIER_STYLES[tier]}`}
        role="img"
        aria-label={`Score: ${value} out of 10 (${label})`}
      >
        <span aria-hidden="true">{value}</span>
      </div>
      {s.label && (
        <span aria-hidden="true" className="font-pixel text-[0.55rem] uppercase text-grape-700">
          {label}
        </span>
      )}
    </div>
  );
}
