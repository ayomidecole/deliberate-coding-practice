# TS-001: Calculate a Cart Summary

Target time: 20–30 minutes  
Primary focus: typed data transformations and behavioral tests

## Concept

Transform a list of typed input records into one calculated result without changing the input.

## Why it matters

Applications constantly derive totals and summaries from existing data. This small task practices making those calculations predictable, readable, and protected by useful tests.

## Scenario

An online store keeps each cart entry as a line item. Implement `calculateCartSummary` in `calculate-cart-summary.ts` so the checkout screen can display a few totals.

## Required behavior

Given a readonly array of cart items, return:

- `totalQuantity`: the sum of every item's quantity
- `subtotalCents`: the sum of `unitPriceCents * quantity` for every item
- `uniqueProductCount`: the number of distinct `productId` values

Additional rules:

- An empty cart returns zero for all three values.
- Repeated `productId` values count once toward `uniqueProductCount`, but every line still contributes to quantity and subtotal.
- Inputs contain non-empty product IDs, non-negative integer prices, and positive integer quantities.
- The function must not mutate the input array or its items.

## Your testing responsibility

Two starter tests are provided. Add at least three meaningful behavioral tests. Your tests must collectively cover:

- multiple different products
- repeated product IDs
- a free item whose `unitPriceCents` is zero
- input immutability

One test may cover more than one requirement, but each test should have a clear purpose.

## Constraints

- Do not use `any`.
- Do not use type assertions such as `as SomeType`.
- Do not change the exported input or output types.
- Prefer a clear implementation over the fewest possible lines.
- Do not add a library to perform the calculation.

## Required reading

- [TypeScript: Everyday types—arrays](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#arrays)
- [TypeScript: Object types—readonly properties](https://www.typescriptlang.org/docs/handbook/2/objects.html#readonly-properties)

## Reference material

- [TypeScript: `ReadonlyArray`](https://www.typescriptlang.org/docs/handbook/2/objects.html#the-readonlyarray-type)
- [Vitest: Assertions](https://vitest.dev/api/expect.html)

## Acceptance criteria

- All required behavior is implemented.
- At least three meaningful tests have been added.
- Tests describe behavior rather than implementation details.
- Type-checking and all tests pass.

From the repository root, run:

```sh
npm run check
```

To rerun only this exercise while working:

```sh
npx vitest exercises/typescript/001-calculate-cart-summary
```

## When you are done

Ask for a review and include short answers:

1. What part required the most thought?
2. Which test gave you the most confidence, and why?
3. Did you use the documentation or request any hints?

The review may include a small explanation or follow-up change before the exercise is marked complete.
