import { redirect } from "next/navigation";
import { Suspense } from "react";

import {
  DashboardFrame,
  DashboardFrameSkeleton,
} from "@/components/dashboard/dashboard-frame";
import { getServerSession } from "@/lib/server-session";

async function AuthenticatedDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <DashboardFrame
      user={{ email: session.user.email, name: session.user.name }}
    >
      {children}
    </DashboardFrame>
  );
}

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Suspense fallback={<DashboardFrameSkeleton />}>
      <AuthenticatedDashboardLayout>{children}</AuthenticatedDashboardLayout>
    </Suspense>
  );
}
