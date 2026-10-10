# API-004: Return club fixtures from a Hono handler

Focus: turn an existing service result into one HTTP response. Edit only
`src/handlers/get-club-fixtures.ts`.

## Goal

The service from API-003 can select a club's fixtures, but it does not handle HTTP.
A Hono handler receives a request context and returns a `Response`. For this first
handler, the route and sample data are supplied, so you can focus on that translation:

```text
GET request → supplied test route → your handler → service → JSON response
```

The test route is not the application's eventual `app.ts`; you will practice app wiring
in a later task. This task does not start a server.

## Your task

### `src/handlers/get-club-fixtures.ts`

Complete `getClubFixtures` so it calls `listClubFixtures` with the supplied `fixtures`
and `clubId`, then returns a JSON response with this shape:

```json
{
  "fixtures": [
    { "id": "fixture-1", "homeClubId": "club-7", "awayClubId": "club-2" },
    { "id": "fixture-3", "homeClubId": "club-5", "awayClubId": "club-7" }
  ]
}
```

Return status `200` and JSON content type. Hono's `c.json(...)` produces both for a
normal successful response; it returns the response object, so return its result from
the handler. The `Context` parameter, service import, sample data import, and test-only
route are already supplied. No URL parameter, request body, persistence, or error path
is required yet.

## Scope preflight

| Required operation | Evidence and classification |
|---|---|
| Call the fixture service with its inputs | API-003 passed; the same service is supplied here. |
| Understand that a handler receives `Context` and returns `Response` | New Hono boundary; signature and unrelated `c.text` example are in the code. |
| Produce JSON with `c.json` | New Hono response operation; the relevant official docs and exact output contract are supplied. |
| Register a route and send a test request | Supplied in the colocated handler test, not learner-authored yet. |

First inspect the handler's imports and the sample values in `seed.ts`. Then replace
the placeholder with the service call and response. If the compiler says the handler
does not return a `Response`, check whether you returned the value from `c.json`.

## Verify

From `api-design/` with Node 22+:

```sh
nvm use 22
npm run typecheck
npm test -- 01-hono-foundations/004-respond-with-club-fixtures
```

The supplied test makes a request against Hono without a listener and checks status,
content type, and body. It fails on the placeholder until you implement the handler.
Ask me to review when both commands pass; no written reflection is required.

Documentation: [Hono Context and `c.json`](https://hono.dev/docs/api/context#json)
and [Hono's request-testing approach](https://hono.dev/docs/guides/testing).
