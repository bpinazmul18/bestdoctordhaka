import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";
import { listAllSpecialtySlugs } from "@/modules/specialty/specialty.service";
import { listAllLocationSlugs } from "@/modules/location/location.service";
import { listAllPublishedDoctorSlugs } from "@/modules/doctor/doctor.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [specialtySlugs, locationSlugs, doctorSlugs] = await Promise.all([
    listAllSpecialtySlugs(),
    listAllLocationSlugs(),
    listAllPublishedDoctorSlugs(),
  ]);

  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/doctors`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/specialties`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/locations`, changeFrequency: "weekly", priority: 0.6 },
    ...specialtySlugs.map((slug) => ({
      url: `${SITE_URL}/specialties/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...locationSlugs.map((slug) => ({
      url: `${SITE_URL}/locations/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...doctorSlugs.map((slug) => ({
      url: `${SITE_URL}/doctors/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
