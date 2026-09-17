import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createAppRouter } from "./router";
import "./styles.css";

if (import.meta.env.DEV && import.meta.env.VITE_API_MOCK !== "off") {
  const { startMockWorker } = await import("./mocks/browser");
  await startMockWorker();
}

const rootElement = document.querySelector("#root");
if (rootElement === null) {
  throw new Error("index.html is missing #root");
}

const { router, queryClient } = createAppRouter();

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
