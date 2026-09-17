"use client";

import {
  Archive,
  ArchiveRestore,
  ArrowUpRight,
  LoaderCircle,
  Search,
} from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  archiveQuestionAction,
  restoreQuestionAction,
} from "@/actions/questions/question.actions";
import { Button } from "@/components/ui/button";
import { ConfidenceLevel, Difficulty } from "@/generated/prisma/enums";
import {
  confidenceLabels,
  difficultyLabels,
  formatDisplayDate,
} from "@/lib/dsa/presentation";
import { cn } from "@/lib/utils";
import type { QuestionFilters } from "@/queries/questions";
import type { PlatformOption, QuestionView } from "@/types/dsa";

const confidenceStyles = {
  [ConfidenceLevel.NEW]: "bg-neutral-100 text-neutral-700",
  [ConfidenceLevel.NEEDS_PRACTICE]: "bg-rose-100 text-rose-800",
  [ConfidenceLevel.IMPROVING]: "bg-amber-100 text-amber-800",
  [ConfidenceLevel.STRONG]: "bg-emerald-100 text-emerald-800",
};

const difficultyStyles = {
  [Difficulty.EASY]: "text-emerald-700",
  [Difficulty.MEDIUM]: "text-amber-700",
  [Difficulty.HARD]: "text-rose-700",
};

export function QuestionList({
  filters,
  platforms,
  questions,
}: {
  filters: QuestionFilters;
  platforms: PlatformOption[];
  questions: QuestionView[];
}) {
  return (
    <div className="space-y-7">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
            Question library
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Every problem, organized.
          </h1>
          <p className="mt-3 text-neutral-600">
            Search your solved questions and see where each one stands.
          </p>
        </div>
        <Link
          className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-950 px-5 text-sm font-semibold text-white hover:bg-emerald-900"
          href="/dashboard/questions/new"
        >
          Add question
        </Link>
      </header>

      <Form
        action="/dashboard/questions"
        className="rounded-2xl border border-black/[0.06] bg-white p-4 shadow-sm"
      >
        <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_repeat(3,minmax(140px,0.35fr))]">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
            <input
              className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-10 pr-3 text-sm outline-none transition focus:border-emerald-700 focus:ring-3 focus:ring-emerald-700/10"
              defaultValue={filters.search}
              name="search"
              placeholder="Search title or question number"
              type="search"
            />
          </label>
          <FilterSelect
            defaultValue={filters.difficulty}
            label="All difficulties"
            name="difficulty"
            options={Object.values(Difficulty).map((value) => ({
              label: difficultyLabels[value],
              value,
            }))}
          />
          <FilterSelect
            defaultValue={filters.confidence}
            label="All confidence"
            name="confidence"
            options={Object.values(ConfidenceLevel).map((value) => ({
              label: confidenceLabels[value],
              value,
            }))}
          />
          <FilterSelect
            defaultValue={filters.platformId}
            label="All platforms"
            name="platformId"
            options={platforms.map((platform) => ({
              label: platform.name,
              value: platform.id,
            }))}
          />
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-neutral-600">
            <input
              className="size-4 rounded border-neutral-300 accent-emerald-900"
              defaultChecked={filters.archived}
              name="archived"
              type="checkbox"
              value="true"
            />
            Show archived questions
          </label>
          <div className="flex gap-2">
            <Link
              className="inline-flex h-9 items-center rounded-xl px-3 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
              href="/dashboard/questions"
            >
              Clear
            </Link>
            <Button className="rounded-xl" size="sm" type="submit">
              Apply filters
            </Button>
          </div>
        </div>
      </Form>

      {questions.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {questions.map((question) => (
            <QuestionCard
              archived={Boolean(filters.archived)}
              key={question.id}
              question={question}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/60 px-6 py-16 text-center">
          <h2 className="text-lg font-semibold">No questions found</h2>
          <p className="mt-2 text-sm text-neutral-500">
            Try changing the filters or add your first question.
          </p>
        </div>
      )}
    </div>
  );
}

function QuestionCard({
  archived,
  question,
}: {
  archived: boolean;
  question: QuestionView;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const completedRevisions = question.revisions.filter(
    (revision) => revision.completedAt,
  ).length;

  function changeArchiveState() {
    setError(null);
    startTransition(async () => {
      const result = archived
        ? await restoreQuestionAction({ id: question.id })
        : await archiveQuestionAction({ id: question.id });

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.refresh();
    });
  }

  return (
    <article className="group rounded-2xl border border-black/[0.07] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              {question.platform.name}
              {question.platformQuestionNumber
                ? ` · ${question.platformQuestionNumber}`
                : ""}
            </span>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[11px] font-semibold",
                confidenceStyles[question.confidence],
              )}
            >
              {confidenceLabels[question.confidence]}
            </span>
          </div>
          <Link
            className="mt-3 block truncate text-lg font-semibold tracking-tight group-hover:text-emerald-800"
            href={`/dashboard/questions/${question.id}`}
          >
            {question.title}
          </Link>
        </div>
        <a
          aria-label={`Open ${question.title} on ${question.platform.name}`}
          className="grid size-9 shrink-0 place-items-center rounded-xl border border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-neutral-950"
          href={question.url}
          rel="noreferrer"
          target="_blank"
        >
          <ArrowUpRight className="size-4" />
        </a>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {question.topics.slice(0, 3).map(({ topic }) => (
          <span
            className="rounded-lg bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600"
            key={topic.id}
          >
            {topic.name}
          </span>
        ))}
        {question.patterns.slice(0, 2).map(({ pattern }) => (
          <span
            className="rounded-lg bg-indigo-50 px-2.5 py-1 text-xs text-indigo-700"
            key={pattern.id}
          >
            {pattern.name}
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-end justify-between gap-4 border-t border-black/[0.06] pt-4">
        <div className="text-xs text-neutral-500">
          <p>
            <span
              className={cn(
                "font-semibold",
                difficultyStyles[question.difficulty],
              )}
            >
              {difficultyLabels[question.difficulty]}
            </span>
            {" · "}
            {completedRevisions}/5 revisions
          </p>
          <p className="mt-1">
            Solved {formatDisplayDate(question.firstSolvedOn)}
          </p>
          {error ? <p className="mt-2 text-red-700">{error}</p> : null}
        </div>
        <Button
          className="rounded-xl"
          disabled={isPending}
          onClick={changeArchiveState}
          size="sm"
          variant="ghost"
        >
          {isPending ? (
            <LoaderCircle className="animate-spin" />
          ) : archived ? (
            <ArchiveRestore />
          ) : (
            <Archive />
          )}
          {archived ? "Restore" : "Archive"}
        </Button>
      </div>
    </article>
  );
}

function FilterSelect({
  defaultValue,
  label,
  name,
  options,
}: {
  defaultValue?: string;
  label: string;
  name: string;
  options: Array<{ label: string; value: string }>;
}) {
  return (
    <select
      className="h-11 rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm outline-none focus:border-emerald-700 focus:ring-3 focus:ring-emerald-700/10"
      defaultValue={defaultValue ?? ""}
      name={name}
    >
      <option value="">{label}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function QuestionListSkeleton() {
  return (
    <div className="grid animate-pulse gap-4 xl:grid-cols-2">
      {[0, 1, 2, 3].map((item) => (
        <div className="h-60 rounded-2xl bg-neutral-200/70" key={item} />
      ))}
    </div>
  );
}
