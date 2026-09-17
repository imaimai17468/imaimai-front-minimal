import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

/**
 * One client and one router per call. Nothing here lives at module scope, so a
 * test builds its own pair without inheriting another test's cache.
 */
export const createAppRouter = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { staleTime: 30_000 } },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    defaultPreload: "intent",
    scrollRestoration: true,
  });

  return { router, queryClient };
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createAppRouter>["router"];
  }
}
