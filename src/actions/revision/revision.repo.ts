import "server-only";

import type { Prisma } from "@/generated/prisma/client";
import type {
  ConfidenceLevel,
  RevisionResult,
} from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

type RevisionDatabase = Pick<Prisma.TransactionClient, "question" | "revision">;

export class RevisionRepository {
  constructor(private readonly db: RevisionDatabase = prisma) {}

  async runInTransaction<T>(
    operation: (repository: RevisionRepository) => Promise<T>,
  ) {
    return prisma.$transaction((transaction) =>
      operation(new RevisionRepository(transaction)),
    );
  }

  async findOwnedById(revisionId: string, userId: string) {
    return this.db.revision.findFirst({
      where: { id: revisionId, question: { userId } },
      select: { completedAt: true, id: true, questionId: true },
    });
  }

  async complete(
    revisionId: string,
    data: { notes: string | null; result: RevisionResult },
  ) {
    return this.db.revision.update({
      where: { id: revisionId },
      data: { completedAt: new Date(), ...data },
    });
  }

  async update(
    revisionId: string,
    data: { notes: string | null; result: RevisionResult },
  ) {
    return this.db.revision.update({
      where: { id: revisionId },
      data,
    });
  }

  async reopen(revisionId: string) {
    return this.db.revision.update({
      where: { id: revisionId },
      data: { completedAt: null, result: null, notes: null },
    });
  }

  async getCompletedResults(questionId: string) {
    return this.db.revision.findMany({
      where: {
        questionId,
        completedAt: { not: null },
        result: { not: null },
      },
      orderBy: { completedAt: "asc" },
      select: { result: true },
    });
  }

  async updateQuestionConfidence(
    questionId: string,
    confidence: ConfidenceLevel,
  ) {
    return this.db.question.update({
      where: { id: questionId },
      data: { confidence },
    });
  }
}
