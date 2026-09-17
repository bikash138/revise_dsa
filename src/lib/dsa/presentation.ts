import {
  ConfidenceLevel,
  Difficulty,
  RevisionResult,
} from "@/generated/prisma/enums";

export const difficultyLabels = {
  [Difficulty.EASY]: "Easy",
  [Difficulty.MEDIUM]: "Medium",
  [Difficulty.HARD]: "Hard",
} as const;

export const confidenceLabels = {
  [ConfidenceLevel.NEW]: "New",
  [ConfidenceLevel.NEEDS_PRACTICE]: "Needs practice",
  [ConfidenceLevel.IMPROVING]: "Improving",
  [ConfidenceLevel.STRONG]: "Strong",
} as const;

export const revisionResultLabels = {
  [RevisionResult.SOLVED_INDEPENDENTLY]: "Solved independently",
  [RevisionResult.SOLVED_WITH_HINT]: "Solved with a hint",
  [RevisionResult.COULD_NOT_SOLVE]: "Couldn’t solve",
} as const;

export function formatDisplayDate(value: string | Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    timeZone: "Asia/Kolkata",
    year: "numeric",
  }).format(new Date(value));
}

export function formatDateForInput(value: string | Date) {
  const date = new Date(value);
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${day}-${month}-${date.getUTCFullYear()}`;
}

export function getTodayForInput() {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "Asia/Kolkata",
    year: "numeric",
  })
    .format(new Date())
    .replaceAll("/", "-");
}
