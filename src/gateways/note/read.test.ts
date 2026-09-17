import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { ApiError } from "@/lib/api-client";
import { server } from "@/mocks/node";
import { fetchNotes } from "./read";

describe("fetchNotes", () => {
  it("returns the decoded rows the API sent", async () => {
    const notes = await fetchNotes(null);

    expect(notes).toStrictEqual([
      {
        id: "note-1",
        title: "スタック選定の前提",
        body: "MCP もプラグインも無い環境で回ることを条件にする。",
        createdAt: "2026-01-06T09:00:00.000Z",
      },
    ]);
  });

  it("rejects with ApiError where the API answers 500", async () => {
    server.use(
      http.get("/api/notes", () => new HttpResponse(null, { status: 500 })),
    );

    await expect(fetchNotes(null)).rejects.toBeInstanceOf(ApiError);
  });

  it("rejects where a row is missing a field the schema requires", async () => {
    server.use(http.get("/api/notes", () => HttpResponse.json([{ id: "1" }])));

    await expect(fetchNotes(null)).rejects.toThrow("invalid_type");
  });
});
