# REACT-055 — Serve a matchday squad with MSW

## Goal

Add the first HTTP endpoint to the Riverside Athletic frontend. A supplied React feature
already requests a matchday squad and displays the result in the browser. Your job is to
author the MSW request handler that behaves like the server until the real Go API exists.

This starts **Arc 05: Async API Integration**. The new capability is the mock HTTP boundary,
not React loading-state implementation. The worker startup, request client, React feature,
domain decoding, and tests are supplied.

## Scope preflight

| Required operation | Evidence | Classification |
|---|---|---|
| Read a fixture ID from a function input | Repeated TypeScript and React work | Known |
| Find one record in a readonly array | Retrieved across the UI composition arc | Demonstrated |
| Branch on whether `find` returned `undefined` | Repeated feature logic | Demonstrated |
| Return different outcomes from a branch | Repeated TypeScript, domain, and feature work | Demonstrated |
| Declare an MSW `GET` handler and return HTTP responses | First use | **New and guided** |
| Run supplied tests and inspect browser behavior | Repeated across prior arcs | Demonstrated |

Only one operation is new. You are not responsible for service-worker registration,
`fetch`, async React state, domain decoding, or test-server setup in this exercise.

## The system you are building

Riverside Athletic's matchday screen needs squad data for a fixture. The production app
will eventually receive that data from the Go API. For now, MSW intercepts the same browser
request and returns a realistic response from local seed data.

```text
React feature
    │ fetch("/api/matchday-squads/:fixtureId")
    ▼
MSW service worker
    ▼
your GET handler ──finds by fixture_id──> supplied seed data
    │
    ├── known fixture  ──> 200 JSON
    └── unknown fixture ─> 404
    ▼
API client → domain decoder → React feature → browser UI
```

MSW is not the future backend. It is a development and testing boundary that lets the
frontend make real `fetch` calls before a live server is available.

## MSW handler mental model

An MSW HTTP handler has two jobs:

1. The **predicate** identifies a request: method plus URL pattern.
2. The **resolver** receives request information and returns an HTTP response.

The predicate and resolver are already scaffolded in the target file:

```ts
http.get<{ fixtureId: string }>(
  '*/api/matchday-squads/:fixtureId',
  ({ params }) => {
    // Your resolver body goes here.
  },
)
```

- `:fixtureId` names a dynamic URL segment.
- `params.fixtureId` is the actual value from that segment.
- `HttpResponse.json(value)` creates a successful JSON response.
- `new HttpResponse(null, { status: 404 })` creates a response with no body and a 404
  status.

The leading `*` allows the same handler to match the browser's origin and the supplied
Node test server. You do not need to modify the URL pattern.

Official documentation:

- [MSW quick start](https://mswjs.io/docs/quick-start)
- [Intercepting requests](https://mswjs.io/docs/http/intercepting-requests)
- [Mocking responses](https://mswjs.io/docs/http/mocking-responses)

## Your ownership

Edit only:

```text
src/testing/mocks/handlers/matchday-squad-handlers.ts
```

Do not edit the worker, server, API client, React feature, domain, seed data, or supplied
tests. You may read them to trace the complete request and data path.

## Five-minute start

Open the target file and work inside the supplied resolver. Your first meaningful edit is
to replace the two `void` lines and the temporary `501` response with a `find` operation
that compares:

```text
candidate.fixture_id  ↔  params.fixtureId
```

The temporary `501 Not Implemented` response is why the browser and tests fail initially.

## Requirements

Implement these two observable paths in the supplied resolver:

| Request state | Handler response |
|---|---|
| A record in `MATCHDAY_SQUADS` has the requested `fixture_id` | Return that record with `HttpResponse.json(...)` |
| `find` returns `undefined` | Return `new HttpResponse(null, { status: 404 })` |

Keep the response in the wire format already stored in `MATCHDAY_SQUADS`. The domain
decoder later translates those snake_case fields for the React side of the application.

## Suggested implementation order

1. Read `params.fixtureId` and use it in `MATCHDAY_SQUADS.find(...)`.
2. Add the not-found branch and return the 404 response from that branch.
3. After the branch, return the found record as JSON.

Likely stuck point: remember that the resolver itself acts as the server for this request.
It must **return** an `HttpResponse`; finding a record alone does not send anything back.

## Verification

Run the supplied focused tests:

```bash
npx vitest run exercises/react/05-async-api-integration/055-serve-matchday-squad-with-msw/src/testing/mocks/handlers/matchday-squad-handlers.test.ts
```

Then type-check and build the React exercise:

```bash
npx tsc --noEmit -p exercises/react/05-async-api-integration/055-serve-matchday-squad-with-msw/tsconfig.json
npx vite build exercises/react/05-async-api-integration/055-serve-matchday-squad-with-msw --config exercises/react/05-async-api-integration/055-serve-matchday-squad-with-msw/vite.config.mjs
```

To see the handler work in the browser:

```bash
npx vite exercises/react/05-async-api-integration/055-serve-matchday-squad-with-msw --config exercises/react/05-async-api-integration/055-serve-matchday-squad-with-msw/vite.config.mjs
```

At `http://127.0.0.1:5173/`:

- **Load Riverside squad** should show `200 OK`, the fixture, and `4 players decoded`.
- **Request missing squad** should show `No matchday squad exists for that fixture.`

## Completion criteria

- The known fixture returns the exact supplied wire record as JSON.
- An unknown fixture returns HTTP 404.
- The focused tests, exercise type-check, and Vite build pass.
- You can explain where the request is intercepted and why the domain decoder still runs
  after MSW returns the response.

Do not write additional tests for this exercise. The harness is supplied because both MSW
and its Node test server are new infrastructure.
