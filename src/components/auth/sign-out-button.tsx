"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { signOutAction } from "@/actions/auth.actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export function SignOutButton({ sidebar = false }: { sidebar?: boolean }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    setError(null);
    startTransition(async () => {
      const result = await signOutAction();

      if (!result.success) {
        setError(result.error);
        toast.error(result.error);
        return;
      }

      toast.success("Signed out successfully.");
      router.replace("/sign-in");
      router.refresh();
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            className={cn(
              "cursor-pointer rounded-xl text-rose-700 hover:bg-rose-50 hover:text-rose-800",
              sidebar &&
                "w-full justify-start border border-rose-400/15 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 hover:text-rose-200 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0",
            )}
            variant={sidebar ? "ghost" : "outline"}
          />
        }
      >
        <LogOut />
        <span className={cn(sidebar && "group-data-[collapsible=icon]:hidden")}>
          Sign out
        </span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sign out of Revise DSA?</AlertDialogTitle>
          <AlertDialogDescription>
            You will need to sign in with Google again to access your dashboard.
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error ? (
          <p className="rounded-lg bg-red-400/10 px-3 py-2 text-sm text-red-300">
            {error}
          </p>
        ) : null}
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="cursor-pointer bg-red-700 text-white hover:bg-red-800"
            disabled={isPending}
            onClick={handleSignOut}
          >
            {isPending ? (
              <Spinner />
            ) : (
              <LogOut />
            )}
            {isPending ? "Signing out…" : "Sign out"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
