# API-017: Read a JSON request body

## Problem

Use the familiar coach lookup with input from a JSON body:

`POST http://localhost:3017/coach-lookups`

```json
{
  "coachId": "coach-2"
}
```

This first POST exercise isolates request-body reading from stored writes.
It looks up existing seed data; it does not create or save a coach. A simple
production lookup would ordinarily use GET; this practice route keeps the
business behavior familiar while you learn a different input boundary.

## Ownership

You complete `src/handlers/coaches.ts`: read/await JSON and implement the
lookup's response paths. The async signature, parse-error handling, runtime
validation, model/domain, lookup service, route, tests, and launcher are supplied.

## Your task

### `src/handlers/coaches.ts`

**Checkpoint 1 — read the body.** Replace the `undefined` assigned to
`requestBody` inside the supplied `try` block.

Use `c.req.json()` to read JSON, and `await` its result before assigning it.
Do not replace the supplied validation or add a query lookup.

Mental model:

- `c.req.query('coachId')` reads a string from the URL immediately.
- `c.req.json()` returns a Promise for the parsed body.
- `await` gives this handler the parsed value before the next statement runs.
- The supplied `async` function returns `Promise<Response>`; Hono waits for it.

For example, `const value = await readValue()` stores the resolved value,
rather than the Promise. Here the reader is Hono's request JSON method and the
assignment target is the already-declared `requestBody`.

The supplied `unknown` annotation means the parsed data is not trusted yet.
The supplied guard checks its shape and leaves `coachId` available afterward.
You are not responsible for writing that guard or its `in`/type-check syntax.
The supplied `catch` handles invalid or absent JSON bodies.

Run the body checkpoint command below before moving on. Its two parse-error
tests must pass after this edit.

References:
[HonoRequest — json()](https://hono.dev/docs/api/request#json) and
[MDN await — Description](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await#description).

**Checkpoint 2 — finish the lookup.** After the supplied `coachId` declaration,
call `findCoachById(coaches, coachId)`.

- No coach: return 404 with `{ "error": "coach not found" }`.
- Found coach: return 200 with this shape:

```json
{
  "coach": {
    "id": "coach-2",
    "name": "Sam"
  }
}
```

Use the found object's values. The lookup service is still synchronous: only
the body-reading operation needs `await` in this handler.
Remove the placeholder throw when the response paths are implemented.

Status reminder: `c.json(body, status)`. Return each response from its branch.

Reference: [Hono Context — json()](https://hono.dev/docs/api/context#json).

### Supplied contracts

| Input | Response |
|---|---|
| Body with a known nonempty string ID | 200 and coach wrapper |
| Body with an unmatched ID | 404; coach-not-found JSON |
| Missing/empty/non-string coachId, or a non-object body | 400; coachId-required JSON |
| Malformed or absent JSON | 400; invalid-JSON error |

The body-shape and parse-error response code is supplied. Extra fields are
ignored. No persistence, new business validation, or test authorship is required.

## Verify

From `api-design`, use Node 22+. If needed:

```sh
source "$HOME/.nvm/nvm.sh"
nvm use 22
```

Body-reading checkpoint — two tests:

```sh
npx vitest run 01-hono-foundations/017-read-coach-json/src/app.test.ts -t "supplied.*error"
```

Final checks — fifteen tests:

```sh
npm run typecheck
npx vitest run 01-hono-foundations/017-read-coach-json
npx tsx 01-hono-foundations/017-read-coach-json/src/server.ts
```

The starter typechecks; ten tests pass and five fail. The JSON-reading edit
makes the two parse-error checks pass; successful lookups remain incomplete
until checkpoint 2.

## Hoppscotch

Select **POST**, URL `http://localhost:3017/coach-lookups`, then Body → JSON
(`application/json`). Send the following bodies to that same URL:

| Copy-ready JSON body | Expected |
|---|---|
| `{"coachId":"coach-2"}` | 200; Sam in coach wrapper |
| `{"coachId":"coach-1"}` | 200; Ada in coach wrapper |
| `{"coachId":"coach-99"}` | 404; `{"error":"coach not found"}` |
| `{}` | 400; `{"error":"coachId is required"}` |
| `{"coachId":""}` | 400; same required-ID error |
| `{` | 400; `{"error":"invalid JSON"}` |

GET to `http://localhost:3017/coach-lookups` returns 404 because this app
registers POST only. Stop the server with Ctrl+C afterward.

## Scope preflight

| Operation | Evidence/support |
|---|---|
| Read and await JSON | New request-body boundary; mental model, docs, focused checkpoint |
| Async signature/Promise return | Supplied and explained; earlier async work remains guided |
| Parse failures/runtime shape validation | Supplied; no learner implementation |
| Lookup inputs/results | Practised in API-016; signature unchanged |
| Found/not-found response mapping | Guided in API-016; explicit contract/status reminders retained |
| POST route, tests, server | Supplied; method/body client setup explained |

The main difficulty change is the asynchronous body boundary. Do not add service,
domain, or test authorship here. First edits: assign the awaited body, run the
parse-error checkpoint, then call the lookup with validated `coachId`.
Likely stuck point: storing a Promise rather than the body value; inspect the
assignment before changing the supplied guard.
