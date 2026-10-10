# REACT-061 — Retrieve a scouting report

## Goal and ownership

Riverside's recruitment team wants to read Amara Okafor's scouting report. A missing
report should say so; an unavailable service should show an error, not claim the
player has no report.

**You write only `src/api/get-scouting-report.ts`.** Replace its placeholder function
body. Imports, signature, domain, types, feature, UI, mock server, and tests are supplied.
This is API consumption inside a working React project, not backend implementation.
You do not write state objects or feature handlers in this exercise.

## Before writing: identify the values

There are three different values on the successful path:

`HTTP Response → parsed JSON body → ScoutingReport`

The response carries status information and a method for reading its body. The body
is the external data; the supplied domain constructor validates it. An `unknown`
annotation describes that body's type, not its variable name.

Quick foundation checkpoint, aloud or in chat: which value has `.ok`? Which value
belongs in the domain constructor? For an empty 404 response, should body decoding
run? If those distinctions are unclear, ask before implementing; this is not a quiz
you must struggle through alone.

## The client contract

`getScoutingReport(reportId)` requests **GET `/api/scouting-reports/:reportId`**.
Use the argument in the URL, not a fixed Amara ID.

| Response | Required outcome |
|---|---|
| 404 with an empty body | Return `null`; do not read JSON |
| Any other unsuccessful HTTP response | Throw an `Error`: `Scouting report request failed with status N`, substituting the actual status |
| Successful response | Await the JSON body, store it as `unknown`, and return a `ScoutingReport` constructed from it |

Let network, JSON-parsing, and domain-validation errors reach the caller. Do not catch
them and return `null`. The supplied feature already catches failures for display.
Choose branch order and exits so the response reaches only its intended outcome.

The supplied API serves this example:

```json
{
  "report_id": "report-amara",
  "playerName": "Amara Okafor",
  "recommendation": "watch",
  "summary": "Quick decision-making and accurate passing under pressure."
}
```

The supplied `ScoutingReport` constructor maps `report_id` to `reportId` and validates
the fields. You do not repeat those checks in the client.

**First edit:** remove the placeholder statements and obtain the HTTP response with
an awaited fetch using `reportId`. Then implement the outcome table. Decide where
body reading belongs rather than copying an entire previous client.

## Documentation

- [MDN: checking response status](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#checking_response_status) — status versus successful responses.
- [MDN: reading the response body](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#reading_the_response_body) — the separate asynchronous JSON-reading step.
- [shadcn Button](https://ui.shadcn.com/docs/components/base/button) — supplied UI only; no component work required.

References are welcome. At review, tell me what you consulted; memorizing punctuation
is not the goal. No new tests, effects, hooks, libraries, or error abstractions.

## Verify

Run from `/Users/Ruffio/Desktop/Learn to code`:

```bash
npx vitest run exercises/react/05-async-api-integration/061-retrieve-scouting-report/src/api
npx vitest run exercises/react/05-async-api-integration/061-retrieve-scouting-report
npx tsc --noEmit -p exercises/react/05-async-api-integration/061-retrieve-scouting-report/tsconfig.json
```

The starter deliberately throws `Scouting report client not implemented`. Tests that
call the real client fail until you implement it; supplied feature-unit/domain/server
tests should pass. Do not change fixtures or tests to remove failures.

Verified starter: **15 passing, 10 failing tests**, with typecheck passing. Completion:
**7 API tests / 25 total tests passing**, plus typecheck and the browser checks below.

For the browser, stop the previous Vite server and run:

```bash
npx vite exercises/react/05-async-api-integration/061-retrieve-scouting-report --config exercises/react/05-async-api-integration/061-retrieve-scouting-report/vite.config.mjs --port 5173 --strictPort
```

Check the header says **REACT-061** at [localhost:5173](http://localhost:5173/).
The starter buttons show the placeholder error. After your implementation:

1. Load Amara: loading, then the player's name, recommendation, and summary.
2. Load missing report: `No report exists for this player.`, with no error alert.
3. Try service outage: the deliberate HTTP 503 error.
4. Load Amara again: the error clears and the report returns. Reload and repeat.

## Review checkpoint

Trace the empty-404 path through your function. Explain what prevents it from
reaching JSON decoding. Then explain why passing the HTTP response directly into
`ScoutingReport` would be the wrong input even when the response is successful.

Design lesson: the client translates transport outcomes into model, absence, or
failure; the feature can render those outcomes without knowing how JSON is decoded.

## Scope preflight

| Required operation | Capability evidence / support |
|---|---|
| Build a URL from an argument; await fetch | Demonstrated in 060 |
| Classify HTTP status; choose branch exits | Known, guided in 060; contract retained, retrieval target |
| Await JSON; distinguish response from body | Known, A3-guided in 060; mental model and docs retained |
| Pass unknown body into supplied constructor; propagate failures | Known, guided in 060; no domain authorship |
| Run focused checks and exercise browser | Demonstrated workflow |
| Feature, UI, types/domain, mock server, tests | Supplied; no new responsibility |

No new operations. First three edits: fetch response, classify outcomes, decode the
successful body. Likely stuck point: reading the body before knowing whether it is
present. Same response branches as 060, one implementation file instead of two, no
test-harness work or scaffold reduction. The next task depends on this review.
