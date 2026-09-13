import { describe, expect, it } from "vitest";
import { toDoctorListItemDTO, toDoctorProfileDTO } from "./doctor.mapper";
import type { DoctorListRecord, DoctorProfileRecord } from "./doctor.repository";

const specialty = {
  id: "specialty-1",
  slug: "cardiology",
  name: "Cardiology",
  description: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const location = {
  id: "location-1",
  slug: "dhanmondi",
  name: "Dhanmondi",
  city: "Dhaka",
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("toDoctorListItemDTO", () => {
  it("should never leak internal ids or FK fields onto the public DTO", () => {
    const record = {
      id: "doctor-1",
      slug: "dr-test-rahman",
      fullName: "Dr. Test Rahman",
      degrees: "MBBS",
      designation: null,
      shortBio: null,
      profileImageUrl: null,
      yearsOfExperience: null,
      primarySpecialtyId: "specialty-1",
      status: "PUBLISHED",
      createdAt: new Date(),
      updatedAt: new Date(),
      primarySpecialty: specialty,
      chambers: [{ location }],
    } as unknown as DoctorListRecord;

    const dto = toDoctorListItemDTO(record);

    expect(dto).toEqual({
      slug: "dr-test-rahman",
      fullName: "Dr. Test Rahman",
      degrees: "MBBS",
      designation: null,
      profileImageUrl: null,
      primarySpecialty: { slug: "cardiology", name: "Cardiology" },
      locationSummary: "Dhanmondi",
    });
    expect(dto).not.toHaveProperty("id");
    expect(dto).not.toHaveProperty("primarySpecialtyId");
  });

  it("should summarize multiple distinct chamber locations", () => {
    const record = {
      slug: "dr-test-rahman",
      fullName: "Dr. Test Rahman",
      degrees: null,
      designation: null,
      profileImageUrl: null,
      primarySpecialty: specialty,
      chambers: [{ location }, { location: { ...location, slug: "gulshan", name: "Gulshan" } }],
    } as unknown as DoctorListRecord;

    const dto = toDoctorListItemDTO(record);

    expect(dto.locationSummary).toBe("Dhanmondi +1 more");
  });

  it("should report no location summary when there are no chambers", () => {
    const record = {
      slug: "dr-test-rahman",
      fullName: "Dr. Test Rahman",
      degrees: null,
      designation: null,
      profileImageUrl: null,
      primarySpecialty: specialty,
      chambers: [],
    } as unknown as DoctorListRecord;

    expect(toDoctorListItemDTO(record).locationSummary).toBeNull();
  });
});

describe("toDoctorProfileDTO", () => {
  it("should map full profile relations and omit unset fields as null rather than fabricating values", () => {
    const record = {
      id: "doctor-1",
      slug: "dr-test-rahman",
      fullName: "Dr. Test Rahman",
      degrees: "MBBS",
      designation: "Consultant",
      shortBio: null,
      profileImageUrl: null,
      yearsOfExperience: null,
      primarySpecialtyId: "specialty-1",
      status: "PUBLISHED",
      createdAt: new Date(),
      updatedAt: new Date(),
      primarySpecialty: specialty,
      specialties: [{ doctorId: "doctor-1", specialtyId: "specialty-1", specialty }],
      hospitals: [
        {
          doctorId: "doctor-1",
          hospitalId: "hospital-1",
          hospital: { id: "hospital-1", slug: "square-hospital", name: "Square Hospital", locationId: "location-1", createdAt: new Date(), updatedAt: new Date() },
        },
      ],
      chambers: [
        {
          id: "chamber-1",
          doctorId: "doctor-1",
          hospitalId: "hospital-1",
          locationId: "location-1",
          name: "Chamber A",
          addressLine: "123 Road",
          contactPhone: "0123",
          whatsappNumber: null,
          visitingHoursNote: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          location,
          hospital: { id: "hospital-1", slug: "square-hospital", name: "Square Hospital", locationId: "location-1", createdAt: new Date(), updatedAt: new Date() },
        },
      ],
    } as unknown as DoctorProfileRecord;

    const dto = toDoctorProfileDTO(record);

    expect(dto).toEqual({
      slug: "dr-test-rahman",
      fullName: "Dr. Test Rahman",
      degrees: "MBBS",
      designation: "Consultant",
      shortBio: null,
      profileImageUrl: null,
      yearsOfExperience: null,
      primarySpecialty: { slug: "cardiology", name: "Cardiology" },
      specialties: [{ slug: "cardiology", name: "Cardiology" }],
      hospitalNames: ["Square Hospital"],
      chambers: [
        {
          name: "Chamber A",
          addressLine: "123 Road",
          contactPhone: "0123",
          whatsappNumber: null,
          visitingHoursNote: null,
          location: { slug: "dhanmondi", name: "Dhanmondi", city: "Dhaka" },
          hospitalName: "Square Hospital",
        },
      ],
    });
  });

  it("should report a null hospitalName when a chamber has no hospital", () => {
    const record = {
      slug: "dr-test-rahman",
      fullName: "Dr. Test Rahman",
      degrees: null,
      designation: null,
      shortBio: null,
      profileImageUrl: null,
      yearsOfExperience: null,
      primarySpecialty: specialty,
      specialties: [],
      hospitals: [],
      chambers: [
        {
          name: null,
          addressLine: "45 Avenue",
          contactPhone: null,
          whatsappNumber: null,
          visitingHoursNote: null,
          location,
          hospital: null,
        },
      ],
    } as unknown as DoctorProfileRecord;

    expect(toDoctorProfileDTO(record).chambers[0].hospitalName).toBeNull();
  });
});
