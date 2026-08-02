# REACT-017: Integrate State and Conditional UI

Status: complete

Target time: 25–35 minutes

Primary capability: use local state to control whether UI exists

## Goal

Build a delivery-note disclosure that reveals a separate paragraph after a button click.

The component belongs under `src/components/orders`. It owns only this local disclosure;
feature orchestration, persistence, and shared state remain outside the task.

## Mental model

Model the state and its rendered consequence before coding:

| `isRevealed` | Button | Delivery-note paragraph |
|---|---|---|
| `false` | visible | absent |
| `true` | visible | present |

The click creates a one-way transition from `false` to `true`. React renders again, and a
conditional expression decides whether the paragraph exists. The button label does not
change, so there is only one conditional output to reason about.

## Your task

The `useState` import, component boundary, wrapper, tests, and test environment are supplied.
Edit `src/components/orders/delivery-note-disclosure.tsx`.

The component must:

- declare one boolean state value initialized to `false`
- use a named local click handler that stores `true`
- render a button with `type="button"`
- keep the exact button label `Reveal delivery note`
- render a paragraph with the exact text `Signature required at delivery.` only when the
  state is `true`
- use a ternary expression whose false branch is `null`

## Scope

Edit only `src/components/orders/delivery-note-disclosure.tsx`.

- Keep the supplied import, component name, and wrapper unchanged.
- Choose clear names for the state pair and handler.
- Do not conditionally change the button label.
- Do not add props, callbacks, additional state, effects, lists, forms, async work, styling,
  helpers, child components, or test changes.
- Tests remain fully supplied because this task measures integration of two retrieved
  capabilities; test authorship will increase separately.

## Start and verify

1. Run the focused tests and inspect the initial failures.
2. Declare the boolean state at the top level of the component.
3. Add and connect the one-way click handler.
4. Add the state-controlled paragraph inside the supplied wrapper.

```sh
npx vitest run exercises/react/017-integrate-state-and-condition
npm run typecheck
npx vitest run --exclude 'exercises/typescript/006-protect-worker-capacity/**'
```

The separate active TypeScript task is excluded from the stable suite until it is complete.

## Documentation

Try retrieving both patterns first. If needed afterward:

- [React: State—A Component's Memory](https://react.dev/learn/state-a-components-memory)
- [React: Conditional Rendering](https://react.dev/learn/conditional-rendering)
- [Bulletproof React: Project Structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)

## Done when

- Both focused tests, typechecking, and the stable suite pass.
- The paragraph is absent for the initial state.
- Clicking stores `true`, triggers another render, and makes the paragraph exist.
- The component contains one source of truth and no excluded behavior.

Request review and disclose any documentation, hints, prior exercise reference, search, or
outside AI help.
