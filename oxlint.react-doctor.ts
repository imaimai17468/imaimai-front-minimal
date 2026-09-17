import { REACT_DOCTOR_RULES } from "oxlint-plugin-react-doctor/core";

/**
 * The frameworks this repository runs. A rule outside them reports nothing
 * here, and listing 40 React Native rules would only make the config longer.
 * A rule also carries the capabilities it needs (`react:19`, `ssr`), and the
 * plugin skips it where the project lacks one, so nothing below has to
 * restate what this app uses.
 */
const FRAMEWORKS = new Set(["global", "tanstack-query"]);

/**
 * Every rule React Doctor enables by default, at the severity it ships. An
 * upgrade moves this set on its own, which a hand-written list would not.
 * Override one in `vite.config.ts`, whose `rules` block is spread after this.
 */
export const reactDoctorRules: Record<string, "error" | "warn"> =
  Object.fromEntries(
    REACT_DOCTOR_RULES.filter(
      (entry) =>
        entry.rule.defaultEnabled !== false &&
        FRAMEWORKS.has(entry.rule.framework),
    ).map((entry) => [entry.key, entry.rule.severity]),
  );
