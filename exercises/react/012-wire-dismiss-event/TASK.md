# REACT-012: Wire a Dismiss Event

Status: complete

Target time: 15–25 minutes

Primary capability: independently retrieve direct event-callback wiring

## Goal

Reconstruct a typed button component that reports a dismiss interaction without invoking
its callback during render.

This retrieval task reduces the component scaffold while keeping the event contract the
same. It belongs under `src/components/notifications`.

## Mental model

The component owns the semantic interaction surface. Its parent owns the behavior represented
by `onDismiss`.

During render, React must receive the function itself. When the user clicks, React invokes
that stored function. The component should not add its own behavior or arguments.

## Your task

The readonly props type, tests, and browser-like test environment are supplied. Define and
export a function component named `DismissNotificationButton` in
`src/components/notifications/dismiss-notification-button.tsx`.

It must:

- accept and destructure `onDismiss` using `DismissNotificationButtonProps`
- render one button with `type="button"`
- display the exact text `Dismiss notification`
- pass `onDismiss` directly to the click event
- avoid calling `onDismiss` during render

## Scope

Edit only `src/components/notifications/dismiss-notification-button.tsx`.

- Keep the supplied props type unchanged.
- Use a named function export.
- Pass the existing callback reference directly.
- Do not call the callback in JSX or wrap it in another function.
- Do not add state, conditions, payload arguments, lists, forms, async work, styling,
  helpers, child components, or test changes.
- For independent retrieval evidence, do not open REACT-011 or search the documentation
  before your attempt. Disclose any reference used during review.

## Start and verify

1. Run the focused tests and read the missing-export failure.
2. Define the exported component from the supplied props type.
3. Render the button and retrieve the event connection from memory.

```sh
npx vitest run exercises/react/012-wire-dismiss-event
npm run typecheck
npx vitest run --exclude 'exercises/typescript/005-test-rate-limit-state/**'
```

The separate active TypeScript task is excluded from the stable suite until its tests are
authored.

## Documentation

Use after your independent attempt if needed:

- [React: Responding to Events](https://react.dev/learn/responding-to-events)
- [Bulletproof React: Project Structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)

## Done when

- Both supplied focused tests, type-checking, and the stable suite pass.
- Rendering does not call the callback.
- Each user click calls the callback exactly once.
- The component uses the supplied typed contract and owns no dismiss behavior.
- No excluded behavior or test changes are introduced.

Request review and disclose any documentation, hints, prior exercise reference, search, or
outside AI help.
