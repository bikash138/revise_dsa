import { BrandMark } from "@/components/brand-mark";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

type DashboardFrameProps = {
  children: React.ReactNode;
  user: {
    email: string;
    image: string | null;
    name: string;
  };
};

export function DashboardFrame({ children, user }: DashboardFrameProps) {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <DashboardSidebar user={user} />
        <SidebarInset className="min-w-0 bg-[#151b18] text-neutral-100">
          <header className="sticky top-0 z-30 border-b border-white/8 bg-[#151b18]/95 backdrop-blur md:hidden">
            <div className="flex h-16 items-center gap-3 px-5">
              <SidebarTrigger className="text-neutral-300" />
              <BrandMark compact />
            </div>
          </header>
          <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
