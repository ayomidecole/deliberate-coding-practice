# REACT-028: Retrieve Derived Shipment Filtering

Status: complete

Target time: 30–40 minutes

Primary capability: independently retrieve a collection derived from feature state

## Goal

Build a shipment-delay feature that switches between all supplied shipments and only the
delayed shipments. Then author one behavior test proving the complete
`all → delayed only → all` interaction.

REACT-027 introduced `filter` with solution-level help. This task introduces no new React
or JavaScript operation. It changes the input from a search string to a boolean choice so
you must reconstruct the derived-collection idea rather than repeat the previous code.

## Mental model

The feature stores the user's filtering choice, not a second copy of the results:

```text
ShipmentDelayFilter reports false or true
                    ↓
          showDelayedOnly state
                    ↓ each render
      false → all supplied shipments
      true  → shipments whose isDelayed is true
                    ↓
             ShipmentResults
```

The source collection is fixed and supplied. `visibleShipments` is calculated during each
render from that collection and `showDelayedOnly`. If both the choice and visible results
were stored in state, they could disagree.

The ownership direction remains:

```text
types + components → feature workflow → app placement
```

- `ShipmentDelayFilter` owns the two buttons and reports the requested boolean value.
- `ShipmentResults` owns the list markup.
- `ReviewShipmentDelaysFeature` owns state, filtering, and component composition.
- `App` owns placement of the complete feature.

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Declare boolean state | demonstrated | REACT-015, REACT-017, and REACT-018 |
| Store a typed payload reported by a child component | demonstrated | REACT-019 and later controlled features |
| Choose rendered data from a boolean state value | demonstrated | Conditional and derived-state exercises |
| Use a boolean property as a predicate decision | known | Prior TypeScript and React condition work |
| Derive a collection with `Array.prototype.filter` | guided | REACT-027 completed with A4 help; this task retrieves it |
| Pass state, callbacks, and a collection through props | demonstrated | REACT-018 through REACT-027 |
| Render keyed collection output | supplied | `ShipmentResults` is complete |
| Author a two-transition button behavior test | demonstrated | REACT-024 through REACT-026 |

There are no unfamiliar operations. The difficulty increase is retrieval with reduced
scaffolding in a different state and interaction context.

Test ownership is **starter plus learner case**. The test environment, imports, cleanup,
suite, and initial-state example are supplied. You author the complete interaction case so
test work remains present without increasing harness responsibility.

## Your task

### 1. Implement the feature

Edit `src/features/shipments/review-shipment-delays-feature.tsx` and replace `return null`.

The feature must:

- own one boolean state value initialized to `false`,
- define a named handler that accepts the next filter choice as a `boolean` and stores it,
- derive `visibleShipments` during render from `SHIPMENT_SUMMARIES` and the current choice,
- keep every shipment when the choice is `false`,
- use `filter` to keep only records whose `isDelayed` value is `true` when the choice is
  `true`,
- render a section labelled by a level-two heading named `Review shipment delays`,
- compose `ShipmentDelayFilter` with the current choice and handler, and
- compose `ShipmentResults` with `visibleShipments`.

Do not change the supplied shipment data. Do not define another component in the feature
file.

### 2. Author one behavior test

Keep the supplied initial-state case in
`src/features/shipments/review-shipment-delays-feature.test.tsx` and add one new `it` case.

Your case must prove this sequence:

1. Render a fresh `ReviewShipmentDelaysFeature`.
2. Locate `Delayed only` and `All shipments` as buttons.
3. Click `Delayed only`.
4. Verify both delayed shipment rows are visible and the on-schedule row is absent.
5. Click `All shipments`.
6. Verify all three shipment rows are visible again.

Choose a test name that describes the visible round trip. Test what the user sees rather
than inspecting state or calling the feature handler directly.

## Scope

- Edit only the feature and its test file.
- Do not change the supplied data, type, components, app, browser entry, or HTML.
- Do not store `visibleShipments` or another copy of the collection in state.
- Do not use an Effect, mutate or sort `SHIPMENT_SUMMARIES`, or call a component as a
  regular function.
- Do not add search, validation, forms, API work, domain classes, routing, pages, hooks,
  stores, dependencies, styling, or test IDs.
- Preserve the shared code → feature → app dependency direction.

For independent retrieval evidence, first attempt the implementation without reopening
REACT-027 or requesting solution code. Official documentation is allowed. Disclose any
help you use; needing help is not failure, but it changes what the task proves.

Your first three implementation edits should be:

1. Declare the boolean state and payload handler.
2. Derive `visibleShipments` from the choice and supplied collection.
3. Replace `return null` with the labelled section and connect both components.

The likely stuck point is the `false` branch. It should use the complete supplied
collection; only the `true` branch needs to remove records.

## Start and verify

Run the focused test before editing:

```bash
npx vitest run exercises/react/028-filter-delayed-shipments
```

The supplied initial-state case should fail because the feature currently renders nothing.
Implement the feature until it passes, then add the round-trip case and rerun the command.

Afterward, run:

```bash
npm run typecheck
npx vite build exercises/react/028-filter-delayed-shipments
npx vitest run --exclude 'exercises/typescript/008-consume-job-admission-decision/**'
```

For the browser check, stop the previous development server and run:

```bash
npx vite exercises/react/028-filter-delayed-shipments --host 127.0.0.1
```

Open the printed local URL. Confirm that all shipments appear initially, `Delayed only`
leaves two rows, and `All shipments` restores the complete list. Keep the server running
when you return for review.

## Documentation

- [React: choosing the state structure](https://react.dev/learn/choosing-the-state-structure)
- [React: you might not need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [React: sharing state between components](https://react.dev/learn/sharing-state-between-components)
- [MDN: `Array.prototype.filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- [Testing Library: `ByRole`](https://testing-library.com/docs/queries/byrole/)
- [Testing Library: firing events](https://testing-library.com/docs/dom-testing-library/api-events/)
- [Bulletproof React: project structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)

## Done when

- One boolean state value controls whether the complete or filtered collection is passed.
- The derived collection is calculated during render and never stored or mutated.
- Shared components own their markup while the feature owns the workflow.
- The supplied starter test and learner-authored round-trip case pass.
- Focused tests, typecheck, production build, stable suite, and browser checks pass.
- No out-of-scope file or behavior is changed.
