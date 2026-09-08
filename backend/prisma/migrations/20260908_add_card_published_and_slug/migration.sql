-- AlterTable
ALTER TABLE "business_cards" ADD COLUMN IF NOT EXISTS "is_published" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "business_cards" ADD COLUMN IF NOT EXISTS "slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "business_cards_slug_key" ON "business_cards"("slug");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "business_cards_slug_idx" ON "business_cards"("slug");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "business_cards_is_published_idx" ON "business_cards"("is_published");
