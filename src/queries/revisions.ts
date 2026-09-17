import "server-only";

import { getTodayInIst } from "@/lib/dsa/revision-schedule";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import type { RevisionQueueFilter } from "@/types/dsa";

export async function getRevisions(filter: RevisionQueueFilter) {
  const user = await requireUser();
  const today = getTodayInIst();

  return prisma.revision.findMany({
    where: {
      question: { archivedAt: null, userId: user.id },
      ...(filter === "completed"
        ? { completedAt: { not: null } }
        : {
            completedAt: null,
            scheduledFor:
              filter === "due" ? { lte: today } : { gt: today },
          }),
    },
    include: {
      question: {
        select: {
          confidence: true,
          difficulty: true,
          id: true,
          patterns: { include: { pattern: true } },
          platform: true,
          title: true,
          topics: { include: { topic: true } },
          url: true,
        },
      },
    },
    ...(filter === "upcoming" ? { distinct: ["questionId"] } : {}),
    orderBy:
      filter === "completed"
        ? [{ completedAt: "desc" }, { questionId: "asc" }]
        : [
            { scheduledFor: "asc" },
            { questionId: "asc" },
            { revisionNumber: "asc" },
          ],
    take: 100,
  });
}
