-- DropForeignKey
ALTER TABLE "topic" DROP CONSTRAINT "topic_userId_fkey";

-- DropForeignKey
ALTER TABLE "pattern" DROP CONSTRAINT "pattern_userId_fkey";

-- DropIndex
DROP INDEX "topic_userId_name_key";

-- DropIndex
DROP INDEX "pattern_userId_name_key";

-- AlterTable
ALTER TABLE "topic" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "pattern" DROP COLUMN "userId";

-- CreateIndex
CREATE UNIQUE INDEX "topic_name_key" ON "topic"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pattern_name_key" ON "pattern"("name");
