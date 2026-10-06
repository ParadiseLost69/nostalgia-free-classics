/**
 * Retro window-style box with a purple gradient title bar.
 * @param {{ title?: React.ReactNode, icon?: React.ReactNode, as?: any, headingLevel?: 2 | 3, className?: string, bodyClassName?: string, actions?: React.ReactNode, children: React.ReactNode, id?: string }} props
 */
export function Panel({
  title,
  icon,
  as: Tag = 'section',
  headingLevel = 2,
  className = '',
  bodyClassName = '',
  actions,
  children,
  id,
}) {
  const Heading = `h${headingLevel}`;
  const headingId = id ? `${id}-title` : undefined;
  return (
    <Tag className={`panel ${className}`} aria-labelledby={title ? headingId : undefined} id={id}>
      {title && (
        <div className="title-bar">
          {icon}
          <Heading id={headingId} className="flex-1 text-sm">
            {title}
          </Heading>
          {actions}
          <span aria-hidden="true" className="flex gap-1">
            <span className="block h-3 w-3 border border-grape-900 bg-grape-100 shadow-bevel" />
            <span className="block h-3 w-3 border border-grape-900 bg-grape-100 shadow-bevel" />
          </span>
        </div>
      )}
      <div className={`panel-body ${bodyClassName}`}>{children}</div>
    </Tag>
  );
}
