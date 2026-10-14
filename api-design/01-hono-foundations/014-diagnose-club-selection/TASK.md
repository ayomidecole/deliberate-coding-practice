# API-014: Diagnose the wrong club's fixtures

## Problem

This API starts and returns 200, but choosing another club returns the wrong
fixtures. Find and repair the cause.

It is a self-contained copy of API-013 with one deliberate defect, on port 3014.
Your goal is to trace request input through the handler/service boundary.
The existing service's selection rule and domain validation are correct.

## Ownership

You diagnose and repair `src/handlers/fixtures.ts`.
All implementation, tests, data, and startup are supplied. Keep the contract and
tests unchanged; make the smallest repair that restores the requested behavior.
No written explanation or new tests are required.

## Your task

### `src/handlers/fixtures.ts`

Run the app tests first. Use their expected/received output to identify which
response values are wrong. Then follow:

`request query → resolved club ID → service argument → selected fixtures → response`

For a request for club-3, ask what value each part of that chain should carry.
Reading the assignments or adding temporary logs are both valid ways to trace it.
Remove any temporary logs after your repair.

Do not rewrite the working selection service or introduce another endpoint.
There is one defect to repair; route registration, query syntax, and the seed data
are supplied.

Reference: [HonoRequest — query()](https://hono.dev/docs/api/request#query) and
[Context — json()](https://hono.dev/docs/api/context#json).

## Contract

`GET /fixtures?clubId=club-3` must return 200 with:

```json
{
  "clubId": "club-3",
  "fixtures": [
    { "id": "fixture-2", "homeClubId": "club-3", "awayClubId": "club-1" }
  ]
}
```

Other requested IDs must select their own home/away fixtures.
No `clubId` means club-1. An unmatched ID produces its requested ID and an empty
fixtures array with 200. Unknown paths return 404.

Assume IDs are nonempty strings and the query parameter appears once.
No new validation or response fields are required.

## Verify

From `api-design`, use Node 22+. If needed:

```sh
source "$HOME/.nvm/nvm.sh"
nvm use 22
```

Start with the failing request checks:

```sh
npx vitest run 01-hono-foundations/014-diagnose-club-selection/src/app.test.ts
```

The starter typechecks; six of nine tests pass and three request checks fail.
Those failures share one cause. Once repaired:

```sh
npm run typecheck
npx vitest run 01-hono-foundations/014-diagnose-club-selection
npx tsx 01-hono-foundations/014-diagnose-club-selection/src/server.ts
```

Use GET in Hoppscotch:

| Complete URL | Expected |
|---|---|
| `http://localhost:3014/fixtures?clubId=club-3` | 200; club-3 and fixture-2 |
| `http://localhost:3014/fixtures?clubId=club-2` | 200; club-2 and fixtures 1 and 3 |
| `http://localhost:3014/fixtures` | 200; club-1 and fixtures 1 and 2 |
| `http://localhost:3014/fixtures?clubId=club-99` | 200; club-99 and empty fixtures |
| `http://localhost:3014/missing` | 404 |

All nine tests should pass after the repair. Stop the server with Ctrl+C.

## Scope preflight

| Operation | Evidence/support |
|---|---|
| Read a named query and resolve fallback | Implemented with supplied fallback in API-013 |
| Pass a string to a selection service | Demonstrated in API-011–013 |
| Return an object containing selected values | Correct in API-011–013 |
| Read expected/received test values | Known from earlier checks; command supplied |
| Trace one incorrect value across a call | Target diagnostic practice; value chain supplied |
| Harness, domain, selection, routing, startup | Supplied |

No new framework operation. The difficulty change is diagnosis of one defect,
with independently visible request failures and a tracing guide.
First actions: run the app tests, compare the response with the contract, inspect
the value passed along the handler's data flow. Likely stuck point: treating 200
or a correct echoed ID as proof that the fixtures are also correct.
