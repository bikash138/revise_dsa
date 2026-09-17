import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";

async function getCachedQuestionFormOptions() {
  "use cache";

  cacheLife("hours");
  cacheTag("question-form-options");

  const [platforms, topics, patterns] = await Promise.all([
    prisma.platform.findMany({ orderBy: { name: "asc" } }),
    prisma.topic.findMany({ orderBy: { name: "asc" } }),
    prisma.pattern.findMany({ orderBy: { name: "asc" } }),
  ]);

  return { platforms, topics, patterns };
}

export async function getQuestionFormOptions() {
  await requireUser();

  return getCachedQuestionFormOptions();
}
