import { SignOutButton } from "@/components/auth/sign-out-button";
import { BrandMark } from "@/components/brand-mark";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";

type DashboardFrameProps = {
  children: React.ReactNode;
  user: {
    email: string;
    name: string;
  };
};

export function DashboardFrame({ children, user }: DashboardFrameProps) {
  const initials = user.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-svh bg-[#f6f7f3] text-neutral-950 md:grid md:grid-cols-[256px_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-svh flex-col border-r border-black/[0.06] bg-white p-5 md:flex">
        <BrandMark className="px-2 py-2" />
        <div className="mt-10">
          <DashboardNav />
        </div>

        <div className="mt-auto border-t border-black/[0.06] pt-5">
          <div className="mb-4 flex min-w-0 items-center gap-3 px-2">
            <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#e7efe9] text-xs font-bold text-emerald-950">
              {initials || "U"}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-neutral-500">{user.email}</p>
            </div>
          </div>
          <SignOutButton />
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-[#f6f7f3]/95 backdrop-blur md:hidden">
          <div className="flex h-16 items-center justify-between px-5">
            <BrandMark compact />
            <SignOutButton />
          </div>
          <DashboardNav mobile />
        </header>
        <main className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}

export function DashboardFrameSkeleton() {
  return (
    <div className="min-h-svh animate-pulse bg-[#f6f7f3] md:grid md:grid-cols-[256px_minmax(0,1fr)]">
      <aside className="hidden border-r border-black/[0.06] bg-white p-6 md:block">
        <div className="h-10 w-40 rounded-xl bg-neutral-200" />
        <div className="mt-12 space-y-3">
          <div className="h-10 rounded-xl bg-neutral-100" />
          <div className="h-10 rounded-xl bg-neutral-100" />
          <div className="h-10 rounded-xl bg-neutral-100" />
        </div>
      </aside>
      <main className="px-6 py-10 lg:px-10">
        <div className="h-10 w-72 rounded-lg bg-neutral-200" />
        <div className="mt-5 h-5 w-full max-w-xl rounded bg-neutral-200" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div className="h-32 rounded-2xl bg-neutral-200/70" key={item} />
          ))}
        </div>
      </main>
    </div>
  );
}
