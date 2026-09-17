export function DashboardOverviewSkeleton() {
  return (
    <div className="animate-pulse space-y-9">
      <div className="h-24 max-w-2xl rounded-2xl bg-white/[0.07]" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div className="h-32 rounded-2xl bg-white/[0.07]" key={item} />
        ))}
      </div>
      <div className="h-80 rounded-3xl bg-white/[0.07]" />
    </div>
  );
}
