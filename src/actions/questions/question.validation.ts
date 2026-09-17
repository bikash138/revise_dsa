import { z } from "zod";

import { Difficulty } from "@/generated/prisma/enums";

const entityIdSchema = z.string().trim().min(1, "An ID is required.");

const relatedIdsSchema = z
  .array(entityIdSchema)
  .min(1, "Select at least one option.")
  .max(20, "Select no more than 20 options.")
  .transform((ids) => [...new Set(ids)]);

function isValidDateOnly(value: string) {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value);

  if (!match) {
    return false;
  }

  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

const questionFieldsSchema = z
  .object({
    platformId: entityIdSchema,
    platformQuestionNumber: z
      .string()
      .trim()
      .max(64, "Question number must be 64 characters or fewer.")
      .optional()
      .transform((value) => value || null),
    title: z
      .string()
      .trim()
      .min(1, "Title is required.")
      .max(200, "Title must be 200 characters or fewer."),
    url: z
      .url("Enter a valid URL.")
      .refine(
        (value) => value.startsWith("https://") || value.startsWith("http://"),
        "URL must use HTTP or HTTPS.",
      ),
    difficulty: z.enum(Difficulty),
    firstSolvedOn: z
      .string()
      .trim()
      .refine(isValidDateOnly, "Use a valid date in DD-MM-YYYY format."),
    topicIds: relatedIdsSchema,
    patternIds: relatedIdsSchema,
  })
  .strict();

export const createQuestionSchema = questionFieldsSchema;

export const updateQuestionSchema = questionFieldsSchema.extend({
  id: entityIdSchema,
});

export const questionIdSchema = z.object({ id: entityIdSchema }).strict();

export type CreateQuestionInput = z.input<typeof createQuestionSchema>;
export type UpdateQuestionInput = z.input<typeof updateQuestionSchema>;
export type QuestionIdInput = z.input<typeof questionIdSchema>;
