# API-005: Return a fixture overview

Focus: turn a service result into a different JSON response. Edit only
`src/handlers/get-fixture-overview.ts`.

## Contract

The supplied test requests `GET /clubs/club-12/fixture-overview`. The handler must
return `200 OK`, JSON content type, and this body for the sample data:

```json
{
  "clubId": "club-12",
  "fixtureIds": ["fixture-21", "fixture-23"],
  "total": 2
}
```

The IDs must come from matching fixtures in their original order. The count must come
from the number of matches, not a hard-coded `2`.

## Mental model

This handler does not search the original fixture list. The service does that and
returns an array of `Fixture` objects. The handler then shapes those objects into
the response the client requested:

```text
listClubFixtures(fixtures, clubId) → Fixture[]
Fixture[] → map each Fixture to its id → string[] of fixture IDs
Fixture[] → .length → number of matches
{ clubId, fixtureIds, total } → c.json(...) → HTTP Response
```

`map` belongs **after** the service call, on the array returned by the service. It
does not go on `c`, the request, or the response. `c.json(...)` is the last step: it
accepts the complete body object and returns the `Response` promised by the handler's
return type. Merely returning `c.json` returns a function, not a response.

## What is supplied

The model, domain, service, imports, seed data, test-only route, and request test are
supplied. You do not edit them or start a server in this exercise.

## Your task

### `src/handlers/get-fixture-overview.ts`

Complete the handler in this order:

1. Call `listClubFixtures` with the supplied `fixtures` and `clubId` to get matching
   `Fixture` objects.
2. Use `map` on that returned array to make a new array containing only their IDs.
   Count the same returned array with `.length`.
3. Return a `c.json(...)` response whose argument is **one object** with these fields:

| Response field | Value to use |
|---|---|
| `clubId` | The imported `clubId` string |
| `fixtureIds` | The ID array from step 2 |
| `total` | The count from step 2 |

Do not return the raw array, return a plain object without `c.json`, or call `c.json`
before building the body object. Do not change the service or construct new fixtures.

## Scope preflight

| Required operation | Evidence and classification |
|---|---|
| Call `listClubFixtures` and use `c.json` | Guided in API-004; retrieve both in this changed handler. |
| Project fixture IDs with `map` and count with `.length` | Previously seen in TypeScript/React, but scaffolded above because recall was not secure. |
| Build an object whose values come from variables | Guided in API-004; this response has different fields and types. |
| Register the route and write request tests | Supplied; no new harness responsibility. |

Start from the supplied signature and work down the three steps above. If the compiler
says the handler returns a function rather than `Response`, check that you *called*
`c.json` with the body object and returned its result.

## Verify

From `api-design/` with Node 22+:

```sh
nvm use 22
npm run typecheck
npm test -- 01-hono-foundations/005-return-fixture-overview
```

The supplied test checks the HTTP status, content type, and exact JSON body. It fails
on the placeholder. Ask me to review when both commands pass; no written reflection
is required.

References for the precise operations here:

- [MDN `Array.map()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) — step 2: one ID from each matching fixture.
- [MDN object property definitions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer#property_definitions) — step 3: give each response field its value.
- [Hono Context: `json()`](https://hono.dev/docs/api/context#json) — step 3: search the page for the `json()` heading; the argument becomes the response body.
