export function SignInCardSkeleton() {
  return (
    <div className="w-full max-w-md animate-pulse" aria-label="Checking session">
      <div className="mb-8 h-7 w-48 rounded-full bg-white/10" />
      <div className="h-12 w-72 rounded-lg bg-white/10" />
      <div className="mt-4 h-5 w-full rounded bg-white/10" />
      <div className="mt-2 h-5 w-4/5 rounded bg-white/10" />
      <div className="my-8 h-px bg-white/10" />
      <div className="h-12 w-full rounded-xl bg-white/10" />
    </div>
  );
}
