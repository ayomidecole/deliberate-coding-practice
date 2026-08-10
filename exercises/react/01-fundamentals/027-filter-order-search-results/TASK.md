# REACT-027: Derive Order Search Results in a Feature

Status: complete

Target time: 35–45 minutes

Primary capability: integrate controlled state with a collection derived during render

## Goal

Build an order-search feature that stores the user's search term, derives the matching
orders from supplied data, and passes those results to supplied reusable components. Then
author one behavior test proving that later searches produce the correct visible result.

This begins a feature-integration phase. It combines controlled input, component
composition, list output, state transitions, and behavior testing that you have practiced
separately. The single new operation is deriving a collection with `Array.prototype.filter`.

## Mental model

The feature has one source of changing state:

```text
OrderSearchField change event
            ↓
      searchTerm state
            ↓ each render
ORDER_SUMMARIES.filter(matchesSearchTerm)
            ↓
       visibleOrders
            ↓
       OrderResults
```

`visibleOrders` is calculated from the supplied orders and the current search term. It is
not another state value. When the term changes, React renders the feature again and the
calculation runs with the latest state. Storing both `searchTerm` and `visibleOrders` would
duplicate information and create two values that could fall out of sync.

The ownership and dependency direction is:

```text
types + components → feature workflow → app placement
```

- `OrderSearchField` owns the label, input markup, and prop wiring.
- `OrderResults` owns list and empty-result markup.
- `SearchOrdersFeature` owns state, the change handler, result derivation, and composition.
- `App` owns placement of the complete feature.

The supplied `matchesSearchTerm` predicate performs trimmed, case-insensitive matching
against an order reference or customer name. Your feature applies that predicate to each
order through `filter`.

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Declare feature-owned string state | demonstrated | REACT-022 through REACT-025 |
| Store `event.currentTarget.value` from a typed change event | demonstrated | REACT-022 through REACT-025 |
| Compose supplied components and pass value/callback props | demonstrated | REACT-018, REACT-019, and REACT-023 through REACT-025 |
| Pass a collection through a typed prop | known | Prior prop and list exercises |
| Render keyed collection output | supplied | `OrderResults` is complete |
| Apply a supplied predicate with `Array.prototype.filter` | **new** | Mental model, supplied data/predicate, and MDN reference below |
| Derive render output instead of duplicating state | demonstrated | REACT-024 and REACT-025 derived status from one state value |
| Author a multi-transition behavior case | demonstrated | REACT-023 through REACT-026 |

Test ownership is **starter plus learner case**. The environment, imports, cleanup, suite,
and initial-state example are supplied. You author one behavior case. Rebuilding the entire
test harness is not paired with the new collection operation.

## Your task

### 1. Implement the feature

Edit `src/features/orders/search-orders-feature.tsx` and replace `return null`.

The feature must:

- own one string state value initialized to `""`,
- define a named `ChangeEvent<HTMLInputElement>` handler that stores
  `event.currentTarget.value`,
- derive `visibleOrders` during render by filtering `ORDER_SUMMARIES` with the supplied
  `matchesSearchTerm` predicate and current search term,
- render a section labelled by a level-two heading named `Search orders`,
- compose `OrderSearchField` with the current term and change handler, and
- compose `OrderResults` with `visibleOrders`.

Keep the supplied order data and matching predicate unchanged. Do not define another
component in the feature file.

### 2. Author one behavior test

Keep the supplied initial-state test in
`src/features/orders/search-orders-feature.test.tsx` and add one new `it` case.

Your test must prove this sequence:

1. Render a fresh `SearchOrdersFeature`.
2. Locate `Search orders` as a searchbox.
3. Change the searchbox to `contoso`.
4. Verify `ORD-4096 — Contoso Foods` is visible.
5. Verify the two Northwind results and `No matching orders.` are absent.
6. Change the same searchbox to `missing`.
7. Verify `No matching orders.` is visible and all three order results are absent.

Choose a test name describing the user-visible filtering behavior. Use `getBy...` for
content that must exist and `queryBy...` for content that must be absent.

## Scope

- Edit only the feature and its test file.
- Do not change the supplied type, data, predicate, components, app, browser entry, or HTML.
- Do not add `visibleOrders`, validity, or an empty-results flag to state.
- Do not use an Effect to synchronize search results.
- Do not add validation, form submission, API work, domain classes, routing, hooks, stores,
  dependencies, styling, or test IDs.
- Preserve the shared code → feature → app dependency direction.

Your first three implementation edits should be:

1. Declare the search-term state and its typed change handler.
2. Derive `visibleOrders` by filtering the supplied collection.
3. Replace `return null` with the labelled section and connect both components.

The likely stuck point is deciding whether the results need their own state. Trace them back
to their two inputs—`ORDER_SUMMARIES` and `searchTerm`—and calculate them during render.

## Start and verify

Run the focused test before editing:

```bash
npx vitest run exercises/react/01-fundamentals/027-filter-order-search-results
```

The supplied initial-state test should fail because the feature currently renders nothing.
Implement the feature until that case passes, then add your filtering case and rerun the
focused command.

Afterward, run:

```bash
npm run typecheck
npx vite build exercises/react/01-fundamentals/027-filter-order-search-results
npx vitest run --exclude 'exercises/typescript/008-consume-job-admission-decision/**'
```

For the browser check, stop the previous development server and run:

```bash
npx vite exercises/react/01-fundamentals/027-filter-order-search-results --host 127.0.0.1
```

Open the printed local URL. Verify that all orders appear initially, `contoso` leaves one
result, and `missing` displays the empty-result message. Keep the server running when you
return for review.

## Documentation

- [React: choosing the state structure](https://react.dev/learn/choosing-the-state-structure)
- [React: you might not need an Effect](https://react.dev/learn/you-might-not-need-an-effect)
- [React: controlling an input with state](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable)
- [MDN: `Array.prototype.filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- [Testing Library: firing events](https://testing-library.com/docs/dom-testing-library/api-events/)
- [Testing Library: appearance and disappearance](https://testing-library.com/docs/guide-disappearance/)
- [Bulletproof React: project structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)

## Done when

- The feature keeps only the search term in state and derives its visible collection during
  render.
- Empty, matching, and no-match searches produce the required visible results.
- Shared components own their markup while the feature owns the workflow.
- The supplied starter test and learner-authored behavior case pass.
- Focused tests, typecheck, production build, stable suite, and browser checks pass.
- No out-of-scope file or behavior is changed.
