# REACT-019: Retrieve Stateful Feature Composition

Status: complete

Target time: 25–35 minutes

Primary capability: independently own payload-driven state in a feature

## Goal

Build a feedback feature that stores the rating reported by a supplied controlled component.

Reusable rating markup remains in `src/components`; the workflow's current rating belongs
to its entry under `src/features`.

## Mental model

The feature owns the source of truth. The controlled component displays the current value
and reports the user's next value:

```text
RateExperienceFeature
  currentRating --------------------> RatingPicker
  stores nextRating <--- onRate(nextRating)
```

Model each transition explicitly:

| Event | Stored value after the event | Rendered text |
|---|---:|---|
| Initial render | `0` | `Current rating: 0` |
| Child reports `2` | `2` | `Current rating: 2` |
| Child later reports `1` | `1` | `Current rating: 1` |

The callback parameter is the requested next value. The feature stores it, React renders
again, and the new value travels back down through props.

## Your task

The controlled component, imports, feature boundary, tests, and test environment are
supplied. Edit `src/features/feedback/rate-experience-feature.tsx` and replace `return null`.

The feature must:

- declare one numeric state value initialized to `0`
- define a named handler that accepts the next rating as a `number`
- store that handler parameter as the next state
- render the supplied `RatingPicker`
- pass the current state through `currentRating`
- pass the handler reference through `onRate`

## Scope

Edit only `src/features/feedback/rate-experience-feature.tsx`.

- Keep the supplied direct imports and feature name unchanged.
- Choose domain-specific names for the state pair, handler, and handler parameter.
- Do not duplicate the rating text or buttons in the feature.
- Do not change the controlled component or tests.
- Do not add props, validation, conditions, additional state, effects, lists, forms, async
  work, styling, hooks, stores, API code, app code, helpers, or barrel exports.
- Tests are fully supplied so this task measures feature-composition retrieval.

## Start and verify

1. Run the focused tests and inspect the initial failures.
2. Read the supplied component's value and callback prop types.
3. Declare feature-owned numeric state and the typed payload handler.
4. Render the component and connect both props.

```sh
npx vitest run exercises/react/019-retrieve-stateful-feature
npm run typecheck
npx vitest run --exclude 'exercises/typescript/006-protect-worker-capacity/**'
```

The separate active TypeScript task is excluded from the stable suite until it is complete.

## Documentation

Try retrieving the pattern before consulting the references:

- [React: Sharing State Between Components](https://react.dev/learn/sharing-state-between-components)
- [React: State—A Component's Memory](https://react.dev/learn/state-a-components-memory)
- [React: Passing Props to a Component](https://react.dev/learn/passing-props-to-a-component)
- [Bulletproof React: Project Structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)

## Done when

- Both focused tests, typechecking, and the stable suite pass.
- The controlled component initially receives `0`.
- Each rating intent is stored and returned to the component as its current value.
- State and transition ownership remain in the feature; markup remains in the component.
- No excluded behavior or test changes are introduced.

Request review and disclose any documentation, hints, prior exercise reference, search, or
outside AI help.
