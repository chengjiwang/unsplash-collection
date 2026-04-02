-- CreateTable
CREATE TABLE "collections" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_images" (
    "id" TEXT NOT NULL,
    "collection_id" TEXT NOT NULL,
    "image_id" VARCHAR(100) NOT NULL,
    "image_url" TEXT NOT NULL,
    "thumb_url" TEXT NOT NULL,
    "author_name" VARCHAR(255) NOT NULL,
    "published_at" TIMESTAMP(3) NOT NULL,
    "added_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "collection_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "collections_name_key" ON "collections"("name");

-- CreateIndex
CREATE UNIQUE INDEX "collection_images_collection_id_image_id_key" ON "collection_images"("collection_id", "image_id");

-- AddForeignKey
ALTER TABLE "collection_images" ADD CONSTRAINT "collection_images_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
