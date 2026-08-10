# REACT-026: Author Shipment Hold Behavior Tests

Status: complete

Target time: 25–35 minutes

Primary capability: independently author a React behavior-test harness and state-transition cases

## Goal

Write the complete behavior test suite for a supplied shipment feature. The production code
already implements a familiar boolean state transition; your job is to prove its user-visible
contract without testing implementation details.

This is a testing-only production task. You will not write or change the feature itself.

## Mental model

Treat the rendered feature as a user-observable state machine:

```text
fresh render  → Shipment is ready.
first click   → Shipment is on hold.
second click  → Shipment is ready.
```

Each test must render a fresh feature. Query what a user can perceive, perform the same
interaction a user performs, and assert the resulting screen:

```text
render → locate by accessible role/name → interact → observe
```

- `getBy...` expresses that something must be present.
- `queryBy...` expresses that something must be absent.
- `fireEvent.click(...)` crosses the user-interaction boundary.
- `cleanup` prevents one test's rendered DOM from leaking into another test.

Do not inspect the hook state or call the feature's handler directly. The public contract is
what appears on screen before and after a user clicks the button.

## Scope preflight

| Required operation | Classification | Evidence or support |
|---|---|---|
| Import Testing Library and Vitest APIs | demonstrated | Used throughout recent React feature tests |
| Register `cleanup` with `afterEach` | demonstrated | Present in prior React test harnesses |
| Organize cases with `describe` and `it` | demonstrated | Used throughout the React track |
| Render a fresh feature | demonstrated | REACT-013 through REACT-025 |
| Query a button by accessible role and name | demonstrated | REACT-014 through REACT-025 |
| Use `getByText` for presence | demonstrated | Recent feature tests |
| Use `queryByText` for absence | demonstrated | REACT-024 and REACT-025 |
| Click a control and assert a transition | demonstrated | REACT-014 through REACT-025 |
| Click the same control through two transitions | demonstrated | REACT-025 tested a round trip through state |

There are no unfamiliar operations. The only difficulty increase is scaffolding reduction:
you will author the imports, cleanup hook, suite, and both cases from scratch.

Test ownership is **fully learner-authored** because the behavior and harness operations are
familiar. Only the unfamiliar environment infrastructure—the supplied jsdom directive—is
provided.

## Your task

Edit only
`src/features/shipments/manage-shipment-hold-feature.test.tsx`. Keep its supplied first line.

Build a complete test harness and author exactly these two behavior cases:

### 1. Initial state

1. Render a fresh `ManageShipmentHoldFeature`.
2. Locate the `Toggle shipment hold` button by accessible role and name.
3. Verify `Shipment is ready.` is visible.
4. Verify `Shipment is on hold.` is absent.

### 2. Complete round trip

1. Render a fresh `ManageShipmentHoldFeature`.
2. Locate the same button by accessible role and name.
3. Click it once.
4. Verify the ready message is absent and the on-hold message is visible.
5. Click the same button a second time.
6. Verify the ready message is visible and the on-hold message is absent.

Choose test names that describe the user-visible behavior. Use `getBy...` only for content
that must exist and `queryBy...` for content that must be gone.

## Scope

- Edit only the supplied test file.
- Do not change the feature, component, app, browser entry, or HTML to make a test pass.
- Do not add dependencies, snapshots, test IDs, hook inspection, direct handler calls, async
  utilities, or extra test cases.
- Keep each case independent by rendering a fresh feature.

Your first three edits should be:

1. Add the Testing Library, Vitest, and feature imports beneath the supplied directive.
2. Register cleanup and open the feature's `describe` block.
3. Write the initial-state case before the round-trip case.

The likely stuck point is rebuilding the harness from memory and choosing presence versus
absence queries. Previous test files and the official documentation are allowed references;
the translation from this behavior contract into a complete suite remains yours.

## Start and verify

Run the focused test before editing:

```bash
npx vitest run exercises/react/01-fundamentals/026-author-shipment-hold-tests
```

It should fail because the supplied test file contains no suite yet. Then author the harness
and both cases until the focused command reports two passing tests.

Afterward, run:

```bash
npm run typecheck
npx vite build exercises/react/01-fundamentals/026-author-shipment-hold-tests
npx vitest run --exclude 'exercises/typescript/006-protect-worker-capacity/**'
```

For a complementary browser check, stop the previous development server and run:

```bash
npx vite exercises/react/01-fundamentals/026-author-shipment-hold-tests --host 127.0.0.1
```

Open the printed local URL and verify the visible message changes on each click.

## Documentation

- [Testing Library: About queries](https://testing-library.com/docs/queries/about/)
- [Testing Library: `ByRole`](https://testing-library.com/docs/queries/byrole/)
- [Testing Library: `ByText`](https://testing-library.com/docs/queries/bytext/)
- [Testing Library: firing events](https://testing-library.com/docs/dom-testing-library/api-events/)
- [React Testing Library API: `render` and `cleanup`](https://testing-library.com/docs/react-testing-library/api/)
- [Vitest: `describe`](https://vitest.dev/api/describe)
- [Vitest: test hooks](https://vitest.dev/api/hooks.html)
- [Vitest: `expect`](https://vitest.dev/api/expect)

## Done when

- You authored the imports, cleanup hook, suite, and both behavior cases.
- The initial state and complete `ready → hold → ready` round trip are independently proven.
- Your assertions use accessible/user-visible output and the correct presence/absence query.
- Focused tests, typecheck, production build, stable suite, and browser behavior pass.
- No production or out-of-scope file is changed.
