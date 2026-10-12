# API-013: Read the club from the request

## Problem

Let a caller choose whose fixtures to see using `GET /fixtures?clubId=club-2`.
Earlier APIs used a fixed seed input; this API must use the request's club ID.

The handler reads HTTP input, calls the supplied selection service, and builds
the response. The service still accepts an ordinary string and knows nothing
about Hono or URLs.

## Ownership

You complete `src/handlers/fixtures.ts`. The fixture model/domain, selection
service, seed, app route, server, fallback expression, and tests are supplied
inside this exercise. There are no cross-exercise imports.

## Your task

### `src/handlers/fixtures.ts`

1. Replace the `undefined` placeholder for `requestedClubId` with a lookup of
   the `clubId` query parameter.
2. Keep the supplied fallback line. Call `listClubFixtures` with the seed fixtures
   and resolved `clubId`.
3. Return a JSON object with `clubId` and the selected `fixtures`.

For `GET /fixtures?clubId=club-2`, return 200 with:

```json
{
  "clubId": "club-2",
  "fixtures": [
    { "id": "fixture-1", "homeClubId": "club-1", "awayClubId": "club-2" },
    { "id": "fixture-3", "homeClubId": "club-2", "awayClubId": "club-4" }
  ]
}
```

Use the resolved ID in both the service call and response. The service returns
`Fixture[]`; your response wraps that array in an object.

### Reading a query

In `/fixtures?clubId=club-2`:

- `/fixtures` is the route.
- `clubId` is the query key you read.
- `club-2` is the string value sent by the caller.

Hono's `c.req.query('key')` reads a query value. With a named key, its result is
a string when present or `undefined` when absent. The unrelated `format` example
in your handler shows the syntax. Start by adapting its key.

The supplied `requestedClubId ?? defaultClubId` chooses the default only if the
lookup is missing. You do not need to implement that fallback yourself.

Reference: [HonoRequest — query()](https://hono.dev/docs/api/request#query).
For the response: [Context — json()](https://hono.dev/docs/api/context#json).
Optional explanation of the supplied line:
[nullish coalescing](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing).

### Contract

| Request input | Behavior |
|---|---|
| A club ID | Return that ID and its home/away fixtures |
| No `clubId` parameter | Use `club-1` |
| An ID with no matching fixtures | Return that ID and `fixtures: []`, with 200 |

Assume supplied IDs are nonempty strings and the parameter appears once.
No trimming, numeric parsing, validation errors, or map operation is required.
The route is registered as `/fixtures`; query values are read inside the handler.

## Verify

From `api-design`, use Node 22+. If needed:

```sh
source "$HOME/.nvm/nvm.sh"
nvm use 22
```

```sh
npm run typecheck
npx vitest run 01-hono-foundations/013-read-club-query
npx tsx 01-hono-foundations/013-read-club-query/src/server.ts
```

There are nine tests. The starter typechecks: five supplied checks pass and four
handler behavior tests fail until you finish it.

Use GET in Hoppscotch:

| Complete URL | Expected |
|---|---|
| `http://localhost:3013/fixtures?clubId=club-2` | 200; club-2, fixtures 1 and 3 |
| `http://localhost:3013/fixtures?clubId=club-3` | 200; club-3, fixture 2 |
| `http://localhost:3013/fixtures` | 200; club-1, fixtures 1 and 2 |
| `http://localhost:3013/fixtures?clubId=club-99` | 200; club-99, empty fixtures |
| `http://localhost:3013/missing` | 404 |

Stop the server with Ctrl+C afterward.

## Scope preflight

| Required operation | Capability/evidence |
|---|---|
| Read a named query parameter | New; mental model, docs, and unrelated syntax example supplied |
| Missing-value fallback | Supplied and explained; no learner implementation |
| Pass inputs to service | Demonstrated in API-011/012 |
| Build/return response object | Retrieved with scaffold in API-011/012; adjacent JSON retained |
| Select fixtures, domain construction, routes | Supplied; guided callback work is not required |
| Tests/startup/live calls | Supplied infrastructure; execution demonstrated |

The main difficulty change is request input. First edits: replace the lookup
placeholder, call the service with the resolved ID, build the response.
Likely stuck point: using the default ID everywhere instead of the resolved
request input; trace `requestedClubId → clubId → service → response`.
