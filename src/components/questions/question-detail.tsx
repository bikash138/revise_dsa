"use client";

import {
  Archive,
  ArchiveRestore,
  ArrowLeft,
  ArrowUpRight,
  LoaderCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  archiveQuestionAction,
  deleteQuestionAction,
  restoreQuestionAction,
} from "@/actions/questions/question.actions";
import { RevisionCard } from "@/components/revisions/revision-card";
import { Button } from "@/components/ui/button";
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
        return;
      }

      router.refresh();
    });
  }

  function deleteQuestion() {
    setActionError(null);
    startDeleteTransition(async () => {
      const result = await deleteQuestionAction({ id: data.id });

      if (!result.success) {
        setActionError(result.error);
        return;
      }

      router.replace("/dashboard/questions");
    });
  }

  return (
    <div className="space-y-8">
      <header>
        <Link
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-950"
          href="/dashboard/questions"
        >
          <ArrowLeft className="size-4" />
          Back to questions
        </Link>

        <div className="mt-6 flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              <span>{data.platform.name}</span>
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
              <span className="rounded-full bg-white px-3 py-1.5 shadow-sm">
                {difficultyLabels[data.difficulty]}
              </span>
              <span className="rounded-full bg-emerald-100 px-3 py-1.5 font-medium text-emerald-800">
                {confidenceLabels[data.confidence]}
              </span>
              <span className="rounded-full bg-white px-3 py-1.5 shadow-sm">
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
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 text-sm font-medium hover:bg-neutral-50"
              href={data.url}
              rel="noreferrer"
              target="_blank"
            >
              Open problem
              <ArrowUpRight className="size-4" />
            </a>
            <Link
              className="inline-flex h-9 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 text-sm font-medium hover:bg-neutral-50"
              href={`/dashboard/questions/${data.id}/edit`}
            >
              <Pencil className="size-4" />
              Edit
            </Link>
          </div>
        </div>
      </header>

      <section className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="space-y-5">
          <article className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-sm">
            <h2 className="font-semibold">Classification</h2>
            <div className="mt-5 space-y-5">
              <TagGroup label="Topics" values={data.topics.map(({ topic }) => topic.name)} />
              <TagGroup label="Patterns" values={data.patterns.map(({ pattern }) => pattern.name)} accent />
            </div>
          </article>

          <article className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-sm">
            <h2 className="font-semibold">Question controls</h2>
            <div className="mt-4 flex flex-col gap-2">
              <Button
                className="h-10 justify-start rounded-xl"
                disabled={isStatePending}
                onClick={changeArchiveState}
                variant="outline"
              >
                {isStatePending ? (
                  <LoaderCircle className="animate-spin" />
                ) : data.archivedAt ? (
                  <ArchiveRestore />
                ) : (
                  <Archive />
                )}
                {data.archivedAt ? "Restore question" : "Archive question"}
              </Button>
              <Button
                className="h-10 justify-start rounded-xl"
                onClick={() => {
                  setActionError(null);
                  setConfirmDelete(true);
                }}
                variant="destructive"
              >
                <Trash2 />
                Delete permanently
              </Button>
              {actionError && !confirmDelete ? (
                <p className="mt-2 text-xs text-red-700">{actionError}</p>
              ) : null}
            </div>
          </article>

          {confirmDelete ? (
            <article className="rounded-3xl border border-red-200 bg-red-50 p-6">
              <h2 className="font-semibold text-red-950">Delete this question?</h2>
              <p className="mt-2 text-sm leading-6 text-red-800">
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
                    <LoaderCircle className="animate-spin" />
                  ) : null}
                  Delete
                </Button>
              </div>
              {actionError ? (
                <p className="mt-3 text-xs text-red-800">{actionError}</p>
              ) : null}
            </article>
          ) : null}
        </div>

        <section>
          <div className="mb-5">
            <h2 className="text-xl font-semibold tracking-tight">Revision timeline</h2>
            <p className="mt-1 text-sm text-neutral-500">
              Record the result and mistakes from every revisit.
            </p>
          </div>
          <div className="space-y-4">
            {data.revisions.map((revision) => (
              <RevisionCard key={revision.id} revision={revision} />
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}

function TagGroup({
  accent,
  label,
  values,
}: {
  accent?: boolean;
  label: string;
  values: string[];
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
        {label}
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.map((value) => (
          <span
            className={
              accent
                ? "rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs text-indigo-700"
                : "rounded-lg bg-neutral-100 px-2.5 py-1.5 text-xs text-neutral-700"
            }
            key={value}
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}

export function QuestionDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-36 max-w-3xl rounded-2xl bg-neutral-200/70" />
      <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="h-72 rounded-3xl bg-neutral-200/70" />
        <div className="space-y-4">
          {[0, 1, 2].map((item) => (
            <div className="h-48 rounded-2xl bg-neutral-200/70" key={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
