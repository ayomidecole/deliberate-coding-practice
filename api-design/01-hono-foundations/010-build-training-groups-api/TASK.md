# API-010: Build the training-groups API

## Problem

A club needs to see which training groups can fit a party of three players.
Finish a self-contained API that returns those groups. A group with no capacity
is invalid; a valid group can still be too small for this particular party.

The model describes the fields, the domain protects valid groups, the supplied
service selects suitable groups, and your handler builds the HTTP response.

## Ownership

You write the model, domain, and handler. The selection service, app wiring,
seed data, launcher, and tests are supplied this time. Read the assertions and
run the checks; you do not need to write tests by hand.

## Your task

### 1. `src/models/training-group.ts`

Complete `TrainingGroupRecord`: readonly `id: string` and `capacity: number`.
The ID field is supplied as a syntax example. Start by adding capacity.

Reference: [readonly properties](https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties).

### 2. `src/domain/training-group.ts`

Complete `TrainingGroup` with readonly ID and capacity fields.
Its constructor takes a `TrainingGroupRecord`.

- Reject capacity of zero or less with `new Error('capacity must be positive')`.
- Otherwise preserve the supplied ID and capacity.
- Remove the placeholder throw once implemented.
- Assume IDs are nonempty and capacities are finite integers. No extra validation.

The ID declaration/assignment is a worked example in the code.
`record.capacity` is the input; `this.capacity` is the value stored on the new
instance. The class field declaration and constructor assignment are separate.

Reference: [constructors](https://www.typescriptlang.org/docs/handbook/2/classes.html#constructors).

Run the domain-only check below before starting the handler.

### 3. `src/handlers/get-training-groups.ts`

Complete `getTrainingGroups`. Call the supplied `listGroupsForParty` service
with the imported groups and party size. Use its result for the response's
`groups` field, not the unfiltered seed array.

Return one JSON object with these fields:

| Field | Value |
|---|---|
| `partySize` | Imported party size |
| `groups` | Array returned by the service |

The service returns an array. The HTTP response is an object containing that
array and the party size. Construct that object, then return `c.json(body)`.
Do not add query parameters, error mapping, or another service.

Reference: [Hono JSON responses](https://hono.dev/docs/api/context#json).

## Check and run

From the `api-design` directory, use Node 22+. If needed in Bash:

```sh
source "$HOME/.nvm/nvm.sh"
nvm use 22
```

Domain checkpoint (four tests):

```sh
npx vitest run 01-hono-foundations/010-build-training-groups-api/src/domain
```

Final checks (eight tests):

```sh
npm run typecheck
npx vitest run 01-hono-foundations/010-build-training-groups-api
npx tsx 01-hono-foundations/010-build-training-groups-api/src/server.ts
```

The initial scaffold deliberately fails: capacity is missing and constructors/
handlers contain placeholders. The full app tests cannot load until the domain
is implemented, so start with the domain checkpoint.

In Hoppscotch, GET `http://localhost:3010/training-groups` must return 200:

```json
{
  "partySize": 3,
  "groups": [
    { "id": "group-1", "capacity": 4 },
    { "id": "group-3", "capacity": 3 }
  ]
}
```

An unknown path returns 404. Stop your server with Ctrl+C when finished.

## Scope check

| Operation | Evidence / support |
|---|---|
| Record fields and readonly class construction | Retrieved with reference in API-002; ID example retained |
| Constructor validation | Demonstrated in API-001/002; one changed numeric rule |
| Service inputs/results and response object | Guided in API-008; field mapping and JSON return reminder supplied |
| Running checks and live requests | Demonstrated in API-007/008; commands supplied |
| Selection, routing, listener, test harness | Supplied; not new learner responsibilities |

No new framework operation. First edits: add the model capacity field, declare
the class capacity field, implement the constructor rule/assignment. Likely
stuck point: confusing the service array with the response object; use the field
table. The main challenge is retrieving domain construction within a working API.
