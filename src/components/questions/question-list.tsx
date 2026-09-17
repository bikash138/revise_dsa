"use client";

import {
  Archive,
  ArchiveRestore,
  ArrowUpRight,
  ChevronDown,
  Search,
} from "lucide-react";
import Form from "next/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import {
  archiveQuestionAction,
  restoreQuestionAction,
} from "@/actions/questions/question.actions";
import { PlatformIcon } from "@/components/platform-icon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Spinner } from "@/components/ui/spinner";
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
  [ConfidenceLevel.NEW]: "bg-white/10 text-neutral-300",
  [ConfidenceLevel.NEEDS_PRACTICE]: "bg-rose-400/15 text-rose-300",
  [ConfidenceLevel.IMPROVING]: "bg-amber-400/15 text-amber-300",
  [ConfidenceLevel.STRONG]: "bg-emerald-400/15 text-emerald-300",
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
          <p className="mt-3 text-neutral-400">
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
        className="rounded-2xl border border-white/8 bg-[#1b231f] p-4 shadow-sm"
      >
        <div className="grid gap-3 md:grid-cols-[minmax(220px,1fr)_repeat(3,minmax(140px,0.35fr))]">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
            <input
              className="h-11 w-full rounded-xl border border-white/10 bg-[#111714] pl-10 pr-3 text-sm text-neutral-100 outline-none transition placeholder:text-neutral-500 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-500/10"
              defaultValue={filters.search}
              name="search"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              placeholder="Search title or question number"
              type="search"
            />
          </label>
          <FilterDropdown
            defaultValue={filters.difficulty}
            label="All difficulties"
            name="difficulty"
            options={Object.values(Difficulty).map((value) => ({
              label: difficultyLabels[value],
              value,
            }))}
          />
          <FilterDropdown
            defaultValue={filters.confidence}
            label="All confidence"
            name="confidence"
            options={Object.values(ConfidenceLevel).map((value) => ({
              label: confidenceLabels[value],
              value,
            }))}
          />
          <FilterDropdown
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
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-neutral-400">
            <Checkbox
              className="data-checked:border-emerald-900 data-checked:bg-emerald-900"
              defaultChecked={filters.archived}
              name="archived"
              value="true"
            />
            Show archived questions
          </label>
          <div className="flex gap-2">
            <Link
              className="inline-flex h-9 items-center rounded-xl px-3 text-sm font-medium text-neutral-400 hover:bg-white/6 hover:text-neutral-100"
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
        <div className="rounded-3xl border border-dashed border-white/15 bg-[#18201c] px-6 py-16 text-center">
          <h2 className="text-lg font-semibold">No questions found</h2>
          <p className="mt-2 text-sm text-neutral-400">
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
        toast.error(result.error);
        return;
      }

      toast.success(result.message);
      router.refresh();
    });
  }

  return (
    <article className="group rounded-2xl border border-white/[0.08] bg-[#1b231f] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-white/15 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
              <PlatformIcon slug={question.platform.slug} />
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
          className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/10 text-neutral-400 hover:bg-white/[0.06] hover:text-neutral-100"
          href={question.url}
          rel="noreferrer"
          target="_blank"
        >
          <ArrowUpRight className="size-4" />
        </a>
      </div>

      <div className="mt-5 flex items-end justify-between gap-4 border-t border-white/[0.08] pt-4">
        <div className="text-xs text-neutral-400">
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
            <Spinner />
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

function FilterDropdown({
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
  const [value, setValue] = useState(defaultValue ?? "");
  const selectedLabel =
    options.find((option) => option.value === value)?.label ?? label;

  return (
    <>
      <input name={name} type="hidden" value={value} />
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              className="h-11 w-full justify-between rounded-xl border-white/10 bg-[#111714] px-3 font-normal text-neutral-300 shadow-none hover:bg-white/[0.06] hover:text-neutral-100"
              type="button"
              variant="outline"
            />
          }
        >
          <span className="truncate">{selectedLabel}</span>
          <ChevronDown className="size-4 text-neutral-400" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuRadioGroup
            onValueChange={(nextValue) =>
              setValue(nextValue === "__all__" ? "" : nextValue)
            }
            value={value || "__all__"}
          >
            <DropdownMenuRadioItem className="py-2" value="__all__">
              {label}
            </DropdownMenuRadioItem>
            {options.map((option) => (
              <DropdownMenuRadioItem
                className="py-2"
                key={option.value}
                value={option.value}
              >
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
