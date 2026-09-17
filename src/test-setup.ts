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
  // a global afterEach. This suite does not enable Vitest globals (no
  // globals: true in vitest.config.ts), so a second render would otherwise
  // query the first test's DOM as well.
  cleanup();
  server.resetHandlers();
  resetNotes();
});

afterAll(() => {
  server.close();
});
