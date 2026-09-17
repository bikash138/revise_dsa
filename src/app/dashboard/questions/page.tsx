import type { Metadata } from "next";

import { QuestionList } from "@/components/questions/question-list";
import { ConfidenceLevel, Difficulty } from "@/generated/prisma/enums";
import { getQuestions, type QuestionFilters } from "@/queries/questions";
import { getQuestionFormOptions } from "@/queries/taxonomies";

export const metadata: Metadata = {
  title: "Questions",
};

function isEnumValue<T extends Record<string, string>>(
  enumObject: T,
  value: string | undefined,
): value is T[keyof T] {
  return value !== undefined && Object.values(enumObject).includes(value);
}

export default async function QuestionsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const difficulty = typeof params.difficulty === "string" ? params.difficulty : undefined;
  const confidence = typeof params.confidence === "string" ? params.confidence : undefined;
  const filters: QuestionFilters = {
    archived: params.archived === "true",
    confidence: isEnumValue(ConfidenceLevel, confidence) ? confidence : undefined,
    difficulty: isEnumValue(Difficulty, difficulty) ? difficulty : undefined,
    platformId:
      typeof params.platformId === "string" && params.platformId
        ? params.platformId
        : undefined,
    search:
      typeof params.search === "string" && params.search
        ? params.search
        : undefined,
  };
  const [questions, options] = await Promise.all([
    getQuestions(filters),
    getQuestionFormOptions(),
  ]);

  return (
    <QuestionList
      filters={filters}
      platforms={options.platforms}
      questions={questions}
    />
  );
}
