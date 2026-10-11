# REACT-062 — Connect the scouting-report workflow

## Goal

Riverside's recruitment team wants to read Luis Costa's report, distinguish a missing
report from a service outage, and recover by loading a valid report afterward.
You own the request-to-screen connection: **API client plus feature handler**.
Same protocol as 061; no new UI, response cases, or async mechanism.

## Ownership and starting point

1. Implement `src/api/get-scouting-report.ts`; pass its tests first.
2. Implement only the `try` block of `loadReport` in
   `src/features/scouting/retrieve-scouting-report-feature.tsx`.

Imports, signatures, state declaration, catch block, JSX, domain, types, components,
mock server, and tests are supplied. Leave them in place. You are not writing an API
server. References are welcome; tell me what you used at review.

First edit: replace the client's placeholder statements with an awaited fetch using
its `reportId` argument. Work through checkpoint 1 before editing the feature.

## Checkpoint 1 — API client

Request **GET `/api/scouting-reports/:reportId`**, substituting the argument.

| HTTP outcome | Return or throw |
|---|---|
| 404, empty body | Return `null` without reading JSON |
| Other unsuccessful response | Throw `Error` with `Scouting report request failed with status N`, using the actual status |
| Successful response | Read JSON into an `unknown` value, then return a validated `ScoutingReport` instance |

The constructor accepts the parsed body. Let network, parsing, and validation errors
propagate; do not turn them into `null`. Choose branch order and exits so an outcome
does not accidentally continue into another path.

The distinction to keep in mind:

`HTTP Response → parsed JSON body → ScoutingReport`

Both obtaining the response and reading its JSON body are asynchronous. A type
annotation does not resolve a Promise. Before coding, identify which value carries
the HTTP status and which belongs in the domain constructor.

Supplied successful wire sample:

```json
{
  "report_id": "report-luis",
  "playerName": "Luis Costa",
  "recommendation": "watch",
  "summary": "Strong positioning and composed passing from defence."
}
```

The supplied domain maps `report_id` to `reportId`. Do not duplicate its validation.

Docs:

- [MDN: checking response status](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#checking_response_status)
- [MDN: reading the response body](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#reading_the_response_body)

From the repository root:

```bash
npx vitest run exercises/react/05-async-api-integration/062-connect-scouting-report-workflow/src/api
```

Checkpoint: **7 API tests pass**. The browser still does nothing until checkpoint 2.

## Checkpoint 2 — Feature handler

Replace `void reportId;` inside `loadReport`'s `try` block. Call the imported client
with that ID; do not fetch or decode JSON in the feature.

| Moment / client outcome | What the feature stores using `setRequestState` |
|---|---|
| Request begins | `{ status: 'loading' }` |
| Client resolves to `null` | `{ status: 'not-found' }` |
| Client resolves to a model | `{ status: 'success', record: returnedModel }` |
| Client throws | Supplied catch handles this; leave it unchanged |

`returnedModel` means your local variable holding the client's resolved value.
Keep missing and success paths exclusive: setting state does not stop execution.
The success state must hold the actual model, not the HTTP response or a Promise.

The supplied panel renders state and disables controls while loading. Replacing the
previous state with loading clears the previous record/error. Keep the existing state
representation for this exercise; no additional state variables or helper abstractions.

Start this checkpoint by setting loading inside the existing `try`, before the request.

Doc: [React: connect event handlers to state](https://react.dev/learn/reacting-to-input-with-state#step-5-connect-the-event-handlers-to-set-the-state).
Focus on the updates around `await` in `handleSubmit`; our supplied state uses an object.

```bash
npx vitest run exercises/react/05-async-api-integration/062-connect-scouting-report-workflow/src/features/scouting/retrieve-scouting-report-feature.test.tsx
```

Checkpoint: **7 feature tests pass**. These supply client outcomes so a client bug
does not obscure handler feedback. The integration tests then connect both real files.

## Complete workflow checks

```bash
npx vitest run exercises/react/05-async-api-integration/062-connect-scouting-report-workflow
npx tsc --noEmit -p exercises/react/05-async-api-integration/062-connect-scouting-report-workflow/tsconfig.json
```

Starter: **9 passing, 16 failing tests**, typecheck passing. Complete: **25 tests
and typecheck pass**. Do not edit supplied tests to remove expected starter failures.

Stop the previous Vite process before starting this exercise:

```bash
npx vite exercises/react/05-async-api-integration/062-connect-scouting-report-workflow --config exercises/react/05-async-api-integration/062-connect-scouting-report-workflow/vite.config.mjs --port 5173 --strictPort
```

At [localhost:5173](http://localhost:5173/), confirm the header says **REACT-062**.
The starter buttons intentionally do nothing. When finished, check:

1. Load Luis: loading, then his name, recommendation, and summary.
2. Load missing report: loading, then `No report exists for this player.`
3. Try service outage: loading, then the deliberate 503 error.
4. Load Luis again: the error clears and the report appears. Reload and repeat.

UI reference: [shadcn Button](https://ui.shadcn.com/docs/components/base/button), supplied.

## Review and design lesson

Tell me which references or help you used. Trace the missing-report request across
both files: where does HTTP become absence, and where does absence become screen state?
Explain what prevents either branch from continuing into its success path.

Design lesson: the client owns transport interpretation; the feature owns the user's
request state. Their shared contract is a model, absence, or failure—not raw HTTP.

## Scope preflight

| Operation | Evidence / support |
|---|---|
| URL construction and awaited fetch | Demonstrated in 061 |
| HTTP branches, parsed body, domain construction, error propagation | Retrieved with targeted await help in 061; outcome contract/docs retained |
| Loading, awaiting client, storing model, exclusive absence branch | Retrieved in 059; guided transfer in 060; state/catch/JSX supplied |
| Tests and browser checks | Demonstrated workflow; all test authorship supplied |
| Domain, components, mocks, infrastructure | Supplied; no new responsibility |

New operations: none. Increased dimension from 061: ownership of the feature handler.
No extra branches or reduced handler scaffolding compared with 060. First three edits:
fetch response, classify outcomes, decode success. Likely stuck point: confusing a
pending value with resolved data, or letting absence fall through. Separate test
checkpoints keep those failures observable. Choose further work from the review,
not from a fixed promise to introduce another concept next.
