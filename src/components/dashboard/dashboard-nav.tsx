"use client";

import {
  CalendarCheck2,
  LayoutDashboard,
  LibraryBig,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

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

export function DashboardNav({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();

  if (mobile) {
    return (
      <nav className="flex gap-1 overflow-x-auto px-4 pb-3" aria-label="Main navigation">
        {navigationItems.map(({ exact, href, icon: Icon, label }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
                active
                  ? "bg-emerald-950 text-white"
                  : "text-neutral-600 hover:bg-neutral-100",
              )}
              href={href}
              key={href}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav className="space-y-1" aria-label="Main navigation">
      {navigationItems.map(({ exact, href, icon: Icon, label }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-emerald-950 text-white shadow-sm"
                : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-950",
            )}
            href={href}
            key={href}
          >
            <Icon className="size-[18px]" />
            {label}
          </Link>
        );
      })}

      <div className="pt-4">
        <Link
          className="flex items-center justify-center gap-2 rounded-xl bg-emerald-200 px-3 py-2.5 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-300"
          href="/dashboard/questions/new"
        >
          <Plus className="size-4" />
          Add question
        </Link>
      </div>
    </nav>
  );
}
