import "server-only";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export class AuthenticationError extends Error {
  constructor() {
    super("You must be signed in to perform this action.");
    this.name = "AuthenticationError";
  }
}

export async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user?.id) {
    throw new AuthenticationError();
  }

  return session.user;
}
