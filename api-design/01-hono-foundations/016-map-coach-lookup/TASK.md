# API-016: Map a coach lookup to HTTP

## Problem

A caller asks for one coach by ID. Missing request input and an unknown coach
are different outcomes: the former is 400; the latter is 404.

Build that distinction into this self-contained API, on port 3016.
The target is mapping an ordinary service result to the correct HTTP response.

## Ownership

You complete `getCoach` in `src/handlers/coaches.ts`, after the supplied input guard.
Model/domain, seed data, lookup service, routes, tests, and launcher are supplied.
Tests remain tutor-written.

## Your task

### `src/handlers/coaches.ts`

Call the imported `findCoachById` using the seed coaches and validated `coachId`.
Its return value is either one `Coach` object or `undefined`.

- If the service returns `undefined`, return 404 with this exact JSON body:

```json
{
  "error": "coach not found"
}
```

- Otherwise, return 200 with the found coach inside an object. For coach-2:

```json
{
  "coach": {
    "id": "coach-2",
    "name": "Sam"
  }
}
```

The response's `coach` field must contain the service result, not a hard-coded
record, ID string, or array. Keep the supplied missing-input guard working.

Start by calling the service and storing its return value. The service is
synchronous; no `await` is needed.

### Result shapes and returns

`Coach | undefined` describes two possible return values. The query guard
already handled a possibly missing string; now check the possibly missing object
returned by the service.

A not-found branch must return its response before the success response is built.
This also lets TypeScript know a coach exists on the remaining path.

Use `c.json(body, status)` when setting an explicit status.
The JSON `error` field supplies the message; the HTTP status classifies the
outcome. The service itself has no HTTP status codes.

Reference: [Hono Context — json()](https://hono.dev/docs/api/context#json).
Query refresher: [HonoRequest — query()](https://hono.dev/docs/api/request#query).

## Contract

| Request | Status | Body |
|---|---|---|
| No coachId, or an empty coachId | 400 | `{ "error": "coachId is required" }` — supplied guard |
| coach-1 | 200 | `{ "coach": { "id": "coach-1", "name": "Ada" } }` |
| coach-2 | 200 | `{ "coach": { "id": "coach-2", "name": "Sam" } }` |
| coach-99 | 404 | `{ "error": "coach not found" }` |

Assume IDs are nonempty strings in the expected format when supplied.
No additional validation, exceptions, new routes, or service implementation.

## Verify

From `api-design`, use Node 22+. If needed:

```sh
source "$HOME/.nvm/nvm.sh"
nvm use 22
```

```sh
npm run typecheck
npx vitest run 01-hono-foundations/016-map-coach-lookup
npx tsx 01-hono-foundations/016-map-coach-lookup/src/server.ts
```

There are ten tests. The starter typechecks; seven checks pass and three
found/not-found checks fail until the handler is completed.

Use GET in Hoppscotch:

| Complete URL | Expected |
|---|---|
| `http://localhost:3016/coach?coachId=coach-2` | 200; Sam in the coach wrapper |
| `http://localhost:3016/coach?coachId=coach-1` | 200; Ada in the coach wrapper |
| `http://localhost:3016/coach?coachId=coach-99` | 404; coach-not-found JSON |
| `http://localhost:3016/coach` | 400; coachId-required JSON |
| `http://localhost:3016/coach?coachId=` | 400; same required-input JSON |
| `http://localhost:3016/missing` | 404; unregistered route |

Stop the server with Ctrl+C afterward.

## Scope preflight

| Operation | Capability/evidence |
|---|---|
| Read query/check missing input | Demonstrated in API-013–015; supplied here |
| Call a synchronous service | Demonstrated in prior service/handler work |
| Handle a possibly missing result | New service outcome; undefined/guard mental model explicitly scaffolded |
| Return JSON with a status | Guided in API-015; syntax reminder retained |
| Construct success response object | Demonstrated in API-011–015; adjacent contract |
| Model/domain, selection, routes, harness, startup | Supplied |

No new Hono operation. The main challenge is the service's found/not-found
outcome; the existing 400 branch is supplied so you add one outcome.
First edits: call the lookup, guard its missing result with a returned response,
wrap the found coach. Likely stuck point: testing the request ID again instead
of testing what the service returned.
