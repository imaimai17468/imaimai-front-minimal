import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
      "@app": path.resolve(import.meta.dirname, "./app"),
    },
  },
  test: {
    exclude: ["node_modules", ".claude/**"],
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    restoreMocks: true,
    env: {
      NEXT_PUBLIC_API_BASE_URL: "/api",
    },
    coverage: {
      include: ["src/**/*.ts", "app/**/*.ts"],
      exclude: [
        "src/**/*.tsx",
        "src/mocks/**",
        "src/test/**",
        "src/test-setup.ts",
        "app/**/*.tsx",
      ],
      thresholds: {
        perFile: true,
        branches: 100,
      },
    },
  },
});
