# API-003: List a club's fixtures

Focus: write one service operation using a domain value you already built. Edit only
`src/services/list-club-fixtures.ts`.

## Goal

A club's fixtures include matches where it is either the home club or the away club.
The service answers that question without knowing about HTTP, Hono, or a database.
The supplied model and domain files are copies of your completed API-002 work.

## Your task

### `src/services/list-club-fixtures.ts`

Complete `listClubFixtures`. Given fixtures and a club ID, return a new array containing
only fixtures whose `homeClubId` or `awayClubId` equals that ID. Preserve their input order.
Return an empty array if none match. Do not modify the input or construct new `Fixture`
objects. Assume the club ID is a nonempty string and every fixture is valid.

You can use a loop or `filter`; choose the one that makes the rule clearest to you. The
function signature and import are supplied. Do not add Hono, request types, or another
layer to this task.

## Scope preflight

| Required operation | Evidence and classification |
|---|---|
| Read a `Fixture`'s fields | Retrieved through API-002; its completed class is supplied here. |
| Compare IDs and include home *or* away matches | Known branches and string comparisons; combining both sides is this task's decision. |
| Select values from an array without changing it | Demonstrated with `filter` in React; a loop is also fine. |
| Own a service function with inputs and a return value | New boundary, guided by the supplied signature and focused tests. |
| Write tests, handle HTTP, start a server | Not part of this step; the tests are supplied beside the service. |

Start in the service file: inspect its input and output types, decide what qualifies as a
match, then replace the placeholder with the returned list. If you get stuck, check a
fixture where the club is *away* before changing the code.

## Verify

From `api-design/`:

```sh
nvm use 22
npm run typecheck
npm test -- 01-hono-foundations/003-list-club-fixtures
```

The supplied tests cover home, away, unrelated, and no-match cases. The test fails on
the placeholder until you implement the service. Node 22+ is required; if `nvm` is not
available in your shell, select a Node 22 installation before running the commands.
Ask me to review when both commands pass; no written reflection is required.

Documentation: [TypeScript function inputs and outputs](https://www.typescriptlang.org/docs/handbook/2/functions.html)
and [JavaScript `filter`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter).
