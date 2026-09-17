import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    restoreMocks: true,
    env: {
      NEXT_PUBLIC_API_BASE_URL: "/api",
    },
    coverage: {
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/*.tsx",
        "src/mocks/**",
        "src/test/**",
        "src/test-setup.ts",
      ],
      thresholds: {
        perFile: true,
        branches: 100,
      },
    },
  },
});
