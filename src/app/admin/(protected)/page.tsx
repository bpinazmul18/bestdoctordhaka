import Link from "next/link";

const SECTIONS = [
  { href: "/admin/locations", label: "Locations", description: "Cities and areas doctors, hospitals, and diagnostic centers are attached to." },
  { href: "/admin/specialties", label: "Specialties", description: "Medical specialties doctors can be listed under." },
  { href: "/admin/hospitals", label: "Hospitals", description: "Hospitals doctors can be affiliated with." },
  { href: "/admin/diagnostic-centers", label: "Diagnostic Centers", description: "Diagnostic centers and the tests they offer." },
  { href: "/admin/doctors", label: "Doctors", description: "Doctor directory profiles." },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-ink">Dashboard</h1>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SECTIONS.map((section) => (
          <li key={section.href}>
            <Link
              href={section.href}
              className="block rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-brand-300 hover:bg-brand-50"
            >
              <span className="block font-medium text-ink">{section.label}</span>
              <span className="block text-sm text-muted">{section.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
