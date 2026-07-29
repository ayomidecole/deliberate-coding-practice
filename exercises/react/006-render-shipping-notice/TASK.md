# REACT-006: Render a Shipping Notice

Status: active

Target time: 20–30 minutes

Primary capability: retrieve conditional rendering with less implementation scaffold

## Goal

Build a typed component that presents one of two shipping states from a supplied boolean
prop.

In a Bulletproof React application, this feature-specific component would live under
`features/orders/components`. Folder placement is supplied in this exercise.

## Mental model

The component does not determine whether an order is delayed. That decision has already
been made elsewhere and arrives through `isDelayed`.

Your component owns the presentation decision: inspect that value, return the delayed JSX
when it is true, and otherwise return the on-schedule JSX. An explicit `if` keeps the two
possible paths visible.

## Your task

The readonly props type, tests, and browser-like test environment are supplied. Define and
export a function component named `ShippingNotice` in `shipping-notice.tsx`.

| Input state | Required output |
|---|---|
| `isDelayed` is `true` | Level-two heading `Order <orderNumber>` and `Delivery delayed` |
| `isDelayed` is `false` | Level-two heading `Order <orderNumber>` and `Delivery on schedule` |

## Scope

Edit only `shipping-notice.tsx`.

- Keep `ShippingNoticeProps` unchanged and use it as the component contract.
- Destructure both props in the function parameter.
- Use a named function export.
- Use an explicit `if` and two JSX return paths.
- Do not use a ternary, `&&`, composition, state, events, lists, styling, or helpers.
- Do not change or add tests.

## Start and verify

1. Run the focused test and read the missing-export failure.
2. Define the exported component from the supplied props type.
3. Add the delayed branch, then the on-schedule fallback.

```sh
npx vitest run exercises/react/006-render-shipping-notice
npm run check:typescript
```

## Documentation

- [React: Conditional Rendering](https://react.dev/learn/conditional-rendering)

## Done when

- Both supplied tests and type-checking pass.
- Each boolean state renders its required heading and status.
- The implementation uses the supplied typed contract and explicit control flow.
- No excluded behavior or test changes are introduced.

Request review and disclose any documentation, hints, prior exercise reference, or outside
AI help.
