import type { Metadata } from "next";
import Link from "next/link";
import { requireSuperAdmin } from "@/lib/auth/dal";
import { Container } from "@/components/shared/Container";
import { logoutAction } from "./actions";

export const metadata: Metadata = {
  title: { template: "%s | Admin | BestDoctorDhaka", default: "Admin" },
  robots: { index: false, follow: false },
};

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/locations", label: "Locations" },
  { href: "/admin/specialties", label: "Specialties" },
  { href: "/admin/hospitals", label: "Hospitals" },
  { href: "/admin/diagnostic-centers", label: "Diagnostic Centers" },
  { href: "/admin/doctors", label: "Doctors" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireSuperAdmin();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <Container className="flex flex-wrap items-center justify-between gap-4 py-4">
          <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-muted">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-ink">
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 text-sm text-muted">
            <form action={logoutAction}>
              <button type="submit" className="font-medium text-ink hover:underline">
                Log out
              </button>
            </form>
          </div>
        </Container>
      </header>
      <main>
        <Container className="py-8">{children}</Container>
      </main>
    </div>
  );
}
