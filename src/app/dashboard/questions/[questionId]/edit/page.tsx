import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { QuestionEditor } from "@/components/questions/question-editor";
import { getQuestionById } from "@/queries/questions";
import { getQuestionFormOptions } from "@/queries/taxonomies";

export const metadata: Metadata = {
  title: "Edit question",
};

export default async function EditQuestionPage({
  params,
}: {
  params: Promise<{ questionId: string }>;
}) {
  const { questionId } = await params;
  const [question, options] = await Promise.all([
    getQuestionById(questionId),
    getQuestionFormOptions(),
  ]);

  if (!question) {
    notFound();
  }

  return <QuestionEditor mode="edit" options={options} question={question} />;
}
