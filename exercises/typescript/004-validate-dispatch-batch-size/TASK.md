# TS-004: Validate a Dispatch Batch Size

Status: active

Target time: 10–20 minutes

Primary capability: retrieve positive-integer boundary validation independently

## Goal

Implement a small validation boundary for a job-dispatch system.

This exercise retrieves the non-integer validation that the tutor completed in TS-003. It
uses a new domain and supplied tests so the evidence is whether you can now apply the
operation without solution help.

## Mental model

TypeScript's `number` type includes integers, decimals, `NaN`, and infinities. A range check
alone does not fully express an integer contract.

`Number.isInteger(value)` answers whether a numeric value is an integer. The remaining part
of the contract is an inclusive range: both endpoints are valid.

This validator sits at a system boundary. Rejecting invalid batch sizes before dispatch
prevents downstream workers from receiving fractional, empty, or unbounded work requests.

## Your task

Edit `validate-dispatch-batch-size.ts` and replace the `false` placeholder.

`isValidDispatchBatchSize(batchSize)` must return `true` only when `batchSize` is:

- an integer
- at least `1`
- at most `100`

Every other numeric value must return `false`, including decimals, `NaN`, and infinities.

## Scope

Edit only `validate-dispatch-batch-size.ts`.

- Keep the supplied function name, parameter, and return type.
- Use `Number.isInteger`.
- Express the general invariant; do not enumerate the tested invalid values.
- Do not round, truncate, clamp, throw, or coerce the input.
- Do not edit the supplied tests.
- Do not add arrays, loops, objects, helpers, dependencies, or framework code.

## Start and verify

Run the focused tests before editing:

```sh
npx vitest run exercises/typescript/004-validate-dispatch-batch-size
```

After editing, run the focused tests again, then verify the TypeScript track and type-check:

```sh
npx vitest run exercises/typescript
npm run typecheck
```

## Documentation

- [MDN: `Number.isInteger()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger)

## Done when

- The focused tests pass.
- All TypeScript exercise tests and type-checking pass.
- The implementation represents the general positive-integer range contract.
- No excluded behavior or test changes are introduced.

Request review and disclose any documentation, hints, prior exercise reference, or outside
AI help.
