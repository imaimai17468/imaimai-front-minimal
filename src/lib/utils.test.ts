import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("keeps the last of two classes that set the same property", () => {
    const merged = cn("p-2", "p-4");

    expect(merged).toBe("p-4");
  });

  it("drops an unset argument instead of printing it", () => {
    const unset: string | undefined = undefined;

    const merged = cn("p-2", unset);

    expect(merged).toBe("p-2");
  });
});
