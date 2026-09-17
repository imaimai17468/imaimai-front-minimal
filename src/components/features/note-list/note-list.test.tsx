import { screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "@/mocks/node";
import { renderWithQuery } from "@/test/render";
import { NoteList } from "./note-list";

describe("NoteList", () => {
  it("renders the title of every row the API returned", async () => {
    renderWithQuery(<NoteList />);

    expect(
      await screen.findByRole("heading", { name: "スタック選定の前提" }),
    ).toBeInTheDocument();
  });

  it("says so where the API returned no rows", async () => {
    server.use(http.get("/api/notes", () => HttpResponse.json([])));
    renderWithQuery(<NoteList />);

    expect(await screen.findByText("メモはまだありません")).toBeInTheDocument();
  });
});
