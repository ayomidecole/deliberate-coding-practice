# REACT-018: Compose a Stateful Feature

Status: complete

Target time: 30–40 minutes

Primary capability: place workflow state in a feature composition boundary

## Goal

Build the feature entry that owns delivery-note disclosure state and connects it to a
supplied controlled UI component.

This is the first exercise with both `src/components` and `src/features`. Reusable UI stays
in `components`; the feature entry coordinates state and behavior for one workflow.

## Mental model

The supplied `DeliveryNoteDisclosure` is controlled: it renders what its props describe and
reports user intent through a callback. It does not own state.

```text
src/features/orders/RevealDeliveryNoteFeature
  owns isRevealed and the state transition
             |
             | isRevealed value + onReveal callback
             v
src/components/orders/DeliveryNoteDisclosure
  owns button and conditional paragraph markup
```

The callback reference travels down as a prop. When the child calls it, the user's intent
travels back to the state owner. The next render sends the updated value down again.

The dependency remains one-way: the feature imports the reusable component; the component
does not import the feature.

## Your task

The controlled component, imports, feature boundary, tests, and test environment are
supplied. Edit `src/features/orders/reveal-delivery-note-feature.tsx` and replace
`return null`.

The feature must:

- declare one boolean state value initialized to `false`
- use a named local handler that stores `true`
- render the supplied `DeliveryNoteDisclosure`
- pass the current state through its `isRevealed` prop
- pass the handler reference through its `onReveal` prop

## Scope

Edit only `src/features/orders/reveal-delivery-note-feature.tsx`.

- Keep the supplied direct imports and feature name unchanged.
- Choose clear names for the state pair and handler.
- Do not duplicate the button, paragraph, or conditional JSX in the feature.
- Do not change the controlled component or tests.
- Do not add props to the feature, additional state, effects, lists, forms, async work,
  styling, hooks, stores, API code, app code, helpers, or barrel exports.
- Tests are fully supplied because this task introduces the feature-ownership boundary.

## Start and verify

1. Run the focused tests and inspect the initial failures.
2. Read the supplied controlled component's prop contract.
3. Declare feature-owned state and its named transition handler.
4. Render the component and connect both props.

```sh
npx vitest run exercises/react/018-compose-stateful-feature
npm run typecheck
npx vitest run --exclude 'exercises/typescript/006-protect-worker-capacity/**'
```

The separate active TypeScript task is excluded from the stable suite until it is complete.

## Documentation

- [React: Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)
- [React: State—A Component's Memory](https://react.dev/learn/state-a-components-memory)
- [Bulletproof React: Project Structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)

## Done when

- Both focused tests, typechecking, and the stable suite pass.
- The paragraph is absent initially and appears after the supplied component reports the
  reveal intent.
- State and transition ownership remain in the feature.
- Reusable markup and conditional rendering remain in the component.
- The dependency points from feature to component, with no excluded behavior.

Request review and disclose any documentation, hints, prior exercise reference, search, or
outside AI help.
