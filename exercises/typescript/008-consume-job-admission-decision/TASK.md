# TS-008: Consume a Job-Admission Decision

Status: active

Target time: 10–20 minutes

Primary capability: discriminate and narrow a union in a consumer

## Goal

Consume a job-admission result safely by checking its discriminant before using
outcome-specific data.

TS-007 practiced constructing a discriminated union. This exercise moves to the other side
of the contract: code that receives the union and must handle every possible member.

## Mental model

`JobAdmissionDecision` has one property shared by every member: `accepted`. Its literal
value identifies which complete shape is present:

- when `accepted` is `true`, `resultingJobs` exists
- when `accepted` is `false`, `reason` exists

Before the discriminant is checked, TypeScript cannot safely assume either member-specific
property exists. Inside a branch that proves the discriminant's value, TypeScript narrows
the variable to that member and permits its associated property.

This is how a consumer honors a typed result contract. The producer owns the decision;
the consumer owns translating each outcome for its boundary without reimplementing the
capacity policy.

## Supplied contract

`formatJobAdmission(decision)` returns:

- `Accepted: 8 jobs running.` for an accepted decision whose `resultingJobs` is `8`
- `Rejected: capacity-exceeded.` for a rejected decision whose reason is
  `capacity-exceeded`

The private formatting helpers already produce the exact strings. Your function must
select the appropriate helper and pass it the data valid for that outcome.

## Your task

Edit only the body of `formatJobAdmission` in `format-job-admission.ts`.

Replace the thrown placeholder with explicit control flow that:

1. checks the supplied decision's discriminant
2. uses the correct member-specific property only after narrowing
3. returns the corresponding supplied formatter's result

Read the supplied type and tests before implementing, but do not edit them.

## Scope

- Keep all supplied types, imports, helpers, names, parameters, and return types.
- Do not reconstruct or recalculate the capacity decision.
- Do not access a property by casting, optional chaining, `in`, `any`, or a type assertion.
- Do not add validation, mutation, logging, dependencies, helpers, or additional outcomes.
- Prefer an explicit discriminant check and direct returns.

Test ownership is **supplied** because discriminant narrowing is the one new operation.
This follows another supplied suite only to separate union construction from union
consumption; TS-006 already provides recent independent test-design evidence.

## Start and verify

Run the focused suite before editing:

```sh
npx vitest run exercises/typescript/008-consume-job-admission-decision
```

After implementing the function, run:

```sh
npx vitest run exercises/typescript/008-consume-job-admission-decision
npx vitest run exercises/typescript
npm run typecheck
```

## Documentation

- [TypeScript: discriminated unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)
- [TypeScript: control-flow analysis](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#control-flow-analysis)

## Done when

- The accepted member produces the accepted message using `resultingJobs`.
- The rejected member produces the rejected message using `reason`.
- Member-specific properties are accessed only after narrowing.
- Supplied types, helpers, and tests are unchanged.
- Focused tests, all TypeScript exercise tests, and type-checking pass.

Request review and disclose any documentation, hints, prior exercise reference, or outside
AI help.
