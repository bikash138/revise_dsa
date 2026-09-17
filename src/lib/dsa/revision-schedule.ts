export const REVISION_DAY_OFFSETS = [3, 5, 7, 15, 30] as const;
export const REVISION_TIME_ZONE = "Asia/Kolkata";

const istDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: REVISION_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/**
 * Adds calendar days to a normalized PostgreSQL DATE value.
 *
 * PostgreSQL DATE columns do not contain a timezone. UTC date methods are used
 * only to keep the YYYY-MM-DD value stable while JavaScript transports it as a
 * Date object; the application's calendar timezone remains Asia/Kolkata.
 */
function addCalendarDays(date: Date, days: number) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

export function dateOnlyToDatabaseDate(value: string) {
  const [day, month, year] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function getTodayInIst(now = new Date()) {
  const dateParts = Object.fromEntries(
    istDateFormatter
      .formatToParts(now)
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, value]),
  );

  return dateOnlyToDatabaseDate(
    `${dateParts.day}-${dateParts.month}-${dateParts.year}`,
  );
}

export function buildRevisionSchedule(firstSolvedOn: Date) {
  return REVISION_DAY_OFFSETS.map((dayOffset, index) => ({
    revisionNumber: index + 1,
    dayOffset,
    scheduledFor: addCalendarDays(firstSolvedOn, dayOffset),
  }));
}
