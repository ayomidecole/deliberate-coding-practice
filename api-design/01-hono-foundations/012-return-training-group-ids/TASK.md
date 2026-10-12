# API-012: Return training-group IDs

## Problem

A club's selection screen needs the IDs of groups that can fit its party.
Change this exercise's list response to expose those IDs. Keep the summary
endpoint working.

This is an independent copy of API-011 on port 3012. Earlier exercises remain
unchanged. We are changing a practice contract deliberately; changing a published
API would also require planning for its consumers.

The target is following value shapes through a transformation:
group objects → matching group objects → matching ID strings → JSON response.

## Ownership

You write the ID service and complete the list handler. Your model/domain,
selection/count services, summary handler, routes, tests, and launcher are retained
or supplied. No manual test authorship is required.

## Your task

### 1. `src/services/list-group-ids-for-party.ts`

Implement `listGroupIdsForParty(groups, partySize)`, returning `string[]`.

- Use `listGroupsForParty` to select suitable groups; reuse its capacity rule.
- Return only the ID of each selected group, preserving their order.
- No matches and empty input both produce `[]`.
- Leave the input objects and array unchanged.
- Assume party size is a positive integer.

Start by calling the imported selection service with your function's inputs.
Its return value is `TrainingGroup[]`. Your function must turn that into
`string[]` and return it.

`map` creates an output element from each input element. The callback returns
what that element should become. A numeric syntax example is in the service file;
choose the appropriate field for this problem. If your callback uses braces,
it needs an explicit `return`.

Reference: [MDN map — Try it and Return value](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map#try_it).

Run the service checkpoint below.

### 2. `src/handlers/training-groups.ts`

Complete `getTrainingGroups` using your ID service, the seed groups, and party size.
For the supplied seed, `GET /training-groups` returns 200 and exactly:

```json
{
  "partySize": 3,
  "groupIds": ["group-1", "group-3"]
}
```

Derive the values from the imported party size and service result.
The service returns an array of strings. The response is an object containing
that array and party size. Build that object and return it through `c.json`.

Keep `getTrainingGroupSummary` working. Its response remains:

```json
{
  "partySize": 3,
  "matchingGroupCount": 2
}
```

Reference: [Hono Context — json()](https://hono.dev/docs/api/context#json).

## Verify

From `api-design`, use Node 22+. If needed:

```sh
source "$HOME/.nvm/nvm.sh"
nvm use 22
```

Service checkpoint — three tests:

```sh
npx vitest run 01-hono-foundations/012-return-training-group-ids/src/services/list-group-ids-for-party.test.ts
```

Final checks — fifteen tests:

```sh
npm run typecheck
npx vitest run 01-hono-foundations/012-return-training-group-ids
npx tsx 01-hono-foundations/012-return-training-group-ids/src/server.ts
```

In Hoppscotch, use GET:

- `http://localhost:3012/training-groups`: 200 and the ID response above.
- `http://localhost:3012/training-group-summary`: 200 and the summary above.
- `http://localhost:3012/missing`: 404.

Stop the server with Ctrl+C afterward.

The starter typechecks. Eleven retained tests pass; four tests fail until the
ID service and list handler are complete.

## Scope preflight

| Required operation | Evidence/support |
|---|---|
| Service inputs, calls, and function return | Demonstrated in API-011; explicit value shapes here |
| Select suitable groups | Existing service supplied |
| Map objects into strings | Previously guided in API-005; syntax refresher supplied |
| Construct/return JSON object | Retrieved with scaffold in API-011; adjacent contract retained |
| Routing, domain construction, summary count | Retained; no new responsibility |
| Tests, startup, live calls | Harness/launcher supplied; running demonstrated |

No new framework operation. The main difficulty change is the array element type.
First edits: call the selection service, map its selected groups into ID strings,
return the new array. Likely stuck point: returning whole groups or forgetting a
callback return; compare the required `string[]` with your actual returned value.
