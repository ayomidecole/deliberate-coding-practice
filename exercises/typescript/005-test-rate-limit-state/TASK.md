# TS-005: Test a Rate-Limit State

Status: active

Target time: 15–25 minutes

Primary capability: behavioral test design

## Goal

Write a complete behavioral test suite for a supplied, correct rate-limit calculation.

The implementation and Vitest boundary are supplied. This exercise changes only test
ownership so you can retrieve test design without also learning a new implementation
operation.

## Mental model

A useful test suite partitions the contract into meaningfully different states. More test
inputs are not automatically better; each case should be able to expose a distinct mistake.

For this function, reason about three states:

1. No requests have been used.
2. Some—but not all—requests have been used.
3. The limit has been used exactly.

The near-boundary state with one request remaining is especially useful: it distinguishes
"almost blocked" from "blocked."

Rate limiting is a reliability boundary. Correct state lets an upstream API decide whether
to accept work before downstream capacity is exceeded.

## Supplied contract

`getRateLimitState(limit, used)` receives positive integer values where:

- `limit` is the maximum allowed request count
- `used` is between `0` and `limit`, inclusive

It returns:

- `remainingRequests`: `limit - used`
- `blocked`: `true` only when `remainingRequests` is exactly `0`

Input validation is outside this exercise.

## Your task

Edit only `rate-limit-state.test.ts`.

The imports and `describe` block are supplied. Write at least three meaningful `it` tests
covering the three contract states above.

For each test:

- choose concrete input values
- call `getRateLimitState`
- assert the complete returned object
- use a description that states observable behavior

## Scope

- Do not edit `rate-limit-state.ts`.
- Do not test private implementation details.
- Do not add mocks, fixtures, hooks, parameterized tests, dependencies, or validation cases.
- Do not duplicate a behavioral partition with several arbitrary values.
- Do not skip tests or leave todo tests.

## Start and verify

Run the focused suite before editing:

```sh
npx vitest run exercises/typescript/005-test-rate-limit-state
```

After writing the tests, run:

```sh
npx vitest run exercises/typescript/005-test-rate-limit-state
npx vitest run exercises/typescript
npm run typecheck
```

## Documentation

- [Vitest: `test` / `it`](https://vitest.dev/api/test)
- [Vitest: `expect`](https://vitest.dev/api/expect.html)

## Done when

- At least three learner-authored tests cover all three contract states.
- Each test asserts the complete returned object.
- Test names describe behavior.
- The supplied implementation is unchanged.
- Focused tests, all TypeScript exercise tests, and type-checking pass.

Request review and disclose any documentation, hints, prior exercise reference, or outside
AI help.
