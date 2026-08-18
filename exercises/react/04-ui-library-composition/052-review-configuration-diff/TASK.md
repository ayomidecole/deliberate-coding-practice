# REACT-052: Review a Configuration Diff

Status: active

Target time: 120–150 minutes

Primary capability: integrate a specialized third-party renderer behind an application-
owned component, then coordinate it inside a business feature

## Goal

Build a production-shaped configuration review interface. An operator must compare the
current and proposed versions of a production configuration, switch between split and
unified layouts, and mark the change as reviewed.

This is the one deliberately deeper diff task. It does **not** begin a diff sub-arc. The
lasting skill is learning how to read an unfamiliar component library, adapt application
data to its protocol, contain that protocol behind your own component, and compose the
result into an existing feature architecture.

The API contract, domain decoder, app fixture, shadcn source, summary Card, mode control,
review Button, component tests, styles, configuration, memoization shell, and unfamiliar
library mock setup are supplied. You own:

- the diff library's preparation pipeline inside the adapter,
- feature-owned layout and review state,
- the multi-component feature composition, and
- one central behavior test.

## Two separate pictures

The last task mixed component nesting and state flow. Keep these pictures separate here.

### Component tree: what renders inside what

```text
ReviewConfigurationDiffFeature
├── ConfigurationChangeSummary       supplied Card + Badge
├── diff toolbar
│   ├── DiffModeControl               supplied Buttons
│   └── ReviewAction                  supplied Button
└── ConfigurationDiffViewer          your application-owned adapter
    └── DiffView                      third-party renderer
```

### Data flow: who owns changing values

```text
viewMode state ──► DiffModeControl ──onValueChange──► feature setter
       │
       └────────► ConfigurationDiffViewer

isReviewed state ──► Summary + ReviewAction ──onReview──► feature setter
```

The feature owns workflow state because sibling components need it. The adapter owns no
workflow state; it translates one domain object plus one view-mode prop into the vendor's
objects and props.

## The new library protocol

This sequence is specific to `@git-diff-view`; it is not a general React ritual:

```text
ConfigurationChange domain object
        │
        ▼
generateDiffFile(before version, after version)
        │
        ▼
initialize theme → initialize diff → build requested line layout
        │
        ▼
DiffFile instance ──► React DiffView
```

`generateDiffFile` compares two complete file contents. It does not require you to write a
Git patch. Its six required arguments are:

| Position | Value from `change` |
|---|---|
| 1 | old file name: `fileName` |
| 2 | old file content: `beforeContent` |
| 3 | new file name: `fileName` |
| 4 | new file content: `afterContent` |
| 5 | old language: `language` |
| 6 | new language: `language` |

After generation, call these operations in order:

1. `initTheme('light')`
2. `init()`
3. `buildSplitDiffLines()` **or** `buildUnifiedDiffLines()`, based on `viewMode`
4. return the prepared `DiffFile`

There are two mode-related jobs. The builder prepares the correct rows on the `DiffFile`.
The already-supplied `DiffModeEnum` mapping tells the React renderer which layout to show.
Both must agree.

The supplied `useMemo` shell keeps this potentially expensive preparation from running on
unrelated renders. It reruns when the domain object or layout mode changes. Memoization is
infrastructure here, not a new operation you must author.

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Read supplied API/domain data | demonstrated | REACT-040–051 |
| Compose Card, Badge, and Button business components | demonstrated | REACT-045–051 |
| Own state and coordinate sibling components | guided retrieval | REACT-050–051; explicit tree and data-flow diagrams above |
| Author an observable feature test | transferred | REACT-044–050; unfamiliar vendor mock is supplied |
| Generate, initialize, and layout a vendor `DiffFile` | **new operation** | mental model, argument table, ordered calls, official docs, and supplied adapter test |
| Render the prepared file through `DiffView` | part of the same new boundary | imports, enum mapping, props, CSS import, and JSX shell supplied |

There is one unfamiliar implementation boundary. The test harness does not add another.

## Work order

Edit only these three files, in this order:

1. `src/components/configuration-changes/configuration-diff-viewer.tsx`
2. `src/features/configuration-changes/review-configuration-diff-feature.tsx`
3. `src/features/configuration-changes/review-configuration-diff-feature.test.tsx`

Do not edit the domain, API type, supplied business components or their tests, generated UI
source, app, styles, package files, or configuration.

### 1. Complete the application-owned diff adapter

In `createPreparedDiff`:

- remove the placeholder `void` statements and thrown error,
- call `generateDiffFile` with the six values in the table,
- initialize the returned object in the required order,
- build split lines for `viewMode === 'split'`; otherwise build unified lines, and
- return the prepared object.

Keep the supplied `useMemo`, accessible region, `DiffView`, enum mapping, light theme, line
wrapping, and package CSS import unchanged.

The supplied adapter tests are intentionally direct: they prove the exact vendor calls for
both modes while mocking the real renderer. You are responsible for making those tests pass,
not for authoring or editing that unfamiliar mock harness.

### 2. Compose the business feature

Complete `ReviewConfigurationDiffFeature`:

- import `useState` and the four business components shown in the tree,
- import the `DiffViewMode` type,
- initialize `viewMode` as typed state with `'split'`,
- initialize `isReviewed` from whether `change.reviewStatus === 'reviewed'`,
- write a mode handler that stores its `DiffViewMode` argument,
- write a review handler that stores `true`,
- keep the supplied section and heading,
- render `ConfigurationChangeSummary` with `change` and `isReviewed`,
- create `<div className="diff-toolbar">` containing `DiffModeControl` and
  `ReviewAction`, and
- render `ConfigurationDiffViewer` with `change` and `viewMode`.

Do not store the prepared `DiffFile` in feature state, mutate the readonly domain object,
put vendor calls in the feature, duplicate business-component markup, or define components
inside the feature.

### 3. Author the central workflow test

The test already supplies the jsdom environment, domain fixture, cleanup, and a mock diff
adapter. Replace the todo with one test that:

1. renders `ReviewConfigurationDiffFeature` with `PENDING_CHANGE`,
2. proves `Review pending` and the region named `checkout-config.ts split diff` are present,
3. proves the `Split view` Button has `aria-pressed="true"`,
4. clicks `Unified view`,
5. proves the region is now named `checkout-config.ts unified diff` and that Button is
   pressed,
6. clicks `Mark as reviewed`, and
7. proves `Reviewed` is present and `Change reviewed` is disabled.

Update the Testing Library and Vitest imports as required. Test observable behavior; do not
inspect React state, call handlers directly, or test the vendor's internal DOM here.

## Five-minute start gate

Your first three edits are identifiable:

1. Replace the adapter placeholder with a `const diffFile = generateDiffFile(...)` call
   using the argument table.
2. Add the theme and initialization calls, then the split/unified branch and return.
3. In the feature, add the imports and initialize the two state values.

The likely stuck point is thinking the enum mapping alone changes the prepared data. Remember:
the `DiffFile` builder prepares rows; `DiffView` renders the matching layout. If a supplied
adapter test fails, read which of those two jobs it is describing before changing code.

## Verification

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

The browser must show a real code diff. Split and unified controls must change its layout.
Marking the change reviewed must update the Badge and disable the action without changing
the readonly domain object.

The specialized renderer currently creates a large production chunk. That is a real
integration tradeoff, not part of this exercise's implementation: route-level lazy loading
belongs to the later page/application-composition work.

## Official documentation

- [git-diff-view repository and quick start](https://github.com/MrWangJustToDo/git-diff-view)
- [React renderer package](https://github.com/MrWangJustToDo/git-diff-view/tree/main/packages/react)
- [File comparison package](https://github.com/MrWangJustToDo/git-diff-view/tree/main/packages/file)
- [React `useMemo`](https://react.dev/reference/react/useMemo)
- [React sharing state](https://react.dev/learn/sharing-state-between-components)
- [shadcn Card](https://ui.shadcn.com/docs/components/base/card)
- [shadcn Badge](https://ui.shadcn.com/docs/components/base/badge)
- [shadcn Button](https://ui.shadcn.com/docs/components/base/button)
- [Testing Library role queries](https://testing-library.com/docs/queries/byrole/)

## Completion

Report what help you used. Completion requires the learner-authored central behavior test,
all supplied tests, exercise and root typechecks, production build, and browser behavior.

System-design lesson to carry forward: third-party component APIs should terminate at an
application-owned adapter. Features coordinate business state through your stable props and
callbacks; they should not know how a vendor creates, initializes, or renders its objects.
