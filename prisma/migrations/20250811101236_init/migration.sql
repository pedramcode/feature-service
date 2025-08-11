-- CreateTable
CREATE TABLE "public"."Feature" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "key" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "desc" TEXT,

    CONSTRAINT "Feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."_FeatureDeps" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL,

    CONSTRAINT "_FeatureDeps_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Feature_key_key" ON "public"."Feature"("key");

-- CreateIndex
CREATE INDEX "_FeatureDeps_B_index" ON "public"."_FeatureDeps"("B");

-- AddForeignKey
ALTER TABLE "public"."_FeatureDeps" ADD CONSTRAINT "_FeatureDeps_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_FeatureDeps" ADD CONSTRAINT "_FeatureDeps_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;
