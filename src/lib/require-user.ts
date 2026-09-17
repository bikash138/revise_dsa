import "server-only";

import { getServerSession } from "@/lib/server-session";

export class AuthenticationError extends Error {
  constructor() {
    super("You must be signed in to perform this action.");
    this.name = "AuthenticationError";
  }
}

export async function requireUser() {
  const session = await getServerSession();

  if (!session?.user?.id) {
    throw new AuthenticationError();
  }

  return session.user;
}
