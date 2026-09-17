import "server-only";

import { ConfidenceLevel } from "@/generated/prisma/enums";
import { getTodayInIst } from "@/lib/dsa/revision-schedule";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";

export async function getDashboardData() {
  const user = await requireUser();
  const todayInIst = getTodayInIst();

  const [confidenceGroups, dueRevisions, recentQuestions] = await Promise.all([
    prisma.question.groupBy({
      by: ["confidence"],
      where: { userId: user.id, archivedAt: null },
      _count: { _all: true },
    }),
    prisma.revision.findMany({
      where: {
        completedAt: null,
        scheduledFor: { lte: todayInIst },
        question: { userId: user.id, archivedAt: null },
      },
      include: {
        question: {
          include: { platform: true },
        },
      },
      orderBy: [{ scheduledFor: "asc" }, { revisionNumber: "asc" }],
    }),
    prisma.question.findMany({
      where: { userId: user.id, archivedAt: null },
      include: { platform: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const confidenceCounts = Object.fromEntries(
    confidenceGroups.map((group) => [group.confidence, group._count._all]),
  );

  return {
    confidenceCounts: {
      new: confidenceCounts[ConfidenceLevel.NEW] ?? 0,
      needsPractice: confidenceCounts[ConfidenceLevel.NEEDS_PRACTICE] ?? 0,
      improving: confidenceCounts[ConfidenceLevel.IMPROVING] ?? 0,
      strong: confidenceCounts[ConfidenceLevel.STRONG] ?? 0,
    },
    dueRevisions,
    recentQuestions,
    totalQuestions: confidenceGroups.reduce(
      (total, group) => total + group._count._all,
      0,
    ),
  };
}
