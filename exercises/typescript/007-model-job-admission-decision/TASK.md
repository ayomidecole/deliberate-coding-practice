# TS-007: Model a Job-Admission Decision

Status: complete

Target time: 15–25 minutes

Primary capability: retrieve discriminated-union result construction

## Goal

Replace a boolean capacity answer with a typed decision that gives callers the information
they need after either outcome.

TS-006 established the capacity invariant. This exercise keeps that invariant familiar and
raises one dimension: selecting and constructing the correct member of a result union.

## Mental model

A boolean says only “yes” or “no.” At a system boundary, callers often need different data
for each outcome:

- an accepted decision includes the resulting number of jobs
- a rejected decision includes a stable reason the caller can handle

`JobAdmissionDecision` is a discriminated union. Its `accepted` property is the
discriminant:

- `accepted: true` requires `resultingJobs`
- `accepted: false` requires `reason`

Because the literal value and associated properties travel together, TypeScript can help
callers use only the data available for the outcome they received.

## Supplied contract

`decideJobAdmission(currentJobs, incomingJobs, maxConcurrentJobs)` receives:

- a non-negative integer `currentJobs`
- a positive integer `incomingJobs`
- a positive integer `maxConcurrentJobs`
- inputs where `currentJobs` does not already exceed `maxConcurrentJobs`

Calculate the proposed load as `currentJobs + incomingJobs`.

- When the proposed load is at or below capacity, return the accepted union member with the
  proposed load as `resultingJobs`.
- When the proposed load exceeds capacity, return the rejected union member with
  `reason: 'capacity-exceeded'`.

Reaching capacity exactly is accepted. Input validation is outside this exercise.

## Your task

Edit only `job-admission-decision.ts` and replace the thrown placeholder.

Use the supplied `JobAdmissionDecision` type as the function's public contract. Read the
supplied tests before implementing, but do not edit them.

## Scope

- Keep the supplied exported type, function name, parameters, and return type.
- Do not call the TS-006 function; implement this function from its own contract.
- Do not throw for either documented outcome.
- Do not add validation, coercion, mutation, helpers, dependencies, classes, or additional
  result members.
- Prefer explicit control flow over type assertions or `any`.

Test ownership is **supplied** because constructing the discriminated-union result is the
retrieval target. Adding test responsibility would raise a second dimension immediately
after TS-006 already provided independent test evidence.

## Start and verify

Run the focused suite before editing:

```sh
npx vitest run exercises/typescript/007-model-job-admission-decision
```

After implementing the function, run:

```sh
npx vitest run exercises/typescript/007-model-job-admission-decision
npx vitest run exercises/typescript
npm run typecheck
```

## Documentation

- [TypeScript: discriminated unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)
- [TypeScript: union types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types)

## Done when

- Below-capacity and exact-capacity inputs return the complete accepted member.
- Over-capacity input returns the complete rejected member.
- The capacity rule is general rather than hardcoded to test values.
- The supplied type and tests are unchanged.
- Focused tests, all TypeScript exercise tests, and type-checking pass.

Request review and disclose any documentation, hints, prior exercise reference, or outside
AI help.
