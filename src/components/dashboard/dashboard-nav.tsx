"use client";

import {
  CalendarCheck2,
  LayoutDashboard,
  LibraryBig,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navigationItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview", exact: true },
  {
    href: "/dashboard/questions",
    icon: LibraryBig,
    label: "Questions",
  },
  {
    href: "/dashboard/revisions",
    icon: CalendarCheck2,
    label: "Revisions",
  },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspace</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1">
          {navigationItems.map(({ exact, href, icon: Icon, label }) => {
            const active = exact
              ? pathname === href
              : pathname.startsWith(href);

            return (
              <SidebarMenuItem key={href}>
                <SidebarMenuButton
                  className="h-10 rounded-lg px-3"
                  isActive={active}
                  render={<Link href={href} />}
                  tooltip={label}
                >
                  <Icon />
                  <span>{label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}

          <SidebarMenuItem className="mt-3">
            <SidebarMenuButton
              className="h-10 rounded-lg bg-emerald-400/15 px-3 text-emerald-200 hover:bg-emerald-400/25 hover:text-emerald-100"
              render={<Link href="/dashboard/questions/new" />}
              tooltip="Add question"
            >
              <Plus />
              <span>Add question</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
