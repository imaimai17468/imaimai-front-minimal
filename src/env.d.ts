/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Every request goes through this prefix. `.env` holds the default. */
  readonly VITE_API_BASE_URL: string;
  /** `off` skips the Mock Service Worker in `pnpm dev`. */
  readonly VITE_API_MOCK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
