import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { Suspense } from "react";

/**
 * Renders a component that reads through TanStack Query. Each call builds its
 * own client, so one test's cache never serves another's assertion, and the
 * `Suspense` boundary is what `useSuspenseQuery` needs above it.
 */
export const renderWithQuery = (ui: ReactElement): void => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  render(
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<p>読み込み中</p>}>{ui}</Suspense>
    </QueryClientProvider>,
  );
};
