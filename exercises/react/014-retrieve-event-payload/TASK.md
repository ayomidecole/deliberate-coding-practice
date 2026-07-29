# REACT-014: Retrieve an Event Payload

Status: complete

Target time: 20–30 minutes

Primary capability: independently adapt a click into a callback payload

## Goal

Build a typed cancellation button that shows an order's customer-facing number while
telling its parent which internal order ID should be cancelled.

This component belongs under `src/components/orders`. A future feature will own the actual
cancellation behavior; the component owns only the UI-to-feature boundary.

## Mental model

One order can have two identifiers with different jobs:

| Value | Boundary responsibility |
|---|---|
| `orderNumber` | Displayed to the user |
| `orderId` | Sent to the parent callback |

React still needs a function to call later. Rendering describes the button; clicking is
what should produce the cancellation intent.

## Your task

The props contract, component boundary, and tests are supplied. Edit
`src/components/orders/cancel-order-button.tsx` and replace `return null`.

The component must:

- accept the supplied `CancelOrderButtonProps`
- render a button with `type="button"`
- display the exact text `Cancel order <orderNumber>`
- use a named local handler for the click
- call `onCancel(orderId)` exactly once per click
- avoid calling `onCancel` during render

## Scope

Edit only `src/components/orders/cancel-order-button.tsx`.

- Keep the supplied props type unchanged.
- Choose how to access the prop values and name the local handler yourself.
- Pass a handler reference to the click event.
- Do not use an inline event function.
- Do not add state, conditions, lists, forms, async work, event-object logic, styling,
  helpers, child components, or test changes.

## Start and verify

1. Run the focused tests and read both failures.
2. Make the component access the values required by the contract.
3. Add the local payload adapter.
4. Render the button and connect the handler.

```sh
npx vitest run exercises/react/014-retrieve-event-payload
npm run typecheck
npx vitest run --exclude 'exercises/typescript/005-test-rate-limit-state/**'
```

The separate active TypeScript task is excluded from the stable suite until its tests are
authored.

## Documentation

Try the task from memory first. If needed afterward:

- [React: Responding to Events](https://react.dev/learn/responding-to-events)
- [Bulletproof React: Project Structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)

## Done when

- Both focused tests, type-checking, and the stable suite pass.
- The visible order number and callback order ID remain correctly separated.
- The callback runs only after a click and receives the current `orderId`.
- No excluded behavior or test changes are introduced.

Request review and disclose any documentation, hints, prior exercise reference, search, or
outside AI help.
