# REACT-064 — Retrieve a training session

## Goal

Riverside's coaches need Tuesday's training plan. The screen must distinguish a
session that exists, a missing session, and a service outage, then recover when a
later request succeeds.

You own **the API client and the feature handler**. This retrieves the same protocol
in a coaching context after the guided decoding repair in 063. No new async operation.
Imports, contracts, domain, UI, state declaration, catch, server, and tests are supplied.

## Start with the values

Before writing, identify the three values on a successful request: the HTTP response,
the parsed session data, and the validated domain instance. Say which one carries
HTTP status and which contains `session_id`. Use documentation if needed.

Your first edit is in `src/api/get-training-session.ts`: replace the placeholder with
an awaited fetch using `sessionId`. Complete checkpoint 1 before editing the feature.
Try implementing from the contract below before consulting a previous solution.
References remain welcome; report what you used at review.

## Checkpoint 1 — Client

Implement `getTrainingSession(sessionId)` using GET `/api/training-sessions/:sessionId`.
Substitute the argument; the function must work for IDs other than Tuesday's.

| Response | Client outcome |
|---|---|
| 404 with an empty body | Return `null`; do not read JSON |
| Any other unsuccessful HTTP status | Throw `Error` with `Training session request failed with status N`, using the actual status |
| Successful response | Await its JSON body into an `unknown` value; return a `TrainingSession` validated from that data |

Let network, parsing, and domain errors propagate. Do not convert failures to absence.
Choose the branch order and exits so each response reaches its intended outcome.
Keep HTTP response handling and domain validation in this client; the feature will
receive only a model, `null`, or a thrown error.

The supplied API's successful wire sample:

```json
{
  "session_id": "session-tuesday",
  "title": "Tuesday pressing practice",
  "focus": "tactical",
  "summary": "Rehearse pressing triggers and recovery runs."
}
```

The supplied constructor maps `session_id` to `sessionId` and validates the fields.
You do not repeat that validation or author the domain class.

Documentation:

- [MDN: checking response status](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#checking_response_status)
- [MDN: reading the response body](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#reading_the_response_body)

Run from `/Users/Ruffio/Desktop/Learn to code`:

```bash
npx vitest run exercises/react/05-async-api-integration/064-retrieve-training-session/src/api
```

Checkpoint: **7 client tests pass**. The browser waits for the feature implementation.

## Checkpoint 2 — Feature handler

In `src/features/training/retrieve-training-session-feature.tsx`, replace only
the starter body inside `loadSession`'s `try` block (or complete your current attempt).
Preserve the supplied catch, named request states, and JSX.

| Moment / client outcome | State passed to `setRequestState` |
|---|---|
| Request starts | `requestStates.loading` |
| Client resolves to `null` | `requestStates.notFound` |
| Client resolves to a model | `requestStates.success(returnedSession)` |
| Client throws | Supplied catch handles the error |

`returnedSession` means your local variable holding the client's resolved value.
The supplied `requestStates` variable contains the states so you do not need to
type object literals. Loading and absence have no payload; success is a function
because it must include the session returned by this request. For example:

```ts
setRequestState(requestStates.loading);
```

Call the imported `getTrainingSession` with the handler's `sessionId`. Do not fetch,
read JSON, or construct the model here. Keep missing and success paths exclusive.
Starting another request replaces previous record/error state with loading.

First edit in this file: set loading before awaiting the request. No new state
variables, effects, imports, or test authorship required. State construction is supplied.

Doc: [React: connect event handlers to state](https://react.dev/learn/reacting-to-input-with-state#step-5-connect-the-event-handlers-to-set-the-state).
Look at the updates surrounding `await` in `handleSubmit`; use our supplied named states.

```bash
npx vitest run exercises/react/05-async-api-integration/064-retrieve-training-session/src/features/training/retrieve-training-session-feature.test.tsx
```

Checkpoint: **7 feature tests pass**. Those tests supply client outcomes to isolate
handler feedback; integration tests exercise your two implementations together.

## Verify the complete screen

```bash
npx vitest run exercises/react/05-async-api-integration/064-retrieve-training-session
npx tsc --noEmit -p exercises/react/05-async-api-integration/064-retrieve-training-session/tsconfig.json
```

Starter: **9 passing, 16 failing tests**, typecheck passing. Complete: **25 tests and
typecheck pass**. Preserve supplied tests and fixtures.

The browser server is configured for 064. To restart, stop the previous Vite process:

```bash
npx vite exercises/react/05-async-api-integration/064-retrieve-training-session --config exercises/react/05-async-api-integration/064-retrieve-training-session/vite.config.mjs --port 5173 --strictPort
```

At [localhost:5173](http://localhost:5173/), confirm the header says **REACT-064**.
The starter buttons intentionally do nothing. Once implemented, verify loading,
Tuesday's title/focus/summary, missing-session text, the deliberate 503 error, and
recovery by loading Tuesday again. Reload and repeat.

UI docs: [shadcn Button](https://ui.shadcn.com/docs/components/base/button), supplied.

## Review

Tell me which references or help you used. Explain what value crosses each boundary:
HTTP → JSON → domain → feature → component. Trace the 404 path and explain why it
does not read a body or continue into success. We will judge the next step from your
implementation and explanation, with delayed retrieval still part of mastery.

Design lesson: the client translates external responses; the feature controls the
request lifecycle; the component renders the model and state it receives.

## Scope preflight

| Operation | Evidence / support |
|---|---|
| Parameterized URL and HTTP branching | Demonstrated in 062 |
| Await body; select domain input; propagate failures | Guided in 063; retrieval target, contract/docs retained |
| Loading, await client, exclusive null branch, model storage | Correct in 062 with syntax references; state/catch/JSX retained |
| Focused tests and browser checks | Demonstrated workflow; infrastructure supplied |
| Domain, UI, mock server, test authorship | Supplied |

No new operations. Changed context and construction mode replace 063's guided repair;
response cases, transformations, and scaffolding match the previous construction.
First three edits: fetch response, classify it, decode success. Likely stuck point:
the value passed into the constructor. Identify its contents before writing that call.
Only two learner files; separate checkpoints keep failures attributable.
