# API-009: Diagnose missing away fixtures

The API starts and returns `200`, but its fixture list is empty even though the
club has away matches. Repair one service defect and add one regression test.

## Contract

`GET http://localhost:3009/away-fixtures` must return:

```json
{
  "clubId": "club-24",
  "fixtures": [
    { "id": "fixture-52", "homeClubId": "club-7", "awayClubId": "club-24" },
    { "id": "fixture-54", "homeClubId": "club-8", "awayClubId": "club-24" }
  ]
}
```

The service accepts any valid club ID and fixtures. Include only matches where
`awayClubId` equals that club ID, in input order. Preserve the fixture objects and
leave the input unchanged. No matches means `[]`.

## Supplied / yours

This is a self-contained, running API. Model/domain, seed data, handler, app,
launcher, and test infrastructure are supplied. There is **one implementation
defect**, in the service. The HTTP response construction is correct.

You own the service repair, one service test case, and checking the live response.
This debugging exercise is followed by further construction practice; supplied
feature code here is not evidence that you can independently write those layers.

## Your task

### 1. `src/services/list-away-fixtures.ts`

Run the exercise tests to see the failure, then inspect the service. Trace one
matching fixture through the callback: what value does the callback actually give
back to `filter`? Separately, what does the service return to its caller?

Repair that return-value behavior. Keep the fix in the service; changing the seed
or assembling matches in the handler would leave the service contract broken.

Reference: [MDN filter — callbackFn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter#parameters).
Read what the callback must return for an item to stay in the result.

### 2. `src/services/list-away-fixtures.test.ts`

Replace the `it.todo(...)` with one actual test. Choose a club ID and construct
four fixtures: two away matches, one home match, and one unrelated match.
Mix their order, call the service, and assert that its result contains exactly
your two away fixtures in their original order.

Use the supplied test above it as a syntax reference: `it('description', () => {
... })`. Inside it, create inputs, call the service, and check
`expect(actual).toEqual(expected)`. The expected value should be an explicit
array of the two fixture variables you expect to receive.

Reference: [Vitest toEqual](https://vitest.dev/api/expect.html#toequal) for comparing
arrays and objects. The existing test shows `new Fixture(...)` construction.

This test should catch the original defect: temporarily restore the original
service line, run your service test, confirm it fails, then restore your fix.

## Verify and run

From `api-design/`:

```sh
source "$HOME/.nvm/nvm.sh"
nvm use 22
npm run typecheck
npm test -- 01-hono-foundations/009-diagnose-away-fixtures
npx tsx 01-hono-foundations/009-diagnose-away-fixtures/src/server.ts
```

Initially typecheck passes, the HTTP body test fails, and your service test is
marked todo. When done, all five tests must pass with none left todo.

In Hoppscotch, send **GET** `http://localhost:3009/away-fixtures` without a body
and verify both records appear. Stop the server with Ctrl+C when finished.

## Scope preflight

| Operation | Evidence / support |
|---|---|
| Understand filter callback and service returns | Guided in API-008; retrieve in a repair task with the trace above. |
| Trace service output into response JSON | Guided in API-008; handler is supplied and correct. |
| Diagnose a failure | One defect, one known service, supplied failing HTTP test; no interacting defects. |
| Add a Vitest test case | Guided ownership increase; imports, examples, constructor syntax, and assertion pattern supplied. |
| Run app and inspect JSON | Demonstrated in API-007/008; complete local launcher supplied. |

First edits: repair the callback, replace the test todo with a test body, and
construct its fixtures. The likely sticking point is a test that asserts only
length; compare the actual fixtures so wrong selections cannot pass.
No new API boundary or framework operation is introduced.
