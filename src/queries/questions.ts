import "server-only";

import type {
  ConfidenceLevel,
  Difficulty,
} from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";

export type QuestionFilters = {
  archived?: boolean;
  confidence?: ConfidenceLevel;
  difficulty?: Difficulty;
  patternId?: string;
  platformId?: string;
  search?: string;
  topicId?: string;
};

export async function getQuestions(filters: QuestionFilters = {}) {
  const user = await requireUser();
  const search = filters.search?.trim();

  return prisma.question.findMany({
    where: {
      userId: user.id,
      archivedAt: filters.archived ? { not: null } : null,
      confidence: filters.confidence,
      difficulty: filters.difficulty,
      platformId: filters.platformId,
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" as const } },
              {
                platformQuestionNumber: {
                  contains: search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
      ...(filters.topicId
        ? { topics: { some: { topicId: filters.topicId } } }
        : {}),
      ...(filters.patternId
        ? { patterns: { some: { patternId: filters.patternId } } }
        : {}),
    },
    include: {
      platform: true,
      topics: { include: { topic: true } },
      patterns: { include: { pattern: true } },
      revisions: { orderBy: { revisionNumber: "asc" } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getQuestionById(questionId: string) {
  const user = await requireUser();

  return prisma.question.findFirst({
    where: { id: questionId, userId: user.id },
    include: {
      platform: true,
      topics: { include: { topic: true } },
      patterns: { include: { pattern: true } },
      revisions: { orderBy: { revisionNumber: "asc" } },
    },
  });
}
