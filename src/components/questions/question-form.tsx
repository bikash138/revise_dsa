"use client";

import { ArrowLeft, Check, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import {
  createQuestionAction,
  updateQuestionAction,
} from "@/actions/questions/question.actions";
import { Button } from "@/components/ui/button";
import { Difficulty } from "@/generated/prisma/enums";
import {
  difficultyLabels,
  formatDateForInput,
  getTodayForInput,
} from "@/lib/dsa/presentation";
import { parseQuestionUrl } from "@/lib/dsa/question-url";
import { cn } from "@/lib/utils";
import type { ActionFieldErrors } from "@/types/action-result";
import type { QuestionFormOptions, QuestionView } from "@/types/dsa";

type QuestionFormState = {
  difficulty: Difficulty;
  firstSolvedOn: string;
  patternIds: string[];
  platformId: string;
  platformQuestionNumber: string;
  title: string;
  topicIds: string[];
  url: string;
};

function createInitialState(question?: QuestionView): QuestionFormState {
  return {
    difficulty: question?.difficulty ?? Difficulty.MEDIUM,
    firstSolvedOn: question
      ? formatDateForInput(question.firstSolvedOn)
      : getTodayForInput(),
    patternIds: question?.patterns.map(({ pattern }) => pattern.id) ?? [],
    platformId: question?.platformId ?? "",
    platformQuestionNumber: question?.platformQuestionNumber ?? "",
    title: question?.title ?? "",
    topicIds: question?.topics.map(({ topic }) => topic.id) ?? [],
    url: question?.url ?? "",
  };
}

type FormActionError = {
  fieldErrors?: ActionFieldErrors;
  message: string;
};

export function QuestionForm({
  options,
  question,
}: {
  options: QuestionFormOptions;
  question?: QuestionView;
}) {
  const router = useRouter();
  const [form, setForm] = useState(() => createInitialState(question));
  const [actionError, setActionError] = useState<FormActionError | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateField<TKey extends keyof QuestionFormState>(
    field: TKey,
    value: QuestionFormState[TKey],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    setActionError(null);
  }

  function updateUrl(value: string) {
    const details = parseQuestionUrl(value);
    const platform = details
      ? options.platforms.find(
          ({ slug }) => slug === details.platformSlug,
        )
      : null;

    setForm((current) => ({
      ...current,
      url: value,
      ...(details && platform
        ? { platformId: platform.id, title: details.title }
        : {}),
    }));
    setActionError(null);
  }

  function toggleOption(field: "topicIds" | "patternIds", id: string) {
    const selected = form[field];
    updateField(
      field,
      selected.includes(id)
        ? selected.filter((value) => value !== id)
        : [...selected, id],
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = {
      ...form,
      ...(question ? { id: question.id } : {}),
    };

    startTransition(async () => {
      const result = question
        ? await updateQuestionAction({ ...input, id: question.id })
        : await createQuestionAction(input);

      if (!result.success) {
        setActionError({
          fieldErrors: result.fieldErrors,
          message: result.error,
        });
        return;
      }

      router.push(`/dashboard/questions/${result.data.questionId}`);
    });
  }

  return (
    <form className="space-y-7" onSubmit={handleSubmit}>
      <div className="grid gap-6 rounded-3xl border border-black/[0.06] bg-white p-6 shadow-sm sm:p-8 lg:grid-cols-2">
        <FormField
          error={actionError?.fieldErrors?.title?.[0]}
          label="Question title"
        >
          <input
            className={inputStyles}
            onChange={(event) => updateField("title", event.target.value)}
            placeholder="e.g. Longest Substring Without Repeating Characters"
            value={form.title}
          />
        </FormField>

        <FormField
          error={actionError?.fieldErrors?.url?.[0]}
          hint="LeetCode and GeeksforGeeks links auto-fill the title and platform."
          label="Problem URL"
        >
          <input
            autoComplete="url"
            className={inputStyles}
            onChange={(event) => updateUrl(event.target.value)}
            placeholder="https://leetcode.com/problems/..."
            type="url"
            value={form.url}
          />
        </FormField>

        <FormField
          error={actionError?.fieldErrors?.platformId?.[0]}
          label="Platform"
        >
          <select
            className={inputStyles}
            onChange={(event) => updateField("platformId", event.target.value)}
            value={form.platformId}
          >
            <option value="">Select a platform</option>
            {options.platforms.map((platform) => (
              <option key={platform.id} value={platform.id}>
                {platform.name}
              </option>
            ))}
          </select>
        </FormField>

        <FormField
          error={actionError?.fieldErrors?.platformQuestionNumber?.[0]}
          label="Platform question number"
          optional
        >
          <input
            className={inputStyles}
            onChange={(event) =>
              updateField("platformQuestionNumber", event.target.value)
            }
            placeholder="e.g. 3"
            value={form.platformQuestionNumber}
          />
        </FormField>

        <FormField
          error={actionError?.fieldErrors?.difficulty?.[0]}
          label="Difficulty"
        >
          <div className="grid grid-cols-3 gap-2">
            {Object.values(Difficulty).map((difficulty) => (
              <button
                className={cn(
                  "h-11 rounded-xl border text-sm font-semibold transition-colors",
                  form.difficulty === difficulty
                    ? "border-emerald-900 bg-emerald-950 text-white"
                    : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100",
                )}
                key={difficulty}
                onClick={() => updateField("difficulty", difficulty)}
                type="button"
              >
                {difficultyLabels[difficulty]}
              </button>
            ))}
          </div>
        </FormField>

        <FormField
          error={actionError?.fieldErrors?.firstSolvedOn?.[0]}
          hint="Use DD-MM-YYYY"
          label="First solved on"
        >
          <input
            className={inputStyles}
            inputMode="numeric"
            onChange={(event) =>
              updateField("firstSolvedOn", event.target.value)
            }
            placeholder="17-09-2026"
            value={form.firstSolvedOn}
          />
        </FormField>
      </div>

      <OptionSection
        error={actionError?.fieldErrors?.topicIds?.[0]}
        label="Topics"
        onToggle={(id) => toggleOption("topicIds", id)}
        options={options.topics}
        selected={form.topicIds}
      />

      <OptionSection
        error={actionError?.fieldErrors?.patternIds?.[0]}
        label="Patterns"
        onToggle={(id) => toggleOption("patternIds", id)}
        optional
        options={options.patterns}
        selected={form.patternIds}
      />

      {actionError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {actionError.message}
        </p>
      ) : null}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-5 text-sm font-semibold hover:bg-neutral-50"
          href={
            question
              ? `/dashboard/questions/${question.id}`
              : "/dashboard/questions"
          }
        >
          <ArrowLeft className="size-4" />
          Cancel
        </Link>
        <Button
          className="h-11 rounded-xl bg-emerald-950 px-6 text-white hover:bg-emerald-900"
          disabled={isPending}
          type="submit"
        >
          {isPending ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <Check />
          )}
          {question ? "Save changes" : "Add to revision plan"}
        </Button>
      </div>
    </form>
  );
}

function FormField({
  children,
  error,
  hint,
  label,
  optional,
}: {
  children: React.ReactNode;
  error?: string;
  hint?: string;
  label: string;
  optional?: boolean;
}) {
  return (
    <label className="space-y-2">
      <span className="flex items-center justify-between text-sm font-semibold text-neutral-800">
        {label}
        {optional ? (
          <span className="text-xs font-normal text-neutral-400">Optional</span>
        ) : null}
      </span>
      {children}
      {error ? <span className="text-xs text-red-700">{error}</span> : null}
      {!error && hint ? (
        <span className="text-xs text-neutral-400">{hint}</span>
      ) : null}
    </label>
  );
}

function OptionSection({
  error,
  label,
  onToggle,
  optional,
  options,
  selected,
}: {
  error?: string;
  label: string;
  onToggle: (id: string) => void;
  optional?: boolean;
  options: Array<{ id: string; name: string }>;
  selected: string[];
}) {
  return (
    <section className="rounded-3xl border border-black/[0.06] bg-white p-6 shadow-sm sm:p-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{label}</h2>
            {optional ? (
              <span className="text-xs font-normal text-neutral-400">
                Optional
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-neutral-500">
            Select every {label.toLowerCase().slice(0, -1)} that applies.
          </p>
        </div>
        <span className="text-xs font-semibold text-neutral-400">
          {selected.length} selected
        </span>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option.id);
          return (
            <button
              className={cn(
                "rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-emerald-900 bg-emerald-950 text-white"
                  : "border-neutral-200 bg-neutral-50 text-neutral-600 hover:bg-neutral-100",
              )}
              key={option.id}
              onClick={() => onToggle(option.id)}
              type="button"
            >
              {active ? <Check className="mr-1 inline size-3.5" /> : null}
              {option.name}
            </button>
          );
        })}
      </div>
      {error ? <p className="mt-3 text-xs text-red-700">{error}</p> : null}
    </section>
  );
}

const inputStyles =
  "h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 text-sm outline-none transition placeholder:text-neutral-400 focus:border-emerald-700 focus:ring-3 focus:ring-emerald-700/10";

export function QuestionFormSkeleton() {
  return (
    <div className="animate-pulse space-y-7">
      <div className="h-80 rounded-3xl bg-neutral-200/70" />
      <div className="h-56 rounded-3xl bg-neutral-200/70" />
      <div className="h-56 rounded-3xl bg-neutral-200/70" />
    </div>
  );
}
