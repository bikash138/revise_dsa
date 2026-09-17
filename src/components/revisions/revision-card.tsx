"use client";

import { Check, Edit3, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  completeRevisionAction,
  reopenRevisionAction,
  updateRevisionAction,
} from "@/actions/revision/revision.actions";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { RevisionResult } from "@/generated/prisma/enums";
import {
  formatDisplayDate,
  revisionResultLabels,
} from "@/lib/dsa/presentation";
import { cn } from "@/lib/utils";
import type { RevisionView } from "@/types/dsa";

type RevisionCardProps = {
  compact?: boolean;
  heading?: React.ReactNode;
  revision: RevisionView;
};

export function RevisionCard({
  compact = false,
  heading,
  revision,
}: RevisionCardProps) {
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
        toast.error(result.error);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  }

  return (
    <article
      className={cn(
        "rounded-2xl border border-white/[0.08] bg-[#1b231f] shadow-sm",
        compact ? "p-4" : "p-5 sm:p-6",
        compact && editing && "md:col-span-2 xl:col-span-3",
      )}
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          {heading}
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-400">
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
              ? "bg-emerald-400/15 text-emerald-300"
              : "bg-amber-400/15 text-amber-300",
          )}
        >
          {completed ? "Completed" : "Pending"}
        </span>
      </div>

      {completed && !editing ? (
        <div
          className={cn(
            "rounded-xl bg-[#141b18]",
            compact ? "mt-3 p-3" : "mt-5 p-4",
          )}
        >
          <p className="text-sm font-semibold text-emerald-300">
            {revision.result
              ? revisionResultLabels[revision.result]
              : "Result not recorded"}
          </p>
          <p
            className={cn(
              "mt-2 whitespace-pre-wrap text-sm text-neutral-400",
              compact ? "line-clamp-2 leading-5" : "leading-6",
            )}
          >
            {revision.notes || "No mistakes or notes were recorded."}
          </p>
          <div className={cn("flex flex-wrap gap-2", compact ? "mt-3" : "mt-4")}>
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
                <Spinner />
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
      ) : compact && !editing ? (
        <Button
          className="mt-4 w-full rounded-xl"
          onClick={() => setEditing(true)}
          size="sm"
          variant="outline"
        >
          <Edit3 />
          Record revision
        </Button>
      ) : (
        <RevisionAttemptForm
          compact={compact}
          onCancel={completed || compact ? () => setEditing(false) : undefined}
          revision={revision}
        />
      )}
    </article>
  );
}

function RevisionAttemptForm({
  compact = false,
  onCancel,
  revision,
}: {
  compact?: boolean;
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
        toast.error(actionResult.error);
        return;
      }

      toast.success(actionResult.message);
      onCancel?.();
      router.refresh();
    });
  }

  return (
    <form
      className={cn(compact ? "mt-4 space-y-3" : "mt-5 space-y-4")}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-2 md:grid-cols-3">
        {Object.values(RevisionResult).map((value) => (
          <button
            className={cn(
              "rounded-xl border px-3 py-3 text-left text-sm font-medium transition-colors",
              result === value
                ? "border-emerald-900 bg-emerald-950 text-white"
                : "border-white/10 bg-[#111714] text-neutral-400 hover:bg-white/[0.06]",
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
        className={cn(
          "w-full resize-y rounded-xl border border-white/10 bg-[#111714] px-3 py-3 text-sm leading-6 text-neutral-100 outline-none placeholder:text-neutral-500 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/10",
          compact ? "min-h-24" : "min-h-28",
        )}
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
              <Spinner />
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
