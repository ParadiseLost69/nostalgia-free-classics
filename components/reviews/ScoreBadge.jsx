import { formatScore, scoreTier } from '@/lib/format';

const TIER_STYLES = {
  great: 'bg-teal-300 text-ink border-teal-100 shadow-glow',
  good: 'bg-teal-700 text-white border-teal-300 shadow-glow',
  mixed: 'bg-yellow-300 text-ink border-yellow-100 shadow-[0_0_14px_2px_rgb(253_224_71/0.45)]',
  bad: 'bg-rose-700 text-white border-rose-300 shadow-[0_0_14px_2px_rgb(244_63_94/0.45)]',
};

const SIZES = {
  sm: 'h-10 w-10 text-2xl',
  md: 'h-14 w-14 text-4xl',
  lg: 'h-20 w-20 text-5xl',
  xl: 'h-28 w-28 text-7xl',
};

/**
 * Large retro numeral in a glowing box. Colour shifts by score range.
 * @param {{ score: number, size?: keyof SIZES, showLabel?: boolean, className?: string }} props
 */
export function ScoreBadge({ score, size = 'md', showLabel = false, className = '' }) {
  const { tier, label } = scoreTier(score);
  const value = formatScore(score);
  return (
    <div className={`inline-flex shrink-0 flex-col items-center gap-1.5 ${className}`}>
      <div
        className={`flex items-center justify-center border-2 font-terminal leading-none ${SIZES[size]} ${TIER_STYLES[tier]}`}
        role="img"
        aria-label={`Score: ${value} out of 10 (${label})`}
      >
        <span aria-hidden="true">{value}</span>
      </div>
      {showLabel && (
        <span aria-hidden="true" className="font-terminal text-base uppercase leading-none tracking-widest text-teal-100">
          {label}
        </span>
      )}
    </div>
  );
}
