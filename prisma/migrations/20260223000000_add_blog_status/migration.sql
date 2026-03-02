-- CreateEnum
CREATE TYPE "BlogStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- AlterTable
ALTER TABLE "Blog" ADD COLUMN "status" "BlogStatus" NOT NULL DEFAULT 'PUBLISHED';
