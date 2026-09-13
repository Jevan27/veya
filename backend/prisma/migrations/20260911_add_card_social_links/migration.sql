-- AlterTable
ALTER TABLE "business_cards" ADD COLUMN IF NOT EXISTS "social_links" JSONB DEFAULT '[]';
