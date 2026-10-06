import Link from 'next/link';

/**
 * @param {{ page: number, pageCount: number, hrefFor: (page: number) => string }} props
 */
export function Pagination({ page, pageCount, hrefFor }) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  return (
    <nav aria-label="Pagination" className="mt-4 flex flex-wrap items-center justify-center gap-1">
      {page > 1 && (
        <Link className="btn-bevel btn-plain" href={hrefFor(page - 1)} rel="prev">
          « Prev
        </Link>
      )}
      {pages.map((p) =>
        p === page ? (
          <span key={p} aria-current="page" className="btn-bevel btn-grape is-pressed">
            {p}
          </span>
        ) : (
          <Link key={p} className="btn-bevel btn-plain" href={hrefFor(p)}>
            {p}
          </Link>
        ),
      )}
      {page < pageCount && (
        <Link className="btn-bevel btn-plain" href={hrefFor(page + 1)} rel="next">
          Next »
        </Link>
      )}
    </nav>
  );
}
