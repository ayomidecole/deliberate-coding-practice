# REACT-063 — Diagnose scouting-report decoding

## The problem

Riverside's scouting screen receives a successful response for Luis Costa's report,
but displays `report_id must be a string`. The supplied wire data contains a valid
string ID. The recruitment team should see the report instead of that error.

There is **one intentional defect in `src/api/get-scouting-report.ts`**. Diagnose and
repair it. The feature, domain, fixtures, UI, server, and tests are supplied and correct.
You own the client repair and the explanation of its cause. Test authorship is supplied.

## Start with evidence

From `/Users/Ruffio/Desktop/Learn to code`, run the successful-response test:

```bash
npx vitest run exercises/react/05-async-api-integration/063-diagnose-scouting-report-decoding/src/api/get-scouting-report.test.ts -t "returns the validated model directly"
```

Then read the client and the supplied constructor in `src/domain/scouting-report.ts`.
Before editing, trace the successful request using these questions:

| Value | What to identify |
|---|---|
| Result of awaited fetch | What kind of value is it? What information does it carry? |
| Result of awaited JSON reading | What does this value contain? |
| Argument actually passed into the constructor | Does it contain the wire properties the constructor reads? |

The compiler accepts the constructor call because its input is `unknown`. Runtime
validation still checks the actual value. A validation error is evidence about the
input the validator received; locate that input before changing a validation rule.

Your first edit should follow that trace: repair the client at the boundary where
the wrong value is used. Preserve the existing HTTP behavior and domain validation.
Do not copy a whole previous client over this file; explain the specific repair.

## Contract to preserve

GET `/api/scouting-reports/:reportId` uses the supplied argument.

| Response | Client outcome |
|---|---|
| 404 with an empty body | `null`, without JSON decoding |
| Other unsuccessful HTTP status | Throw `Scouting report request failed with status N` |
| Successful JSON | Return a validated `ScoutingReport` instance |
| Network, parsing, or validation error | Let the error reach the feature's catch |

The supplied successful body is:

```json
{
  "report_id": "report-luis",
  "playerName": "Luis Costa",
  "recommendation": "watch",
  "summary": "Strong positioning and composed passing from defence."
}
```

## Documentation

- [MDN: response status](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#checking_response_status)
- [MDN: reading the response body](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#reading_the_response_body)
- [shadcn Button](https://ui.shadcn.com/docs/components/base/button) — supplied UI.

Use documentation freely. At review, tell me what helped and explain the values in
your own words. If the trace is unclear, bring your current explanation and we can
work through it before you edit.

## Verify the repair

```bash
npx vitest run exercises/react/05-async-api-integration/063-diagnose-scouting-report-decoding/src/api
npx vitest run exercises/react/05-async-api-integration/063-diagnose-scouting-report-decoding
npx tsc --noEmit -p exercises/react/05-async-api-integration/063-diagnose-scouting-report-decoding/tsconfig.json
```

Expected finished result: **7 API tests and 25 total tests pass**, with typecheck
passing. The starter typechecks despite its runtime defect. Several tests can fail
from this one defect; the number of failures does not indicate separate bugs.

Verified starter: **21 passing, 4 failing tests**.

The browser server is configured for this exercise. To restart it, stop the prior
Vite process and run:

```bash
npx vite exercises/react/05-async-api-integration/063-diagnose-scouting-report-decoding --config exercises/react/05-async-api-integration/063-diagnose-scouting-report-decoding/vite.config.mjs --port 5173 --strictPort
```

At [localhost:5173](http://localhost:5173/), check the header says **REACT-063**.
After the repair: load Luis, load a missing report, try the service outage, then load
Luis again. Verify success, absence, failure, and recovery. Reload and repeat success.

## Review checkpoint

Explain why the error mentioned `report_id` even though the API's JSON contains it.
Show the successful value flow from HTTP to domain to feature to displayed player.
Predict what the same function does with a 404 and with invalid successful JSON.

Design lesson: a boundary can receive the wrong kind of value even when the network
request succeeds. Validate external data and trace what actually crosses the boundary.

## Scope preflight

| Required operation | Evidence / support |
|---|---|
| Run focused tests, read failure, verify browser | Demonstrated workflow |
| Distinguish Response, parsed body, domain instance | Guided in 062; retrieval target with tracing questions |
| Diagnose one wrong value at a boundary | Known debugging mode; one defect, supplied tests |
| Preserve HTTP branches and feature state flow | Demonstrated with guidance/reference; existing code supplied |
| Infrastructure, UI, domain, fixtures, test authorship | Supplied |

New operations: none. First three actions: reproduce success failure, trace the
values, repair the boundary. Likely stuck point: treating a validation error as proof
that the fixture is wrong. The trace keeps the diagnosis focused. This repair is a
small edit; explaining and predicting its behavior supplies the learning evidence.
