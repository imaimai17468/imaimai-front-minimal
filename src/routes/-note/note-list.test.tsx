import { render, screen } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { describe, expect, it } from "vitest";
import { server } from "@/mocks/node";
import { NoteList } from "./note-list";

describe("NoteList", () => {
  it("renders the title of every row the API returned", async () => {
    render(await NoteList());

    expect(
      screen.getByRole("heading", { name: "スタック選定の前提" }),
    ).toBeInTheDocument();
  });

  it("says so where the API returned no rows", async () => {
    server.use(http.get("/api/notes", () => HttpResponse.json([])));
    render(await NoteList());

    expect(screen.getByText("メモはまだありません")).toBeInTheDocument();
  });
});
