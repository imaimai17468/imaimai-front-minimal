---
name: ticket-work
description: "The seven steps for ticket-granularity work in this repository: implementing a component, fixing a non-trivial bug, refactoring a module, adding a feature. Invoke at the start of such work."
---

# Ticket work

In a fresh clone or worktree, run `pnpm install` before anything else. It installs the toolchain and runs `lefthook install`, which writes the git hooks. `src/routeTree.gen.ts` is committed, so `pnpm check` works without a dev server, and `pnpm dev` rewrites it whenever a file under `src/routes/` changes.

The steps are sequential. Do not skip one because the change looks small: a change that looks small is the one that skips step 2 and lands in the wrong layer.

## 1. Clarify

Settle what would change the work before writing any of it: which behavior the user wants, which existing module owns it, and what the acceptance is. Where the user is present and one question blocks the most work, ask that one with `AskUserQuestion` and hold the rest. Where they are not, write the assumption into the pull request body.

A premise you cannot check is a question, not a fact. Open the file, run the command, or say you could not.

## 2. Locate

Read the layer the change belongs to before adding to it. `AGENTS.md` names the layer order; `.claude/rules/data-fetching.md` settles a read or a write; `.claude/rules/react.md` settles where a module and a non-component value live.

A change that adds a directory, a dependency, or a boundary is a decision to state in the report, not a detail.

## 3. Implement

Write the change in the smallest shape that satisfies the ticket, following the rules whose scope covers the files you touch. Where the change needs data the API does not yet return, `src/mocks/handlers.ts` is where the contract goes, and the pull request body says what the real API must then provide.

## 4. Test

Every branch you added gets a test that fails when that branch breaks, per AGENTS.md's Testing section. A pure function's test calls it directly. A component's test drives it through `@testing-library/user-event` and reads the API through the mock handlers.

Run `pnpm test` and read the coverage gate's output. Where it names your file, the branch you added has no test yet.

## 5. Review

Dispatch the `code-reviewer` agent over the uncommitted diff. It runs in a context that did not write the code, and it returns findings with a fix and an acceptance check for each.

Apply what it confirms, one commit per finding. Where you judge a finding wrong, hand the user the problem the reviewer found, the change it asked for, and your reason, and let them decide.

## 6. Gate

Run the three commands in AGENTS.md's *Verification before completion*, in that order, and fix what they report. Nothing runs them for you.

`pnpm check:fix` is what resolves a formatting failure. A lint failure that the fixer cannot resolve is a change to the code, never a disable comment.

## 7. Commit and hand over

Commit per AGENTS.md's *Commits & Pull Requests*: explicit paths, one purpose per commit, a Japanese body with a *why* line on a `fix` or a `refactor`.

Open the pull request as Draft, mark it ready once the gate passes on the branch, and report: what changed, what you decided and why, which step you could not run, and what the reviewer raised that you did not take.
