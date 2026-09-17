"use client";

import { Check, Edit3, LoaderCircle, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  completeRevisionAction,
  reopenRevisionAction,
  updateRevisionAction,
} from "@/actions/revision/revision.actions";
import { Button } from "@/components/ui/button";
import { RevisionResult } from "@/generated/prisma/enums";
import {
  formatDisplayDate,
  revisionResultLabels,
} from "@/lib/dsa/presentation";
import { cn } from "@/lib/utils";
import type { RevisionView } from "@/types/dsa";

type RevisionCardProps = {
  heading?: React.ReactNode;
  revision: RevisionView;
};

export function RevisionCard({ heading, revision }: RevisionCardProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReopening, startReopenTransition] = useTransition();
  const completed = Boolean(revision.completedAt);

  function reopenRevision() {
    setError(null);
    startReopenTransition(async () => {
      const result = await reopenRevisionAction({ id: revision.id });

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.refresh();
    });
  }

  return (
    <article className="rounded-2xl border border-black/[0.07] bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          {heading}
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
            <span>Revision {revision.revisionNumber}</span>
            <span>·</span>
            <span>Day {revision.dayOffset}</span>
            <span>·</span>
            <span>{formatDisplayDate(revision.scheduledFor)}</span>
          </div>
        </div>
        <span
          className={cn(
            "w-fit rounded-full px-3 py-1 text-xs font-semibold",
            completed
              ? "bg-emerald-100 text-emerald-800"
              : "bg-amber-100 text-amber-900",
          )}
        >
          {completed ? "Completed" : "Pending"}
        </span>
      </div>

      {completed && !editing ? (
        <div className="mt-5 rounded-2xl bg-[#f4f7f4] p-4">
          <p className="text-sm font-semibold text-emerald-950">
            {revision.result
              ? revisionResultLabels[revision.result]
              : "Result not recorded"}
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-neutral-600">
            {revision.notes || "No mistakes or notes were recorded."}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              className="rounded-xl"
              onClick={() => setEditing(true)}
              size="sm"
              variant="outline"
            >
              <Edit3 />
              Edit attempt
            </Button>
            <Button
              className="rounded-xl"
              disabled={isReopening}
              onClick={reopenRevision}
              size="sm"
              variant="ghost"
            >
              {isReopening ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <RotateCcw />
              )}
              Reopen
            </Button>
          </div>
          {error ? (
            <p className="mt-3 text-xs text-red-700">{error}</p>
          ) : null}
        </div>
      ) : (
        <RevisionAttemptForm
          onCancel={completed ? () => setEditing(false) : undefined}
          revision={revision}
        />
      )}
    </article>
  );
}

function RevisionAttemptForm({
  onCancel,
  revision,
}: {
  onCancel?: () => void;
  revision: RevisionView;
}) {
  const router = useRouter();
  const [result, setResult] = useState<RevisionResult>(
    revision.result ?? RevisionResult.SOLVED_INDEPENDENTLY,
  );
  const [notes, setNotes] = useState(revision.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError(null);
    startTransition(async () => {
      const input = { id: revision.id, notes, result };
      const actionResult = revision.completedAt
        ? await updateRevisionAction(input)
        : await completeRevisionAction(input);

      if (!actionResult.success) {
        setError(actionResult.error);
        return;
      }

      onCancel?.();
      router.refresh();
    });
  }

  return (
    <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
      <div className="grid gap-2 md:grid-cols-3">
        {Object.values(RevisionResult).map((value) => (
          <button
            className={cn(
              "rounded-xl border px-3 py-3 text-left text-sm font-medium transition-colors",
              result === value
                ? "border-emerald-900 bg-emerald-950 text-white"
                : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100",
            )}
            key={value}
            onClick={() => setResult(value)}
            type="button"
          >
            {revisionResultLabels[value]}
          </button>
        ))}
      </div>
      <textarea
        className="min-h-28 w-full resize-y rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-3 text-sm leading-6 outline-none placeholder:text-neutral-400 focus:border-emerald-700 focus:ring-3 focus:ring-emerald-700/10"
        maxLength={5000}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="What did you miss, misunderstand, or want to remember next time?"
        value={notes}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-neutral-400">{notes.length}/5000 characters</p>
        <div className="flex gap-2">
          {onCancel ? (
            <Button
              className="rounded-xl"
              onClick={onCancel}
              size="sm"
              type="button"
              variant="ghost"
            >
              Cancel
            </Button>
          ) : null}
          <Button
            className="rounded-xl bg-emerald-950 text-white hover:bg-emerald-900"
            disabled={isPending}
            size="sm"
            type="submit"
          >
            {isPending ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <Check />
            )}
            {revision.completedAt ? "Save attempt" : "Complete revision"}
          </Button>
        </div>
      </div>
      {error ? (
        <p className="text-xs text-red-700">{error}</p>
      ) : null}
    </form>
  );
}
