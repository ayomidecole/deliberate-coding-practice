# REACT-020: Compose Features in the App Layer

Status: complete

Target time: 20–30 minutes

Primary capability: compose independent features at the application boundary

## Goal

Build the application component that places two supplied, independently stateful features
on one customer-workspace screen.

This is the first `src/app` exercise. The app selects and arranges features; it does not
take ownership of their internal workflow state.

## Mental model

The dependency and ownership tree is:

```text
src/app/App
├── src/features/orders/RevealDeliveryNoteFeature
│   └── src/components/orders/DeliveryNoteDisclosure
└── src/features/feedback/RateExperienceFeature
    └── src/components/feedback/RatingPicker
```

Each arrow is an import from a higher-level owner to a lower-level dependency:

```text
components <- features <- app
```

The app owns the page heading and which features appear. Each feature retains its own state,
transitions, and controlled-component wiring. The features do not import each other.

## Your task

Both complete features, their components, direct imports, the app boundary, tests, and test
environment are supplied. Edit `src/app/app.tsx` and replace `return null`.

The app must:

- render a semantic `main` element
- render the exact level-one heading `Customer workspace`
- render `RevealDeliveryNoteFeature`
- render `RateExperienceFeature`
- leave both features responsible for their own behavior

## Scope

Edit only `src/app/app.tsx`.

- Keep the supplied direct imports and `App` name unchanged.
- Render each feature as a JSX component; do not call either as a regular function.
- Do not add app state, props, callbacks, conditions, lists, routing, providers, navigation,
  styling, API code, stores, hooks, helpers, or barrel exports.
- Do not change the supplied features, components, or tests.
- Tests are fully supplied because this task introduces the app ownership boundary.

## Start and verify

1. Run the focused tests and inspect the initial failures.
2. Return the semantic app container and heading.
3. Compose both imported feature entries beneath the heading.
4. Verify that their interactions remain independent.

```sh
npx vitest run exercises/react/01-fundamentals/020-compose-features-in-app
npm run typecheck
npx vitest run --exclude 'exercises/typescript/006-protect-worker-capacity/**'
```

The separate active TypeScript task is excluded from the stable suite until it is complete.

## Documentation

- [React: Importing and Exporting Components](https://react.dev/learn/importing-and-exporting-components)
- [React: Your First Component](https://react.dev/learn/your-first-component)
- [Bulletproof React: Project Structure](https://github.com/alan2207/bulletproof-react/blob/master/docs/project-structure.md)

## Done when

- Both focused tests, typechecking, and the stable suite pass.
- The app renders both feature entry points beneath its heading.
- Each feature still updates only its own workflow output.
- Dependencies point from app to features to components, with no cross-feature import.
- No excluded behavior or test changes are introduced.

Request review and disclose any documentation, hints, prior exercise reference, search, or
outside AI help.
