-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AlterTable: add user_id as nullable first to handle existing data
ALTER TABLE "collections" ADD COLUMN "user_id" TEXT;

-- DataMigration: create a default user and assign existing collections to it
DO $$
DECLARE
  default_user_id TEXT := gen_random_uuid()::TEXT;
BEGIN
  IF EXISTS (SELECT 1 FROM "collections" WHERE "user_id" IS NULL) THEN
    INSERT INTO "users" ("id", "email", "password_hash", "created_at")
    VALUES (default_user_id, 'default@example.com', '', NOW());
    UPDATE "collections" SET "user_id" = default_user_id WHERE "user_id" IS NULL;
  END IF;
END $$;

-- AlterTable: make user_id NOT NULL
ALTER TABLE "collections" ALTER COLUMN "user_id" SET NOT NULL;

-- DropIndex: remove old global unique constraint on name
DROP INDEX IF EXISTS "collections_name_key";

-- CreateIndex: new per-user unique constraint
CREATE UNIQUE INDEX "collections_user_id_name_key" ON "collections"("user_id", "name");

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
