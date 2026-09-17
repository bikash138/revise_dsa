import type { z } from "zod";

import { Prisma } from "@/generated/prisma/client";
import { AuthenticationError } from "@/lib/require-user";
import type { ActionResult } from "@/types/action-result";

type SuccessfulAction<T> = {
  data: T;
  message?: string;
};

export class ActionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ActionError";
  }
}

/**
 * Runs a Server Action through the application's shared action boundary.
 *
 * The input is validated and transformed by the supplied Zod schema before the
 * business callback runs. Successful callback results and all validation,
 * authentication, business, Prisma, and unexpected errors are converted into
 * the same serializable ActionResult shape for the client.
 *
 * @param schema - Zod schema used to validate and transform the incoming input.
 * @param input - Untrusted value received by the Server Action from the client.
 * @param action - Business callback that receives the validated schema output
 * and returns the successful response data and an optional message.
 * @returns A serializable success result or a safe validation/action error.
 */
export async function runServerAction<TSchema extends z.ZodType, TResult>(
  schema: TSchema,
  input: z.input<TSchema>,
  action: (data: z.output<TSchema>) => Promise<SuccessfulAction<TResult>>,
): Promise<ActionResult<TResult>> {
  const parsed = schema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      error: "Please correct the invalid fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const result = await action(parsed.data);

    return {
      success: true,
      data: result.data,
      message: result.message,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

function handleActionError(error: unknown): ActionResult<never> {
  if (error instanceof ActionError || error instanceof AuthenticationError) {
    return { success: false, error: error.message };
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return {
      success: false,
      error: "A record with the same unique value already exists.",
    };
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    (error.code === "P2003" || error.code === "P2025")
  ) {
    return {
      success: false,
      error:
        "One or more referenced records no longer exist. Refresh and try again.",
    };
  }

  console.error("Server action failed.", error);

  return {
    success: false,
    error: "Something went wrong. Please try again.",
  };
}
