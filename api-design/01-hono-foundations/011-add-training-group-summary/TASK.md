# API-011: Add a training-group summary

## Problem

The club's screen already lists suitable training groups. It also needs a small
summary: how many groups can fit the party? Add a second endpoint without changing
the existing list response.

This is a self-contained copy of your API-010 work, running on port 3011.
The learning target is extending a working API while preserving its existing contract.

## Ownership

You implement the count service, summary handler, and route registration.
Your completed model/domain/list feature is retained. Tests, imports, seed data,
and server launcher are supplied. No manual test writing is required.

## Your task

### 1. `src/services/count-groups-for-party.ts`

Implement `countGroupsForParty(groups, partySize)`, returning a number.

- Count groups whose capacity can fit the whole party, including exact capacity.
- Reuse the imported `listGroupsForParty`; do not duplicate its selection rule.
- Return zero when no groups match, including an empty input.
- Count groups, not the sum of their capacities. Do not modify the input.
- Assume party size is a positive integer; no new validation is needed.

Start here: call the imported service with this function's two inputs.
Its result is an array; an array's `.length` is its item count.
You used this distinction in the fixture-overview work.

Reference: [Array length — Description](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/length#description).

Run the service checkpoint below before moving on.

### 2. `src/handlers/training-groups.ts`

Complete `getTrainingGroupSummary` beside the existing `getTrainingGroups` handler.
Both handlers belong to the training-groups resource; keep the list handler working.

Call your count service using the imported seed groups and party size. Return
HTTP 200 with this exact JSON shape for the supplied seed:

```json
{
  "partySize": 3,
  "matchingGroupCount": 2
}
```

The values come from the imported party size and your service result.
Do not hard-code the example values. The service returns a number; the handler
returns an object containing that number and the party size. No groups array
belongs in this response.

Build the response object and return it through `c.json`. You choose local
variable names; the public JSON field names above are the contract.

Reference: [Hono Context — json()](https://hono.dev/docs/api/context#json).

### 3. `src/app.ts`

Register `GET /training-group-summary` with the imported summary handler.
Keep `GET /training-groups` and its behavior unchanged. Use the existing app;
do not create another server or app.

A route registration receives the handler function, not the result of calling it.

Reference: [Hono routing — Basic](https://hono.dev/docs/api/routing#basic).

## Verify

From `api-design`, use Node 22+. If needed:

```sh
source "$HOME/.nvm/nvm.sh"
nvm use 22
```

Service checkpoint — three new tests:

```sh
npx vitest run 01-hono-foundations/011-add-training-group-summary/src/services/count-groups-for-party.test.ts
```

Final checks — twelve tests, including the existing endpoint:

```sh
npm run typecheck
npx vitest run 01-hono-foundations/011-add-training-group-summary
npx tsx 01-hono-foundations/011-add-training-group-summary/src/server.ts
```

In Hoppscotch on `http://localhost:3011`:

- `GET /training-group-summary`: 200 and the object above.
- `GET /training-groups`: 200, party size 3, and groups 1 and 3, unchanged.
- `GET /missing`: 404.

The starter typechecks. Eight existing tests should pass; four new tests should
fail until you implement the service and register the completed handler.
Stop the server with Ctrl+C when finished.

## Scope preflight

| Required operation | Evidence / support |
|---|---|
| Call a service and use its return value | Demonstrated in API-010 |
| Count an array | Practised in API-005; length reminder supplied |
| Construct and return a response object | Guided in API-010; adjacent JSON contract |
| Register a GET handler | Completed with guidance in API-006/008; existing app/import supplied |
| Run tests/server and live requests | Demonstrated in API-007–010; commands supplied |
| Test harness, startup, model/domain construction | Retained/supplied, not new work |

No new framework operation. The increased dimension is extending to two endpoints
while preserving the first. First edits: call the selection service, return its
count, then call the count service from the handler. Likely stuck point: confusing
the numeric service result with the response object; compare their stated shapes.
