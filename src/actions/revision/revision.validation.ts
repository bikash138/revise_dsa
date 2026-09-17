import { z } from "zod";

import { RevisionResult } from "@/generated/prisma/enums";

const entityIdSchema = z.string().trim().min(1, "An ID is required.");

const revisionFieldsSchema = z
  .object({
    id: entityIdSchema,
    result: z.enum(RevisionResult),
    notes: z
      .string()
      .trim()
      .max(5_000, "Notes must be 5,000 characters or fewer.")
      .optional()
      .transform((value) => value || null),
  })
  .strict();

export const completeRevisionSchema = revisionFieldsSchema;
export const updateRevisionSchema = revisionFieldsSchema;
export const revisionIdSchema = z.object({ id: entityIdSchema }).strict();

export type CompleteRevisionInput = z.input<typeof completeRevisionSchema>;
export type UpdateRevisionInput = z.input<typeof updateRevisionSchema>;
export type RevisionIdInput = z.input<typeof revisionIdSchema>;
