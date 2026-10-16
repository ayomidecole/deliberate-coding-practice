# API-015: Require the club query

## Problem

The caller must now choose a club explicitly. Replace the previous default-club
behavior with a client error for a missing or empty `clubId`.

This is a self-contained copy of API-014, on port 3015.
You are adding one failure outcome to the existing successful query flow.

## Ownership

You change `src/handlers/fixtures.ts`. The selection service, model/domain, seed
data, app route, tests, and server are supplied. Keep the tests unchanged.

## Your task

### `src/handlers/fixtures.ts`

Read the `clubId` query as before. Replace the default fallback with validation.

| Input | Status | JSON body |
|---|---|---|
| No `clubId` parameter | 400 | `{ "error": "clubId is required" }` |
| `?clubId=` | 400 | Same error object |
| Nonempty club ID | 200 | Existing club ID and matching fixtures |

The error response is exactly:

```json
{
  "error": "clubId is required"
}
```

A valid request such as `?clubId=club-3` still returns:

```json
{
  "clubId": "club-3",
  "fixtures": [
    { "id": "fixture-2", "homeClubId": "club-3", "awayClubId": "club-1" }
  ]
}
```

- Missing query values are `undefined`; a present-but-empty value is `''`.
- Check those two states before calling `listClubFixtures`.
- Return the error response from the handler so execution stops on that path.
- On the success path, pass the supplied query value to the service and response.
- Remove the unused `defaultClubId` import once the fallback is gone.

Start by deciding where the invalid-input branch belongs relative to the service
call. Add that branch, then remove the fallback and use the validated input.
You can retain local variables if they make the flow easier to follow.

Assume nonempty IDs are already in the expected format. Do not trim, parse numbers,
check club existence, or catch exceptions. An ID with no fixtures remains a valid
request returning 200 and an empty array.

### JSON with a status

Hono's `c.json(body, status)` creates a JSON response with an explicit HTTP status.
The unrelated 201 example in your handler shows the syntax; this task's error
uses 400, which signals that the request lacks required input.

Calling `c.json` creates a response. Returning it from your function is what
stops execution before the success path. A guard that returns for invalid input
also lets TypeScript establish that the remaining query value is a string.

References:
[Context — json()](https://hono.dev/docs/api/context#json) for the second argument,
and [HonoRequest — query()](https://hono.dev/docs/api/request#query) for reading input.

## Verify

From `api-design`, use Node 22+. If needed:

```sh
source "$HOME/.nvm/nvm.sh"
nvm use 22
```

```sh
npm run typecheck
npx vitest run 01-hono-foundations/015-require-club-query
npx tsx 01-hono-foundations/015-require-club-query/src/server.ts
```

There are ten tests. The starter typechecks: eight tests pass and the two new
invalid-input tests fail. All ten should pass after your change.

Use GET in Hoppscotch:

| Complete URL | Expected |
|---|---|
| `http://localhost:3015/fixtures` | 400; required-ID error |
| `http://localhost:3015/fixtures?clubId=` | 400; same error |
| `http://localhost:3015/fixtures?clubId=club-3` | 200; club-3 and fixture-2 |
| `http://localhost:3015/fixtures?clubId=club-2` | 200; club-2 and fixtures 1 and 3 |
| `http://localhost:3015/fixtures?clubId=club-99` | 200; club-99 and empty fixtures |
| `http://localhost:3015/missing` | 404 |

Stop the server with Ctrl+C afterward.

## Scope preflight

| Operation | Capability/evidence |
|---|---|
| Named query lookup | Implemented in API-013, retrieved through API-014 diagnosis |
| Input comparison and conditional return | Known from domain validation and prior branch work; guard purpose explained |
| JSON response with explicit status | New Hono operation; unrelated syntax example and official docs supplied |
| Pass validated input to service | Demonstrated in API-013/014 |
| Success response object | Demonstrated in API-011–014; retained |
| Model/domain/service/routing/tests/startup | Supplied |

The main difficulty change is one failure outcome, covering absent and empty
input. Test ownership and guidance remain stable. First edits: add the invalid
input branch, return its error response, replace the fallback with validated
input. Likely stuck point: creating the error response without returning it;
trace whether the service call is reachable on an invalid request.
