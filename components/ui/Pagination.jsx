import Link from 'next/link';

/**
 * @param {{ page: number, pageCount: number, hrefFor: (page: number) => string }} props
 */
export function Pagination({ page, pageCount, hrefFor }) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-2">
      {page > 1 && (
        <Link className="chip" href={hrefFor(page - 1)} rel="prev">
          ◂ Prev
        </Link>
      )}
      {pages.map((p) => (
        <Link key={p} className="chip min-w-9 justify-center" href={hrefFor(p)} aria-current={p === page ? 'page' : undefined}>
          {p}
        </Link>
      ))}
      {page < pageCount && (
        <Link className="chip" href={hrefFor(page + 1)} rel="next">
          Next ▸
        </Link>
      )}
    </nav>
  );
}
