import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/site";
import { listAllSpecialtySlugs } from "@/modules/specialty/specialty.service";
import { listAllLocationSlugs } from "@/modules/location/location.service";
import { listAllHospitalSlugs } from "@/modules/hospital/hospital.service";
import { listAllDiagnosticCenterSlugs } from "@/modules/diagnostic-center/diagnostic-center.service";
import { listAllPublishedDoctorSlugs } from "@/modules/doctor/doctor.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [specialtySlugs, locationSlugs, hospitalSlugs, diagnosticCenterSlugs, doctorSlugs] = await Promise.all([
    listAllSpecialtySlugs(),
    listAllLocationSlugs(),
    listAllHospitalSlugs(),
    listAllDiagnosticCenterSlugs(),
    listAllPublishedDoctorSlugs(),
  ]);

  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/doctors`, changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/specialties`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/locations`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/hospitals`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/diagnostic-centers`, changeFrequency: "weekly", priority: 0.6 },
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
    ...hospitalSlugs.map((slug) => ({
      url: `${SITE_URL}/hospitals/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...diagnosticCenterSlugs.map((slug) => ({
      url: `${SITE_URL}/diagnostic-centers/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...doctorSlugs.map((slug) => ({
      url: `${SITE_URL}/doctors/${slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
