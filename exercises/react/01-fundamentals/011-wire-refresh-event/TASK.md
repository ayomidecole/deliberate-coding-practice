# REACT-011: Wire a Refresh Event

Status: complete

Target time: 15–25 minutes

Primary capability: connect a callback prop to a DOM event

## Goal

Build a typed button component that reports a user interaction to its parent without
running the callback during rendering.

The component belongs under `src/components/orders`. A future feature can decide what
refreshing orders actually does; this component owns only the interaction surface.

## Mental model

Rendering and interaction happen at different times:

```text
component renders → React stores the callback reference
user clicks       → React invokes the stored callback
```

The parent supplies `onRefresh` as a function. The button passes that function to React's
click event. Calling the function while building JSX would perform the action during render,
before any user interaction.

## Your task

The props type, function boundary, tests, and browser-like test environment are supplied.
Edit `src/components/orders/refresh-orders-button.tsx` and replace `return null`.

Render one button that:

- has `type="button"`
- displays the exact text `Refresh orders`
- passes `onRefresh` directly to its click event
- does not call `onRefresh` while rendering

## Scope

Edit only `src/components/orders/refresh-orders-button.tsx`.

- Keep the supplied props type and function signature unchanged.
- Use a semantic `button`.
- Pass the existing function reference directly.
- Do not call the callback in JSX or wrap it in another function.
- Do not add state, conditions, payload arguments, lists, forms, async work, styling,
  helpers, child components, or test changes.

## Start and verify

1. Run the focused tests before editing.
2. Replace `null` with the semantic button and its text.
3. Connect the supplied callback reference to the click event.

```sh
npx vitest run exercises/react/01-fundamentals/011-wire-refresh-event
npm run typecheck
npx vitest run --exclude 'exercises/typescript/005-test-rate-limit-state/**'
```

The separate active TypeScript task is excluded from the stable suite until its tests are
authored.

## Documentation

- [React: Responding to Events](https://react.dev/learn/responding-to-events)
- [Bulletproof React: Project Structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)

## Done when

- Both supplied focused tests, type-checking, and the stable suite pass.
- Rendering does not call the callback.
- Each user click calls the callback exactly once.
- The component remains a presentation boundary rather than implementing refresh behavior.
- No excluded behavior or test changes are introduced.

Request review and disclose any documentation, hints, prior exercise reference, search, or
outside AI help.
