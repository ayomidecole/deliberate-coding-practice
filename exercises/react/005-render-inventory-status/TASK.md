# REACT-005: Render Inventory Status

Status: complete

Target time: 20–30 minutes

Primary capability: conditional rendering with explicit control flow

## Goal

Render a different product status when inventory is empty while preserving the same typed
component contract.

In a Bulletproof React application, this feature-specific component would live under
`features/inventory/components`. Folder placement is supplied in this exercise.

## Mental model

React uses ordinary JavaScript and TypeScript control flow. A component can inspect its
props and return one JSX tree for one state and another JSX tree for another state:

```tsx
if (isArchived) {
  return <p>Archived</p>;
}

return <p>Active</p>;
```

This task uses an explicit `if` so the branch and both return paths remain visible. Ternary
and logical-AND shortcuts are deferred.

## Your task

The props type, component signature, tests, and browser-like test environment are supplied.
Edit `inventory-status.tsx` and replace `return null`.

| Input state | Required output |
|---|---|
| `availableUnits === 0` | Product name as a level-two heading and `Sold out` |
| `availableUnits > 0` | Product name as a level-two heading and `<availableUnits> units available` |

Assume `availableUnits` is a non-negative integer. Validation is out of scope.

## Scope

Edit only `inventory-status.tsx`.

- Keep the supplied type and function signature unchanged.
- Use an explicit `if` and exact zero comparison.
- Return semantic JSX for both paths.
- Do not use a ternary, `&&`, state, events, child components, lists, styling, or helpers.
- Do not change or add tests.

## Start and verify

1. Run the focused test before editing.
2. Add the exact zero branch and its JSX return.
3. Replace the fallback `null` with the positive-stock JSX return.

```sh
npx vitest run exercises/react/005-render-inventory-status
npm run check:typescript
```

## Documentation

- [React: Conditional Rendering](https://react.dev/learn/conditional-rendering)

## Done when

- All supplied tests and type-checking pass.
- Zero and positive inventory render their required, distinct status text.
- Both paths derive the heading and status from props.
- No excluded behavior or test changes are introduced.

Request review and disclose any documentation, hints, prior exercise reference, or outside
AI help.
