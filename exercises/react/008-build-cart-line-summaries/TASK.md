# REACT-008: Build Cart Line Summaries

Status: complete

Target time: 15–25 minutes

Primary capability: independently retrieve one-to-one collection transformation

## Goal

Transform readonly cart lines into display-ready summaries while preserving order and input
immutability.

This is a retrieval task in `src/utils`. It checks whether you can reconstruct the `map`
callback and its returned object without another structural scaffold.

## Mental model

The input is an array of `CartLine` records. The callback receives one line and must return
one `CartLineSummary`. The complete `map` expression therefore produces an array of
summaries with the same length and order as the input.

## Your task

The types, function boundary, and tests are supplied. Edit
`src/utils/build-cart-line-summaries.ts` and replace the empty-array placeholder.

For every cart line:

| Output field | Required value |
|---|---|
| `id` | `productId` |
| `label` | `<quantity> x <productName>` |
| `totalCents` | `unitPriceCents * quantity` |

For example, a quantity of `2` and product name `Keyboard` produces the label
`2 x Keyboard`.

The result must preserve input order. Empty input must produce a new empty array.

## Scope

Edit only `src/utils/build-cart-line-summaries.ts`.

- Keep the supplied types and function signature unchanged.
- Use exactly one call to `map`.
- Return one new summary object for each input line.
- Do not mutate the input array or its records.
- Do not use a loop, `forEach`, `reduce`, `filter`, `sort`, conditions, or helpers.
- Do not add React, JSX, component imports, or test changes.
- For independent retrieval evidence, do not open the REACT-007 implementation while
  working. If you do reference it, disclose that during review.

## Start and verify

1. Run the focused tests before editing.
2. Replace the placeholder with the one-to-one transformation.
3. Run the focused and full checks.

```sh
npx vitest run exercises/react/008-build-cart-line-summaries
npm run typecheck
npx vitest run --exclude 'exercises/typescript/005-test-rate-limit-state/**'
```

The separate active TypeScript task is excluded from the stable suite until its tests are
authored.

## Documentation

- [MDN: `Array.prototype.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [Bulletproof React: Project Structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)

## Done when

- All supplied focused tests, type-checking, and the stable suite pass.
- Every input produces one correctly calculated summary in the same position.
- Empty input produces a new empty array.
- The input array and records remain unchanged.
- No excluded behavior or test changes are introduced.

Request review and disclose any documentation, hints, prior exercise reference, or outside
AI help.
