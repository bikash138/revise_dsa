export function RevisionQueueSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      {[0, 1, 2].map((item) => (
        <div className="h-64 rounded-2xl bg-white/[0.07]" key={item} />
      ))}
    </div>
  );
}
