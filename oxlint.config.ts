import { defineConfig } from "oxlint";
import { reactDoctorRules } from "./oxlint.react-doctor.ts";

const NOT_LINTED = [
  "node_modules",
  "dist",
  "coverage",
  "public",
  ".next",
  "next-env.d.ts",
];

export default defineConfig({
  plugins: [
    "typescript",
    "unicorn",
    "oxc",
    "react",
    "vitest",
    "import",
    "jsx-a11y",
  ],
  jsPlugins: [
    { name: "query", specifier: "@tanstack/eslint-plugin-query" },
    { name: "react-doctor", specifier: "oxlint-plugin-react-doctor" },
  ],
  categories: {
    correctness: "error",
    suspicious: "error",
    perf: "error",
    pedantic: "error",
  },
  options: { typeAware: true, typeCheck: true },
  rules: {
    ...reactDoctorRules,
    eqeqeq: ["error", "always", { null: "ignore" }],
    "no-console": "warn",
    "no-param-reassign": "error",
    "typescript/prefer-readonly-parameter-types": "off",
    "import/no-unassigned-import": "off",
    "prefer-const": "error",
    "typescript/consistent-type-imports": "error",
    "typescript/no-explicit-any": "error",
    "typescript/no-floating-promises": "error",
    "typescript/no-misused-promises": "error",
    "typescript/no-non-null-assertion": "error",
    "typescript/no-unnecessary-condition": "error",
    "typescript/consistent-type-assertions": [
      "error",
      { assertionStyle: "never" },
    ],
    "typescript/switch-exhaustiveness-check": "error",
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
      files: ["src/**/*.tsx", "app/**/*.tsx"],
      rules: { "max-lines-per-function": "off" },
    },
    {
      // App Router exports metadata, generateStaticParams etc. alongside the
      // default component export, so the rule cannot apply here.
      files: ["app/**"],
      rules: { "react-doctor/only-export-components": "off" },
    },
  ],
  ignorePatterns: NOT_LINTED,
});
