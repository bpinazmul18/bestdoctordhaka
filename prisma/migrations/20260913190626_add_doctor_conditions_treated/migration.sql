-- AlterTable
ALTER TABLE "Doctor" ADD COLUMN     "conditionsTreated" TEXT[] DEFAULT ARRAY[]::TEXT[];
