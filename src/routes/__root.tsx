import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

export interface RouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
});

function RootLayout() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">メモ</h1>
      <Outlet />
    </main>
  );
}
