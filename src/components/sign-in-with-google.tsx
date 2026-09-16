"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SignInWithGoogle() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignIn() {
    setIsPending(true);
    setError(null);

    const result = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });

    if (result.error) {
      setError(result.error.message ?? "Unable to start Google sign-in.");
      setIsPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button disabled={isPending} onClick={handleSignIn}>
        {isPending ? "Redirecting…" : "Continue with Google"}
      </Button>
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
