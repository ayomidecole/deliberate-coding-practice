# REACT-057 — Diagnose player availability failures

## Goal

Riverside's medical desk has a misleading screen: **a service outage is reported as a
missing player record**. The coaching staff need to distinguish “no record exists” from
“we could not check.”

Find and repair that behavior in the API client. This is a short diagnosis task inside
the same runnable React application, not another API implementation from scratch.
Your 056 solution is complete and remains untouched.

## Your ownership

Edit only **`src/api/get-player-availability.ts`**. It contains one intentional
response-classification defect. The small size of the eventual patch is expected:
the learning target is explaining which decision produced the wrong result.

The HTTP endpoint, types, domain model, feature, UI, styling, imports, and tests are
supplied. Do not change them to make the tests pass. There is no new server or
React request-state implementation to write.

## Start here: reproduce, trace, repair

1. Run the exercise tests below. Two API tests should fail; read one failure.
2. In the browser, compare **Check missing record** with **Try service outage**.
   Both currently show the missing-record message. That second result is the defect.
3. Open your API file and trace the outage response through it before editing:
   - The endpoint returns HTTP 503. What is `response.ok`?
   - Which branch executes, and what value leaves the function?
   - Does that value match the contract below?
4. Repair the response decision so each outcome retains its meaning. Keep the
   successful JSON-to-domain path intact, then rerun the tests.

Your first edit belongs in the client's response handling after `await fetch(...)`.
You do not need to understand or rewrite the supplied feature's state implementation.

Try the trace before consulting 056's finished solution. Documentation and references
remain allowed; tell me what helped when we review.

## Contract to preserve

`GET /api/player-availability/:playerId` is consumed by
`getPlayerAvailability(playerId): Promise<PlayerAvailability | null>`.

| HTTP outcome | Client outcome |
|---|---|
| 404 with an empty body | Return `null`; do not read JSON |
| Any other unsuccessful status | Throw an `Error` with `Availability request failed with status <status>`; do not read JSON |
| Success with valid JSON | Return the validated `PlayerAvailability` instance |

For 503, the exact error message is `Availability request failed with status 503`.
Do not special-case just the two failure statuses in the tests.

Network, JSON-parsing, and domain-validation errors must still reach the caller.
No extra `catch`, fallback value, or type assertion is needed.

## How the result reaches the screen

The existing feature calls your client and already knows how to handle its contract:

- A model means display the player's availability.
- `null` means display the missing-record message.
- A rejected request means display the error.

The feature does not inspect HTTP status itself. Trace the value your client gives it;
do not patch the displayed wording to disguise an incorrect client result.

## Documentation

- [Fetch: checking response status](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#checking_response_status)
  — why an HTTP failure can still produce a resolved `Response`.
- [Response.ok reference](https://developer.mozilla.org/en-US/docs/Web/API/Response/ok)
  — which statuses make this boolean true.
- [Fetch: reading the response body](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#reading_the_response_body)
  — reference for the supplied successful path.
- [shadcn Button](https://ui.shadcn.com/docs/components/base/button)
  — the only library UI component used; supplied, not an editing target.

## Run and verify

Run these from the repository root:

```bash
npx vitest run exercises/react/05-async-api-integration/057-diagnose-player-availability-failures
npx tsc --noEmit -p exercises/react/05-async-api-integration/057-diagnose-player-availability-failures/tsconfig.json
```

**Starter:** 15 tests pass and the two HTTP-failure client tests fail. Typechecking passes:
a value can satisfy TypeScript while being the wrong business outcome.
**Finished:** all 17 tests and the typecheck pass.

The feature tests use a supplied client fake; the API tests exercise your actual client.
The Vite tests check the real local HTTP endpoints. Passing feature tests alone does
not prove that your client's response mapping is correct.

To run the browser app, stop any previous exercise's Vite process, then:

```bash
npx vite exercises/react/05-async-api-integration/057-diagnose-player-availability-failures --config exercises/react/05-async-api-integration/057-diagnose-player-availability-failures/vite.config.mjs --port 5173 --strictPort
```

Open [the local app](http://localhost:5173/). Confirm the header says **REACT-057**.

| Button | Expected result after your repair |
|---|---|
| Check Leon | Leon Okafor, Review required, and his medical note |
| Check missing record | No availability record exists for this player. |
| Try service outage | Availability request failed with status 503 |

Reload and repeat the checks. Vite serves the supplied mock endpoints over HTTP;
you do not need to configure a browser service worker.

## Review checkpoint

When done, tell me:

- Which decision caused the outage to look like a missing record?
- Why would changing the React component's text be the wrong repair?
- Which references or assistance did you use?

Design connection: a boundary must preserve the difference between **known absence**
and **failed retrieval**, so the UI can make an honest claim about the data.

## Scope preflight

| Required operation | Evidence and responsibility |
|---|---|
| Await the request and read successful JSON | Demonstrated in 056 with reported help; supplied unchanged |
| Construct the domain model from `unknown` | Demonstrated in 055–056 and prior domain work; supplied unchanged |
| Distinguish status-specific absence from failure | Retrieved in 056; apply the same contract in diagnosis mode |
| Trace a branch, its returned value, and the caller's outcome | Known function/branch concepts; independent API diagnosis not yet evidenced, so one defect and a trace guide |
| Repair the client without changing its contract | Known return/throw operations; learner-owned |
| Run tests and check browser behavior | Demonstrated; infrastructure and tests supplied |

Only the task mode changes. No additional response shape, endpoint, UI primitive,
request-state ownership, or test authorship is introduced.
