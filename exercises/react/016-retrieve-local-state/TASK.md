# REACT-016: Retrieve Local State

Status: active

Target time: 20–30 minutes

Primary capability: independently model a one-way numeric state transition

## Goal

Build a training-progress button that remembers completion of the first step and renders
the remembered number directly.

The component belongs under `src/components/training`. This task isolates state mechanics:
there is no conditional label and no feature-level ownership yet.

## Mental model

Describe the interaction as a small state transition before writing JSX:

| Moment | Stored value | Rendered label |
|---|---:|---|
| Initial render | `0` | `Completed steps: 0` |
| After click | `1` | `Completed steps: 1` |

The click stores the next value. React then renders the component again, and the label must
read the current stored value. No true/false branch is needed.

## Your task

The `useState` import, component boundary, tests, and test environment are supplied. Edit
`src/components/training/first-step-button.tsx` and replace `return null`.

The component must:

- declare one numeric state value initialized to `0`
- use a named local click handler
- store `1` when the button is clicked
- render a button with `type="button"`
- derive the exact label `Completed steps: <current value>` from state

## Scope

Edit only `src/components/training/first-step-button.tsx`.

- Keep the supplied import and component name unchanged.
- Choose clear names for the state pair and handler.
- Use a direct one-way update to `1`; do not add incrementing behavior.
- Do not add props, callbacks, conditional expressions, additional state, effects, lists,
  forms, async work, styling, helpers, child components, or test changes.
- Tests are fully supplied so this task measures state retrieval only.

## Start and verify

1. Run the focused tests and read both initial failures.
2. Declare the numeric state at the top level of the component.
3. Add the handler that requests the transition to `1`.
4. Render the button and embed the current state value in its label.

```sh
npx vitest run exercises/react/016-retrieve-local-state
npm run typecheck
npx vitest run --exclude 'exercises/typescript/006-protect-worker-capacity/**'
```

The separate active TypeScript task is excluded from the stable suite until it is complete.

## Documentation

Try retrieving the pattern yourself first. If needed afterward:

- [React: State—A Component's Memory](https://react.dev/learn/state-a-components-memory)
- [React: `useState`](https://react.dev/reference/react/useState)
- [Bulletproof React: Project Structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)

## Done when

- Both focused tests, typechecking, and the stable suite pass.
- The initial label reads the initial numeric state.
- Clicking stores `1`, triggers another render, and updates the derived label.
- No conditional branch or excluded behavior is introduced.

Request review and disclose any documentation, hints, prior exercise reference, search, or
outside AI help.
