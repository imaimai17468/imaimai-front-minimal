---
description: Reads and writes end to end — the one fetch call, gateway module shape, where a response is decoded, query options and their keys, loaders, mutations, and the mock handlers that stand in for the API
globs: src/**/*.ts,src/**/*.tsx
alwaysApply: false
paths: src/**/*.ts, src/**/*.tsx
---

# Data Fetching

AGENTS.md settles which directory owns a module: a page's slice sits in a `-`-prefixed directory beside its route file. This file settles what one read or one write looks like inside that slice.

## Where a request leaves the app

`src/lib/api-client.ts` holds the only `fetch` call in `src/`. It prefixes `import.meta.env.VITE_API_BASE_URL`, sets the JSON content type, throws `ApiError` carrying the status where the response is not ok, and returns `unknown`. A caller that reaches `fetch` itself loses all four, and the `unknown` is what forces the decode below.

This app ships to the browser whole, so every `VITE_`-prefixed value is readable in the built bundle. A token, a key, or a secret never goes in one.

## Slice shape

`src/routes/-note/` is the shape, and a slice holds one resource:

- **The gateway is split by operation, not by layer.** `read.ts` holds the fetch and the `queryOptions` that address it; `write.ts` holds the function a mutation calls. A module both sides route through reads as depth without adding a decision, which is what `react.md`'s *No pass-through layers* refuses.
- **A file holds what both operations use**, as `endpoint.ts` holds the path they share. A second resource brings its own slice.
- **A sub-directory carries an operation whose steps outgrow its file**, such as an upload that asks for a URL, puts the file, then writes the row.
- **The components that render the resource live in the same directory.** Where two pages render one of them, AGENTS.md decides which directory it moves to.

## Decoding

- **A schema decodes the response, and nothing else does.** `noteListSchema.parse(await apiFetch(...))` is the whole boundary: a response that does not match the schema throws in the gateway, where the failure names the field, instead of surfacing three components later as `undefined`.
- **The slice's schema file owns every shape the resource crosses the wire as**, as `note.ts` owns both the row and the draft a form submits, so the form and the mock handler validate against the same object.
- Never hand-write a mapping from response fields to a type. A hand-written one compiles while the API drifts.

## Query options

- One `queryOptions` factory per read, in the slice's `read.ts` beside the function it calls. Name it `<subject>QueryOptions`. `query/prefer-query-options` reports a `queryKey` and `queryFn` written inline at a call site.
- The key is the resource and the operation as kebab-case segments, one segment per level, with the request object last where the read takes one: `["note", "list"]`. The slice's directory name is its first segment, so the key and the file path stay readable from each other. Partial-key `invalidateQueries` is the point of the hierarchy, and a spelling nobody can predict makes it a silent no-op.
- `queryFn` passes the context's `signal` to the gateway function, so a cancelled query cancels the request rather than leaving it running.
- The factory is the whole export. No `useNotes` wrapper hook, because the call site picks between `useSuspenseQuery`, `useQuery` and a loader, and a wrapper picks for it.

## Reading

- A route loader calls `context.queryClient.query(options)`. `ensureQueryData` is deprecated in `@tanstack/react-query` 5.103 in favour of it, and the type-aware lint fails `pnpm check` on the deprecated call.
- The component reads the same factory with `useSuspenseQuery`, so the loader has already filled the cache and the component does not suspend on its own.
- Two independent reads in one component are one `useSuspenseQueries`. Two `useSuspenseQuery` calls side by side suspend on the first, so the second fetch starts only after the first resolves.
- Where a component reads rows only to hand them to a child, the child calls the factory itself. The cache dedupes by key, so the request still goes out once and the child stops depending on which parent rendered it.
- A read that should fail without taking the page down is `useQuery` + `isError` with an inline message. `useSuspenseQuery` throws to the nearest Error Boundary, which has to be an ancestor of the component calling the hook: a boundary that component renders as its own child never catches it, and the throw walks up to the layout and takes the whole page.
- A conditional read is `useQuery({ ...options(req), enabled })`. `useSuspenseQuery` has no `enabled`.

## Writing

- A write is `useMutation({ mutationFn })` at the call site, and the `mutationFn` is the exported gateway function that performs it.
- Invalidate in `onSuccess` by passing the same factory: `queryClient.invalidateQueries(notesQueryOptions())`. A write that leaves a row changed on any arm invalidates on every arm.
- Where a refetch would be wasteful for a one-field change, `cancelQueries` first and then `setQueryData`. Skipping the cancel lets an in-flight fetch land after the write and overwrite it.

## The API this app talks to

`src/mocks/handlers.ts` answers every request in `pnpm dev` and in every test, so it is the API contract as this repository holds it. It stays outside the slices, because one file showing every endpoint is what makes the contract readable, and it imports each slice's schema rather than restating a shape.

- **A handler and the schema it satisfies change in the same commit.** A handler that returns a shape the real API never sends makes the whole suite green against a fiction.
- **The handler validates the request body with the same schema the form uses**, so a field the form lets through and the API would reject fails here instead of in production.
- `src/mocks/db.ts` holds the rows between requests, and `src/test-setup.ts` resets them and the handler overrides after each test. A test that needs a different answer calls `server.use(...)` and leaves the reset to the teardown.
- `VITE_API_MOCK=off` in `.env.local` points `pnpm dev` at the real base URL instead. Nothing under `src/mocks/` reaches the production bundle, because `src/main.tsx` imports it inside an `import.meta.env.DEV` branch.

## Checklist

- [ ] The request goes through `apiFetch`, and the response is decoded by a schema
- [ ] Schema, gateway and components sit in the page's slice directory
- [ ] `queryOptions` factory in the slice's `read.ts`, named `<subject>QueryOptions`
- [ ] Key segments are kebab-case, one per level
- [ ] Loader uses `queryClient.query`, component uses `useSuspenseQuery`
- [ ] Write is `useMutation`, and `onSuccess` invalidates by passing the factory
- [ ] The mock handler answers the shape the schema decodes
