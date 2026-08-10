# REACT-007: Build Order Options

Status: complete

Target time: 20–30 minutes

Primary capability: one-to-one collection transformation with `Array.map`

## Goal

Transform readonly order records into display-ready option objects without mutating the
input.

This exercise targets `src/utils`, not a component folder. A React application also needs
framework-independent data transformations that components and features can reuse.

## Mental model

Use `map` when every input element produces exactly one output element. It calls the
callback once for each element, preserves the collection order, and creates a new array.

For example, this transforms each word into its length:

```ts
const lengths = words.map((word) => {
  return word.length;
});
```

The callback receives one current element and must return the value that belongs at the same
position in the output array.

## Your task

The input type, output type, function boundary, and tests are supplied. Edit
`src/utils/build-order-options.ts` and replace the empty-array placeholder.

For every order:

| Input field | Output field |
|---|---|
| `id` | `value` |
| `customerName` and `id` | `label` formatted as `<customerName> (<id>)` |

Example:

```text
{ id: "ORD-101", customerName: "Ava Stone" }
→
{ value: "ORD-101", label: "Ava Stone (ORD-101)" }
```

The result must preserve input order. Empty input must produce an empty array.

## Scope

Edit only `src/utils/build-order-options.ts`.

- Keep the supplied types and function signature unchanged.
- Use exactly one call to `map`.
- Return a new `OrderOption` object for each order.
- Do not mutate the input array or its records.
- Do not use a loop, `forEach`, `reduce`, `filter`, `sort`, conditions, or helpers.
- Do not add React, JSX, component imports, or test changes.

## Start and verify

1. Run the focused tests before editing.
2. Replace `return []` with a call to `orders.map`.
3. Use a callback block with `return` to construct one output object.

```sh
npx vitest run exercises/react/01-fundamentals/007-build-order-options
npm run check:typescript
```

## Documentation

- [MDN: `Array.prototype.map`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map)
- [TypeScript: `ReadonlyArray`](https://www.typescriptlang.org/docs/handbook/2/objects.html#the-readonlyarray-type)
- [Bulletproof React: Project Structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)

## Done when

- All supplied tests and type-checking pass.
- Every input produces one correctly shaped option in the same position.
- Empty input produces a new empty array.
- The input array and records remain unchanged.
- No excluded behavior or test changes are introduced.

Request review and disclose any documentation, hints, prior exercise reference, or outside
AI help.
