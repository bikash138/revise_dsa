"use client";

import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  ArrowUpRight,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  archiveQuestionAction,
  deleteQuestionAction,
  restoreQuestionAction,
} from "@/actions/questions/question.actions";
import { PlatformIcon } from "@/components/platform-icon";
import { RevisionCard } from "@/components/revisions/revision-card";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  confidenceLabels,
  difficultyLabels,
  formatDisplayDate,
} from "@/lib/dsa/presentation";
import type { QuestionView } from "@/types/dsa";

export function QuestionDetail({ question }: { question: QuestionView }) {
  const router = useRouter();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isStatePending, startStateTransition] = useTransition();
  const [isDeletePending, startDeleteTransition] = useTransition();
  const data = question;

  function changeArchiveState() {
    setActionError(null);
    startStateTransition(async () => {
      const result = data.archivedAt
        ? await restoreQuestionAction({ id: data.id })
        : await archiveQuestionAction({ id: data.id });

      if (!result.success) {
        setActionError(result.error);
        toast.error(result.error);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  }

  function deleteQuestion() {
    setActionError(null);
    startDeleteTransition(async () => {
      const result = await deleteQuestionAction({ id: data.id });

      if (!result.success) {
        setActionError(result.error);
        toast.error(result.error);
        return;
      }

      toast.success(result.message);
      router.replace("/dashboard/questions");
    });
  }

  return (
    <div className="space-y-8">
      <header>
        <Link
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-400 hover:text-neutral-100"
          href="/dashboard/questions"
        >
          <ArrowLeft className="size-4" />
          Back to questions
        </Link>

        <div className="mt-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
              <span className="inline-flex items-center gap-2">
                <PlatformIcon slug={data.platform.slug} />
                {data.platform.name}
              </span>
              {data.platformQuestionNumber ? (
                <>
                  <span>·</span>
                  <span>Question {data.platformQuestionNumber}</span>
                </>
              ) : null}
            </div>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
              {data.title}
            </h1>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-white/[0.07] px-3 py-1.5 shadow-sm">
                {difficultyLabels[data.difficulty]}
              </span>
              <span className="rounded-full bg-emerald-400/15 px-3 py-1.5 font-medium text-emerald-300">
                {confidenceLabels[data.confidence]}
              </span>
              <span className="rounded-full bg-white/[0.07] px-3 py-1.5 shadow-sm">
                Solved {formatDisplayDate(data.firstSolvedOn)}
              </span>
              {data.archivedAt ? (
                <span className="rounded-full bg-neutral-800 px-3 py-1.5 text-white">
                  Archived
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm font-medium hover:bg-white/[0.08]"
              href={data.url}
              rel="noreferrer"
              target="_blank"
            >
              Open problem
              <ArrowUpRight className="size-4" />
            </a>
            <Link
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 text-sm font-medium hover:bg-white/[0.08]"
              href={`/dashboard/questions/${data.id}/edit`}
            >
              <Pencil className="size-4" />
              Edit
            </Link>
          </div>
        </div>
      </header>

      <section className="space-y-6">
        <article className="flex flex-col justify-between gap-4 rounded-2xl border border-white/[0.08] bg-[#1b231f] p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center">
          <div>
            <h2 className="font-semibold">Question controls</h2>
            <p className="mt-1 text-xs text-neutral-400">
              Archive this question or permanently remove its revision history.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
              <Button
                className="h-9 rounded-xl"
                disabled={isStatePending}
                onClick={changeArchiveState}
                size="sm"
                variant="outline"
              >
                {isStatePending ? (
                  <Spinner />
                ) : data.archivedAt ? (
                  <ArchiveRestore />
                ) : (
                  <Archive />
                )}
                {data.archivedAt ? "Restore question" : "Archive question"}
              </Button>
              <Button
                className="h-9 rounded-xl"
                onClick={() => {
                  setActionError(null);
                  setConfirmDelete(true);
                }}
                size="sm"
                variant="destructive"
              >
                <Trash2 />
                Delete permanently
              </Button>
          </div>
          {actionError && !confirmDelete ? (
            <p className="text-xs text-red-300 sm:basis-full">{actionError}</p>
          ) : null}
        </article>

        {confirmDelete ? (
          <article className="rounded-2xl border border-red-400/20 bg-red-400/10 p-5">
            <h2 className="font-semibold text-red-200">Delete this question?</h2>
            <p className="mt-2 text-sm leading-6 text-red-300">
              Its revision history and notes will also be permanently removed.
            </p>
            <div className="mt-4 flex gap-2">
              <Button
                className="rounded-xl"
                onClick={() => setConfirmDelete(false)}
                size="sm"
                variant="outline"
              >
                Cancel
              </Button>
              <Button
                className="rounded-xl"
                disabled={isDeletePending}
                onClick={deleteQuestion}
                size="sm"
                variant="destructive"
              >
                {isDeletePending ? (
                  <Spinner />
                ) : null}
                Delete
              </Button>
            </div>
            {actionError ? (
              <p className="mt-3 text-xs text-red-300">{actionError}</p>
            ) : null}
          </article>
        ) : null}

        <section>
          <div className="mb-4">
            <h2 className="text-xl font-semibold tracking-tight">Revision timeline</h2>
            <p className="mt-1 text-sm text-neutral-400">
              Record the result and mistakes from every revisit.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {data.revisions.map((revision) => (
              <RevisionCard compact key={revision.id} revision={revision} />
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
