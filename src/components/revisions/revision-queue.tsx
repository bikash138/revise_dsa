import Link from "next/link";

import { PlatformIcon } from "@/components/platform-icon";
import { RevisionCard } from "@/components/revisions/revision-card";
import { cn } from "@/lib/utils";
import type { RevisionQueueFilter, RevisionQueueItem } from "@/types/dsa";

const tabs: Array<{ label: string; value: RevisionQueueFilter }> = [
  { label: "Today", value: "today" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
  { label: "Overdue", value: "due" },
];

const emptyStateTitles: Record<RevisionQueueFilter, string> = {
  today: "No revisions today",
  upcoming: "No upcoming revisions",
  completed: "No completed revisions",
  due: "You’re all caught up",
};

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
        <p className="mt-3 text-neutral-400">
          Complete today’s queue, review what is ahead, or revisit past attempts.
        </p>
      </header>

      <nav
        aria-label="Revision filters"
        className="flex w-fit gap-1 rounded-xl border border-white/[0.08] bg-[#1b231f] p-1 shadow-sm"
      >
        {tabs.map((tab) => (
          <Link
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
              filter === tab.value
                ? "bg-emerald-950 text-white"
                : "text-neutral-400 hover:bg-white/[0.06] hover:text-neutral-100",
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
                  className="inline-flex items-center gap-2 text-lg font-semibold tracking-tight hover:text-emerald-800"
                  href={`/dashboard/questions/${revision.question.id}`}
                >
                  <PlatformIcon slug={revision.question.platform.slug} />
                  {revision.question.title}
                </Link>
              }
              key={revision.id}
              revision={revision}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-white/15 bg-[#18201c] px-6 py-16 text-center">
          <h2 className="text-lg font-semibold">
            {emptyStateTitles[filter]}
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            Your revision schedule updates automatically as you add questions.
          </p>
        </div>
      )}
    </div>
  );
}
