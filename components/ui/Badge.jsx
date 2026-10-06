/** Wobbly yellow "NEW!" sticker. */
export function NewBadge() {
  return <span className="badge-new">NEW!</span>;
}

const TONES = {
  grape: 'border-grape-700 bg-grape-100 text-grape-900',
  teal: 'border-teal-700 bg-teal-50 text-teal-900',
  warn: 'border-yellow-700 bg-yellow-100 text-yellow-900',
};

/**
 * Small square tag.
 * @param {{ tone?: keyof TONES, children: React.ReactNode, className?: string }} props
 */
export function Badge({ tone = 'grape', children, className = '' }) {
  return (
    <span className={`inline-block border px-1.5 text-[0.7rem] font-bold uppercase leading-5 ${TONES[tone]} ${className}`}>
      {children}
    </span>
  );
}
