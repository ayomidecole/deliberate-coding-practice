# REACT-029: Retrieve a Derived Inventory Collection

Status: complete

Target time: 20–30 minutes

Primary capability: independently derive a collection with `filter`

## Goal

Build an inventory feature that shows only items with stock remaining. This is a narrow
retrieval task after the guided filtering work in REACT-027 and REACT-028: there is no
state, callback, or interaction branch to manage.

## Mental model

The supplied collection is the source data. The feature derives the subset needed by this
workflow and passes that result into a shared rendering component:

```text
INVENTORY_ITEMS
      ↓ filter by the inventory rule
availableItems
      ↓ items prop
InventoryResults
```

`InventoryResults` owns the list markup. `ReviewAvailableInventoryFeature` owns the
workflow rule that decides which records belong in the list. `App` only places the
completed feature.

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Compare a number with zero | known | Established TypeScript/JavaScript operation |
| Derive a collection with `filter` | guided | REACT-027 and REACT-028 used it with A4 help; this task retrieves it |
| Pass a derived collection through props | demonstrated | REACT-027 and REACT-028 |
| Compose a labelled feature section | demonstrated | Prior feature exercises |
| Query visible and absent text in a test | demonstrated | REACT-026 through REACT-028 |
| Render keyed collection output | supplied | `InventoryResults` is complete |

There are no new operations. Removing state and callbacks isolates the one capability that
still needs independent evidence.

Test ownership is **starter plus learner case**. The environment, imports, cleanup, suite,
and heading case are supplied. You add one behavior case using test operations you have
already practiced.

## Your task

### 1. Implement the feature

Edit `src/features/inventory/review-available-inventory-feature.tsx` and replace
`return null`.

The feature must:

- derive an `availableItems` collection from `INVENTORY_ITEMS`,
- use `filter` to keep only items whose `quantity` is greater than zero,
- render a section labelled by a level-two heading named `Available inventory`, and
- render `InventoryResults` with `availableItems`.

Do not change the supplied inventory data or define another component in the feature file.

### 2. Author one behavior test

Keep the supplied heading case and add one new `it` case in
`src/features/inventory/review-available-inventory-feature.test.tsx`.

Your case must prove that:

- `Desk lamp — 4 available` is visible,
- `Monitor arm — 2 available` is visible,
- `USB-C dock — 0 available` is absent, and
- exactly two list items are rendered.

Choose a test name that describes the user-visible inventory rule.

## Scope

- Edit only the feature and its test file.
- Do not change the type, supplied component, app, browser entry, HTML, or source data.
- Do not add state, an Effect, event handlers, another collection, or another component.
- Do not mutate or sort `INVENTORY_ITEMS`.
- Do not add API work, domain classes, routing, pages, hooks, stores, dependencies,
  styling, or test IDs.

Attempt the implementation without reopening REACT-027 or REACT-028 and disclose any help
you use. This is retrieval evidence, not a restriction against documentation.

Your first three edits should be:

1. Derive `availableItems` from the supplied collection.
2. Replace `return null` with the labelled section and compose `InventoryResults`.
3. Add the inventory behavior test.

The likely stuck point is the predicate: each invocation must answer whether that one item
has stock remaining.

## Start and verify

Run the focused test before editing:

```bash
npx vitest run exercises/react/01-fundamentals/029-derive-available-inventory
```

The supplied heading case should fail because the feature renders nothing. After your
implementation and test are complete, run:

```bash
npx vitest run exercises/react/01-fundamentals/029-derive-available-inventory
npm run typecheck
npx vite build exercises/react/01-fundamentals/029-derive-available-inventory
npx vitest run --exclude 'exercises/typescript/008-consume-job-admission-decision/**'
```

For the browser check, stop the previous development server and run:

```bash
npx vite exercises/react/01-fundamentals/029-derive-available-inventory --host 127.0.0.1
```

Confirm that the heading and two available items appear, while the out-of-stock dock does
not.

## Documentation

- [MDN: `Array.prototype.filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- [React: rendering lists](https://react.dev/learn/rendering-lists)
- [Testing Library: `ByText`](https://testing-library.com/docs/queries/bytext/)
- [Testing Library: `ByRole`](https://testing-library.com/docs/queries/byrole/)
- [Bulletproof React: project structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)

## Done when

- `availableItems` is derived with `filter` and is not stored or mutated.
- Only records with positive quantities reach the supplied results component.
- The shared component owns list rendering and the feature owns the inventory rule.
- The supplied heading case and learner-authored behavior case pass.
- Focused tests, typecheck, production build, stable suite, and browser checks pass.
- No out-of-scope file or behavior is changed.
