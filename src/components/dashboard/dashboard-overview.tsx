import {
  ArrowRight,
  BookOpenCheck,
  Brain,
  CalendarClock,
  CircleAlert,
} from "lucide-react";
import Link from "next/link";

import { PlatformIcon } from "@/components/platform-icon";
import {
  confidenceLabels,
  difficultyLabels,
  formatDisplayDate,
} from "@/lib/dsa/presentation";
import type { DashboardView } from "@/types/dsa";

const statStyles = [
  "bg-[#173c2d] text-white",
  "bg-[#1b2d24] text-emerald-200",
  "bg-[#2b271b] text-amber-200",
  "bg-[#202824] text-neutral-100",
];

export function DashboardOverview({ dashboard }: { dashboard: DashboardView }) {
  const stats = [
    {
      label: "Total questions",
      value: dashboard.totalQuestions,
      icon: BookOpenCheck,
    },
    {
      label: "Due today",
      value: dashboard.dueRevisions.length,
      icon: CalendarClock,
    },
    {
      label: "Strong",
      value: dashboard.confidenceCounts.strong,
      icon: Brain,
    },
    {
      label: "Needs practice",
      value: dashboard.confidenceCounts.needsPractice,
      icon: CircleAlert,
    },
  ];

  return (
    <div className="space-y-9">
      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
            Overview
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
            Keep the momentum going.
          </h1>
          <p className="mt-3 text-neutral-400">
            Start with what is due, then strengthen the patterns that need work.
          </p>
        </div>
        <Link
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-emerald-950 px-5 text-sm font-semibold text-white hover:bg-emerald-900"
          href="/dashboard/questions/new"
        >
          Add question
          <ArrowRight className="size-4" />
        </Link>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ icon: Icon, label, value }, index) => (
          <article
            className={`rounded-2xl border border-white/[0.08] p-5 shadow-sm ${statStyles[index]}`}
            key={label}
          >
            <div className="flex items-start justify-between">
              <p className="text-sm font-medium opacity-70">{label}</p>
              <Icon className="size-5 opacity-65" />
            </div>
            <p className="mt-7 text-4xl font-semibold tracking-[-0.04em]">
              {value}
            </p>
          </article>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-white/[0.08] bg-[#1b231f] p-6 shadow-sm sm:p-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">Due revisions</h2>
              <p className="mt-1 text-sm text-neutral-400">
                {dashboard.dueRevisions.length
                  ? "Your highest-priority practice for today."
                  : "Nothing is waiting for you right now."}
              </p>
            </div>
            <Link
              className="text-sm font-semibold text-emerald-800 hover:text-emerald-950"
              href="/dashboard/revisions"
            >
              View all
            </Link>
          </div>

          <div className="mt-6 divide-y divide-black/[0.06]">
            {dashboard.dueRevisions.slice(0, 5).map((revision) => (
              <Link
                className="group flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                href={`/dashboard/questions/${revision.question.id}`}
                key={revision.id}
              >
                <div className="min-w-0">
                  <p className="truncate font-semibold group-hover:text-emerald-800">
                    {revision.question.title}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-neutral-400">
                    <PlatformIcon
                      className="size-3.5"
                      slug={revision.question.platform.slug}
                    />
                    Revision {revision.revisionNumber} · {revision.question.platform.name}
                  </p>
                </div>
                <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                  {formatDisplayDate(revision.scheduledFor)}
                </span>
              </Link>
            ))}
            {dashboard.dueRevisions.length === 0 ? (
              <div className="rounded-2xl bg-[#141b18] px-5 py-8 text-center text-sm text-neutral-400">
                You’re all caught up. Add a question or check upcoming revisions.
              </div>
            ) : null}
          </div>
        </section>

        <section className="rounded-3xl border border-white/[0.08] bg-[#1b231f] p-6 shadow-sm sm:p-7">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Recently added</h2>
            <Link
              className="text-sm font-semibold text-emerald-800 hover:text-emerald-950"
              href="/dashboard/questions"
            >
              Library
            </Link>
          </div>
          <div className="mt-6 space-y-3">
            {dashboard.recentQuestions.map((question) => (
              <Link
                className="block rounded-2xl border border-white/[0.08] bg-[#18201c] p-4 transition-colors hover:bg-[#202a25]"
                href={`/dashboard/questions/${question.id}`}
                key={question.id}
              >
                <p className="truncate text-sm font-semibold">{question.title}</p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral-400">
                  <span className="inline-flex items-center gap-1.5">
                    <PlatformIcon
                      className="size-3.5"
                      slug={question.platform.slug}
                    />
                    {question.platform.name}
                  </span>
                  <span>·</span>
                  <span>{difficultyLabels[question.difficulty]}</span>
                  <span>·</span>
                  <span>{confidenceLabels[question.confidence]}</span>
                </div>
              </Link>
            ))}
            {dashboard.recentQuestions.length === 0 ? (
              <p className="rounded-2xl bg-[#141b18] px-4 py-8 text-center text-sm text-neutral-400">
                Your recently added questions will appear here.
              </p>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
