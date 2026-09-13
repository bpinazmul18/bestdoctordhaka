import Link from "next/link";
import { Container } from "./Container";
import { MobileMenu } from "./MobileMenu";

const NAV_LINKS = [
  { href: "/doctors", label: "Doctors" },
  { href: "/specialties", label: "Specialties" },
  { href: "/locations", label: "Locations" },
  { href: "/hospitals", label: "Hospitals" },
  { href: "/diagnostic-centers", label: "Diagnostic Centers" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <Container className="relative flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span
            aria-hidden="true"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-sm font-bold text-white"
          >
            BD
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-base font-bold text-ink sm:text-lg">BestDoctorDhaka</span>
            <span className="hidden text-[11px] tracking-wide text-muted sm:block">
              Find · Compare · Consult
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-brand-700">
              {link.label}
            </Link>
          ))}
        </nav>

        <MobileMenu>
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-700"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </MobileMenu>
      </Container>
    </header>
  );
}
