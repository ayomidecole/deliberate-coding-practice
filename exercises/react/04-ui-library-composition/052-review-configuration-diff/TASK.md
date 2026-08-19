# REACT-052: Review a Configuration Diff

Status: active

Target time: 120–150 minutes

Primary capability: contain a specialized third-party renderer behind an application-owned
component, then compose it into a feature

## Goal

Build a configuration review interface where an operator can:

1. compare the current and proposed versions of a production configuration,
2. switch between split and unified diff layouts, and
3. mark the change as reviewed.

This is one deliberately deeper diff task, not the beginning of a diff sub-arc. The lasting
skill is adapting an unfamiliar library to our application boundaries.

## What is supplied and what you own

Supplied:

- API contract and domain decoder,
- app data and styles,
- shadcn Card, Badge, and Button components,
- summary, mode-control, and review-action business components,
- `useMemo`, `DiffView`, and the renderer's mode mapping,
- routine component tests and the unfamiliar library mock setup.

You will edit only these files, in this order:

1. `src/components/configuration-changes/configuration-diff-viewer.tsx`
2. `src/features/configuration-changes/review-configuration-diff-feature.tsx`
3. `src/features/configuration-changes/review-configuration-diff-feature.test.tsx`

## Scope preflight

| Operation | Classification | Support |
|---|---|---|
| Read supplied API/domain data | demonstrated | REACT-040–051 |
| Compose Card, Badge, and Button components | demonstrated | REACT-045–051 |
| Coordinate sibling components with feature state | guided retrieval | REACT-050–051 and the diagram below |
| Author an observable feature test | transferred | REACT-044–050; vendor mock supplied |
| Generate and prepare the library's `DiffFile` object | **new** | complete mental model, call order, tests, and official docs below |

There is one new implementation boundary. You are not authoring new test infrastructure.

## Step 1: Complete `configuration-diff-viewer.tsx`

### What `DiffFile` means

`DiffFile` is not a file on disk. It is an in-memory object created by the library:

```text
beforeContent + afterContent
             │
             ▼
     generateDiffFile(...)
             │
             ▼
 prepared DiffFile object ──► <DiffView diffFile={diffFile} />
```

Your application owns `ConfigurationDiffViewer`. Its job is to translate our
`ConfigurationChange` domain object into that vendor object. The feature should never need
to know how the vendor object is built.

### Your first edit: create the object

Inside `createPreparedDiff`, call the already-imported `generateDiffFile` function and store
its returned object in a variable named `diffFile`.

Pass these six arguments in exactly this order:

1. `change.fileName` — old file name
2. `change.beforeContent` — old file contents
3. `change.fileName` — new file name
4. `change.afterContent` — new file contents
5. `change.language` — old file language
6. `change.language` — new file language

Both names and both languages repeat because this change compares two versions of the same
configuration file.

### Your second edit: prepare the object

After creating `diffFile`, call these operations in order:

1. `diffFile.initTheme('light')`
2. `diffFile.init()`
3. If `viewMode === 'split'`, call `diffFile.buildSplitDiffLines()`.
4. Otherwise, call `diffFile.buildUnifiedDiffLines()`.
5. Return `diffFile`.

That is the entire implementation you own in this file. Keep the supplied `useMemo`,
`DiffModeEnum` mapping, `<DiffView>`, accessible region, line wrapping, and CSS import.

Why are there two mode-related operations?

- `buildSplitDiffLines` or `buildUnifiedDiffLines` prepares the rows stored in `DiffFile`.
- The supplied `DiffModeEnum` value tells the React renderer how to display those rows.

The two choices must agree. This preparation sequence is specific to `@git-diff-view`; it
is not generic React boilerplate.

### Checkpoint for Step 1

Run:

```bash
npx vitest run exercises/react/04-ui-library-composition/052-review-configuration-diff/src/components/configuration-changes/configuration-diff-viewer.test.tsx
```

Both supplied adapter tests should pass before you open the feature file.

## Step 2: Complete `review-configuration-diff-feature.tsx`

This feature coordinates four business components:

```text
ReviewConfigurationDiffFeature          owns viewMode and isReviewed
├── ConfigurationChangeSummary
├── diff-toolbar
│   ├── DiffModeControl
│   └── ReviewAction
└── ConfigurationDiffViewer
```

The changing values flow like this:

```text
viewMode ──► DiffModeControl ──onValueChange──► feature state
    │
    └──────► ConfigurationDiffViewer

isReviewed ──► Summary + ReviewAction ──onReview──► feature state
```

Complete the file in this order:

1. Import `useState`.
2. Import `ConfigurationChangeSummary`, `DiffModeControl`, `ReviewAction`, and
   `ConfigurationDiffViewer`.
3. Import the `DiffViewMode` type.
4. Initialize typed `viewMode` state to `'split'`.
5. Initialize `isReviewed` from `change.reviewStatus === 'reviewed'`.
6. Add a handler that receives a `DiffViewMode` and stores it.
7. Add a review handler that stores `true`.
8. Keep the supplied section and heading.
9. Render `ConfigurationChangeSummary` with `change` and `isReviewed`.
10. Render `<div className="diff-toolbar">` containing:
    - `DiffModeControl` with the mode value and mode handler,
    - `ReviewAction` with the reviewed value and review handler.
11. Render `ConfigurationDiffViewer` with `change` and `viewMode`.

Do not put vendor-library calls in this feature, store `diffFile` in state, mutate the
readonly domain object, or rewrite the supplied business-component markup.

## Step 3: Write the feature workflow test

Open `review-configuration-diff-feature.test.tsx`. The jsdom environment, domain fixture,
cleanup, and mock diff adapter are already supplied. Update the imports you need and replace
the todo with one test proving this sequence:

1. Render the feature with `PENDING_CHANGE`.
2. `Review pending` is present.
3. The region named `checkout-config.ts split diff` is present.
4. `Split view` has `aria-pressed="true"`.
5. Click `Unified view`.
6. The region is now named `checkout-config.ts unified diff`.
7. `Unified view` has `aria-pressed="true"`.
8. Click `Mark as reviewed`.
9. `Reviewed` is present.
10. `Change reviewed` is disabled.

Test only observable behavior. Do not inspect React state, invoke handlers directly, or
assert against the third-party renderer's internal DOM.

## Full verification

Run from the workspace root:

```bash
npx vitest run exercises/react/04-ui-library-composition/052-review-configuration-diff
npx tsc --noEmit -p exercises/react/04-ui-library-composition/052-review-configuration-diff/tsconfig.json
npm run typecheck
npx vite build exercises/react/04-ui-library-composition/052-review-configuration-diff
```

Then preview:

```bash
npx vite exercises/react/04-ui-library-composition/052-review-configuration-diff --host 127.0.0.1
```

The browser must show a real code diff. The layout controls must switch it between split and
unified views. Marking the change reviewed must update the Badge and disable the action.

The renderer currently creates a large production chunk. Route-level lazy loading is a real
future consideration, but it belongs to the later page/application-composition boundary and
is not part of this exercise.

## Official documentation

- [git-diff-view quick start](https://github.com/MrWangJustToDo/git-diff-view)
- [React renderer package](https://github.com/MrWangJustToDo/git-diff-view/tree/main/packages/react)
- [File comparison package](https://github.com/MrWangJustToDo/git-diff-view/tree/main/packages/file)
- [React `useMemo`](https://react.dev/reference/react/useMemo)
- [React sharing state](https://react.dev/learn/sharing-state-between-components)
- [shadcn Card](https://ui.shadcn.com/docs/components/base/card)
- [shadcn Badge](https://ui.shadcn.com/docs/components/base/badge)
- [shadcn Button](https://ui.shadcn.com/docs/components/base/button)
- [Testing Library role queries](https://testing-library.com/docs/queries/byrole/)

## Completion

Report what help you used. Completion requires the learner-authored workflow test, all
supplied tests, both typechecks, production build, and browser behavior.

System-design lesson: third-party APIs should terminate at an application-owned adapter.
Features coordinate business state through stable application props and callbacks; they do
not need to know how a vendor constructs or renders its internal objects.
