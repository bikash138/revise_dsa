"use client";

import { Button } from "@/components/ui/button";

export default function DashboardError({ reset }: { reset: () => void }) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
      <h1 className="text-lg font-semibold text-red-950">
        Unable to load this page
      </h1>
      <p className="mt-2 text-sm text-red-800">
        The server could not load the requested data. Please try again.
      </p>
      <Button
        className="mt-5 rounded-xl"
        onClick={reset}
        variant="destructive"
      >
        Try again
      </Button>
    </div>
  );
}
