import {
  ConfidenceLevel,
  RevisionResult,
  type ConfidenceLevel as ConfidenceLevelValue,
  type RevisionResult as RevisionResultValue,
} from "@/generated/prisma/enums";

export function calculateConfidence(
  results: RevisionResultValue[],
): ConfidenceLevelValue {
  if (results.length === 0) {
    return ConfidenceLevel.NEW;
  }

  const latestResult = results.at(-1);

  if (latestResult === RevisionResult.COULD_NOT_SOLVE) {
    return ConfidenceLevel.NEEDS_PRACTICE;
  }

  const lastTwoResults = results.slice(-2);

  if (
    lastTwoResults.length === 2 &&
    lastTwoResults.every(
      (result) => result === RevisionResult.SOLVED_INDEPENDENTLY,
    )
  ) {
    return ConfidenceLevel.STRONG;
  }

  return ConfidenceLevel.IMPROVING;
}
