# REACT-022: Handle a Controlled Input in a Feature

Status: complete

Target time: 25–35 minutes

Primary capability: translate a native input event into feature-owned state

## Goal

Complete the order-search feature so it handles edits from a supplied shared component,
stores the current search term, and returns that value to the component. The complete state
round trip will be visible in the browser.

## Mental model

Our application uses this ownership boundary:

```text
components → define reusable UI, markup, and prop contracts
features   → own state and handlers, then compose components
app        → compose complete features
```

`OrderSearchField` is already defined in `src/components/orders`. It renders the label and
controlled input, receives the current string, and attaches the handler supplied by its
feature. No reusable component is defined inside the feature file.

The feature owns the state transition:

```text
feature searchTerm ───────────────→ component input value
        ↑                                      │
        └─ set state ← feature handler ← ChangeEvent
```

When the user types, React passes a `ChangeEvent<HTMLInputElement>` to the feature handler.
The edited input is the event's `currentTarget`, and its `value` is the current string. The
feature stores that string, React renders again, and the new state returns to the input
through props.

## Your task

Edit only `src/features/orders/search-orders-feature.tsx`. The state, rendered structure,
shared component, event type import, conditional output, app/runtime, and tests are
supplied. The current `onChange` prop contains a no-op placeholder.

Complete the feature so that it:

- defines a named `handleSearchTermChange` function,
- types its parameter as `ChangeEvent<HTMLInputElement>`,
- updates `searchTerm` from the edited input's `currentTarget.value`, and
- passes that handler to `OrderSearchField` through `onChange`.

## Scope

- Do not edit `OrderSearchField`, the app, browser entry, tests, or HTML.
- Do not define another component in the feature file.
- Do not duplicate the label or input markup in the feature.
- Do not add another state value, an inline handler, form submission, filtering,
  validation, async work, routing, or styling.
- Test ownership is **fully supplied** because this is the first native input-event
  boundary. The next controlled-input retrieval will increase your test responsibility.

Your first three edits are identifiable: define the typed feature handler, update state
from the event's current input value, then replace the no-op `onChange` callback with the
handler reference. The likely stuck point is the event-to-string boundary; the TypeScript
DOM-events documentation below covers that exact operation.

## Start and verify

Run the focused tests first:

```bash
npx vitest run exercises/react/022-control-order-search-input
```

The initial-state test should pass. The edit test should fail because the supplied no-op
does not update feature state.

After implementing the handler, run:

```bash
npm run typecheck
npx vite build exercises/react/022-control-order-search-input
npx vitest run --exclude 'exercises/typescript/006-protect-worker-capacity/**'
```

Stop the previous exercise's development server, then start this one:

```bash
npx vite exercises/react/022-control-order-search-input --host 127.0.0.1
```

Open `http://127.0.0.1:5173`. Type `ORD-2048` into `Search orders` and verify that the page
changes from `Enter an order number.` to `Searching for: ORD-2048`. Keep the server running
when you return for review.

## Documentation

- [React TypeScript: DOM Events](https://react.dev/learn/typescript#typing-dom-events)
- [React: Controlling an input with state](https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable)
- [React: Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)
- [Bulletproof React project structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)

## Done when

- The handler lives in `SearchOrdersFeature`, not in the shared component.
- The input displays the feature's initial empty string.
- Each edit becomes the feature's next `searchTerm` and returns through the component.
- The focused tests, typecheck, production build, and stable suite pass.
- The browser displays `Searching for: ORD-2048` after the edit.
- No out-of-scope files or behaviors are changed.
