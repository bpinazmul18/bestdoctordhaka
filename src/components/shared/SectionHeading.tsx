import Link from "next/link";
import { ArrowRightIcon } from "./icons";

export function SectionHeading({
  title,
  subtitle,
  seeAllHref,
  seeAllLabel = "View all",
}: {
  title: string;
  subtitle?: string;
  seeAllHref?: string;
  seeAllLabel?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-bold text-ink sm:text-2xl">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
      </div>
      {seeAllHref && (
        <Link
          href={seeAllHref}
          className="hidden shrink-0 items-center gap-1 text-sm font-medium text-brand-700 hover:text-brand-800 hover:underline sm:inline-flex"
        >
          {seeAllLabel}
          <ArrowRightIcon width={16} height={16} />
        </Link>
      )}
    </div>
  );
}
