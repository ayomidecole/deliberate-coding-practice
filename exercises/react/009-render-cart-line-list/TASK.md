# REACT-009: Render a Cart Line List

Status: complete

Target time: 20–30 minutes

Primary capability: render a collection as keyed JSX

## Goal

Render readonly cart summaries as a semantic list while giving React stable identity for
each repeated item.

The summary type lives under `src/types`, and the domain component lives under
`src/components/cart`. Their placement and import direction are supplied.

## Mental model

You already know that `map` turns every input element into one output element. In a React
component, those outputs can be JSX elements.

React also needs to identify which rendered item corresponds to which data record when a
list changes. Put a stable `key` on the outermost JSX element returned directly by the
callback:

```tsx
{records.map((record) => {
  return <Element key={record.stableId}>...</Element>;
})}
```

The key is React bookkeeping rather than visible content. Use an existing stable identifier
from the data; do not generate one while rendering or use the array position.

## Your task

The shared summary type, component props, function boundary, tests, and browser-like test
environment are supplied. Edit
`src/components/cart/cart-line-summary-list.tsx` and replace `return null`.

Render:

- a `section`
- a level-two heading with the exact text `Cart summary`
- an unordered list
- one list item for every summary, in input order
- exact list-item text `<label>: <totalCents> cents`

Use each summary's `id` as its list item's `key`. Empty input should still render the heading
and an empty unordered list.

## Scope

Edit only `src/components/cart/cart-line-summary-list.tsx`.

- Keep the supplied import, props type, and function signature unchanged.
- Use exactly one `map` call inside the unordered list.
- Use a callback block with an explicit `return`.
- Put `key={summary.id}` on the returned list item.
- Do not use an array index or generate a key.
- Do not add conditions, child components, state, events, filtering, sorting, utility calls,
  styling, fragments, or test changes.

## Start and verify

1. Run the focused tests before editing.
2. Replace `null` with the section, heading, and unordered list.
3. Embed the mapped, keyed list items inside the unordered list.

```sh
npx vitest run exercises/react/009-render-cart-line-list
npm run typecheck
npx vitest run --exclude 'exercises/typescript/005-test-rate-limit-state/**'
```

The separate active TypeScript task is excluded from the stable suite until its tests are
authored.

## Documentation

- [React: Rendering Lists](https://react.dev/learn/rendering-lists)
- [Bulletproof React: Project Structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)

## Done when

- Both supplied focused tests, type-checking, and the stable suite pass.
- The component renders one correctly formatted list item per summary in input order.
- Every returned list item uses its summary's stable `id` key.
- Empty input renders an empty semantic list without special-case branching.
- No excluded behavior or test changes are introduced.

Request review and disclose any documentation, hints, prior exercise reference, or outside
AI help.
