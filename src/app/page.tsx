import Link from "next/link";
import { Container } from "@/components/shared/Container";
import { Button } from "@/components/shared/Button";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { SpecialtyIcon } from "@/components/shared/SpecialtyIcon";
import { HeroIllustration } from "@/components/shared/HeroIllustration";
import { DoctorCard } from "@/components/doctor/DoctorCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { SearchIcon, MapPinIcon, GridIcon } from "@/components/shared/icons";
import { listSpecialties } from "@/modules/specialty/specialty.service";
import { listLocations } from "@/modules/location/location.service";
import { listDoctors } from "@/modules/doctor/doctor.service";
import { DEFAULT_PAGE_SIZE } from "@/lib/pagination/pagination";

const HOMEPAGE_DOCTOR_COUNT = 4;

export default async function Home() {
  const [specialties, locations, doctors] = await Promise.all([
    listSpecialties(),
    listLocations(),
    listDoctors({ page: 1, pageSize: DEFAULT_PAGE_SIZE }),
  ]);

  const featuredDoctors = doctors.items.slice(0, HOMEPAGE_DOCTOR_COUNT);

  return (
    <div>
      <section className="border-b border-slate-200 bg-gradient-to-b from-brand-50 to-white">
        <Container className="grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl lg:text-5xl">
              Find the Right Doctor in <span className="text-brand-600">Dhaka</span>, with Confidence
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted sm:text-lg">
              Search doctors in Dhaka by specialty and location, and view chamber details to plan
              your visit.
            </p>

            <div className="mt-6">
              <Button href="/doctors" size="md" className="px-6 py-3 text-base">
                Browse Doctors
              </Button>
            </div>

            <form
              action="/doctors"
              method="get"
              className="mt-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm sm:flex-row sm:items-center"
            >
              <label htmlFor="home-search" className="sr-only">
                Search by doctor name or specialty
              </label>
              <div className="flex flex-1 items-center gap-2 px-2">
                <SearchIcon width={18} height={18} className="shrink-0 text-muted" />
                <input
                  id="home-search"
                  type="text"
                  name="q"
                  placeholder="Search by doctor name or specialty"
                  className="w-full border-0 bg-transparent py-2 text-sm text-ink placeholder:text-slate-400 focus:outline-none"
                />
              </div>
              <label htmlFor="home-location" className="sr-only">
                Area in Dhaka
              </label>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 sm:w-52">
                <MapPinIcon width={16} height={16} className="shrink-0 text-muted" />
                <select
                  id="home-location"
                  name="location"
                  defaultValue=""
                  className="w-full border-0 bg-transparent py-2 text-sm text-ink focus:outline-none"
                >
                  <option value="">Dhaka (All Areas)</option>
                  {locations.map((location) => (
                    <option key={location.slug} value={location.slug}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
              <Button type="submit">Search</Button>
            </form>

            {specialties.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
                <span>Popular Searches:</span>
                {specialties.slice(0, 6).map((specialty) => (
                  <Link
                    key={specialty.slug}
                    href={`/specialties/${specialty.slug}`}
                    className="text-brand-700 hover:underline"
                  >
                    {specialty.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="relative hidden lg:block">
            <HeroIllustration />
            <p
              className="absolute -top-2 right-4 rotate-[-6deg] text-2xl text-brand-700"
              style={{ fontFamily: "var(--font-handwritten)" }}
            >
              A Healthier Dhaka Together ♥
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        <SectionHeading title="Browse by Specialty" seeAllHref="/specialties" />
        {specialties.length === 0 ? (
          <EmptyState title="No specialties available yet" />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {specialties.map((specialty) => (
              <Link
                key={specialty.slug}
                href={`/specialties/${specialty.slug}`}
                className="flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center transition-colors hover:border-brand-300 hover:bg-brand-50"
              >
                <SpecialtyIcon slug={specialty.slug} width={26} height={26} />
                <span className="text-sm font-medium text-ink">{specialty.name}</span>
              </Link>
            ))}
            <Link
              href="/specialties"
              className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 p-4 text-center transition-colors hover:bg-brand-50"
            >
              <GridIcon width={26} height={26} className="text-ink" />
              <span className="text-sm font-medium text-ink">Browse All</span>
            </Link>
          </div>
        )}
      </Container>

      <div className="border-t border-slate-200 bg-slate-50">
        <Container className="py-12 sm:py-16">
          <SectionHeading title="Doctors in Dhaka" seeAllHref="/doctors" seeAllLabel="View all doctors" />
          {featuredDoctors.length === 0 ? (
            <EmptyState
              title="No doctors published yet"
              description="Check back soon as we add more doctor profiles."
            />
          ) : (
            <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {featuredDoctors.map((doctor) => (
                <DoctorCard key={doctor.slug} doctor={doctor} variant="grid" />
              ))}
            </ul>
          )}
        </Container>
      </div>
    </div>
  );
}
