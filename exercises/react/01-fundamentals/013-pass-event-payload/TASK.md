# REACT-013: Pass an Event Payload

Status: complete

Target time: 20–30 minutes

Primary capability: adapt a click into a domain-specific callback payload

## Goal

Build a typed member-selection button that tells its parent which member was selected.

The component belongs under `src/components/teams`. A future feature can own the selection
behavior; this component translates a browser click into the feature-facing
`onSelect(memberId)` contract.

## Mental model

The browser click does not contain your member ID. The component already has that ID in its
props, so a local handler adapts one boundary into another:

```text
component renders → React stores the local handler
user clicks       → React calls the local handler
local handler     → calls onSelect with memberId
```

The handler must be passed to React during render. The payload callback should run only
after the click.

## Your task

The props type, component boundary, tests, and browser-like test environment are supplied.
Edit `src/components/teams/select-member-button.tsx` and replace `return null`.

The component must:

- define a local zero-argument function named `handleSelect`
- call `onSelect(memberId)` inside `handleSelect`
- render a button with `type="button"`
- display the exact text `Select <displayName>`
- pass `handleSelect` to the button's click event
- avoid calling `onSelect` during render

## Scope

Edit only `src/components/teams/select-member-button.tsx`.

- Keep the supplied props type and component signature unchanged.
- Use the named local handler described above.
- Pass the local handler reference rather than calling it in JSX.
- Do not use an inline event function.
- Do not add state, conditions, lists, forms, async work, event-object logic, styling,
  helpers, child components, or test changes.

## Start and verify

1. Run the focused tests before editing.
2. Define `handleSelect` inside the component and make it send `memberId`.
3. Render the semantic button and connect the handler reference.

```sh
npx vitest run exercises/react/01-fundamentals/013-pass-event-payload
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
- Clicking sends the current `memberId` exactly once.
- The component translates the browser event into a domain-specific intent without owning
  selection behavior.
- No excluded behavior or test changes are introduced.

Request review and disclose any documentation, hints, prior exercise reference, search, or
outside AI help.
