-- AlterTable
ALTER TABLE "auth" ADD COLUMN "refresh_token" TEXT;
ALTER TABLE "auth" ADD COLUMN "token_expiry" DATETIME;
