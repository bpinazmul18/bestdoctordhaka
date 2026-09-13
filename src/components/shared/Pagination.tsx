import Link from "next/link";

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

  return (
    <nav aria-label="Pagination" className="mt-6 flex items-center gap-4 text-sm">
      {page > 1 ? (
        <Link href={buildHref(page - 1)} rel="prev" className="hover:underline">
          Previous
        </Link>
      ) : (
        <span className="text-zinc-400">Previous</span>
      )}
      <span className="text-zinc-500">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={buildHref(page + 1)} rel="next" className="hover:underline">
          Next
        </Link>
      ) : (
        <span className="text-zinc-400">Next</span>
      )}
    </nav>
  );
}
