"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSyncExternalStore } from "react";
import type { ReactNode } from "react";

// Top-level await: in development, the module only resolves after the browser
// worker starts, so any component that imports this file is guaranteed to render
// with MSW intercepting. The `typeof window` guard keeps this from running
// during server-side rendering, where the ServiceWorker API does not exist.
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const { startMockWorker } = await import("@/mocks/browser");
  await startMockWorker();
}

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000 } },
});

function useIsClient() {
  return useSyncExternalStore(
    (_fn) => () => {},
    () => true,
    () => false,
  );
}

export function Providers({ children }: { children: ReactNode }) {
  const isClient = useIsClient();
  return (
    <QueryClientProvider client={queryClient}>
      {isClient ? children : null}
    </QueryClientProvider>
  );
}
