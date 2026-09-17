"use server";

import {
  buildRevisionSchedule,
  dateOnlyToDatabaseDate,
} from "@/lib/dsa/revision-schedule";
import { requireUser } from "@/lib/require-user";
import { revalidateQuestionViews } from "@/lib/revalidate-dsa";
import { ActionError, runServerAction } from "@/lib/server-action";

import { QuestionRepository } from "./question.repo";
import {
  createQuestionSchema,
  questionIdSchema,
  type CreateQuestionInput,
  type QuestionIdInput,
  type UpdateQuestionInput,
  updateQuestionSchema,
} from "./question.validation";

const questionRepository = new QuestionRepository();

export async function createQuestionAction(input: CreateQuestionInput) {
  return runServerAction(createQuestionSchema, input, async (data) => {
    const user = await requireUser();
    const firstSolvedOn = dateOnlyToDatabaseDate(data.firstSolvedOn);
    const question = await questionRepository.create({
      ...data,
      firstSolvedOn,
      revisionSchedule: buildRevisionSchedule(firstSolvedOn),
      userId: user.id,
    });

    revalidateQuestionViews(question.id);

    return {
      data: { questionId: question.id },
      message: "Question added to your revision plan.",
    };
  });
}

export async function updateQuestionAction(input: UpdateQuestionInput) {
  return runServerAction(updateQuestionSchema, input, async (data) => {
    const user = await requireUser();
    const firstSolvedOn = dateOnlyToDatabaseDate(data.firstSolvedOn);
    const revisionSchedule = buildRevisionSchedule(firstSolvedOn);
    const updated = await questionRepository.runInTransaction(
      async (repository) => {
        const question = await repository.findOwnedById(data.id, user.id);

        if (!question) {
          throw new ActionError("Question not found.");
        }

        await repository.update(question.id, { ...data, firstSolvedOn });
        await repository.updateRevisionSchedule(question.id, revisionSchedule);

        return question;
      },
    );

    revalidateQuestionViews(updated.id);

    return {
      data: { questionId: updated.id },
      message: "Question updated.",
    };
  });
}

export async function archiveQuestionAction(input: QuestionIdInput) {
  return runServerAction(questionIdSchema, input, async (data) => {
    const user = await requireUser();
    const result = await questionRepository.archive(data.id, user.id);

    if (result.count === 0) {
      throw new ActionError("Active question not found.");
    }

    revalidateQuestionViews(data.id);

    return {
      data: { questionId: data.id },
      message: "Question archived.",
    };
  });
}

export async function restoreQuestionAction(input: QuestionIdInput) {
  return runServerAction(questionIdSchema, input, async (data) => {
    const user = await requireUser();
    const result = await questionRepository.restore(data.id, user.id);

    if (result.count === 0) {
      throw new ActionError("Archived question not found.");
    }

    revalidateQuestionViews(data.id);

    return {
      data: { questionId: data.id },
      message: "Question restored.",
    };
  });
}

export async function deleteQuestionAction(input: QuestionIdInput) {
  return runServerAction(questionIdSchema, input, async (data) => {
    const user = await requireUser();
    const result = await questionRepository.delete(data.id, user.id);

    if (result.count === 0) {
      throw new ActionError("Question not found.");
    }

    revalidateQuestionViews();

    return {
      data: { questionId: data.id },
      message: "Question permanently deleted.",
    };
  });
}
