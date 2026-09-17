import { LockKeyhole, Sparkles } from "lucide-react";

import { SignInWithGoogle } from "@/components/sign-in-with-google";

export function SignInCard() {
  return (
    <section className="w-full max-w-md" aria-labelledby="sign-in-heading">
      <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.08] px-3 py-1.5 text-xs font-medium text-emerald-200">
        <Sparkles className="size-3.5 text-emerald-300" />
        Your revision space is ready
      </div>

      <div className="space-y-3">
        <h1
          className="text-4xl font-semibold tracking-[-0.04em] text-neutral-100 sm:text-5xl"
          id="sign-in-heading"
        >
          Welcome back.
        </h1>
        <p className="max-w-sm text-base leading-7 text-neutral-400">
          Sign in to continue your revision queue and keep every solved problem
          fresh.
        </p>
      </div>

      <div className="my-8 h-px bg-white/10" />

      <SignInWithGoogle />

      <div className="mt-5 flex items-center justify-center gap-2 text-xs text-neutral-400">
        <LockKeyhole className="size-3.5" />
        Secure Google authentication. No password required.
      </div>
    </section>
  );
}
