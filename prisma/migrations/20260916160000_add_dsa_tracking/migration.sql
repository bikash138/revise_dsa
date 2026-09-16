-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "RevisionResult" AS ENUM ('SOLVED_INDEPENDENTLY', 'SOLVED_WITH_HINT', 'COULD_NOT_SOLVE');

-- CreateEnum
CREATE TYPE "ConfidenceLevel" AS ENUM ('NEW', 'NEEDS_PRACTICE', 'IMPROVING', 'STRONG');

-- CreateTable
CREATE TABLE "platform" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "platform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platformId" TEXT NOT NULL,
    "platformQuestionNumber" TEXT,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "firstSolvedOn" DATE NOT NULL,
    "confidence" "ConfidenceLevel" NOT NULL DEFAULT 'NEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),

    CONSTRAINT "question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revision" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "revisionNumber" INTEGER NOT NULL,
    "dayOffset" INTEGER NOT NULL,
    "scheduledFor" DATE NOT NULL,
    "completedAt" TIMESTAMP(3),
    "result" "RevisionResult",
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "revision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topic" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pattern" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pattern_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_topic" (
    "questionId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,

    CONSTRAINT "question_topic_pkey" PRIMARY KEY ("questionId","topicId")
);

-- CreateTable
CREATE TABLE "question_pattern" (
    "questionId" TEXT NOT NULL,
    "patternId" TEXT NOT NULL,

    CONSTRAINT "question_pattern_pkey" PRIMARY KEY ("questionId","patternId")
);

-- CreateIndex
CREATE UNIQUE INDEX "platform_slug_key" ON "platform"("slug");

-- CreateIndex
CREATE INDEX "question_userId_confidence_idx" ON "question"("userId", "confidence");

-- CreateIndex
CREATE INDEX "question_platformId_idx" ON "question"("platformId");

-- CreateIndex
CREATE UNIQUE INDEX "question_userId_url_key" ON "question"("userId", "url");

-- CreateIndex
CREATE UNIQUE INDEX "question_userId_platformId_platformQuestionNumber_key" ON "question"("userId", "platformId", "platformQuestionNumber");

-- CreateIndex
CREATE INDEX "revision_scheduledFor_completedAt_idx" ON "revision"("scheduledFor", "completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "revision_questionId_revisionNumber_key" ON "revision"("questionId", "revisionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "revision_questionId_dayOffset_key" ON "revision"("questionId", "dayOffset");

-- CreateIndex
CREATE UNIQUE INDEX "topic_userId_name_key" ON "topic"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "pattern_userId_name_key" ON "pattern"("userId", "name");

-- CreateIndex
CREATE INDEX "question_topic_topicId_idx" ON "question_topic"("topicId");

-- CreateIndex
CREATE INDEX "question_pattern_patternId_idx" ON "question_pattern"("patternId");

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question" ADD CONSTRAINT "question_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "platform"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "revision" ADD CONSTRAINT "revision_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "topic" ADD CONSTRAINT "topic_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pattern" ADD CONSTRAINT "pattern_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_topic" ADD CONSTRAINT "question_topic_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_topic" ADD CONSTRAINT "question_topic_topicId_fkey" FOREIGN KEY ("topicId") REFERENCES "topic"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_pattern" ADD CONSTRAINT "question_pattern_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_pattern" ADD CONSTRAINT "question_pattern_patternId_fkey" FOREIGN KEY ("patternId") REFERENCES "pattern"("id") ON DELETE CASCADE ON UPDATE CASCADE;
