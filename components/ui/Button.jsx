import Link from 'next/link';

const VARIANTS = {
  teal: 'btn-bevel',
  grape: 'btn-bevel btn-grape',
  plain: 'btn-bevel btn-plain',
};

/**
 * Beveled button. `variant`: teal (default) | grape | plain.
 * @param {React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof VARIANTS }} props
 */
export function Button({ variant = 'teal', className = '', type = 'button', ...props }) {
  return <button type={type} className={`${VARIANTS[variant]} ${className}`} {...props} />;
}

/**
 * Link styled as a beveled button.
 * @param {React.ComponentProps<typeof Link> & { variant?: keyof VARIANTS }} props
 */
export function ButtonLink({ variant = 'teal', className = '', ...props }) {
  return <Link className={`${VARIANTS[variant]} ${className}`} {...props} />;
}
