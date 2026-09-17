declare namespace NodeJS {
  interface ProcessEnv {
    /** Every request goes through this prefix. `.env` holds the default. */
    readonly NEXT_PUBLIC_API_BASE_URL: string;
  }
}
