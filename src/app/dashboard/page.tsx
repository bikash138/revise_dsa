import type { Metadata } from "next";

import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { getDashboardData } from "@/queries/dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const dashboard = await getDashboardData();

  return <DashboardOverview dashboard={dashboard} />;
}
