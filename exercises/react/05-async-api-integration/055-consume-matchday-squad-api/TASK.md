# REACT-055 — Consume a matchday squad API

## Goal

Implement the API client that retrieves Riverside Athletic's matchday squad and translates
the HTTP response into a result the React feature can use.

This begins **Arc 05: Async API Integration** at the production frontend boundary. You are
not implementing an API server. MSW supplies a realistic endpoint locally; the client you
write would use the same request and response flow against a real backend.

## Read before editing

Start with these two short sections of the MDN Fetch guide:

1. [Checking response status](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#checking_response_status)
   — why a 404 still gives you a `Response`, and how `status` and `ok` differ.
   This guides your first two branches.
2. [Reading the response body](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#reading_the_response_body)
   — why `response.json()` needs `await`. This guides the successful path.

Keep [the `Response.ok` reference](https://developer.mozilla.org/en-US/docs/Web/API/Response/ok)
open if you want the exact meaning of `ok`. If `await` itself is rusty, read
[MDN's `await` introduction](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await).
For the reason parsed JSON is held as `unknown`, see
[TypeScript's `unknown` explanation](https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown).

You do not need to study MSW's handler API for this task. The mock server is supplied;
your work starts when `fetch` receives its response.

## Scope preflight

| Required operation | Capability evidence | Classification |
|---|---|---|
| Receive a fixture ID through a typed function parameter | Repeated TypeScript and React work | Known |
| Await an existing promise | The `fetch` line is supplied; the body-reading step is guided by the Fetch docs | Guided |
| Branch on status values and return different results | Repeated domain and feature work | Demonstrated |
| Construct `MatchdaySquad` from `unknown` wire data | REACT-033–044 and REACT-054 | Demonstrated |
| Interpret a browser `fetch` response | First owned API-client boundary | **New and guided** |
| Run supplied tests and inspect browser behavior | Repeated across prior arcs | Demonstrated |

Only the API-client protocol is new. MSW handlers, worker registration, seed data, React
request state, presentation, and all tests are supplied.

## The system you are building

The supplied feature already knows when the user asks for a squad and how to render idle,
loading, success, not-found, and failure states. It calls the API function you will finish:

```text
React feature
    │ calls getMatchdaySquad(fixtureId)
    ▼
API client — your code
    │ fetch("/api/matchday-squads/:fixtureId")
    ▼
supplied MSW endpoint
    │ returns an HTTP Response
    ▼
API client — inspect status → read JSON → construct domain model
    ▼
React feature → supplied component → browser
```

MSW only replaces the remote server during development and tests. The API client remains
frontend production code; when the real API exists, this request can cross the network
without moving server implementation into React.

## The `fetch` mental model

The supplied first line starts the request and waits for an HTTP `Response`:

```ts
const response = await fetch(`/api/matchday-squads/${fixtureId}`);
```

Receiving a response is not the same as receiving a successful response:

- `fetch` normally resolves for HTTP statuses such as 404 and 503.
- `response.status` contains the numeric HTTP status.
- `response.ok` is `true` for successful 200–299 responses.
- `await response.json()` reads and parses the response body.
- JSON arrives at an untrusted boundary, so store it as `unknown` and let
  `MatchdaySquad` validate and translate it.

Read the status before reading JSON. The supplied 404 response has no JSON body.

## Your ownership

Edit only:

```text
src/api/get-matchday-squad.ts
```

The function signature, result union, request URL, imports, mock endpoint, feature, and
tests are supplied. You may read those files to trace the flow, but do not modify them.

## Five-minute start

Open the target file. Keep the supplied `fetch` call and replace the temporary `void` and
`throw` statements.

Your first edit is the special 404 branch:

```text
response.status is 404
    → return { status: 'not-found' }
```

This branch must run before any attempt to read the response body.

## Requirements

Implement the following response policy in `getMatchdaySquad`:

| Response condition | Client behavior |
|---|---|
| `response.status === 404` | Return `{ status: 'not-found' }` |
| Any other response where `response.ok` is `false` | Throw `Error("Squad request failed with status <status>")` |
| Successful response | Read JSON into an `unknown` value, construct `MatchdaySquad`, and return `{ status: 'found', squad }` |

Do not catch errors inside this API function. Network errors, unexpected HTTP failures,
invalid JSON, and domain-validation failures should reject the promise. The supplied
feature owns translating those failures into UI state.

## Suggested implementation order

1. Add and return from the 404 branch.
2. Add the branch for every other response where `ok` is false.
3. For the remaining successful path, await `response.json()` into an `unknown` variable.
4. Construct the domain object and return the `found` result.

Likely stuck point: `fetch` does not automatically throw because the server returned an
unsuccessful HTTP status. Your API client owns that interpretation policy.

## Verification

Run the supplied API-client tests:

```bash
npx vitest run exercises/react/05-async-api-integration/055-consume-matchday-squad-api/src/api/get-matchday-squad.test.ts
```

Then confirm the supplied mock endpoint still passes its own tests:

```bash
npx vitest run exercises/react/05-async-api-integration/055-consume-matchday-squad-api/src/mocks/handlers/matchday-squad-handlers.test.ts
```

Type-check and build the exercise:

```bash
npx tsc --noEmit -p exercises/react/05-async-api-integration/055-consume-matchday-squad-api/tsconfig.json
npx vite build exercises/react/05-async-api-integration/055-consume-matchday-squad-api --config exercises/react/05-async-api-integration/055-consume-matchday-squad-api/vite.config.mjs
```

To see the client drive the supplied React feature:

```bash
npx vite exercises/react/05-async-api-integration/055-consume-matchday-squad-api --config exercises/react/05-async-api-integration/055-consume-matchday-squad-api/vite.config.mjs
```

At `http://127.0.0.1:5173/`:

- **Load Riverside squad** should show `200 OK`, the fixture, and `4 players decoded`.
- **Request missing squad** should show `No matchday squad exists for that fixture.`

## Completion criteria

- The client maps 404 to the explicit `not-found` result.
- It throws the required error for other unsuccessful statuses.
- It converts successful JSON from `unknown` into a validated `MatchdaySquad`.
- Both focused test files, the exercise type-check, and the Vite build pass.
- The browser demonstrates both the successful and not-found paths.

Do not write tests in this exercise. The first API-consumer test harness is supplied so
test authorship does not compete with learning the new boundary.
