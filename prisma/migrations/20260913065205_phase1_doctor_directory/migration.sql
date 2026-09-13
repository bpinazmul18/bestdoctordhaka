-- CreateEnum
CREATE TYPE "DoctorStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "Specialty" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Specialty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hospital" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hospital_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Doctor" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "degrees" TEXT,
    "designation" TEXT,
    "shortBio" TEXT,
    "profileImageUrl" TEXT,
    "yearsOfExperience" INTEGER,
    "primarySpecialtyId" TEXT NOT NULL,
    "status" "DoctorStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorSpecialty" (
    "doctorId" TEXT NOT NULL,
    "specialtyId" TEXT NOT NULL,

    CONSTRAINT "DoctorSpecialty_pkey" PRIMARY KEY ("doctorId","specialtyId")
);

-- CreateTable
CREATE TABLE "DoctorHospital" (
    "doctorId" TEXT NOT NULL,
    "hospitalId" TEXT NOT NULL,

    CONSTRAINT "DoctorHospital_pkey" PRIMARY KEY ("doctorId","hospitalId")
);

-- CreateTable
CREATE TABLE "Chamber" (
    "id" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,
    "hospitalId" TEXT,
    "locationId" TEXT NOT NULL,
    "name" TEXT,
    "addressLine" TEXT NOT NULL,
    "contactPhone" TEXT,
    "whatsappNumber" TEXT,
    "visitingHoursNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Chamber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Specialty_slug_key" ON "Specialty"("slug");

-- CreateIndex
CREATE INDEX "Specialty_slug_idx" ON "Specialty"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Location_slug_key" ON "Location"("slug");

-- CreateIndex
CREATE INDEX "Location_slug_idx" ON "Location"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Hospital_slug_key" ON "Hospital"("slug");

-- CreateIndex
CREATE INDEX "Hospital_locationId_idx" ON "Hospital"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_slug_key" ON "Doctor"("slug");

-- CreateIndex
CREATE INDEX "Doctor_status_idx" ON "Doctor"("status");

-- CreateIndex
CREATE INDEX "Doctor_primarySpecialtyId_idx" ON "Doctor"("primarySpecialtyId");

-- CreateIndex
CREATE INDEX "Doctor_status_primarySpecialtyId_idx" ON "Doctor"("status", "primarySpecialtyId");

-- CreateIndex
CREATE INDEX "DoctorSpecialty_specialtyId_idx" ON "DoctorSpecialty"("specialtyId");

-- CreateIndex
CREATE INDEX "DoctorHospital_hospitalId_idx" ON "DoctorHospital"("hospitalId");

-- CreateIndex
CREATE INDEX "Chamber_doctorId_idx" ON "Chamber"("doctorId");

-- CreateIndex
CREATE INDEX "Chamber_locationId_idx" ON "Chamber"("locationId");

-- CreateIndex
CREATE INDEX "Chamber_hospitalId_idx" ON "Chamber"("hospitalId");

-- AddForeignKey
ALTER TABLE "Hospital" ADD CONSTRAINT "Hospital_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doctor" ADD CONSTRAINT "Doctor_primarySpecialtyId_fkey" FOREIGN KEY ("primarySpecialtyId") REFERENCES "Specialty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorSpecialty" ADD CONSTRAINT "DoctorSpecialty_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorSpecialty" ADD CONSTRAINT "DoctorSpecialty_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "Specialty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorHospital" ADD CONSTRAINT "DoctorHospital_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorHospital" ADD CONSTRAINT "DoctorHospital_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chamber" ADD CONSTRAINT "Chamber_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chamber" ADD CONSTRAINT "Chamber_hospitalId_fkey" FOREIGN KEY ("hospitalId") REFERENCES "Hospital"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chamber" ADD CONSTRAINT "Chamber_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
