import { defineConfig } from "oxfmt";

export default defineConfig({
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  printWidth: 80,
  sortImports: { newlinesBetween: false },
  sortTailwindcss: {
    stylesheet: "./src/styles.css",
    functions: ["cn"],
  },
  ignorePatterns: [
    "node_modules",
    "dist",
    "coverage",
    "public",
    ".next",
    "pnpm-lock.yaml",
    "*.md",
  ],
});
