import Link from "next/link";
import { cx } from "./cx";

export function Pagination({
  page,
  totalPages,
  buildHref,
}: {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;

  const navButtonClasses =
    "inline-flex items-center rounded-lg border px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600";

  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-between gap-4">
      {page > 1 ? (
        <Link
          href={buildHref(page - 1)}
          rel="prev"
          className={cx(navButtonClasses, "border-slate-300 text-slate-700 hover:border-brand-600 hover:text-brand-700")}
        >
          Previous
        </Link>
      ) : (
        <span className={cx(navButtonClasses, "border-slate-200 text-slate-300")} aria-disabled="true">
          Previous
        </span>
      )}
      <span className="text-sm text-muted">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link
          href={buildHref(page + 1)}
          rel="next"
          className={cx(navButtonClasses, "border-slate-300 text-slate-700 hover:border-brand-600 hover:text-brand-700")}
        >
          Next
        </Link>
      ) : (
        <span className={cx(navButtonClasses, "border-slate-200 text-slate-300")} aria-disabled="true">
          Next
        </span>
      )}
    </nav>
  );
}
