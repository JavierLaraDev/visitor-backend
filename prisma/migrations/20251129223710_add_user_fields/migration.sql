-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "major" TEXT,
ADD COLUMN     "middleName" TEXT,
ADD COLUMN     "secondLastName" TEXT,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'ACTIVE';
