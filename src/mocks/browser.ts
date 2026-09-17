import { setupWorker } from "msw/browser";
import { handlers } from "./handlers";

/**
 * `src/main.tsx` awaits this inside its `import.meta.env.DEV` branch, so the
 * production build drops both the call and this module.
 */
export const startMockWorker = async (): Promise<void> => {
  const worker = setupWorker(...handlers);
  await worker.start({ onUnhandledRequest: "bypass" });
};
