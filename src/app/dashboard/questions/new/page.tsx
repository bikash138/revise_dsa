import type { Metadata } from "next";

import { QuestionEditor } from "@/components/questions/question-editor";
import { getQuestionFormOptions } from "@/queries/taxonomies";

export const metadata: Metadata = {
  title: "Add question",
};

export default async function NewQuestionPage() {
  const options = await getQuestionFormOptions();

  return <QuestionEditor mode="create" options={options} />;
}
