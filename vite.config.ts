import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite-plus";

const GENERATED = ["src/routeTree.gen.ts"];
const NOT_LINTED = ["node_modules", "dist", "coverage", "public", ...GENERATED];

export default defineConfig({
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
  ],
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    restoreMocks: true,
    coverage: {
      include: ["src/**/*.ts"],
      // `include`'s `*.ts` is matched in contains mode, so it reaches `.tsx`
      // too. Components leave the gate on the line below and are covered by
      // their own tests instead.
      exclude: [
        "src/**/*.tsx",
        "src/**/*.gen.ts",
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
  lint: {
    options: { typeAware: true, typeCheck: true },
    plugins: [
      "typescript",
      "unicorn",
      "oxc",
      "react",
      "vitest",
      "import",
      "jsx-a11y",
    ],
    jsPlugins: [{ name: "query", specifier: "@tanstack/eslint-plugin-query" }],
    categories: {
      correctness: "error",
      suspicious: "error",
      perf: "error",
      pedantic: "error",
    },
    rules: {
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-console": "warn",
      "no-param-reassign": "error",
      // React hands components and DOM events as mutable types, and `clsx`
      // takes its arguments as an array, so the rule reports the framework's
      // own signatures rather than anything this code chose.
      "typescript/prefer-readonly-parameter-types": "off",
      // A stylesheet and a matcher registration are imported for their effect.
      "import/no-unassigned-import": "off",
      "prefer-const": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-unnecessary-condition": "error",
      // Without the option the rule rewrites `<T>x` into `x as T` and lets
      // `as` through. `never` reports both forms and leaves `as const` and
      // `satisfies` alone.
      "@typescript-eslint/consistent-type-assertions": [
        "error",
        { assertionStyle: "never" },
      ],
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "react/react-in-jsx-scope": "off",
      "react/rules-of-hooks": "error",
      "react/button-has-type": "error",
      "react/jsx-no-target-blank": "error",
      "react/self-closing-comp": "error",
      "react/jsx-boolean-value": "error",
      "react/jsx-curly-brace-presence": "error",
      "react/jsx-no-useless-fragment": "error",
      "import/no-cycle": "error",
      "query/exhaustive-deps": "error",
      "query/prefer-query-options": "error",
      "query/no-unstable-deps": "error",
      "query/stable-query-client": "error",
    },
    env: {
      builtin: true,
      browser: true,
      node: true,
    },
    overrides: [
      {
        // A component's length is its markup, which splitting for the rule's
        // sake would turn into the pass-through layers `.claude/rules/react.md`
        // refuses.
        files: ["src/**/*.tsx"],
        rules: { "max-lines-per-function": "off" },
      },
    ],
    ignorePatterns: NOT_LINTED,
  },
  fmt: {
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
    ignorePatterns: [...NOT_LINTED, "pnpm-lock.yaml", "*.md"],
  },
});
