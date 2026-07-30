# TS-006: Protect Worker Capacity

Status: active

Target time: 15–25 minutes

Primary capability: integrate a familiar implementation with transition-focused regression
testing

## Goal

Implement a small admission rule for a background-job system and add the test most likely
to expose an off-by-one mistake.

You have implemented numeric invariants and independently authored behavioral tests
separately. This exercise combines those responsibilities without introducing new syntax or
test infrastructure.

## Mental model

A worker pool has a maximum number of jobs it can handle concurrently. Before admitting a
new batch, the system calculates the **proposed load**:

`current jobs + incoming jobs`

The batch is accepted when the proposed load is less than or equal to the maximum capacity.
Reaching capacity exactly is allowed; exceeding it is not.

The most valuable regression inputs usually sit where behavior changes. Such a test should
distinguish the correct comparison from a plausible off-by-one comparison, rather than
merely repeat another comfortably under-capacity example.

This function represents an admission-control boundary. Keeping the decision here prevents
callers from applying slightly different capacity rules.

## Supplied contract

`canAcceptJobs(currentJobs, incomingJobs, maxConcurrentJobs)` receives:

- a non-negative integer `currentJobs`
- a positive integer `incomingJobs`
- a positive integer `maxConcurrentJobs`
- inputs where `currentJobs` does not already exceed `maxConcurrentJobs`

It returns:

- `true` when admitting the incoming jobs would leave the proposed load at or below capacity
- `false` when the proposed load would exceed capacity

Input validation is outside this exercise.

## Your task

1. Edit `worker-capacity.ts` and replace the placeholder with the general capacity rule.
2. Keep both starter tests in `worker-capacity.test.ts`.
3. Add at least one behavioral regression test at the capacity transition.

Your added test must fail if a developer accidentally rejects a proposed load that reaches
capacity exactly. Choose the concrete inputs and write the test name and assertion yourself.

## Scope

- Edit only `worker-capacity.ts` and `worker-capacity.test.ts`.
- Keep the supplied function name, parameters, and return type.
- Do not hardcode the starter-test values.
- Do not add validation, throwing, coercion, clamping, arrays, loops, objects, helpers,
  dependencies, mocks, fixtures, hooks, or parameterized tests.
- Test observable behavior, not the source code or a private calculation.

Test ownership is **starter plus learner case**. The starter tests establish the known
Vitest harness while your added case retrieves transition-focused test selection.

## Start and verify

Run the focused suite before editing:

```sh
npx vitest run exercises/typescript/006-protect-worker-capacity
```

After implementing the rule and adding your test, run:

```sh
npx vitest run exercises/typescript/006-protect-worker-capacity
npx vitest run exercises/typescript
npm run typecheck
```

## Documentation

- [MDN: addition (`+`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Addition)
- [MDN: less than or equal (`<=`)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Less_than_or_equal)
- [Vitest: `expect`](https://vitest.dev/api/expect.html)

## Done when

- The implementation represents the general proposed-load capacity rule.
- The two starter tests remain.
- Your regression test proves that reaching capacity exactly is accepted.
- Test names describe observable behavior.
- Focused tests, all TypeScript exercise tests, and type-checking pass.

Request review and disclose any documentation, hints, prior exercise reference, test-name
polishing, or outside AI help.
