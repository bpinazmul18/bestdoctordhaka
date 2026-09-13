import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-4 text-3xl font-semibold">BestDoctorDhaka</h1>
      <p className="mb-8 text-zinc-600 dark:text-zinc-400">
        Find doctors in Dhaka by specialty and location.
      </p>
      <nav className="flex flex-wrap gap-4">
        <Link
          href="/doctors"
          className="rounded border border-zinc-300 px-4 py-2 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          Browse Doctors
        </Link>
        <Link
          href="/specialties"
          className="rounded border border-zinc-300 px-4 py-2 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          Specialties
        </Link>
        <Link
          href="/locations"
          className="rounded border border-zinc-300 px-4 py-2 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          Locations
        </Link>
      </nav>
    </div>
  );
}
