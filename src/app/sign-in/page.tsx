import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { RevisionCadence } from "@/components/auth/revision-cadence";
import { SignInCard } from "@/components/auth/sign-in-card";
import { BrandMark } from "@/components/brand-mark";
import { SignInCardSkeleton } from "@/components/skeletons/sign-in-card-skeleton";
import { getServerSession } from "@/lib/server-session";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in with Google to continue your DSA revision practice.",
};

async function SignInGate() {
  const session = await getServerSession();

  if (session) {
    redirect("/dashboard");
  }

  return <SignInCard />;
}

export default function SignInPage() {
  return (
    <main className="grid min-h-svh bg-[#151b18] text-neutral-100 lg:grid-cols-[1.08fr_0.92fr]">
      <section className="relative hidden overflow-hidden bg-[#10221b] px-12 py-10 text-white lg:flex lg:flex-col xl:px-20 xl:py-14">
        <div className="absolute -left-32 bottom-0 size-96 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -right-36 -top-24 size-96 rounded-full bg-lime-300/[0.06] blur-3xl" />

        <BrandMark className="relative z-10" inverted />

        <div className="relative z-10 my-auto max-w-xl py-16">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300/70">
            Spaced repetition for DSA
          </p>
          <h2 className="text-5xl font-medium leading-[1.08] tracking-[-0.045em] xl:text-6xl">
            Solve once.
            <br />
            Remember for good.
          </h2>
          <p className="mt-6 max-w-lg text-base leading-7 text-white/60 xl:text-lg xl:leading-8">
            Revisit every question at the right moment, capture your mistakes,
            and turn familiar patterns into lasting confidence.
          </p>

          <div className="mt-10 max-w-lg">
            <RevisionCadence />
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/35">
          A focused practice system built around your progress.
        </p>
      </section>

      <section className="relative flex items-center justify-center px-6 py-10 sm:px-12 lg:px-16">
        <BrandMark className="absolute left-6 top-7 lg:hidden" inverted />
        <div className="absolute right-0 top-0 size-64 rounded-full bg-emerald-400/[0.05] blur-3xl" />
        <Suspense fallback={<SignInCardSkeleton />}>
          <SignInGate />
        </Suspense>
      </section>
    </main>
  );
}
