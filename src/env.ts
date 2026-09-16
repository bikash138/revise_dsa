import "server-only";

import { z } from "zod";

const isNotPlaceholder = (value: string) =>
  !value.toLowerCase().includes("replace-with") &&
  !value.toLowerCase().startsWith("your-");

const serverEnvSchema = z.object({
  DATABASE_URL: z
    .url("DATABASE_URL must be a valid URL.")
    .refine(
      (value) =>
        value.startsWith("postgresql://") || value.startsWith("postgres://"),
      "DATABASE_URL must use the PostgreSQL protocol.",
    ),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32, "BETTER_AUTH_SECRET must contain at least 32 characters.")
    .refine(isNotPlaceholder, "BETTER_AUTH_SECRET must not be a placeholder."),
  BETTER_AUTH_URL: z
    .url("BETTER_AUTH_URL must be a valid URL.")
    .refine(
      (value) => value.startsWith("http://") || value.startsWith("https://"),
      "BETTER_AUTH_URL must use HTTP or HTTPS.",
    ),
  GOOGLE_CLIENT_ID: z
    .string()
    .trim()
    .regex(
      /^[^\s]+\.apps\.googleusercontent\.com$/,
      "GOOGLE_CLIENT_ID must be a valid Google OAuth client ID.",
    ),
  GOOGLE_CLIENT_SECRET: z
    .string()
    .trim()
    .min(16, "GOOGLE_CLIENT_SECRET must contain at least 16 characters.")
    .refine(isNotPlaceholder, "GOOGLE_CLIENT_SECRET must not be a placeholder."),
});

const parsedEnv = serverEnvSchema.safeParse({
  DATABASE_URL: process.env.DATABASE_URL,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
});

if (!parsedEnv.success) {
  const errors = parsedEnv.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  throw new Error(`Invalid server environment variables:\n${errors}`);
}

export const env = Object.freeze(parsedEnv.data);

export type ServerEnv = z.infer<typeof serverEnvSchema>;
