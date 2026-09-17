# Project Instructions

This is a browser-only React application: a Vite+ toolchain, TanStack Router, TanStack Query, and Mock Service Worker in place of a backend. There is no server in this repository, so a change that would need one is a change to `src/mocks/handlers.ts` plus a note about what the real API must then provide.

It is also built for a session that has **no MCP server, no plugin, and no hook**. Every gate here is a command any session can run by hand, every instruction is plain text in this file or under `.claude/`, and nothing in the workflow below waits on tooling this repository cannot install from the npm registry. Keep it that way: an addition that only works where an MCP server or a hook is configured does not belong.

This file carries the directives, and the Rules section settles which document holds what. Follow the pointer rather than assuming the summary is the whole rule.

## Workflow

Ticket-granularity work follows the `ticket-work` skill: implementing a component, fixing a non-trivial bug, refactoring a module, adding a feature. Invoke it at the start, and detect the case yourself, because the user does not announce it. A one-line fix, a single config value, or a docs-only change skips it. Where an edit could be either, invoke it.

**A request becomes tickets before anyone codes.** A ticket is the smallest change that leaves `main`'s CI green when it merges alone, and that one session can carry to a merged pull request. Split a request by that test, top to bottom through the layer order below. A piece that two tickets both need, such as a new entity, is the first ticket, and the rest follow it.

**Carry the tickets in this session unless the user asks for parallel work.** A subagent buys wall-clock only where two tickets share no file, and it costs a prompt that has to restate every fact this session already holds. Where the user does ask for it, one `general-purpose` worker takes one ticket, and `isolation: worktree` keeps its edits off this checkout.

## Verification before completion

No hook runs these. Run them yourself, in this order, before reporting a change complete:

- `pnpm check` — formatting, lint, and types, over the whole repository. React Doctor's per-file rules run here as an Oxlint plugin, so an effect that leaks a listener fails this step
- `pnpm test` — the suite with coverage, including the per-file branch gate
- `pnpm doctor` — React Doctor's own scan, which adds what a single file cannot show: circular imports, unused dependencies and exports, maintainability, and the pnpm install hardening settings. Run it where the change adds a dependency, a module, or a component
- `pnpm build` — where the change could reach the bundle, because a module that type-checks can still fail to build

Report a step you could not run as "not run", never as "passed", and name it when reporting completion. A failing step is the result; describe it with its output rather than narrowing the claim.

`pnpm check:fix` formats and applies the lint fixer. Run it before committing rather than hand-matching the formatter.

A React Doctor finding is a hypothesis about the code, so read the file before acting on one. Fix the cause. Changing `doctor.config.ts` or a rule's severity in `vite.config.ts` to clear a finding needs the user's own words, and the config already carries the two exemptions this repository decided: the Socket.dev supply-chain request, and `only-export-components` under `src/routes/`, where a file route exports `Route` by the router's contract.

## Degraded Environments

A session may lack a web tool, a browser tool, or `gh`. A missing tool downgrades a step. It never waives that step, and it never blocks unrelated work.

- **No browser tool**: a rendered change is verified by a test against the DOM plus `pnpm build`, and the visual check is reported as not run.
- **No web tool**: read the pinned version's own source under `node_modules/`, which is the only source that describes what is installed. Where neither that nor this repository answers the question, write what you could not confirm into the sentence it limits.
- **No `gh`**: commit and push, then report the branch name and what the pull request body should say.

Work that reaches outside this repository waits for the user's own words: publishing the package, changing a remote's settings, or pushing to a branch another session owns.

## Knowledge Currency

Your training data goes stale, and this stack moves fast enough that an outdated pattern compiles and then behaves differently.

**Check before writing, where a web tool exists:**

- Recommending a specific version, flag, or configuration
- Writing an import path or an access pattern for a library from memory. Catching yourself thinking "I know how this works" is the cue to check
- A user names an external tool and you are about to describe its behavior

**Not needed when** this repository pins the version and shows the usage you need, the command is a well-known CLI in standard usage, or the pattern is internal.

**One authoritative source ends a lookup.** The official documentation, the specification, or the library's own source answers the question. Never re-query a fact this session has answered.

**Don't present uncertain knowledge as fact.** Verify a term, a translation, or a recommendation before writing it down. Where you cannot verify, say so plainly. This holds in casual conversation as much as in a report.

## Design Philosophy

**Extensibility by default.** Every implementation is designed for future expansion: APIs, interfaces, types, data structures.

- **Do:** Use a union where a boolean would suffice today, because a third state is one requirement change away
- **Do:** Define the type at a module boundary, even with one caller now
- **Don't:** Build a feature no one requested, or an abstraction for a hypothetical use case

This principle is silent. Do not surface it or discuss it.

## Code Practices

**Senior dev standard.** Don't settle for the simplest approach when architecture is flawed, state is duplicated, or patterns are inconsistent. Ask what a perfectionist senior dev would reject in code review, and fix that. Following the surrounding convention is an acceptable default, and a better approach that is known is taken.

**Decide what the work needs and act on it.** A finding you can act on is a change to make, and a default a careful engineer would choose is yours to set. What stays with the user is an option only they can weigh: their taste, the tools they work in, their tolerance for risk, and any action that reaches outside this repository. Hand one of those back with `AskUserQuestion`, one question per decision, the option you recommend first. A report states what you decided and why, and carries no question of its own.

**Check the instructed means against the purpose.** Where another means would improve effect, cost, safety, or feasibility enough to change the choice, hand the alternative, its reason, and its tradeoff back before acting. Keep the constraints the user stated. A small reversible improvement inside the request proceeds without that pause.

**Comments explain the code directly below them and nothing else.** No narration, no restating the obvious. Where code needs a comment to be understood, change the name, the types, or the structure until it does not. A comment's subject never lives outside what it ships with: an issue number, a "see above", or another file's behavior goes wrong the moment what it points at moves.

**A comment is not a control mechanism.** Wanting to write one so that a future reader does not do the wrong thing is the signal to change the structure or the types until the wrong thing does not compile.

**Never escape the type system to move on.** No `as` (`@typescript-eslint/consistent-type-assertions` reports both spellings and leaves `as const` and `satisfies` alone), no `any`, no `@ts-ignore` / `@ts-expect-error` / `@ts-nocheck`, no non-null `!`, and no lint-disable comment to silence an error. Fix the type with narrowing, a guard, a schema, or `satisfies`. Where you genuinely cannot, leave the pull request in Draft with a comment naming the type that will not resolve, and report it.

**Generated files stay generated.** `src/routeTree.gen.ts` comes from the TanStack Router plugin and is committed so a fresh clone can run `pnpm check`. Never hand-edit it: run `pnpm generate-routes`, or start `pnpm dev`, which rewrites it.

## Rules

Rules are auto-loaded from `.claude/rules/`, and each is mirrored into `.cursor/rules/*.mdc` as a file-level symlink so a Cursor session loads the same text (never replace a symlink with a copy). Skills and agents live only under `.claude/skills/` and `.claude/agents/`. Each rule's frontmatter states its scope twice, because Claude Code reads `paths` and Cursor reads `globs`, so both keys change together.

- **`data-fetching.md`** is scoped to `src/**/*.ts` and `src/**/*.tsx` and settles one read or write end to end: the single `fetch` call, the gateway directory's shape, where a response is decoded, the query options and their keys, what a loader and a component each call, how a write invalidates, and what the mock handlers owe the real API.
- **`design.md`** is scoped to `src/**/*.css` and `src/**/*.tsx`, so a session deciding a UI question without opening one of those files loads none of it and has to open the rule itself.
- **`prose.md`** carries no path scope, so every session holds it whatever it is editing.
- **`react.md`** names the concrete `src/components/` and `src/lib/` homes in its Module Organization section, so where a module or a non-component value goes is settled there rather than here.

A principle lives in this file. A concrete of this repository, such as a path, a file name, or a command, lives in the rule whose scope covers the files it names. A step-by-step procedure for a named task lives in the skill that names it, and a constraint lives in the structure or the types.

**A page owns its slice.** What one page needs lives in a `-`-prefixed directory beside its route file, as `src/routes/-note/` does for `src/routes/index.tsx`: the schema, the `read.ts` and `write.ts` that address the API, and the components that render them. The prefix is the router generator's `routeFileIgnorePrefix`, whose default is `-`, and it skips such a name for files and directories alike, so nothing inside becomes a URL.

Imports run one way inside a slice: the route file and the components read `read.ts` and `write.ts`, which read the slice's schema file and `src/lib/api-client.ts`. Outside it, `src/lib/` holds what no page owns, `src/components/shared/` and `src/components/ui/` hold UI that two or more pages render, and a slice two routes both need moves up to their nearest common ancestor route directory. A route never imports another route's slice: that import is the signal to move the slice up.

**Instruction documents.** Every document written for an agent (`.claude/`, AGENTS.md) is in English. Point at other files rather than restating them, because a copy is correct when written and wrong after the next edit to what it copied. Never write a claim about another file, command, or count of either without opening or running it in the same turn; where that is not worth the cost, drop the assertive form instead. A grep only matches the literals you predicted, so never offer "expect zero hits" as proof. After changing a step, reconcile every other mention of what it names. The rule reaches code comments too: a comment may state what you have seen the code do, never what you meant it to do.

**Guidance carries no padding.** A rule or a plan takes no new section and no new file for something an existing one holds, and `prose.md`'s *Write one claim once* settles the repetition inside a passage.

**Write a rule as the move to make.** Where the user asks for a rule that removes a behavior, state the action that replaces it, because a prohibition leaves every other route open.

**Nothing an agent learns goes into its auto-memory.** A memory binds only the agent that recalls it and is read by no reviewer. Put what would be saved there where the next agent meets it, which this section's placement rule decides.

## Testing

Tests are written against the implementation, and test-first is not required. What is required is that every branch you added is reached by a test that fails when that branch breaks. `vite.config.ts` enforces 100% branch coverage per file over `src/**/*.ts`, with components, mocks and test helpers excluded there and covered by their own tests instead. A module lands inside that gate with no config edit, so a new `.ts` file holding an untested branch fails the suite by name.

- **A test name states a condition and its result.** The name alone says what broke, without opening the body.
- **One test, one `expect`, arranged as Arrange / Act / Assert.** A table-driven case is one test per row and obeys the same rule.
- **A structural result is asserted as one whole object.** Compare with `toStrictEqual` in a single `expect`, so a failure prints the whole shape instead of stopping at the first mismatched field.
- **A component test drives the component the way a person does**, through `@testing-library/user-event` and a role query, and reads the API through the mock handlers rather than a stubbed module. `src/test/render.tsx` provides the query client and the Suspense boundary.

Reaching a component's branches from a test depends on how the component was shaped, and `.claude/rules/react.md` (Testable Behavior Extraction) governs that.

## Commits & Pull Requests

- **One commit = one purpose.** Where two changes could be reverted independently, split them, and a drive-by fix is always its own commit. Never `git add -A`, `git add .`, or `git commit -a`. Stage explicit paths, and use `git add -p` to split hunks within a file.
- First line states **what improves**, not what you did. Prefixes: `feat` / `fix` / `refactor` / `test` / `docs` / `chore`. Body in Japanese, and `fix` / `refactor` include a *why* line. End with a `Co-Authored-By:` trailer crediting the current model.
- **A commit message names the defect it fixes.** `レビュー指摘の修正` sends the reader to the review thread to learn what changed. Write the wrong behavior and the behavior that replaced it.
- **Commit and push freely on a pull request branch.** `main` takes changes only through a pull request, so on `main` create a branch before the first commit.
- **A pull request is Draft from the first commit**, ready once `pnpm check` and `pnpm test` pass on the branch, and merged once CI passes on the merged result.
- **Resolve a conflict by rebasing onto main.** `git fetch origin && git rebase origin/main`, resolve, run `pnpm check` and `pnpm test`, then `git push --force-with-lease` to the pull request's own branch and no other.
- **History:** while a pull request is Draft, keep its commits clean and rebase freely. Once review has started, never rewrite reviewed commits: add fixes on top.
- **Answer every review comment in its thread.** Name the change you made, or the reason none was needed. Where you judge the finding wrong, give the user the problem the reviewer found, the change they asked for, and your reason for refusing, so they can decide without reading the thread.
