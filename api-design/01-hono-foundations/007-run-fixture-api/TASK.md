# API-007: Wire and run the fixture API

Focus: connect a handler to an app, then connect that app to a real local server.
You write `src/app.ts`, then run and check the API using the supplied server launcher.

## Contract

Start the API on port **3007**. A GET request to
`http://localhost:3007/fixture-overview` must return status `200` and this JSON:

```json
{
  "clubId": "club-12",
  "fixtureIds": ["fixture-21", "fixture-23"],
  "total": 2
}
```

An unknown path returns `404`. The club is still fixed by the seed data.

## What is supplied

Your completed model, domain, service, handler, and seed data from API-005 are copied
into this exercise. All implementation imports stay inside this exercise.
The app imports, complete `src/server.ts` launcher, and colocated app tests are supplied.
Shared dependencies and commands remain in `api-design/`.

## Mental model

`app.ts` defines which requests reach which handlers. `server.ts` starts a process
listening on a port and passes incoming requests to that app.

```text
Hoppscotch → localhost:3007 → server → app route → handler → service → response
```

Previously, `app.request(...)` let the test call the app directly. That still tests
routing and JSON, but it does not prove that a server is listening.
The Node adapter's `serve(...)` supplies that connection. Its `fetch` option takes
`app.fetch`, Hono's request-processing function. Pass it without `()`, just as
you pass a handler to a route without calling it yourself.

## Your task

### 1. `src/app.ts` — wire the endpoint

Create and export a Hono instance named `app`. Register `GET /fixture-overview`
using the imported `getFixtureOverview` handler.

Reference: [Hono App — opening example](https://hono.dev/docs/api/hono) for
`new Hono()`, and [Routing — Basic](https://hono.dev/docs/api/routing#basic) for
`app.get(path, handler)`. Use a named export, as in API-006, because the test and
server import `{ app }`; the Hono opening example uses a default export instead.

Run the typecheck and app tests below before moving on.

### 2. `src/server.ts` — supplied launcher

The launcher already connects `app.fetch` to port `3007`. You do not need to edit
it. Your responsibility is to run it and verify that requests reach your app.

Reference: [Hono on Node.js — Change port number](https://hono.dev/docs/getting-started/nodejs#change-port-number).
Optional reading: that short example explains the supplied options. The adapter and `tsx` runner
are already installed; skip the page's project-generation and installation steps.

### 3. Run it and make a real request

From `api-design/`, start your server:

```sh
nvm use 22
npx tsx 01-hono-foundations/007-run-fixture-api/src/server.ts
```

Leave that terminal running. In Hoppscotch, send **GET**
`http://localhost:3007/fixture-overview` with no body or authentication. Check the
status and JSON against the contract. Also request `http://localhost:3007/missing`
and check for `404`.

The server prints `API listening at http://localhost:3007` once it is listening
and keeps the terminal occupied. Stop it with **Ctrl+C** when finished. If the terminal immediately returns
to its prompt, check that `server.ts` actually calls `serve`.

If Hoppscotch's browser client cannot reach localhost, use its desktop client or
run this in a second terminal:

```sh
curl -i http://localhost:3007/fixture-overview
curl -i http://localhost:3007/missing
```

If you see `EADDRINUSE`, stop the earlier server you started on port 3007 and retry.
A connection failure means no server was reached; a `404` means a server answered
but that method/path did not match a route.

## Verify

From `api-design/` with Node 22+:

```sh
npm run typecheck
npm test -- 01-hono-foundations/007-run-fixture-api
```

Completion requires both app tests and the live requests above. App tests alone
do not check `server.ts`. Ask for review when they work; no written reflection is
required.

## Scope preflight

| Required operation | Evidence / support |
|---|---|
| Use the completed model, domain, service, and response | Supplied copies of your previous work; no new feature logic. |
| Create/export an app and register its handler | Guided in API-006; signature, export reminder, and routing reference above. |
| Run a listener and call it over HTTP | New boundary; complete launcher, run command, and requests supplied. |
| Check the JSON and status | Previously practiced; exact expected values and automated tests supplied. |

First actions: create/export the app, register its route, then run the supplied
launcher. Likely sticking point: distinguishing a connection failure from a route
failure, explained above. The increased difficulty is live HTTP verification;
feature logic, test authorship, and request parsing stay fixed.
