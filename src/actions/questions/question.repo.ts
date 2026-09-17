import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import type { Difficulty } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

type QuestionDatabase = Pick<Prisma.TransactionClient, "question" | "revision">;

export type RevisionScheduleItem = {
  dayOffset: number;
  revisionNumber: number;
  scheduledFor: Date;
};

export type QuestionWriteData = {
  difficulty: Difficulty;
  firstSolvedOn: Date;
  patternIds: string[];
  platformId: string;
  platformQuestionNumber: string | null;
  title: string;
  topicIds: string[];
  url: string;
};

export class QuestionRepository {
  constructor(private readonly db: QuestionDatabase = prisma) {}

  async runInTransaction<T>(
    operation: (repository: QuestionRepository) => Promise<T>,
  ) {
    return prisma.$transaction((transaction) =>
      operation(new QuestionRepository(transaction)),
    );
  }

  async create(
    data: QuestionWriteData & {
      revisionSchedule: RevisionScheduleItem[];
      userId: string;
    },
  ) {
    return this.db.question.create({
      data: {
        userId: data.userId,
        platformId: data.platformId,
        platformQuestionNumber: data.platformQuestionNumber,
        title: data.title,
        url: data.url,
        difficulty: data.difficulty,
        firstSolvedOn: data.firstSolvedOn,
        topics: {
          create: data.topicIds.map((topicId) => ({
            topic: { connect: { id: topicId } },
          })),
        },
        patterns: {
          create: data.patternIds.map((patternId) => ({
            pattern: { connect: { id: patternId } },
          })),
        },
        revisions: { create: data.revisionSchedule },
      },
      select: { id: true },
    });
  }

  async findOwnedById(questionId: string, userId: string) {
    return this.db.question.findFirst({
      where: { id: questionId, userId },
      select: { id: true },
    });
  }

  async update(questionId: string, data: QuestionWriteData) {
    return this.db.question.update({
      where: { id: questionId },
      data: {
        platformId: data.platformId,
        platformQuestionNumber: data.platformQuestionNumber,
        title: data.title,
        url: data.url,
        difficulty: data.difficulty,
        firstSolvedOn: data.firstSolvedOn,
        topics: {
          deleteMany: {},
          create: data.topicIds.map((topicId) => ({
            topic: { connect: { id: topicId } },
          })),
        },
        patterns: {
          deleteMany: {},
          create: data.patternIds.map((patternId) => ({
            pattern: { connect: { id: patternId } },
          })),
        },
      },
      select: { id: true },
    });
  }

  async updateRevisionSchedule(
    questionId: string,
    schedule: RevisionScheduleItem[],
  ) {
    await Promise.all(
      schedule.map((revision) =>
        this.db.revision.update({
          where: {
            questionId_revisionNumber: {
              questionId,
              revisionNumber: revision.revisionNumber,
            },
          },
          data: {
            dayOffset: revision.dayOffset,
            scheduledFor: revision.scheduledFor,
          },
        }),
      ),
    );
  }

  async archive(questionId: string, userId: string) {
    return this.db.question.updateMany({
      where: { id: questionId, userId, archivedAt: null },
      data: { archivedAt: new Date() },
    });
  }

  async restore(questionId: string, userId: string) {
    return this.db.question.updateMany({
      where: { id: questionId, userId, archivedAt: { not: null } },
      data: { archivedAt: null },
    });
  }

  async delete(questionId: string, userId: string) {
    return this.db.question.deleteMany({
      where: { id: questionId, userId },
    });
  }
}
