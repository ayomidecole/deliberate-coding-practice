# TS-001: Summarize User Activity

Target time: 30–45 minutes  
Primary focus: discriminated unions, narrowing, transformations, behavioral tests

## Scenario

An application records several kinds of user activity. A reporting screen needs one summary per user rather than a raw event stream.

Implement `summarizeUserActivity` in `summarize-user-activity.ts`.

## Required behavior

For every distinct `userId`, return one summary containing:

- the total number of events for that user
- the total value of that user's purchases, in cents
- the number of high-priority support tickets
- the timestamp of that user's latest event

Return summaries ordered by:

1. `latestActivityAt` descending (most recent first)
2. `userId` ascending when two users have the same latest timestamp

Additional rules:

- An empty input returns an empty array.
- Duplicate events are separate events and must each be counted.
- Input timestamps are valid ISO 8601 strings.
- Purchase amounts are non-negative integers.
- The function must not mutate the input array or any input event.

## Your testing responsibility

Two starter tests are provided. Add at least three meaningful behavioral tests. Your tests must collectively cover:

- all three event variants
- aggregation across multiple events for one user
- ordering multiple users, including the tie-breaker
- input immutability

You may satisfy several requirements in one test, but keep each test's purpose understandable.

## Constraints

- Do not use `any`.
- Do not use type assertions such as `as SomeType`.
- Do not change the exported input or output types for this exercise.
- Prefer clarity over compressing the implementation into the fewest lines.
- Do not add a library to solve the transformation.

## Required reading

- [TypeScript: Narrowing and discriminated unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)

## Reference material

- [TypeScript: Object types and `ReadonlyArray`](https://www.typescriptlang.org/docs/handbook/2/objects.html#the-readonlyarray-type)
- [Vitest: Getting started](https://vitest.dev/guide/)
- [Vitest: Assertions](https://vitest.dev/api/expect.html)

## Acceptance commands

From the repository root, run:

```sh
npm run check
```

To rerun only this exercise while working:

```sh
npx vitest exercises/typescript/001-summarize-user-activity
```

## When you are done

Ask for a review and include short answers to these questions:

1. What part required the most thought?
2. Which test gave you the most confidence, and why?
3. Did you use the documentation or request any hints?

The review may include a small follow-up change or explanation before the exercise is marked complete.
