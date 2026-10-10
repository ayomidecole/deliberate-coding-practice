# REACT-056 — Retrieve player availability through an API

## Goal

Riverside's coaching staff need to check a player's matchday availability. The screen must
distinguish an existing medical record, a missing record, and a service failure.

Implement the API client that translates those HTTP outcomes for the supplied React feature.
This is **retrieval within Arc 05**, not a new async topic. We are reinforcing REACT-055
after your break before adding ownership of React request state.

## Your file

Implement `getPlayerAvailability` in **`src/api/get-player-availability.ts`**.

Imports, signature, and the request line are supplied. Replace the `void response` and
placeholder `throw` with your response handling. All other files and all tests are supplied.
Do not implement a server, edit the mock responses, or change the feature to accommodate an
incorrect return value.

## Reorient, then start

Before editing, take two minutes with your completed REACT-055 function. Identify:

- the value produced by `await fetch(...)`,
- the value produced by `await response.json()`, and
- the value produced by the domain constructor.

These are three different things: the HTTP response, parsed wire data, and a validated
application object. `unknown` is the type annotation for unvalidated data, not a variable name.

Then open the target file. The first edit is to handle the response that means **no record
exists**, before attempting to read its body. The response policy below tells you what to return.

References are allowed. Try making the decisions yourself first; tell me which references
or help you used at review. Syntax recall is not the mastery target.

## Documentation

Read or revisit only the sections you need:

1. [Fetch: checking response status](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#checking_response_status)
   — `fetch` can resolve even when the HTTP status indicates failure.
2. [Fetch: reading the response body](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#reading_the_response_body)
   — reading JSON is another asynchronous operation.
3. [Response.ok](https://developer.mozilla.org/en-US/docs/Web/API/Response/ok)
   — the meaning of a successful HTTP status.
4. [TypeScript: unknown](https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown)
   — why parsed data still needs validation.

The supplied UI uses [shadcn Button](https://ui.shadcn.com/docs/components/base/button).
You do not need to study its API or change the UI for this task.

## Response contract

The supplied request is `GET /api/player-availability/:playerId`.
The function's return type is **`Promise<PlayerAvailability | null>`**.

| Response | What the client must do |
|---|---|
| 404, with an empty body | Return `null`, without calling `response.json()` |
| Any other unsuccessful status | Throw `Error` with message `Availability request failed with status <status>` |
| Success with JSON | Read the body as `unknown`, construct `PlayerAvailability`, and return that instance directly |

For example, status 503 must produce `Availability request failed with status 503`.
It must not produce `null`: a service outage does not prove that the player's record is missing.

Unlike 055, this caller expects the model itself or `null`, **not** a
`{ status: 'found', ... }` wrapper. This is a small change in the consumer contract, not a
rule that one return style is always better. Adapt your returns to the supplied signature.

Do not catch errors in this function. Network failures, invalid JSON, and domain-validation
errors should reach the supplied feature. You do not need extra branches for those failures.

A successful wire response looks like this:

```json
{
  "player_id": "player-leon-okafor",
  "display_name": "Leon Okafor",
  "availability": "review_required",
  "medical_note": "Awaiting the final mobility assessment before matchday selection."
}
```

The supplied domain constructor validates it and translates fields such as `display_name`
to `displayName`. Do not manually rebuild that mapping in your client or cast the JSON to
the domain class.

## Where your code fits

```text
Button → feature calls getPlayerAvailability(playerId)
                       ↓
                your API client
                       ↓ fetch
              supplied HTTP endpoint
                       ↓ Response
          status → JSON → domain constructor
                       ↓ PlayerAvailability | null, or rejection
                supplied feature → UI
```

Vite serves the supplied MSW handlers over HTTP. No browser service worker is needed.
The mocks are development infrastructure, not backend code you must author. Types, domain,
components, feature state, styling, and tests remain connected but are not new targets here.

## Verify

From the repository root, run:

```bash
npx vitest run exercises/react/05-async-api-integration/056-retrieve-player-availability-api
npx tsc --noEmit -p exercises/react/05-async-api-integration/056-retrieve-player-availability-api/tsconfig.json
```

Before implementation, **five API-client tests fail** with the placeholder error. Domain,
feature, and Vite endpoint checks already pass. The network-error test also already passes
because the supplied `fetch` naturally rejects. At completion, all **17 tests** should pass.

For the browser, stop the previous exercise's Vite process if it is still running, then run:

```bash
npx vite exercises/react/05-async-api-integration/056-retrieve-player-availability-api --config exercises/react/05-async-api-integration/056-retrieve-player-availability-api/vite.config.mjs --port 5173 --strictPort
```

Open `http://localhost:5173/`. Until your function is implemented, the buttons show
`Player availability client not implemented`; that message is expected starter behavior.
After implementation:

| Button | Expected result |
|---|---|
| Check Leon | Leon Okafor, Review required, and his medical note |
| Check missing record | No availability record exists for this player. |
| Try service outage | Availability request failed with status 503 |

Reload and try again. You should not need to configure MSW, change browser tabs, or rewrite
the feature to make requests work.

## Completion and review

- The client honors all three outcomes and the direct-model-or-null contract.
- All exercise tests and the typecheck pass; the three browser paths behave as listed.
- Briefly explain why 404 returns `null` but 503 rejects, and what the domain constructor adds.
- Tell me what assistance you used. We will decide the next scope from that evidence.

Design lesson to carry forward: the API client translates transport outcomes into the
application's contract; the feature owns deciding what the user sees.

## Scope preflight

| Required operation | Evidence | Scope |
|---|---|---|
| Receive a string ID and make the request | Known functions; request line supplied | Known, supplied |
| Interpret status and choose return/throw | Guided in 055; branches are established TS practice | Demonstrated with guidance; retrieval target |
| Await JSON into `unknown` | Guided in 055 | Demonstrated with guidance; retrieval target |
| Construct the supplied domain class | Prior domain work; used with guidance in 055 | Demonstrated; reused |
| Return an instance or `null` | Known classes, unions, and null | Known; changed consumer contract |
| Run checks and inspect browser output | Repeated prior exercises | Demonstrated; harness supplied |

No new protocol, request-state ownership, or test authorship. The first three edits are
the missing-record branch, the other-failure branch, and successful decoding. Likely stuck
point: returning 055's wrapper instead of the value this function promises.
