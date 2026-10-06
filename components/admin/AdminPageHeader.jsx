/**
 * Title row for admin pages.
 * @param {{ title: string, actions?: React.ReactNode }} props
 */
export function AdminPageHeader({ title, actions }) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <p className="eyebrow">Admin</p>
        <h1 className="pixel-heading mt-2 truncate text-lg text-white sm:text-xl">{title}</h1>
      </div>
      {actions}
    </header>
  );
}
