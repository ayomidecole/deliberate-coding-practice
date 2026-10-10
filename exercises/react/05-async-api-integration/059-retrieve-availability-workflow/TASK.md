# REACT-059 — Retrieve the availability workflow

## Goal

Riverside's coaching staff wants to check Maya Santos's matchday availability.
Connect the request to the screen: show loading, then the player's record, a
missing-record message, or a service error. An outage must never look like a
missing record.

This is reinforcement, not a new API concept. You own **both the API client and
the feature handler**, in two checkpoints. References to 057–058 are welcome;
try to explain each decision rather than copying the whole implementation.

## Ownership and starting point

| Your file | What you implement |
|---|---|
| `src/api/get-player-availability.ts` | Replace its placeholder body with the request and response handling |
| `src/features/players/retrieve-player-availability-feature.tsx` | Replace `void playerId;` inside the handler's `try` block |

Imports, signatures, state declaration, catch block, JSX, domain, UI, mock server,
and all tests are supplied. Keep those parts. Do not edit tests to make them pass.

Start with the API file. Its parameter is the player ID; its output is a validated
`PlayerAvailability` model or `null`. It can also reject with an error.

```text
Button → feature sets loading → API client makes HTTP request
                                  ├─ valid JSON → domain model → success + record
                                  ├─ 404 → null → not-found
                                  └─ failure → throws → supplied catch → error
```

## Checkpoint 1 — API client

Endpoint: **GET `/api/player-availability/:playerId`**. Substitute the function's
parameter for `:playerId`; do not hard-code Maya's ID.

Read [MDN: checking response status](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#checking_response_status)
and [reading the response body](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#reading_the_response_body).
Unlike MDN's general example, this endpoint deliberately treats 404 as absence.

| HTTP outcome | Client must do |
|---|---|
| 404 | Return `null` without reading JSON |
| Any other unsuccessful response | Throw `Error` with message `Availability request failed with status N`, where N is the actual status |
| Successful response | Await JSON, hold it as `unknown`, and return `new PlayerAvailability(body)` |

Network, JSON-reading, and domain-validation errors should propagate to the caller.
Do not add a catch that changes failures into `null`.

**First edit:** replace the placeholder with an awaited `fetch` call using the
parameter, storing the `Response` in a local variable. Then classify its status
before reading its body. A 404 is also `!response.ok`; choose your branch order
so it can reach its intended outcome.

From the repository root:

```bash
cd "/Users/Ruffio/Desktop/Learn to code"
npx vitest run exercises/react/05-async-api-integration/059-retrieve-availability-workflow/src/api/get-player-availability.test.ts
```

Get these 6 tests passing before working on the feature. The browser still does
nothing at this checkpoint because its handler is a placeholder.

## Checkpoint 2 — Feature handler

Read [React: connect event handlers to state](https://react.dev/learn/reacting-to-input-with-state#step-5-connect-the-event-handlers-to-set-the-state).
Focus on `handleSubmit`: a state change before awaiting work and another afterward.
Our state is an object rather than the example's string.

Inside the supplied `try` block, implement these transitions:

| Moment or returned value | Next state |
|---|---|
| Request begins, before awaiting the client | `{ status: 'loading' }` |
| Client returns `null` | `{ status: 'not-found' }` |
| Client returns a model | `{ status: 'success', record: receivedModel }` |

`receivedModel` means the local variable you choose for the awaited result; it is
not a supplied identifier. Call `getPlayerAvailability` with the handler's `playerId`.
Use `setRequestState` to give React the next state object. Keep the existing catch.

Two reminders from 058:

- Updating state does **not** exit a function. Keep the missing and success paths
  separate using a return or an else.
- Success needs both a status and the returned model. The supplied panel receives
  `requestState.record`; a local variable alone cannot give the panel its data.

Do not fetch or decode JSON again here. Do not add effects, extra state variables,
or automatic requests during rendering. The feature consumes the client's
model/null/error contract, not raw HTTP responses.

Run the isolated feature checks:

```bash
npx vitest run exercises/react/05-async-api-integration/059-retrieve-availability-workflow/src/features/players/retrieve-player-availability-feature.test.tsx
```

These tests supply fake client outcomes to isolate your state logic. The integration
tests below instead exercise your **real client and feature together**, supplying
only the HTTP response.

## Verify the connected workflow

```bash
npx vitest run exercises/react/05-async-api-integration/059-retrieve-availability-workflow
npx tsc --noEmit -p exercises/react/05-async-api-integration/059-retrieve-availability-workflow/tsconfig.json
```

Starter: 9 tests pass and 15 fail because the two implementations are missing;
typechecking passes. Finished: all 24 tests and typechecking pass.

To serve this exercise, stop the previous Vite process and run from the repo root:

```bash
npx vite exercises/react/05-async-api-integration/059-retrieve-availability-workflow --config exercises/react/05-async-api-integration/059-retrieve-availability-workflow/vite.config.mjs --port 5173 --strictPort
```

Open [localhost:5173](http://localhost:5173/) and check the header says **REACT-059**.
After both checkpoints, check Maya, then the missing record, then the outage, then
Maya again. Each request shows loading briefly. The missing-record message and the
503 error are expected results, not broken infrastructure. Reload and repeat.

The supplied UI uses [shadcn Button](https://ui.shadcn.com/docs/components/base/button).
You are not implementing a UI component this time.

## Review

Tell me what references/help you used. Trace one success and one 404 from HTTP
response through client return value to feature state and visible output.
Explain why a 503 must take a different path from a 404.

Design lesson: the API client translates the external response into a usable
contract; the feature translates that contract into a user-visible lifecycle.
Keeping them separate lets us test each responsibility and their connection.

## Scope preflight

| Operation | Evidence / support |
|---|---|
| GET, HTTP classification, JSON and domain construction | Retrieved in 056–057; contract/docs supplied; independence unassessed |
| Async state transitions and model storage | Guided in 058; state objects and ownership explained above |
| Null branch and stopping fallthrough | Guided in 058; explicit reminder retained |
| Catch errors and render outcomes | Supplied scaffolding |
| Author both sides of the connection | Only increased dimension; checkpoints isolate each file |
| Run tests and browser checks | Previously demonstrated; infrastructure/tests supplied |

No new protocol, response shape, UI, or test authorship. First three edits: await
fetch, classify absence/failure, decode the successful response. Likely stuck point:
confusing an HTTP status with the client's model/null result; the flow above locates
each decision. Pause for feedback at either checkpoint rather than widening scope.
