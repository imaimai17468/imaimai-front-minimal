import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

/**
 * Called from `app/providers.tsx` only when `process.env.NODE_ENV === "development"`;
 * Next.js dead-code-eliminates the dynamic import in production builds.
 */
export const startMockWorker = async (): Promise<void> => {
  const worker = setupWorker(...handlers);
  await worker.start({ onUnhandledRequest: "bypass" });
};
