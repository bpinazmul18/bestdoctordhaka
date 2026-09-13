-- CreateTable
CREATE TABLE "DiagnosticTest" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiagnosticTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiagnosticCenter" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiagnosticCenter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiagnosticCenterTest" (
    "diagnosticCenterId" TEXT NOT NULL,
    "diagnosticTestId" TEXT NOT NULL,

    CONSTRAINT "DiagnosticCenterTest_pkey" PRIMARY KEY ("diagnosticCenterId","diagnosticTestId")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiagnosticTest_slug_key" ON "DiagnosticTest"("slug");

-- CreateIndex
CREATE INDEX "DiagnosticTest_slug_idx" ON "DiagnosticTest"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "DiagnosticCenter_slug_key" ON "DiagnosticCenter"("slug");

-- CreateIndex
CREATE INDEX "DiagnosticCenter_locationId_idx" ON "DiagnosticCenter"("locationId");

-- CreateIndex
CREATE INDEX "DiagnosticCenterTest_diagnosticTestId_idx" ON "DiagnosticCenterTest"("diagnosticTestId");

-- AddForeignKey
ALTER TABLE "DiagnosticCenter" ADD CONSTRAINT "DiagnosticCenter_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiagnosticCenterTest" ADD CONSTRAINT "DiagnosticCenterTest_diagnosticCenterId_fkey" FOREIGN KEY ("diagnosticCenterId") REFERENCES "DiagnosticCenter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiagnosticCenterTest" ADD CONSTRAINT "DiagnosticCenterTest_diagnosticTestId_fkey" FOREIGN KEY ("diagnosticTestId") REFERENCES "DiagnosticTest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
