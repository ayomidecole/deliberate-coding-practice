# REACT-058 — Connect an API result to React state

## Goal

Riverside's medical desk needs feedback while it checks a player's availability:
show that the request is running, then show the returned record, a missing-record
message, or an error.

Your API client already makes the right decisions. Now you will connect that client
to the feature's state so the existing screen responds to a request.

## Your file

Work only in **`src/features/players/retrieve-player-availability-feature.tsx`**.

Inside the supplied `loadAvailability` handler, replace **`void playerId;`** in the
`try` block with your implementation. Keep the supplied `catch`, state declaration,
imports, and JSX.

Everything outside that block is supplied: the working API client from 057, types,
domain validation, components, error handling, mock endpoint, and tests.
There are no intentional bugs in these supplied parts.

## The new connection

Previously, your event handlers changed state immediately. Here the handler has work
on both sides of an asynchronous request:

```text
click → loading state → await API client
                              ├─ model → success state containing the model
                              ├─ null  → not-found state
                              └─ error → supplied catch sets error state
```

`await` pauses this handler, not the whole browser. React can show the loading state
while the request is pending. Calling a state setter asks React to render again;
simply returning a model from the event handler does not display it.

The API client has already handled HTTP status, JSON, and validation. Your feature
receives a **`PlayerAvailability | null`**, not a `Response`. Do not call `fetch`,
`response.json()`, or the domain constructor again here.

## What to implement

The supplied setter is `setRequestState`. Give it a complete state object:

| Moment or result | State object |
|---|---|
| Request starts, before waiting for the client | `{ status: 'loading' }` |
| Client resolves to `null` | `{ status: 'not-found' }` |
| Client resolves to a model | `{ status: 'success', record: theReturnedModel }` |

`theReturnedModel` in that table is a description, not a supplied variable.
You choose a local name for the awaited result.

Your handler must:

- enter loading when a button is clicked,
- call `getPlayerAvailability` with the handler's `playerId` and await the result,
- choose the appropriate resolved state from the table, and
- leave request rejection to the existing `catch`.

A missing result must not fall through and overwrite itself with success.
Use your existing branch/return knowledge to keep those outcomes separate.
Do not hard-code Leon's data: store whatever model the client returns.

The state object represents the **current request**, so starting another request
replaces the previous record or error with loading. The supplied component already
uses that state to disable buttons and choose what to show. You do not need separate
loading, error, or record state variables.

### First edit

Open the handler and replace its placeholder with the state update for **request
started**. Next, make the awaited client call. Then decide which state each resolved
value should produce.

All of this belongs inside the existing event handler's `try` block—not in JSX,
not directly in the component body, and not in a new `useEffect`.
The component function itself stays synchronous.

## Documentation

Read the focused sections, not entire guides:

- [React: setting state triggers renders](https://react.dev/learn/state-a-components-memory#adding-a-state-variable)
  — connects the setter to the screen.
- [React: event handlers](https://react.dev/learn/responding-to-events#adding-event-handlers)
  — the handler runs after a click; the supplied JSX already connects it.
- [MDN: await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#description)
  — explains the fulfilled value and what happens when the awaited promise rejects.

The `async` signature and `try/catch` are supplied scaffolding, not additional
implementation targets. A rejection at the awaited client call enters that catch;
a returned `null` does not.

UI reference: [shadcn Button](https://ui.shadcn.com/docs/components/base/button).
It is the only library UI component here and is already implemented.

## Run and check

Use the repository root—not the exercise folder—as your working directory:

```bash
cd "/Users/Ruffio/Desktop/Learn to code"
npx vitest run exercises/react/05-async-api-integration/058-connect-availability-request-state
npx tsc --noEmit -p exercises/react/05-async-api-integration/058-connect-availability-request-state/tsconfig.json
```

**Starter:** 15 tests pass and 6 feature tests fail because the handler does nothing.
The API, domain, and real HTTP endpoint tests already pass. Typechecking also passes.

**Finished:** all 21 tests and the typecheck pass. The feature tests control when a
request resolves, so they check the loading period as well as the final result.
Those test helpers are supplied; do not rewrite them or add delays to your feature.

To run the screen from that same repository root, stop the previous exercise's Vite
process, then run:

```bash
npx vite exercises/react/05-async-api-integration/058-connect-availability-request-state --config exercises/react/05-async-api-integration/058-connect-availability-request-state/vite.config.mjs --port 5173 --strictPort
```

Open [the local app](http://localhost:5173/) and confirm the header says **REACT-058**.
Before your implementation, clicks do nothing. That is the placeholder, not broken
mock infrastructure.

The supplied endpoint waits about 600 ms so loading is visible. After implementation:

| Action | What to see |
|---|---|
| Check Leon | Loading, then Leon's availability and medical note |
| Check missing record | Loading, then the missing-record message |
| Try service outage | Loading, then the 503 error message |
| Check Leon after an outage | The old error disappears during loading, then Leon appears |

Buttons are disabled while waiting and enabled again afterward. Reload and repeat.

## Review checkpoint

Tell me which references or help you used, and explain:

1. Why must the loading update happen before the awaited call?
2. Why is returning the model from this handler different from storing it in state?

Design lesson: the API client owns transport and decoding; the feature owns the
user-visible request lifecycle. The component renders that lifecycle without knowing
how the data was fetched.

## Scope preflight

| Required operation | Evidence and scope |
|---|---|
| Run a handler and use a state setter | Demonstrated in 052–053; declaration and callback wiring supplied |
| Consume the model/null/error contract | Retrieved in 056–057; working client supplied, independence not assumed |
| Await a result and branch on null | Used in 056–057; adapted to the feature |
| Coordinate state before and after the request | New integration operation; state shapes and lifecycle guide supplied |
| Handle rejection and render each state | Supplied catch and JSX; no new error-handling authorship |
| Run checks and observe browser behavior | Demonstrated; all tests and mock infrastructure supplied |

The first three edits are the loading update, awaited call, and resolved-result branch.
Likely sticking point: returning the result instead of updating state. The guide above
addresses that without supplying a finished handler.

Only asynchronous feature-state ownership increases. There is no new response contract,
UI primitive, routing, automatic loading, concurrency, or test-harness responsibility.
