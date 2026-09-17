import { redirect } from "next/navigation";
import { Suspense } from "react";

import { DashboardFrame } from "@/components/dashboard/dashboard-frame";
import { DashboardFrameSkeleton } from "@/components/skeletons/dashboard-frame-skeleton";
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
      user={{
        email: session.user.email,
        image: session.user.image ?? null,
        name: session.user.name,
      }}
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
