const formatter = new Intl.DateTimeFormat("ja-JP", {
  dateStyle: "medium",
  timeStyle: "short",
});

/**
 * Formats an ISO 8601 timestamp for display, and returns the input unchanged
 * where it does not parse, so a row with a broken timestamp still renders.
 */
export const formatDate = (isoTimestamp: string): string => {
  const parsed = new Date(isoTimestamp);
  if (Number.isNaN(parsed.getTime())) {
    return isoTimestamp;
  }
  return formatter.format(parsed);
};
