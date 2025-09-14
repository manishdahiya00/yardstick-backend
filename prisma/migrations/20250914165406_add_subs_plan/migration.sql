-- CreateEnum
CREATE TYPE "public"."SubsPlan" AS ENUM ('FREE', 'PRO');

-- AlterTable
ALTER TABLE "public"."Tenant" ADD COLUMN     "plan" "public"."SubsPlan" NOT NULL DEFAULT 'FREE';
