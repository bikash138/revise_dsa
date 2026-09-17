import "server-only";

import { revalidatePath } from "next/cache";

export function revalidateQuestionViews(questionId?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/questions");
  revalidatePath("/dashboard/revisions");

  if (questionId) {
    revalidatePath(`/dashboard/questions/${questionId}`);
    revalidatePath(`/dashboard/questions/${questionId}/edit`);
  }
}
