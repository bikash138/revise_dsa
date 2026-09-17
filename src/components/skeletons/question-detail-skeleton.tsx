export function QuestionDetailSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-36 max-w-3xl rounded-2xl bg-white/[0.07]" />
      <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="h-72 rounded-3xl bg-white/[0.07]" />
        <div className="space-y-4">
          {[0, 1, 2].map((item) => (
            <div className="h-48 rounded-2xl bg-white/[0.07]" key={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
