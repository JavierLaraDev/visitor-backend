-- CreateEnum
CREATE TYPE "VisitorType" AS ENUM ('STUDENT', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "AttentionStatus" AS ENUM ('PENDING', 'ATTENDED');

-- CreateTable
CREATE TABLE "Visitor" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "secondLastName" TEXT,
    "phone" TEXT NOT NULL,
    "visitorType" "VisitorType" NOT NULL,
    "major" TEXT,
    "reason" TEXT NOT NULL,
    "status" "AttentionStatus" NOT NULL DEFAULT 'PENDING',
    "registeredById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Visitor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Visitor" ADD CONSTRAINT "Visitor_registeredById_fkey" FOREIGN KEY ("registeredById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
