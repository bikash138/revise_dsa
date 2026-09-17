import Link from "next/link";

import { RevisionCard } from "@/components/revisions/revision-card";
import { cn } from "@/lib/utils";
import type { RevisionQueueFilter, RevisionQueueItem } from "@/types/dsa";

const tabs: Array<{ label: string; value: RevisionQueueFilter }> = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
  { label: "Due now", value: "due" },
];

export function RevisionQueue({
  filter,
  revisions,
}: {
  filter: RevisionQueueFilter;
  revisions: RevisionQueueItem[];
}) {
  return (
    <div className="space-y-7">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
          Revision queue
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">
          Practice at the right time.
        </h1>
        <p className="mt-3 text-neutral-600">
          Complete today’s queue, review what is ahead, or revisit past attempts.
        </p>
      </header>

      <nav
        aria-label="Revision filters"
        className="flex w-fit gap-1 rounded-xl border border-black/[0.06] bg-white p-1 shadow-sm"
      >
        {tabs.map((tab) => (
          <Link
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
              filter === tab.value
                ? "bg-emerald-950 text-white"
                : "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900",
            )}
            href={`/dashboard/revisions?filter=${tab.value}`}
            key={tab.value}
          >
            {tab.label}
          </Link>
        ))}
      </nav>

      {revisions.length ? (
        <div className="space-y-4">
          {revisions.map((revision) => (
            <RevisionCard
              heading={
                <Link
                  className="text-lg font-semibold tracking-tight hover:text-emerald-800"
                  href={`/dashboard/questions/${revision.question.id}`}
                >
                  {revision.question.title}
                </Link>
              }
              key={revision.id}
              revision={revision}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-neutral-300 bg-white/60 px-6 py-16 text-center">
          <h2 className="text-lg font-semibold">
            {filter === "due" ? "You’re all caught up" : `No ${filter} revisions`}
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Your revision schedule updates automatically as you add questions.
          </p>
        </div>
      )}
    </div>
  );
}

export function RevisionQueueSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[0, 1, 2].map((item) => (
        <div className="h-64 rounded-2xl bg-neutral-200/70" key={item} />
      ))}
    </div>
  );
}
