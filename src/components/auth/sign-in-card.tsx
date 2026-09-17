import { LockKeyhole, Sparkles } from "lucide-react";

import { SignInWithGoogle } from "@/components/sign-in-with-google";

export function SignInCard() {
  return (
    <section className="w-full max-w-md" aria-labelledby="sign-in-heading">
      <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-900/10 bg-emerald-900/[0.04] px-3 py-1.5 text-xs font-medium text-emerald-950">
        <Sparkles className="size-3.5 text-emerald-700" />
        Your revision space is ready
      </div>

      <div className="space-y-3">
        <h1
          className="text-4xl font-semibold tracking-[-0.04em] text-neutral-950 sm:text-5xl"
          id="sign-in-heading"
        >
          Welcome back.
        </h1>
        <p className="max-w-sm text-base leading-7 text-neutral-600">
          Sign in to continue your revision queue and keep every solved problem
          fresh.
        </p>
      </div>

      <div className="my-8 h-px bg-neutral-200/80" />

      <SignInWithGoogle />

      <div className="mt-5 flex items-center justify-center gap-2 text-xs text-neutral-500">
        <LockKeyhole className="size-3.5" />
        Secure Google authentication. No password required.
      </div>
    </section>
  );
}

export function SignInCardSkeleton() {
  return (
    <div className="w-full max-w-md animate-pulse" aria-label="Checking session">
      <div className="mb-8 h-7 w-48 rounded-full bg-neutral-200" />
      <div className="h-12 w-72 rounded-lg bg-neutral-200" />
      <div className="mt-4 h-5 w-full rounded bg-neutral-200" />
      <div className="mt-2 h-5 w-4/5 rounded bg-neutral-200" />
      <div className="my-8 h-px bg-neutral-200" />
      <div className="h-12 w-full rounded-xl bg-neutral-200" />
    </div>
  );
}
