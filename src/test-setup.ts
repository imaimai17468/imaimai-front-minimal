import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterAll, afterEach, beforeAll } from "vitest";
import { resetNotes } from "./mocks/db";
import { server } from "./mocks/node";

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});

afterEach(() => {
  // Testing Library unmounts on its own only where the test framework exposes
  // a global `afterEach`, and `vp test` runs without Vitest globals, so a
  // second render would otherwise query the first test's DOM as well.
  cleanup();
  server.resetHandlers();
  resetNotes();
});

afterAll(() => {
  server.close();
});
