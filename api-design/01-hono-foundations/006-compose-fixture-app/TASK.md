# API-006: Compose two working handlers into one app

Focus: register existing handlers on one Hono app. Edit only `src/app.ts`.

## Contract

The two handlers already work on their own. Your app must expose both through
different GET routes:

| Request | Handler to use | Response shape |
|---|---|---|
| `GET /fixtures` | `getClubFixtures` | `{ "fixtures": [...] }` |
| `GET /fixture-overview` | `getFixtureOverview` | `{ "clubId": "club-12", "fixtureIds": [...], "total": 2 }` |

An unknown path should retain Hono's normal `404` response. These are fixed
practice routes: the handlers still use their supplied club IDs. Do not add URL
parameters or change either handler.

## Mental model

The app is a routing table. A route connects an HTTP method and path to a
handler. The handler then does the service call and builds the response:

```text
GET /fixtures → app → getClubFixtures → JSON response
GET /fixture-overview → app → getFixtureOverview → JSON response
```

Creating `new Hono()` makes the app; it does not register any routes by itself.
`app.get(path, handler)` registers one GET route. Pass the handler function to
Hono—do not call it yourself, because Hono supplies its request `Context`.
There is no network listener in this exercise; the supplied test calls the app
directly with `app.request(...)`.

## What is supplied

The two completed handlers are imported from API-004 and API-005. Their models,
services, and seed data stay where they are. The imports and app request tests
are supplied. You own app creation and the route-to-handler mapping.

## Your task

### `src/app.ts`

1. Create and export a Hono app named `app` using the supplied `Hono` import.

   Reference: [Hono App — opening example](https://hono.dev/docs/api/hono).
   Look at how `new Hono()` creates the app. This exercise needs a **named export**
   because the test imports `{ app }`; the documentation's `export default app`
   is a different export style. For a refresher, see
   [TypeScript Modules — Additional export syntax](https://www.typescriptlang.org/docs/handbook/2/modules.html#additional-export-syntax)
   and its `export const` example.

2. Register each path in the contract as a GET route using its matching handler.

   Reference: [Hono Routing — Basic](https://hono.dev/docs/api/routing#basic).
   Read the first `app.get(...)` example: the first argument is the path and the
   second is a handler function. That example writes the function inline; you
   already have imported functions, so pass the appropriate function name instead.
   Leave off `()` after that name so Hono can call it when a request arrives.

Do not recreate business logic, return a response from `app.ts`, add a server,
or register a catch-all route. Both paths must be available on the **same** app.

## Scope preflight

| Required operation | Evidence and classification |
|---|---|
| Use the completed handlers without editing them | Known from API-004 and API-005; supplied imports. |
| Create a Hono app and register routes in application code | New boundary; the test files previously demonstrated `new Hono()` and `app.get(...)`. |
| Choose which handler belongs to each path | New composition decision; response shapes in the contract distinguish them. |
| Send requests and assert responses | Supplied test; no new test-harness authorship. |

Your first edit is the exported app instance. Next add one route for each row of
the contract. If a request returns `404`, check the exact path and HTTP method;
if the JSON shape is wrong, check which handler that path selects.

## Verify

From `api-design/` with Node 22+:

```sh
nvm use 22
npm run typecheck
npm test -- 01-hono-foundations/006-compose-fixture-app
```

The test checks both route responses and that an unknown path remains `404`.
Ask me to review when both commands pass; no written reflection is required.

Optional test reference: [Hono App — request()](https://hono.dev/docs/api/hono#request).
Read the first GET example to understand how the supplied test sends a request
without starting a server.
