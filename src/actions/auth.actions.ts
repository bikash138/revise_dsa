"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export async function signOutAction() {
  try {
    await auth.api.signOut({ headers: await headers() });
    return { success: true } as const;
  } catch (error) {
    console.error("Sign out failed.", error);
    return {
      success: false,
      error: "Unable to sign out. Please try again.",
    } as const;
  }
}
