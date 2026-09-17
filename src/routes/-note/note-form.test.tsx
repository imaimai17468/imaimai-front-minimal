import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { renderWithQuery } from "@/test/render";
import { NoteForm } from "./note-form";

describe("NoteForm", () => {
  it("shows the schema's message where the title is empty", async () => {
    renderWithQuery(<NoteForm />);
    await userEvent.click(screen.getByRole("button", { name: "追加する" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "タイトルを入力してください",
    );
  });

  it("clears the title field after the row is created", async () => {
    renderWithQuery(<NoteForm />);
    const title = screen.getByRole("textbox", { name: "タイトル" });
    await userEvent.type(title, "新しいメモ");
    await userEvent.click(screen.getByRole("button", { name: "追加する" }));

    await expect.poll(() => title).toHaveValue("");
  });
});
