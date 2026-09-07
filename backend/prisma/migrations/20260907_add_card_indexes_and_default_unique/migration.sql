-- CreateIndex on foreign key user_id for fast user card lookups and cascading checks
CREATE INDEX IF NOT EXISTS "business_cards_user_id_idx" ON "business_cards"("user_id");

-- CreateIndex on (user_id, is_default) for sorting, default checks, and filtered queries
CREATE INDEX IF NOT EXISTS "business_cards_user_id_is_default_idx" ON "business_cards"("user_id", "is_default");

-- CreatePartialUniqueIndex: Enforce at most one default card per user at database level
CREATE UNIQUE INDEX IF NOT EXISTS "business_cards_user_default_unique" ON "business_cards"("user_id") WHERE ("is_default" = true);
