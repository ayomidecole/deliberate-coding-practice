# REACT-060 — Retrieve a match report

## Goal

Riverside's analyst wants to read the report from the Northbridge match. The screen
must distinguish a report that exists, one that is missing, and a service failure.
It should show loading while waiting and recover when another request succeeds.

You are applying the workflow from 059 to a different resource, not learning a new
async mechanism. The two implementation boundaries remain yours. Domain validation,
UI, state declaration, error catch, imports, and all tests are supplied.

## Your two checkpoints

1. Implement `src/api/get-match-report.ts`. Get its focused tests passing first.
2. Implement the `try` block in `loadReport` in
   `src/features/matches/retrieve-match-report-feature.tsx`.

Do not edit the tests or supplied UI/domain. References are welcome. Try making your
first attempt from this contract; if you consult an earlier file, tell me at review.

## 1. API client: HTTP response → model or absence

Implement `getMatchReport(matchId)` using **GET `/api/match-reports/:matchId`**.
Substitute the parameter into the URL; do not hard-code the Northbridge ID.

| HTTP response | Client outcome |
|---|---|
| 404, empty body | Return `null`, without trying to read JSON |
| Other unsuccessful status | Throw `Error` with `Match report request failed with status N`, using the actual status for N |
| Successful response | Await JSON into an `unknown` value and return a validated `MatchReport` instance |

The supplied constructor accepts that unknown value: `new MatchReport(body)`.
Let network, JSON, and validation errors propagate; do not convert them into absence.
Remember that 404 is also an unsuccessful status when choosing your branch order.

Example wire response (already served by the supplied mock API):

```json
{
  "match_id": "match-northbridge",
  "opponent": "Northbridge FC",
  "result": "draw",
  "summary": "A late equaliser earned Riverside a point."
}
```

The domain maps `match_id` to `matchId`. Its other properties are `opponent`,
`result`, and `summary`. You do not implement that mapping in the client or feature.

**Start here:** replace the placeholder body with an awaited fetch using `matchId`.
Store the response, classify it, then decode only the successful response.

Documentation:

- [MDN: checking response status](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#checking_response_status)
- [MDN: reading the response body](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#reading_the_response_body)

Run from the repository root:

```bash
cd "/Users/Ruffio/Desktop/Learn to code"
npx vitest run exercises/react/05-async-api-integration/060-retrieve-match-report/src/api/get-match-report.test.ts
```

Expected at this checkpoint: **6 API tests pass**. The browser will still be idle
until the feature handler is implemented.

## 2. Feature: client outcome → screen state

Replace `void matchId;` inside `loadReport`'s existing `try` block. Keep its catch
and the supplied JSX.

| Moment / outcome | State for `setRequestState` |
|---|---|
| Before awaiting the request | `{ status: 'loading' }` |
| Client returns `null` | `{ status: 'not-found' }` |
| Client returns a model | `{ status: 'success', record: returnedModel }` |
| Client throws | Existing catch sets error; leave it supplied |

`returnedModel` describes your local variable, not a supplied name. Await
`getMatchReport` with the handler's `matchId`. Do not call fetch or decode JSON here.
Keep missing and success paths separate; setting state does not stop execution.
Store the model in the success state so the supplied panel receives it.

There are no new effects, extra state variables, or automatic requests during render.
Starting another request replaces the previous record/error with loading. The panel
already disables buttons while loading and renders each outcome.

Documentation: [React: connecting event handlers to state](https://react.dev/learn/reacting-to-input-with-state#step-5-connect-the-event-handlers-to-set-the-state).
Focus on the state updates before and after `await` in `handleSubmit`; our state is
an object instead of the example's string.

```bash
npx vitest run exercises/react/05-async-api-integration/060-retrieve-match-report/src/features/matches/retrieve-match-report-feature.test.tsx
```

Expected: **7 feature tests pass**. These isolate the handler using supplied client
outcomes. The full suite also tests your real client and feature together.

## Check the complete workflow

```bash
npx vitest run exercises/react/05-async-api-integration/060-retrieve-match-report
npx tsc --noEmit -p exercises/react/05-async-api-integration/060-retrieve-match-report/tsconfig.json
```

Starter: **9 passing, 15 failing tests**, typecheck passing. Finished: **24 tests
and typecheck pass**. The starter failures are the missing implementations, not bugs
to repair in the supplied tests or server.

Stop the previous Vite process before starting this exercise from the repo root:

```bash
npx vite exercises/react/05-async-api-integration/060-retrieve-match-report --config exercises/react/05-async-api-integration/060-retrieve-match-report/vite.config.mjs --port 5173 --strictPort
```

At [localhost:5173](http://localhost:5173/), confirm the header says **REACT-060**.
Before implementation the buttons do nothing. Once finished:

- Load Northbridge: loading, then opponent, match result, and summary.
- Load missing report: loading, then `No report exists for this match.`
- Try service outage: loading, then the deliberate 503 error.
- Load Northbridge again: clear the error and show the report. Reload and repeat.

The only library UI component is the supplied [shadcn Button](https://ui.shadcn.com/docs/components/base/button).

## Review and design reflection

Tell me which references/help you used. Explain where the 404 becomes `null`, and
where that `null` becomes the missing-report screen. Also explain why `result: 'loss'`
in a valid report is still a successful request, not a request error.

Design lesson: a football result and a request status are different facts. The
domain carries the former; the feature owns the latter. The feature need not know
how HTTP or JSON represents either one.

## Scope preflight

| Required operation | Evidence / support |
|---|---|
| GET, HTTP classification, JSON, domain construction | Retrieved with reference in 059; contract and docs retained |
| Async state transitions, model storage, separate null branch | Retrieved in 059 without prior-file reference; state/catch/JSX still supplied |
| Apply both boundaries to a match-report resource | Only changed dimension; no new protocol or branch |
| UI, domain, mocks, tests, configuration | Supplied; no new authorship |
| Run tests and browser checks | Known workflow |

First three edits: await fetch, classify the response, decode a successful body.
Likely stuck point: confusing HTTP decisions with feature-state decisions; use the
two checkpoints to locate each responsibility. No new test responsibility or reduced
code scaffolding. We will choose the next task after reviewing transfer evidence.
