import { describe, expect, it } from "vitest";
import { formatDate } from "./format-date";

describe("formatDate", () => {
  it("prints a parsable timestamp in the ja-JP medium format", () => {
    const formatted = formatDate("2026-01-06T09:00:00.000Z");

    expect(formatted).toBe("2026/01/06 18:00");
  });

  it("returns the input unchanged where it does not parse", () => {
    const formatted = formatDate("not a date");

    expect(formatted).toBe("not a date");
  });
});
