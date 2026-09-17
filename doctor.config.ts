import { defineConfig } from "react-doctor/api";

export default defineConfig({
  ignore: {
    files: ["dist/**", "coverage/**", "public/**", "src/routeTree.gen.ts"],
  },
  // The Socket.dev score check makes one network request per direct
  // dependency. `pnpm audit` and the lockfile are what this repository checks
  // dependencies with, and a scan that reaches a third-party service on every
  // run is not something every environment here allows.
  supplyChain: { enabled: false },
});
