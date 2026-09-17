"use server";

import { calculateConfidence } from "@/lib/dsa/confidence";
import { requireUser } from "@/lib/require-user";
import { revalidateQuestionViews } from "@/lib/revalidate-dsa";
import { ActionError, runServerAction } from "@/lib/server-action";

import { RevisionRepository } from "./revision.repo";
import {
  completeRevisionSchema,
  revisionIdSchema,
  type CompleteRevisionInput,
  type RevisionIdInput,
  type UpdateRevisionInput,
  updateRevisionSchema,
} from "./revision.validation";

const revisionRepository = new RevisionRepository();

async function recalculateConfidence(
  repository: RevisionRepository,
  questionId: string,
) {
  const completedRevisions = await repository.getCompletedResults(questionId);
  const confidence = calculateConfidence(
    completedRevisions.flatMap(({ result }) => (result ? [result] : [])),
  );

  await repository.updateQuestionConfidence(questionId, confidence);

  return confidence;
}

export async function completeRevisionAction(input: CompleteRevisionInput) {
  return runServerAction(completeRevisionSchema, input, async (data) => {
    const user = await requireUser();
    const result = await revisionRepository.runInTransaction(
      async (repository) => {
        const revision = await repository.findOwnedById(data.id, user.id);

        if (!revision) {
          throw new ActionError("Revision not found.");
        }

        if (revision.completedAt) {
          throw new ActionError("This revision is already completed.");
        }

        await repository.complete(revision.id, data);
        const confidence = await recalculateConfidence(
          repository,
          revision.questionId,
        );

        return { confidence, revision };
      },
    );

    revalidateQuestionViews(result.revision.questionId);

    return {
      data: {
        questionId: result.revision.questionId,
        revisionId: result.revision.id,
        confidence: result.confidence,
      },
      message: "Revision completed.",
    };
  });
}

export async function updateRevisionAction(input: UpdateRevisionInput) {
  return runServerAction(updateRevisionSchema, input, async (data) => {
    const user = await requireUser();
    const result = await revisionRepository.runInTransaction(
      async (repository) => {
        const revision = await repository.findOwnedById(data.id, user.id);

        if (!revision) {
          throw new ActionError("Revision not found.");
        }

        if (!revision.completedAt) {
          throw new ActionError(
            "Complete this revision before editing it.",
          );
        }

        await repository.update(revision.id, data);
        const confidence = await recalculateConfidence(
          repository,
          revision.questionId,
        );

        return { confidence, revision };
      },
    );

    revalidateQuestionViews(result.revision.questionId);

    return {
      data: {
        questionId: result.revision.questionId,
        revisionId: result.revision.id,
        confidence: result.confidence,
      },
      message: "Revision updated.",
    };
  });
}

export async function reopenRevisionAction(input: RevisionIdInput) {
  return runServerAction(revisionIdSchema, input, async (data) => {
    const user = await requireUser();
    const result = await revisionRepository.runInTransaction(
      async (repository) => {
        const revision = await repository.findOwnedById(data.id, user.id);

        if (!revision) {
          throw new ActionError("Revision not found.");
        }

        if (!revision.completedAt) {
          throw new ActionError("This revision is already open.");
        }

        await repository.reopen(revision.id);
        const confidence = await recalculateConfidence(
          repository,
          revision.questionId,
        );

        return { confidence, revision };
      },
    );

    revalidateQuestionViews(result.revision.questionId);

    return {
      data: {
        questionId: result.revision.questionId,
        revisionId: result.revision.id,
        confidence: result.confidence,
      },
      message: "Revision reopened.",
    };
  });
}
