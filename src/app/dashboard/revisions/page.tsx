import type { Metadata } from "next";

import { RevisionQueue } from "@/components/revisions/revision-queue";
import { getRevisions } from "@/queries/revisions";
import type { RevisionQueueFilter } from "@/types/dsa";

export const metadata: Metadata = {
  title: "Revisions",
};

const revisionFilters = new Set<RevisionQueueFilter>([
  "upcoming",
  "completed",
  "due",
]);

export default async function RevisionsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string | string[] }>;
}) {
  const requestedFilter = (await searchParams).filter;
  const filter = revisionFilters.has(requestedFilter as RevisionQueueFilter)
    ? (requestedFilter as RevisionQueueFilter)
    : "upcoming";
  const revisions = await getRevisions(filter);

  return <RevisionQueue filter={filter} revisions={revisions} />;
}
