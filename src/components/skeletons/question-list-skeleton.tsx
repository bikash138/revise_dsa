export function QuestionListSkeleton() {
  return (
    <div className="grid animate-pulse gap-4 xl:grid-cols-2">
      {[0, 1, 2, 3].map((item) => (
        <div className="h-60 rounded-2xl bg-white/[0.07]" key={item} />
      ))}
    </div>
  );
}
