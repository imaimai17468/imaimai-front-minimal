import { describe, expect, it } from "vitest";
import { fetchNotes } from "./read";
import { createNote } from "./write";

describe("createNote", () => {
  it("returns the row the API created", async () => {
    const created = await createNote({ title: "新しいメモ", body: "本文" });

    expect(created.title).toBe("新しいメモ");
  });

  it("leaves the created row readable by the next fetch", async () => {
    await createNote({ title: "二件目", body: "" });
    const notes = await fetchNotes(null);

    expect(notes).toHaveLength(2);
  });
});
