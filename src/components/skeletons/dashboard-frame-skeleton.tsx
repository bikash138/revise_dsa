export function DashboardFrameSkeleton() {
  return (
    <div className="min-h-svh animate-pulse bg-[#151b18] md:grid md:grid-cols-[256px_minmax(0,1fr)]">
      <aside className="hidden bg-[#09110d] p-6 md:block">
        <div className="h-10 w-40 rounded-xl bg-white/10" />
        <div className="mt-12 space-y-3">
          <div className="h-10 rounded-xl bg-white/5" />
          <div className="h-10 rounded-xl bg-white/5" />
          <div className="h-10 rounded-xl bg-white/5" />
        </div>
      </aside>
      <main className="px-6 py-10 lg:px-10">
        <div className="h-10 w-72 rounded-lg bg-white/10" />
        <div className="mt-5 h-5 w-full max-w-xl rounded bg-white/10" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div className="h-32 rounded-2xl bg-white/[0.07]" key={item} />
          ))}
        </div>
      </main>
    </div>
  );
}
