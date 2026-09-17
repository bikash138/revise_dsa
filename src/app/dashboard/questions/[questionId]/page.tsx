import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { QuestionDetail } from "@/components/questions/question-detail";
import { getQuestionById } from "@/queries/questions";

export const metadata: Metadata = {
  title: "Question details",
};

export default async function QuestionDetailsPage({
  params,
}: {
  params: Promise<{ questionId: string }>;
}) {
  const { questionId } = await params;
  const question = await getQuestionById(questionId);

  if (!question) {
    notFound();
  }

  return <QuestionDetail question={question} />;
}
