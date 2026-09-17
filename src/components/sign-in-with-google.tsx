"use client";

import { useState } from "react";

import { GoogleMark } from "@/components/auth/google-mark";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SignInWithGoogle() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setIsPending(true);
    setError(null);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });

      if (result.error) {
        setError(result.error.message ?? "Unable to start Google sign-in.");
        setIsPending(false);
      }
    } catch {
      setError("Unable to connect to Google. Please try again.");
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-3">
      <Button
        className="h-12 w-full rounded-xl border-neutral-200 bg-white px-4 text-sm font-semibold text-neutral-800 shadow-sm hover:bg-neutral-50"
        disabled={isPending}
        onClick={handleSignIn}
        size="lg"
        variant="outline"
      >
        <GoogleMark />
        {isPending ? "Connecting to Google…" : "Continue with Google"}
      </Button>
      {error ? (
        <p
          aria-live="polite"
          className="rounded-lg bg-destructive/10 px-3 py-2 text-center text-sm text-destructive"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
