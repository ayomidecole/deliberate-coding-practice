# API-008: Build the home-fixtures API

A club needs a list of matches it hosts. Build the service, handler, and app
together, then run the API. This retrieves familiar operations in a complete feature.

## Contract

`GET http://localhost:3008/home-fixtures` returns `200` and:

```json
{
  "clubId": "club-18",
  "fixtures": [
    { "id": "fixture-42", "homeClubId": "club-18", "awayClubId": "club-5" },
    { "id": "fixture-44", "homeClubId": "club-18", "awayClubId": "club-2" }
  ]
}
```

Only **home** matches qualify. Playing away is not sufficient. Keep their input
order. The response contains complete fixture records, not an array of IDs.
An unknown route returns `404`.

## Supplied / yours

Supplied: local copies of the model/domain, seed data, imports/signatures, tests,
and the server launcher on port **3008**. Everything belongs to this exercise;
do not import implementation from an earlier exercise.

Yours: the three files below, running checks, and calling the live API.
Use earlier work and documentation as references.

## Your task

### 1. `src/services/list-home-fixtures.ts`

Implement `listHomeFixtures(fixtures, clubId)`. Return a new array containing only
fixtures whose `homeClubId` matches the supplied club ID. Preserve order and the
original fixture objects. Leave the inputs unchanged. Return `[]` if none qualify.
Inputs are already valid.

A loop or `filter` is fine. With `filter`, the callback decides whether to keep
each fixture, and the service returns the resulting array.

Reference: [MDN filter — Try it and Return value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter).

First checkpoint, from `api-design/`:

```sh
npm test -- 01-hono-foundations/008-build-home-fixtures-api/src/services
```

### 2. `src/handlers/get-home-fixtures.ts`

Call your service with the imported seed `fixtures` and `clubId`. Return a
`c.json(...)` response using this mapping:

| Response field | Value |
|---|---|
| `clubId` | Imported club ID |
| `fixtures` | Array returned by your service |

The service owns selection. The handler owns the response object. Calling
`c.json(body)` creates a `Response`; return that response from the handler.
No `map`, count, request parsing, or separate error response is needed.

Reference: [Hono Context — json()](https://hono.dev/docs/api/context#json).
Read the object example. Use the service result in your response field.

### 3. `src/app.ts`

Create a named export `app` using `new Hono()`. Connect `GET /home-fixtures` to
the imported `getHomeFixtures` function.

References: [Hono App — opening example](https://hono.dev/docs/api/hono) and
[Routing — Basic](https://hono.dev/docs/api/routing#basic).
Pass the handler function without calling it. Use a named export because the
test and supplied server import `{ app }`.

## Verify and run

From `api-design/`, select Node 22. If Bash cannot find `nvm`, load it first:

```sh
source "$HOME/.nvm/nvm.sh"
nvm use 22
npm run typecheck
npm test -- 01-hono-foundations/008-build-home-fixtures-api
npx tsx 01-hono-foundations/008-build-home-fixtures-api/src/server.ts
```

Typecheck reports the missing `app` export until step 3 is written; the service
checkpoint can run before then.

When the terminal prints the listening message, send **GET**
`http://localhost:3008/home-fixtures` in Hoppscotch, with no body/authentication.
Check status and the full JSON contract above. Request `/missing` for `404`.
Ctrl+C stops the server. A terminal alternative is:

```sh
curl -i http://localhost:3008/home-fixtures
curl -i http://localhost:3008/missing
```

## Scope preflight

| Required operation | Evidence / support |
|---|---|
| Read fixture fields and select matching records | API-002/003; unchanged model/domain supplied, home-only rule explicit. |
| Return an array from the service | Guided in API-003; signature and filter reminder supplied. |
| Call the service and construct a JSON response | Guided in API-004/005; imports, signature, field mapping, and return reminder supplied. |
| Export app and register the handler | Demonstrated in API-007; retrieve with route/export reminders. |
| Run and call a local API | Demonstrated in API-007; launcher/commands supplied. |
| Write test infrastructure | Supplied; no increase in test ownership this time. |

First three edits: implement the home-match selection, return it from the service,
then call that service inside the handler. Likely sticking point: confusing the
seed array with the selected array; the response must use the service result.
The increased difficulty is combining three files. There are no new framework
operations, and the simpler response removes API-005's projection/count work.
