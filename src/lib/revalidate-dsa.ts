import "server-only";

import { revalidatePath } from "next/cache";

export function revalidateQuestionViews(questionId?: string) {
  revalidatePath("/");
  revalidatePath("/questions");

  if (questionId) {
    revalidatePath(`/questions/${questionId}`);
  }
}
