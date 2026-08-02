# REACT-015: Introduce Local State

Status: complete

Target time: 25–35 minutes

Primary capability: store component-local UI state with `useState`

## Goal

Build a notification button that remembers when the user has marked the notification as
read and changes its label to match.

This component belongs under `src/components/notifications`. The read status exists only
for this small interaction; sharing or persisting it is intentionally outside this task.

## Mental model

Rendering a component runs its function and produces a UI description. A regular local
variable is recreated on every render and changing it does not ask React to render again.
State gives React both:

1. a value to retain for this component instance
2. a setter that stores the next value and schedules another render

The general shape is:

```tsx
const [currentValue, setCurrentValue] = useState(initialValue);
```

- `currentValue` is the value for the current render.
- `setCurrentValue(nextValue)` requests a future render with the new value.
- Hooks such as `useState` must stay at the top level of the component.

The target already supplies the import, top-level Hook call, and initial value. Your event
handler will request the state change, and the next render will derive the button label
from `isRead`.

## Your task

Edit `src/components/notifications/read-notification-button.tsx` and replace `return null`.

The component must:

- initially render a button named `Mark notification as read`
- render the button with `type="button"`
- use a named local click handler
- call `setIsRead(true)` inside that handler
- render the label `Notification read` after the click
- derive the label from the supplied `isRead` state value

## Scope

Edit only `src/components/notifications/read-notification-button.tsx`.

- Keep the supplied import, component name, and state declaration unchanged.
- Choose the handler name and conditional expression yourself.
- Do not add props, callbacks, additional state, effects, lists, forms, async work, styling,
  helpers, child components, or test changes.

## Start and verify

1. Run the focused tests and read both initial failures.
2. Add the named handler that requests the state update.
3. Render the semantic button and connect the handler.
4. Derive its label from `isRead`.

```sh
npx vitest run exercises/react/015-introduce-local-state
npm run typecheck
npx vitest run --exclude 'exercises/typescript/005-test-rate-limit-state/**'
```

The separate active TypeScript task is excluded from the stable suite until its tests are
authored.

## Documentation

- [React: State—A Component's Memory](https://react.dev/learn/state-a-components-memory)
- [React: `useState`](https://react.dev/reference/react/useState)
- [Bulletproof React: Project Structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)

## Done when

- Both focused tests, type-checking, and the stable suite pass.
- The initial label represents the initial state.
- Clicking updates the remembered state and therefore the rendered label.
- No excluded behavior or test changes are introduced.

Request review and disclose any documentation, hints, prior exercise reference, search, or
outside AI help.
