import { SignOutButton } from "@/components/auth/sign-out-button";
import { BrandMark } from "@/components/brand-mark";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";

type DashboardSidebarProps = {
  user: {
    email: string;
    image: string | null;
    name: string;
  };
};

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const initials = user.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 group-data-[collapsible=icon]:p-2">
        <BrandMark
          className="overflow-hidden group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:[&>div]:hidden"
          inverted
        />
      </SidebarHeader>

      <SidebarSeparator className="mx-0 w-[calc(100%-2rem)] self-center" />

      <SidebarContent className="px-2 py-4">
        <DashboardNav />
      </SidebarContent>

      <SidebarFooter className="gap-3 p-3">
        <SidebarSeparator className="mx-0" />
        <div className="flex min-w-0 items-center gap-3 rounded-lg px-2 py-1.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          {user.image ? (
            // Google profile images are remote and do not need Next image optimization.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt={`${user.name} profile`}
              className="size-9 shrink-0 rounded-full object-cover ring-2 ring-white/10"
              referrerPolicy="no-referrer"
              src={user.image}
            />
          ) : (
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/10 text-xs font-bold text-white ring-1 ring-white/10">
              {initials || "U"}
            </span>
          )}
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold text-white">
              {user.name}
            </p>
            <p className="truncate text-xs text-white/50">{user.email}</p>
          </div>
        </div>
        <SignOutButton sidebar />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
