# TS-003: Repair an Inventory Reservation Contract

Target time: 30–45 minutes  
Primary focus: reading existing code, debugging from tests, explicit failure contracts, and discriminated unions

## Engineering reason

Most software-engineering work changes existing behavior rather than starting from a blank file. This task practices tracing an implementation against a written contract, distinguishing expected domain failures from unexpected exceptions, and adding regression tests before calling a repair complete.

This is a prerequisite for later API and service work, where callers need reliable, typed outcomes for failures they are expected to handle.

## Scenario

An inventory module is already in use, but its implementation does not fully honor its public contract. Some starter tests exist and one currently exposes a defect.

Work in the provided files:

- `inventory-reservation.ts`
- `inventory-reservation.test.ts`

Begin by reading both files and running the focused test command before editing anything.

## Public contract

`reserveInventory` receives:

- a readonly mapping from product IDs to available integer stock
- a product ID
- a requested quantity

It returns one member of the existing `ReservationResult` discriminated union.

Required behavior:

- A quantity is valid only when it is a positive integer.
- Invalid quantities return `{ ok: false, reason: "invalid-quantity" }`.
- A product absent from inventory returns `{ ok: false, reason: "unknown-product" }`.
- A known product with less stock than requested returns `{ ok: false, reason: "insufficient-stock" }`.
- A known product with exactly the requested stock succeeds with `remainingStock: 0`.
- Other successful reservations return the correct remaining stock.
- Expected domain failures must be returned, not thrown.
- The inventory input must not be mutated.

Assume product IDs are non-empty and all stored stock values are non-negative integers.

## Your implementation responsibility

- Diagnose the existing behavior before changing it.
- Repair the implementation while preserving the exported API and type shapes.
- You may introduce a small private helper if it improves clarity, but do not add abstraction without a concrete need.
- Do not change tests merely to make incorrect behavior pass.

## Your testing responsibility

Keep the starter tests and add at least four meaningful behavioral tests. Your additions must collectively cover:

- zero quantity
- non-integer quantity
- unknown product
- requesting exactly all available stock
- input immutability

You may use a parameterized test for related invalid quantities, but make each failed case understandable in the test output.

## Constraints

- Do not change exported type names, union members, or function parameters.
- Do not use `any` or type assertions.
- Do not throw for any failure described by the public contract.
- Do not skip or delete a test.
- Prefer explicit readable branches over compressed logic.

## Required reading

- [TypeScript: Discriminated unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions)
- [MDN: `Number.isInteger()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isInteger)

## Reference material

- [TypeScript: `readonly` properties](https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties)
- [MDN: `Object.hasOwn()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwn)
- [Vitest: Assertions](https://vitest.dev/api/expect.html)

## Commands

Run only this task while working:

```sh
npx vitest exercises/typescript/003-repair-inventory-reservation
```

Run the complete acceptance check before requesting review:

```sh
npm run check
```

## Acceptance criteria

- All public-contract behavior is implemented.
- Starter tests remain present.
- At least four meaningful tests have been added and all required cases are covered.
- Tests verify returned domain failures rather than implementation details.
- No input mutation occurs.
- Type-checking and all repository tests pass.

## When you are done

Ask for review and include short answers:

1. What incorrect behaviors did you find before editing?
2. Why are these failures returned instead of thrown?
3. How does the `ok` property help callers use `ReservationResult` safely?
4. Which documentation affected your implementation or tests?
5. Did you use any hints or outside AI-generated code?
